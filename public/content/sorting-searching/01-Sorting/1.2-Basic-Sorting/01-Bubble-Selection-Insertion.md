# 01 - Bubble, Selection, and Insertion Sort

> **The O(n²) Sorting Algorithms**  
> **Interview Value:** ⭐⭐ - Know basics, rarely implement  
> **When to Use:** Small arrays, nearly sorted data

---

## Overview

These are the simplest sorting algorithms to understand and implement. While not efficient for large datasets, they have specific use cases and are fundamental for learning sorting concepts.

| Algorithm | Key Operation | Best Case | When Useful |
|-----------|---------------|-----------|-------------|
| **Bubble Sort** | Swap adjacent |" O(n) "| Nearly sorted, educational |
| **Selection Sort** | Find minimum |" O(n²) "| Minimum writes needed |
| **Insertion Sort** | Insert in place |" O(n) "| Small/nearly sorted |

---

## 🎯 Pattern Recognition

<details>
<summary><strong>When to Consider O(n²) Sorts</strong></summary>

**Use these when:**
- Array is very small (n < 50)
- Array is nearly sorted (Insertion Sort becomes O(n))
- Memory is extremely limited
- Simplicity is more important than speed
- Writing to memory is expensive (Selection Sort minimizes writes)

**In interviews:**
- Know these for educational purposes
- Usually use built-in sort or O(n log n) algorithms
- Insertion sort is part of Timsort (Python/Java built-in)

</details>

---

## 1. Bubble Sort

### How It Works

Repeatedly compare adjacent elements and swap if they're in the wrong order. After each pass, the largest unsorted element "bubbles up" to its correct position.

```
Pass 1: [5, 3, 8, 4, 2]
         ^  ^
         5 > 3, swap → [3, 5, 8, 4, 2]
            ^  ^
            5 < 8, no swap
               ^  ^
               8 > 4, swap → [3, 5, 4, 8, 2]
                  ^  ^
                  8 > 2, swap → [3, 5, 4, 2, 8]
        
After Pass 1: 8 is in final position
```

### Code Implementation

**Python:**
```python
def bubble_sort(arr: list[int]) -> list[int]:
    """
    Bubble Sort - swap adjacent elements until sorted.
    
    Time: O(n²) average/worst, O(n) best (already sorted)
    Space: O(1)
    Stable: Yes
    """
    n = len(arr)
    
    for i in range(n):
        swapped = False  # Optimization: early termination
        
        # Last i elements are already in place
        for j in range(n - 1 - i):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                swapped = True
        
        # If no swaps occurred, array is sorted
        if not swapped:
            break
    
    return arr


# Example
arr = [64, 34, 25, 12, 22, 11, 90]
print(bubble_sort(arr))  # [11, 12, 22, 25, 34, 64, 90]
```

**JavaScript:**
```javascript
function bubbleSort(arr) {
    const n = arr.length;
    
    for (let i = 0; i < n; i++) {
        let swapped = false;
        
        for (let j = 0; j < n - 1 - i; j++) {
            if (arr[j] > arr[j + 1]) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                swapped = true;
            }
        }
        
        if (!swapped) break;
    }
    
    return arr;
}
```

### ⚡ Complexity

| Case | Time | Why |
|------|------|-----|
| Best |" O(n) "| Already sorted, one pass with no swaps |
| Average |" O(n²) "| ~n²/2 comparisons and swaps |
| Worst |" O(n²) "| Reverse sorted, every element swaps |

---

## 2. Selection Sort

### How It Works

Find the minimum element in the unsorted portion and swap it with the first unsorted position. Repeat until sorted.

```
Initial: [64, 25, 12, 22, 11]

Pass 1: Find min in [64, 25, 12, 22, 11] → 11 at index 4
        Swap with index 0: [11, 25, 12, 22, 64]
        
Pass 2: Find min in [25, 12, 22, 64] → 12 at index 2
        Swap with index 1: [11, 12, 25, 22, 64]
        
Pass 3: Find min in [25, 22, 64] → 22 at index 3
        Swap with index 2: [11, 12, 22, 25, 64]
        
Pass 4: Find min in [25, 64] → 25 at index 3
        Already in place: [11, 12, 22, 25, 64]
```

### Code Implementation

**Python:**
```python
def selection_sort(arr: list[int]) -> list[int]:
    """
    Selection Sort - repeatedly find minimum and place at front.
    
    Time: O(n²) always
    Space: O(1)
    Stable: No (swapping can change relative order)
    
    Advantage: Minimizes number of swaps (exactly n-1 swaps)
    """
    n = len(arr)
    
    for i in range(n):
        # Find minimum element in remaining unsorted array
        min_idx = i
        for j in range(i + 1, n):
            if arr[j] < arr[min_idx]:
                min_idx = j
        
        # Swap the found minimum with first unsorted element
        arr[i], arr[min_idx] = arr[min_idx], arr[i]
    
    return arr


# Example
arr = [64, 25, 12, 22, 11]
print(selection_sort(arr))  # [11, 12, 22, 25, 64]
```

**JavaScript:**
```javascript
function selectionSort(arr) {
    const n = arr.length;
    
    for (let i = 0; i < n; i++) {
        let minIdx = i;
        
        for (let j = i + 1; j < n; j++) {
            if (arr[j] < arr[minIdx]) {
                minIdx = j;
            }
        }
        
        [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
    }
    
    return arr;
}
```

### ⚡ Complexity

| Case | Time | Why |
|------|------|-----|
| Best |" O(n²) "| Still must scan to find minimum |
| Average |" O(n²) "| n + (n-1) + ... + 1 = n(n-1)/2 |
| Worst |" O(n²) "| Same as average |

**Advantage:** Only O(n) swaps (good when writes are expensive)

---

## 3. Insertion Sort ⭐ (Most Important)

### How It Works

Build the sorted array one element at a time. For each element, find its correct position in the sorted portion and insert it there.

```
Initial: [5, 2, 4, 6, 1, 3]

Step 1: [5] | [2, 4, 6, 1, 3]  → Insert 2
        [2, 5] | [4, 6, 1, 3]
        
Step 2: [2, 5] | [4, 6, 1, 3]  → Insert 4
        [2, 4, 5] | [6, 1, 3]
        
Step 3: [2, 4, 5] | [6, 1, 3]  → Insert 6
        [2, 4, 5, 6] | [1, 3]
        
Step 4: [2, 4, 5, 6] | [1, 3]  → Insert 1
        [1, 2, 4, 5, 6] | [3]
        
Step 5: [1, 2, 4, 5, 6] | [3]  → Insert 3
        [1, 2, 3, 4, 5, 6]
```

### Code Implementation

**Python:**
```python
def insertion_sort(arr: list[int]) -> list[int]:
    """
    Insertion Sort - build sorted array by inserting elements.
    
    Time: O(n²) average/worst, O(n) best (already sorted)
    Space: O(1)
    Stable: Yes
    
    Best for: Nearly sorted arrays, small arrays
    Used in: Timsort (Python/Java built-in) for small partitions
    """
    n = len(arr)
    
    for i in range(1, n):
        key = arr[i]  # Element to insert
        j = i - 1
        
        # Shift elements greater than key to the right
        while j >= 0 and arr[j] > key:
            arr[j + 1] = arr[j]
            j -= 1
        
        # Insert key at correct position
        arr[j + 1] = key
    
    return arr


# Example
arr = [5, 2, 4, 6, 1, 3]
print(insertion_sort(arr))  # [1, 2, 3, 4, 5, 6]
```

**JavaScript:**
```javascript
function insertionSort(arr) {
    const n = arr.length;
    
    for (let i = 1; i < n; i++) {
        const key = arr[i];
        let j = i - 1;
        
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        
        arr[j + 1] = key;
    }
    
    return arr;
}
```

### Binary Insertion Sort (Optimization)

Use binary search to find insertion position (reduces comparisons but not shifts):

```python
def binary_insertion_sort(arr: list[int]) -> list[int]:
    """
    Binary Insertion Sort - use binary search for insertion position.
    
    Time: O(n²) for shifts, but O(n log n) comparisons
    """
    import bisect
    
    for i in range(1, len(arr)):
        key = arr[i]
        # Find position using binary search
        pos = bisect.bisect_left(arr, key, 0, i)
        # Shift and insert
        arr[pos + 1:i + 1] = arr[pos:i]
        arr[pos] = key
    
    return arr
```

### ⚡ Complexity

| Case | Time | Why |
|------|------|-----|
| Best |" O(n) "| Already sorted, no shifts needed |
| Average |" O(n²) "| ~n²/4 comparisons and shifts |
| Worst |" O(n²) "| Reverse sorted, maximum shifts |

---

## 🔗 Concept Map

<details>
<summary><strong>Algorithm Relationships</strong></summary>

```
O(n²) Sorting Algorithms
├── Bubble Sort
│   └── Variant: Cocktail Shaker Sort (bidirectional)
├── Selection Sort  
│   └── Variant: Double Selection (find min and max)
└── Insertion Sort ⭐
    ├── Variant: Binary Insertion Sort
    ├── Used in: Shell Sort (gap-based)
    └── Used in: Timsort (for small subarrays)
```

</details>

---

## 🔄 Comparison

| Aspect | Bubble | Selection | Insertion |
|--------|--------|-----------|-----------|
| **Time (Best)** |" O(n) "| O(n²) |" O(n) "|
| **Time (Worst)** |" O(n²) "| O(n²) |" O(n²) "|
| **Space** |" O(1) "| O(1) |" O(1) "|
| **Stable** | ✅ Yes | ❌ No | ✅ Yes |
| **Swaps** |" O(n²) "| O(n) |" O(n²) "|
| **Nearly Sorted** | Fast | Same | ⭐ Fast |
| **Use Case** | Educational | Min writes | Small/sorted |

### When to Use Each

```
Nearly sorted array? → Insertion Sort (O(n) best case)
Minimize writes?     → Selection Sort (O(n) swaps)
Educational purpose? → Bubble Sort (simple to understand)
```

---

## ⚠️ Common Mistakes

### 1. Off-by-One Errors

❌ **Wrong:**
```python
for i in range(n):
    for j in range(n - i):  # Missing -1
```

✅ **Correct:**
```python
for i in range(n):
    for j in range(n - 1 - i):  # Correct bound
```

### 2. Insertion Sort Starting Index

❌ **Wrong:**
```python
for i in range(n):  # Starts at 0
    key = arr[i]
```

✅ **Correct:**
```python
for i in range(1, n):  # Start at 1, first element is trivially sorted
    key = arr[i]
```

### 3. Not Using Optimization in Bubble Sort

❌ **Wrong:**
```python
def bubble_sort(arr):
    for i in range(n):
        for j in range(n - 1 - i):
            # Always does n passes even if sorted early
```

✅ **Correct:**
```python
def bubble_sort(arr):
    for i in range(n):
        swapped = False
        for j in range(n - 1 - i):
            # ... swap logic
        if not swapped:  # Early termination
            break
```

---

## 📝 Practice Problems

### Easy

| Problem | Focus | LeetCode |
|---------|-------|----------|
| Sort an Array | Implement any sort | [LC 912](https://leetcode.com/problems/sort-an-array/) |
| Insertion Sort List | Sort linked list | [LC 147](https://leetcode.com/problems/insertion-sort-list/) |

### Medium

| Problem | Focus | LeetCode |
|---------|-------|----------|
| Sort Colors | Dutch National Flag | [LC 75](https://leetcode.com/problems/sort-colors/) |

<details>
<summary><strong>🧠 Spaced Repetition Schedule</strong></summary>

**Day 1:** Implement all three sorts from scratch

**Day 3:** Trace through each algorithm on paper with 5-element array

**Day 7:** Implement Insertion Sort only (most important)
- Write test cases for edge cases

**Day 14:** Know when to use each algorithm (quiz yourself)

</details>

---

## 🎤 Interview Context

<details>
<summary><strong>How to Discuss in Interviews</strong></summary>

**If asked to implement a simple sort:**
> "I'll use Insertion Sort since it's simple, in-place, stable, and has O(n) best case for nearly sorted arrays. It's also used in Timsort for small subarrays."

**Discussing trade-offs:**
> "Bubble Sort is mainly educational. Selection Sort minimizes writes with only O(n) swaps. Insertion Sort is best for nearly sorted data or as part of hybrid algorithms."

**When asked about Timsort:**
> "Timsort uses Insertion Sort for small subarrays (typically n < 64) because it has low overhead and great cache performance for small arrays."

**Company relevance:**
- Rarely asked to implement in FAANG interviews
- May appear in coding tests or academic interviews
- Understanding is more important than memorization

</details>

---

## ⏱️ Time Estimates

| Activity | Time | Notes |
|----------|------|-------|
| Understand all three | 20-30 min | Visual trace helps |
| Implement Bubble | 5-10 min | Simplest |
| Implement Selection | 5-10 min | Find min pattern |
| Implement Insertion | 10-15 min | Most important |
| LC 147 Insertion Sort List | 25-30 min | Linked list variant |

---

## 💡 Key Insight

> **Insertion Sort is the only O(n²) sort you'll actually use:**
>
> 1. **O(n) for nearly sorted** - much faster than Merge/Quick Sort overhead
> 2. **Low overhead** - simple operations, cache-friendly
> 3. **Part of Timsort** - used in Python/Java built-in sort for small arrays
> 4. **Online algorithm** - can sort as elements arrive
>
> Selection Sort is useful when writes are expensive.
> Bubble Sort is mostly for education.

---

## 🔗 Related

- [Sorting Basics](../1.1-Sorting-Basics.md) - Overview and comparison
- [Merge Sort](../1.3-Merge-Sort.md) - O(n log n) divide & conquer
- [Quick Sort](../1.4-Quick-Sort.md) - O(n log n) partition approach
