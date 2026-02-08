# 03 Combinations Pattern

> **Selecting k Elements from n - Order Doesn't Matter**  
> **Interview Frequency:** ⭐⭐⭐⭐⭐ - Combination Sum variants are very common  
> **Grokking Pattern:** #27 Backtracking (Combination variant)

---

## Overview

The **Combinations Pattern** selects **k elements** from a set of n elements where **order doesn't matter**. It's a hybrid between Subsets (which generates all sizes) and Permutations (where order matters).

For n elements choosing k, there are **C(n,k) = n! / (k! * (n-k)!)** combinations.

```
Choose 2 from [1, 2, 3, 4]:
C(4,2) = 6 combinations: [1,2], [1,3], [1,4], [2,3], [2,4], [3,4]
```

---

## 🎯 Pattern Recognition

<details>
<summary><strong>How to Identify Combination Problems</strong></summary>

**Look for these signals:**
- "Choose **k elements**" from n
- "**Combinations** of size k"
- "All ways to select" (not arrange)
- "**Sum to target**" (Combination Sum variants)
- Order doesn't matter in output

**Keywords in problem statement:**
- "combinations", "select k", "choose k"
- "sum equals target", "sum to k"
- "k numbers that add up to"
- "all possible selections"

**Key characteristics:**
- Fixed output size k (or constrained by sum)
- No element reuse within same combination (unless specified)
- [1,2] and [2,1] are the SAME combination (unlike permutations)
- Use **start index** to avoid duplicates

</details>

---

## ✅ When to Use Combinations Pattern

- **Select exactly k elements** from n
- **Combination Sum** - find combinations summing to target
- **k-sized subsets** of a larger set
- Feature/item selection with constraints
- Any "**all ways to choose**" problem

---

## ❌ When NOT to Use

| Situation | Use Instead | Why |
|-----------|-------------|-----|
| Order matters | Permutations | Combinations ignore order |
| All sizes needed | Subsets | Subsets generates all sizes |
| Only count needed | Math C(n,k) or DP | Don't enumerate |
| Finding ONE combination | Greedy/DP | Don't need all |
| n choose k, k > n/2 | Optimize | C(n,k) = C(n, n-k) |

---

## 🔗 Concept Map

<details>
<summary><strong>Prerequisites & Next Steps</strong></summary>

**Before this, you should know:**
- [Backtracking Template](../2.2-Backtracking-Template.md) - Core template
- [Subsets Pattern](./01-Subsets-Pattern.md) - Similar but all sizes

**After mastering this:**
- [Combination Sum I](https://leetcode.com/problems/combination-sum/) - Unlimited reuse
- [Combination Sum II](https://leetcode.com/problems/combination-sum-ii/) - No reuse + duplicates
- [Combination Sum III](https://leetcode.com/problems/combination-sum-iii/) - Fixed k

**Combines with:**
- **Pruning** - Stop early when sum exceeds target
- **Sorting** - Required for handling duplicates
- **Memoization** - For counting variants

</details>

---

## 📐 How It Works

### Core Insight

Combinations are like subsets, but we only record when we reach size k.

The key is using a **start index** to avoid generating [1,2] and [2,1] separately.

### Decision Tree for C(4,2) - Choose 2 from [1,2,3,4]

```
                          []
              ┌───────────┼───────────┬───────────┐
           add 1        add 2       add 3       add 4
             [1]          [2]         [3]         [4]
         ┌───┼───┐      ┌──┼──┐       │           │
       +2  +3  +4     +3   +4        +4        (none)
      [1,2][1,3][1,4][2,3][2,4]     [3,4]

Note: From [1], we only try adding 2,3,4 (not 1 again)
      From [2], we only try adding 3,4 (not 1,2)
      This prevents duplicates like [2,1]
```

### Combination Sum Decision Tree

```
Target = 7, Candidates = [2, 3, 6, 7]

                    []  remaining=7
            ┌───────┼───────┬───────┐
          +2       +3      +6      +7
         [2]      [3]     [6]     [7] ✓
        r=5       r=4     r=1    r=0
     ┌──┼──┐    ┌──┼     │
   +2 +3 +6   +3 +6    (none)
   [2,2][2,3][2,6?]
   r=3  r=2  r<0
   ┌─┼    │
  +2 +3  [2,3,2?]
[2,2,2?][2,3]
  r=1   r=0 ✓
   │
  +3?
[2,2,3] ✓
  r=0

Results: [7], [2,2,3], [2,3]... wait, [2,3] doesn't sum to 7!
Actually: [7], [2,2,3] are the valid combinations
```

---

## 💻 Code Implementation

### Python - Basic Combinations (C(n,k))

```python
def combine(n: int, k: int) -> list[list[int]]:
    """
    Generate all combinations of k numbers from 1 to n.
    
    Time: O(k * C(n,k)), Space: O(k) for recursion
    """
    result = []
    
    def backtrack(start: int, current: list):
        # Base case: combination complete
        if len(current) == k:
            result.append(current[:])
            return
        
        # Pruning: not enough elements left
        # Need (k - len(current)) more elements
        # Available: n - start + 1 elements
        if n - start + 1 < k - len(current):
            return
        
        # Try each number from start to n
        for i in range(start, n + 1):
            current.append(i)
            backtrack(i + 1, current)  # i+1 to avoid reusing
            current.pop()
    
    backtrack(1, [])
    return result

# Example: C(4, 2)
print(combine(4, 2))
# [[1,2], [1,3], [1,4], [2,3], [2,4], [3,4]]
```

### Python - Combination Sum (Unlimited Reuse)

```python
def combination_sum(candidates: list[int], target: int) -> list[list[int]]:
    """
    Find all combinations that sum to target.
    Each number can be used unlimited times.
    
    Time: O(n^(target/min)), Space: O(target/min) for recursion
    """
    result = []
    
    def backtrack(start: int, current: list, remaining: int):
        # Base case: found valid combination
        if remaining == 0:
            result.append(current[:])
            return
        
        # Pruning: exceeded target
        if remaining < 0:
            return
        
        for i in range(start, len(candidates)):
            current.append(candidates[i])
            # Pass i (not i+1) to allow reusing same element
            backtrack(i, current, remaining - candidates[i])
            current.pop()
    
    backtrack(0, [], target)
    return result

# Example
print(combination_sum([2, 3, 6, 7], 7))
# [[2, 2, 3], [7]]
```

### Python - Combination Sum II (No Reuse + Duplicates)

```python
def combination_sum_2(candidates: list[int], target: int) -> list[list[int]]:
    """
    Find combinations summing to target.
    Each number used at most once. Handle duplicate candidates.
    
    Time: O(2^n), Space: O(n)
    """
    candidates.sort()  # CRITICAL: Sort for duplicate handling!
    result = []
    
    def backtrack(start: int, current: list, remaining: int):
        if remaining == 0:
            result.append(current[:])
            return
        
        if remaining < 0:
            return
        
        for i in range(start, len(candidates)):
            # Skip duplicates at same level
            if i > start and candidates[i] == candidates[i - 1]:
                continue
            
            # Pruning: if current exceeds, all future will too (sorted!)
            if candidates[i] > remaining:
                break
            
            current.append(candidates[i])
            backtrack(i + 1, current, remaining - candidates[i])  # i+1, no reuse
            current.pop()
    
    backtrack(0, [], target)
    return result

# Example
print(combination_sum_2([10, 1, 2, 7, 6, 1, 5], 8))
# [[1, 1, 6], [1, 2, 5], [1, 7], [2, 6]]
```

### Python - Combination Sum III (k numbers, sum to n)

```python
def combination_sum_3(k: int, n: int) -> list[list[int]]:
    """
    Find k numbers (1-9) that sum to n. Each used at most once.
    
    Time: O(C(9,k)), Space: O(k)
    """
    result = []
    
    def backtrack(start: int, current: list, remaining: int):
        # Base case: right size and right sum
        if len(current) == k:
            if remaining == 0:
                result.append(current[:])
            return
        
        # Pruning: too many elements or negative remaining
        if len(current) > k or remaining < 0:
            return
        
        for i in range(start, 10):  # Numbers 1-9
            # Pruning: number too big
            if i > remaining:
                break
            
            current.append(i)
            backtrack(i + 1, current, remaining - i)
            current.pop()
    
    backtrack(1, [], n)
    return result

# Example: k=3, n=7
print(combination_sum_3(3, 7))
# [[1, 2, 4]]
```

### JavaScript - Basic Combinations

```javascript
function combine(n, k) {
    const result = [];
    
    function backtrack(start, current) {
        if (current.length === k) {
            result.push([...current]);
            return;
        }
        
        // Pruning: need k-current.length more, have n-start+1 available
        if (n - start + 1 < k - current.length) return;
        
        for (let i = start; i <= n; i++) {
            current.push(i);
            backtrack(i + 1, current);
            current.pop();
        }
    }
    
    backtrack(1, []);
    return result;
}
```

### JavaScript - Combination Sum

```javascript
function combinationSum(candidates, target) {
    const result = [];
    
    function backtrack(start, current, remaining) {
        if (remaining === 0) {
            result.push([...current]);
            return;
        }
        if (remaining < 0) return;
        
        for (let i = start; i < candidates.length; i++) {
            current.push(candidates[i]);
            backtrack(i, current, remaining - candidates[i]); // i for reuse
            current.pop();
        }
    }
    
    backtrack(0, [], target);
    return result;
}
```

### JavaScript - Combination Sum II

```javascript
function combinationSum2(candidates, target) {
    candidates.sort((a, b) => a - b);
    const result = [];
    
    function backtrack(start, current, remaining) {
        if (remaining === 0) {
            result.push([...current]);
            return;
        }
        
        for (let i = start; i < candidates.length; i++) {
            // Skip duplicates
            if (i > start && candidates[i] === candidates[i - 1]) continue;
            // Pruning
            if (candidates[i] > remaining) break;
            
            current.push(candidates[i]);
            backtrack(i + 1, current, remaining - candidates[i]);
            current.pop();
        }
    }
    
    backtrack(0, [], target);
    return result;
}
```

---

## ⚡ Complexity Analysis

| Problem | Time | Space | Notes |
|---------|------|-------|-------|
| C(n, k) |" O(k * C(n,k)) "| O(k) | C(n,k) combinations |
| Combination Sum I |" O(n^(t/m)) "| O(t/m) | t=target, m=min candidate |
| Combination Sum II |" O(2^n) "| O(n) | Similar to subsets |
| Combination Sum III |" O(C(9,k)) "| O(k) | At most C(9,4) = 126 |

**Why these complexities?**

- **C(n,k):** There are C(n,k) = n!/(k!(n-k)!) combinations, each takes O(k) to copy
- **Combination Sum I:** Can reuse elements, so branching factor is n at each level, depth up to target/min
- **Combination Sum II:** Without reuse, like subsets = 2^n
- **Combination Sum III:** Fixed range 1-9, small search space

---

## 🔄 Variations

| Variation | Key Difference | Problem |
|-----------|----------------|---------|
| **C(n, k)** | Basic, no sum constraint | LC 77 |
| **Combination Sum I** | Unlimited reuse, target sum | LC 39 |
| **Combination Sum II** | No reuse + duplicates | LC 40 |
| **Combination Sum III** | k numbers from 1-9 | LC 216 |
| **Combination Sum IV** | Count ways (order matters, DP) | LC 377 |
| **k-Sum** | k numbers summing to target in array | Extension |

### Quick Reference: Which Variation?

| Scenario | start index | Reuse? | Duplicates? |
|----------|-------------|--------|-------------|
| Combination Sum I | `i` | Yes | N/A |
| Combination Sum II | `i + 1` | No | Sort + skip |
| Combination Sum III | `i + 1` | No | No (1-9) |
| Basic C(n,k) | `i + 1` | No | No |

---

## ⚠️ Common Mistakes

### 1. Wrong Index for Reuse

❌ **Wrong (for no-reuse):**
```python
backtrack(i, ...)  # Allows reusing same element!
```

✅ **Correct:**
```python
backtrack(i + 1, ...)  # Move to next element
```

### 2. Missing Sort for Duplicates

❌ **Wrong:**
```python
def combination_sum_2(candidates, target):
    # candidates not sorted!
    # Skip condition won't work
```

✅ **Correct:**
```python
def combination_sum_2(candidates, target):
    candidates.sort()  # Sort first!
```

### 3. Not Pruning Early

❌ **Wrong:**
```python
for i in range(start, len(candidates)):
    current.append(candidates[i])
    backtrack(i + 1, current, remaining - candidates[i])
    # Continues even when remaining < 0
```

✅ **Correct:**
```python
for i in range(start, len(candidates)):
    if candidates[i] > remaining:
        break  # Sorted, so all future are too big
    current.append(candidates[i])
    backtrack(i + 1, current, remaining - candidates[i])
```

### 4. Wrong Base Case

❌ **Wrong:**
```python
if remaining == 0:
    result.append(current[:])
    # Don't return, continues looping!
```

✅ **Correct:**
```python
if remaining == 0:
    result.append(current[:])
    return  # Stop exploring!
```

---

## 📝 Practice Problems

### Medium (Learn the pattern)

| Problem | Focus | LeetCode |
|---------|-------|----------|
| Combinations | Basic C(n,k) | [LC 77](https://leetcode.com/problems/combinations/) |
| Combination Sum | Unlimited reuse | [LC 39](https://leetcode.com/problems/combination-sum/) |
| Combination Sum II | No reuse + duplicates | [LC 40](https://leetcode.com/problems/combination-sum-ii/) |
| Combination Sum III | k numbers, 1-9 | [LC 216](https://leetcode.com/problems/combination-sum-iii/) |

### Medium-Hard (Apply variations)

| Problem | Focus | LeetCode |
|---------|-------|----------|
| Combination Sum IV | Count ways (DP) | [LC 377](https://leetcode.com/problems/combination-sum-iv/) |
| 4Sum | k-sum variant | [LC 18](https://leetcode.com/problems/4sum/) |
| Factor Combinations | Factorization | [LC 254](https://leetcode.com/problems/factor-combinations/) |

<details>
<summary><strong>🧠 Spaced Repetition Schedule</strong></summary>

**Mastery progression:**
1. **Day 1:** Solve LC 77 (basic combinations)
2. **Day 2:** Solve LC 39 (combination sum I)
3. **Day 4:** Solve LC 40 (combination sum II - duplicates)
4. **Day 7:** Compare all three approaches
5. **Day 14:** Solve LC 216 (combination sum III)
6. **Day 30:** Review without hints

**You've mastered it when:**
- [ ] Know when to use `i` vs `i+1` for reuse
- [ ] Can handle duplicates without thinking
- [ ] Implement pruning naturally
- [ ] Solve any Combination Sum variant in < 15 min

</details>

---

## 🎤 Interview Context

<details>
<summary><strong>How to Communicate in Interviews</strong></summary>

**Opening (30 sec):**
> "This is a combination sum problem. I need to find all combinations that sum to the target. I'll use backtracking with a start index to avoid duplicates."

**Key decisions to explain:**
> "For each candidate, I either include it and recurse, or skip it. The start index ensures I don't revisit earlier elements, preventing duplicate combinations like [2,3] and [3,2]."

**For each variant:**

| Variant | Key Point to Mention |
|---------|---------------------|
| Sum I | "I pass `i` to allow reusing the same element" |
| Sum II | "I sort first and skip if same as previous at same level" |
| Sum III | "Fixed size k, so I check length before adding to result" |

**Pruning explanation:**
> "I'll add pruning: since array is sorted, if current candidate exceeds remaining, I can break early."

</details>

---

## ⏱️ Time Estimates

| Activity | Time | Notes |
|----------|------|-------|
| Understand pattern | 20 min | Compare with subsets |
| Solve Combinations | 10-15 min | Basic template |
| Solve Combination Sum I | 15-20 min | Add remaining tracking |
| Solve Combination Sum II | 20-25 min | Duplicate handling |
| Master pattern | 4-5 problems | All variants |

---

## 💡 Key Insight

> **Combinations are subsets with a size constraint.** The key template differences are:
> 1. **Reuse allowed?** `i` (yes) vs `i+1` (no) in recursive call
> 2. **Fixed size?** Only add to result when `len(current) == k`
> 3. **Sum constraint?** Track `remaining` and prune when `< 0`
> 4. **Duplicates?** Sort + skip when `i > start && nums[i] == nums[i-1]`

---

## 🔗 Related

- [Backtracking Template](../2.2-Backtracking-Template.md) - Foundation
- [Subsets Pattern](./01-Subsets-Pattern.md) - All sizes (no k constraint)
- [Permutations Pattern](./02-Permutations-Pattern.md) - Order matters
- [Two Sum](../../09-Hashing.md) - Related sum problem (different approach)
