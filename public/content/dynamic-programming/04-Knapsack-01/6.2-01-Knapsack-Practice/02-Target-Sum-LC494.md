# Target Sum (LC 494)

> **Counting variant of 0/1 Knapsack with a mathematical transformation.** This problem teaches you to think algebraically about DP—transforming the problem before solving it.

---

## 📋 Problem Statement

**LeetCode:** [494. Target Sum](https://leetcode.com/problems/target-sum/)

Given an array of integers `nums` and a target integer `target`, return the number of different expressions you can build by adding `+` or `-` before each integer to achieve the target.

**Example:**
- nums = [1, 1, 1, 1, 1], target = 3
- Solutions: -1+1+1+1+1, +1-1+1+1+1, +1+1-1+1+1, +1+1+1-1+1, +1+1+1+1-1
- Answer: 5

**Constraints:**
- 1 ≤ nums.length ≤ 20
- 0 ≤ nums[i] ≤ 1000
- 0 ≤ sum(nums) ≤ 1000
- -1000 ≤ target ≤ 1000

---

## 🎯 Pattern Recognition

**This is 0/1 Knapsack because:**
- Each element used exactly once
- Binary choice: + or - (which is equivalent to "include in P" or "include in N")
- Count ways to achieve a target

**The key transformation:**
```
Let P = sum of elements with +
Let N = sum of elements with -

We want: P - N = target
We know: P + N = total (sum of all elements)

Adding these:
2P = target + total
P = (target + total) / 2

So: Count subsets that sum to P!
```

---

## 📐 The Transformation

```
Original: Assign + or - to each element to get target
Transformed: Count subsets summing to (target + total) / 2

Example: nums = [1, 1, 1, 1, 1], target = 3
total = 5
P = (3 + 5) / 2 = 4

Question becomes: How many subsets sum to 4?
Answer: Choose any 4 of the five 1s = C(5,4) = 5 ✓
```

---

## 💻 Solutions

### Solution 1: Transformed to Subset Count (Optimal)

```python
def find_target_sum_ways(nums: list[int], target: int) -> int:
    """
    Transform to: count subsets summing to (target + total) / 2
    Time: O(n * P), Space: O(P)
    """
    total = sum(nums)
    
    # Check if target is achievable
    # 1. |target| > total means impossible
    # 2. (total + target) must be even for P to be integer
    if abs(target) > total or (total + target) % 2 != 0:
        return 0
    
    P = (total + target) // 2
    
    # Count subsets that sum to P
    dp = [0] * (P + 1)
    dp[0] = 1  # One way to get sum 0: empty subset
    
    for num in nums:
        # Backward for 0/1 (each element used once)
        for s in range(P, num - 1, -1):
            dp[s] += dp[s - num]
    
    return dp[P]
```

```javascript
function findTargetSumWays(nums, target) {
    const total = nums.reduce((a, b) => a + b, 0);
    
    if (Math.abs(target) > total || (total + target) % 2 !== 0) {
        return 0;
    }
    
    const P = (total + target) / 2;
    const dp = new Array(P + 1).fill(0);
    dp[0] = 1;
    
    for (const num of nums) {
        for (let s = P; s >= num; s--) {
            dp[s] += dp[s - num];
        }
    }
    
    return dp[P];
}
```

### Solution 2: Direct DP with Offset (Alternative)

```python
def find_target_sum_ways_direct(nums: list[int], target: int) -> int:
    """
    Direct approach using offset for negative sums.
    Time: O(n * total), Space: O(total)
    """
    total = sum(nums)
    
    if abs(target) > total:
        return 0
    
    # Use offset to handle negative sums
    offset = total
    dp = [0] * (2 * total + 1)
    dp[offset] = 1  # Sum 0 at index offset
    
    for num in nums:
        next_dp = [0] * (2 * total + 1)
        for s in range(2 * total + 1):
            if dp[s] > 0:
                # Add num
                if s + num <= 2 * total:
                    next_dp[s + num] += dp[s]
                # Subtract num
                if s - num >= 0:
                    next_dp[s - num] += dp[s]
        dp = next_dp
    
    return dp[target + offset]
```

### Solution 3: Memoization (Top-Down)

```python
def find_target_sum_ways_memo(nums: list[int], target: int) -> int:
    """
    Recursive with memoization.
    """
    from functools import lru_cache
    
    @lru_cache(maxsize=None)
    def helper(i, current_sum):
        if i == len(nums):
            return 1 if current_sum == target else 0
        
        # Try + and -
        return (helper(i + 1, current_sum + nums[i]) +
                helper(i + 1, current_sum - nums[i]))
    
    return helper(0, 0)
```

---

## ⚠️ Edge Case: Zeros in Array

```python
def find_target_sum_ways_with_zeros(nums: list[int], target: int) -> int:
    """
    Handle zeros specially: each 0 can be +0 or -0 (both give 0).
    This doubles the count for each zero.
    """
    zeros = nums.count(0)
    non_zeros = [n for n in nums if n != 0]
    
    total = sum(non_zeros)
    
    if abs(target) > total or (total + target) % 2 != 0:
        return 0 if zeros == 0 else 0
    
    P = (total + target) // 2
    
    # Count subsets of non-zeros summing to P
    dp = [0] * (P + 1)
    dp[0] = 1
    
    for num in non_zeros:
        for s in range(P, num - 1, -1):
            dp[s] += dp[s - num]
    
    # Each zero doubles the count
    return dp[P] * (2 ** zeros)
```

---

## ⚡ Complexity Analysis

| Approach | Time | Space |
|----------|------|-------|
| Transformed (subset count) | O(n × P) | O(P) |
| Direct with offset | O(n × sum) | O(sum) |
| Memoization | O(n × sum) | O(n × sum) |
| Brute Force | O(2ⁿ) | O(n) |

Where P = (total + target) / 2

---

## ⚠️ Common Mistakes

### 1. Forgetting Impossible Cases

**❌ Wrong:**
```python
P = (total + target) // 2
# What if target > total? P could be huge!
# What if (total + target) is odd? P isn't an integer!
```

**✅ Correct:**
```python
if abs(target) > total or (total + target) % 2 != 0:
    return 0
P = (total + target) // 2
```

### 2. Negative Target Handling

**❌ Wrong:**
```python
# target = -3, total = 5
# P = (-3 + 5) / 2 = 1
# This is actually correct! No special handling needed for negative target.
```

### 3. Zeros Not Handled

**❌ Partial:**
```python
# If nums = [0, 0, 1], target = 1
# Subsets summing to 1: {1}
# But +0+0+1, +0-0+1, -0+0+1, -0-0+1 are all valid
# Answer should be 4, not 1
```

---

## 📊 Trace Through Example

```
nums = [1, 1, 1, 1, 1], target = 3

total = 5
P = (3 + 5) / 2 = 4

We need to count subsets summing to 4.

Initial dp: [1, 0, 0, 0, 0]  (P+1 = 5 elements)

num = 1:
  s=4: dp[4] += dp[3] → 0
  s=3: dp[3] += dp[2] → 0
  s=2: dp[2] += dp[1] → 0
  s=1: dp[1] += dp[0] → 1
  dp: [1, 1, 0, 0, 0]

num = 1:
  s=4: dp[4] += dp[3] → 0
  s=3: dp[3] += dp[2] → 0
  s=2: dp[2] += dp[1] → 1
  s=1: dp[1] += dp[0] → 2
  dp: [1, 2, 1, 0, 0]

num = 1:
  s=4: dp[4] += dp[3] → 0
  s=3: dp[3] += dp[2] → 1
  s=2: dp[2] += dp[1] → 3
  s=1: dp[1] += dp[0] → 3
  dp: [1, 3, 3, 1, 0]

num = 1:
  s=4: dp[4] += dp[3] → 1
  s=3: dp[3] += dp[2] → 4
  s=2: dp[2] += dp[1] → 6
  s=1: dp[1] += dp[0] → 4
  dp: [1, 4, 6, 4, 1]

num = 1:
  s=4: dp[4] += dp[3] → 5
  s=3: dp[3] += dp[2] → 10
  s=2: dp[2] += dp[1] → 10
  s=1: dp[1] += dp[0] → 5
  dp: [1, 5, 10, 10, 5]

Answer: dp[4] = 5 ✓

(This is C(5,4) = 5, choosing 4 ones to be positive)
```

---

## 🔄 Related Problems

| Problem | Relationship |
|---------|--------------|
| Partition Equal Subset Sum | Special case: target = 0 |
| Subset Sum | P = target directly |
| Last Stone Weight II | P = (total - target) / 2 |

---

## 📝 Related Problems

- [ ] [Partition Equal Subset Sum](https://leetcode.com/problems/partition-equal-subset-sum/) - Simpler version
- [ ] [Last Stone Weight II](https://leetcode.com/problems/last-stone-weight-ii/) - Min difference
- [ ] [Number of Ways to Earn Points](https://leetcode.com/problems/number-of-ways-to-earn-points/) - Similar counting

---

## 🎤 Interview Tips

**Time to solve:** 20-25 minutes

**Communication template:**
> "Let me think about this algebraically. If P is the sum of positive elements and N is the sum of negatives, then P - N = target and P + N = total. Solving these: P = (target + total) / 2. So I need to count subsets summing to P. This is 0/1 Knapsack counting."

**Key points to mention:**
1. Mathematical transformation (derive P = (target + total) / 2)
2. Edge cases: |target| > total, odd (target + total)
3. Standard 0/1 subset counting DP
4. Handle zeros if present

**Company frequency:**
| Company | Frequency |
|---------|-----------|
| Meta | ⭐⭐⭐⭐ |
| Google | ⭐⭐⭐ |
| Amazon | ⭐⭐⭐ |

---

> **💡 Key Insight:** The algebraic transformation P = (target + total) / 2 is the key. Once you see that assigning + or - is equivalent to "which subset gets P," the problem becomes standard subset counting.

> **🔗 Related:** [0/1 Knapsack Pattern](../6.1-Knapsack-01-Pattern.md) | [Partition Equal Subset](./01-Partition-Equal-LC416.md)
