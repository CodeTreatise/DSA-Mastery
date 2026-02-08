# LC 417: Pacific Atlantic Water Flow

> **Reverse thinking - start from oceans and work inward**
>
> ⏱️ **Interview Time:** 20-25 min | 📊 **Difficulty:** Medium | 🎯 **Frequency:** High (Google, Amazon)

---

## Problem Statement

Given an `m x n` matrix `heights` where `heights[r][c]` represents the height of cell `(r, c)`, water can flow from a cell to an adjacent cell (up, down, left, right) if the adjacent cell's height is **less than or equal to** the current cell's height.

The Pacific Ocean touches the **left and top** edges.
The Atlantic Ocean touches the **right and bottom** edges.

Return a list of cells that can flow to **both** oceans.

```
Example:
heights = [[1,2,2,3,5],
           [3,2,3,4,4],
           [2,4,5,3,1],
           [6,7,1,4,5],
           [5,1,1,2,4]]

Output: [[0,4],[1,3],[1,4],[2,2],[3,0],[3,1],[4,0]]

Pacific ~   ~   ~   ~   ~ 
       ~  1   2   2   3  (5) *
       ~  3   2   3  (4) (4) *
       ~  2   4  (5)  3   1  *
       ~ (6) (7)  1   4   5  *
       ~ (5)  1   1   2   4  *
          *   *   *   *   *  Atlantic
```

---

## 🎯 Pattern Recognition

<details>
<summary><strong>Why Reverse Thinking?</strong></summary>

**Naive approach (forward):**
- From each cell, DFS to see if it reaches both oceans
- Time: O(m²n²) - too slow!

**Clever approach (reverse):**
- Start from ocean boundaries
- Flow "uphill" (reversed direction)
- Find cells reachable from both oceans

**Key insight:**
- Pacific-reachable = cells that can reach Pacific = cells Pacific can "reach" going uphill
- Same for Atlantic
- Answer = intersection of both sets

</details>

---

## 📐 Algorithm

```
1. Create two visited sets: pacific_reachable, atlantic_reachable

2. Multi-source DFS/BFS from Pacific boundary:
   - Start from top row and left column
   - Traverse to neighbors with height >= current (going uphill)
   - Mark all reachable cells

3. Multi-source DFS/BFS from Atlantic boundary:
   - Start from bottom row and right column
   - Same traversal logic

4. Return intersection of both sets

Visualization (marking reachable cells):
Pacific (from top/left):    Atlantic (from bottom/right):
P P P P P                   . . . . A
P P P P P                   . . . A A
P P P . .                   . . A . A
P P . . .                   A A A A A
P . . . .                   A A A A A

Intersection (both P and A):
. . . . A
. . . A A
. . A . .
A A . . .
A . . . .
```

---

## 💻 Solution

**Python:**
```python
from typing import List

def pacificAtlantic(heights: List[List[int]]) -> List[List[int]]:
    """
    Find cells that can flow to both Pacific and Atlantic oceans.
    
    Time: O(m × n) - each cell visited at most twice
    Space: O(m × n) - two visited sets
    """
    if not heights or not heights[0]:
        return []
    
    rows, cols = len(heights), len(heights[0])
    
    # Sets to track which cells can reach each ocean
    pacific = set()
    atlantic = set()
    
    def dfs(r, c, reachable, prev_height):
        """DFS going 'uphill' from ocean."""
        # Out of bounds
        if r < 0 or r >= rows or c < 0 or c >= cols:
            return
        # Already visited or can't flow uphill
        if (r, c) in reachable or heights[r][c] < prev_height:
            return
        
        reachable.add((r, c))
        
        # Explore all directions (water flows from higher to us)
        current_height = heights[r][c]
        dfs(r + 1, c, reachable, current_height)
        dfs(r - 1, c, reachable, current_height)
        dfs(r, c + 1, reachable, current_height)
        dfs(r, c - 1, reachable, current_height)
    
    # Start DFS from Pacific border (top row + left column)
    for c in range(cols):
        dfs(0, c, pacific, heights[0][c])  # Top row
    for r in range(rows):
        dfs(r, 0, pacific, heights[r][0])  # Left column
    
    # Start DFS from Atlantic border (bottom row + right column)
    for c in range(cols):
        dfs(rows - 1, c, atlantic, heights[rows-1][c])  # Bottom row
    for r in range(rows):
        dfs(r, cols - 1, atlantic, heights[r][cols-1])  # Right column
    
    # Return intersection
    return [[r, c] for r, c in pacific & atlantic]


# BFS version
from collections import deque

def pacificAtlantic_bfs(heights: List[List[int]]) -> List[List[int]]:
    """BFS approach."""
    if not heights:
        return []
    
    rows, cols = len(heights), len(heights[0])
    
    def bfs(starts):
        """Multi-source BFS from given starting cells."""
        reachable = set(starts)
        queue = deque(starts)
        
        while queue:
            r, c = queue.popleft()
            
            for dr, dc in [(0,1), (0,-1), (1,0), (-1,0)]:
                nr, nc = r + dr, c + dc
                
                if 0 <= nr < rows and 0 <= nc < cols:
                    if (nr, nc) not in reachable:
                        # Can flow from (nr, nc) to (r, c) if heights[nr][nc] >= heights[r][c]
                        if heights[nr][nc] >= heights[r][c]:
                            reachable.add((nr, nc))
                            queue.append((nr, nc))
        
        return reachable
    
    # Pacific: top row + left column
    pacific_starts = [(0, c) for c in range(cols)] + [(r, 0) for r in range(1, rows)]
    pacific = bfs(pacific_starts)
    
    # Atlantic: bottom row + right column
    atlantic_starts = [(rows-1, c) for c in range(cols)] + [(r, cols-1) for r in range(rows-1)]
    atlantic = bfs(atlantic_starts)
    
    return [[r, c] for r, c in pacific & atlantic]


# Test
heights = [
    [1,2,2,3,5],
    [3,2,3,4,4],
    [2,4,5,3,1],
    [6,7,1,4,5],
    [5,1,1,2,4]
]
print(pacificAtlantic(heights))
# [[0,4],[1,3],[1,4],[2,2],[3,0],[3,1],[4,0]]
```

**JavaScript:**
```javascript
function pacificAtlantic(heights) {
    if (!heights || !heights[0]) return [];
    
    const rows = heights.length, cols = heights[0].length;
    const pacific = new Set();
    const atlantic = new Set();
    
    function dfs(r, c, reachable, prevHeight) {
        const key = `${r},${c}`;
        
        if (r < 0 || r >= rows || c < 0 || c >= cols) return;
        if (reachable.has(key) || heights[r][c] < prevHeight) return;
        
        reachable.add(key);
        
        const curr = heights[r][c];
        dfs(r + 1, c, reachable, curr);
        dfs(r - 1, c, reachable, curr);
        dfs(r, c + 1, reachable, curr);
        dfs(r, c - 1, reachable, curr);
    }
    
    // Pacific: top row + left column
    for (let c = 0; c < cols; c++) {
        dfs(0, c, pacific, heights[0][c]);
    }
    for (let r = 0; r < rows; r++) {
        dfs(r, 0, pacific, heights[r][0]);
    }
    
    // Atlantic: bottom row + right column
    for (let c = 0; c < cols; c++) {
        dfs(rows - 1, c, atlantic, heights[rows-1][c]);
    }
    for (let r = 0; r < rows; r++) {
        dfs(r, cols - 1, atlantic, heights[r][cols-1]);
    }
    
    // Find intersection
    const result = [];
    for (const key of pacific) {
        if (atlantic.has(key)) {
            const [r, c] = key.split(',').map(Number);
            result.push([r, c]);
        }
    }
    
    return result;
}
```

---

## ⚡ Complexity Analysis

| Aspect | Complexity | Notes |
|--------|------------|-------|
| **Time** | O(m × n) | Each cell visited at most twice (once per ocean) |
| **Space** | O(m × n) | Two visited sets + recursion stack |

---

## 🔄 Variations

| Variation | Difference | Example |
|-----------|------------|---------|
| Single ocean | Only check one boundary | Simpler version |
| Three+ regions | Multiple boundary conditions | More sets to intersect |
| Weighted flow | Different flow conditions | Modify comparison |

---

## ⚠️ Common Mistakes

### 1. Wrong Flow Direction

```python
# ❌ Wrong: Checking if we can flow TO neighbor (forward)
if heights[nr][nc] <= heights[r][c]:  # Water flows to lower

# ✅ Correct: Checking if neighbor can flow TO us (reverse)
if heights[nr][nc] >= heights[r][c]:  # Going "uphill" from ocean
```

### 2. Not Using Proper Starting Height

```python
# ❌ Wrong: Starting with height 0
dfs(0, c, pacific, 0)  # Will miss cells with height 0

# ✅ Correct: Start with actual boundary height
dfs(0, c, pacific, heights[0][c])
```

### 3. Duplicate Starting Cells

```python
# ❌ Be careful with corners
pacific_starts = [(0, c) for c in range(cols)] + [(r, 0) for r in range(rows)]
# (0, 0) is added twice!

# ✅ Correct: Avoid duplicates (or use set, or skip first row in column loop)
pacific_starts = [(0, c) for c in range(cols)] + [(r, 0) for r in range(1, rows)]
```

---

## 🎤 Interview Walkthrough

**Clarify (1 min):**
> "Water flows from higher to lower or equal cells. I need to find cells that can reach both Pacific (top/left) and Atlantic (bottom/right)."

**Initial thought:**
> "Naive: From each cell, DFS to both oceans - O(m²n²), too slow."

**Optimized approach (2 min):**
> "Instead, I'll reverse the problem. Start from each ocean's boundary and DFS 'uphill'. A cell that can reach an ocean = ocean can reach it going uphill. Answer = intersection of both reachable sets."

**Code (10-12 min):**
> Write DFS with clear comments about reversed direction.

**Complexity (1 min):**
> "O(m×n) time - each cell visited at most twice. O(m×n) space for the two sets."

---

## 📝 Related Problems

| Problem | Similarity | Link |
|---------|------------|------|
| Surrounded Regions | Boundary DFS | [LC 130](https://leetcode.com/problems/surrounded-regions/) |
| Number of Enclaves | Boundary marking | [LC 1020](https://leetcode.com/problems/number-of-enclaves/) |
| Longest Increasing Path | Height comparison | [LC 329](https://leetcode.com/problems/longest-increasing-path-in-a-matrix/) |

---

> **💡 Key Insight:** When asked "which cells can reach boundary X", reverse the problem: "which cells can boundary X reach?" Start from the boundary and work inward. This is a general technique for boundary reachability problems.

---

**Next:** [Surrounded Regions →](./04-Surrounded-Regions-LC130.md)
