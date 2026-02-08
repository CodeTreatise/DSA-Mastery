# LC 934: Shortest Bridge

> **A beautiful combination of DFS + BFS - find one island, then BFS to the other**
>
> ⏱️ **Interview Time:** 20-25 min | 📊 **Difficulty:** Medium | 🎯 **Frequency:** High (Google, Meta)

---

## Problem Statement

Given an `n x n` binary matrix `grid` where `1` represents land and `0` represents water, there are exactly **two islands**.

Return the **smallest number of 0s** you must flip to connect the two islands.

```
Example 1:
Input: grid = [[0,1],[1,0]]
Output: 1

Example 2:
Input: grid = [[0,1,0],
               [0,0,0],
               [0,0,1]]
Output: 2

Example 3:
Input: grid = [[1,1,1,1,1],
               [1,0,0,0,1],
               [1,0,1,0,1],
               [1,0,0,0,1],
               [1,1,1,1,1]]
Output: 1
```

---

## 🎯 Pattern Recognition

<details>
<summary><strong>Why DFS + BFS Combination?</strong></summary>

**Two-phase approach:**
1. **DFS Phase:** Find and mark one entire island
2. **BFS Phase:** Expand from island 1 until reaching island 2

**Why BFS for second phase?**
- BFS guarantees shortest path
- Each level of BFS = one more flip
- When we reach island 2, we have minimum flips

</details>

---

## 📐 Algorithm

```
Phase 1: Find first island (DFS)
- Scan grid for any '1'
- DFS to mark ALL cells of this island
- Collect all island 1 cells as BFS starting points

Phase 2: Expand to second island (BFS)
- Initialize BFS queue with all island 1 cells at distance 0
- Expand level by level (each level = 1 flip)
- When reaching any '1' not in island 1, return distance

Visualization:
Original:        After DFS:       BFS Level 1:     BFS Level 2:
0 1 0           0 2 0            0 2 0            0 2 0
0 0 0      →    0 0 0       →    0 x 0       →    x x x
0 0 1           0 0 1            0 0 1            0 x 1 ← Found!
                Island 1         Distance 1        Distance 2
```

---

## 💻 Solution

**Python:**
```python
from typing import List
from collections import deque

def shortestBridge(grid: List[List[int]]) -> int:
    """
    Find shortest bridge between two islands.
    
    Time: O(n²) - visit each cell at most twice
    Space: O(n²) - queue and visited set
    """
    n = len(grid)
    directions = [(0, 1), (0, -1), (1, 0), (-1, 0)]
    
    # Phase 1: Find and mark first island using DFS
    def find_first_island():
        """Find any cell of island 1 and return all its cells."""
        for r in range(n):
            for c in range(n):
                if grid[r][c] == 1:
                    island = []
                    dfs_mark(r, c, island)
                    return island
        return []
    
    def dfs_mark(r, c, island):
        """Mark island 1 cells as 2 and collect them."""
        if r < 0 or r >= n or c < 0 or c >= n:
            return
        if grid[r][c] != 1:
            return
        
        grid[r][c] = 2  # Mark as island 1
        island.append((r, c))
        
        for dr, dc in directions:
            dfs_mark(r + dr, c + dc, island)
    
    # Phase 2: BFS from island 1 to find island 2
    def bfs_to_island2(island1_cells):
        """BFS expansion from island 1."""
        queue = deque()
        
        # Initialize with all island 1 cells at distance 0
        for r, c in island1_cells:
            queue.append((r, c, 0))
        
        visited = set(island1_cells)
        
        while queue:
            r, c, dist = queue.popleft()
            
            for dr, dc in directions:
                nr, nc = r + dr, c + dc
                
                if 0 <= nr < n and 0 <= nc < n and (nr, nc) not in visited:
                    # Found island 2!
                    if grid[nr][nc] == 1:
                        return dist
                    
                    # Water cell - continue expanding
                    visited.add((nr, nc))
                    queue.append((nr, nc, dist + 1))
        
        return -1  # Should never reach here
    
    # Execute
    island1 = find_first_island()
    return bfs_to_island2(island1)


# Alternative: More compact version
def shortestBridge_compact(grid: List[List[int]]) -> int:
    """Compact version with inline functions."""
    n = len(grid)
    
    # Find first island and add all its cells to queue
    queue = deque()
    found = False
    
    def dfs(r, c):
        if r < 0 or r >= n or c < 0 or c >= n or grid[r][c] != 1:
            return
        grid[r][c] = 2
        queue.append((r, c, 0))
        dfs(r+1, c); dfs(r-1, c); dfs(r, c+1); dfs(r, c-1)
    
    # Find first '1' and DFS from it
    for r in range(n):
        if found:
            break
        for c in range(n):
            if grid[r][c] == 1:
                dfs(r, c)
                found = True
                break
    
    # BFS to find island 2
    while queue:
        r, c, dist = queue.popleft()
        
        for dr, dc in [(0,1), (0,-1), (1,0), (-1,0)]:
            nr, nc = r + dr, c + dc
            if 0 <= nr < n and 0 <= nc < n:
                if grid[nr][nc] == 1:
                    return dist
                if grid[nr][nc] == 0:
                    grid[nr][nc] = 2
                    queue.append((nr, nc, dist + 1))
    
    return -1


# Test
grid = [[0,1,0], [0,0,0], [0,0,1]]
print(shortestBridge([row[:] for row in grid]))  # 2
```

**JavaScript:**
```javascript
function shortestBridge(grid) {
    const n = grid.length;
    const directions = [[0,1], [0,-1], [1,0], [-1,0]];
    const queue = [];
    
    // DFS to mark first island
    function dfs(r, c) {
        if (r < 0 || r >= n || c < 0 || c >= n || grid[r][c] !== 1) return;
        grid[r][c] = 2;
        queue.push([r, c, 0]);
        dfs(r+1, c); dfs(r-1, c); dfs(r, c+1); dfs(r, c-1);
    }
    
    // Find and mark first island
    outer:
    for (let r = 0; r < n; r++) {
        for (let c = 0; c < n; c++) {
            if (grid[r][c] === 1) {
                dfs(r, c);
                break outer;
            }
        }
    }
    
    // BFS to find second island
    while (queue.length > 0) {
        const [r, c, dist] = queue.shift();
        
        for (const [dr, dc] of directions) {
            const nr = r + dr, nc = c + dc;
            
            if (nr >= 0 && nr < n && nc >= 0 && nc < n) {
                if (grid[nr][nc] === 1) return dist;
                if (grid[nr][nc] === 0) {
                    grid[nr][nc] = 2;
                    queue.push([nr, nc, dist + 1]);
                }
            }
        }
    }
    
    return -1;
}
```

---

## ⚡ Complexity Analysis

| Aspect | Complexity | Notes |
|--------|------------|-------|
| **Time** | O(n²) | Each cell visited at most twice (DFS + BFS) |
| **Space** | O(n²) | Queue can hold up to n² cells |

---

## 🔄 Variations

| Variation | Difference | Approach |
|-----------|------------|----------|
| Weighted water | Different flip costs | Dijkstra instead of BFS |
| Multiple islands | Find min bridge among all pairs | Try all pairs |
| Moving islands | Islands can shift | More complex state |

---

## ⚠️ Common Mistakes

### 1. Not Marking Island 1 Before BFS

```python
# ❌ Wrong: BFS might revisit island 1 cells
queue = deque(island1_cells)
while queue:
    r, c, dist = queue.popleft()
    # Might re-add island 1 cells!

# ✅ Correct: Mark island 1 with different value
grid[r][c] = 2  # Mark as island 1
```

### 2. Returning Wrong Distance

```python
# ❌ Wrong: Returns dist+1 (one too many)
if grid[nr][nc] == 1:
    return dist + 1  # Wrong!

# ✅ Correct: Return current distance
if grid[nr][nc] == 1:
    return dist  # dist = number of 0s flipped
```

### 3. Only Adding Boundary Cells to BFS

```python
# ❌ Wrong: Only boundary cells in queue (still correct but slower)
# This works but uses extra logic

# ✅ Better: Add ALL island 1 cells to queue
# Simpler and same complexity
```

---

## 🎤 Interview Walkthrough

**Clarify (1 min):**
> "So I need to find the minimum number of water cells to flip to connect two islands. The grid has exactly two islands, and I need to find the shortest 'bridge' between them."

**Approach (2 min):**
> "I'll use a two-phase approach:
> 1. DFS to find and mark all cells of one island
> 2. BFS from that entire island - when BFS reaches the other island, that's our answer"

**Why this works:**
> "BFS guarantees shortest path. By starting BFS from ALL cells of island 1 simultaneously, the first time we reach island 2 is the minimum distance."

**Code (10-12 min):**
> Write the solution, explaining each phase.

**Test (2 min):**
> Walk through a small example showing DFS marking and BFS expansion.

---

## 📝 Related Problems

| Problem | Similarity | Link |
|---------|------------|------|
| Walls and Gates | Multi-source BFS | [LC 286](https://leetcode.com/problems/walls-and-gates/) |
| 01 Matrix | Multi-source BFS | [LC 542](https://leetcode.com/problems/01-matrix/) |
| As Far from Land as Possible | Multi-source BFS | [LC 1162](https://leetcode.com/problems/as-far-from-land-as-possible/) |

---

> **💡 Key Insight:** This problem teaches the powerful DFS+BFS combo. Use DFS to identify a component, then BFS for shortest path FROM that entire component. The key is adding all source cells to BFS queue at distance 0.

---

**Next:** [Pacific Atlantic Water Flow →](./03-Pacific-Atlantic-LC417.md)
