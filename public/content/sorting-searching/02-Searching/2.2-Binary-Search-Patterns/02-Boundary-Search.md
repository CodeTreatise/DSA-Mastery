# 02 - Boundary Search (First/Last Occurrence)

> **Finding Lower and Upper Bounds**  
> **Interview Value:** ⭐⭐⭐⭐⭐ - Most common binary search variation  
> **Prerequisites:** [2.1 Binary Search Basics](../2.1-Binary-Search-Basics.md)

---

## Overview

**Boundary Search** finds the first or last occurrence of an element (or where it would be inserted). This is essential when dealing with:
- Arrays with **duplicates**
- Finding the **range** of an element
- **Counting occurrences**

```
Array: [1, 2, 2, 2, 2, 3, 4]
Target: 2

First occurrence: index 1
Last occurrence:  index 4
Count: 4 occurrences
```

The key insight: **Don't stop when you find target—keep searching to find the boundary.**

---

## 🎯 Pattern Recognition

<details>
<summary><strong>When to Use Boundary Search</strong></summary>

**Look for these signals:**
- "Find **first** occurrence"
- "Find **last** occurrence"
- "Count **how many** times element appears"
- "Find the **range** of an element"
- Array has **duplicates**
- "Find **lower bound**" (first element ≥ target)
- "Find **upper bound**" (first element > target)

**The two main variations:**

| Type | Returns | Example |
|------|---------|---------|
| **Lower Bound** | First index where arr[i] ≥ target | Python's `bisect_left` |
| **Upper Bound** | First index where arr[i] > target | Python's `bisect_right` |

</details>

---

## ✅ When to Use

- **First occurrence** in sorted array with duplicates
- **Last occurrence** in sorted array with duplicates
- **Count occurrences** (last - first + 1)
- **Insertion point** for maintaining sorted order
- **Range queries** (elements between low and high)

---

## ❌ When NOT to Use

| Situation | Use Instead | Why |
|-----------|-------------|-----|
| Finding exact element (no duplicates) | Standard binary search | Simpler |
| Unsorted array | Sort first or linear scan | No order to exploit |
| Need all matching elements | Linear scan of range | Boundary gives endpoints only |

---

## 🔗 Concept Map

<details>
<summary><strong>Prerequisites & Next Steps</strong></summary>

**Before this, you should know:**
- [Binary Search Basics](../2.1-Binary-Search-Basics.md)

**After mastering this:**
- [Rotated Arrays](./03-Rotated-Arrays.md)
- [Search on Answer](./04-Search-On-Answer.md)

**Combines with:**
- Two Pointers for range problems
- Counting problems

</details>

---

## 📐 How It Works

### Lower Bound (First Occurrence)

```
Array: [1, 2, 2, 2, 3, 4]
Target: 2

Step 1: mid=2, arr[2]=2
        2 >= 2, so right = mid (keep searching left)
        
Step 2: mid=1, arr[1]=2
        2 >= 2, so right = mid
        
Step 3: mid=0, arr[0]=1
        1 < 2, so left = mid + 1
        
left = 1 = right → Found first occurrence at index 1
```

### Upper Bound (After Last Occurrence)

```
Array: [1, 2, 2, 2, 3, 4]
Target: 2

Step 1: mid=2, arr[2]=2
        2 <= 2, so left = mid + 1 (keep searching right)
        
Step 2: mid=4, arr[4]=3
        3 > 2, so right = mid
        
Step 3: mid=3, arr[3]=2
        2 <= 2, so left = mid + 1
        
left = 4 = right → Upper bound at index 4 (first element > 2)
Last occurrence = upper_bound - 1 = 3
```

### Visual Comparison

```
Array: [1, 2, 2, 2, 2, 3, 4]
Index:  0  1  2  3  4  5  6

lower_bound(2) = 1  → First 2
upper_bound(2) = 5  → First element after all 2s
last occurrence = upper_bound - 1 = 4

Count of 2s = upper_bound - lower_bound = 5 - 1 = 4
```

---

## 💻 Code Implementation

### Template: Find First Occurrence (Lower Bound)

**Python:**
```python
def find_first(arr: list[int], target: int) -> int:
    """
    Find index of first occurrence of target.
    
    Returns: Index of first target, or -1 if not found
    Time: O(log n), Space: O(1)
    """
    left, right = 0, len(arr)
    
    while left < right:  # Note: < not <=
        mid = left + (right - left) // 2
        
        if arr[mid] >= target:
            right = mid  # Don't exclude mid, might be the answer
        else:
            left = mid + 1
    
    # Verify we found the target
    if left < len(arr) and arr[left] == target:
        return left
    return -1


# Example
arr = [1, 2, 2, 2, 3, 4]
print(find_first(arr, 2))  # 1
print(find_first(arr, 5))  # -1
```

**JavaScript:**
```javascript
function findFirst(arr, target) {
    let left = 0;
    let right = arr.length;
    
    while (left < right) {
        const mid = left + Math.floor((right - left) / 2);
        
        if (arr[mid] >= target) {
            right = mid;
        } else {
            left = mid + 1;
        }
    }
    
    return (left < arr.length && arr[left] === target) ? left : -1;
}

console.log(findFirst([1, 2, 2, 2, 3, 4], 2)); // 1
```

---

### Template: Find Last Occurrence

**Python:**
```python
def find_last(arr: list[int], target: int) -> int:
    """
    Find index of last occurrence of target.
    
    Returns: Index of last target, or -1 if not found
    Time: O(log n), Space: O(1)
    """
    left, right = 0, len(arr)
    
    while left < right:
        mid = left + (right - left) // 2
        
        if arr[mid] <= target:
            left = mid + 1  # Keep searching right
        else:
            right = mid
    
    # left is now first index > target
    # So last occurrence is at left - 1
    if left > 0 and arr[left - 1] == target:
        return left - 1
    return -1


# Example
arr = [1, 2, 2, 2, 3, 4]
print(find_last(arr, 2))  # 3
```

```javascript
function findLast(arr, target) {
    let left = 0;
    let right = arr.length;
    
    while (left < right) {
        const mid = left + Math.floor((right - left) / 2);
        
        if (arr[mid] <= target) {
            left = mid + 1;
        } else {
            right = mid;
        }
    }
    
    return (left > 0 && arr[left - 1] === target) ? left - 1 : -1;
}
```

---

### Template: Lower Bound and Upper Bound

```python
def lower_bound(arr: list[int], target: int) -> int:
    """
    Find first index where arr[i] >= target.
    Equivalent to bisect_left.
    """
    left, right = 0, len(arr)
    
    while left < right:
        mid = left + (right - left) // 2
        if arr[mid] < target:
            left = mid + 1
        else:
            right = mid
    
    return left


def upper_bound(arr: list[int], target: int) -> int:
    """
    Find first index where arr[i] > target.
    Equivalent to bisect_right.
    """
    left, right = 0, len(arr)
    
    while left < right:
        mid = left + (right - left) // 2
        if arr[mid] <= target:
            left = mid + 1
        else:
            right = mid
    
    return left


# Usage
arr = [1, 2, 2, 2, 3, 4]
print(lower_bound(arr, 2))  # 1 (first 2)
print(upper_bound(arr, 2))  # 4 (first element > 2)

# Count occurrences
count = upper_bound(arr, 2) - lower_bound(arr, 2)  # 3
```

---

## 💻 Problem: Find First and Last Position (LC 34)

### Problem Statement
Given sorted array with duplicates, find starting and ending position of target.

```
arr = [5, 7, 7, 8, 8, 10], target = 8
Output: [3, 4]

arr = [5, 7, 7, 8, 8, 10], target = 6
Output: [-1, -1]
```

### Code

```python
def search_range(nums: list[int], target: int) -> list[int]:
    """
    Find first and last position of target.
    
    Time: O(log n), Space: O(1)
    """
    def find_bound(is_first: bool) -> int:
        left, right = 0, len(nums)
        
        while left < right:
            mid = left + (right - left) // 2
            
            if nums[mid] > target or (is_first and nums[mid] == target):
                right = mid
            else:
                left = mid + 1
        
        return left
    
    # Find first occurrence
    first = find_bound(True)
    if first >= len(nums) or nums[first] != target:
        return [-1, -1]
    
    # Find last occurrence (first occurrence of next value - 1)
    last = find_bound(False) - 1
    
    return [first, last]


# Example
print(search_range([5, 7, 7, 8, 8, 10], 8))  # [3, 4]
print(search_range([5, 7, 7, 8, 8, 10], 6))  # [-1, -1]
```

```javascript
function searchRange(nums, target) {
    function findBound(isFirst) {
        let left = 0, right = nums.length;
        
        while (left < right) {
            const mid = left + Math.floor((right - left) / 2);
            
            if (nums[mid] > target || (isFirst && nums[mid] === target)) {
                right = mid;
            } else {
                left = mid + 1;
            }
        }
        return left;
    }
    
    const first = findBound(true);
    if (first >= nums.length || nums[first] !== target) {
        return [-1, -1];
    }
    
    const last = findBound(false) - 1;
    return [first, last];
}
```

---

## ⚡ Complexity Analysis

| Operation | Time | Space | Notes |
|-----------|------|-------|-------|
| Find first |" O(log n) "| O(1) | Single binary search |
| Find last |" O(log n) "| O(1) | Single binary search |
| Find range |" O(log n) "| O(1) | Two binary searches |
| Count occurrences |" O(log n) "| O(1) | upper - lower |

---

## 🔄 Variations

| Variation | Implementation | Use Case |
|-----------|----------------|----------|
| **First occurrence** | `arr[mid] >= target → right = mid` | Find leftmost |
| **Last occurrence** | `arr[mid] <= target → left = mid + 1` | Find rightmost |
| **Lower bound** | Same as first occurrence | Insertion point |
| **Upper bound** | Same as after-last | Elements ≤ target |

### Quick Reference Table

```
For target = 5 in [1, 3, 5, 5, 5, 7]:

lower_bound(5) = 2  → First 5
upper_bound(5) = 5  → Position after last 5
first_occurrence(5) = 2
last_occurrence(5) = 4
count(5) = 5 - 2 = 3
```

---

## ⚠️ Common Mistakes

### 1. Stopping at First Match

❌ **Wrong:**
```python
if arr[mid] == target:
    return mid  # Might not be FIRST occurrence!
```

✅ **Correct:**
```python
if arr[mid] >= target:
    right = mid  # Keep searching left for first
```

### 2. Wrong Return Value Check

❌ **Wrong:**
```python
# Forgot to verify target exists
return left  # Might return wrong index
```

✅ **Correct:**
```python
if left < len(arr) and arr[left] == target:
    return left
return -1
```

### 3. Off-by-One for Last Occurrence

❌ **Wrong:**
```python
# For last occurrence
return left  # This is AFTER the last occurrence
```

✅ **Correct:**
```python
# For last occurrence  
return left - 1  # One before upper bound
```

---

## 📝 Practice Problems

### Easy

| Problem | Focus | LeetCode |
|---------|-------|----------|
| Search Insert Position | Lower bound | [LC 35](https://leetcode.com/problems/search-insert-position/) |

### Medium

| Problem | Focus | LeetCode |
|---------|-------|----------|
| Find First and Last Position | Both bounds | [LC 34](https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/) |
| Count of Element in Sorted Array | upper - lower | Practice |
| Find K Closest Elements | Boundary + window | [LC 658](https://leetcode.com/problems/find-k-closest-elements/) |

<details>
<summary><strong>🧠 Spaced Repetition Schedule</strong></summary>

**Week 1:**
- Day 1: LC 35 Search Insert Position
- Day 3: LC 34 Find First and Last Position
- Day 5: Redo without looking

**Week 2:**
- Day 8: Implement lower_bound and upper_bound from memory
- Day 10: Count occurrences using bounds
- Day 14: Review all, write templates from scratch

</details>

---

## 🎤 Interview Context

<details>
<summary><strong>How to Communicate in Interviews</strong></summary>

**Recognizing the problem:**
> "Since there are duplicates and I need to find the first/last occurrence, I'll modify binary search to continue searching even after finding a match."

**Key insight to share:**
> "For first occurrence, when I find a match I keep searching left. For last occurrence, I keep searching right."

**Follow-up: Count occurrences**
> "I can count occurrences in O(log n) by finding upper_bound - lower_bound."

**Company Focus:**

| Company | Boundary Search Frequency |
|---------|--------------------------|
| Google | ⭐⭐⭐⭐⭐ Very common |
| Amazon | ⭐⭐⭐⭐ Common |
| Meta | ⭐⭐⭐⭐ Common |

</details>

---

## ⏱️ Time Estimates

| Activity | Time | Notes |
|----------|------|-------|
| Understand concept | 20-30 min | Lower vs upper bound |
| LC 35 | 15-20 min | Basic |
| LC 34 | 25-30 min | Both bounds |
| Write templates from memory | 5-10 min | Interview goal |

---

## 💡 Key Insight

> **The difference between templates is just ONE operator:**
>
> - **Lower bound (≥):** `if arr[mid] < target: left = mid + 1`
> - **Upper bound (>):** `if arr[mid] <= target: left = mid + 1`
>
> Remember: Lower bound uses `<`, Upper bound uses `<=`!

---

## 🔗 Related

- [Binary Search Basics](../2.1-Binary-Search-Basics.md) - Foundation
- [Rotated Arrays](./03-Rotated-Arrays.md) - Next pattern
- [Search on Answer](./04-Search-On-Answer.md) - Advanced pattern
