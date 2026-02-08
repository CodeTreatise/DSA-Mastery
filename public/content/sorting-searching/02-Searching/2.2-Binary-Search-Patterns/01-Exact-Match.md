# 01 - Exact Match Binary Search

> **Finding an Exact Target Value**  
> **Foundation:** The classic binary search pattern  
> **Prerequisites:** [Binary Search Basics](../2.1-Binary-Search-Basics.md)

---

## Overview

**Exact Match** is the foundational binary search pattern: find a specific target value in a sorted array and return its index (or -1 if not found).

This is the building block for all other binary search variations.

---

## 🎯 Pattern Recognition

<details>
<summary><strong>Identifying Exact Match Problems</strong></summary>

**Keywords:**
- "Find target"
- "Search for value"
- "Return index of"
- "Check if exists"
- "Sorted array"

**The structure:**
```
[1, 3, 5, 7, 9, 11, 13]
          ↑
     Find target = 7 → Return index 3
     Find target = 8 → Return -1 (not found)
```

**Key property:**
Array must be sorted. Each comparison eliminates half the remaining elements.

</details>

---

## ✅ When to Use

- Array is sorted (ascending or descending)
- Need to find exact match
- Want O(log n) time complexity
- Array is static (not frequently modified)

---

## ❌ When NOT to Use

| Situation | Use Instead | Why |
|-----------|-------------|-----|
| Unsorted array | Linear search or sort first | Binary search requires sorted |
| Linked list | Linear search |" No O(1) random access "|
| Frequent insertions | BST or balanced tree | Maintain sorted order |
| Need closest match | Boundary search | Exact match may not exist |
| Finding ALL occurrences | Boundary search | Find first and last |

---

## 🔗 Concept Map

<details>
<summary><strong>Prerequisites & Next Steps</strong></summary>

**Before this:**
- Array basics
- Big O notation

**After mastering this:**
- [Boundary Search](./02-Boundary-Search.md) - First/last occurrence
- [Rotated Arrays](./03-Rotated-Arrays.md) - Modified arrays
- [Search on Answer](./04-Search-On-Answer.md) - Optimization

**Combines with:**
- Two Pointers for range problems
- Hash Map for O(1) lookup when needed

</details>

---

## 📐 How It Works

### The Algorithm

```
Array: [2, 5, 8, 12, 16, 23, 38, 45]
Target: 23

Step 1: left=0, right=7, mid=3
        arr[3]=12 < 23 → Search right half
        
Step 2: left=4, right=7, mid=5
        arr[5]=23 = target → Found at index 5!
```

### Visualization

```
Initial:
[2, 5, 8, 12, 16, 23, 38, 45]
 L              M           R

arr[mid]=12 < target=23 → Go right

[2, 5, 8, 12, 16, 23, 38, 45]
              L   M       R

arr[mid]=23 = target → Found!
```

### Why It Works

**Loop Invariant:** If target exists, it's in `arr[left...right]`

Each iteration:
1. If `arr[mid] == target`: Found it!
2. If `arr[mid] < target`: Target must be in `arr[mid+1...right]`
3. If `arr[mid] > target`: Target must be in `arr[left...mid-1]`

---

## 💻 Code Implementation

### Iterative (Preferred)

**Python:**
```python
def binary_search(nums: list[int], target: int) -> int:
    """
    Standard binary search for exact match.
    
    Time: O(log n), Space: O(1)
    """
    left, right = 0, len(nums) - 1
    
    while left <= right:
        mid = left + (right - left) // 2  # Avoid overflow
        
        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            left = mid + 1  # Search right half
        else:
            right = mid - 1  # Search left half
    
    return -1  # Not found


# Examples
print(binary_search([1, 3, 5, 7, 9], 5))   # 2
print(binary_search([1, 3, 5, 7, 9], 6))   # -1
print(binary_search([1], 1))               # 0
print(binary_search([], 1))                # -1
```

**JavaScript:**
```javascript
function binarySearch(nums, target) {
    let left = 0;
    let right = nums.length - 1;
    
    while (left <= right) {
        const mid = left + Math.floor((right - left) / 2);
        
        if (nums[mid] === target) {
            return mid;
        } else if (nums[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    
    return -1;
}

// Examples
console.log(binarySearch([1, 3, 5, 7, 9], 5));  // 2
console.log(binarySearch([1, 3, 5, 7, 9], 6));  // -1
```

---

### Recursive

**Python:**
```python
def binary_search_recursive(nums: list[int], target: int,
                            left: int = None, right: int = None) -> int:
    """
    Recursive binary search.
    
    Time: O(log n), Space: O(log n) for call stack
    """
    if left is None:
        left, right = 0, len(nums) - 1
    
    if left > right:
        return -1  # Base case: not found
    
    mid = left + (right - left) // 2
    
    if nums[mid] == target:
        return mid
    elif nums[mid] < target:
        return binary_search_recursive(nums, target, mid + 1, right)
    else:
        return binary_search_recursive(nums, target, left, mid - 1)


# Example
print(binary_search_recursive([1, 3, 5, 7, 9], 7))  # 3
```

**JavaScript:**
```javascript
function binarySearchRecursive(nums, target, left = 0, right = nums.length - 1) {
    if (left > right) return -1;
    
    const mid = left + Math.floor((right - left) / 2);
    
    if (nums[mid] === target) return mid;
    else if (nums[mid] < target) 
        return binarySearchRecursive(nums, target, mid + 1, right);
    else 
        return binarySearchRecursive(nums, target, left, mid - 1);
}
```

---

### Descending Order

```python
def binary_search_desc(nums: list[int], target: int) -> int:
    """Binary search in descending sorted array."""
    left, right = 0, len(nums) - 1
    
    while left <= right:
        mid = left + (right - left) // 2
        
        if nums[mid] == target:
            return mid
        elif nums[mid] > target:  # Opposite direction!
            left = mid + 1
        else:
            right = mid - 1
    
    return -1


# Example
print(binary_search_desc([9, 7, 5, 3, 1], 5))  # 2
```

---

## ⚡ Complexity Analysis

| Case | Time | Space (Iterative) | Space (Recursive) |
|------|------|-------------------|-------------------|
| Best |" O(1) "| O(1) |" O(1) "|
| Average |" O(log n) "| O(1) |" O(log n) "|
| Worst |" O(log n) "| O(1) |" O(log n) "|

**Why O(log n)?**
- Each comparison eliminates half of remaining elements
- After k comparisons: n/2^k elements remain
- When n/2^k = 1: k = log₂(n) comparisons needed

**Real numbers:**
| Array Size | Max Comparisons |
|------------|-----------------|
| 1,000 | 10 |
| 1,000,000 | 20 |
| 1,000,000,000 | 30 |

---

## 🔄 Variations

| Variation | Key Change | Use Case |
|-----------|------------|----------|
| Descending order | Flip comparison | Sorted in reverse |
| Find insert position | Return left when not found | Where to insert |
| Case-insensitive | Compare lowercase | String search |
| With duplicates | Returns any match | Need boundary search for first/last |

---

## ⚠️ Common Mistakes

### 1. Integer Overflow (in some languages)

❌ **Wrong:**
```python
mid = (left + right) // 2  # Can overflow in C/Java for large arrays
```

✅ **Correct:**
```python
mid = left + (right - left) // 2  # Always safe
```

### 2. Wrong Loop Condition

❌ **Wrong:**
```python
while left < right:  # Misses single element case!
```

✅ **Correct:**
```python
while left <= right:  # Handles all cases
```

### 3. Wrong Update After Comparison

❌ **Wrong:**
```python
if nums[mid] < target:
    left = mid  # Infinite loop possible!
```

✅ **Correct:**
```python
if nums[mid] < target:
    left = mid + 1  # Skip the current mid
```

### 4. Off-by-One Errors

❌ **Wrong:**
```python
right = len(nums)  # Out of bounds!
```

✅ **Correct:**
```python
right = len(nums) - 1  # Last valid index
```

### 5. Empty Array

❌ **Wrong:**
```python
def binary_search(nums, target):
    mid = nums[len(nums) // 2]  # IndexError if empty!
```

✅ **Correct:**
```python
def binary_search(nums, target):
    if not nums:
        return -1
    # ... rest of code
```

---

## 📝 Practice Problems

### Easy

| Problem | Focus | LeetCode |
|---------|-------|----------|
| Binary Search | Classic implementation | [LC 704](https://leetcode.com/problems/binary-search/) |
| Guess Number Higher or Lower | Binary search API | [LC 374](https://leetcode.com/problems/guess-number-higher-or-lower/) |
| Search Insert Position | Return insertion point | [LC 35](https://leetcode.com/problems/search-insert-position/) |
| First Bad Version | Binary search with API | [LC 278](https://leetcode.com/problems/first-bad-version/) |

### Medium

| Problem | Focus | LeetCode |
|---------|-------|----------|
| Find Peak Element | Search with condition | [LC 162](https://leetcode.com/problems/find-peak-element/) |
| Search in Rotated Sorted Array | Modified array | [LC 33](https://leetcode.com/problems/search-in-rotated-sorted-array/) |

<details>
<summary><strong>🧠 Spaced Repetition Schedule</strong></summary>

**Day 1:** Write binary search from scratch
- No looking at reference
- Include edge cases

**Day 3:** Implement both iterative and recursive
- Explain the loop invariant out loud

**Day 7:** Solve LC 704 + LC 35 without hints

**Day 14:** Time yourself solving 3 binary search problems
- Target: < 10 min each

**Day 30:** Teach the algorithm to someone else

</details>

---

## 🎤 Interview Context

<details>
<summary><strong>How to Communicate in Interviews</strong></summary>

**Opening statement:**
> "Since the array is sorted, I'll use binary search for O(log n) time complexity."

**Explaining the approach:**
> "I maintain a search range with left and right pointers. At each step, I compare the middle element with target. If it's smaller, I search the right half; if larger, the left half."

**Discussing edge cases:**
> "I need to handle empty arrays, single elements, and target not found cases."

**Common follow-ups:**
1. "What if there are duplicates?" → Boundary search
2. "What about descending order?" → Flip comparisons
3. "Can you do it recursively?" → Yes, with O(log n) space

**Company Focus:**

| Company | Frequency |
|---------|-----------|
| All Companies | ⭐⭐⭐⭐⭐ Fundamental |

Binary search is a building block tested by all companies, often as part of larger problems.

</details>

---

## ⏱️ Time Estimates

| Activity | Time | Notes |
|----------|------|-------|
| Learn concept | 15-20 min | Understand the halving |
| Implement iterative | 5-10 min | Should be quick |
| Implement recursive | 5-10 min | With base case |
| LC 704 | 5-10 min | Straightforward |
| LC 35 | 10-15 min | Small modification |
| Master pattern | 1-2 hours | Until automatic |

---

## 💡 Key Insight

> **Binary search is about maintaining an invariant:**
>
> "If the target exists, it is within [left, right]"
>
> Each comparison proves which half can be eliminated, cutting the search space in half.
>
> **The formula:** `mid = left + (right - left) // 2`
> - Avoids overflow
> - Rounds down
> - Always within bounds

---

## 🔗 Related

- [Binary Search Basics](../2.1-Binary-Search-Basics.md) - Detailed theory
- [Boundary Search](./02-Boundary-Search.md) - Find first/last occurrence
- [Rotated Arrays](./03-Rotated-Arrays.md) - Search in rotated
- [Search on Answer](./04-Search-On-Answer.md) - Optimization problems
