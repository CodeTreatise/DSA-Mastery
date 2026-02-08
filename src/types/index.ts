// ============================================
// Type Definitions
// ============================================

// --- Topic Types ---

export interface TopicSection {
  id: string;
  title: string;
  position: number;
}

export interface Topic {
  id: string;
  order: number;
  title: string;
  slug: string;
  fileName: string;
  description: string;
  timeEstimate: string;
  prerequisites: string[];
  sections: TopicSection[];
  hasDiagram: boolean;
}

export interface TopicsData {
  version: string;
  generatedAt: string;
  count: number;
  topics: Topic[];
}

// --- Problem Types ---

export type Difficulty = 'easy' | 'medium' | 'hard';
export type Platform = 'leetcode' | 'neetcode' | 'hackerrank' | 'other';

export interface Problem {
  id: string;
  title: string;
  url: string;
  platform: Platform;
  difficulty: Difficulty;
  pattern: string | null;
  topicIds: string[];
}

export interface ProblemsData {
  version: string;
  generatedAt: string;
  count: number;
  problems: Problem[];
}

// --- Concept Types ---

export interface Concept {
  id: string;
  topicId: string;
  title: string;
  sectionNum: string;
  level: number;
  checklist: string[];
  complexity: string | null;
}

export interface ConceptsData {
  version: string;
  generatedAt: string;
  count: number;
  concepts: Concept[];
}

// --- Resource Types ---

export type ResourceType = 'video' | 'article' | 'course' | 'book' | 'tool';
export type ResourcePlatform = 
  | 'youtube' 
  | 'tih' 
  | 'gfg' 
  | 'leetcode' 
  | 'neetcode' 
  | 'medium' 
  | 'other';

export interface Resource {
  id: string;
  title: string;
  url: string;
  type: ResourceType;
  platform: ResourcePlatform;
  description: string | null;
  topicIds: string[];
}

export interface ResourcesData {
  version: string;
  generatedAt: string;
  count: number;
  resources: Resource[];
}

// --- Progress Types ---

export interface ConceptProgress {
  conceptId: string;
  completed: boolean;
  completedAt: string | null;
  notes: string;
}

export interface ProblemProgress {
  problemId: string;
  status: 'not-started' | 'attempted' | 'solved' | 'revisit';
  solvedAt: string | null;
  timeSpent: number | null; // minutes
  notes: string;
  difficulty: 'too-easy' | 'just-right' | 'too-hard' | null;
}

export interface TopicProgress {
  topicId: string;
  startedAt: string | null;
  completedAt: string | null;
  concepts: Record<string, ConceptProgress>;
  problems: Record<string, ProblemProgress>;
}

export interface UserProgress {
  version: string;
  updatedAt: string;
  topics: Record<string, TopicProgress>;
  stats: ProgressStats;
  preferences: UserPreferences;
}

export interface ProgressStats {
  totalConceptsCompleted: number;
  totalProblemsSolved: number;
  currentStreak: number;
  longestStreak: number;
  lastStudyDate: string | null;
  studyDays: string[]; // ISO date strings
}

export interface UserPreferences {
  theme: 'light' | 'dark';
  targetProblemsPerDay: number;
  targetMinutesPerDay: number;
  showDifficulty: boolean;
  showPatterns: boolean;
}

// --- Pattern Types ---

export interface Pattern {
  id: string;
  name: string;
  description: string;
  problems: string[]; // problem IDs
  frequency: 'high' | 'medium' | 'low';
}

// --- Company Types ---

export interface Company {
  id: string;
  name: string;
  problems: string[]; // problem IDs
  frequency: 'high' | 'medium' | 'low';
}

// --- UI State Types ---

export interface FilterState {
  difficulty: Difficulty | 'all';
  pattern: string | 'all';
  topic: string | 'all';
  status: 'all' | 'completed' | 'in-progress' | 'not-started';
  searchQuery: string;
}

export interface SortOption {
  field: string;
  direction: 'asc' | 'desc';
}

// --- Navigation Types ---

export interface BreadcrumbItem {
  label: string;
  href: string;
}

export interface NavItem {
  id: string;
  label: string;
  icon: string;
  href: string;
  badge?: string | number;
  children?: NavItem[];
}
