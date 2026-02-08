# 02 Power and Binary Search

> **Efficient Recursion: Divide-and-Conquer Foundation**  
> **Interview Value:** ⭐⭐⭐⭐⭐ - Power O(log n), Binary Search fundamentals  
> **Prerequisites:** [1.1 Recursion Basics](../1.1-Recursion-Basics.md)

---

## Overview

**Power (x^n)** and **Binary Search** demonstrate the divide-and-conquer pattern where we:
1. Divide the problem in half
2. Solve one half recursively
3. Combine results efficiently

This gives us O(log n) time complexity — a huge improvement over O(n).

---

## 🎯 Pattern Recognition

<details>
<summary><strong>When This Pattern Applies</strong></summary>

**Look for these signals:**
- Problem can be **halved** at each step
- Result for n can be computed from result for n/2
- Sorted data (for binary search)
- Exponential operations (powers, repeated squaring)

**Keywords:**
- "efficiently compute", "in sorted array"
- "logarithmic time", "divide in half"

</details>

---

## ✅ When to Use

- **Power:** Computing x^n efficiently
- **Binary Search:** Finding elements in sorted arrays
- Any problem where halving the input is possible

---

## ❌ When NOT to Use

| Situation | Use Instead | Why |
|-----------|-------------|-----|
| Unsorted data | Linear search or sort first | Binary search needs sorted |
| Small n for power | Simple loop | Less overhead |
| Finding all occurrences | Linear scan | Binary finds one |

---

## 🔗 Concept Map

<details>
<summary><strong>Prerequisites & Next Steps</strong></summary>

**Before this, you should know:**
- [Recursion Basics](../1.1-Recursion-Basics.md)
- [Factorial and Fibonacci](./01-Factorial-Fibonacci.md)

**After mastering this:**
- [Divide and Conquer](../../03-Divide-Conquer/3.1-DC-Basics.md)
- Merge Sort, Quick Sort (divide-and-conquer sorting)

**Enables:**
- Matrix exponentiation
- Binary search variations
- Divide-and-conquer algorithms

</details>

---

## 📐 Problem 1: Power (x^n)

### Problem Statement
Calculate x raised to the power n (x^n).

```
pow(2, 10) = 1024
pow(2.1, 3) = 9.261
pow(2, -2) = 0.25
```

### Naive Approach (O(n))

```python
# O(n) - multiply n times
def pow_naive(x, n):
    result = 1
    for _ in range(abs(n)):
        result *= x
    return result if n >= 0 else 1/result
```

### Efficient Approach (O(log n))

**Key insight:** Use the property that x^n = (x^(n/2))^2

```
x^8 = x^4 * x^4       (only need to compute x^4 once!)
x^4 = x^2 * x^2
x^2 = x * x

So x^8 takes only 3 multiplications, not 8!
```

**Handle odd exponents:**
```
x^7 = x * x^6 = x * (x^3)^2
x^3 = x * x^2 = x * (x^1)^2
```

### 💻 Code

```python
def my_pow(x: float, n: int) -> float:
    """
    Calculate x^n using fast exponentiation.
    
    Time: O(log n) - halving n each step
    Space: O(log n) - recursion depth
    
    Key insight: x^n = (x^(n/2))^2
    """
    # Handle negative exponent
    if n < 0:
        x = 1 / x
        n = -n
    
    def power(x: float, n: int) -> float:
        # Base case
        if n == 0:
            return 1
        
        # Recursive case: compute x^(n/2)
        half = power(x, n // 2)
        
        # Square the result
        if n % 2 == 0:
            return half * half
        else:
            return half * half * x  # Extra multiplication for odd n
    
    return power(x, n)


def my_pow_iterative(x: float, n: int) -> float:
    """Iterative version (binary exponentiation)."""
    if n < 0:
        x = 1 / x
        n = -n
    
    result = 1
    while n > 0:
        if n % 2 == 1:  # Odd
            result *= x
        x *= x      # Square base
        n //= 2     # Halve exponent
    
    return result


# Examples
print(my_pow(2, 10))    # 1024
print(my_pow(2.1, 3))   # 9.261
print(my_pow(2, -2))    # 0.25
```

```javascript
function myPow(x, n) {
    if (n < 0) {
        x = 1 / x;
        n = -n;
    }
    
    function power(x, n) {
        if (n === 0) return 1;
        
        const half = power(x, Math.floor(n / 2));
        
        if (n % 2 === 0) {
            return half * half;
        } else {
            return half * half * x;
        }
    }
    
    return power(x, n);
}

// Iterative version
function myPowIterative(x, n) {
    if (n < 0) {
        x = 1 / x;
        n = -n;
    }
    
    let result = 1;
    while (n > 0) {
        if (n % 2 === 1) result *= x;
        x *= x;
        n = Math.floor(n / 2);
    }
    return result;
}
```

### Visualization

```
pow(2, 10):
  pow(2, 10)
    └── pow(2, 5) = 32
          └── pow(2, 2) = 4
                └── pow(2, 1) = 2
                      └── pow(2, 0) = 1
                      return 1 * 1 * 2 = 2  (odd)
                return 2 * 2 = 4             (even)
          return 4 * 4 * 2 = 32              (odd)
    return 32 * 32 = 1024                    (even)
```

---

## 📐 Problem 2: Binary Search

### Problem Statement
Find target in a sorted array. Return index or -1 if not found.

```
arr = [1, 3, 5, 7, 9, 11]
target = 7 → return 3
target = 6 → return -1
```

### How It Works

```
Find 7 in [1, 3, 5, 7, 9, 11]

Step 1: mid = 2 (value 5)
        5 < 7, search right half
        [1, 3, 5, 7, 9, 11]
                 ↑ search here

Step 2: mid = 4 (value 9)
        9 > 7, search left half
        [1, 3, 5, 7, 9, 11]
                 ↑ search here

Step 3: mid = 3 (value 7)
        7 == 7, found at index 3!
```

### 💻 Code

#### Recursive Version

```python
def binary_search_recursive(arr: list[int], target: int, 
                           lo: int = 0, hi: int = None) -> int:
    """
    Binary search using recursion.
    
    Time: O(log n) - halving search space
    Space: O(log n) - recursion depth
    """
    if hi is None:
        hi = len(arr) - 1
    
    # Base case: not found
    if lo > hi:
        return -1
    
    mid = (lo + hi) // 2
    
    if arr[mid] == target:
        return mid
    elif arr[mid] < target:
        return binary_search_recursive(arr, target, mid + 1, hi)
    else:
        return binary_search_recursive(arr, target, lo, mid - 1)


# Example
arr = [1, 3, 5, 7, 9, 11]
print(binary_search_recursive(arr, 7))   # 3
print(binary_search_recursive(arr, 6))   # -1
```

#### Iterative Version (Preferred)

```python
def binary_search_iterative(arr: list[int], target: int) -> int:
    """
    Binary search using iteration.
    
    Time: O(log n)
    Space: O(1) - no recursion stack
    """
    lo, hi = 0, len(arr) - 1
    
    while lo <= hi:
        mid = (lo + hi) // 2
        
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            lo = mid + 1
        else:
            hi = mid - 1
    
    return -1
```

```javascript
// Recursive
function binarySearchRecursive(arr, target, lo = 0, hi = arr.length - 1) {
    if (lo > hi) return -1;
    
    const mid = Math.floor((lo + hi) / 2);
    
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) {
        return binarySearchRecursive(arr, target, mid + 1, hi);
    }
    return binarySearchRecursive(arr, target, lo, mid - 1);
}

// Iterative (preferred)
function binarySearchIterative(arr, target) {
    let lo = 0, hi = arr.length - 1;
    
    while (lo <= hi) {
        const mid = Math.floor((lo + hi) / 2);
        
        if (arr[mid] === target) return mid;
        if (arr[mid] < target) {
            lo = mid + 1;
        } else {
            hi = mid - 1;
        }
    }
    return -1;
}
```

---

## ⚡ Complexity Analysis

### Power (x^n)

| Version | Time | Space | Notes |
|---------|------|-------|-------|
| Naive |" O(n) "| O(1) | n multiplications |
| Recursive |" O(log n) "| O(log n) | Halving each step |
| Iterative |" O(log n) "| O(1) | Best overall |

**Why O(log n)?**
```
n → n/2 → n/4 → n/8 → ... → 1
Takes log₂(n) steps to reduce n to 1
```

### Binary Search

| Version | Time | Space | Notes |
|---------|------|-------|-------|
| Recursive |" O(log n) "| O(log n) | Stack depth |
| Iterative |" O(log n) "| O(1) | Preferred |

---

## 🔄 Variations

### Power Variations

| Variation | Change | Example |
|-----------|--------|---------|
| Matrix power | x is a matrix |" Fibonacci in O(log n) "|
| Modular power | result mod m | Cryptography |

### Binary Search Variations

| Variation | Description | LeetCode |
|-----------|-------------|----------|
| Find leftmost | First occurrence | LC 34 |
| Find rightmost | Last occurrence | LC 34 |
| Search rotated | Rotated sorted array | LC 33 |
| Search 2D | 2D sorted matrix | LC 74 |
| Find peak | Peak element | LC 162 |

---

## ⚠️ Common Mistakes

### Power: Forgetting Negative Exponent

❌ **Wrong:**
```python
def my_pow(x, n):
    if n == 0: return 1
    half = my_pow(x, n // 2)
    # Doesn't handle n < 0!
```

✅ **Correct:**
```python
def my_pow(x, n):
    if n < 0:
        x = 1 / x
        n = -n
    # Then proceed...
```

### Binary Search: Wrong Condition

❌ **Wrong:**
```python
while lo < hi:  # Misses when lo == hi
    ...
```

✅ **Correct:**
```python
while lo <= hi:  # Includes when lo == hi
    ...
```

### Binary Search: Integer Overflow (in some languages)

❌ **Wrong (can overflow in Java/C++):**
```python
mid = (lo + hi) / 2
```

✅ **Correct:**
```python
mid = lo + (hi - lo) // 2
```

### Binary Search: Wrong Update

❌ **Wrong:**
```python
if arr[mid] < target:
    lo = mid  # Should be mid + 1, causes infinite loop
```

✅ **Correct:**
```python
if arr[mid] < target:
    lo = mid + 1
```

---

## 📝 Practice Problems

### Easy (Learn the pattern)

| Problem | Focus | LeetCode |
|---------|-------|----------|
| Binary Search | Basic implementation | [LC 704](https://leetcode.com/problems/binary-search/) |
| Pow(x, n) | Fast exponentiation | [LC 50](https://leetcode.com/problems/powx-n/) |
| Sqrt(x) | Binary search variant | [LC 69](https://leetcode.com/problems/sqrtx/) |

### Medium (Apply pattern)

| Problem | Focus | LeetCode |
|---------|-------|----------|
| Search in Rotated Array | Modified binary search | [LC 33](https://leetcode.com/problems/search-in-rotated-sorted-array/) |
| Find First and Last | Leftmost/rightmost | [LC 34](https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/) |
| Find Peak Element | Local maximum | [LC 162](https://leetcode.com/problems/find-peak-element/) |
| Search 2D Matrix | 2D binary search | [LC 74](https://leetcode.com/problems/search-a-2d-matrix/) |

### Hard (Master pattern)

| Problem | Focus | LeetCode |
|---------|-------|----------|
| Median of Two Sorted Arrays | Complex binary search | [LC 4](https://leetcode.com/problems/median-of-two-sorted-arrays/) |

<details>
<summary><strong>🧠 Spaced Repetition Schedule</strong></summary>

**Week 1:**
- Day 1: Implement power (recursive + iterative)
- Day 2: Implement binary search (both versions)
- Day 3: Solve LC 704 and LC 50
- Day 5: Solve LC 69 (sqrt)

**Week 2:**
- Day 8: LC 33 (rotated array)
- Day 10: LC 34 (first and last position)
- Day 12: LC 162 (peak element)
- Day 14: Review all, identify patterns

</details>

---

## 🎤 Interview Context

<details>
<summary><strong>How to Communicate in Interviews</strong></summary>

**For Power:**
> "I'll use fast exponentiation. The key insight is x^n = (x^(n/2))², which gives O(log n) time instead of O(n)."

**For Binary Search:**
> "Since the array is sorted, I'll use binary search. I maintain two pointers, lo and hi, and repeatedly compare the middle element with the target, halving the search space each time."

**When to mention trade-offs:**
> "I'll use the iterative version because it has O(1) space compared to O(log n) for recursive."

**Common follow-ups:**
- "What if there are duplicates?" → Use leftmost/rightmost variation
- "What's the time complexity?" → O(log n), explain why
- "Can you do it without recursion?" → Yes, show iterative

</details>

---

## ⏱️ Time Estimates

| Activity | Time | Notes |
|----------|------|-------|
| Understand power algorithm | 15-20 min | With examples |
| Implement power (both ways) | 15-20 min | |
| Understand binary search | 10-15 min | Simpler concept |
| Implement binary search | 10-15 min | |
| Solve 3 binary search problems | 45-60 min | LC 704, 50, 69 |

---

## 💡 Key Insight

> **Halving = O(log n)**
>
> Whenever you can halve the problem size at each step, you get O(log n) time:
> - Binary search: halve the search space
> - Fast exponentiation: halve the exponent
> - Divide and conquer: split into halves
>
> This is one of the most powerful techniques in algorithms, turning O(n) into O(log n).

---

## 🔗 Related

- [Factorial and Fibonacci](./01-Factorial-Fibonacci.md) - Previous topic
- [Divide and Conquer](../../03-Divide-Conquer/3.1-DC-Basics.md) - Advanced application
- [Recursion on Arrays](../1.5-Recursion-On-Arrays.md) - Array techniques
