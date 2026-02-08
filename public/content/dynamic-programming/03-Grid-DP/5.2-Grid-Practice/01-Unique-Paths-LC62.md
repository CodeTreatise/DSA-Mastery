# Unique Paths (LC 62)

> **The canonical Grid DP problem.** This problem establishes the foundation for all 2D path counting and optimization problems. If you understand this, you understand Grid DP.

---

## 📋 Problem Statement

**LeetCode:** [62. Unique Paths](https://leetcode.com/problems/unique-paths/)

A robot is at the top-left corner of an `m × n` grid. It can only move right or down. How many unique paths exist to reach the bottom-right corner?

**Constraints:**
- 1 ≤ m, n ≤ 100

---

## 🎯 Pattern Recognition

**This is Grid DP because:**
- 2D grid traversal
- Constrained movement (right/down only)
- Counting paths (combine from previous cells)
- `dp[i][j] = dp[i-1][j] + dp[i][j-1]`

**Signals:**
- "unique paths", "number of ways"
- "only move right or down"
- "m × n grid"

---

## 📐 Approach Analysis

### Understanding the Recurrence

```
To reach cell (i, j), robot must come from either:
- Cell above: (i-1, j) → move down
- Cell to left: (i, j-1) → move right

paths(i, j) = paths(i-1, j) + paths(i, j-1)
```

**Visualization:**
```
Grid 3x7:
[1] [1] [1] [1] [1] [1] [1]  ← First row: 1 way each
[1] [2] [3] [4] [5] [6] [7]
[1] [3] [6] [10][15][21][28] ← Answer: 28

Each cell = top + left
dp[2][6] = dp[1][6] + dp[2][5] = 7 + 21 = 28
```

**Base Cases:**
- First row: only one way (go right continuously)
- First column: only one way (go down continuously)

---

## 💻 Solutions

### Solution 1: 2D DP

```python
def unique_paths_2d(m: int, n: int) -> int:
    """
    Standard 2D DP approach.
    Time: O(m*n), Space: O(m*n)
    """
    dp = [[1] * n for _ in range(m)]  # Initialize all 1s
    
    for i in range(1, m):
        for j in range(1, n):
            dp[i][j] = dp[i-1][j] + dp[i][j-1]
    
    return dp[m-1][n-1]
```

### Solution 2: Space Optimized (Optimal)

```python
def unique_paths(m: int, n: int) -> int:
    """
    Only need previous row.
    Time: O(m*n), Space: O(n)
    """
    dp = [1] * n
    
    for i in range(1, m):
        for j in range(1, n):
            # dp[j] = old dp[j] (from row above) + dp[j-1] (from left)
            dp[j] = dp[j] + dp[j-1]
    
    return dp[n-1]
```

```javascript
function uniquePaths(m, n) {
    const dp = new Array(n).fill(1);
    
    for (let i = 1; i < m; i++) {
        for (let j = 1; j < n; j++) {
            dp[j] = dp[j] + dp[j-1];
        }
    }
    
    return dp[n-1];
}
```

### Solution 3: Math (Combinatorics)

```python
def unique_paths_math(m: int, n: int) -> int:
    """
    We need (m-1) down moves and (n-1) right moves.
    Total moves: (m-1) + (n-1) = m+n-2
    Choose which are down: C(m+n-2, m-1)
    
    Time: O(min(m,n)), Space: O(1)
    """
    from math import comb
    return comb(m + n - 2, m - 1)

# Without library:
def unique_paths_math_manual(m: int, n: int) -> int:
    # C(m+n-2, min(m-1, n-1)) to minimize multiplications
    total = m + n - 2
    choose = min(m - 1, n - 1)
    
    result = 1
    for i in range(choose):
        result = result * (total - i) // (i + 1)
    
    return result
```

---

## ⚡ Complexity Comparison

| Approach | Time | Space | Notes |
|----------|------|-------|-------|
| 2D DP | O(m×n) | O(m×n) | Easy to understand |
| **1D DP** | **O(m×n)** | **O(n)** | **Optimal for interview** |
| Math | O(min(m,n)) | O(1) | Best theoretically |

**Why 1D is usually best for interviews:**
- Shows you understand space optimization
- More applicable to variations (obstacles, weighted)
- Math approach doesn't generalize

---

## 🔄 Space Optimization Explained

```python
# How 1D optimization works:

# 2D version:
dp[i][j] = dp[i-1][j] + dp[i][j-1]
#          ↑ top        ↑ left

# 1D version:
# Before update: dp[j] contains value from row i-1 (= top)
# After dp[j-1] updated: contains value from row i (= left)
dp[j] = dp[j] + dp[j-1]
#       ↑old    ↑new
```

**Visual trace:**
```
Initial:    [1, 1, 1]
Row 1:
  j=1: dp[1] = dp[1] + dp[0] = 1 + 1 = 2 → [1, 2, 1]
  j=2: dp[2] = dp[2] + dp[1] = 1 + 2 = 3 → [1, 2, 3]
Row 2:
  j=1: dp[1] = dp[1] + dp[0] = 2 + 1 = 3 → [1, 3, 3]
  j=2: dp[2] = dp[2] + dp[1] = 3 + 3 = 6 → [1, 3, 6]
```

---

## ⚠️ Common Mistakes

### 1. Starting Loop at 0 Instead of 1

**❌ Wrong:**
```python
for i in range(m):
    for j in range(n):
        dp[j] = dp[j] + dp[j-1]  # When j=0, dp[-1] is wrong!
```

**✅ Correct:**
```python
for i in range(1, m):  # Skip first row
    for j in range(1, n):  # Skip first column
        dp[j] = dp[j] + dp[j-1]
```

### 2. Wrong Initialization

**❌ Wrong:**
```python
dp = [0] * n
# First row should be 1s, not 0s!
```

**✅ Correct:**
```python
dp = [1] * n  # First row all 1s (one way to reach each cell)
```

### 3. Confusing m and n

**❌ Wrong:**
```python
dp = [1] * m  # Using rows instead of columns
for i in range(1, n):  # Swapped!
```

**✅ Correct:**
```python
# m = rows, n = columns
dp = [1] * n  # n columns
for i in range(1, m):  # m rows
```

---

## 🔄 Variations

### Unique Paths II (with Obstacles)

```python
def unique_paths_ii(grid: list[list[int]]) -> int:
    """
    grid[i][j] = 1 means obstacle
    """
    m, n = len(grid), len(grid[0])
    
    if grid[0][0] == 1 or grid[m-1][n-1] == 1:
        return 0
    
    dp = [0] * n
    dp[0] = 1
    
    for i in range(m):
        for j in range(n):
            if grid[i][j] == 1:
                dp[j] = 0
            elif j > 0:
                dp[j] += dp[j-1]
    
    return dp[n-1]
```

### Unique Paths III (Must Visit All Empty)

This becomes a backtracking problem, not DP!

---

## 📊 Trace Through Example

```
m = 3, n = 3

Initial dp: [1, 1, 1]

i = 1:
  j = 1: dp[1] = 1 + 1 = 2 → [1, 2, 1]
  j = 2: dp[2] = 1 + 2 = 3 → [1, 2, 3]

i = 2:
  j = 1: dp[1] = 2 + 1 = 3 → [1, 3, 3]
  j = 2: dp[2] = 3 + 3 = 6 → [1, 3, 6]

Answer: dp[2] = 6

Verification (3x3 grid):
Path 1: RRD D → right, right, down, down
Path 2: RD RD → right, down, right, down
Path 3: RD DR → right, down, down, right
Path 4: D RRD → down, right, right, down
Path 5: D RD R → down, right, down, right
Path 6: D DRR → down, down, right, right
```

---

## 📝 Related Problems

- [ ] [Unique Paths II](https://leetcode.com/problems/unique-paths-ii/) - With obstacles
- [ ] [Minimum Path Sum](https://leetcode.com/problems/minimum-path-sum/) - Sum instead of count
- [ ] [Triangle](https://leetcode.com/problems/triangle/) - Different shape
- [ ] [Unique Paths III](https://leetcode.com/problems/unique-paths-iii/) - Backtracking needed

---

## 🎤 Interview Tips

**Time to solve:** 10-15 minutes

**Communication template:**
> "Each cell can be reached from either above or the left. So the number of paths to cell (i,j) is the sum of paths to (i-1,j) and (i,j-1). The first row and column are all 1s since there's only one way to reach them. I can optimize space by keeping just one row."

**Follow-up responses:**
- "What about obstacles?" → Set dp to 0 for obstacle cells
- "What about weighted paths?" → Use min/max instead of sum
- "Is there a math solution?" → Yes, C(m+n-2, m-1), but DP generalizes better

**Company frequency:**
| Company | Frequency |
|---------|-----------|
| Amazon | ⭐⭐⭐ |
| Google | ⭐⭐⭐ |
| Meta | ⭐⭐⭐ |
| Microsoft | ⭐⭐⭐ |

---

> **💡 Key Insight:** This is the 2D equivalent of Climbing Stairs. In Climbing Stairs, `dp[n] = dp[n-1] + dp[n-2]`. Here, `dp[i][j] = dp[i-1][j] + dp[i][j-1]`. The pattern is the same—combine ways to reach previous states.

> **🔗 Related:** [Grid DP Fundamentals](../5.1-Grid-DP-Fundamentals.md) | [Climbing Stairs](../../02-Fibonacci-Pattern/4.4-Fibonacci-Practice/01-Climbing-Stairs-LC70.md)
