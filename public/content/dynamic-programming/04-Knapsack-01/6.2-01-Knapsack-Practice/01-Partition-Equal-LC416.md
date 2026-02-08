# Partition Equal Subset Sum (LC 416)

> **The classic 0/1 Knapsack reduction.** This problem looks like a partition problem but reduces beautifully to "can we find a subset summing to total/2?" Master this reduction thinking.

---

## 📋 Problem Statement

**LeetCode:** [416. Partition Equal Subset Sum](https://leetcode.com/problems/partition-equal-subset-sum/)

Given an integer array `nums`, return `true` if you can partition the array into two subsets such that the sum of elements in both subsets is equal.

**Constraints:**
- 1 ≤ nums.length ≤ 200
- 1 ≤ nums[i] ≤ 100

---

## 🎯 Pattern Recognition

**This is 0/1 Knapsack because:**
- Selecting elements for a subset (each used at most once)
- Target is half the total sum
- Need to check if we can exactly reach the target

**The key insight:**
```
If we can partition into equal halves:
  - Subset A + Subset B = total
  - Subset A = Subset B = total / 2

So: Can we find ANY subset that sums to total/2?
If yes → remaining elements also sum to total/2 → can partition!
```

---

## 📐 Approach Analysis

### Reduction to Subset Sum

```
Original: Can we partition into two equal-sum subsets?
Reduced:  Can we find a subset summing to total/2?

This is 0/1 Knapsack where:
  - Items = nums
  - Capacity = total/2
  - Value = boolean (reachable or not)
```

**Quick checks:**
1. If total is odd → impossible (can't split odd into two equal halves)
2. If any element > total/2 → impossible (can't fit in one half)

---

## 💻 Solutions

### Solution 1: 1D DP (Optimal)

```python
def can_partition(nums: list[int]) -> bool:
    """
    0/1 Knapsack: can we select elements summing to total/2?
    Time: O(n * sum), Space: O(sum)
    """
    total = sum(nums)
    
    # Quick check: odd sum can't be partitioned equally
    if total % 2 != 0:
        return False
    
    target = total // 2
    
    # dp[s] = can we achieve sum s?
    dp = [False] * (target + 1)
    dp[0] = True  # Sum of 0 is achievable (empty subset)
    
    for num in nums:
        # Iterate backwards (0/1: each element used once)
        for s in range(target, num - 1, -1):
            dp[s] = dp[s] or dp[s - num]
        
        # Early exit if target reached
        if dp[target]:
            return True
    
    return dp[target]
```

```javascript
function canPartition(nums) {
    const total = nums.reduce((a, b) => a + b, 0);
    
    if (total % 2 !== 0) return false;
    
    const target = total / 2;
    const dp = new Array(target + 1).fill(false);
    dp[0] = true;
    
    for (const num of nums) {
        for (let s = target; s >= num; s--) {
            dp[s] = dp[s] || dp[s - num];
        }
        if (dp[target]) return true;
    }
    
    return dp[target];
}
```

### Solution 2: 2D DP (For Understanding)

```python
def can_partition_2d(nums: list[int]) -> bool:
    """
    2D version for clearer visualization.
    """
    total = sum(nums)
    if total % 2 != 0:
        return False
    
    target = total // 2
    n = len(nums)
    
    # dp[i][s] = can we achieve sum s using first i elements?
    dp = [[False] * (target + 1) for _ in range(n + 1)]
    
    # Base case: sum 0 is always achievable
    for i in range(n + 1):
        dp[i][0] = True
    
    for i in range(1, n + 1):
        for s in range(target + 1):
            # Don't take nums[i-1]
            dp[i][s] = dp[i-1][s]
            
            # Take nums[i-1] if possible
            if nums[i-1] <= s:
                dp[i][s] = dp[i][s] or dp[i-1][s - nums[i-1]]
    
    return dp[n][target]
```

### Solution 3: Using Set (Alternative)

```python
def can_partition_set(nums: list[int]) -> bool:
    """
    Use set to track achievable sums.
    """
    total = sum(nums)
    if total % 2 != 0:
        return False
    
    target = total // 2
    achievable = {0}
    
    for num in nums:
        achievable = achievable | {s + num for s in achievable if s + num <= target}
        if target in achievable:
            return True
    
    return target in achievable
```

### Solution 4: Bitset Optimization

```python
def can_partition_bitset(nums: list[int]) -> bool:
    """
    Using integer as bitmask for O(sum/64) space with bitwise ops.
    Bit i is set if sum i is achievable.
    """
    total = sum(nums)
    if total % 2 != 0:
        return False
    
    target = total // 2
    
    # bit i set = sum i is achievable
    bits = 1  # Initially only 0 is achievable
    
    for num in nums:
        bits |= bits << num  # Add num to all achievable sums
    
    return bool(bits & (1 << target))
```

---

## ⚡ Complexity Analysis

| Approach | Time | Space |
|----------|------|-------|
| 1D DP | O(n × sum) | O(sum/2) |
| 2D DP | O(n × sum) | O(n × sum) |
| Set | O(n × sum) | O(sum) |
| Bitset | O(n × sum/64) | O(sum/64) |

**Practical note:** For this problem, sum ≤ 200 × 100 = 20,000, so all approaches are fast.

---

## ⚠️ Common Mistakes

### 1. Forgetting Odd Sum Check

**❌ Wrong:**
```python
def can_partition(nums):
    target = sum(nums) // 2  # Integer division hides the problem
    # For sum=7, target=3, but 3+3≠7!
```

**✅ Correct:**
```python
def can_partition(nums):
    total = sum(nums)
    if total % 2 != 0:
        return False  # Odd sum = impossible
    target = total // 2
```

### 2. Forward Loop Instead of Backward

**❌ Wrong:**
```python
for num in nums:
    for s in range(num, target + 1):  # Forward!
        dp[s] = dp[s] or dp[s - num]
# This allows using same element multiple times
```

**✅ Correct:**
```python
for num in nums:
    for s in range(target, num - 1, -1):  # Backward!
        dp[s] = dp[s] or dp[s - num]
```

### 3. Not Initializing dp[0]

**❌ Wrong:**
```python
dp = [False] * (target + 1)
# dp[0] = False means we can't achieve sum 0?
```

**✅ Correct:**
```python
dp = [False] * (target + 1)
dp[0] = True  # Empty subset achieves sum 0
```

---

## 📊 Trace Through Example

```
nums = [1, 5, 11, 5]
total = 22, target = 11

Initial dp: [T, F, F, F, F, F, F, F, F, F, F, F]
            (index 0 through 11)

num = 1:
  s=11: dp[11] = F or dp[10] = F
  ...
  s=1:  dp[1] = F or dp[0] = T → True
  dp: [T, T, F, F, F, F, F, F, F, F, F, F]

num = 5:
  s=11: dp[11] = F or dp[6] = F
  s=6:  dp[6] = F or dp[1] = T → True
  s=5:  dp[5] = F or dp[0] = T → True
  dp: [T, T, F, F, F, T, T, F, F, F, F, F]

num = 11:
  s=11: dp[11] = F or dp[0] = T → True!
  
Answer: True (subset {11} or {1, 5, 5})
```

---

## 🔄 Related Transformations

| Problem | Transformation |
|---------|----------------|
| Equal Partition | Subset sum to total/2 |
| Minimum Subset Difference | Subset sum closest to total/2 |
| Target Sum (+/-) | Subset sum to (total+target)/2 |
| Last Stone Weight II | Partition to minimize difference |

### Finding Actual Partition

```python
def partition_with_elements(nums: list[int]) -> tuple:
    """Return the two subsets if possible."""
    total = sum(nums)
    if total % 2 != 0:
        return None
    
    target = total // 2
    n = len(nums)
    
    # Track which elements we used
    dp = [[False] * (target + 1) for _ in range(n + 1)]
    for i in range(n + 1):
        dp[i][0] = True
    
    for i in range(1, n + 1):
        for s in range(target + 1):
            dp[i][s] = dp[i-1][s]
            if nums[i-1] <= s:
                dp[i][s] = dp[i][s] or dp[i-1][s - nums[i-1]]
    
    if not dp[n][target]:
        return None
    
    # Backtrack to find elements
    subset1 = []
    s = target
    for i in range(n, 0, -1):
        if dp[i][s] and not dp[i-1][s]:
            subset1.append(nums[i-1])
            s -= nums[i-1]
    
    subset2 = list(nums)
    for x in subset1:
        subset2.remove(x)
    
    return subset1, subset2
```

---

## 📝 Related Problems

- [ ] [Target Sum](https://leetcode.com/problems/target-sum/) - Count ways with +/-
- [ ] [Last Stone Weight II](https://leetcode.com/problems/last-stone-weight-ii/) - Min difference
- [ ] [Subset Sum](https://www.geeksforgeeks.org/subset-sum-problem-dp-25/) - Direct version
- [ ] [Ones and Zeroes](https://leetcode.com/problems/ones-and-zeroes/) - 2D knapsack

---

## 🎤 Interview Tips

**Time to solve:** 15-20 minutes

**Communication template:**
> "This is a partition problem, but I can reduce it: if we can partition into equal halves, each half sums to total/2. So I just need to check if there's any subset summing to total/2. This is classic 0/1 Knapsack—I'll use a boolean DP array where dp[s] means 'can we achieve sum s' using elements seen so far. I iterate backwards to ensure each element is used at most once."

**Key points to mention:**
1. Odd sum → impossible
2. Reduction to subset sum
3. Backward iteration for 0/1
4. Early termination optimization

**Company frequency:**
| Company | Frequency |
|---------|-----------|
| Amazon | ⭐⭐⭐⭐ |
| Google | ⭐⭐⭐ |
| Meta | ⭐⭐⭐ |
| Microsoft | ⭐⭐⭐ |

---

> **💡 Key Insight:** "Can we partition equally?" reduces to "Can we find subset summing to half?" This reduction is the core skill for 0/1 Knapsack problems—recognize what's the "capacity" in disguise.

> **🔗 Related:** [0/1 Knapsack Pattern](../6.1-Knapsack-01-Pattern.md) | [Target Sum](./02-Target-Sum-LC494.md) | [Last Stone Weight II](./03-Last-Stone-Weight-II-LC1049.md)
