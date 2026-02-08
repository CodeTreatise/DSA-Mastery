# Minimum Path Sum (LC 64)

> **The optimization variant of Grid DP.** Instead of counting paths, find the path with minimum sum. This pattern extends to many real-world optimization problems.

---

## 📋 Problem Statement

**LeetCode:** [64. Minimum Path Sum](https://leetcode.com/problems/minimum-path-sum/)

Given an `m × n` grid filled with non-negative numbers, find a path from top-left to bottom-right that minimizes the sum of all numbers along the path. You can only move right or down.

**Constraints:**
- m, n ≤ 200
- 0 ≤ grid[i][j] ≤ 200

---

## 🎯 Pattern Recognition

**This is Grid DP because:**
- 2D grid traversal with constrained movement
- Optimal substructure: min path to (i,j) = min(from top, from left) + current
- `dp[i][j] = min(dp[i-1][j], dp[i][j-1]) + grid[i][j]`

**Signals:**
- "minimum sum", "optimal path"
- "only move right or down"
- "m × n grid"

**Difference from Unique Paths:**
- Unique Paths: `dp[i][j] = dp[i-1][j] + dp[i][j-1]` (count)
- Min Path Sum: `dp[i][j] = min(dp[i-1][j], dp[i][j-1]) + grid[i][j]` (optimize)

---

## 📐 Approach Analysis

### Understanding the Recurrence

```
At cell (i, j), minimum sum = current cell + min of:
- Coming from top: dp[i-1][j]
- Coming from left: dp[i][j-1]

dp[i][j] = grid[i][j] + min(dp[i-1][j], dp[i][j-1])
```

**Visualization:**
```
Grid:
[1] [3] [1]
[1] [5] [1]
[4] [2] [1]

DP:
[1] [4] [5]      dp[0][1] = 3 + 1 = 4
[2] [7] [6]      dp[1][1] = 5 + min(4, 2) = 7
[6] [8] [7]      dp[2][2] = 1 + min(6, 8) = 7

Answer: 7 (path: 1→3→1→1→1 or 1→1→5→1→1... wait)
Optimal path: 1 → 3 → 1 → 1 → 1 = 7
```

---

## 💻 Solutions

### Solution 1: 2D DP

```python
def min_path_sum_2d(grid: list[list[int]]) -> int:
    """
    Standard 2D DP.
    Time: O(m*n), Space: O(m*n)
    """
    m, n = len(grid), len(grid[0])
    dp = [[0] * n for _ in range(m)]
    
    # Base case: starting cell
    dp[0][0] = grid[0][0]
    
    # First row: can only come from left
    for j in range(1, n):
        dp[0][j] = dp[0][j-1] + grid[0][j]
    
    # First column: can only come from top
    for i in range(1, m):
        dp[i][0] = dp[i-1][0] + grid[i][0]
    
    # Rest of grid
    for i in range(1, m):
        for j in range(1, n):
            dp[i][j] = min(dp[i-1][j], dp[i][j-1]) + grid[i][j]
    
    return dp[m-1][n-1]
```

### Solution 2: Space Optimized (Optimal)

```python
def min_path_sum(grid: list[list[int]]) -> int:
    """
    Only need previous row.
    Time: O(m*n), Space: O(n)
    """
    m, n = len(grid), len(grid[0])
    dp = [0] * n
    
    for i in range(m):
        for j in range(n):
            if i == 0 and j == 0:
                dp[j] = grid[0][0]
            elif i == 0:
                dp[j] = dp[j-1] + grid[i][j]  # First row
            elif j == 0:
                dp[j] = dp[j] + grid[i][j]    # First column
            else:
                dp[j] = min(dp[j], dp[j-1]) + grid[i][j]
    
    return dp[n-1]
```

```javascript
function minPathSum(grid) {
    const m = grid.length, n = grid[0].length;
    const dp = new Array(n).fill(0);
    
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            if (i === 0 && j === 0) {
                dp[j] = grid[0][0];
            } else if (i === 0) {
                dp[j] = dp[j-1] + grid[i][j];
            } else if (j === 0) {
                dp[j] = dp[j] + grid[i][j];
            } else {
                dp[j] = Math.min(dp[j], dp[j-1]) + grid[i][j];
            }
        }
    }
    
    return dp[n-1];
}
```

### Solution 3: In-Place (Modifying Input)

```python
def min_path_sum_inplace(grid: list[list[int]]) -> int:
    """
    Modify grid in place - O(1) extra space.
    Only use if you're allowed to modify input!
    """
    m, n = len(grid), len(grid[0])
    
    # First row
    for j in range(1, n):
        grid[0][j] += grid[0][j-1]
    
    # First column
    for i in range(1, m):
        grid[i][0] += grid[i-1][0]
    
    # Rest
    for i in range(1, m):
        for j in range(1, n):
            grid[i][j] += min(grid[i-1][j], grid[i][j-1])
    
    return grid[m-1][n-1]
```

---

## 📊 Finding the Actual Path

```python
def min_path_sum_with_path(grid: list[list[int]]) -> tuple:
    """
    Return (min_sum, path) where path is list of cells.
    """
    m, n = len(grid), len(grid[0])
    dp = [[0] * n for _ in range(m)]
    
    # Build DP table
    dp[0][0] = grid[0][0]
    for j in range(1, n):
        dp[0][j] = dp[0][j-1] + grid[0][j]
    for i in range(1, m):
        dp[i][0] = dp[i-1][0] + grid[i][0]
    for i in range(1, m):
        for j in range(1, n):
            dp[i][j] = min(dp[i-1][j], dp[i][j-1]) + grid[i][j]
    
    # Backtrack to find path
    path = [(m-1, n-1)]
    i, j = m-1, n-1
    
    while i > 0 or j > 0:
        if i == 0:
            j -= 1
        elif j == 0:
            i -= 1
        elif dp[i-1][j] < dp[i][j-1]:
            i -= 1
        else:
            j -= 1
        path.append((i, j))
    
    path.reverse()
    return dp[m-1][n-1], path
```

---

## ⚡ Complexity Analysis

| Approach | Time | Space |
|----------|------|-------|
| 2D DP | O(m×n) | O(m×n) |
| **1D DP** | **O(m×n)** | **O(n)** |
| In-Place | O(m×n) | O(1) |

---

## ⚠️ Common Mistakes

### 1. Wrong Initialization for First Row/Column

**❌ Wrong:**
```python
dp[0][j] = grid[0][j]  # Forgot to add previous!
```

**✅ Correct:**
```python
dp[0][j] = dp[0][j-1] + grid[0][j]  # Cumulative sum
```

### 2. Using `+` Instead of `min` in Recurrence

**❌ Wrong:**
```python
dp[i][j] = dp[i-1][j] + dp[i][j-1] + grid[i][j]  # This counts paths!
```

**✅ Correct:**
```python
dp[i][j] = min(dp[i-1][j], dp[i][j-1]) + grid[i][j]  # Take minimum
```

### 3. Forgetting Edge Cases in 1D

**❌ Wrong:**
```python
for i in range(m):
    for j in range(n):
        dp[j] = min(dp[j], dp[j-1]) + grid[i][j]  # Fails for j=0, i=0
```

**✅ Correct:**
```python
for i in range(m):
    for j in range(n):
        if i == 0 and j == 0:
            dp[j] = grid[0][0]
        elif i == 0:
            dp[j] = dp[j-1] + grid[i][j]
        elif j == 0:
            dp[j] = dp[j] + grid[i][j]
        else:
            dp[j] = min(dp[j], dp[j-1]) + grid[i][j]
```

---

## 🔄 Variations

### Maximum Path Sum

Just change `min` to `max`:

```python
def max_path_sum(grid):
    m, n = len(grid), len(grid[0])
    dp = [0] * n
    
    for i in range(m):
        for j in range(n):
            if i == 0 and j == 0:
                dp[j] = grid[0][0]
            elif i == 0:
                dp[j] = dp[j-1] + grid[i][j]
            elif j == 0:
                dp[j] = dp[j] + grid[i][j]
            else:
                dp[j] = max(dp[j], dp[j-1]) + grid[i][j]  # max instead of min
    
    return dp[n-1]
```

### Minimum Falling Path Sum

Can move to 3 cells below (down-left, down, down-right):

```python
def min_falling_path_sum(matrix: list[list[int]]) -> int:
    n = len(matrix)
    dp = matrix[0][:]
    
    for i in range(1, n):
        new_dp = [0] * n
        for j in range(n):
            left = dp[j-1] if j > 0 else float('inf')
            down = dp[j]
            right = dp[j+1] if j < n-1 else float('inf')
            new_dp[j] = matrix[i][j] + min(left, down, right)
        dp = new_dp
    
    return min(dp)
```

---

## 📊 Trace Through Example

```
Grid:                 DP:
[1] [3] [1]          [1] [4] [5]
[1] [5] [1]    →     [2] [7] [6]
[4] [2] [1]          [6] [8] [7]

Step by step:
dp[0][0] = 1
dp[0][1] = 1 + 3 = 4
dp[0][2] = 4 + 1 = 5
dp[1][0] = 1 + 1 = 2
dp[1][1] = min(4, 2) + 5 = 7
dp[1][2] = min(5, 7) + 1 = 6
dp[2][0] = 2 + 4 = 6
dp[2][1] = min(7, 6) + 2 = 8
dp[2][2] = min(6, 8) + 1 = 7

Answer: 7
Path: (0,0)→(0,1)→(0,2)→(1,2)→(2,2)
Values: 1 + 3 + 1 + 1 + 1 = 7
```

---

## 📝 Related Problems

- [ ] [Unique Paths](https://leetcode.com/problems/unique-paths/) - Counting variant
- [ ] [Minimum Falling Path Sum](https://leetcode.com/problems/minimum-falling-path-sum/) - 3 directions
- [ ] [Triangle](https://leetcode.com/problems/triangle/) - Different shape
- [ ] [Dungeon Game](https://leetcode.com/problems/dungeon-game/) - Backward DP

---

## 🎤 Interview Tips

**Time to solve:** 10-15 minutes

**Communication template:**
> "At each cell, the minimum sum path must come from either above or the left—whichever is smaller. So dp[i][j] = min(dp[i-1][j], dp[i][j-1]) + grid[i][j]. I'll initialize the first row and column as cumulative sums since there's only one path to reach them."

**Follow-up responses:**
- "Can you optimize space?" → Use 1D array, O(n) space
- "Can you modify the grid?" → In-place solution, O(1) extra space
- "How would you return the actual path?" → Backtrack from (m-1, n-1)

**Company frequency:**
| Company | Frequency |
|---------|-----------|
| Amazon | ⭐⭐⭐ |
| Google | ⭐⭐⭐ |
| Microsoft | ⭐⭐⭐ |
| Meta | ⭐⭐ |

---

> **💡 Key Insight:** This is Unique Paths but with `min` instead of `+`. The structure is identical—what changes is the combining operation. Counting → add. Optimization → min/max.

> **🔗 Related:** [Unique Paths](./01-Unique-Paths-LC62.md) | [Grid DP Fundamentals](../5.1-Grid-DP-Fundamentals.md) | [Triangle](./03-Triangle-LC120.md)
