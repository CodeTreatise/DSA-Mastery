# 01 Factorial and Fibonacci

> **Classic Introductory Recursion Problems**  
> **Interview Value:** ⭐⭐⭐ - Foundation for understanding recursion  
> **Prerequisites:** [1.1 Recursion Basics](../1.1-Recursion-Basics.md)

---

## Overview

**Factorial** and **Fibonacci** are the two classic problems used to introduce recursion. While simple, they demonstrate key concepts:
- **Factorial:** Linear recursion, single recursive call
- **Fibonacci:** Binary recursion, overlapping subproblems

---

## 🎯 Pattern Recognition

<details>
<summary><strong>When These Patterns Apply</strong></summary>

**Factorial pattern (linear recursion):**
- Computing products/sums in sequence
- Single dependency on previous result
- f(n) depends only on f(n-1)

**Fibonacci pattern (binary recursion):**
- Result depends on multiple previous values
- f(n) = f(n-1) + f(n-2)
- Sequence-based calculations

**Warning signs for Fibonacci:**
- Overlapping subproblems → needs memoization
- Exponential time without optimization

</details>

---

## ✅ When to Use

- **Factorial:** Permutations, combinations, probability
- **Fibonacci:** Sequence problems, stair climbing, tiling
- Both: As building blocks for more complex recursion

---

## ❌ When NOT to Use

| Situation | Use Instead | Why |
|-----------|-------------|-----|
| Large n (n > 1000) | Iteration | Stack overflow |
| Fibonacci without memo | DP or iteration |" O(2ⁿ) → O(n) "|
| Performance critical | Iteration | Less overhead |

---

## 🔗 Concept Map

<details>
<summary><strong>Prerequisites & Next Steps</strong></summary>

**Before this, you should know:**
- [Recursion Basics](../1.1-Recursion-Basics.md)
- [Thinking Recursively](../1.3-Thinking-Process.md)

**After mastering this:**
- [Power and Binary Search](./02-Power-Binary-Search.md)
- [Memoization](../../04-Optimization/4.1-Memoization.md)

**These patterns lead to:**
- Climbing Stairs (Fibonacci variant)
- House Robber (extended Fibonacci)
- Dynamic Programming foundations

</details>

---

## 📐 Problem 1: Factorial

### Problem Statement
Calculate n! = n * (n-1) * (n-2) * ... * 2 * 1

```
factorial(5) = 5 * 4 * 3 * 2 * 1 = 120
factorial(0) = 1 (by definition)
```

### How It Works

```
factorial(4)
├── 4 * factorial(3)
│       ├── 3 * factorial(2)
│       │       ├── 2 * factorial(1)
│       │       │       └── 1  ← base case
│       │       └── 2 * 1 = 2
│       └── 3 * 2 = 6
└── 4 * 6 = 24
```

### 💻 Code

```python
def factorial(n: int) -> int:
    """
    Calculate n! recursively.
    
    Time: O(n) - n recursive calls
    Space: O(n) - call stack depth
    """
    # Base case
    if n <= 1:
        return 1
    
    # Recursive case
    return n * factorial(n - 1)


def factorial_iterative(n: int) -> int:
    """Iterative version for comparison."""
    result = 1
    for i in range(2, n + 1):
        result *= i
    return result


def factorial_tail(n: int, acc: int = 1) -> int:
    """
    Tail-recursive version.
    Note: Python doesn't optimize tail recursion,
    but this pattern is useful in other languages.
    """
    if n <= 1:
        return acc
    return factorial_tail(n - 1, n * acc)


# Examples
print(factorial(5))     # 120
print(factorial(0))     # 1
print(factorial(10))    # 3628800
```

```javascript
function factorial(n) {
    if (n <= 1) return 1;
    return n * factorial(n - 1);
}

function factorialIterative(n) {
    let result = 1;
    for (let i = 2; i <= n; i++) {
        result *= i;
    }
    return result;
}

function factorialTail(n, acc = 1) {
    if (n <= 1) return acc;
    return factorialTail(n - 1, n * acc);
}
```

---

## 📐 Problem 2: Fibonacci

### Problem Statement
Calculate the nth Fibonacci number.

```
F(0) = 0
F(1) = 1
F(n) = F(n-1) + F(n-2) for n > 1

Sequence: 0, 1, 1, 2, 3, 5, 8, 13, 21, 34, ...
```

### How It Works

```
fib(5)
├── fib(4)
│   ├── fib(3)
│   │   ├── fib(2)
│   │   │   ├── fib(1) → 1
│   │   │   └── fib(0) → 0
│   │   └── fib(1) → 1      ← Repeated!
│   └── fib(2)               ← Repeated!
│       ├── fib(1) → 1       ← Repeated!
│       └── fib(0) → 0       ← Repeated!
└── fib(3)                   ← Repeated!
    └── ...

Note: fib(3), fib(2), fib(1), fib(0) all calculated multiple times!
```

### 💻 Code

#### Naive (Exponential - Don't Use!)

```python
def fibonacci_naive(n: int) -> int:
    """
    NAIVE: O(2^n) time - DO NOT USE for large n!
    Only for understanding the concept.
    """
    if n <= 0:
        return 0
    if n == 1:
        return 1
    return fibonacci_naive(n - 1) + fibonacci_naive(n - 2)

# fibonacci_naive(40) takes several seconds
# fibonacci_naive(50) takes minutes!
```

#### With Memoization (Linear)

```python
def fibonacci_memo(n: int, memo: dict = None) -> int:
    """
    With memoization: O(n) time, O(n) space.
    
    Key insight: Cache results to avoid recalculation.
    """
    if memo is None:
        memo = {}
    
    # Check cache first
    if n in memo:
        return memo[n]
    
    # Base cases
    if n <= 0:
        return 0
    if n == 1:
        return 1
    
    # Calculate and cache
    memo[n] = fibonacci_memo(n - 1, memo) + fibonacci_memo(n - 2, memo)
    return memo[n]


# Using functools for cleaner memoization
from functools import lru_cache

@lru_cache(maxsize=None)
def fibonacci_cached(n: int) -> int:
    """Using Python's built-in memoization."""
    if n <= 0:
        return 0
    if n == 1:
        return 1
    return fibonacci_cached(n - 1) + fibonacci_cached(n - 2)
```

#### Iterative (Most Efficient)

```python
def fibonacci_iterative(n: int) -> int:
    """
    Iterative: O(n) time, O(1) space.
    Most efficient for production code.
    """
    if n <= 0:
        return 0
    if n == 1:
        return 1
    
    prev2, prev1 = 0, 1
    for _ in range(2, n + 1):
        current = prev1 + prev2
        prev2 = prev1
        prev1 = current
    
    return prev1


# Examples
print(fibonacci_iterative(10))   # 55
print(fibonacci_iterative(50))   # 12586269025 (instant!)
```

```javascript
// Naive (don't use for large n)
function fibonacciNaive(n) {
    if (n <= 0) return 0;
    if (n === 1) return 1;
    return fibonacciNaive(n - 1) + fibonacciNaive(n - 2);
}

// With memoization
function fibonacciMemo(n, memo = {}) {
    if (n in memo) return memo[n];
    if (n <= 0) return 0;
    if (n === 1) return 1;
    
    memo[n] = fibonacciMemo(n - 1, memo) + fibonacciMemo(n - 2, memo);
    return memo[n];
}

// Iterative (best)
function fibonacciIterative(n) {
    if (n <= 0) return 0;
    if (n === 1) return 1;
    
    let prev2 = 0, prev1 = 1;
    for (let i = 2; i <= n; i++) {
        const current = prev1 + prev2;
        prev2 = prev1;
        prev1 = current;
    }
    return prev1;
}
```

---

## ⚡ Complexity Analysis

### Factorial

| Version | Time | Space | Notes |
|---------|------|-------|-------|
| Recursive |" O(n) "| O(n) | Stack depth n |
| Iterative |" O(n) "| O(1) | No stack |
| Tail recursive |" O(n) "| O(1)* | *If optimized |

### Fibonacci

| Version | Time | Space | Notes |
|---------|------|-------|-------|
| Naive |" O(2ⁿ) "| O(n) | Never use! |
| Memoized |" O(n) "| O(n) | Cache stores n values |
| Iterative |" O(n) "| O(1) | Best overall |
| Matrix exp |" O(log n) "| O(1) | For very large n |

**Why is naive Fibonacci O(2ⁿ)?**
```
Each call makes 2 calls
fib(n) → fib(n-1) + fib(n-2)
        → 2 calls → 4 calls → 8 calls → ...
        
Total calls ≈ 2^n
```

---

## 🔄 Variations

| Variation | Change | Example |
|-----------|--------|---------|
| **Climbing Stairs** | Count ways to reach n | LC 70 |
| **House Robber** | Max non-adjacent sum | LC 198 |
| **Tribonacci** | f(n) = f(n-1)+f(n-2)+f(n-3) | LC 1137 |
| **Min Cost Climbing** | Add costs | LC 746 |

---

## ⚠️ Common Mistakes

### 1. Forgetting Memoization for Fibonacci

❌ **Wrong:** Using naive recursion
```python
def fib(n):
    if n <= 1: return n
    return fib(n-1) + fib(n-2)  # Exponential!
```

✅ **Correct:** Add memoization
```python
def fib(n, memo={}):
    if n in memo: return memo[n]
    if n <= 1: return n
    memo[n] = fib(n-1, memo) + fib(n-2, memo)
    return memo[n]
```

### 2. Wrong Base Case for Fibonacci

❌ **Wrong:**
```python
def fib(n):
    if n == 1: return 1  # Missing n=0 case!
    return fib(n-1) + fib(n-2)
```

✅ **Correct:**
```python
def fib(n):
    if n <= 0: return 0
    if n == 1: return 1
    return fib(n-1) + fib(n-2)
```

### 3. Mutable Default Argument

❌ **Wrong:** (memo persists between calls)
```python
def fib(n, memo={}):  # Same dict reused!
    ...
```

✅ **Correct:** (reset each time if needed)
```python
def fib(n, memo=None):
    if memo is None:
        memo = {}
    ...
```

---

## 📝 Practice Problems

### Easy (Learn the pattern)

| Problem | Focus | LeetCode |
|---------|-------|----------|
| Fibonacci Number | Binary recursion | [LC 509](https://leetcode.com/problems/fibonacci-number/) |
| Climbing Stairs | Fibonacci variant | [LC 70](https://leetcode.com/problems/climbing-stairs/) |
| N-th Tribonacci | Extended Fibonacci | [LC 1137](https://leetcode.com/problems/n-th-tribonacci-number/) |

### Medium (Apply pattern)

| Problem | Focus | LeetCode |
|---------|-------|----------|
| House Robber | DP from Fibonacci | [LC 198](https://leetcode.com/problems/house-robber/) |
| Min Cost Climbing Stairs | Weighted Fibonacci | [LC 746](https://leetcode.com/problems/min-cost-climbing-stairs/) |
| Decode Ways | Counting with constraints | [LC 91](https://leetcode.com/problems/decode-ways/) |

<details>
<summary><strong>🧠 Spaced Repetition Schedule</strong></summary>

**Day 1:**
- Implement factorial (recursive + iterative)
- Implement naive Fibonacci

**Day 2:**
- Add memoization to Fibonacci
- Understand why naive is O(2ⁿ)

**Day 4:**
- Solve LC 509 and LC 70
- Implement iterative Fibonacci

**Day 7:**
- Solve LC 198 (House Robber)
- Recognize extended pattern

**Day 14:**
- Review all solutions
- Identify pattern in new problem

</details>

---

## 🎤 Interview Context

<details>
<summary><strong>How to Communicate in Interviews</strong></summary>

**For Factorial:**
> "This is a classic linear recursion. Base case is n ≤ 1, recursive case multiplies n by factorial(n-1)."

**For Fibonacci:**
> "I'll start with the recursive definition, but I immediately recognize overlapping subproblems. I'll add memoization to bring it from O(2ⁿ) to O(n)."

**If asked about efficiency:**
> "For production code, I'd use the iterative version for O(1) space. Recursion is cleaner to understand but uses O(n) stack space."

**Common follow-ups:**
- "What's the time complexity?" → Know the math
- "Can you make it more efficient?" → Memoization, then iteration
- "What about very large n?" → Mention overflow, matrix exponentiation

</details>

---

## ⏱️ Time Estimates

| Activity | Time | Notes |
|----------|------|-------|
| Understand both problems | 15-20 min | With examples |
| Implement factorial | 5-10 min | Straightforward |
| Implement Fibonacci (all 3 ways) | 20-30 min | Understand trade-offs |
| Solve LC 70 (Climbing Stairs) | 10-15 min | Direct application |
| Solve LC 198 (House Robber) | 20-25 min | Extended pattern |

---

## 💡 Key Insight

> **Fibonacci teaches the most important recursion lesson:**  
> *Naive recursion with overlapping subproblems is exponential.*
>
> The solution? **Memoization** — cache results to avoid recalculation.
> This transforms O(2ⁿ) → O(n), which is the foundation of Dynamic Programming.

---

## 🔗 Related

- [Recursion Basics](../1.1-Recursion-Basics.md) - Foundation
- [Power and Binary Search](./02-Power-Binary-Search.md) - Next topic
- [Memoization](../../04-Optimization/4.1-Memoization.md) - Optimization technique
- [Dynamic Programming](../../11-Dynamic-Programming.md) - Extended application
