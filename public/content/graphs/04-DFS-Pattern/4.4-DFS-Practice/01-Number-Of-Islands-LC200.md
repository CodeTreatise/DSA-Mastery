# LC 200: Number of Islands

> **The quintessential DFS grid problem - count connected components**
>
> ⏱️ **Interview Time:** 15-20 min | 📊 **Difficulty:** Medium | 🎯 **Frequency:** Very High (All FAANG)

---

## Problem Statement

Given an `m x n` 2D binary grid where `'1'` represents land and `'0'` represents water, count the number of islands.

An island is surrounded by water and formed by connecting adjacent lands horizontally or vertically.

```
Example 1:
Input: grid = [
  ["1","1","1","1","0"],
  ["1","1","0","1","0"],
  ["1","1","0","0","0"],
  ["0","0","0","0","0"]
]
Output: 1

Example 2:
Input: grid = [
  ["1","1","0","0","0"],
  ["1","1","0","0","0"],
  ["0","0","1","0","0"],
  ["0","0","0","1","1"]
]
Output: 3 (three separate islands)
```

---

## 🎯 Pattern Recognition

<details>
<summary><strong>Why This is DFS (Connected Components)</strong></summary>

**Signals:**
1. "Count islands" = count connected components
2. "Adjacent lands" = grid traversal (4-directional)
3. Each island is a group of connected '1's

**Key insight:**
- Each DFS from an unvisited '1' explores one complete island
- Mark visited cells to avoid recounting
- Number of DFS starts = number of islands

</details>

---

## 📐 Algorithm

```
1. Scan grid for any '1'
2. When found:
   a. Increment island count
   b. DFS to mark ALL connected '1's as visited
3. Continue scanning for next unvisited '1'
4. Return island count

Visualization:
Start:           After DFS from (0,0):   After DFS from (2,2):
1 1 0 0 0       0 0 0 0 0               0 0 0 0 0
1 1 0 0 0  →    0 0 0 0 0          →    0 0 0 0 0
0 0 1 0 0       0 0 1 0 0               0 0 0 0 0
0 0 0 1 1       0 0 0 1 1               0 0 0 1 1
Count: 0        Count: 1                 Count: 2
```

---

## 💻 Solution

**Python:**
```python
from typing import List

def numIslands(grid: List[List[str]]) -> int:
    """
    Count number of islands using DFS.
    
    Time: O(m × n) - visit each cell at most once
    Space: O(m × n) - recursion stack in worst case
    """
    if not grid or not grid[0]:
        return 0
    
    rows, cols = len(grid), len(grid[0])
    count = 0
    
    def dfs(r, c):
        """Mark all connected land cells as visited."""
        # Base cases: out of bounds or water
        if r < 0 or r >= rows or c < 0 or c >= cols:
            return
        if grid[r][c] != '1':
            return
        
        # Mark as visited by changing to '0'
        grid[r][c] = '0'
        
        # Explore all 4 directions
        dfs(r + 1, c)  # Down
        dfs(r - 1, c)  # Up
        dfs(r, c + 1)  # Right
        dfs(r, c - 1)  # Left
    
    # Scan entire grid
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == '1':
                count += 1  # Found new island
                dfs(r, c)   # Mark entire island
    
    return count


# Test
grid1 = [
    ["1","1","0","0","0"],
    ["1","1","0","0","0"],
    ["0","0","1","0","0"],
    ["0","0","0","1","1"]
]
print(numIslands([row[:] for row in grid1]))  # 3
```

### BFS Alternative

```python
from collections import deque

def numIslands_bfs(grid: List[List[str]]) -> int:
    """BFS approach - useful if recursion depth is a concern."""
    if not grid:
        return 0
    
    rows, cols = len(grid), len(grid[0])
    count = 0
    
    def bfs(start_r, start_c):
        queue = deque([(start_r, start_c)])
        grid[start_r][start_c] = '0'
        
        while queue:
            r, c = queue.popleft()
            for dr, dc in [(0,1), (0,-1), (1,0), (-1,0)]:
                nr, nc = r + dr, c + dc
                if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] == '1':
                    grid[nr][nc] = '0'
                    queue.append((nr, nc))
    
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == '1':
                count += 1
                bfs(r, c)
    
    return count
```

### Without Modifying Input

```python
def numIslands_no_modify(grid: List[List[str]]) -> int:
    """Version that doesn't modify input grid."""
    if not grid:
        return 0
    
    rows, cols = len(grid), len(grid[0])
    visited = set()
    count = 0
    
    def dfs(r, c):
        if r < 0 or r >= rows or c < 0 or c >= cols:
            return
        if (r, c) in visited or grid[r][c] != '1':
            return
        
        visited.add((r, c))
        
        dfs(r + 1, c)
        dfs(r - 1, c)
        dfs(r, c + 1)
        dfs(r, c - 1)
    
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == '1' and (r, c) not in visited:
                count += 1
                dfs(r, c)
    
    return count
```

**JavaScript:**
```javascript
function numIslands(grid) {
    if (!grid || !grid[0]) return 0;
    
    const rows = grid.length, cols = grid[0].length;
    let count = 0;
    
    function dfs(r, c) {
        if (r < 0 || r >= rows || c < 0 || c >= cols) return;
        if (grid[r][c] !== '1') return;
        
        grid[r][c] = '0';  // Mark visited
        
        dfs(r + 1, c);
        dfs(r - 1, c);
        dfs(r, c + 1);
        dfs(r, c - 1);
    }
    
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (grid[r][c] === '1') {
                count++;
                dfs(r, c);
            }
        }
    }
    
    return count;
}
```

---

## ⚡ Complexity Analysis

| Aspect | Complexity | Notes |
|--------|------------|-------|
| **Time** | O(m × n) | Each cell visited at most once |
| **Space** | O(m × n) | Recursion stack in worst case |

### Space Analysis

```
Worst case for recursion stack:
All cells are land in a line (snake pattern)

1 1 1 1 1
0 0 0 0 1
1 1 1 1 1
1 0 0 0 0
1 1 1 1 1

DFS depth = m × n → Stack size O(m × n)
```

---

## 🔄 Variations

| Variation | Difference | Problem |
|-----------|------------|---------|
| 8-directional | Include diagonals | Custom |
| Count cells per island | Track size during DFS | Max Area of Island |
| Surround check | Islands touching boundary | Surrounded Regions |
| Perimeter | Count water-adjacent edges | Island Perimeter |

---

## ⚠️ Common Mistakes

### 1. Not Marking Visited Before Recursing

```python
# ❌ Wrong: May revisit same cell
def dfs(r, c):
    if grid[r][c] != '1':
        return
    # Process...
    dfs(r+1, c)  # Might come back here!
    grid[r][c] = '0'  # Too late

# ✅ Correct: Mark visited immediately
def dfs(r, c):
    if grid[r][c] != '1':
        return
    grid[r][c] = '0'  # Mark first
    dfs(r+1, c)
```

### 2. Checking Bounds After Accessing

```python
# ❌ Wrong: IndexError
def dfs(r, c):
    if grid[r][c] != '1':  # IndexError if out of bounds!
        return

# ✅ Correct: Check bounds first
def dfs(r, c):
    if r < 0 or r >= rows or c < 0 or c >= cols:
        return
    if grid[r][c] != '1':
        return
```

---

## 🎤 Interview Walkthrough

**Clarify (1 min):**
> "So I need to count separate groups of connected '1's, where connected means horizontally or vertically adjacent. Diagonals don't count, right?"

**Approach (2 min):**
> "I'll use DFS. For each unvisited '1', I increment my count and use DFS to mark all connected '1's. This way each island is counted exactly once."

**Code (8-10 min):**
> Write the solution, explaining the base cases and recursion.

**Test (2 min):**
> Walk through with a small example.

**Complexity (1 min):**
> "O(m×n) time since each cell is visited once. O(m×n) space for the recursion stack in the worst case of a snake-shaped island."

---

## 📝 Related Problems

| Problem | Focus | Link |
|---------|-------|------|
| Max Area of Island | Track size | [LC 695](https://leetcode.com/problems/max-area-of-island/) |
| Surrounded Regions | Boundary DFS | [LC 130](https://leetcode.com/problems/surrounded-regions/) |
| Number of Distinct Islands | Shape tracking | [LC 694](https://leetcode.com/problems/number-of-distinct-islands/) |

---

> **💡 Key Insight:** Number of Islands is just connected components on a grid. Each DFS start = one component = one island.

---

**Next:** [Clone Graph →](./02-Clone-Graph-LC133.md)
