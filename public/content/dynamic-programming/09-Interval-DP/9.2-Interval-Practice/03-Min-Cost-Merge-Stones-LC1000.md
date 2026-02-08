# Minimum Cost to Merge Stones (LC 1000)

> **Interval DP with a twist: K-way merging.** Unlike simple merging where you combine 2 piles, this problem requires merging exactly K piles at a time, adding divisibility constraints and extra dimensions to the DP.

---

## 📋 Problem Statement

**LeetCode:** [1000. Minimum Cost to Merge Stones](https://leetcode.com/problems/minimum-cost-to-merge-stones/)

There are `n` piles of stones arranged in a row. The ith pile has `stones[i]` stones.

A move consists of merging exactly `k` consecutive piles into one pile, and the cost of this move is equal to the total number of stones in these k piles.

Return the minimum cost to merge all the stones into one pile. If impossible, return -1.

**Examples:**
```
Input: stones = [3, 2, 4, 1], k = 2
Output: 20
Explanation:
  Merge [3,2] → [5,4,1], cost = 5
  Merge [4,1] → [5,5], cost = 5
  Merge [5,5] → [10], cost = 10
  Total: 20

Input: stones = [3, 2, 4, 1], k = 3
Output: -1
Explanation: Cannot merge 4 piles with k=3

Input: stones = [3, 5, 1, 2, 6], k = 3
Output: 25
```

**Constraints:**
- n == stones.length
- 1 ≤ n ≤ 30
- 1 ≤ stones[i] ≤ 100
- 2 ≤ k ≤ 30

---

## 🎯 Pattern Recognition

**Why Interval DP?**
- We merge contiguous ranges of piles
- Optimal for subranges contributes to optimal for larger range
- Need to track both range AND number of piles

**Key Insight: Divisibility Check**

Each merge operation takes k piles → 1 pile.
- Start: n piles
- After one merge: n - k + 1 piles
- Each merge reduces pile count by (k - 1)

To end with 1 pile:
```
n - m(k-1) = 1
where m = number of merge operations

So: n = 1 + m(k-1)
    (n-1) mod (k-1) = 0  ← MUST BE TRUE!
```

**If (n-1) % (k-1) != 0, return -1 immediately!**

---

## 📐 Approach Analysis

### Approach 1: 3D DP (Clearer but More Space)

```
dp[i][j][p] = minimum cost to merge stones[i..j] into p piles
```

**Recurrence:**
```python
if p == 1:
    dp[i][j][1] = dp[i][j][k] + sum(stones[i..j])  # Merge k into 1
else:
    dp[i][j][p] = min(dp[i][m][1] + dp[m+1][j][p-1])  # Split
```

### Approach 2: 2D DP (Optimized)

```
dp[i][j] = minimum cost to OPTIMALLY merge stones[i..j]
           (reducing to as few piles as possible)
           
If (j-i) % (k-1) == 0: ends with 1 pile
Otherwise: ends with ((j-i) % (k-1)) + 1 piles
```

**Recurrence:**
```python
dp[i][j] = min(dp[i][m] + dp[m+1][j])  # Try all split points
if (j - i) % (k - 1) == 0:
    dp[i][j] += prefix[j+1] - prefix[i]  # Can merge to 1
```

---

## 💻 Solutions

### Solution 1: 2D DP (Optimized)

```python
def merge_stones(stones: list[int], k: int) -> int:
    """
    2D Interval DP with divisibility constraint.
    Time: O(n³), Space: O(n²)
    """
    n = len(stones)
    
    # Check if possible
    if (n - 1) % (k - 1) != 0:
        return -1
    
    # Prefix sum for range sums
    prefix = [0] * (n + 1)
    for i in range(n):
        prefix[i + 1] = prefix[i] + stones[i]
    
    def range_sum(i, j):
        return prefix[j + 1] - prefix[i]
    
    # dp[i][j] = min cost to optimally merge [i, j]
    dp = [[0] * n for _ in range(n)]
    
    # Fill by increasing length
    for length in range(2, n + 1):
        for i in range(n - length + 1):
            j = i + length - 1
            dp[i][j] = float('inf')
            
            # Split at positions where left can form complete piles
            # m is the last index of left part
            for m in range(i, j, k - 1):  # Step by k-1!
                dp[i][j] = min(dp[i][j], dp[i][m] + dp[m + 1][j])
            
            # If this range can merge to 1 pile, add merge cost
            if (j - i) % (k - 1) == 0:
                dp[i][j] += range_sum(i, j)
    
    return dp[0][n - 1]
```

```javascript
function mergeStones(stones, k) {
    const n = stones.length;
    
    // Check if possible
    if ((n - 1) % (k - 1) !== 0) return -1;
    
    // Prefix sum
    const prefix = new Array(n + 1).fill(0);
    for (let i = 0; i < n; i++) {
        prefix[i + 1] = prefix[i] + stones[i];
    }
    
    const rangeSum = (i, j) => prefix[j + 1] - prefix[i];
    
    // dp[i][j] = min cost to optimally merge [i, j]
    const dp = Array.from({length: n}, () => new Array(n).fill(0));
    
    for (let len = 2; len <= n; len++) {
        for (let i = 0; i <= n - len; i++) {
            const j = i + len - 1;
            dp[i][j] = Infinity;
            
            // Split points (step by k-1)
            for (let m = i; m < j; m += k - 1) {
                dp[i][j] = Math.min(dp[i][j], dp[i][m] + dp[m + 1][j]);
            }
            
            // Can merge to 1 pile?
            if ((j - i) % (k - 1) === 0) {
                dp[i][j] += rangeSum(i, j);
            }
        }
    }
    
    return dp[0][n - 1];
}
```

### Solution 2: 3D DP (More Intuitive)

```python
def merge_stones_3d(stones: list[int], k: int) -> int:
    """
    3D DP: dp[i][j][p] = cost to merge [i,j] into p piles
    Time: O(n³ * k), Space: O(n² * k)
    """
    n = len(stones)
    
    if (n - 1) % (k - 1) != 0:
        return -1
    
    # Prefix sum
    prefix = [0] * (n + 1)
    for i in range(n):
        prefix[i + 1] = prefix[i] + stones[i]
    
    # dp[i][j][p] = min cost to merge [i,j] into p piles
    INF = float('inf')
    dp = [[[INF] * (k + 1) for _ in range(n)] for _ in range(n)]
    
    # Base case: single pile stays as 1 pile with 0 cost
    for i in range(n):
        dp[i][i][1] = 0
    
    for length in range(2, n + 1):
        for i in range(n - length + 1):
            j = i + length - 1
            
            # Build up from 2 piles to k piles
            for p in range(2, k + 1):
                for m in range(i, j):
                    # Left part forms 1 pile, right forms p-1 piles
                    dp[i][j][p] = min(dp[i][j][p], 
                                      dp[i][m][1] + dp[m + 1][j][p - 1])
            
            # Can merge k piles into 1
            if dp[i][j][k] < INF:
                dp[i][j][1] = dp[i][j][k] + (prefix[j + 1] - prefix[i])
    
    return dp[0][n - 1][1] if dp[0][n - 1][1] < INF else -1
```

### Solution 3: Top-Down with Memoization

```python
def merge_stones_memo(stones: list[int], k: int) -> int:
    """Recursive approach with memoization."""
    n = len(stones)
    
    if (n - 1) % (k - 1) != 0:
        return -1
    
    prefix = [0] * (n + 1)
    for i in range(n):
        prefix[i + 1] = prefix[i] + stones[i]
    
    from functools import lru_cache
    
    @lru_cache(maxsize=None)
    def dp(i, j):
        """Min cost to optimally merge [i, j]."""
        if i == j:
            return 0
        
        result = float('inf')
        for m in range(i, j, k - 1):
            result = min(result, dp(i, m) + dp(m + 1, j))
        
        # Add merge cost if can reduce to 1 pile
        if (j - i) % (k - 1) == 0:
            result += prefix[j + 1] - prefix[i]
        
        return result
    
    return dp(0, n - 1)
```

---

## ⚡ Complexity Analysis

| Approach | Time | Space |
|----------|------|-------|
| 2D DP | O(n³/(k-1)) | O(n²) |
| 3D DP | O(n³k) | O(n²k) |
| Memoization | O(n³/(k-1)) | O(n²) |

**Why the step by (k-1)?**
- When splitting, left part must reduce to 1 pile
- Size of left part must satisfy (size - 1) % (k - 1) == 0
- This means split points are at i, i+(k-1), i+2(k-1), ...

---

## 📊 Trace Through Example

```
stones = [3, 5, 1, 2, 6], k = 3
n = 5, (n-1) % (k-1) = 4 % 2 = 0 ✓ (possible)

prefix = [0, 3, 8, 9, 11, 17]

Length 2:
  dp[0][1] = 0 (can't merge 2 with k=3)
  dp[1][2] = 0
  dp[2][3] = 0
  dp[3][4] = 0

Length 3:
  dp[0][2]: split at m=0 only (step k-1=2)
    = dp[0][0] + dp[1][2] = 0 + 0 = 0
    (3-0) % 2 = 0, add sum[0..2] = 9
    dp[0][2] = 9 (merge [3,5,1] → [9])
    
  dp[1][3] = dp[1][1] + dp[2][3] = 0 + 0 = 0
    add sum[1..3] = 8
    dp[1][3] = 8 (merge [5,1,2] → [8])
    
  dp[2][4] = dp[2][2] + dp[3][4] = 0 + 0 = 0
    add sum[2..4] = 9
    dp[2][4] = 9 (merge [1,2,6] → [9])

Length 4:
  dp[0][3]: split at m=0, m=2
    m=0: dp[0][0] + dp[1][3] = 0 + 8 = 8
    m=2: dp[0][2] + dp[3][3] = 9 + 0 = 9
    dp[0][3] = 8
    (4-0) % 2 = 1 ≠ 0, don't add merge cost
    Result: 2 piles

  dp[1][4]: split at m=1, m=3
    m=1: dp[1][1] + dp[2][4] = 0 + 9 = 9
    m=3: dp[1][3] + dp[4][4] = 8 + 0 = 8
    dp[1][4] = 8
    (4-1) % 2 = 1 ≠ 0, don't add

Length 5:
  dp[0][4]: split at m=0, m=2, m=4
    m=0: dp[0][0] + dp[1][4] = 0 + 8 = 8
    m=2: dp[0][2] + dp[3][4] = 9 + 0 = 9
    m=4 is out of range (m < j)
    dp[0][4] = 8
    (5-0) % 2 = 0, add sum[0..4] = 17
    dp[0][4] = 8 + 17 = 25

Answer: 25
```

---

## ⚠️ Common Mistakes

### 1. Forgetting Divisibility Check

**❌ Wrong:**
```python
def merge_stones(stones, k):
    n = len(stones)
    # Start computing without checking if possible
    ...
```

**✅ Correct:**
```python
def merge_stones(stones, k):
    n = len(stones)
    if (n - 1) % (k - 1) != 0:
        return -1  # Impossible!
    ...
```

### 2. Wrong Split Point Step

**❌ Wrong:**
```python
for m in range(i, j):  # Step by 1
    dp[i][j] = min(dp[i][j], dp[i][m] + dp[m+1][j])
```

**✅ Correct:**
```python
for m in range(i, j, k - 1):  # Step by k-1!
    dp[i][j] = min(dp[i][j], dp[i][m] + dp[m+1][j])
```

### 3. Adding Merge Cost When Can't Merge

**❌ Wrong:**
```python
dp[i][j] += range_sum(i, j)  # Always add
```

**✅ Correct:**
```python
if (j - i) % (k - 1) == 0:  # Only when can form 1 pile
    dp[i][j] += range_sum(i, j)
```

### 4. Confusing Final Merge

```
After optimally processing [i, j], how many piles remain?
- (j - i) % (k - 1) tells you:
  - If 0: ends with 1 pile
  - If 1: ends with 2 piles
  - If r: ends with r+1 piles
```

---

## 🔗 Comparison: k=2 vs k>2

### k=2 (Standard Merge)

```python
def merge_stones_k2(stones):
    """Classic stone merge with k=2."""
    n = len(stones)
    prefix = [0] * (n + 1)
    for i in range(n):
        prefix[i + 1] = prefix[i] + stones[i]
    
    dp = [[0] * n for _ in range(n)]
    
    for length in range(2, n + 1):
        for i in range(n - length + 1):
            j = i + length - 1
            dp[i][j] = float('inf')
            
            for m in range(i, j):  # All split points valid
                cost = dp[i][m] + dp[m + 1][j] + (prefix[j+1] - prefix[i])
                dp[i][j] = min(dp[i][j], cost)
    
    return dp[0][n - 1]
```

### k>2 (This Problem)

Key differences:
1. Divisibility check at start
2. Split points step by (k-1)
3. Merge cost only added when range can reduce to 1 pile

---

## 📝 Practice Problems

| Problem | Difficulty | Note |
|---------|------------|------|
| [1039. Minimum Score Triangulation](https://leetcode.com/problems/minimum-score-triangulation-of-polygon/) | Medium | k=3 fixed |
| [312. Burst Balloons](https://leetcode.com/problems/burst-balloons/) | Hard | Think last not first |
| [546. Remove Boxes](https://leetcode.com/problems/remove-boxes/) | Hard | 3D state |
| [1547. Minimum Cost to Cut a Stick](https://leetcode.com/problems/minimum-cost-to-cut-a-stick/) | Hard | Similar structure |

---

## 🎤 Interview Tips

**Time to solve:** 35-40 minutes (Hard)

**Communication template:**
> "First, I need to check if it's even possible to merge into 1 pile. Each merge takes k piles → 1, reducing by k-1. So I need (n-1) divisible by (k-1).

> I'll use interval DP: dp[i][j] = minimum cost to optimally merge stones[i..j].

> The key insight is that split points must be at intervals of (k-1), because the left part needs to reduce to exactly 1 pile before we can use it in a k-merge.

> If a range [i,j] can be reduced to 1 pile ((j-i) % (k-1) == 0), I add the merge cost (sum of all stones in range)."

**Key insight to emphasize:**
> "The divisibility constraint (n-1) % (k-1) == 0 is crucial. Also, stepping through split points by (k-1) ensures valid pile counts."

**Company frequency:**
| Company | Frequency |
|---------|-----------|
| Google | ⭐⭐⭐⭐⭐ |
| Amazon | ⭐⭐⭐ |
| ByteDance | ⭐⭐⭐⭐ |

---

> **💡 Key Insight:** The divisibility constraint (n-1) % (k-1) == 0 determines solvability, and stepping through split points by (k-1) ensures we only consider valid merge sequences where the left part can actually form a single pile.

> **🔗 Related:** [Interval DP Pattern](../9.1-Interval-DP-Pattern.md) | [Burst Balloons](./02-Burst-Balloons-LC312.md) | [Matrix Chain Multiplication](../9.1-Interval-DP-Pattern.md)
