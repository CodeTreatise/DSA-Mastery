# Climbing Stairs (LC 70)

> **The quintessential Fibonacci DP problem.** If you can only solve one DP problem, make it this one. It's the foundation for understanding how DP works.

---

## 📋 Problem Statement

**LeetCode:** [70. Climbing Stairs](https://leetcode.com/problems/climbing-stairs/)

You are climbing a staircase. It takes `n` steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?

**Constraints:**
- 1 ≤ n ≤ 45

---

## 🎯 Pattern Recognition

**This is Fibonacci Pattern because:**
- Current answer depends on previous 2 answers only
- `ways(n) = ways(n-1) + ways(n-2)`
- You reach step n either from step n-1 (take 1) or step n-2 (take 2)

**Signals:**
- Linear sequence (steps 1 to n)
- Binary choice (1 or 2 steps)
- Counting ways

---

## 📐 Approach Analysis

### Understanding the Recurrence

```
To reach step n:
  - Come from step n-1 (take 1 step): ways(n-1) ways
  - Come from step n-2 (take 2 steps): ways(n-2) ways
  
Total ways to reach n = ways(n-1) + ways(n-2)
```

**Visualization:**
```
Step n:     We want to reach here
            ↗ (from n-1, take 1)
            ↗ (from n-2, take 2)

n = 1: 1 way  [1]
n = 2: 2 ways [1,1] or [2]
n = 3: 3 ways [1,1,1], [1,2], [2,1]
n = 4: 5 ways [1,1,1,1], [1,1,2], [1,2,1], [2,1,1], [2,2]
n = 5: 8 ways ...

Sequence: 1, 2, 3, 5, 8, 13... (Fibonacci shifted by 1!)
```

---

## 💻 Solutions

### Solution 1: Naive Recursion (TLE)

```python
def climb_stairs_naive(n: int) -> int:
    """
    Direct recursion - will timeout for large n.
    Time: O(2^n), Space: O(n) recursion stack
    """
    if n <= 2:
        return n
    return climb_stairs_naive(n - 1) + climb_stairs_naive(n - 2)
```

### Solution 2: Memoization (Top-Down)

```python
def climb_stairs_memo(n: int) -> int:
    """
    Add memoization to avoid recomputation.
    Time: O(n), Space: O(n)
    """
    memo = {}
    
    def helper(step):
        if step <= 2:
            return step
        if step in memo:
            return memo[step]
        
        memo[step] = helper(step - 1) + helper(step - 2)
        return memo[step]
    
    return helper(n)
```

### Solution 3: Tabulation (Bottom-Up)

```python
def climb_stairs_table(n: int) -> int:
    """
    Build answer from small subproblems.
    Time: O(n), Space: O(n)
    """
    if n <= 2:
        return n
    
    dp = [0] * (n + 1)
    dp[1] = 1
    dp[2] = 2
    
    for i in range(3, n + 1):
        dp[i] = dp[i - 1] + dp[i - 2]
    
    return dp[n]
```

### Solution 4: Space Optimized (Optimal)

```python
def climb_stairs(n: int) -> int:
    """
    Only need previous 2 values.
    Time: O(n), Space: O(1)
    """
    if n <= 2:
        return n
    
    prev2 = 1  # dp[1]
    prev1 = 2  # dp[2]
    
    for i in range(3, n + 1):
        curr = prev1 + prev2
        prev2 = prev1
        prev1 = curr
    
    return prev1
```

```javascript
function climbStairs(n) {
    if (n <= 2) return n;
    
    let prev2 = 1;
    let prev1 = 2;
    
    for (let i = 3; i <= n; i++) {
        const curr = prev1 + prev2;
        prev2 = prev1;
        prev1 = curr;
    }
    
    return prev1;
}
```

### Solution 5: Matrix Exponentiation (Bonus)

```python
def climb_stairs_matrix(n: int) -> int:
    """
    Use matrix exponentiation for O(log n) time.
    [F(n+1)]   [1 1]^n   [F(1)]
    [F(n)  ] = [1 0]   × [F(0)]
    """
    def matrix_mult(A, B):
        return [
            [A[0][0]*B[0][0] + A[0][1]*B[1][0], A[0][0]*B[0][1] + A[0][1]*B[1][1]],
            [A[1][0]*B[0][0] + A[1][1]*B[1][0], A[1][0]*B[0][1] + A[1][1]*B[1][1]]
        ]
    
    def matrix_pow(M, p):
        result = [[1, 0], [0, 1]]  # Identity
        while p:
            if p % 2:
                result = matrix_mult(result, M)
            M = matrix_mult(M, M)
            p //= 2
        return result
    
    if n <= 2:
        return n
    
    M = [[1, 1], [1, 0]]
    result = matrix_pow(M, n)
    return result[0][0]
```

---

## ⚡ Complexity Comparison

| Approach | Time | Space | Notes |
|----------|------|-------|-------|
| Naive Recursion | O(2ⁿ) | O(n) | Exponential - TLE |
| Memoization | O(n) | O(n) | Recursion + memo |
| Tabulation | O(n) | O(n) | Array |
| **Space Optimized** | **O(n)** | **O(1)** | **Best for interview** |
| Matrix Exponentiation | O(log n) | O(1) | Overkill for this problem |

---

## ⚠️ Common Mistakes

### 1. Wrong Base Cases

**❌ Wrong:**
```python
dp[0] = 1  # 1 way to reach step 0?
dp[1] = 1  # 1 way to reach step 1
# But dp[2] = dp[1] + dp[0] = 2 ✓ (this happens to work)
```

**✅ Clearer:**
```python
if n <= 2:
    return n  # 1 way for n=1, 2 ways for n=2
prev2, prev1 = 1, 2  # dp[1], dp[2]
```

### 2. Off-by-One Loop Bounds

**❌ Wrong:**
```python
for i in range(3, n):  # Stops at n-1!
```

**✅ Correct:**
```python
for i in range(3, n + 1):  # Goes through n
```

### 3. Variable Update Order

**❌ Wrong:**
```python
prev2 = prev1
prev1 = prev1 + prev2  # Uses new prev2!
```

**✅ Correct:**
```python
curr = prev1 + prev2
prev2 = prev1
prev1 = curr
```

---

## 🔄 Variations

| Variation | Change | Example |
|-----------|--------|---------|
| K steps at a time | `dp[i] = sum(dp[i-1] to dp[i-k])` | Climbing with 1,2,3 steps |
| With costs | `dp[i] = min(dp[i-1], dp[i-2]) + cost[i]` | Min Cost Climbing Stairs |
| Can't use same step twice | Track last step taken | State machine DP |

---

## 📝 Related Problems

- [ ] [Min Cost Climbing Stairs](https://leetcode.com/problems/min-cost-climbing-stairs/) - Add optimization
- [ ] [N-th Tribonacci](https://leetcode.com/problems/n-th-tribonacci-number/) - 3 previous states
- [ ] [House Robber](https://leetcode.com/problems/house-robber/) - Take/skip pattern
- [ ] [Decode Ways](https://leetcode.com/problems/decode-ways/) - Conditional Fibonacci

---

## 🎤 Interview Tips

**Time to solve:** 5-10 minutes (expected for warm-up)

**What interviewer evaluates:**
1. Recognize Fibonacci pattern immediately
2. Derive recurrence from logic (not memorization)
3. Optimize to O(1) space
4. Handle edge cases (n=1, n=2)

**Communication template:**
> "I notice that to reach step n, I can come from either step n-1 or n-2. So the number of ways is the sum of ways to reach those two steps. This is exactly the Fibonacci recurrence. Since I only need the previous two values, I can use O(1) space."

---

> **💡 Key Insight:** This problem IS Fibonacci, just shifted by one index. `climbStairs(n) = fib(n+1)` where fib(1)=1, fib(2)=1.

> **🔗 Related:** [Fibonacci Pattern Overview](../4.1-Fibonacci-Pattern-Overview.md) | [House Robber](./02-House-Robber-LC198.md)
