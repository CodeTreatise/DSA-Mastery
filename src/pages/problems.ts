// ============================================
// Problems Page
// ============================================

import { Component } from '@components/base';
import { getProblems, getTopics, getTopicById } from '@services/data-service';
import type { Problem, Difficulty } from '@/types';

/**
 * Grouped pattern categories for the filter dropdown.
 * Each group has keywords that match against problem.pattern (case-insensitive).
 */
const PATTERN_GROUPS: { label: string; keywords: string[] }[] = [
  { label: 'Two Pointers', keywords: ['two pointers', 'dutch'] },
  { label: 'Sliding Window', keywords: ['sliding window'] },
  { label: 'Binary Search', keywords: ['binary search', '2d binary'] },
  { label: 'Stack', keywords: ['stack', 'monotonic stack', 'monotonic deque'] },
  { label: 'Linked List', keywords: ['pointer manipulation', 'reversal', 'floyd', 'fast & slow', 'merge pattern', 'll', 'linked', 'doubly ll'] },
  { label: 'Tree (DFS/BFS)', keywords: ['dfs', 'bfs', 'inorder', 'preorder', 'postorder', 'boundary'] },
  { label: 'BST', keywords: ['bst'] },
  { label: 'Heap / Priority Queue', keywords: ['heap', 'top k', 'top-k', 'k-way', 'quick select', 'streaming'] },
  { label: 'Graph', keywords: ['graph', 'topological', 'union-find', 'union find', 'dijkstra', 'bellman', 'floyd-warshall', 'mst', 'tarjan', 'eulerian', 'bipartite', 'grid dfs', 'grid bfs', 'multi-source', 'cycle detection', '2-coloring'] },
  { label: 'Hash Map / Set', keywords: ['hash', 'bijection', 'frequency', 'character mapping'] },
  { label: 'Recursion / Backtracking', keywords: ['recursion', 'backtrack', 'subset', 'permut', 'combin'] },
  { label: 'Divide & Conquer', keywords: ['divide'] },
  { label: 'Dynamic Programming', keywords: ['dp', 'knapsack', 'lcs', 'lis', 'fibonacci', 'interval dp', 'grid dp', 'take/skip', 'count ways', 'state machine', 'catalan', 'bottom-up'] },
  { label: 'Greedy', keywords: ['greedy', 'track max', 'track surplus', 'sort by deadline', 'sort by end', 'sort by ratio', 'two-pass', 'difference array'] },
  { label: 'Intervals', keywords: ['interval', 'overlap'] },
  { label: 'Trie', keywords: ['trie'] },
  { label: 'Bit Manipulation', keywords: ['bit', 'xor'] },
  { label: 'Math', keywords: ['gcd', 'sieve', 'modular', 'digital root', 'math', 'catalan', 'pascal', 'factor'] },
  { label: 'Matrix', keywords: ['matrix', 'rotate', 'spiral'] },
  { label: 'Design', keywords: ['design'] },
  { label: 'String', keywords: ['string', 'expand from center', 'prefix/suffix'] },
  { label: 'Prefix Sum', keywords: ['prefix sum', 'kadane'] },
];

interface ProblemsPageState {
  searchQuery: string;
  difficultyFilter: Difficulty | 'all';
  patternFilter: string;
  topicFilter: string;
  sortBy: 'default' | 'title' | 'difficulty';
  viewMode: 'list' | 'card';
}

/**
 * Problems list with filtering
 */
export class ProblemsPage extends Component<ProblemsPageState> {
  constructor(container: HTMLElement) {
    super(container, {
      searchQuery: '',
      difficultyFilter: 'all',
      patternFilter: 'all',
      topicFilter: 'all',
      sortBy: 'default',
      viewMode: 'card',
    });
  }

  template(): string {
    const allProblems = getProblems();
    const topics = getTopics();
    const { searchQuery, difficultyFilter, patternFilter, topicFilter, sortBy, viewMode } = this.state;

    // Count problems per pattern group
    const groupCounts = PATTERN_GROUPS.map(g => {
      const count = allProblems.filter(p => {
        if (!p.pattern) return false;
        const lp = p.pattern.toLowerCase();
        return g.keywords.some(kw => lp.includes(kw));
      }).length;
      return { ...g, count };
    }).filter(g => g.count > 0);

    // Apply filters
    let filteredProblems = allProblems;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filteredProblems = filteredProblems.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          p.pattern?.toLowerCase().includes(query)
      );
    }

    if (difficultyFilter !== 'all') {
      filteredProblems = filteredProblems.filter((p) => p.difficulty === difficultyFilter);
    }

    if (patternFilter !== 'all') {
      const group = PATTERN_GROUPS.find(g => g.label === patternFilter);
      if (group) {
        filteredProblems = filteredProblems.filter((p) => {
          if (!p.pattern) return false;
          const lp = p.pattern.toLowerCase();
          return group.keywords.some(kw => lp.includes(kw));
        });
      }
    }

    if (topicFilter !== 'all') {
      filteredProblems = filteredProblems.filter((p) => p.topicIds.includes(topicFilter));
    }

    // Apply sorting
    if (sortBy === 'title') {
      filteredProblems = [...filteredProblems].sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === 'difficulty') {
      const order: Record<string, number> = { easy: 0, medium: 1, hard: 2 };
      filteredProblems = [...filteredProblems].sort((a, b) => order[a.difficulty] - order[b.difficulty]);
    }

    const hasActiveFilters = searchQuery || difficultyFilter !== 'all' || patternFilter !== 'all' || topicFilter !== 'all';

    return /* html */ `
      <div class="page page-problems">
        <div class="problems-toolbar">
          <div class="problems-toolbar__filters">
            <div class="search-box search-box--compact">
              <svg class="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input 
                type="text" 
                class="search-input problem-search" 
                placeholder="Search problems..." 
                value="${searchQuery}"
              />
            </div>

            <select class="filter-select difficulty-filter">
              <option value="all" ${difficultyFilter === 'all' ? 'selected' : ''}>Difficulty</option>
              <option value="easy" ${difficultyFilter === 'easy' ? 'selected' : ''}>Easy</option>
              <option value="medium" ${difficultyFilter === 'medium' ? 'selected' : ''}>Medium</option>
              <option value="hard" ${difficultyFilter === 'hard' ? 'selected' : ''}>Hard</option>
            </select>

            <select class="filter-select pattern-filter">
              <option value="all" ${patternFilter === 'all' ? 'selected' : ''}>Pattern</option>
              ${groupCounts.map((g) => /* html */ `
                <option value="${g.label}" ${patternFilter === g.label ? 'selected' : ''}>${g.label} (${g.count})</option>
              `).join('')}
            </select>

            <select class="filter-select topic-filter">
              <option value="all" ${topicFilter === 'all' ? 'selected' : ''}>Topic</option>
              ${topics.map((t) => /* html */ `
                <option value="${t.id}" ${topicFilter === t.id ? 'selected' : ''}>${t.title.replace(/^\d+\s*-\s*/, '')}</option>
              `).join('')}
            </select>

            <select class="filter-select sort-select">
              <option value="default" ${sortBy === 'default' ? 'selected' : ''}>Sort</option>
              <option value="title" ${sortBy === 'title' ? 'selected' : ''}>By Title</option>
              <option value="difficulty" ${sortBy === 'difficulty' ? 'selected' : ''}>By Difficulty</option>
            </select>

            ${hasActiveFilters ? /* html */ `
              <button class="clear-filters-btn" title="Clear all filters">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
                Clear
              </button>
            ` : ''}
          </div>

          <div class="problems-toolbar__right">
            <span class="problems-count">${filteredProblems.length}<span class="problems-count__total"> / ${allProblems.length}</span></span>
            <div class="view-toggle">
              <button class="view-toggle-btn ${viewMode === 'list' ? 'active' : ''}" data-view="list" title="List view">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
              </button>
              <button class="view-toggle-btn ${viewMode === 'card' ? 'active' : ''}" data-view="card" title="Card view">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="3" width="7" height="7" rx="1"></rect>
                  <rect x="14" y="3" width="7" height="7" rx="1"></rect>
                  <rect x="3" y="14" width="7" height="7" rx="1"></rect>
                  <rect x="14" y="14" width="7" height="7" rx="1"></rect>
                </svg>
              </button>
            </div>
          </div>
        </div>

        ${viewMode === 'list' ? /* html */ `
          <div class="problems-list">
            ${filteredProblems.length === 0 
              ? this.renderEmptyState() 
              : filteredProblems.map((p, i) => this.renderProblemRow(p, i + 1)).join('')
            }
          </div>
        ` : /* html */ `
          <div class="problems-grid">
            ${filteredProblems.length === 0 
              ? this.renderEmptyState() 
              : filteredProblems.map((p) => this.renderProblemCard(p)).join('')
            }
          </div>
        `}
      </div>
    `;
  }

  private renderEmptyState(): string {
    return /* html */ `
      <div class="empty-state">
        <span class="empty-state__icon">🔍</span>
        <h3 class="empty-state__title">No problems found</h3>
        <p class="empty-state__description">Try adjusting your filters or search query.</p>
        <button class="btn btn-secondary clear-filters" style="margin-top:12px">Clear Filters</button>
      </div>
    `;
  }

  private renderProblemRow(problem: Problem, index: number = 0): string {
    const difficultyClass = problem.difficulty;

    // Resolve topic references from topicIds
    const topicRefs = problem.topicIds
      .map(id => getTopicById(id))
      .filter(Boolean)
      .slice(0, 2) // max 2 in list view to save space
      .map(t => /* html */ `
        <a href="#/topics/${t!.id}" class="topic-ref topic-ref--compact" title="Study: ${t!.title}">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
          </svg>
          ${t!.title.replace(/^\d+\s*-\s*/, '')}
        </a>
      `);

    return /* html */ `
      <div class="problem-row" data-url="${problem.url}">
        <span class="problem-index">${index}</span>
        <div class="problem-main">
          <div class="problem-title-row">
            <a href="${problem.url}" target="_blank" rel="noopener" class="problem-title">
              ${problem.title}
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="15 3 21 3 21 9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
              </svg>
            </a>
            ${topicRefs.length > 0 ? `<span class="problem-row-topics">${topicRefs.join('')}</span>` : ''}
          </div>
          ${problem.pattern ? /* html */ `
            <span class="problem-pattern">${problem.pattern}</span>
          ` : ''}
        </div>
        <div class="problem-meta">
          <span class="badge badge--${difficultyClass}">${problem.difficulty}</span>
        </div>
      </div>
    `;
  }

  private renderProblemCard(problem: Problem): string {
    const difficultyClass = problem.difficulty;

    // Resolve topic names from topicIds
    const topicRefs = problem.topicIds
      .map(id => getTopicById(id))
      .filter(Boolean)
      .map(t => /* html */ `
        <a href="#/topics/${t!.id}" class="topic-ref" title="Study: ${t!.title}">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
          </svg>
          ${t!.title.replace(/^\d+\s*-\s*/, '')}
        </a>
      `);

    return /* html */ `
      <div class="problem-card">
        <div class="problem-card-header">
          <span class="badge badge--${difficultyClass}">${problem.difficulty}</span>
          <a href="${problem.url}" target="_blank" rel="noopener" class="problem-card-leetcode" title="Open on LeetCode">
            LeetCode
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
              <polyline points="15 3 21 3 21 9"></polyline>
              <line x1="10" y1="14" x2="21" y2="3"></line>
            </svg>
          </a>
        </div>
        <span class="problem-card-title">${problem.title}</span>
        ${problem.pattern ? /* html */ `
          <span class="problem-card-pattern">${problem.pattern}</span>
        ` : ''}
        ${topicRefs.length > 0 ? /* html */ `
          <div class="problem-card-topics">
            ${topicRefs.join('')}
          </div>
        ` : ''}
      </div>
    `;
  }

  afterRender(): void {
    // Search
    const searchInput = this.container.querySelector('.problem-search') as HTMLInputElement;
    searchInput?.addEventListener('input', this.debounce((e: Event) => {
      const target = e.target as HTMLInputElement;
      this.setState({ searchQuery: target.value });
    }, 200));

    // Difficulty filter
    const difficultySelect = this.container.querySelector('.difficulty-filter') as HTMLSelectElement;
    difficultySelect?.addEventListener('change', (e) => {
      const target = e.target as HTMLSelectElement;
      this.setState({ difficultyFilter: target.value as Difficulty | 'all' });
    });

    // Pattern filter
    const patternSelect = this.container.querySelector('.pattern-filter') as HTMLSelectElement;
    patternSelect?.addEventListener('change', (e) => {
      const target = e.target as HTMLSelectElement;
      this.setState({ patternFilter: target.value });
    });

    // Topic filter
    const topicSelect = this.container.querySelector('.topic-filter') as HTMLSelectElement;
    topicSelect?.addEventListener('change', (e) => {
      const target = e.target as HTMLSelectElement;
      this.setState({ topicFilter: target.value });
    });

    // Sort
    const sortSelect = this.container.querySelector('.sort-select') as HTMLSelectElement;
    sortSelect?.addEventListener('change', (e) => {
      const target = e.target as HTMLSelectElement;
      this.setState({ sortBy: target.value as 'default' | 'title' | 'difficulty' });
    });

    // View toggle
    this.container.querySelectorAll('.view-toggle-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const mode = (btn as HTMLElement).dataset.view as 'list' | 'card';
        if (mode && mode !== this.state.viewMode) {
          this.setState({ viewMode: mode });
        }
      });
    });

    // Clear filters
    const clearBtn = this.container.querySelector('.clear-filters-btn');
    clearBtn?.addEventListener('click', () => {
      this.setState({
        searchQuery: '',
        difficultyFilter: 'all',
        patternFilter: 'all',
        topicFilter: 'all',
        sortBy: 'default',
      });
    });

    // Clear filters in empty state
    const clearEmptyBtn = this.container.querySelector('.clear-filters');
    clearEmptyBtn?.addEventListener('click', () => {
      this.setState({
        searchQuery: '',
        difficultyFilter: 'all',
        patternFilter: 'all',
        topicFilter: 'all',
        sortBy: 'default',
      });
    });

    // Row click → open LeetCode (but not if clicking a link inside)
    this.container.querySelectorAll('.problem-row[data-url]').forEach(row => {
      row.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        if (target.closest('a')) return; // let links handle themselves
        const url = (row as HTMLElement).dataset.url;
        if (url) window.open(url, '_blank', 'noopener');
      });
    });
  }
}
