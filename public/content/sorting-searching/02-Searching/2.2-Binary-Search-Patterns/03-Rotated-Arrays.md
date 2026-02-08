# 03 - Rotated Sorted Arrays

> **Binary Search on Rotated Arrays**  
> **Interview Value:** ⭐⭐⭐⭐⭐ - FAANG favorite  
> **Prerequisites:** [2.1 Binary Search Basics](../2.1-Binary-Search-Basics.md)

---

## Overview

A **rotated sorted array** was originally sorted, then rotated at some pivot:

```
Original: [1, 2, 3, 4, 5, 6, 7]
Rotated:  [4, 5, 6, 7, 1, 2, 3]  (rotated at index 4)
```

The key insight: **One half of the array is ALWAYS sorted. Use this to decide which half to search.**

---

## 🎯 Pattern Recognition

<details>
<summary><strong>When to Use Rotated Array Binary Search</strong></summary>

**Keywords:**
- "Rotated sorted array"
- "Originally sorted"
- "Find minimum" / "Find pivot"
- "Search in rotated"

**The structure:**
```
[4, 5, 6, 7, 1, 2, 3]
 ├───────┤ ├───────┤
 Larger    Smaller
 (sorted)  (sorted)
 
The rotation point is where larger meets smaller.
```

**Key property:**
At any midpoint, at least ONE half is fully sorted:
- If `arr[left] <= arr[mid]`: Left half is sorted
- If `arr[mid] <= arr[right]`: Right half is sorted

</details>

---

## ✅ When to Use

- **Find minimum in rotated array**
- **Find rotation count** (index of minimum)
- **Search for element in rotated array**
- **Find peak/pivot point**

---

## ❌ When NOT to Use

| Situation | Use Instead | Why |
|-----------|-------------|-----|
| Array is not sorted originally | Other approaches | No sorted property |
| Lots of duplicates | Modified approach with linear fallback | Can't determine sorted half |
| Array is just sorted (not rotated) | Standard binary search | Simpler |

---

## 🔗 Concept Map

<details>
<summary><strong>Prerequisites & Next Steps</strong></summary>

**Before this, you should know:**
- [Binary Search Basics](../2.1-Binary-Search-Basics.md)
- [Boundary Search](./02-Boundary-Search.md)

**After mastering this:**
- [Search on Answer](./04-Search-On-Answer.md)
- [2D Matrix Search](./05-2D-Matrix-Search.md)

</details>

---

## 📐 How It Works

### Problem 1: Find Minimum

```
Array: [4, 5, 6, 7, 1, 2, 3]
              ↑
        Minimum is here (rotation point)

Key insight: Minimum is where arr[i] < arr[i-1]
Alternative: It's in the unsorted half
```

### Visualization: Find Minimum

```
[4, 5, 6, 7, 1, 2, 3]
 L        M        R

arr[mid]=7 > arr[right]=3
→ Minimum is in RIGHT half (unsorted part)

[4, 5, 6, 7, 1, 2, 3]
             L  M  R

arr[mid]=2 < arr[right]=3
→ Minimum is at or BEFORE mid

[4, 5, 6, 7, 1, 2, 3]
             LR

Found! arr[4] = 1
```

### Problem 2: Search for Element

```
Array: [4, 5, 6, 7, 0, 1, 2], target = 0
 L        M        R

Step 1: mid=3, arr[mid]=7
        Left half [4,5,6,7] is sorted
        Target 0 NOT in [4,7], so search RIGHT

Step 2: [0, 1, 2]
         L  M  R
        Right half is sorted
        Target 0 in [0,2]? Yes, search here
        Found at index 4!
```

---

## 💻 Code Implementation

### Problem 1: Find Minimum in Rotated Sorted Array (LC 153)

**Python:**
```python
def find_min(nums: list[int]) -> int:
    """
    Find minimum element in rotated sorted array (no duplicates).
    
    Time: O(log n), Space: O(1)
    """
    left, right = 0, len(nums) - 1
    
    # If not rotated, first element is minimum
    if nums[left] < nums[right]:
        return nums[left]
    
    while left < right:
        mid = left + (right - left) // 2
        
        if nums[mid] > nums[right]:
            # Minimum is in right half
            left = mid + 1
        else:
            # Minimum is at mid or in left half
            right = mid
    
    return nums[left]


# Examples
print(find_min([3, 4, 5, 1, 2]))  # 1
print(find_min([4, 5, 6, 7, 0, 1, 2]))  # 0
print(find_min([11, 13, 15, 17]))  # 11 (not rotated)
```

**JavaScript:**
```javascript
function findMin(nums) {
    let left = 0;
    let right = nums.length - 1;
    
    if (nums[left] < nums[right]) {
        return nums[left];
    }
    
    while (left < right) {
        const mid = left + Math.floor((right - left) / 2);
        
        if (nums[mid] > nums[right]) {
            left = mid + 1;
        } else {
            right = mid;
        }
    }
    
    return nums[left];
}
```

---

### Problem 2: Search in Rotated Sorted Array (LC 33)

**Python:**
```python
def search_rotated(nums: list[int], target: int) -> int:
    """
    Search for target in rotated sorted array (no duplicates).
    
    Key insight: One half is ALWAYS sorted.
    1. Find which half is sorted
    2. Check if target is in that half
    3. Eliminate half accordingly
    
    Time: O(log n), Space: O(1)
    """
    left, right = 0, len(nums) - 1
    
    while left <= right:
        mid = left + (right - left) // 2
        
        if nums[mid] == target:
            return mid
        
        # Check which half is sorted
        if nums[left] <= nums[mid]:
            # Left half is sorted
            if nums[left] <= target < nums[mid]:
                right = mid - 1  # Target in left half
            else:
                left = mid + 1   # Target in right half
        else:
            # Right half is sorted
            if nums[mid] < target <= nums[right]:
                left = mid + 1   # Target in right half
            else:
                right = mid - 1  # Target in left half
    
    return -1


# Examples
print(search_rotated([4, 5, 6, 7, 0, 1, 2], 0))  # 4
print(search_rotated([4, 5, 6, 7, 0, 1, 2], 3))  # -1
print(search_rotated([1], 0))  # -1
```

**JavaScript:**
```javascript
function searchRotated(nums, target) {
    let left = 0;
    let right = nums.length - 1;
    
    while (left <= right) {
        const mid = left + Math.floor((right - left) / 2);
        
        if (nums[mid] === target) {
            return mid;
        }
        
        // Check which half is sorted
        if (nums[left] <= nums[mid]) {
            // Left half is sorted
            if (nums[left] <= target && target < nums[mid]) {
                right = mid - 1;
            } else {
                left = mid + 1;
            }
        } else {
            // Right half is sorted
            if (nums[mid] < target && target <= nums[right]) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
    }
    
    return -1;
}
```

---

### Problem 3: Search in Rotated Sorted Array II (With Duplicates - LC 81)

```python
def search_rotated_with_dups(nums: list[int], target: int) -> bool:
    """
    Search in rotated sorted array WITH duplicates.
    
    Key difference: When nums[left] == nums[mid] == nums[right],
    we can't determine which half is sorted.
    
    Time: O(log n) average, O(n) worst case with all duplicates
    Space: O(1)
    """
    left, right = 0, len(nums) - 1
    
    while left <= right:
        mid = left + (right - left) // 2
        
        if nums[mid] == target:
            return True
        
        # Handle duplicates: can't determine sorted half
        if nums[left] == nums[mid] == nums[right]:
            left += 1
            right -= 1
            continue
        
        # Standard rotated array logic
        if nums[left] <= nums[mid]:
            # Left half is sorted
            if nums[left] <= target < nums[mid]:
                right = mid - 1
            else:
                left = mid + 1
        else:
            # Right half is sorted
            if nums[mid] < target <= nums[right]:
                left = mid + 1
            else:
                right = mid - 1
    
    return False


# Examples
print(search_rotated_with_dups([2, 5, 6, 0, 0, 1, 2], 0))  # True
print(search_rotated_with_dups([2, 5, 6, 0, 0, 1, 2], 3))  # False
print(search_rotated_with_dups([1, 0, 1, 1, 1], 0))  # True
```

---

### Problem 4: Find Rotation Count

```python
def find_rotation_count(nums: list[int]) -> int:
    """
    Find how many times the array was rotated.
    This is just the index of the minimum element.
    
    Time: O(log n), Space: O(1)
    """
    left, right = 0, len(nums) - 1
    
    # Not rotated
    if nums[left] < nums[right]:
        return 0
    
    while left < right:
        mid = left + (right - left) // 2
        
        if nums[mid] > nums[right]:
            left = mid + 1
        else:
            right = mid
    
    return left  # Index of minimum = rotation count


# Examples
print(find_rotation_count([4, 5, 6, 7, 0, 1, 2]))  # 4 (rotated 4 times)
print(find_rotation_count([3, 4, 5, 1, 2]))  # 3
print(find_rotation_count([1, 2, 3, 4, 5]))  # 0 (not rotated)
```

---

## ⚡ Complexity Analysis

| Problem | Time | Space | Notes |
|---------|------|-------|-------|
| Find Minimum |" O(log n) "| O(1) | No duplicates |
| Find Min with Dups |" O(n) worst "| O(1) | Falls back to linear |
| Search Element |" O(log n) "| O(1) | No duplicates |
| Search with Dups |" O(n) worst "| O(1) | Falls back to linear |

**Why O(n) worst case with duplicates?**
- When `nums[left] == nums[mid] == nums[right]`
- Can't determine which half is sorted
- Must shrink by 1 on each side
- Example: `[1, 1, 1, 1, 1, 0, 1, 1, 1]`

---

## 🔄 Variations

| Variation | Key Difference | LeetCode |
|-----------|----------------|----------|
| Find Minimum | Basic rotation problem | LC 153 |
| Find Min II (duplicates) | Handle duplicates | LC 154 |
| Search Element | Find specific value | LC 33 |
| Search II (duplicates) | Handle duplicates | LC 81 |
| Find Rotation Count | Index of minimum | Practice |
| Find Peak Element | Not rotated but has peak | LC 162 |

---

## ⚠️ Common Mistakes

### 1. Wrong Sorted Half Check

❌ **Wrong:**
```python
if nums[left] < nums[mid]:  # Missing equal!
```

✅ **Correct:**
```python
if nums[left] <= nums[mid]:  # Include equal for single element
```

### 2. Wrong Target Range Check

❌ **Wrong:**
```python
if nums[left] < target < nums[mid]:  # Wrong! Missing equal
```

✅ **Correct:**
```python
if nums[left] <= target < nums[mid]:  # Target could equal left
```

### 3. Not Handling Edge Cases

❌ **Wrong:**
```python
def find_min(nums):
    left, right = 0, len(nums) - 1
    while left < right:  # What if already sorted?
```

✅ **Correct:**
```python
def find_min(nums):
    if nums[0] < nums[-1]:  # Not rotated
        return nums[0]
    left, right = 0, len(nums) - 1
```

### 4. Duplicates Edge Case

❌ **Wrong (for duplicates version):**
```python
if nums[left] == nums[mid]:
    left = mid + 1  # Might skip the answer!
```

✅ **Correct:**
```python
if nums[left] == nums[mid] == nums[right]:
    left += 1
    right -= 1  # Shrink both sides
```

---

## 📝 Practice Problems

### Medium

| Problem | Focus | LeetCode |
|---------|-------|----------|
| Find Minimum in Rotated Sorted Array | Basic | [LC 153](https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/) |
| Search in Rotated Sorted Array | Search | [LC 33](https://leetcode.com/problems/search-in-rotated-sorted-array/) |
| Search in Rotated Sorted Array II | Duplicates | [LC 81](https://leetcode.com/problems/search-in-rotated-sorted-array-ii/) |
| Find Peak Element | Related pattern | [LC 162](https://leetcode.com/problems/find-peak-element/) |

### Hard

| Problem | Focus | LeetCode |
|---------|-------|----------|
| Find Min in Rotated Sorted Array II | Duplicates | [LC 154](https://leetcode.com/problems/find-minimum-in-rotated-sorted-array-ii/) |

<details>
<summary><strong>🧠 Spaced Repetition Schedule</strong></summary>

**Week 1:**
- Day 1: LC 153 Find Minimum
- Day 3: LC 33 Search in Rotated
- Day 5: Redo both without looking

**Week 2:**
- Day 8: LC 81 Search with Duplicates
- Day 10: Find Rotation Count
- Day 14: Review all, draw the algorithm

**Key insight to remember:**
"One half is ALWAYS sorted. Find it, check if target is there, eliminate the other half."

</details>

---

## 🎤 Interview Context

<details>
<summary><strong>How to Communicate in Interviews</strong></summary>

**Recognizing the problem:**
> "This is a rotated sorted array. The key insight is that one half is always sorted, so I can use binary search with a modification."

**Walking through the approach:**
> "At each step, I identify which half is sorted by comparing left, mid, and right values. Then I check if the target could be in that sorted half. If yes, I search there; otherwise, I search the other half."

**Handling duplicates:**
> "With duplicates, when left, mid, and right are all equal, I can't determine which half is sorted. In this case, I shrink both ends by one."

**Company Focus:**

| Company | Rotated Array Frequency |
|---------|------------------------|
| Google | ⭐⭐⭐⭐⭐ Very common |
| Amazon | ⭐⭐⭐⭐⭐ Very common |
| Meta | ⭐⭐⭐⭐ Common |
| Microsoft | ⭐⭐⭐⭐ Common |

</details>

---

## ⏱️ Time Estimates

| Activity | Time | Notes |
|----------|------|-------|
| Understand concept | 25-35 min | Visualize the rotation |
| LC 153 Find Minimum | 20-25 min | Foundation |
| LC 33 Search | 25-35 min | More complex |
| LC 81 with Duplicates | 30-40 min | Edge cases |
| Master pattern | 1-2 weeks | Multiple problems |

---

## 💡 Key Insight

> **In a rotated sorted array, ONE half is ALWAYS sorted.**
>
> The algorithm:
> 1. Find the sorted half: `nums[left] <= nums[mid]` means left is sorted
> 2. Check if target is in the sorted half
> 3. If yes, search there; otherwise, search the other half
>
> For duplicates: When you can't tell which half is sorted, shrink both ends.

---

## 🔗 Related

- [Binary Search Basics](../2.1-Binary-Search-Basics.md) - Foundation
- [Boundary Search](./02-Boundary-Search.md) - Finding first/last
- [Search on Answer](./04-Search-On-Answer.md) - Optimization pattern
