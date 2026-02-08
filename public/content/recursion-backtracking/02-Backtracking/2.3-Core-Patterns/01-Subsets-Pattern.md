# 01 Subsets Pattern

> **The Foundation of Backtracking: Include or Exclude**  
> **Interview Frequency:** ⭐⭐⭐⭐⭐ - One of the most common patterns  
> **Grokking Pattern:** #18 Subsets

---

## Overview

The **Subsets Pattern** generates all possible subsets (power set) of a given set. It's the simplest backtracking pattern because at each element, you make a binary decision: **include it or exclude it**.

For a set of n elements, there are **2ⁿ subsets** (including empty set and the set itself).

---

## 🎯 Pattern Recognition

<details>
<summary><strong>How to Identify Subsets Problems</strong></summary>

**Look for these signals:**
- "Find **all subsets**" or "power set"
- "All possible combinations" (without specific size)
- "All subsequences" (order preserved, not contiguous)
- Binary choices per element (take it or leave it)

**Keywords in problem statement:**
- "subsets", "power set", "subsequences"
- "all possible selections"
- "every combination of elements"

**Key characteristic:**
- Each element can be **included OR excluded** independently
- Order within subset doesn't matter (unless it's subsequences)
- No constraints on subset size (unless specified)

</details>

---

## ✅ When to Use Subsets Pattern

- **Generate all subsets** of a collection
- **All subsequences** of a string/array
- **Subset sum** variants (finding subsets with specific property)
- **Feature selection** problems
- Any problem with **2ⁿ possibilities** based on include/exclude

---

## ❌ When NOT to Use

| Situation | Use Instead | Why |
|-----------|-------------|-----|
| Need ordered arrangements | Permutations Pattern | Subsets ignore order |
| Need exactly k elements | Combinations Pattern | Subsets generates all sizes |
| Finding ONE subset with property | DP/Greedy | Don't enumerate all |
| Counting subsets (not listing) | DP or Math (2ⁿ) | No need to generate |
| Contiguous subsequences | Sliding Window | Subsets aren't contiguous |

---

## 🔗 Concept Map

<details>
<summary><strong>Prerequisites & Next Steps</strong></summary>

**Before this, you should know:**
- [Backtracking Template](../2.2-Backtracking-Template.md) - Choose/Explore/Unchoose
- [Recursion Basics](../../01-Recursion/1.1-Recursion-Basics.md) - Base case and recursion

**After mastering this:**
- [Subsets II (with duplicates)](#handling-duplicates) - Skip consecutive duplicates
- [Combinations Pattern](./03-Combinations-Pattern.md) - Fixed-size subsets
- [Subset Sum problems](#practice-problems) - Constraint on sum

**Combines with:**
- **Bit Manipulation** - Iterative subset generation
- **Memoization** - For subset sum with DP

</details>

---

## 📐 How It Works

### Two Approaches

**Approach 1: Cascading (Iterative)**
Start with empty set, for each element, add it to all existing subsets.

```
nums = [1, 2, 3]

Start: [[]]
Add 1: [[], [1]]
Add 2: [[], [1], [2], [1,2]]
Add 3: [[], [1], [2], [1,2], [3], [1,3], [2,3], [1,2,3]]
```

**Approach 2: Backtracking (Recursive)**
At each index, choose to include or exclude, then recurse.

```
                        []
              ┌─────────┴─────────┐
           include 1           exclude 1
              [1]                  []
         ┌────┴────┐          ┌────┴────┐
      incl 2    excl 2     incl 2    excl 2
       [1,2]     [1]         [2]       []
       ┌─┴─┐    ┌─┴─┐       ┌─┴─┐     ┌─┴─┐
      [1,2,3][1,2][1,3][1] [2,3][2]  [3] []
```

### Decision Tree Visualization

```
Index:    0        1        2        (end)
         
          ○────────○────────○──────── [1,2,3] ✓
          │        │        └──────── [1,2]   ✓
          │        └────────○──────── [1,3]   ✓
          │                 └──────── [1]     ✓
          └────────○────────○──────── [2,3]   ✓
                   │        └──────── [2]     ✓
                   └────────○──────── [3]     ✓
                            └──────── []      ✓

Each node: Include current index? Yes (─) or No (│)
Leaves: All 2³ = 8 subsets
```

---

## 💻 Code Implementation

### Python - Approach 1: Cascading (Iterative)

```python
def subsets_iterative(nums: list[int]) -> list[list[int]]:
    """
    Generate all subsets using cascading approach.
    
    For each new element, add it to all existing subsets.
    Time: O(n * 2^n), Space: O(1) extra (output is O(n * 2^n))
    """
    result = [[]]  # Start with empty subset
    
    for num in nums:
        # Add current num to all existing subsets
        result += [subset + [num] for subset in result]
    
    return result

# Example
print(subsets_iterative([1, 2, 3]))
# [[], [1], [2], [1, 2], [3], [1, 3], [2, 3], [1, 2, 3]]
```

### Python - Approach 2: Backtracking

```python
def subsets(nums: list[int]) -> list[list[int]]:
    """
    Generate all subsets using backtracking.
    
    At each index, we include or exclude the element.
    Time: O(n * 2^n), Space: O(n) for recursion stack
    """
    result = []
    
    def backtrack(start: int, current: list):
        # Every state is a valid subset - add it
        result.append(current[:])  # Add copy!
        
        # Try including each element from start onwards
        for i in range(start, len(nums)):
            current.append(nums[i])      # Include (CHOOSE)
            backtrack(i + 1, current)    # Recurse with next index
            current.pop()                 # Exclude (UNCHOOSE)
    
    backtrack(0, [])
    return result

# Example
print(subsets([1, 2, 3]))
# [[], [1], [1, 2], [1, 2, 3], [1, 3], [2], [2, 3], [3]]
```

### Python - Alternative: Include/Exclude Explicitly

```python
def subsets_include_exclude(nums: list[int]) -> list[list[int]]:
    """
    Explicit include/exclude decision at each index.
    
    More intuitive decision tree structure.
    """
    result = []
    
    def backtrack(index: int, current: list):
        # Base case: processed all elements
        if index == len(nums):
            result.append(current[:])
            return
        
        # Choice 1: EXCLUDE current element
        backtrack(index + 1, current)
        
        # Choice 2: INCLUDE current element
        current.append(nums[index])
        backtrack(index + 1, current)
        current.pop()  # Backtrack
    
    backtrack(0, [])
    return result
```

### Python - Bit Manipulation Approach

```python
def subsets_bitmask(nums: list[int]) -> list[list[int]]:
    """
    Generate subsets using bit manipulation.
    
    Each number from 0 to 2^n - 1 represents a subset.
    Bit i = 1 means include nums[i].
    """
    n = len(nums)
    result = []
    
    # Iterate through all 2^n possibilities
    for mask in range(1 << n):  # 0 to 2^n - 1
        subset = []
        for i in range(n):
            if mask & (1 << i):  # If bit i is set
                subset.append(nums[i])
        result.append(subset)
    
    return result

# Example: nums = [1, 2, 3]
# mask=0 (000): []
# mask=1 (001): [1]
# mask=2 (010): [2]
# mask=3 (011): [1, 2]
# mask=4 (100): [3]
# mask=5 (101): [1, 3]
# mask=6 (110): [2, 3]
# mask=7 (111): [1, 2, 3]
```

### JavaScript - Backtracking

```javascript
function subsets(nums) {
    const result = [];
    
    function backtrack(start, current) {
        result.push([...current]); // Add copy
        
        for (let i = start; i < nums.length; i++) {
            current.push(nums[i]);
            backtrack(i + 1, current);
            current.pop();
        }
    }
    
    backtrack(0, []);
    return result;
}

// Example
console.log(subsets([1, 2, 3]));
// [[], [1], [1,2], [1,2,3], [1,3], [2], [2,3], [3]]
```

### JavaScript - Iterative

```javascript
function subsetsIterative(nums) {
    let result = [[]];
    
    for (const num of nums) {
        result = result.concat(
            result.map(subset => [...subset, num])
        );
    }
    
    return result;
}
```

### JavaScript - Bit Manipulation

```javascript
function subsetsBitmask(nums) {
    const n = nums.length;
    const result = [];
    
    for (let mask = 0; mask < (1 << n); mask++) {
        const subset = [];
        for (let i = 0; i < n; i++) {
            if (mask & (1 << i)) {
                subset.push(nums[i]);
            }
        }
        result.push(subset);
    }
    
    return result;
}
```

---

## Handling Duplicates (Subsets II)

When input has duplicates like `[1, 2, 2]`, we get duplicate subsets.

### The Problem

```
[1, 2, 2] naive approach:
[], [1], [2], [2], [1,2], [1,2], [2,2], [1,2,2]
       ↑    ↑         ↑    ↑
       Duplicate subsets!
```

### The Solution

1. **Sort** the array first
2. **Skip** consecutive duplicates at the same recursion level

```python
def subsets_with_dup(nums: list[int]) -> list[list[int]]:
    """
    Generate all unique subsets when nums may have duplicates.
    
    Key insight: Sort + skip duplicates at same level.
    Time: O(n * 2^n), Space: O(n)
    """
    nums.sort()  # CRITICAL: Sort first!
    result = []
    
    def backtrack(start: int, current: list):
        result.append(current[:])
        
        for i in range(start, len(nums)):
            # Skip duplicates at the same level
            # i > start ensures we only skip after first occurrence at this level
            if i > start and nums[i] == nums[i - 1]:
                continue
            
            current.append(nums[i])
            backtrack(i + 1, current)
            current.pop()
    
    backtrack(0, [])
    return result

# Example
print(subsets_with_dup([1, 2, 2]))
# [[], [1], [1, 2], [1, 2, 2], [2], [2, 2]]
# No duplicates!
```

### Why `i > start` and not `i > 0`?

```
At level where start=1:
  i=1: nums[1]=2, add it  ← First 2 at this level, INCLUDE
  i=2: nums[2]=2, nums[1]=2, i>start ✓, skip!  ← Duplicate at same level, SKIP

If we used i>0:
  i=1: nums[1]=2, nums[0]=1, different, add it
  i=2: nums[2]=2, nums[1]=2, i>0 ✓, skip!  ← Wrong! Would skip valid deeper inclusion
```

### JavaScript - With Duplicates

```javascript
function subsetsWithDup(nums) {
    nums.sort((a, b) => a - b); // Sort first!
    const result = [];
    
    function backtrack(start, current) {
        result.push([...current]);
        
        for (let i = start; i < nums.length; i++) {
            // Skip duplicates at same level
            if (i > start && nums[i] === nums[i - 1]) continue;
            
            current.push(nums[i]);
            backtrack(i + 1, current);
            current.pop();
        }
    }
    
    backtrack(0, []);
    return result;
}
```

---

## ⚡ Complexity Analysis

| Approach | Time | Space | Notes |
|----------|------|-------|-------|
| Backtracking |" O(n * 2ⁿ) "| O(n) stack | Most common |
| Iterative/Cascading |" O(n * 2ⁿ) "| O(1) extra | Simple |
| Bit Manipulation |" O(n * 2ⁿ) "| O(1) extra | Clever |
| With Duplicates |" O(n * 2ⁿ) "| O(n) stack | Same worst case |

**Why O(n * 2ⁿ)?**
- 2ⁿ subsets total
- Each subset can be up to size n
- Copying each subset is O(n)
- Total: O(n * 2ⁿ)

**Space (excluding output):**
- O(n) for recursion stack (max depth = n)
- O(n) for `current` array

---

## 🔄 Variations

| Variation | Difference | Problem |
|-----------|------------|---------|
| **Subsets I** | All subsets, unique elements | LC 78 |
| **Subsets II** | Handle duplicate elements | LC 90 |
| **Subset Sum** | Find subsets summing to target | Classic |
| **Subset Sum Count** | Count subsets summing to target | DP variant |
| **Equal Partition** | Split into two equal-sum subsets | LC 416 |
| **Letter Case Permutation** | For each letter: upper or lower | LC 784 |

---

## ⚠️ Common Mistakes

### 1. Not Making a Copy

❌ **Wrong:**
```python
result.append(current)  # Same reference, will be modified!
```

✅ **Correct:**
```python
result.append(current[:])  # Slice copy
result.append(list(current))  # Explicit copy
```

### 2. Forgetting to Sort for Duplicates

❌ **Wrong:**
```python
def subsets_with_dup(nums):
    # nums = [2, 1, 2] - not sorted!
    # Duplicate check fails because 2s aren't adjacent
```

✅ **Correct:**
```python
def subsets_with_dup(nums):
    nums.sort()  # [1, 2, 2] - now duplicates are adjacent
```

### 3. Wrong Duplicate Skip Condition

❌ **Wrong:**
```python
if i > 0 and nums[i] == nums[i-1]:  # Skips too much!
    continue
```

✅ **Correct:**
```python
if i > start and nums[i] == nums[i-1]:  # Only at same level
    continue
```

### 4. Missing Backtrack Step

❌ **Wrong:**
```python
current.append(nums[i])
backtrack(i + 1, current)
# Forgot to pop! Current keeps growing
```

✅ **Correct:**
```python
current.append(nums[i])
backtrack(i + 1, current)
current.pop()  # Always restore state!
```

---

## 📝 Practice Problems

### Easy (Learn the pattern)

| Problem | Focus | LeetCode |
|---------|-------|----------|
| Subsets | Basic pattern | [LC 78](https://leetcode.com/problems/subsets/) |
| Letter Case Permutation | Binary choice variant | [LC 784](https://leetcode.com/problems/letter-case-permutation/) |

### Medium (Apply variations)

| Problem | Focus | LeetCode |
|---------|-------|----------|
| Subsets II | Handle duplicates | [LC 90](https://leetcode.com/problems/subsets-ii/) |
| Partition Equal Subset Sum | Subset sum DP | [LC 416](https://leetcode.com/problems/partition-equal-subset-sum/) |
| Target Sum | Count subsets | [LC 494](https://leetcode.com/problems/target-sum/) |

### Hard (Master edge cases)

| Problem | Focus | LeetCode |
|---------|-------|----------|
| Partition to K Equal Sum Subsets | Multiple subsets | [LC 698](https://leetcode.com/problems/partition-to-k-equal-sum-subsets/) |

<details>
<summary><strong>🧠 Spaced Repetition Schedule</strong></summary>

**Mastery progression:**
1. **Day 1:** Solve Subsets (LC 78) from scratch
2. **Day 2:** Solve again without looking at notes
3. **Day 4:** Solve Subsets II (LC 90) - add duplicate handling
4. **Day 7:** Explain the pattern to someone else
5. **Day 14:** Solve Letter Case Permutation (similar binary choice)
6. **Day 30:** Review all three without hints

**You've mastered it when:**
- [ ] Can write subsets code in < 3 minutes
- [ ] Can add duplicate handling without hints
- [ ] Can explain why `i > start` (not `i > 0`) for duplicates
- [ ] Can switch between backtracking and iterative

</details>

---

## 🎤 Interview Context

<details>
<summary><strong>How to Communicate in Interviews</strong></summary>

**Opening (30 sec):**
> "This is a subsets problem - I need to generate all 2^n possible subsets. I'll use backtracking where at each element I choose to include or exclude it."

**Template explanation (1 min):**
> "I'll iterate through elements, adding each to my current subset, recursing, then removing it to try the 'exclude' path. Every recursive call represents a valid subset, so I add it to results."

**Complexity (30 sec):**
> "Time is O(n * 2^n) because there are 2^n subsets and copying each takes O(n). Space is O(n) for the recursion stack."

**For duplicates:**
> "If there are duplicates, I'll first sort the array, then skip elements that are the same as the previous one at the same recursion level."

**Common follow-ups:**
- "Can you do it iteratively?" → Cascading approach
- "Can you use bit manipulation?" → 0 to 2^n mask
- "What if elements can repeat?" → Don't increment start index

</details>

---

## ⏱️ Time Estimates

| Activity | Time | Notes |
|----------|------|-------|
| Understand pattern | 15-20 min | Binary decision tree |
| Solve Subsets I | 10-15 min | Basic template |
| Solve Subsets II | 15-20 min | Duplicate handling |
| Master pattern | 4-5 problems | Until automatic |
| Interview speed | < 10 min | Target for Subsets I |

---

## 💡 Key Insight

> **Subsets is the simplest backtracking pattern because every node in the decision tree is a valid answer.** You don't need a special base case - just add the current state at every recursive call. The key variations are:
> - **Duplicates:** Sort + skip `if i > start && nums[i] == nums[i-1]`
> - **Fixed size k:** Only add when `len(current) == k` (becomes Combinations)

---

## 🔗 Related

- [Backtracking Template](../2.2-Backtracking-Template.md) - Foundation
- [Permutations Pattern](./02-Permutations-Pattern.md) - Order matters
- [Combinations Pattern](./03-Combinations-Pattern.md) - Fixed size k
- [Bit Manipulation](../../../15-Bit-Manipulation.md) - Alternative approach
