// ============================================
// Patterns Page
// ============================================

import { Component } from '@components/base';
import { getPatterns, getProblemById } from '@services/data-service';
import type { Pattern } from '@/types';

interface PatternsPageState {
  searchQuery: string;
  expandedPattern: string | null;
}

/**
 * Pattern to internal content mapping
 * Maps pattern names to their topic/section paths in the curriculum
 */
const PATTERN_CONTENT_MAP: Record<string, { topicId: string; description: string }> = {
  // ===== ARRAY/STRING PATTERNS =====
  'two-pointers': { topicId: 'arrays-strings', description: 'Efficient traversal with two indices' },
  'two pointers': { topicId: 'arrays-strings', description: 'Efficient traversal with two indices' },
  'sliding-window': { topicId: 'arrays-strings', description: 'Fixed/variable window techniques' },
  'sliding window': { topicId: 'arrays-strings', description: 'Fixed/variable window techniques' },
  'prefix-sum': { topicId: 'arrays-strings', description: 'Cumulative sum for range queries' },
  'prefix sum': { topicId: 'arrays-strings', description: 'Cumulative sum for range queries' },
  'prefix/suffix': { topicId: 'arrays-strings', description: 'Prefix and suffix computations' },
  'kadane-s-algorithm': { topicId: 'arrays-strings', description: 'Maximum subarray problems' },
  'kadane\'s algorithm': { topicId: 'arrays-strings', description: 'Maximum subarray problems' },
  'dutch national flag': { topicId: 'arrays-strings', description: 'Three-way partitioning' },
  'circular array': { topicId: 'arrays-strings', description: 'Wrap-around array handling' },
  'matrix rotation': { topicId: 'arrays-strings', description: 'Transpose + reverse pattern' },
  'matrix traversal': { topicId: 'arrays-strings', description: 'Layer by layer traversal' },
  'string manipulation': { topicId: 'arrays-strings', description: 'String processing techniques' },
  'string matching': { topicId: 'arrays-strings', description: 'Pattern matching in strings' },
  'string parsing': { topicId: 'arrays-strings', description: 'Parsing string formats' },
  'character mapping': { topicId: 'arrays-strings', description: 'Map characters between strings' },
  'expand from center': { topicId: 'arrays-strings', description: 'Palindrome expansion' },
  'frequency count': { topicId: 'arrays-strings', description: 'Count character/element occurrences' },
  'count matching': { topicId: 'arrays-strings', description: 'Count pattern matches' },
  
  // ===== HASHING PATTERNS =====
  'hash-map': { topicId: 'hashing', description: 'O(1) lookup techniques' },
  'hash map': { topicId: 'hashing', description: 'O(1) lookup techniques' },
  'hash set': { topicId: 'hashing', description: 'Unique element tracking' },
  'hash function': { topicId: 'hashing', description: 'Custom hash implementations' },
  'bijection mapping': { topicId: 'hashing', description: 'One-to-one mappings' },
  'frequency map': { topicId: 'hashing', description: 'Element frequency tracking' },
  
  // ===== LINKED LIST PATTERNS =====
  'fast-slow-pointers': { topicId: 'linked-lists', description: 'Cycle detection and middle finding' },
  'fast & slow pointer': { topicId: 'linked-lists', description: 'Cycle detection and middle finding' },
  'in-place-reversal': { topicId: 'linked-lists', description: 'Reverse without extra space' },
  'in-place reversal': { topicId: 'linked-lists', description: 'Reverse without extra space' },
  'pointer manipulation': { topicId: 'linked-lists', description: 'Direct pointer operations' },
  'merge pattern': { topicId: 'linked-lists', description: 'Merge sorted lists' },
  'doubly ll': { topicId: 'linked-lists', description: 'Doubly linked list operations' },
  'math + ll': { topicId: 'linked-lists', description: 'Math operations on linked lists' },
  'stack + ll': { topicId: 'linked-lists', description: 'Stack with linked list' },
  
  // ===== STACK/QUEUE PATTERNS =====
  'stack': { topicId: 'stacks-queues', description: 'LIFO data structure' },
  'stack evaluation': { topicId: 'stacks-queues', description: 'Expression evaluation' },
  'stack simulation': { topicId: 'stacks-queues', description: 'Simulate with stack' },
  'monotonic-stack': { topicId: 'stacks-queues', description: 'Next greater element' },
  'monotonic stack': { topicId: 'stacks-queues', description: 'Next greater element' },
  'circular monotonic stack': { topicId: 'stacks-queues', description: 'Circular array monotonic' },
  'monotonic deque': { topicId: 'stacks-queues', description: 'Sliding window max/min' },
  'design': { topicId: 'stacks-queues', description: 'Design data structures' },
  
  // ===== TREE PATTERNS =====
  'bfs': { topicId: 'trees', description: 'Level-order traversal' },
  'dfs': { topicId: 'trees', description: 'Depth-first exploration' },
  'tree-bfs': { topicId: 'trees', description: 'Level-order tree traversal' },
  'tree-dfs': { topicId: 'trees', description: 'Preorder, inorder, postorder' },
  'bfs / dfs': { topicId: 'trees', description: 'Tree traversal methods' },
  'dfs / bfs': { topicId: 'trees', description: 'Tree traversal methods' },
  'inorder dfs': { topicId: 'trees', description: 'Inorder traversal' },
  'reverse inorder': { topicId: 'trees', description: 'Reverse inorder traversal' },
  'controlled inorder': { topicId: 'trees', description: 'BST inorder with control' },
  'boundary dfs': { topicId: 'trees', description: 'Tree boundary traversal' },
  'multi-source bfs': { topicId: 'trees', description: 'BFS from multiple sources' },
  
  // ===== BST PATTERNS =====
  'bst operations': { topicId: 'binary-search-trees', description: 'BST insert/delete/search' },
  'bst search': { topicId: 'binary-search-trees', description: 'Search in BST' },
  'bst construction': { topicId: 'binary-search-trees', description: 'Build BST from data' },
  'bst property navigation': { topicId: 'binary-search-trees', description: 'Exploit BST ordering' },
  'bst range query': { topicId: 'binary-search-trees', description: 'Range operations in BST' },
  'bst successor': { topicId: 'binary-search-trees', description: 'Find next element' },
  'inorder + swap detection': { topicId: 'binary-search-trees', description: 'Detect swapped nodes' },
  
  // ===== HEAP PATTERNS =====
  'top-k-elements': { topicId: 'heaps-priority-queues', description: 'Finding K largest/smallest' },
  'top k': { topicId: 'heaps-priority-queues', description: 'Finding K largest/smallest' },
  'two-heaps': { topicId: 'heaps-priority-queues', description: 'Median tracking' },
  'two heaps pattern': { topicId: 'heaps-priority-queues', description: 'Median tracking' },
  'k-way-merge': { topicId: 'heaps-priority-queues', description: 'Merging sorted lists' },
  'k-way merge': { topicId: 'heaps-priority-queues', description: 'Merging sorted lists' },
  'min-heap': { topicId: 'heaps-priority-queues', description: 'Min priority queue' },
  'max-heap': { topicId: 'heaps-priority-queues', description: 'Max priority queue' },
  'frequency + heap': { topicId: 'heaps-priority-queues', description: 'Frequency-based heap' },
  'streaming + min-heap': { topicId: 'heaps-priority-queues', description: 'Stream processing with heap' },
  'quick select': { topicId: 'heaps-priority-queues', description: 'Kth element selection' },
  
  // ===== GRAPH PATTERNS =====
  'graph-bfs': { topicId: 'graphs', description: 'Shortest path in unweighted graphs' },
  'graph-dfs': { topicId: 'graphs', description: 'Connected components, cycles' },
  'grid dfs': { topicId: 'graphs', description: 'DFS on 2D grid' },
  'grid bfs': { topicId: 'graphs', description: 'BFS on 2D grid' },
  'grid dfs/bfs': { topicId: 'graphs', description: 'Grid traversal' },
  'topological-sort': { topicId: 'graphs', description: 'Ordering with dependencies' },
  'topological sort': { topicId: 'graphs', description: 'Ordering with dependencies' },
  'topological peeling': { topicId: 'graphs', description: 'Layer-by-layer topo sort' },
  'union-find': { topicId: 'graphs', description: 'Disjoint set operations' },
  'union find': { topicId: 'graphs', description: 'Disjoint set operations' },
  'cycle detection': { topicId: 'graphs', description: 'Detect cycles in graph' },
  'bipartite check': { topicId: 'graphs', description: 'Check 2-coloring' },
  'dijkstra\'s algorithm': { topicId: 'graphs', description: 'Weighted shortest path' },
  'dijkstra': { topicId: 'graphs', description: 'Weighted shortest path' },
  'bellman-ford': { topicId: 'graphs', description: 'Negative weight shortest path' },
  'floyd-warshall': { topicId: 'graphs', description: 'All pairs shortest path' },
  'floyd\'s algorithm': { topicId: 'graphs', description: 'Cycle detection in sequence' },
  'mst': { topicId: 'graphs', description: 'Minimum spanning tree' },
  'tarjan\'s': { topicId: 'graphs', description: 'Strongly connected components' },
  'eulerian path': { topicId: 'graphs', description: 'Visit every edge once' },
  
  // ===== SORTING/SEARCHING PATTERNS =====
  'binary-search': { topicId: 'sorting-searching', description: 'Divide and conquer search' },
  'binary search': { topicId: 'sorting-searching', description: 'Divide and conquer search' },
  'classic binary search': { topicId: 'sorting-searching', description: 'Standard binary search' },
  '2d binary search': { topicId: 'sorting-searching', description: 'Binary search in matrix' },
  'binary search on answer': { topicId: 'sorting-searching', description: 'Search on result space' },
  'binary search bounds': { topicId: 'sorting-searching', description: 'Find boundaries' },
  'cyclic-sort': { topicId: 'sorting-searching', description: 'In-place array sorting' },
  'cyclic sort': { topicId: 'sorting-searching', description: 'In-place array sorting' },
  'merge sort': { topicId: 'sorting-searching', description: 'Divide and conquer sort' },
  'custom sort': { topicId: 'sorting-searching', description: 'Custom comparator sorting' },
  
  // ===== RECURSION/BACKTRACKING PATTERNS =====
  'basic recursion': { topicId: 'recursion-backtracking', description: 'Fundamental recursion' },
  'backtracking': { topicId: 'recursion-backtracking', description: 'Explore all possibilities' },
  'grid backtracking': { topicId: 'recursion-backtracking', description: 'Backtrack on grid' },
  'subsets': { topicId: 'recursion-backtracking', description: 'Generate all subsets' },
  'subsets pattern': { topicId: 'recursion-backtracking', description: 'Generate all subsets' },
  'permutations': { topicId: 'recursion-backtracking', description: 'Generate all orderings' },
  'permutation pattern': { topicId: 'recursion-backtracking', description: 'Generate all orderings' },
  'combinations': { topicId: 'recursion-backtracking', description: 'K elements from N' },
  'combination pattern': { topicId: 'recursion-backtracking', description: 'K elements from N' },
  'divide & conquer': { topicId: 'recursion-backtracking', description: 'Split and solve' },
  
  // ===== DYNAMIC PROGRAMMING PATTERNS =====
  'dynamic-programming': { topicId: 'dynamic-programming', description: 'Optimal substructure problems' },
  'fibonacci-numbers': { topicId: 'dynamic-programming', description: 'Overlapping subproblems' },
  'fibonacci': { topicId: 'dynamic-programming', description: 'Overlapping subproblems' },
  '0-1-knapsack': { topicId: 'dynamic-programming', description: 'Subset selection problems' },
  '0/1 knapsack': { topicId: 'dynamic-programming', description: 'Subset selection problems' },
  'unbounded-knapsack': { topicId: 'dynamic-programming', description: 'Unlimited item selection' },
  'unbounded knapsack': { topicId: 'dynamic-programming', description: 'Unlimited item selection' },
  'lcs pattern': { topicId: 'dynamic-programming', description: 'Longest common subsequence' },
  'lis pattern': { topicId: 'dynamic-programming', description: 'Longest increasing subsequence' },
  'grid dp': { topicId: 'dynamic-programming', description: 'DP on 2D grid' },
  'interval dp': { topicId: 'dynamic-programming', description: 'DP on intervals' },
  'bottom-up grid': { topicId: 'dynamic-programming', description: 'Bottom-up grid DP' },
  'take/skip pattern': { topicId: 'dynamic-programming', description: 'Include or exclude decisions' },
  'count ways': { topicId: 'dynamic-programming', description: 'Count number of ways' },
  'state machine': { topicId: 'dynamic-programming', description: 'State transition DP' },
  'boolean dp': { topicId: 'dynamic-programming', description: 'True/false DP decisions' },
  'catalan numbers': { topicId: 'dynamic-programming', description: 'Catalan number sequence' },
  
  // ===== GREEDY PATTERNS =====
  'greedy': { topicId: 'greedy-algorithms', description: 'Local optimal choices' },
  'intervals': { topicId: 'greedy-algorithms', description: 'Merge, insert, schedule' },
  'greedy / intervals': { topicId: 'greedy-algorithms', description: 'Interval scheduling' },
  'merge-intervals': { topicId: 'greedy-algorithms', description: 'Overlapping interval problems' },
  
  // ===== TRIE PATTERNS =====
  'trie': { topicId: 'tries', description: 'Prefix tree operations' },
  'basic trie': { topicId: 'tries', description: 'Insert/search/startsWith' },
  'bit trie': { topicId: 'tries', description: 'Binary trie for XOR' },
  'trie + dfs': { topicId: 'tries', description: 'Trie with DFS traversal' },
  'trie + dp': { topicId: 'tries', description: 'Trie with dynamic programming' },
  
  // ===== BIT MANIPULATION PATTERNS =====
  'bit-manipulation': { topicId: 'bit-manipulation', description: 'XOR, bitmask techniques' },
  'bit manipulation': { topicId: 'bit-manipulation', description: 'XOR, bitmask techniques' },
  'xor': { topicId: 'bit-manipulation', description: 'XOR operations' },
  'bit masking': { topicId: 'bit-manipulation', description: 'Use bits as flags' },
  'bit shifting': { topicId: 'bit-manipulation', description: 'Shift operations' },
  
  // ===== MATH PATTERNS =====
  'math': { topicId: 'math-number-theory', description: 'Mathematical algorithms' },
  'gcd': { topicId: 'math-number-theory', description: 'Greatest common divisor' },
  'sieve of eratosthenes': { topicId: 'math-number-theory', description: 'Prime generation' },
  'modular exponentiation': { topicId: 'math-number-theory', description: 'Power with modulo' },
  'digital root': { topicId: 'math-number-theory', description: 'Digit sum formula' },
  
  // ===== ADVANCED DATA STRUCTURES =====
  'segment tree': { topicId: 'advanced-data-structures', description: 'Range queries and updates' },
  'bit': { topicId: 'advanced-data-structures', description: 'Binary indexed tree' },
  'treemap': { topicId: 'advanced-data-structures', description: 'Ordered map operations' },
};

/**
 * Get content link for a pattern
 * Uses multiple matching strategies to find the best topic
 */
function getPatternContentLink(patternId: string): { topicId: string; description: string } | null {
  // Strategy 1: Try exact match with lowercase
  const lowerName = patternId.toLowerCase();
  if (PATTERN_CONTENT_MAP[lowerName]) {
    return PATTERN_CONTENT_MAP[lowerName];
  }
  
  // Strategy 2: Normalize and try exact match
  const normalizedId = lowerName.replace(/[^a-z0-9/]+/g, ' ').trim();
  if (PATTERN_CONTENT_MAP[normalizedId]) {
    return PATTERN_CONTENT_MAP[normalizedId];
  }
  
  // Strategy 3: Try with dashes instead of spaces
  const dashedId = normalizedId.replace(/\s+/g, '-');
  if (PATTERN_CONTENT_MAP[dashedId]) {
    return PATTERN_CONTENT_MAP[dashedId];
  }
  
  // Strategy 4: Check for key patterns in the name
  const keywordMap: Record<string, string> = {
    'knapsack': '0/1 knapsack',
    'two pointer': 'two pointers',
    'sliding': 'sliding window',
    'prefix': 'prefix sum',
    'kadane': 'kadane\'s algorithm',
    'hash': 'hash map',
    'union': 'union find',
    'topo': 'topological sort',
    'dijkstra': 'dijkstra',
    'bellman': 'bellman-ford',
    'floyd': 'floyd\'s algorithm',
    'backtrack': 'backtracking',
    'subset': 'subsets pattern',
    'permut': 'permutation pattern',
    'combin': 'combination pattern',
    'recursi': 'basic recursion',
    'divide': 'divide & conquer',
    'dp': 'dynamic-programming',
    'greedy': 'greedy',
    'interval': 'intervals',
    'monotonic': 'monotonic stack',
    'stack': 'stack',
    'heap': 'min-heap',
    'bfs': 'bfs',
    'dfs': 'dfs',
    'bst': 'bst operations',
    'trie': 'trie',
    'binary search': 'binary search',
    'segment': 'segment tree',
    'xor': 'xor',
    'bit': 'bit manipulation',
    'grid': 'grid dfs',
    'merge': 'merge pattern',
    'sort': 'custom sort',
  };
  
  for (const [keyword, mapKey] of Object.entries(keywordMap)) {
    if (normalizedId.includes(keyword) && PATTERN_CONTENT_MAP[mapKey]) {
      return PATTERN_CONTENT_MAP[mapKey];
    }
  }
  
  // Strategy 5: Partial match on keys
  for (const [key, value] of Object.entries(PATTERN_CONTENT_MAP)) {
    const keyNorm = key.replace(/[^a-z0-9]+/g, '');
    const idNorm = normalizedId.replace(/[^a-z0-9]+/g, '');
    if (idNorm.includes(keyNorm) || keyNorm.includes(idNorm)) {
      return value;
    }
  }
  
  return null;
}

/**
 * Patterns list with problem counts
 */
export class PatternsPage extends Component<PatternsPageState> {
  constructor(container: HTMLElement) {
    super(container, {
      searchQuery: '',
      expandedPattern: null,
    });
  }

  template(): string {
    const patterns = getPatterns();
    const { searchQuery, expandedPattern } = this.state;

    const filteredPatterns = searchQuery
      ? patterns.filter((p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : patterns;

    // Group by frequency
    const highFreq = filteredPatterns.filter((p) => p.frequency === 'high');
    const mediumFreq = filteredPatterns.filter((p) => p.frequency === 'medium');
    const lowFreq = filteredPatterns.filter((p) => p.frequency === 'low');

    return /* html */ `
      <div class="page page-patterns">
        <div class="page-header">
          <h1>Patterns</h1>
          <p class="page-subtitle">Master these patterns to solve most DSA problems</p>
        </div>

        <div class="patterns-filters">
          <div class="search-box">
            <svg class="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input 
              type="text" 
              class="search-input pattern-search" 
              placeholder="Search patterns..." 
              value="${searchQuery}"
            />
          </div>
        </div>

        <div class="patterns-content">
          ${highFreq.length > 0 ? /* html */ `
            <section class="pattern-section">
              <h2 class="section-title">
                <span class="frequency-badge high">High Frequency</span>
                Essential for interviews
              </h2>
              <div class="patterns-grid">
                ${highFreq.map((p) => this.renderPatternCard(p, expandedPattern)).join('')}
              </div>
            </section>
          ` : ''}

          ${mediumFreq.length > 0 ? /* html */ `
            <section class="pattern-section">
              <h2 class="section-title">
                <span class="frequency-badge medium">Medium Frequency</span>
                Good to know
              </h2>
              <div class="patterns-grid">
                ${mediumFreq.map((p) => this.renderPatternCard(p, expandedPattern)).join('')}
              </div>
            </section>
          ` : ''}

          ${lowFreq.length > 0 ? /* html */ `
            <section class="pattern-section">
              <h2 class="section-title">
                <span class="frequency-badge low">Lower Frequency</span>
                Advanced topics
              </h2>
              <div class="patterns-grid">
                ${lowFreq.map((p) => this.renderPatternCard(p, expandedPattern)).join('')}
              </div>
            </section>
          ` : ''}
        </div>
      </div>
    `;
  }

  private renderPatternCard(pattern: Pattern, expandedPattern: string | null): string {
    const isExpanded = expandedPattern === pattern.id;
    const problems = pattern.problems.map((id) => getProblemById(id)).filter(Boolean);
    const contentLink = getPatternContentLink(pattern.id);

    return /* html */ `
      <div class="pattern-card card ${isExpanded ? 'expanded' : ''}" data-pattern-id="${pattern.id}">
        <div class="pattern-header">
          <h3 class="pattern-name">${pattern.name}</h3>
          <span class="problem-count">${pattern.problems.length} problems</span>
        </div>
        
        ${contentLink ? /* html */ `
          <p class="pattern-description">${contentLink.description}</p>
        ` : ''}
        
        <div class="pattern-actions">
          ${contentLink ? /* html */ `
            <a href="#/topics/${contentLink.topicId}" class="btn btn-primary learn-btn">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
              </svg>
              Learn Pattern
            </a>
          ` : ''}
          
          <button type="button" class="btn btn-ghost expand-btn" data-pattern="${pattern.id}">
            ${isExpanded ? 'Hide Problems' : 'Practice Problems'}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="${isExpanded ? 'rotated' : ''}">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>
        </div>

        ${isExpanded ? /* html */ `
          <div class="pattern-problems">
            ${problems.length > 0 ? problems.map((p) => /* html */ `
              <a href="${p!.url}" target="_blank" rel="noopener" class="mini-problem">
                <span class="badge badge--${p!.difficulty}">${p!.difficulty.charAt(0).toUpperCase()}</span>
                ${p!.title}
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="external-icon">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                  <polyline points="15 3 21 3 21 9"></polyline>
                  <line x1="10" y1="14" x2="21" y2="3"></line>
                </svg>
              </a>
            `).join('') : /* html */ `
              <p class="no-problems">No problems linked to this pattern yet.</p>
            `}
          </div>
        ` : ''}
      </div>
    `;
  }

  afterRender(): void {
    // Search
    const searchInput = this.container.querySelector('.pattern-search') as HTMLInputElement;
    searchInput?.addEventListener('input', this.debounce((e: Event) => {
      const target = e.target as HTMLInputElement;
      this.setState({ searchQuery: target.value });
    }, 200));

    // Expand/collapse - attach to each button directly
    const expandBtns = this.container.querySelectorAll('.expand-btn');
    expandBtns.forEach((btn) => {
      btn.addEventListener('click', (e: Event) => {
        e.preventDefault();
        e.stopPropagation();
        const patternId = (btn as HTMLElement).getAttribute('data-pattern');
        if (patternId) {
          const currentExpanded = this.state.expandedPattern;
          this.setState({
            expandedPattern: currentExpanded === patternId ? null : patternId,
          });
        }
      });
    });
  }
}
