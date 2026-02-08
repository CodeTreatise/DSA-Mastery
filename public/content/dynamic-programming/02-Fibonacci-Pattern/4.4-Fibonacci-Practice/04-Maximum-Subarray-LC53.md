# Maximum Subarray - Kadane's Algorithm (LC 53)

> **The most famous 1D DP problem.** Kadane's Algorithm is elegant, efficient, and appears constantly in interviews. It's also the foundation for many "maximum" optimization problems.

---

## 📋 Problem Statement

**LeetCode:** [53. Maximum Subarray](https://leetcode.com/problems/maximum-subarray/)

Given an integer array `nums`, find the subarray with the largest sum and return its sum.

**Constraints:**
- 1 ≤ nums.length ≤ 10⁵
- -10⁴ ≤ nums[i] ≤ 10⁴

---

## 🎯 Pattern Recognition

**Why this is DP:**
- At each position: extend current subarray OR start new subarray
- Optimal substructure: best ending at i depends on best ending at i-1
- `dp[i] = max(dp[i-1] + nums[i], nums[i])`

**Signals:**
- "maximum sum subarray" (contiguous)
- "best ending at each position"
- Linear array optimization

**NOT the same as:**
- Maximum sum subsequence (non-contiguous) → Different problem
- Maximum product subarray → Needs min tracking too

---

## 📐 Approach Analysis

### The Key Insight

```
At position i, the max sum ending here is either:
1. Extend: previous max sum + current = dp[i-1] + nums[i]
2. Restart: just current element = nums[i]

Choose the larger one.
Why restart? If dp[i-1] < 0, it only hurts the sum!
```

**Visualization:**
```
nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]

Position 0: max_here = -2
Position 1: max_here = max(-2+1, 1) = 1      ← restart
Position 2: max_here = max(1-3, -3) = -2     ← extend
Position 3: max_here = max(-2+4, 4) = 4      ← restart
Position 4: max_here = max(4-1, -1) = 3      ← extend
Position 5: max_here = max(3+2, 2) = 5       ← extend
Position 6: max_here = max(5+1, 1) = 6       ← extend
Position 7: max_here = max(6-5, -5) = 1      ← extend
Position 8: max_here = max(1+4, 4) = 5       ← extend

Global max = 6 (subarray [4, -1, 2, 1])
```

---

## 💻 Solutions

### Solution 1: Kadane's Algorithm (Optimal)

```python
def max_subarray(nums: list[int]) -> int:
    """
    Kadane's Algorithm: Track max sum ending at each position.
    Time: O(n), Space: O(1)
    """
    max_so_far = nums[0]  # Global maximum
    max_ending_here = nums[0]  # Current subarray max
    
    for i in range(1, len(nums)):
        # Extend current subarray or start new
        max_ending_here = max(max_ending_here + nums[i], nums[i])
        
        # Update global max
        max_so_far = max(max_so_far, max_ending_here)
    
    return max_so_far
```

```javascript
function maxSubarray(nums) {
    let maxSoFar = nums[0];
    let maxEndingHere = nums[0];
    
    for (let i = 1; i < nums.length; i++) {
        maxEndingHere = Math.max(maxEndingHere + nums[i], nums[i]);
        maxSoFar = Math.max(maxSoFar, maxEndingHere);
    }
    
    return maxSoFar;
}
```

### Solution 2: DP Array (for visualization)

```python
def max_subarray_dp(nums: list[int]) -> int:
    """
    Explicit DP array - helps understand the recurrence.
    Time: O(n), Space: O(n)
    """
    n = len(nums)
    dp = [0] * n  # dp[i] = max sum ending at i
    dp[0] = nums[0]
    
    for i in range(1, n):
        dp[i] = max(dp[i-1] + nums[i], nums[i])
    
    return max(dp)
```

### Solution 3: Clean One-liner Formulation

```python
def max_subarray_clean(nums: list[int]) -> int:
    """
    Same algorithm, cleaner logic:
    If current sum becomes negative, reset to 0.
    """
    max_sum = float('-inf')
    current_sum = 0
    
    for num in nums:
        current_sum = max(0, current_sum) + num
        max_sum = max(max_sum, current_sum)
    
    return max_sum
```

---

## 📊 Finding the Actual Subarray

```python
def max_subarray_with_indices(nums: list[int]) -> tuple:
    """
    Return (max_sum, start_index, end_index)
    """
    max_so_far = nums[0]
    max_ending_here = nums[0]
    
    start = end = 0
    temp_start = 0
    
    for i in range(1, len(nums)):
        if nums[i] > max_ending_here + nums[i]:
            # Start new subarray
            max_ending_here = nums[i]
            temp_start = i
        else:
            # Extend current
            max_ending_here = max_ending_here + nums[i]
        
        if max_ending_here > max_so_far:
            max_so_far = max_ending_here
            start = temp_start
            end = i
    
    return (max_so_far, start, end)

# Example:
# nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]
# Returns: (6, 3, 6)  → subarray is nums[3:7] = [4, -1, 2, 1]
```

---

## ⚡ Complexity Analysis

| Approach | Time | Space |
|----------|------|-------|
| Brute Force | O(n²) | O(1) |
| Divide & Conquer | O(n log n) | O(log n) |
| **Kadane's** | **O(n)** | **O(1)** |

**Why Kadane's works:**
- We only care about max sum, not which elements
- Negative prefix sums are always discarded (can't help)
- One pass through array is sufficient

---

## ⚠️ Common Mistakes

### 1. Not Handling All Negative Arrays

**❌ Wrong:**
```python
current_sum = 0  # Start at 0
for num in nums:
    current_sum = max(0, current_sum + num)  # Always non-negative!
# For [-3, -1, -2], returns 0 (empty subarray - not valid!)
```

**✅ Correct:**
```python
max_sum = nums[0]  # At least one element required
current_sum = nums[0]
for i in range(1, len(nums)):
    current_sum = max(current_sum + nums[i], nums[i])
    max_sum = max(max_sum, current_sum)
# For [-3, -1, -2], returns -1 (the least negative)
```

### 2. Confusing with Running Sum

**❌ Wrong:**
```python
# This finds max prefix sum, not max subarray sum
running_sum = 0
for num in nums:
    running_sum += num
    max_sum = max(max_sum, running_sum)
```

**✅ Correct:**
```python
# Reset when current sum hurts
current_sum = nums[0]
for i in range(1, len(nums)):
    current_sum = max(current_sum + nums[i], nums[i])  # Key line
```

### 3. Returning Current Instead of Global Max

**❌ Wrong:**
```python
for num in nums:
    current_sum = max(current_sum + num, num)
return current_sum  # Just the last max_ending_here!
```

**✅ Correct:**
```python
for num in nums:
    current_sum = max(current_sum + num, num)
    max_sum = max(max_sum, current_sum)  # Track global max
return max_sum
```

---

## 🔄 Variations

### Maximum Product Subarray

**Key difference:** Need to track both max AND min (negative × negative = positive)

```python
def max_product(nums: list[int]) -> int:
    """
    Track max and min products ending at each position.
    """
    max_prod = min_prod = result = nums[0]
    
    for i in range(1, len(nums)):
        # When multiplying by negative, max becomes min and vice versa
        temp = max_prod
        max_prod = max(nums[i], max_prod * nums[i], min_prod * nums[i])
        min_prod = min(nums[i], temp * nums[i], min_prod * nums[i])
        result = max(result, max_prod)
    
    return result
```

### Maximum Circular Subarray

**Key insight:** Circular max = max(normal max, total - min subarray)

```python
def max_circular(nums: list[int]) -> int:
    """
    Two cases:
    1. Max subarray doesn't wrap
    2. Max subarray wraps = total - min subarray
    """
    total = sum(nums)
    
    # Normal Kadane for max and min
    max_sum = cur_max = nums[0]
    min_sum = cur_min = nums[0]
    
    for i in range(1, len(nums)):
        cur_max = max(nums[i], cur_max + nums[i])
        max_sum = max(max_sum, cur_max)
        
        cur_min = min(nums[i], cur_min + nums[i])
        min_sum = min(min_sum, cur_min)
    
    # If all negative, min_sum = total, return max_sum
    if max_sum < 0:
        return max_sum
    
    return max(max_sum, total - min_sum)
```

### Maximum Subarray with Constraints

| Constraint | Modification |
|------------|--------------|
| At least k elements | Sliding window + Kadane |
| At most k elements | Sliding window max |
| Non-contiguous | Greedy (sum all positive) |

---

## 📝 Trace Through Example

```
nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]

i=0: current=-2, max=-2
i=1: current=max(-2+1,1)=1, max=1
i=2: current=max(1-3,-3)=-2, max=1
i=3: current=max(-2+4,4)=4, max=4
i=4: current=max(4-1,-1)=3, max=4
i=5: current=max(3+2,2)=5, max=5
i=6: current=max(5+1,1)=6, max=6   ← global max found here
i=7: current=max(6-5,-5)=1, max=6
i=8: current=max(1+4,4)=5, max=6

Answer: 6 (subarray [4,-1,2,1])
```

---

## 📝 Related Problems

- [ ] [Maximum Product Subarray](https://leetcode.com/problems/maximum-product-subarray/) - Track min too
- [ ] [Maximum Sum Circular Subarray](https://leetcode.com/problems/maximum-sum-circular-subarray/) - Two cases
- [ ] [Best Time to Buy and Sell Stock](https://leetcode.com/problems/best-time-to-buy-and-sell-stock/) - Related concept
- [ ] [Longest Turbulent Subarray](https://leetcode.com/problems/longest-turbulent-subarray/) - Pattern extension

---

## 🎤 Interview Tips

**Time to solve:** 10-15 minutes

**Communication template:**
> "At each position, I decide whether to extend the current subarray or start a new one. If the current sum becomes negative, it can only hurt future sums, so I restart. I track both the current ending sum and the global maximum. This is Kadane's Algorithm—O(n) time, O(1) space."

**Follow-up questions:**
- "Can you find the actual subarray?" → Track start/end indices
- "What about circular array?" → Max of (normal max, total - min)
- "What about products?" → Track both max and min products

**Company frequency:**
| Company | Frequency | Notes |
|---------|-----------|-------|
| Amazon | ⭐⭐⭐⭐⭐ | Very common |
| Meta | ⭐⭐⭐⭐ | Often as warm-up |
| Google | ⭐⭐⭐⭐ | May ask variations |
| Microsoft | ⭐⭐⭐⭐ | Classic problem |

---

> **💡 Key Insight:** Kadane's core idea: "If the current subarray sum is negative, it can only hurt future sums—start fresh." This greedy decision at each step leads to the global optimum, making it O(n) with O(1) space.

> **🔗 Related:** [House Robber](./02-House-Robber-LC198.md) | [Fibonacci Pattern](../4.1-Fibonacci-Pattern-Overview.md) | [Prefix Sum](../../../01-Arrays-Strings/01-Arrays/1.4-Common-Techniques/03-Prefix-Sum.md)
