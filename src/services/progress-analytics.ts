// ============================================
// Progress Analytics — Deep metrics for the Progress page
// ============================================

import { getTopics, getConceptsByTopic, getProblemsByTopic, getPatterns, getProblems } from '@services/data-service';
import { getProgress, getStats } from '@store/progress-store';
import type { Problem, ProblemProgress } from '@/types';

// ── Types ──

export interface WeeklyActivity {
  weekLabel: string;       // "Jan 20" (Monday date)
  weekStart: string;       // YYYY-MM-DD
  problemsSolved: number;
  conceptsLearned: number;
  daysActive: number;
}

export interface PatternGap {
  name: string;
  frequency: 'high' | 'medium' | 'low';
  total: number;
  solved: number;
  gap: number;
  percent: number;
}

export interface ReviewItem {
  problemId: string;
  title: string;
  url: string;
  pattern: string;
  difficulty: string;
  reason: 'revisit' | 'stale' | 'attempted';
  daysSince: number; // days since last interaction
  topicId: string;
}

export interface DifficultyCalibration {
  tooEasy: number;
  justRight: number;
  tooHard: number;
  total: number;           // total with feedback
  suggestion: 'level-up' | 'on-track' | 'ease-up' | 'no-data';
}

export interface Milestone {
  id: string;
  icon: string;
  title: string;
  description: string;
  achieved: boolean;
  progress?: number;       // 0-100 for partial
  target?: number;
  current?: number;
}

export interface TopicDeepDive {
  id: string;
  title: string;
  order: number;
  concepts: { total: number; done: number; percent: number };
  problems: {
    total: number;
    solved: number;
    attempted: number;
    revisit: number;
    notStarted: number;
    percent: number;
  };
  overallPercent: number;
  status: 'not-started' | 'in-progress' | 'strong' | 'complete';
  isStalling: boolean;     // started but <30% and no activity in 7+ days
}

export interface SolveTimeStat {
  avgMinutes: number;
  totalMinutes: number;
  count: number;
  byDifficulty: Record<string, { avg: number; count: number }>;
}

// ── Weekly Activity (bar chart data) ──

export function getWeeklyActivity(weeks = 8): WeeklyActivity[] {
  const stats = getStats();
  const progress = getProgress();
  const studySet = new Set(stats.studyDays);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Collect all solved/completed timestamps
  const solvedDates: string[] = [];
  const learnedDates: string[] = [];

  for (const tp of Object.values(progress.topics)) {
    for (const p of Object.values(tp.problems)) {
      if (p.status === 'solved' && p.solvedAt) {
        solvedDates.push(p.solvedAt.split('T')[0]);
      }
    }
    for (const c of Object.values(tp.concepts)) {
      if (c.completed && c.completedAt) {
        learnedDates.push(c.completedAt.split('T')[0]);
      }
    }
  }

  // Build week buckets going back N weeks
  const result: WeeklyActivity[] = [];

  for (let w = weeks - 1; w >= 0; w--) {
    const monday = new Date(today);
    monday.setDate(monday.getDate() - monday.getDay() + 1 - w * 7); // align to Monday
    if (monday.getDay() === 0) monday.setDate(monday.getDate() - 6); // fix Sunday

    // Ensure we actually align to Monday
    const dayOfWeek = monday.getDay();
    if (dayOfWeek !== 1) {
      const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
      monday.setDate(monday.getDate() + diff);
    }

    const weekDates: string[] = [];
    for (let d = 0; d < 7; d++) {
      const date = new Date(monday);
      date.setDate(date.getDate() + d);
      weekDates.push(fmt(date));
    }

    const weekStart = fmt(monday);
    const label = monday.toLocaleDateString('en', { month: 'short', day: 'numeric' });

    result.push({
      weekLabel: label,
      weekStart,
      problemsSolved: solvedDates.filter(d => weekDates.includes(d)).length,
      conceptsLearned: learnedDates.filter(d => weekDates.includes(d)).length,
      daysActive: weekDates.filter(d => studySet.has(d)).length,
    });
  }

  return result;
}

// ── Pattern Gap Analysis ──

export function getPatternGaps(): PatternGap[] {
  const patterns = getPatterns();
  const progress = getProgress();
  const topics = getTopics();

  // Build solved problem IDs set
  const solvedIds = new Set<string>();
  for (const topic of topics) {
    const tp = progress.topics[topic.id];
    if (!tp) continue;
    for (const [pid, pp] of Object.entries(tp.problems)) {
      if (pp.status === 'solved') solvedIds.add(pid);
    }
  }

  return patterns
    .map(pattern => {
      const total = pattern.problems.length;
      const solved = pattern.problems.filter(pid => solvedIds.has(pid)).length;
      return {
        name: pattern.name,
        frequency: pattern.frequency,
        total,
        solved,
        gap: total - solved,
        percent: total > 0 ? Math.round((solved / total) * 100) : 0,
      };
    })
    .filter(p => p.total > 0)
    .sort((a, b) => {
      // Sort by: frequency priority first, then by gap descending
      const freqOrder = { high: 0, medium: 1, low: 2 };
      const fDiff = freqOrder[a.frequency] - freqOrder[b.frequency];
      if (fDiff !== 0) return fDiff;
      return b.gap - a.gap;
    });
}

// ── Review Queue ──

export function getReviewQueue(): ReviewItem[] {
  const progress = getProgress();
  const topics = getTopics();
  const now = Date.now();
  const items: ReviewItem[] = [];

  // Build problem lookup
  const allProblems = getProblems();
  const problemMap = new Map<string, Problem>();
  for (const p of allProblems) problemMap.set(p.id, p);

  for (const topic of topics) {
    const tp = progress.topics[topic.id];
    if (!tp) continue;

    for (const [pid, pp] of Object.entries(tp.problems)) {
      const problem = problemMap.get(pid);
      if (!problem) continue;

      let reason: ReviewItem['reason'] | null = null;
      let daysSince = 0;

      if (pp.status === 'revisit') {
        reason = 'revisit';
        daysSince = pp.solvedAt
          ? Math.floor((now - new Date(pp.solvedAt).getTime()) / 86400000)
          : 0;
      } else if (pp.status === 'solved' && pp.solvedAt) {
        daysSince = Math.floor((now - new Date(pp.solvedAt).getTime()) / 86400000);
        if (daysSince >= 14) {
          reason = 'stale';
        }
      } else if (pp.status === 'attempted') {
        reason = 'attempted';
        daysSince = pp.solvedAt
          ? Math.floor((now - new Date(pp.solvedAt).getTime()) / 86400000)
          : 999;
      }

      if (reason) {
        items.push({
          problemId: pid,
          title: problem.title,
          url: problem.url,
          pattern: problem.pattern || '',
          difficulty: problem.difficulty,
          reason,
          daysSince,
          topicId: topic.id,
        });
      }
    }
  }

  // Sort: revisit first, then stale by days desc, then attempted
  const reasonOrder = { revisit: 0, stale: 1, attempted: 2 };
  return items.sort((a, b) => {
    const rDiff = reasonOrder[a.reason] - reasonOrder[b.reason];
    if (rDiff !== 0) return rDiff;
    return b.daysSince - a.daysSince;
  });
}

// ── Difficulty Calibration ──

export function getDifficultyCalibration(): DifficultyCalibration {
  const progress = getProgress();
  let tooEasy = 0;
  let justRight = 0;
  let tooHard = 0;

  for (const tp of Object.values(progress.topics)) {
    for (const pp of Object.values(tp.problems)) {
      if (pp.difficulty === 'too-easy') tooEasy++;
      else if (pp.difficulty === 'just-right') justRight++;
      else if (pp.difficulty === 'too-hard') tooHard++;
    }
  }

  const total = tooEasy + justRight + tooHard;
  let suggestion: DifficultyCalibration['suggestion'] = 'no-data';

  if (total >= 5) {
    const easyRatio = tooEasy / total;
    const hardRatio = tooHard / total;
    if (easyRatio > 0.5) suggestion = 'level-up';
    else if (hardRatio > 0.5) suggestion = 'ease-up';
    else suggestion = 'on-track';
  }

  return { tooEasy, justRight, tooHard, total, suggestion };
}

// ── Solve Time Stats ──

export function getSolveTimeStats(): SolveTimeStat {
  const progress = getProgress();
  const allProblems = getProblems();
  const problemMap = new Map<string, Problem>();
  for (const p of allProblems) problemMap.set(p.id, p);

  let totalMinutes = 0;
  let count = 0;
  const byDifficulty: Record<string, { total: number; count: number }> = {
    easy: { total: 0, count: 0 },
    medium: { total: 0, count: 0 },
    hard: { total: 0, count: 0 },
  };

  for (const tp of Object.values(progress.topics)) {
    for (const [pid, pp] of Object.entries(tp.problems)) {
      if (pp.timeSpent && pp.timeSpent > 0) {
        totalMinutes += pp.timeSpent;
        count++;
        const problem = problemMap.get(pid);
        if (problem && byDifficulty[problem.difficulty]) {
          byDifficulty[problem.difficulty].total += pp.timeSpent;
          byDifficulty[problem.difficulty].count++;
        }
      }
    }
  }

  const result: Record<string, { avg: number; count: number }> = {};
  for (const [diff, data] of Object.entries(byDifficulty)) {
    result[diff] = {
      avg: data.count > 0 ? Math.round(data.total / data.count) : 0,
      count: data.count,
    };
  }

  return {
    avgMinutes: count > 0 ? Math.round(totalMinutes / count) : 0,
    totalMinutes,
    count,
    byDifficulty: result,
  };
}

// ── Topic Deep Dive ──

export function getTopicDeepDive(): TopicDeepDive[] {
  const topics = getTopics();
  const progress = getProgress();
  const now = Date.now();

  return topics.map(topic => {
    const concepts = getConceptsByTopic(topic.id);
    const problems = getProblemsByTopic(topic.id);
    const tp = progress.topics[topic.id];

    const conceptsDone = tp
      ? Object.values(tp.concepts).filter(c => c.completed).length
      : 0;

    let solved = 0, attempted = 0, revisit = 0, notStarted = 0;
    let latestActivity: number | null = null;

    if (tp) {
      for (const pp of Object.values(tp.problems) as ProblemProgress[]) {
        if (pp.status === 'solved') {
          solved++;
          if (pp.solvedAt) {
            const t = new Date(pp.solvedAt).getTime();
            if (!latestActivity || t > latestActivity) latestActivity = t;
          }
        }
        else if (pp.status === 'revisit') revisit++;
        else if (pp.status === 'attempted') attempted++;
        else notStarted++;
      }

      // Also check concept timestamps for latest activity
      for (const c of Object.values(tp.concepts)) {
        if (c.completedAt) {
          const t = new Date(c.completedAt).getTime();
          if (!latestActivity || t > latestActivity) latestActivity = t;
        }
      }
    }

    // Remaining not-started = total problems minus tracked ones
    const trackedProblems = solved + attempted + revisit + notStarted;
    const untrackedProblems = Math.max(0, problems.length - trackedProblems);
    notStarted += untrackedProblems;

    const conceptPercent = concepts.length > 0
      ? Math.round((conceptsDone / concepts.length) * 100) : 0;
    const problemPercent = problems.length > 0
      ? Math.round((solved / problems.length) * 100) : 0;

    const total = concepts.length + problems.length;
    const done = conceptsDone + solved;
    const overallPercent = total > 0 ? Math.round((done / total) * 100) : 0;

    let status: TopicDeepDive['status'] = 'not-started';
    if (overallPercent === 100) status = 'complete';
    else if (overallPercent >= 50) status = 'strong';
    else if (overallPercent > 0) status = 'in-progress';

    // Stalling: started, <30%, no activity in 7+ days
    const daysSinceActivity = latestActivity
      ? Math.floor((now - latestActivity) / 86400000)
      : Infinity;
    const isStalling = overallPercent > 0 && overallPercent < 30 && daysSinceActivity >= 7;

    return {
      id: topic.id,
      title: topic.title,
      order: topic.order,
      concepts: { total: concepts.length, done: conceptsDone, percent: conceptPercent },
      problems: {
        total: problems.length,
        solved,
        attempted,
        revisit,
        notStarted,
        percent: problemPercent,
      },
      overallPercent,
      status,
      isStalling,
    };
  }).sort((a, b) => a.order - b.order);
}

// ── Milestones ──

export function getMilestones(): Milestone[] {
  const stats = getStats();
  const progress = getProgress();
  const topics = getTopics();
  const patterns = getPatterns();

  const totalSolved = stats.totalProblemsSolved;
  const totalConcepts = stats.totalConceptsCompleted;
  const streak = Math.max(stats.currentStreak, stats.longestStreak);

  // Count complete topics
  let completedTopics = 0;
  for (const topic of topics) {
    const concepts = getConceptsByTopic(topic.id);
    const problems = getProblemsByTopic(topic.id);
    const tp = progress.topics[topic.id];
    if (!tp) continue;
    const cd = Object.values(tp.concepts).filter(c => c.completed).length;
    const ps = Object.values(tp.problems).filter(p => p.status === 'solved').length;
    if (cd === concepts.length && ps === problems.length && concepts.length + problems.length > 0) {
      completedTopics++;
    }
  }

  // Count mastered patterns
  const solvedIds = new Set<string>();
  for (const tp of Object.values(progress.topics)) {
    for (const [pid, pp] of Object.entries(tp.problems)) {
      if (pp.status === 'solved') solvedIds.add(pid);
    }
  }
  let masteredPatterns = 0;
  for (const pat of patterns) {
    if (pat.problems.length > 0 && pat.problems.every(pid => solvedIds.has(pid))) {
      masteredPatterns++;
    }
  }

  // Check difficulty balance
  let hasEasy = false, hasMedium = false, hasHard = false;
  const allProblems = getProblems();
  const problemMap = new Map<string, Problem>();
  for (const p of allProblems) problemMap.set(p.id, p);
  for (const pid of solvedIds) {
    const p = problemMap.get(pid);
    if (!p) continue;
    if (p.difficulty === 'easy') hasEasy = true;
    if (p.difficulty === 'medium') hasMedium = true;
    if (p.difficulty === 'hard') hasHard = true;
  }

  const milestones: Milestone[] = [
    {
      id: 'first-problem',
      icon: '🎉',
      title: 'First Blood',
      description: 'Solved your first problem',
      achieved: totalSolved >= 1,
      current: Math.min(totalSolved, 1),
      target: 1,
    },
    {
      id: '10-problems',
      icon: '🔟',
      title: 'Getting Started',
      description: 'Solve 10 problems',
      achieved: totalSolved >= 10,
      current: Math.min(totalSolved, 10),
      target: 10,
      progress: Math.min(100, Math.round((totalSolved / 10) * 100)),
    },
    {
      id: '50-problems',
      icon: '🏅',
      title: 'Problem Crusher',
      description: 'Solve 50 problems',
      achieved: totalSolved >= 50,
      current: Math.min(totalSolved, 50),
      target: 50,
      progress: Math.min(100, Math.round((totalSolved / 50) * 100)),
    },
    {
      id: '100-problems',
      icon: '💯',
      title: 'Centurion',
      description: 'Solve 100 problems',
      achieved: totalSolved >= 100,
      current: Math.min(totalSolved, 100),
      target: 100,
      progress: Math.min(100, Math.round((totalSolved / 100) * 100)),
    },
    {
      id: 'first-concept',
      icon: '📖',
      title: 'Curious Mind',
      description: 'Learn your first concept',
      achieved: totalConcepts >= 1,
      current: Math.min(totalConcepts, 1),
      target: 1,
    },
    {
      id: '50-concepts',
      icon: '📚',
      title: 'Knowledge Seeker',
      description: 'Learn 50 concepts',
      achieved: totalConcepts >= 50,
      current: Math.min(totalConcepts, 50),
      target: 50,
      progress: Math.min(100, Math.round((totalConcepts / 50) * 100)),
    },
    {
      id: '7-streak',
      icon: '🔥',
      title: 'Week Warrior',
      description: 'Achieve a 7-day streak',
      achieved: streak >= 7,
      current: Math.min(streak, 7),
      target: 7,
      progress: Math.min(100, Math.round((streak / 7) * 100)),
    },
    {
      id: '30-streak',
      icon: '⚡',
      title: 'Unstoppable',
      description: 'Achieve a 30-day streak',
      achieved: streak >= 30,
      current: Math.min(streak, 30),
      target: 30,
      progress: Math.min(100, Math.round((streak / 30) * 100)),
    },
    {
      id: 'topic-complete',
      icon: '✅',
      title: 'Topic Master',
      description: 'Complete an entire topic',
      achieved: completedTopics >= 1,
      current: completedTopics,
      target: 1,
    },
    {
      id: 'pattern-mastered',
      icon: '🎯',
      title: 'Pattern Pro',
      description: 'Master all problems in a pattern',
      achieved: masteredPatterns >= 1,
      current: masteredPatterns,
      target: 1,
    },
    {
      id: 'balanced',
      icon: '⚖️',
      title: 'Balanced Diet',
      description: 'Solve Easy, Medium, and Hard problems',
      achieved: hasEasy && hasMedium && hasHard,
      current: (hasEasy ? 1 : 0) + (hasMedium ? 1 : 0) + (hasHard ? 1 : 0),
      target: 3,
      progress: Math.round(((hasEasy ? 1 : 0) + (hasMedium ? 1 : 0) + (hasHard ? 1 : 0)) / 3 * 100),
    },
    {
      id: 'study-days-30',
      icon: '📅',
      title: 'Consistent',
      description: 'Study on 30 different days',
      achieved: stats.studyDays.length >= 30,
      current: Math.min(stats.studyDays.length, 30),
      target: 30,
      progress: Math.min(100, Math.round((stats.studyDays.length / 30) * 100)),
    },
  ];

  return milestones;
}

// ── Helpers ──

function fmt(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}
