# Triangle (LC 120)

> **Bottom-up Grid DP with an irregular shape.** This problem teaches you to think about direction—sometimes top-down isn't the best approach. Processing from bottom to top simplifies the logic significantly.

---

## 📋 Problem Statement

**LeetCode:** [120. Triangle](https://leetcode.com/problems/triangle/)

Given a triangle array, return the minimum path sum from top to bottom. Each step, you may move to an adjacent number on the row below.

**Example:**
```
    [2]
   [3,4]
  [6,5,7]
 [4,1,8,3]
```
Minimum path: 2 → 3 → 5 → 1 = 11

**Constraints:**
- 1 ≤ triangle.length ≤ 200
- triangle[i].length = i + 1
- -10⁴ ≤ triangle[i][j] ≤ 10⁴

---

## 🎯 Pattern Recognition

**This is Grid DP because:**
- Moving through a 2D structure
- Constrained movement (adjacent on next row)
- Finding optimal path

**The twist:**
- Triangle shape (not rectangular)
- From position j, can move to j or j+1 on next row
- Bottom-up processing is cleaner than top-down

---

## 📐 Approach Analysis

### Top-Down vs Bottom-Up

**Top-Down (complex):**
```
At row i, position j:
- Come from (i-1, j-1) or (i-1, j)
- But j-1 might not exist at edges!
- Lots of edge case handling
```

**Bottom-Up (clean):**
```
At row i, position j:
- Go to (i+1, j) or (i+1, j+1)
- Both always exist!
- dp[j] = triangle[i][j] + min(dp[j], dp[j+1])
```

**Visualization (Bottom-Up):**
```
Start with bottom row:
[4] [1] [8] [3]

Row 2: [6,5,7] → pick min below for each
  6 + min(4,1) = 7
  5 + min(1,8) = 6
  7 + min(8,3) = 10
→ [7] [6] [10] [3]

Row 1: [3,4]
  3 + min(7,6) = 9
  4 + min(6,10) = 10
→ [9] [10] [10] [3]

Row 0: [2]
  2 + min(9,10) = 11
→ [11] [10] [10] [3]

Answer: 11
```

---

## 💻 Solutions

### Solution 1: Bottom-Up with O(n) Space (Optimal)

```python
def minimum_total(triangle: list[list[int]]) -> int:
    """
    Start from bottom row, work up.
    dp[j] = min path sum starting from position j on current row.
    
    Time: O(n²), Space: O(n) where n = number of rows
    """
    n = len(triangle)
    
    # Start with bottom row
    dp = triangle[-1][:]
    
    # Work up from second-to-last row
    for i in range(n - 2, -1, -1):
        for j in range(i + 1):  # Row i has i+1 elements
            dp[j] = triangle[i][j] + min(dp[j], dp[j + 1])
    
    return dp[0]
```

```javascript
function minimumTotal(triangle) {
    const n = triangle.length;
    const dp = [...triangle[n - 1]];
    
    for (let i = n - 2; i >= 0; i--) {
        for (let j = 0; j <= i; j++) {
            dp[j] = triangle[i][j] + Math.min(dp[j], dp[j + 1]);
        }
    }
    
    return dp[0];
}
```

### Solution 2: Top-Down with Memoization

```python
def minimum_total_memo(triangle: list[list[int]]) -> int:
    """
    Top-down recursive approach.
    """
    n = len(triangle)
    memo = {}
    
    def helper(i, j):
        if i == n - 1:
            return triangle[i][j]
        
        if (i, j) in memo:
            return memo[(i, j)]
        
        # Go to j or j+1 on next row
        left = helper(i + 1, j)
        right = helper(i + 1, j + 1)
        
        memo[(i, j)] = triangle[i][j] + min(left, right)
        return memo[(i, j)]
    
    return helper(0, 0)
```

### Solution 3: Top-Down Tabulation

```python
def minimum_total_topdown(triangle: list[list[int]]) -> int:
    """
    Top-down but more complex edge handling.
    """
    n = len(triangle)
    dp = [[float('inf')] * len(row) for row in triangle]
    
    dp[0][0] = triangle[0][0]
    
    for i in range(1, n):
        for j in range(i + 1):
            # From position j-1 (if exists)
            if j > 0:
                dp[i][j] = min(dp[i][j], dp[i-1][j-1] + triangle[i][j])
            # From position j (if exists)
            if j < i:
                dp[i][j] = min(dp[i][j], dp[i-1][j] + triangle[i][j])
    
    return min(dp[-1])  # Min of entire last row
```

---

## 🔄 Why Bottom-Up is Better

| Aspect | Top-Down | Bottom-Up |
|--------|----------|-----------|
| Edge cases | j-1 might not exist | j and j+1 always exist |
| Final answer | min of last row | Just dp[0] |
| Space | O(n²) or O(n) with tricks | O(n) naturally |
| Intuition | Where can I come from? | Where can I go? |

```
Top-Down needs boundary checks:
Row i, position j:
  - Can come from j-1 (if j > 0)
  - Can come from j (if j < i)

Bottom-Up no boundary checks:
Row i, position j:
  - Can go to j (always exists)
  - Can go to j+1 (always exists)
```

---

## ⚡ Complexity Analysis

| Approach | Time | Space |
|----------|------|-------|
| Bottom-Up 1D | O(n²) | O(n) |
| Top-Down Memo | O(n²) | O(n²) |
| Top-Down Tabulation | O(n²) | O(n²) |
| In-Place (modify input) | O(n²) | O(1) |

**Note:** n² comes from 1 + 2 + 3 + ... + n = n(n+1)/2 = O(n²)

---

## ⚠️ Common Mistakes

### 1. Wrong Loop Direction

**❌ Wrong:**
```python
for i in range(n - 2, -1, -1):
    for j in range(len(triangle[i]) - 1, -1, -1):  # Right to left
        dp[j] = ...  # Order doesn't matter but j range is wrong
```

**✅ Correct:**
```python
for i in range(n - 2, -1, -1):
    for j in range(i + 1):  # j goes 0 to i (row i has i+1 elements)
        dp[j] = triangle[i][j] + min(dp[j], dp[j + 1])
```

### 2. Forgetting Triangle Shape

**❌ Wrong:**
```python
dp = [0] * len(triangle)  # All rows same size?
```

**✅ Correct:**
```python
dp = triangle[-1][:]  # Last row is longest (n elements)
```

### 3. Using Wrong Index for Next Row

**❌ Wrong:**
```python
dp[j] = triangle[i][j] + min(dp[j-1], dp[j])  # j-1 is wrong!
```

**✅ Correct:**
```python
dp[j] = triangle[i][j] + min(dp[j], dp[j+1])  # Adjacent = j and j+1
```

---

## 📊 Trace Through Example

```
Triangle:
    [2]
   [3,4]
  [6,5,7]
 [4,1,8,3]

Initial dp (bottom row): [4, 1, 8, 3]

i = 2 (row [6,5,7]):
  j=0: dp[0] = 6 + min(4, 1) = 7
  j=1: dp[1] = 5 + min(1, 8) = 6
  j=2: dp[2] = 7 + min(8, 3) = 10
  dp: [7, 6, 10, 3]

i = 1 (row [3,4]):
  j=0: dp[0] = 3 + min(7, 6) = 9
  j=1: dp[1] = 4 + min(6, 10) = 10
  dp: [9, 10, 10, 3]

i = 0 (row [2]):
  j=0: dp[0] = 2 + min(9, 10) = 11
  dp: [11, 10, 10, 3]

Answer: dp[0] = 11
Path: 2 → 3 → 5 → 1
```

---

## 🔄 Variations

### Maximum Path Sum (Triangle)

Just change `min` to `max`:

```python
def maximum_total(triangle):
    n = len(triangle)
    dp = triangle[-1][:]
    
    for i in range(n - 2, -1, -1):
        for j in range(i + 1):
            dp[j] = triangle[i][j] + max(dp[j], dp[j + 1])
    
    return dp[0]
```

### Path to Any Bottom Cell

If you can start from any cell in row 0 (not just [0][0]):

```python
def min_any_start(triangle):
    n = len(triangle)
    dp = triangle[-1][:]
    
    for i in range(n - 2, -1, -1):
        for j in range(i + 1):
            dp[j] = triangle[i][j] + min(dp[j], dp[j + 1])
    
    return min(dp[:1])  # But actually dp[0] is still the answer
                         # since row 0 only has 1 element
```

---

## 📝 Related Problems

- [ ] [Minimum Falling Path Sum](https://leetcode.com/problems/minimum-falling-path-sum/) - Rectangular version
- [ ] [Minimum Path Sum](https://leetcode.com/problems/minimum-path-sum/) - Grid version
- [ ] [Minimum Falling Path Sum II](https://leetcode.com/problems/minimum-falling-path-sum-ii/) - Non-adjacent
- [ ] [Pascal's Triangle](https://leetcode.com/problems/pascals-triangle/) - Related structure

---

## 🎤 Interview Tips

**Time to solve:** 15-20 minutes

**Communication template:**
> "I'll process bottom-up because it's cleaner—from each position, I can always go to j or j+1 below. Starting with the bottom row as my dp array, I work up. At each position, I add the current value to the minimum of the two choices below. The answer ends up at dp[0]."

**Follow-up responses:**
- "Why bottom-up?" → Avoids edge case handling at boundaries
- "What's the space complexity?" → O(n) where n is height
- "Can you do O(1) space?" → Yes, by modifying the input triangle

**Company frequency:**
| Company | Frequency |
|---------|-----------|
| Amazon | ⭐⭐⭐ |
| Apple | ⭐⭐ |
| Microsoft | ⭐⭐ |

---

> **💡 Key Insight:** Sometimes reversing the direction of DP simplifies the problem dramatically. When "where can I go" is simpler than "where can I come from," process in the direction of movement.

> **🔗 Related:** [Min Path Sum](./02-Min-Path-Sum-LC64.md) | [Grid DP Fundamentals](../5.1-Grid-DP-Fundamentals.md) | [Unique Paths](./01-Unique-Paths-LC62.md)
