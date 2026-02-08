# Maximal Square (LC 221)

> **The classic DP grid problem that isn't about paths.** Unlike path-sum problems, this requires thinking about "what's the largest square ending here?" The recurrence is elegant: the minimum of three neighbors plus one.

---

## 📋 Problem Statement

**LeetCode:** [221. Maximal Square](https://leetcode.com/problems/maximal-square/)

Given an `m x n` binary matrix filled with 0's and 1's, find the largest square containing only 1's and return its area.

**Examples:**
```
Input: matrix = [
  ["1","0","1","0","0"],
  ["1","0","1","1","1"],
  ["1","1","1","1","1"],
  ["1","0","0","1","0"]
]
Output: 4
Explanation: The largest square has side length 2.

Input: matrix = [["0","1"],["1","0"]]
Output: 1

Input: matrix = [["0"]]
Output: 0
```

**Constraints:**
- m == matrix.length
- n == matrix[i].length
- 1 ≤ m, n ≤ 300
- matrix[i][j] is '0' or '1'

---

## 🎯 Pattern Recognition

<details>
<summary><strong>How to Identify This Problem</strong></summary>

**This is Grid DP because:**
- 2D matrix input
- Answer at each cell depends on neighboring cells
- Building up from smaller subproblems

**But NOT a path problem because:**
- No start/end traversal
- Looking for a property (largest square) not a path sum

**Key Insight:** Define dp[i][j] = side length of largest square with bottom-right corner at (i,j)

</details>

---

## ✅ When to Use This Approach

- Finding largest/smallest rectangle or square in grid
- Cell value depends on multiple neighbors (not just path predecessors)
- "Containing only 1s" type constraints

## ❌ When NOT to Use

| Situation | Use Instead |
|-----------|-------------|
| Finding largest rectangle (not square) | Histogram stack approach |
| Path from A to B | Standard grid DP |
| Count islands | BFS/DFS |

---

## 📐 Core Insight

**The Magic Recurrence:**

For a cell (i,j) to be the bottom-right corner of a k×k square:
- Cell (i,j) must be '1'
- Cell (i-1,j) must support at least (k-1)×(k-1) square
- Cell (i,j-1) must support at least (k-1)×(k-1) square  
- Cell (i-1,j-1) must support at least (k-1)×(k-1) square

The limiting factor is the **minimum** of these three!

```
If dp[i-1][j-1] = 2, dp[i-1][j] = 2, dp[i][j-1] = 1:
The square at (i,j) can only be 1+1 = 2 (limited by left neighbor)

  [2] [2]
  [1] [?] → dp[i][j] = min(2,2,1) + 1 = 2
```

**Visual:**
```
For a 3x3 square ending at (i,j):

  [.] [.] [.] [.]
  [.] [A] [B] [.]     A = dp[i-1][j-1] must be ≥ 2
  [.] [C] [X] [.]     B = dp[i-1][j] must be ≥ 2
  [.] [.] [.] [.]     C = dp[i][j-1] must be ≥ 2
                       X = current cell, must be '1'
```

---

## 💻 Solution 1: 2D DP

```python
def maximalSquare(matrix: list[list[str]]) -> int:
    """
    Find largest square of 1s in binary matrix.
    
    dp[i][j] = side length of largest square with 
               bottom-right corner at (i, j)
    
    Time: O(m*n), Space: O(m*n)
    """
    if not matrix or not matrix[0]:
        return 0
    
    m, n = len(matrix), len(matrix[0])
    dp = [[0] * n for _ in range(m)]
    max_side = 0
    
    for i in range(m):
        for j in range(n):
            if matrix[i][j] == '1':
                if i == 0 or j == 0:
                    # First row or column: max square is 1x1
                    dp[i][j] = 1
                else:
                    # Take min of three neighbors + 1
                    dp[i][j] = min(
                        dp[i-1][j],      # top
                        dp[i][j-1],      # left
                        dp[i-1][j-1]     # diagonal
                    ) + 1
                
                max_side = max(max_side, dp[i][j])
    
    return max_side * max_side  # Return area
```

```javascript
function maximalSquare(matrix) {
    if (!matrix.length || !matrix[0].length) return 0;
    
    const m = matrix.length, n = matrix[0].length;
    const dp = Array.from({length: m}, () => Array(n).fill(0));
    let maxSide = 0;
    
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            if (matrix[i][j] === '1') {
                if (i === 0 || j === 0) {
                    dp[i][j] = 1;
                } else {
                    dp[i][j] = Math.min(
                        dp[i-1][j],
                        dp[i][j-1],
                        dp[i-1][j-1]
                    ) + 1;
                }
                maxSide = Math.max(maxSide, dp[i][j]);
            }
        }
    }
    
    return maxSide * maxSide;
}
```

---

## 💻 Solution 2: Space-Optimized (1D Array)

```python
def maximalSquare(matrix: list[list[str]]) -> int:
    """
    Space-optimized version using single row.
    
    Key: We need dp[i-1][j-1] (diagonal), but when we update
    dp[j], we lose it. So we save it before updating.
    
    Time: O(m*n), Space: O(n)
    """
    if not matrix or not matrix[0]:
        return 0
    
    m, n = len(matrix), len(matrix[0])
    dp = [0] * n
    max_side = 0
    prev_diagonal = 0  # dp[i-1][j-1]
    
    for i in range(m):
        for j in range(n):
            temp = dp[j]  # Save before overwriting (becomes next diagonal)
            
            if matrix[i][j] == '1':
                if i == 0 or j == 0:
                    dp[j] = 1
                else:
                    dp[j] = min(dp[j], dp[j-1], prev_diagonal) + 1
                max_side = max(max_side, dp[j])
            else:
                dp[j] = 0  # Reset if current cell is 0
            
            prev_diagonal = temp
        
        prev_diagonal = 0  # Reset for new row
    
    return max_side * max_side
```

```javascript
function maximalSquareOptimized(matrix) {
    if (!matrix.length || !matrix[0].length) return 0;
    
    const m = matrix.length, n = matrix[0].length;
    const dp = Array(n).fill(0);
    let maxSide = 0, prevDiagonal = 0;
    
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            const temp = dp[j];
            
            if (matrix[i][j] === '1') {
                if (i === 0 || j === 0) {
                    dp[j] = 1;
                } else {
                    dp[j] = Math.min(dp[j], dp[j-1], prevDiagonal) + 1;
                }
                maxSide = Math.max(maxSide, dp[j]);
            } else {
                dp[j] = 0;
            }
            
            prevDiagonal = temp;
        }
        prevDiagonal = 0;
    }
    
    return maxSide * maxSide;
}
```

---

## 🔄 Trace Example

```
Matrix:
  ["1","0","1","0","0"]
  ["1","0","1","1","1"]
  ["1","1","1","1","1"]
  ["1","0","0","1","0"]

DP Table (after filling):
  [1, 0, 1, 0, 0]
  [1, 0, 1, 1, 1]
  [1, 1, 1, 2, 2]   ← dp[2][3] = min(1,1,1)+1 = 2
  [1, 0, 0, 1, 0]

Max side = 2, Area = 4 ✓
```

---

## ⚡ Complexity Analysis

| Approach | Time | Space |
|----------|------|-------|
| 2D DP | O(m×n) | O(m×n) |
| 1D Optimized | O(m×n) | O(n) |

**Why O(m×n) time:** Visit each cell exactly once, O(1) work per cell.

---

## ⚠️ Common Mistakes

### 1. Forgetting the min() Logic
```python
# ❌ Wrong: Taking max or just adding
dp[i][j] = dp[i-1][j-1] + 1

# ✅ Correct: The limiting factor is the minimum
dp[i][j] = min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]) + 1
```

### 2. Returning Side Instead of Area
```python
# ❌ Wrong
return max_side

# ✅ Correct
return max_side * max_side
```

### 3. Not Handling Character '0' vs Integer 0
```python
# ❌ Wrong (matrix contains strings!)
if matrix[i][j] == 1:

# ✅ Correct
if matrix[i][j] == '1':
```

### 4. Not Resetting dp[j] When Cell is '0'
```python
# ❌ Wrong in 1D optimization (carries over old value)
if matrix[i][j] == '1':
    dp[j] = ...

# ✅ Correct
if matrix[i][j] == '1':
    dp[j] = ...
else:
    dp[j] = 0  # Must reset!
```

---

## 🔗 Related Problems

| Problem | Similarity | Key Difference |
|---------|------------|----------------|
| [85. Maximal Rectangle](https://leetcode.com/problems/maximal-rectangle/) | Same matrix type | Rectangle not square - use histogram |
| [1277. Count Square Submatrices](https://leetcode.com/problems/count-square-submatrices-with-all-ones/) | Same DP | Count all squares, not just max |
| [764. Largest Plus Sign](https://leetcode.com/problems/largest-plus-sign/) | Grid DP | Different shape (plus, not square) |

---

## 📝 Practice Problems

| Problem | Difficulty | Key Insight |
|---------|------------|-------------|
| [221. Maximal Square](https://leetcode.com/problems/maximal-square/) | Medium | min(3 neighbors) + 1 |
| [1277. Count Square Submatrices](https://leetcode.com/problems/count-square-submatrices-with-all-ones/) | Medium | Sum all dp values |
| [85. Maximal Rectangle](https://leetcode.com/problems/maximal-rectangle/) | Hard | Histogram per row |

---

## 🎤 Interview Tips

<details>
<summary><strong>How to Present This Solution</strong></summary>

**Opening:**
> "This is a grid DP problem, but instead of paths, we're finding the largest square. The key insight is defining dp[i][j] as the side length of the largest square with its bottom-right corner at (i,j)."

**Explaining the Recurrence:**
> "For cell (i,j) to be part of a larger square, all three neighbors—top, left, and diagonal—must support at least that size. So we take the minimum of those three and add 1."

**Optimization:**
> "We can reduce space from O(mn) to O(n) by keeping only the current row, but we need to save the diagonal value before overwriting."

</details>

**Company Focus:**
| Company | Frequency | Notes |
|---------|-----------|-------|
| Amazon | ⭐⭐⭐ | Common interview question |
| Meta | ⭐⭐⭐ | Tests DP fundamentals |
| Google | ⭐⭐ | May ask follow-ups |

---

> **💡 Key Insight:** The largest square at (i,j) is limited by the smallest of its three supporting neighbors. This elegant min()+1 recurrence is the heart of the solution.

> **🔗 Related:** [Grid DP Fundamentals](../5.1-Grid-DP-Fundamentals.md) | [Unique Paths](01-Unique-Paths-LC62.md)
