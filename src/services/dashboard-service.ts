// ============================================
// Dashboard Service — Computed metrics for the dashboard
// ============================================

import { getTopics, getConceptsByTopic, getProblemsByTopic, getPatterns, getDataStats, getDifficultyDistribution } from '@services/data-service';
import { getProgress, getStats } from '@store/progress-store';
import type { Difficulty } from '@/types';

// ── Types ──

export interface HeroStats {
  streak: number;
  longestStreak: number;
  topicsCovered: number;
  topicsTotal: number;
  conceptsDone: number;
  conceptsTotal: number;
  problemsSolved: number;
  problemsTotal: number;
  solvedByDifficulty: Record<Difficulty, number>;
  catalogByDifficulty: Record<Difficulty, number>;
}

export interface TopicMastery {
  id: string;
  title: string;
  order: number;
  conceptsDone: number;
  conceptsTotal: number;
  problemsSolved: number;
  problemsTotal: number;
  percent: number;
  status: 'not-started' | 'in-progress' | 'strong' | 'complete';
}

export interface PatternCoverage {
  name: string;
  solved: number;
  total: number;
  percent: number;
  frequency: 'high' | 'medium' | 'low';
}

export interface HeatmapDay {
  date: string; // YYYY-MM-DD
  studied: boolean;
  isToday: boolean;
  isFuture: boolean;
}

export interface SmartAction {
  icon: string;
  title: string;
  description: string;
  href: string;
  priority: number;
}

export interface CompanyReadiness {
  id: string;
  name: string;
  logo: string;
  tier: string;
  solved: number;
  total: number;
  percent: number;
}

// ── Hero Stats ──

export function getHeroStats(): HeroStats {
  const stats = getStats();
  const dataStats = getDataStats();
  const progress = getProgress();
  const topics = getTopics();
  const catalog = getDifficultyDistribution();

  // Count topics with any progress
  let topicsCovered = 0;
  for (const topic of topics) {
    const tp = progress.topics[topic.id];
    if (tp) {
      const hasConcepts = Object.values(tp.concepts).some(c => c.completed);
      const hasProblems = Object.values(tp.problems).some(p => p.status === 'solved');
      if (hasConcepts || hasProblems) topicsCovered++;
    }
  }

  // Count solved by difficulty
  const solvedByDifficulty: Record<Difficulty, number> = { easy: 0, medium: 0, hard: 0 };
  for (const topic of topics) {
    const tp = progress.topics[topic.id];
    if (!tp) continue;
    const topicProblems = getProblemsByTopic(topic.id);
    for (const problem of topicProblems) {
      if (tp.problems[problem.id]?.status === 'solved') {
        solvedByDifficulty[problem.difficulty]++;
      }
    }
  }

  return {
    streak: stats.currentStreak,
    longestStreak: stats.longestStreak,
    topicsCovered,
    topicsTotal: dataStats.topicCount,
    conceptsDone: stats.totalConceptsCompleted,
    conceptsTotal: dataStats.conceptCount,
    problemsSolved: stats.totalProblemsSolved,
    problemsTotal: dataStats.problemCount,
    solvedByDifficulty,
    catalogByDifficulty: catalog,
  };
}

// ── Topic Mastery ──

export function getTopicMastery(): TopicMastery[] {
  const topics = getTopics();
  const progress = getProgress();

  return topics.map(topic => {
    const concepts = getConceptsByTopic(topic.id);
    const problems = getProblemsByTopic(topic.id);
    const tp = progress.topics[topic.id];

    const conceptsDone = tp
      ? Object.values(tp.concepts).filter(c => c.completed).length
      : 0;
    const problemsSolved = tp
      ? Object.values(tp.problems).filter(p => p.status === 'solved').length
      : 0;

    const total = concepts.length + problems.length;
    const done = conceptsDone + problemsSolved;
    const percent = total > 0 ? Math.round((done / total) * 100) : 0;

    let status: TopicMastery['status'] = 'not-started';
    if (percent === 100) status = 'complete';
    else if (percent >= 50) status = 'strong';
    else if (percent > 0) status = 'in-progress';

    return {
      id: topic.id,
      title: topic.title,
      order: topic.order,
      conceptsDone,
      conceptsTotal: concepts.length,
      problemsSolved,
      problemsTotal: problems.length,
      percent,
      status,
    };
  }).sort((a, b) => a.order - b.order);
}

// ── Pattern Coverage ──

export function getPatternCoverage(): PatternCoverage[] {
  const patterns = getPatterns();
  const progress = getProgress();
  const topics = getTopics();

  // Build a set of all solved problem IDs
  const solvedIds = new Set<string>();
  for (const topic of topics) {
    const tp = progress.topics[topic.id];
    if (!tp) continue;
    for (const [pid, pp] of Object.entries(tp.problems)) {
      if (pp.status === 'solved') solvedIds.add(pid);
    }
  }

  return patterns
    .filter(p => p.frequency === 'high' || p.frequency === 'medium')
    .slice(0, 12)
    .map(pattern => {
      const solved = pattern.problems.filter(id => solvedIds.has(id)).length;
      const total = pattern.problems.length;
      return {
        name: pattern.name,
        solved,
        total,
        percent: total > 0 ? Math.round((solved / total) * 100) : 0,
        frequency: pattern.frequency,
      };
    })
    .sort((a, b) => b.total - a.total);
}

// ── Heatmap Data ──

export function getHeatmapData(weeks = 16): HeatmapDay[] {
  const stats = getStats();
  const studySet = new Set(stats.studyDays);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayStr = formatDate(today);

  // Start from `weeks` weeks ago, aligned to Monday
  const start = new Date(today);
  start.setDate(start.getDate() - (weeks * 7) + 1);
  // Align to Monday (1=Mon, 0=Sun → shift Sun to 6)
  const dayOfWeek = (start.getDay() + 6) % 7; // 0=Mon
  start.setDate(start.getDate() - dayOfWeek);

  const days: HeatmapDay[] = [];
  const cursor = new Date(start);

  while (cursor <= today || days.length % 7 !== 0) {
    const dateStr = formatDate(cursor);
    const isFuture = cursor > today;
    days.push({
      date: dateStr,
      studied: studySet.has(dateStr),
      isToday: dateStr === todayStr,
      isFuture,
    });
    cursor.setDate(cursor.getDate() + 1);
    // Safety: don't go more than 7 days past today
    if (cursor.getTime() > today.getTime() + 7 * 86400000) break;
  }

  return days;
}

function formatDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

// ── Smart Actions ──

export function getSmartActions(): SmartAction[] {
  const hero = getHeroStats();
  const mastery = getTopicMastery();
  const patterns = getPatternCoverage();
  const actions: SmartAction[] = [];

  // Brand new user
  if (hero.conceptsDone === 0 && hero.problemsSolved === 0) {
    actions.push({
      icon: '🚀',
      title: 'Start Your Journey',
      description: 'Begin with Prerequisites to build a solid CS foundation',
      href: '#/topics/prerequisites',
      priority: 100,
    });
    actions.push({
      icon: '📖',
      title: 'Browse the Roadmap',
      description: '18 topics from basics to advanced — see the full plan',
      href: '#/topics',
      priority: 90,
    });
    actions.push({
      icon: '🗺️',
      title: 'Read the Playbook',
      description: 'Study strategies, interview tactics, and success stories from FAANG engineers',
      href: '#/playbook',
      priority: 80,
    });
    return actions;
  }

  // Returning after a gap (last study > 2 days ago)
  const stats = getStats();
  if (stats.lastStudyDate) {
    const daysSince = Math.floor((Date.now() - new Date(stats.lastStudyDate).getTime()) / 86400000);
    if (daysSince >= 3) {
      actions.push({
        icon: '🔄',
        title: 'Welcome Back!',
        description: `It's been ${daysSince} days — pick up where you left off with a review`,
        href: '#/progress',
        priority: 95,
      });
    }
  }

  // Find weakest topic that's been started but <30%
  const weakTopics = mastery
    .filter(t => t.status === 'in-progress' && t.percent < 30 && t.percent > 0);
  if (weakTopics.length > 0) {
    const weak = weakTopics[0];
    actions.push({
      icon: '📚',
      title: `Continue: ${weak.title}`,
      description: `${weak.percent}% done — keep building this foundation`,
      href: `#/topics/${weak.id}`,
      priority: 85,
    });
  }

  // Suggest next unstarted topic
  const nextUnstarted = mastery.find(t => t.status === 'not-started');
  if (nextUnstarted) {
    actions.push({
      icon: '🆕',
      title: `Start: ${nextUnstarted.title}`,
      description: 'Next topic in your learning path — ready when you are',
      href: `#/topics/${nextUnstarted.id}`,
      priority: 70,
    });
  }

  // Difficulty balance check
  if (hero.problemsSolved > 5) {
    const easyRatio = hero.solvedByDifficulty.easy / hero.problemsSolved;
    if (easyRatio > 0.7) {
      actions.push({
        icon: '⬆️',
        title: 'Level Up to Medium',
        description: `${Math.round(easyRatio * 100)}% of your solves are Easy — time to tackle Medium problems`,
        href: '#/problems',
        priority: 80,
      });
    }
  }

  // Weak pattern
  const weakPattern = patterns.find(p => p.frequency === 'high' && p.solved === 0);
  if (weakPattern) {
    actions.push({
      icon: '🔷',
      title: `Learn: ${weakPattern.name}`,
      description: `High-frequency interview pattern with ${weakPattern.total} problems — you haven't started yet`,
      href: '#/patterns',
      priority: 75,
    });
  }

  // Always offer practice
  actions.push({
    icon: '💻',
    title: 'Practice Problems',
    description: `${hero.problemsSolved}/${hero.problemsTotal} solved — keep the momentum going`,
    href: '#/problems',
    priority: 50,
  });

  // Sort by priority and take top 3
  return actions.sort((a, b) => b.priority - a.priority).slice(0, 3);
}

// ── Company Readiness ──

interface CompanyProblemData {
  companies: Array<{
    id: string;
    name: string;
    logo: string;
    tier: string;
    problems: Array<{
      leetcodeId: number;
      title: string;
    }>;
  }>;
}

import companyProblemsJsonDash from '../data/company-problems.json';

let companyDataCache: CompanyProblemData | null = null;

export async function loadCompanyData(): Promise<CompanyProblemData | null> {
  if (companyDataCache) return companyDataCache;
  try {
    companyDataCache = companyProblemsJsonDash as unknown as CompanyProblemData;
    return companyDataCache;
  } catch {
    return null;
  }
}

export function computeCompanyReadiness(
  data: CompanyProblemData,
  solvedTitles: Set<string>
): CompanyReadiness[] {
  // Show top 5 by tier priority
  const tierOrder: Record<string, number> = { 's-tier': 0, 'tier-1': 1, 'tier-2': 2 };

  return data.companies
    .map(company => {
      const total = company.problems.length;
      const solved = company.problems.filter(p =>
        solvedTitles.has(p.title.toLowerCase())
      ).length;
      return {
        id: company.id,
        name: company.name,
        logo: company.logo,
        tier: company.tier,
        solved,
        total,
        percent: total > 0 ? Math.round((solved / total) * 100) : 0,
      };
    })
    .sort((a, b) => {
      // Tier first, then by percent descending
      const tierDiff = (tierOrder[a.tier] ?? 9) - (tierOrder[b.tier] ?? 9);
      if (tierDiff !== 0) return tierDiff;
      return b.percent - a.percent;
    })
    .slice(0, 5);
}

/**
 * Get all solved problem titles from progress store (lowercased)
 */
export function getSolvedProblemTitles(): Set<string> {
  const progress = getProgress();
  const topics = getTopics();
  const titles = new Set<string>();

  for (const topic of topics) {
    const tp = progress.topics[topic.id];
    if (!tp) continue;
    const problems = getProblemsByTopic(topic.id);
    for (const problem of problems) {
      if (tp.problems[problem.id]?.status === 'solved') {
        titles.add(problem.title.toLowerCase());
      }
    }
  }
  return titles;
}
