# Perfect Squares (LC 279)

> **Unbounded Knapsack with squares as "coins."** This problem elegantly maps to Coin Change—the "coins" are 1², 2², 3²... and we minimize the count to reach n. A beautiful example of problem transformation!

---

## 📋 Problem Statement

**LeetCode:** [279. Perfect Squares](https://leetcode.com/problems/perfect-squares/)

Given an integer `n`, return the least number of perfect square numbers that sum to n.

A perfect square is an integer that is the square of an integer (1, 4, 9, 16, 25...).

**Examples:**
```
Input: n = 12
Output: 3
Explanation: 12 = 4 + 4 + 4 (three 4s)

Input: n = 13
Output: 2
Explanation: 13 = 4 + 9 (one 4 and one 9)
```

**Constraints:**
- 1 ≤ n ≤ 10⁴

---

## 🎯 Pattern Recognition

**The transformation:**
- "Coins" = [1, 4, 9, 16, 25, ...] (all squares ≤ n)
- "Amount" = n
- "Minimize coins" = minimize squares

**This is exactly Coin Change!**

**Signals:**
- "Sum to n"
- "Least number"
- Unlimited usage (can use 4 + 4 + 4)

---

## 📐 Approach Analysis

### Problem Transformation

```
Perfect Squares           →    Coin Change
-----------------              ------------
squares: 1,4,9,16...           coins array
n                              amount
minimize count                 minimize coins
```

### DP State Definition

```
dp[i] = minimum perfect squares that sum to i

Base case: dp[0] = 0 (zero squares for sum 0)
Recurrence: dp[i] = min(dp[i - j²] + 1) for all j² ≤ i
```

---

## 💻 Solutions

### Solution 1: Bottom-Up DP (Standard)

```python
def num_squares(n: int) -> int:
    """
    Unbounded Knapsack: squares are coins.
    Time: O(n√n), Space: O(n)
    """
    # Generate "coins" (squares up to n)
    squares = []
    i = 1
    while i * i <= n:
        squares.append(i * i)
        i += 1
    
    # Same as Coin Change
    dp = [float('inf')] * (n + 1)
    dp[0] = 0
    
    for sq in squares:
        for i in range(sq, n + 1):
            dp[i] = min(dp[i], dp[i - sq] + 1)
    
    return dp[n]
```

```javascript
function numSquares(n) {
    // Generate squares
    const squares = [];
    for (let i = 1; i * i <= n; i++) {
        squares.push(i * i);
    }
    
    const dp = new Array(n + 1).fill(Infinity);
    dp[0] = 0;
    
    for (const sq of squares) {
        for (let i = sq; i <= n; i++) {
            dp[i] = Math.min(dp[i], dp[i - sq] + 1);
        }
    }
    
    return dp[n];
}
```

### Solution 2: Direct Iteration (No Pre-generation)

```python
def num_squares_v2(n: int) -> int:
    """
    Iterate squares directly without pre-generation.
    """
    dp = [float('inf')] * (n + 1)
    dp[0] = 0
    
    for i in range(1, n + 1):
        j = 1
        while j * j <= i:
            dp[i] = min(dp[i], dp[i - j * j] + 1)
            j += 1
    
    return dp[n]
```

### Solution 3: BFS (Level = Number of Squares)

```python
def num_squares_bfs(n: int) -> int:
    """
    BFS: each level adds one more square.
    First time we reach 0 = answer.
    """
    if n == 0:
        return 0
    
    from collections import deque
    
    # Generate squares
    squares = []
    i = 1
    while i * i <= n:
        squares.append(i * i)
        i += 1
    
    visited = set([n])
    queue = deque([n])
    level = 0
    
    while queue:
        level += 1
        for _ in range(len(queue)):
            curr = queue.popleft()
            for sq in squares:
                remainder = curr - sq
                if remainder == 0:
                    return level
                if remainder > 0 and remainder not in visited:
                    visited.add(remainder)
                    queue.append(remainder)
    
    return level  # Should always find answer
```

### Solution 4: Mathematical (Lagrange's Four Square Theorem)

```python
def num_squares_math(n: int) -> int:
    """
    Lagrange's theorem: Every natural number can be 
    represented as sum of at most 4 squares.
    
    1 square: n is a perfect square
    2 squares: n = a² + b²
    3 squares: n ≠ 4^a(8b + 7)
    4 squares: otherwise
    """
    import math
    
    def is_square(x):
        root = int(math.sqrt(x))
        return root * root == x
    
    # Check if n is a perfect square
    if is_square(n):
        return 1
    
    # Check if n = a² + b² for some a, b
    i = 1
    while i * i <= n:
        if is_square(n - i * i):
            return 2
        i += 1
    
    # Check for 4 using Legendre's three-square theorem
    # n can be written as 3 squares iff n ≠ 4^a(8b+7)
    while n % 4 == 0:
        n //= 4
    if n % 8 == 7:
        return 4
    
    return 3
```

---

## ⚡ Complexity Analysis

| Approach | Time | Space |
|----------|------|-------|
| DP | O(n√n) | O(n) |
| BFS | O(n√n) | O(n) |
| Math | O(√n) | O(1) |

**Why O(n√n) for DP:**
- n iterations for dp array
- At each i, check √i squares
- Total: n × √n average

**Math solution is optimal** but harder to derive during interview.

---

## ⚠️ Common Mistakes

### 1. Forgetting That 1 is a Perfect Square

**❌ Wrong thinking:**
```
"What if there's no solution?"
```

**✅ Correct:**
```
1 is always a square, so worst case = n ones: 1+1+1+...+1 = n
There's ALWAYS a solution!
```

### 2. Using 0 as a Square

**❌ Wrong:**
```python
squares = [0, 1, 4, 9, ...]  # Including 0
# Would cause infinite loop: dp[i] = dp[i - 0] + 1
```

**✅ Correct:**
```python
squares = [1, 4, 9, ...]  # Start from 1
```

### 3. Checking Beyond √n

**❌ Inefficient:**
```python
for sq in range(1, n + 1):  # Checks all numbers
    if is_perfect_square(sq):
        # ...
```

**✅ Correct:**
```python
i = 1
while i * i <= n:  # Only check actual squares
    squares.append(i * i)
    i += 1
```

### 4. Wrong Loop Order for Minimum

**❌ Wrong (for minimum, any order works, but be consistent):**
```python
dp[i] = dp[i - sq] + 1  # Without min!
```

**✅ Correct:**
```python
dp[i] = min(dp[i], dp[i - sq] + 1)
```

---

## 📊 Trace Through Example

```
n = 12, squares = [1, 4, 9]

Initial: dp = [0, ∞, ∞, ∞, ∞, ∞, ∞, ∞, ∞, ∞, ∞, ∞, ∞]

Processing sq = 1:
dp[1] = min(∞, dp[0]+1) = 1
dp[2] = min(∞, dp[1]+1) = 2
...
dp[12] = 12
dp = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]

Processing sq = 4:
dp[4] = min(4, dp[0]+1) = 1   ← 4 = 2²
dp[5] = min(5, dp[1]+1) = 2   ← 4+1
dp[8] = min(8, dp[4]+1) = 2   ← 4+4
dp[12] = min(12, dp[8]+1) = 3 ← 4+4+4
dp = [0, 1, 2, 3, 1, 2, 3, 4, 2, 3, 4, 5, 3]

Processing sq = 9:
dp[9] = min(3, dp[0]+1) = 1   ← 9 = 3²
dp[10] = min(4, dp[1]+1) = 2  ← 9+1
dp[12] = min(3, dp[3]+1) = 3  ← No improvement (9+3 not better)
dp = [0, 1, 2, 3, 1, 2, 3, 4, 2, 1, 2, 3, 3]

Answer: dp[12] = 3 (4 + 4 + 4)
```

---

## 🔄 Variations

### Count Ways (Instead of Minimum)

```python
def count_squares(n: int) -> int:
    """Count ways to write n as sum of squares."""
    squares = []
    i = 1
    while i * i <= n:
        squares.append(i * i)
        i += 1
    
    dp = [0] * (n + 1)
    dp[0] = 1
    
    for sq in squares:
        for i in range(sq, n + 1):
            dp[i] += dp[i - sq]
    
    return dp[n]
```

### Using Only Specific Squares

```python
def num_specific_squares(n: int, allowed: list[int]) -> int:
    """Minimum squares from allowed list."""
    dp = [float('inf')] * (n + 1)
    dp[0] = 0
    
    for sq in allowed:
        for i in range(sq, n + 1):
            dp[i] = min(dp[i], dp[i - sq] + 1)
    
    return dp[n] if dp[n] != float('inf') else -1
```

---

## 📝 Related Problems

| Problem | Difficulty | Note |
|---------|------------|------|
| [Coin Change](https://leetcode.com/problems/coin-change/) | Medium | Same pattern |
| [Coin Change II](https://leetcode.com/problems/coin-change-ii/) | Medium | Count instead of min |
| [Integer Break](https://leetcode.com/problems/integer-break/) | Medium | Maximize product |
| [Sum of Square Numbers](https://leetcode.com/problems/sum-of-square-numbers/) | Medium | Check if exactly 2 squares |

---

## 🎤 Interview Tips

**Time to solve:** 15-20 minutes

**Communication template:**
> "I'll transform this into a coin change problem. The 'coins' are perfect squares: 1, 4, 9, 16... and I want minimum 'coins' to sum to n. I'll use dp[i] for minimum squares summing to i. Since I can reuse squares, I iterate forward."

**Key insight to mention:**
- Problem reduction: "This IS coin change with squares as coins"
- Mathematical fact: At most 4 squares needed (Lagrange's theorem)

**If asked for O(1) space:**
```python
# BFS with math can achieve O(√n) time
```

**Company frequency:**
| Company | Frequency |
|---------|-----------|
| Google | ⭐⭐⭐⭐ |
| Amazon | ⭐⭐⭐ |
| Microsoft | ⭐⭐⭐ |
| Meta | ⭐⭐⭐ |

---

> **💡 Key Insight:** Perfect Squares = Coin Change where coins = [1, 4, 9, 16, ...]. The ability to recognize this transformation is more valuable than memorizing the solution. Every number can be represented as at most 4 squares (Lagrange's theorem), so worst case is bounded!

> **🔗 Related:** [Coin Change](./01-Coin-Change-LC322.md) | [Unbounded Knapsack Pattern](../6.3-Unbounded-Knapsack-Pattern.md) | [Coin Change II](./02-Coin-Change-II-LC518.md)
