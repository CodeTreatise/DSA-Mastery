// ============================================
// Data Service
// ============================================

import type {
  Topic,
  TopicsData,
  Problem,
  ProblemsData,
  Concept,
  ConceptsData,
  Resource,
  ResourcesData,
  Difficulty,
  Pattern,
} from '@/types';

// Import JSON data files
import topicsJson from '../../public/data/topics.json';
import problemsJson from '../../public/data/problems.json';
import conceptsJson from '../../public/data/concepts.json';
import resourcesJson from '../../public/data/resources.json';

// Type cast imported data
const topicsData = topicsJson as TopicsData;
const problemsData = problemsJson as ProblemsData;
const conceptsData = conceptsJson as ConceptsData;
const resourcesData = resourcesJson as ResourcesData;

// ============================================
// Topics
// ============================================

/**
 * Get all topics, sorted by order field
 */
export function getTopics(): Topic[] {
  return [...topicsData.topics].sort((a, b) => a.order - b.order);
}

/**
 * Get topic by ID
 */
export function getTopicById(id: string): Topic | undefined {
  return topicsData.topics.find((t) => t.id === id);
}

/**
 * Get topic by slug
 */
export function getTopicBySlug(slug: string): Topic | undefined {
  return topicsData.topics.find((t) => t.slug === slug);
}

/**
 * Get topic by order number
 */
export function getTopicByOrder(order: number): Topic | undefined {
  return topicsData.topics.find((t) => t.order === order);
}

// ============================================
// Problems
// ============================================

/**
 * Get all problems
 */
export function getProblems(): Problem[] {
  return problemsData.problems;
}

/**
 * Get problem by ID
 */
export function getProblemById(id: string): Problem | undefined {
  return problemsData.problems.find((p) => p.id === id);
}

/**
 * Get problems by topic
 */
export function getProblemsByTopic(topicId: string): Problem[] {
  return problemsData.problems.filter((p) => p.topicIds.includes(topicId));
}

/**
 * Get problems by difficulty
 */
export function getProblemsByDifficulty(difficulty: Difficulty): Problem[] {
  return problemsData.problems.filter((p) => p.difficulty === difficulty);
}

/**
 * Get problems by pattern
 */
export function getProblemsByPattern(pattern: string): Problem[] {
  return problemsData.problems.filter(
    (p) => p.pattern?.toLowerCase().includes(pattern.toLowerCase())
  );
}

/**
 * Search problems
 */
export function searchProblems(query: string): Problem[] {
  const lower = query.toLowerCase();
  return problemsData.problems.filter(
    (p) =>
      p.title.toLowerCase().includes(lower) ||
      p.pattern?.toLowerCase().includes(lower) ||
      p.topicIds.some((t) => t.includes(lower))
  );
}

/**
 * Get unique patterns from problems
 */
export function getPatterns(): Pattern[] {
  const patternMap = new Map<string, string[]>();
  
  problemsData.problems.forEach((p) => {
    if (p.pattern) {
      // Split compound patterns like "Two Pointers / Sliding Window"
      const patterns = p.pattern.split(/[\/,&]/).map((s) => s.trim());
      patterns.forEach((pattern) => {
        if (!patternMap.has(pattern)) {
          patternMap.set(pattern, []);
        }
        patternMap.get(pattern)!.push(p.id);
      });
    }
  });
  
  return Array.from(patternMap.entries())
    .map(([name, problems]) => ({
      id: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      name,
      description: '',
      problems,
      frequency: problems.length > 20 ? 'high' : problems.length > 5 ? 'medium' : 'low',
    }))
    .sort((a, b) => b.problems.length - a.problems.length) as Pattern[];
}

/**
 * Get problem count
 */
export function getProblemCount(): number {
  return problemsData.count;
}

// ============================================
// Concepts
// ============================================

/**
 * Get all concepts
 */
export function getConcepts(): Concept[] {
  return conceptsData.concepts;
}

/**
 * Get concept by ID
 */
export function getConceptById(id: string): Concept | undefined {
  return conceptsData.concepts.find((c) => c.id === id);
}

/**
 * Get concepts by topic
 */
export function getConceptsByTopic(topicId: string): Concept[] {
  return conceptsData.concepts.filter((c) => c.topicId === topicId);
}

/**
 * Get concept count for topic
 */
export function getConceptCountByTopic(topicId: string): number {
  return getConceptsByTopic(topicId).length;
}

/**
 * Get total concept count
 */
export function getConceptCount(): number {
  return conceptsData.count;
}

// ============================================
// Resources
// ============================================

/**
 * Get all resources
 */
export function getResources(): Resource[] {
  return resourcesData.resources;
}

/**
 * Get resource by ID
 */
export function getResourceById(id: string): Resource | undefined {
  return resourcesData.resources.find((r) => r.id === id);
}

/**
 * Get resources by topic
 */
export function getResourcesByTopic(topicId: string): Resource[] {
  return resourcesData.resources.filter((r) => r.topicIds.includes(topicId));
}

/**
 * Get resources by type
 */
export function getResourcesByType(type: Resource['type']): Resource[] {
  return resourcesData.resources.filter((r) => r.type === type);
}

// ============================================
// Statistics
// ============================================

/**
 * Get data statistics
 */
export function getDataStats() {
  return {
    topicCount: topicsData.count,
    problemCount: problemsData.count,
    conceptCount: conceptsData.count,
    resourceCount: resourcesData.count,
    version: topicsData.version,
    generatedAt: topicsData.generatedAt,
  };
}

/**
 * Get difficulty distribution
 */
export function getDifficultyDistribution(): Record<Difficulty, number> {
  const distribution: Record<Difficulty, number> = {
    easy: 0,
    medium: 0,
    hard: 0,
  };
  
  problemsData.problems.forEach((p) => {
    distribution[p.difficulty]++;
  });
  
  return distribution;
}
