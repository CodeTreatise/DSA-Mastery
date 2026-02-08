# 02 Permutations Pattern

> **Generating All Possible Arrangements**  
> **Interview Frequency:** ⭐⭐⭐⭐⭐ - Classic backtracking problem  
> **Grokking Pattern:** #27 Backtracking (Permutation variant)

---

## Overview

The **Permutations Pattern** generates all possible orderings (arrangements) of a set of elements. Unlike subsets where order doesn't matter, permutations care about the **sequence**.

For n distinct elements, there are **n!** (n factorial) permutations.

```
[1, 2, 3] → 3! = 6 permutations:
[1,2,3], [1,3,2], [2,1,3], [2,3,1], [3,1,2], [3,2,1]
```

---

## 🎯 Pattern Recognition

<details>
<summary><strong>How to Identify Permutation Problems</strong></summary>

**Look for these signals:**
- "All **arrangements**" or "all **orderings**"
- "**Rearrange** elements in all possible ways"
- "All **permutations**" of a set
- Order matters in the output
- Each element used **exactly once**

**Keywords in problem statement:**
- "permutations", "arrangements", "orderings"
- "rearrange", "reorder"
- "every possible sequence"
- "all ways to arrange"

**Key characteristic:**
- Every element must be used
- Each element used exactly once (no repetition within a permutation)
- Order matters: [1,2,3] ≠ [3,2,1]
- Result size = n! (factorial growth)

</details>

---

## ✅ When to Use Permutations Pattern

- **Generate all arrangements** of elements
- **Scheduling problems** (all possible orderings)
- **Anagram generation** (rearranging letters)
- **Sequence enumeration** where order matters
- Problems where you need to **try every ordering**

---

## ❌ When NOT to Use

| Situation | Use Instead | Why |
|-----------|-------------|-----|
| Order doesn't matter | Subsets/Combinations | Fewer results |
| Only need one valid arrangement | Greedy/Constructive | Don't enumerate all |
| Finding optimal arrangement | DP (e.g., TSP) | Permutations is exponential |
| Counting permutations | Math (n!) | No need to generate |
| n > 10-12 | Consider pruning/optimization | n! grows very fast |

---

## 🔗 Concept Map

<details>
<summary><strong>Prerequisites & Next Steps</strong></summary>

**Before this, you should know:**
- [Backtracking Template](../2.2-Backtracking-Template.md) - Core template
- [Subsets Pattern](./01-Subsets-Pattern.md) - Simpler include/exclude

**After mastering this:**
- [Permutations II (duplicates)](#handling-duplicates) - Skip duplicate permutations
- [N-Queens](../2.5-Classic-Problems.md) - Permutation + constraints
- [String Permutations](./04-String-Backtracking.md) - Character arrangements

**Combines with:**
- **Pruning** - Early termination for invalid paths
- **Constraints** - Only valid arrangements (e.g., N-Queens)

</details>

---

## 📐 How It Works

### Core Insight

Unlike subsets where we decide "include or not" for each element, in permutations we ask **"which element goes in this position?"**

At each position, we try every **unused** element.

### Decision Tree

```
Position:  0           1           2           Result
           
           ┌─── 1 ─────┬─── 2 ─────── 3 ─────→ [1,2,3]
           │           └─── 3 ─────── 2 ─────→ [1,3,2]
    start ─┼─── 2 ─────┬─── 1 ─────── 3 ─────→ [2,1,3]
           │           └─── 3 ─────── 1 ─────→ [2,3,1]
           └─── 3 ─────┬─── 1 ─────── 2 ─────→ [3,1,2]
                       └─── 2 ─────── 1 ─────→ [3,2,1]

At position 0: Choose from {1, 2, 3}
At position 1: Choose from remaining 2 elements
At position 2: Only 1 element left
Total: 3 * 2 * 1 = 6 permutations
```

### Two Approaches

**Approach 1: Used Array**
- Track which elements are already used
- Simple and intuitive

**Approach 2: Swap**
- Swap elements into current position
- In-place, slightly more efficient

---

## 💻 Code Implementation

### Python - Approach 1: Used Array

```python
def permutations(nums: list[int]) -> list[list[int]]:
    """
    Generate all permutations using a 'used' tracking array.
    
    Time: O(n * n!), Space: O(n) for used array + recursion
    """
    result = []
    used = [False] * len(nums)
    
    def backtrack(current: list):
        # Base case: permutation complete
        if len(current) == len(nums):
            result.append(current[:])  # Add copy!
            return
        
        # Try each unused element
        for i in range(len(nums)):
            if used[i]:
                continue  # Skip already used elements
            
            # CHOOSE
            used[i] = True
            current.append(nums[i])
            
            # EXPLORE
            backtrack(current)
            
            # UNCHOOSE (backtrack)
            current.pop()
            used[i] = False
    
    backtrack([])
    return result

# Example
print(permutations([1, 2, 3]))
# [[1,2,3], [1,3,2], [2,1,3], [2,3,1], [3,1,2], [3,2,1]]
```

### Python - Approach 2: Swap

```python
def permutations_swap(nums: list[int]) -> list[list[int]]:
    """
    Generate all permutations by swapping elements in place.
    
    Key idea: At position i, swap with each element from i to n-1.
    Time: O(n * n!), Space: O(n) for recursion
    """
    result = []
    
    def backtrack(start: int):
        # Base case: all positions filled
        if start == len(nums):
            result.append(nums[:])  # Add copy of current arrangement
            return
        
        # Try each element in current position
        for i in range(start, len(nums)):
            # CHOOSE: Swap element i into position 'start'
            nums[start], nums[i] = nums[i], nums[start]
            
            # EXPLORE: Fill remaining positions
            backtrack(start + 1)
            
            # UNCHOOSE: Swap back
            nums[start], nums[i] = nums[i], nums[start]
    
    backtrack(0)
    return result

# Example
print(permutations_swap([1, 2, 3]))
# [[1,2,3], [1,3,2], [2,1,3], [2,3,1], [3,1,2], [3,2,1]]
```

### Python - Using itertools (for reference)

```python
from itertools import permutations as perm

# Built-in way (don't use in interviews, but good to know)
print(list(perm([1, 2, 3])))
# [(1, 2, 3), (1, 3, 2), (2, 1, 3), (2, 3, 1), (3, 1, 2), (3, 2, 1)]
```

### JavaScript - Used Array

```javascript
function permutations(nums) {
    const result = [];
    const used = new Array(nums.length).fill(false);
    
    function backtrack(current) {
        if (current.length === nums.length) {
            result.push([...current]);
            return;
        }
        
        for (let i = 0; i < nums.length; i++) {
            if (used[i]) continue;
            
            used[i] = true;
            current.push(nums[i]);
            backtrack(current);
            current.pop();
            used[i] = false;
        }
    }
    
    backtrack([]);
    return result;
}

console.log(permutations([1, 2, 3]));
// [[1,2,3], [1,3,2], [2,1,3], [2,3,1], [3,1,2], [3,2,1]]
```

### JavaScript - Swap Approach

```javascript
function permutationsSwap(nums) {
    const result = [];
    
    function backtrack(start) {
        if (start === nums.length) {
            result.push([...nums]);
            return;
        }
        
        for (let i = start; i < nums.length; i++) {
            // Swap
            [nums[start], nums[i]] = [nums[i], nums[start]];
            backtrack(start + 1);
            // Swap back
            [nums[start], nums[i]] = [nums[i], nums[start]];
        }
    }
    
    backtrack(0);
    return result;
}
```

---

## Handling Duplicates (Permutations II)

When input has duplicates like `[1, 1, 2]`, naive approach generates duplicate permutations.

### The Problem

```
[1, 1, 2] naive: 
[1,1,2], [1,2,1], [1,1,2], [1,2,1], [2,1,1], [2,1,1]
                  ↑               ↑               ↑
                  Duplicates!
```

### The Solution

1. **Sort** the array first
2. **Skip** if same as previous AND previous wasn't used at this level

```python
def permutations_unique(nums: list[int]) -> list[list[int]]:
    """
    Generate unique permutations when nums may have duplicates.
    
    Key: Sort + skip if nums[i] == nums[i-1] and not used[i-1]
    Time: O(n * n!), Space: O(n)
    """
    nums.sort()  # CRITICAL: Sort first!
    result = []
    used = [False] * len(nums)
    
    def backtrack(current: list):
        if len(current) == len(nums):
            result.append(current[:])
            return
        
        for i in range(len(nums)):
            if used[i]:
                continue
            
            # Skip duplicates: if current equals previous AND previous is not used
            # This ensures we only use the first occurrence of duplicates at each level
            if i > 0 and nums[i] == nums[i - 1] and not used[i - 1]:
                continue
            
            used[i] = True
            current.append(nums[i])
            backtrack(current)
            current.pop()
            used[i] = False
    
    backtrack([])
    return result

# Example
print(permutations_unique([1, 1, 2]))
# [[1, 1, 2], [1, 2, 1], [2, 1, 1]] - Only 3 unique permutations
```

### Why `not used[i-1]`?

This is tricky! The condition ensures we only pick the **first** available duplicate at each recursion level.

```
nums = [1a, 1b, 2] (subscripts just for tracking)

Without the check:
- Pick 1a → Pick 1b → Pick 2 → [1a, 1b, 2]
- Pick 1b → Pick 1a → Pick 2 → [1b, 1a, 2]  ← Same permutation!

With `not used[i-1]` check:
- When considering 1b, if 1a is NOT used yet, skip 1b
- This forces us to use 1a before 1b
- Prevents [1b, 1a, 2] from ever being generated
```

### JavaScript - With Duplicates

```javascript
function permuteUnique(nums) {
    nums.sort((a, b) => a - b);
    const result = [];
    const used = new Array(nums.length).fill(false);
    
    function backtrack(current) {
        if (current.length === nums.length) {
            result.push([...current]);
            return;
        }
        
        for (let i = 0; i < nums.length; i++) {
            if (used[i]) continue;
            
            // Skip duplicates
            if (i > 0 && nums[i] === nums[i - 1] && !used[i - 1]) continue;
            
            used[i] = true;
            current.push(nums[i]);
            backtrack(current);
            current.pop();
            used[i] = false;
        }
    }
    
    backtrack([]);
    return result;
}
```

---

## ⚡ Complexity Analysis

| Variant | Time | Space | Notes |
|---------|------|-------|-------|
| Basic Permutations |" O(n * n!) "| O(n) |" n! permutations, O(n) to copy each "|
| With Duplicates |" O(n * n!) "| O(n) | Worst case same, better in practice |
| Swap Approach |" O(n * n!) "| O(n) | Slightly less overhead |

**Why O(n * n!)?**
- There are n! permutations
- Each permutation has n elements
- Copying each permutation is O(n)
- Total: O(n * n!)

**Factorial growth:**
```
n=5:  5! = 120
n=8:  8! = 40,320
n=10: 10! = 3,628,800
n=12: 12! = 479,001,600
```

⚠️ **n > 10-12 becomes impractical!**

---

## 🔄 Variations

| Variation | Key Difference | Problem |
|-----------|----------------|---------|
| **Permutations I** | All unique elements | LC 46 |
| **Permutations II** | Handle duplicates | LC 47 |
| **Next Permutation** | Find lexicographically next | LC 31 |
| **Permutation Sequence** | Find k-th permutation | LC 60 |
| **String Permutations** | Characters instead of numbers | Common |
| **Partial Permutations** | Only first k positions | P(n, k) |

---

## ⚠️ Common Mistakes

### 1. Using Wrong Loop Range

❌ **Wrong (for permutations):**
```python
for i in range(start, len(nums)):  # This is for combinations!
```

✅ **Correct:**
```python
for i in range(len(nums)):  # Always check all elements
    if used[i]: continue    # Skip used ones
```

### 2. Forgetting to Track Used Elements

❌ **Wrong:**
```python
for i in range(len(nums)):
    current.append(nums[i])  # May add same element twice!
```

✅ **Correct:**
```python
for i in range(len(nums)):
    if used[i]: continue  # Check before using
    used[i] = True
    current.append(nums[i])
```

### 3. Wrong Duplicate Skip Condition

❌ **Wrong:**
```python
if i > 0 and nums[i] == nums[i-1]:  # Too aggressive!
    continue
```

✅ **Correct:**
```python
if i > 0 and nums[i] == nums[i-1] and not used[i-1]:
    continue
```

### 4. Not Restoring State After Swap

❌ **Wrong:**
```python
nums[start], nums[i] = nums[i], nums[start]
backtrack(start + 1)
# Forgot to swap back!
```

✅ **Correct:**
```python
nums[start], nums[i] = nums[i], nums[start]
backtrack(start + 1)
nums[start], nums[i] = nums[i], nums[start]  # Restore!
```

---

## 📝 Practice Problems

### Easy-Medium (Learn the pattern)

| Problem | Focus | LeetCode |
|---------|-------|----------|
| Permutations | Basic pattern | [LC 46](https://leetcode.com/problems/permutations/) |
| Permutations II | Handle duplicates | [LC 47](https://leetcode.com/problems/permutations-ii/) |

### Medium (Apply variations)

| Problem | Focus | LeetCode |
|---------|-------|----------|
| Next Permutation | Lexicographic order | [LC 31](https://leetcode.com/problems/next-permutation/) |
| Permutation Sequence | K-th permutation | [LC 60](https://leetcode.com/problems/permutation-sequence/) |
| Letter Tile Possibilities | String permutations | [LC 1079](https://leetcode.com/problems/letter-tile-possibilities/) |

### Hard (Master edge cases)

| Problem | Focus | LeetCode |
|---------|-------|----------|
| N-Queens | Permutation + constraints | [LC 51](https://leetcode.com/problems/n-queens/) |
| Beautiful Arrangement | Count valid permutations | [LC 526](https://leetcode.com/problems/beautiful-arrangement/) |

<details>
<summary><strong>🧠 Spaced Repetition Schedule</strong></summary>

**Mastery progression:**
1. **Day 1:** Solve Permutations I (LC 46)
2. **Day 2:** Redo without looking at solution
3. **Day 4:** Solve Permutations II (LC 47)
4. **Day 7:** Explain both approaches (used array vs swap)
5. **Day 14:** Solve Next Permutation (different technique)
6. **Day 30:** Review all without hints

**You've mastered it when:**
- [ ] Can write used-array version in < 5 minutes
- [ ] Can handle duplicates without hints
- [ ] Can explain why `not used[i-1]` for duplicates
- [ ] Know when to use permutations vs combinations

</details>

---

## 🎤 Interview Context

<details>
<summary><strong>How to Communicate in Interviews</strong></summary>

**Opening (30 sec):**
> "This is a permutations problem - I need all n! possible arrangements. I'll use backtracking where I try each unused element at each position."

**Approach explanation (1 min):**
> "I'll track which elements are used with a boolean array. At each recursive call, I try adding each unused element, recurse, then remove it and mark it unused again."

**For duplicates:**
> "Since there are duplicates, I'll sort first and skip an element if it equals the previous one AND the previous one isn't currently used. This ensures I only use the first occurrence of each duplicate at each level."

**Complexity (30 sec):**
> "Time is O(n * n!) because there are n! permutations and copying each takes O(n). Space is O(n) for the used array and recursion stack."

**Company Focus:**

| Company | Permutation Focus | Notes |
|---------|------------------|-------|
| Google | Understand deeply | May ask for optimizations |
| Amazon | Classic problems | LC 46, 47 |
| Meta | Bug-free code | Careful with duplicates |
| Microsoft | Clear explanation | Step-by-step walkthrough |

</details>

---

## ⏱️ Time Estimates

| Activity | Time | Notes |
|----------|------|-------|
| Understand pattern | 20-25 min | Decision tree |
| Solve Permutations I | 15-20 min | Basic template |
| Solve Permutations II | 20-25 min | Duplicate handling is tricky |
| Master pattern | 4-6 problems | Until automatic |
| Interview speed | < 12 min | Target for Permutations I |

---

## 💡 Key Insight

> **Permutations differ from Subsets in one key way: you must use EVERY element exactly once.** The template uses a `used[]` array to track which elements are in the current permutation. For duplicates, the trick is to sort and only use the first occurrence of each duplicate at each recursion level (`not used[i-1]`).

---

## 🔗 Related

- [Backtracking Template](../2.2-Backtracking-Template.md) - Foundation
- [Subsets Pattern](./01-Subsets-Pattern.md) - Include/exclude (simpler)
- [Combinations Pattern](./03-Combinations-Pattern.md) - Selection of k elements
- [N-Queens](../2.5-Classic-Problems.md) - Permutation with constraints
