// ============================================
// Progress Store
// ============================================

import { storage } from '@utils/storage';
import type {
  UserProgress,
  TopicProgress,
  ProblemProgress,
  ProgressStats,
  UserPreferences,
} from '@/types';

const STORAGE_KEY = 'dsa-mastery-progress';

/**
 * Default user preferences
 */
const defaultPreferences: UserPreferences = {
  theme: 'dark',
  targetProblemsPerDay: 3,
  targetMinutesPerDay: 60,
  showDifficulty: true,
  showPatterns: true,
};

/**
 * Default progress stats
 */
const defaultStats: ProgressStats = {
  totalConceptsCompleted: 0,
  totalProblemsSolved: 0,
  currentStreak: 0,
  longestStreak: 0,
  lastStudyDate: null,
  studyDays: [],
};

/**
 * Create empty progress data
 */
function createEmptyProgress(): UserProgress {
  return {
    version: '1.0.0',
    updatedAt: new Date().toISOString(),
    topics: {},
    stats: { ...defaultStats },
    preferences: { ...defaultPreferences },
  };
}

/**
 * Get progress from storage
 */
export function getProgress(): UserProgress {
  return storage.get<UserProgress>(STORAGE_KEY, createEmptyProgress());
}

/**
 * Save progress to storage
 */
export function saveProgress(progress: UserProgress): void {
  progress.updatedAt = new Date().toISOString();
  storage.set(STORAGE_KEY, progress);
}

/**
 * Get topic progress
 */
export function getTopicProgress(topicId: string): TopicProgress | null {
  const progress = getProgress();
  return progress.topics[topicId] || null;
}

/**
 * Initialize topic progress if not exists
 */
export function initTopicProgress(topicId: string): TopicProgress {
  const progress = getProgress();
  
  if (!progress.topics[topicId]) {
    progress.topics[topicId] = {
      topicId,
      startedAt: new Date().toISOString(),
      completedAt: null,
      concepts: {},
      problems: {},
    };
    saveProgress(progress);
  }
  
  return progress.topics[topicId];
}

/**
 * Mark concept as complete
 */
export function markConceptComplete(topicId: string, conceptId: string, notes = ''): void {
  const progress = getProgress();
  initTopicProgress(topicId);
  
  const wasCompleted = progress.topics[topicId].concepts[conceptId]?.completed;
  
  progress.topics[topicId].concepts[conceptId] = {
    conceptId,
    completed: true,
    completedAt: new Date().toISOString(),
    notes,
  };
  
  // Update stats if newly completed
  if (!wasCompleted) {
    progress.stats.totalConceptsCompleted++;
    updateStudyStreak(progress);
  }
  
  saveProgress(progress);
}

/**
 * Mark concept as incomplete
 */
export function markConceptIncomplete(topicId: string, conceptId: string): void {
  const progress = getProgress();
  
  if (progress.topics[topicId]?.concepts[conceptId]?.completed) {
    progress.topics[topicId].concepts[conceptId].completed = false;
    progress.topics[topicId].concepts[conceptId].completedAt = null;
    progress.stats.totalConceptsCompleted = Math.max(0, progress.stats.totalConceptsCompleted - 1);
    saveProgress(progress);
  }
}

/**
 * Toggle concept completion
 */
export function toggleConceptComplete(topicId: string, conceptId: string): boolean {
  const progress = getProgress();
  const isCompleted = progress.topics[topicId]?.concepts[conceptId]?.completed;
  
  if (isCompleted) {
    markConceptIncomplete(topicId, conceptId);
    return false;
  } else {
    markConceptComplete(topicId, conceptId);
    return true;
  }
}

/**
 * Update problem progress
 */
export function updateProblemProgress(
  topicId: string,
  problemId: string,
  update: Partial<ProblemProgress>
): void {
  const progress = getProgress();
  initTopicProgress(topicId);
  
  const existing = progress.topics[topicId].problems[problemId] || {
    problemId,
    status: 'not-started',
    solvedAt: null,
    timeSpent: null,
    notes: '',
    difficulty: null,
  };
  
  const wasSolved = existing.status === 'solved';
  const willBeSolved = update.status === 'solved';
  
  progress.topics[topicId].problems[problemId] = {
    ...existing,
    ...update,
  };
  
  // Update stats
  if (!wasSolved && willBeSolved) {
    progress.stats.totalProblemsSolved++;
    updateStudyStreak(progress);
  } else if (wasSolved && !willBeSolved && update.status !== undefined) {
    progress.stats.totalProblemsSolved = Math.max(0, progress.stats.totalProblemsSolved - 1);
  }
  
  saveProgress(progress);
}

/**
 * Mark problem as solved
 */
export function markProblemSolved(
  topicId: string,
  problemId: string,
  timeSpent?: number,
  notes?: string
): void {
  updateProblemProgress(topicId, problemId, {
    status: 'solved',
    solvedAt: new Date().toISOString(),
    timeSpent: timeSpent || null,
    notes: notes || '',
  });
}

/**
 * Get concept completion status
 */
export function isConceptCompleted(topicId: string, conceptId: string): boolean {
  const progress = getProgress();
  return progress.topics[topicId]?.concepts[conceptId]?.completed || false;
}

/**
 * Get problem status
 */
export function getProblemStatus(topicId: string, problemId: string): ProblemProgress['status'] {
  const progress = getProgress();
  return progress.topics[topicId]?.problems[problemId]?.status || 'not-started';
}

/**
 * Calculate topic completion percentage
 */
export function getTopicCompletionPercent(topicId: string, totalConcepts: number): number {
  const progress = getProgress();
  const topicProgress = progress.topics[topicId];
  
  if (!topicProgress || totalConcepts === 0) return 0;
  
  const completedConcepts = Object.values(topicProgress.concepts)
    .filter((c) => c.completed).length;
  
  return Math.round((completedConcepts / totalConcepts) * 100);
}

/**
 * Update study streak
 */
function updateStudyStreak(progress: UserProgress): void {
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  
  if (!progress.stats.studyDays.includes(today)) {
    progress.stats.studyDays.push(today);
  }
  
  // Check if continuing streak
  if (progress.stats.lastStudyDate === yesterday || progress.stats.lastStudyDate === today) {
    if (progress.stats.lastStudyDate === yesterday) {
      progress.stats.currentStreak++;
    }
  } else if (progress.stats.lastStudyDate !== today) {
    progress.stats.currentStreak = 1;
  }
  
  // Update longest streak
  if (progress.stats.currentStreak > progress.stats.longestStreak) {
    progress.stats.longestStreak = progress.stats.currentStreak;
  }
  
  progress.stats.lastStudyDate = today;
}

/**
 * Get progress stats
 */
export function getStats(): ProgressStats {
  return getProgress().stats;
}

/**
 * Get user preferences
 */
export function getPreferences(): UserPreferences {
  return getProgress().preferences;
}

/**
 * Update user preferences
 */
export function updatePreferences(update: Partial<UserPreferences>): void {
  const progress = getProgress();
  progress.preferences = { ...progress.preferences, ...update };
  saveProgress(progress);
}

/**
 * Reset all progress
 */
export function resetProgress(): void {
  storage.remove(STORAGE_KEY);
}

/**
 * Export progress as JSON
 */
export function exportProgress(): string {
  return JSON.stringify(getProgress(), null, 2);
}
