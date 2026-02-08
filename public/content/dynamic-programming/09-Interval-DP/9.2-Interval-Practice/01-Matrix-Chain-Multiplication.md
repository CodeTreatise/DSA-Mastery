# Matrix Chain Multiplication

> **The canonical interval DP problem.** This problem introduced the concept of "optimal parenthesization" and gave birth to interval DP. Understanding this unlocks Burst Balloons, Palindrome Partitioning, and many more problems.

---

## 📋 Problem Statement

**Classic Problem** (Also related to [LeetCode 1039. Minimum Score Triangulation](https://leetcode.com/problems/minimum-score-triangulation-of-polygon/))

Given a sequence of matrices, find the most efficient way to multiply these matrices together. The problem is not to actually perform the multiplications, but merely to decide in which order to perform the multiplications.

Given dimensions array `dims` where matrix Ai has dimensions `dims[i-1] × dims[i]`, find the minimum number of scalar multiplications needed.

**Examples:**
```
Input: dims = [10, 30, 5, 60]
Matrices: A1(10×30), A2(30×5), A3(5×60)

Order 1: (A1 × A2) × A3
  - A1 × A2 = 10×30×5 = 1500 operations → result is 10×5
  - (result) × A3 = 10×5×60 = 3000 operations
  - Total = 4500

Order 2: A1 × (A2 × A3)
  - A2 × A3 = 30×5×60 = 9000 operations → result is 30×60
  - A1 × (result) = 10×30×60 = 18000 operations
  - Total = 27000

Output: 4500 (Order 1 is better!)

Input: dims = [40, 20, 30, 10, 30]
Output: 26000
```

**Constraints:**
- 2 ≤ dims.length ≤ 100 (meaning 1 to 99 matrices)
- 1 ≤ dims[i] ≤ 500

---

## 🎯 Pattern Recognition

<details>
<summary><strong>How to Identify Interval DP</strong></summary>

**This is Interval DP because:**
- We're optimizing over a range [i, j]
- We try all split points k within the range
- Optimal solution for [i, j] depends on optimal solutions for [i, k] and [k+1, j]

**Key Signals:**
- "Order of operations matters"
- "Parenthesization" or "grouping"
- "Merge/combine with cost"
- Decision at each step affects the structure of remaining problem

</details>

---

## ✅ When to Use This Approach

- Optimal parenthesization problems
- Merging consecutive elements with cost
- Evaluating expressions in different orders

## ❌ When NOT to Use

| Situation | Use Instead |
|-----------|-------------|
| Independent choices | 1D DP or Greedy |
| No ordering constraint | Other DP patterns |
| Graph structure | Graph algorithms |

---

## 📐 Core Concept

**State Definition:**
```
dp[i][j] = minimum cost to multiply matrices from i to j (inclusive)
```

**Recurrence:**
For every possible split point k from i to j-1:
```
dp[i][j] = min(dp[i][k] + dp[k+1][j] + cost(i, k, j))

where cost(i, k, j) = dims[i-1] × dims[k] × dims[j]
  (cost to multiply the two resulting matrices)
```

**Visual:**
```
Matrices: A1, A2, A3, A4
          i       k  k+1    j

Split at k=2: (A1 × A2) × (A3 × A4)
              ────────   ────────
              dp[1][2]   dp[3][4]
                    ↘   ↙
              Final multiplication cost
```

**Base Case:**
```
dp[i][i] = 0  (single matrix requires no multiplication)
```

**Fill Order:**
By increasing chain length (length 2, then 3, then 4, ...)

---

## 💻 Solution: Bottom-Up DP

```python
def matrixChainMultiplication(dims: list[int]) -> int:
    """
    Find minimum scalar multiplications for matrix chain.
    
    dims[i-1] × dims[i] are dimensions of matrix i.
    
    dp[i][j] = min cost to multiply matrices i through j
    
    Time: O(n³), Space: O(n²)
    """
    n = len(dims) - 1  # Number of matrices
    
    if n <= 1:
        return 0
    
    # dp[i][j] = min cost to multiply matrices i..j (1-indexed)
    dp = [[0] * (n + 1) for _ in range(n + 1)]
    
    # Fill by increasing chain length
    for length in range(2, n + 1):  # length of chain
        for i in range(1, n - length + 2):  # start index
            j = i + length - 1  # end index
            dp[i][j] = float('inf')
            
            # Try all split points
            for k in range(i, j):
                # Cost = left chain + right chain + combining them
                cost = (dp[i][k] + 
                       dp[k+1][j] + 
                       dims[i-1] * dims[k] * dims[j])
                dp[i][j] = min(dp[i][j], cost)
    
    return dp[1][n]
```

```javascript
function matrixChainMultiplication(dims) {
    const n = dims.length - 1; // Number of matrices
    
    if (n <= 1) return 0;
    
    // dp[i][j] = min cost to multiply matrices i..j
    const dp = Array.from({length: n + 1}, () => 
        Array(n + 1).fill(0)
    );
    
    // Fill by increasing chain length
    for (let length = 2; length <= n; length++) {
        for (let i = 1; i <= n - length + 1; i++) {
            const j = i + length - 1;
            dp[i][j] = Infinity;
            
            // Try all split points
            for (let k = i; k < j; k++) {
                const cost = dp[i][k] + dp[k+1][j] + 
                            dims[i-1] * dims[k] * dims[j];
                dp[i][j] = Math.min(dp[i][j], cost);
            }
        }
    }
    
    return dp[1][n];
}
```

---

## 💻 Solution: Memoized Recursion

```python
def matrixChainMemo(dims: list[int]) -> int:
    """
    Top-down with memoization.
    Often clearer for understanding.
    
    Time: O(n³), Space: O(n²)
    """
    n = len(dims) - 1
    
    if n <= 1:
        return 0
    
    from functools import lru_cache
    
    @lru_cache(maxsize=None)
    def dp(i: int, j: int) -> int:
        """Min cost to multiply matrices i through j."""
        if i == j:
            return 0
        
        min_cost = float('inf')
        
        for k in range(i, j):
            # Cost of left chain + right chain + combining
            cost = (dp(i, k) + 
                   dp(k + 1, j) + 
                   dims[i - 1] * dims[k] * dims[j])
            min_cost = min(min_cost, cost)
        
        return min_cost
    
    return dp(1, n)
```

---

## 💻 With Optimal Split Reconstruction

```python
def matrixChainWithOrder(dims: list[int]) -> tuple[int, str]:
    """
    Returns both minimum cost AND optimal parenthesization.
    
    Time: O(n³), Space: O(n²)
    """
    n = len(dims) - 1
    
    if n <= 1:
        return 0, "A1" if n == 1 else ""
    
    dp = [[0] * (n + 1) for _ in range(n + 1)]
    split = [[0] * (n + 1) for _ in range(n + 1)]  # Track split points
    
    for length in range(2, n + 1):
        for i in range(1, n - length + 2):
            j = i + length - 1
            dp[i][j] = float('inf')
            
            for k in range(i, j):
                cost = (dp[i][k] + dp[k+1][j] + 
                       dims[i-1] * dims[k] * dims[j])
                if cost < dp[i][j]:
                    dp[i][j] = cost
                    split[i][j] = k  # Remember best split
    
    # Reconstruct parenthesization
    def build(i: int, j: int) -> str:
        if i == j:
            return f"A{i}"
        k = split[i][j]
        left = build(i, k)
        right = build(k + 1, j)
        return f"({left} × {right})"
    
    return dp[1][n], build(1, n)


# Example usage:
dims = [10, 30, 5, 60]
cost, order = matrixChainWithOrder(dims)
print(f"Minimum cost: {cost}")  # 4500
print(f"Optimal order: {order}")  # ((A1 × A2) × A3)
```

---

## 🔄 Trace Example

```
dims = [10, 30, 5, 60]
Matrices: A1(10×30), A2(30×5), A3(5×60)

DP Table (after filling):

         j=1    j=2     j=3
    ┌─────────────────────────
i=1 │   0    1500    4500      
    │        ↑       ↑
    │    10×30×5   min of:
    │              k=1: 0 + 4500 + 10×30×60 = 22500
    │              k=2: 1500 + 0 + 10×5×60 = 4500 ✓
    │
i=2 │   -      0     9000
    │               ↑
    │           30×5×60
    │
i=3 │   -      -       0

Answer: dp[1][3] = 4500
Best split: k=2, meaning (A1 × A2) × A3
```

---

## ⚡ Complexity Analysis

| Aspect | Value | Reason |
|--------|-------|--------|
| Time | O(n³) | O(n²) subproblems × O(n) split points each |
| Space | O(n²) | 2D DP table |

**Note:** This is the classic O(n³) algorithm. There exists an O(n log n) algorithm (Hu & Shing, 1984) but it's rarely asked in interviews.

---

## ⚠️ Common Mistakes

### 1. Wrong Index Mapping
```python
# ❌ Wrong: Confusing dims indices
cost = dims[i] * dims[k] * dims[j]

# ✅ Correct: Matrix i has dims[i-1] × dims[i]
cost = dims[i-1] * dims[k] * dims[j]
```

### 2. Wrong Split Range
```python
# ❌ Wrong: Including j in split range
for k in range(i, j + 1):

# ✅ Correct: Split is between matrices, k is last matrix of left group
for k in range(i, j):
```

### 3. Wrong Length Iteration
```python
# ❌ Wrong: Starting from length 1
for length in range(1, n + 1):

# ✅ Correct: Single matrix (length 1) has 0 cost, start from 2
for length in range(2, n + 1):
```

### 4. Forgetting Base Case
```python
# ❌ Wrong: Not initializing
dp = [[float('inf')] * (n+1) for _ in range(n+1)]

# ✅ Correct: dp[i][i] = 0 (single matrix)
dp = [[0] * (n+1) for _ in range(n+1)]
# Or explicitly set diagonal to 0
```

---

## 🔗 Related Problems

| Problem | Similarity | Key Difference |
|---------|------------|----------------|
| [312. Burst Balloons](https://leetcode.com/problems/burst-balloons/) | Same pattern | Think LAST, not first |
| [1039. Min Score Triangulation](https://leetcode.com/problems/minimum-score-triangulation-of-polygon/) | Identical structure | Different cost function |
| [1000. Min Cost to Merge Stones](https://leetcode.com/problems/minimum-cost-to-merge-stones/) | Extended | K-way merge instead of 2-way |
| [132. Palindrome Partitioning II](https://leetcode.com/problems/palindrome-partitioning-ii/) | Interval DP | Different base structure |

---

## 📝 Practice Problems

| Problem | Difficulty | Key Insight |
|---------|------------|-------------|
| Matrix Chain Multiplication | Medium | Canonical interval DP |
| [312. Burst Balloons](https://leetcode.com/problems/burst-balloons/) | Hard | Reverse thinking (last, not first) |
| [1039. Min Score Triangulation](https://leetcode.com/problems/minimum-score-triangulation-of-polygon/) | Medium | Same as MCM with different cost |
| [1000. Min Cost Merge Stones](https://leetcode.com/problems/minimum-cost-to-merge-stones/) | Hard | K-way generalization |

---

## 🎤 Interview Tips

<details>
<summary><strong>How to Present This Solution</strong></summary>

**Opening:**
> "This is a classic interval DP problem. The key insight is that we need to try all possible ways to parenthesize, and the optimal parenthesization for a range depends on optimal parenthesizations of sub-ranges."

**State Definition:**
> "I'll define dp[i][j] as the minimum cost to multiply matrices i through j. For each range, I try all split points k and take the minimum."

**Recurrence:**
> "For split point k, the cost is: cost of left chain plus cost of right chain plus the cost of multiplying the two resulting matrices together."

**Complexity:**
> "This is O(n³) time because we have O(n²) subproblems and O(n) work per subproblem to try all split points."

</details>

**Company Focus:**
| Company | Frequency | Notes |
|---------|-----------|-------|
| Google | ⭐⭐⭐ | Classic DP question |
| Amazon | ⭐⭐ | May ask variations |
| Microsoft | ⭐⭐ | Tests DP fundamentals |

---

> **💡 Key Insight:** The optimal way to multiply a chain of matrices depends on finding the best "split point" where we divide the chain into two sub-chains. This is the essence of interval DP: optimal for [i,j] = best combination of optimal [i,k] and optimal [k+1,j].

> **🔗 Related:** [Interval DP Pattern](../9.1-Interval-DP-Pattern.md) | [Burst Balloons](02-Burst-Balloons-LC312.md) | [Min Cost Merge Stones](03-Min-Cost-Merge-Stones-LC1000.md)
