# Maximum Subarray (LeetCode 53) - Greedy View

> **Pattern:** Greedy Running Maximum (Kadane's Algorithm)
> **Difficulty:** Medium
> **Company Focus:** All major companies (fundamental)

---

## 📋 Problem Statement

Given an integer array `nums`, find the contiguous subarray (containing at least one number) which has the largest sum and return its sum.

### Examples

```
Input: nums = [-2,1,-3,4,-1,2,1,-5,4]
Output: 6
Explanation: [4,-1,2,1] has the largest sum = 6

Input: nums = [1]
Output: 1

Input: nums = [5,4,-1,7,8]
Output: 23
Explanation: Entire array [5,4,-1,7,8]
```

### Constraints

- `1 <= nums.length <= 10^5`
- `-10^4 <= nums[i] <= 10^4`

---

## 🎯 Pattern Recognition

**Signals:**
- "Maximum subarray" → contiguous sequence
- Optimization → greedy or DP
- "At least one element" → must include something

**Key insight:** At each position, decide: extend current subarray OR start fresh?

---

## 🧠 The Greedy Insight

### Kadane's Algorithm as Greedy

At each index, make a greedy choice:

1. If current sum + nums[i] > nums[i], extend
2. Otherwise, start new subarray at nums[i]

**In other words:** If previous sum is negative, discard it!

```
Greedy rule: current = max(nums[i], current + nums[i])

This is equivalent to:
if current < 0:
    current = nums[i]  # Start fresh
else:
    current += nums[i]  # Extend
```

---

## 💻 Solution

```python
def maxSubArray(nums: list[int]) -> int:
    """
    LeetCode 53: Maximum Subarray (Kadane's Algorithm)
    
    Greedy: Keep extending if profitable, otherwise start fresh.
    
    Time: O(n), Space: O(1)
    """
    max_sum = nums[0]
    current_sum = nums[0]
    
    for i in range(1, len(nums)):
        # Greedy choice: extend or start fresh?
        current_sum = max(nums[i], current_sum + nums[i])
        max_sum = max(max_sum, current_sum)
    
    return max_sum
```

```javascript
function maxSubArray(nums) {
    let maxSum = nums[0];
    let currentSum = nums[0];
    
    for (let i = 1; i < nums.length; i++) {
        currentSum = Math.max(nums[i], currentSum + nums[i]);
        maxSum = Math.max(maxSum, currentSum);
    }
    
    return maxSum;
}
```

### Alternative View (More Explicit)

```python
def maxSubArray_explicit(nums: list[int]) -> int:
    """More explicit greedy logic."""
    max_sum = nums[0]
    current_sum = 0
    
    for num in nums:
        # If current sum is negative, it can only hurt us
        if current_sum < 0:
            current_sum = 0  # Reset
        
        current_sum += num
        max_sum = max(max_sum, current_sum)
    
    return max_sum
```

---

## 📐 Step-by-Step Trace

```
nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]

i=0: num=-2
     current = -2
     max = -2

i=1: num=1
     current = max(1, -2+1) = max(1, -1) = 1
     max = max(-2, 1) = 1

i=2: num=-3
     current = max(-3, 1+(-3)) = max(-3, -2) = -2
     max = max(1, -2) = 1

i=3: num=4
     current = max(4, -2+4) = max(4, 2) = 4
     max = max(1, 4) = 4

i=4: num=-1
     current = max(-1, 4+(-1)) = max(-1, 3) = 3
     max = max(4, 3) = 4

i=5: num=2
     current = max(2, 3+2) = max(2, 5) = 5
     max = max(4, 5) = 5

i=6: num=1
     current = max(1, 5+1) = max(1, 6) = 6
     max = max(5, 6) = 6

i=7: num=-5
     current = max(-5, 6+(-5)) = max(-5, 1) = 1
     max = max(6, 1) = 6

i=8: num=4
     current = max(4, 1+4) = max(4, 5) = 5
     max = max(6, 5) = 6

Answer: 6 (subarray [4, -1, 2, 1])
```

---

## ⚡ Complexity Analysis

| Metric | Value | Explanation |
|--------|-------|-------------|
| Time | O(n) | Single pass |
| Space | O(1) | Just two variables |

---

## 🔄 Variations

### 1. Return Indices (Start and End)

```python
def maxSubArrayIndices(nums: list[int]) -> tuple[int, int, int]:
    """Return (max_sum, start_idx, end_idx)."""
    max_sum = nums[0]
    current_sum = nums[0]
    start = end = temp_start = 0
    
    for i in range(1, len(nums)):
        if nums[i] > current_sum + nums[i]:
            current_sum = nums[i]
            temp_start = i  # New potential start
        else:
            current_sum += nums[i]
        
        if current_sum > max_sum:
            max_sum = current_sum
            start = temp_start
            end = i
    
    return max_sum, start, end
```

### 2. Circular Subarray (LeetCode 918)

```python
def maxSubarraySumCircular(nums: list[int]) -> int:
    """
    For circular, answer is either:
    1. Normal max subarray, OR
    2. Total sum - min subarray (wrapping around)
    """
    total = sum(nums)
    
    # Normal Kadane for max
    max_sum = current_max = nums[0]
    for i in range(1, len(nums)):
        current_max = max(nums[i], current_max + nums[i])
        max_sum = max(max_sum, current_max)
    
    # Kadane for min (elements to exclude for wrap-around)
    min_sum = current_min = nums[0]
    for i in range(1, len(nums)):
        current_min = min(nums[i], current_min + nums[i])
        min_sum = min(min_sum, current_min)
    
    # If all negative, min_sum = total (can't wrap)
    if min_sum == total:
        return max_sum
    
    return max(max_sum, total - min_sum)
```

---

## ⚠️ Common Mistakes

### 1. Starting max_sum at 0

```python
# ❌ Wrong: Fails for all-negative arrays
max_sum = 0  # [-2, -1] would return 0!

# ✅ Correct: Start with first element
max_sum = nums[0]
```

### 2. Empty Array Edge Case

```python
# ❌ Wrong: No guard
def maxSubArray(nums):
    max_sum = nums[0]  # Crashes if empty!

# ✅ Correct: Guard or assume non-empty
if not nums:
    return 0  # or handle as needed
```

### 3. Resetting Current to 0 vs nums[i]

```python
# ❌ Wrong: Reset to 0
if current + nums[i] < 0:
    current = 0  # What if next element is the max?

# ✅ Correct: Take max
current = max(nums[i], current + nums[i])
```

---

## 📐 Why Greedy Works (Intuition)

```
At each position, we ask: "Is the previous sum helping or hurting?"

If previous sum is negative:
  nums:    [ ... negative sum ] [current]
  Keeping the negative sum can only make things worse.
  So start fresh from current.

If previous sum is positive (or zero):
  nums:    [ ... positive sum ] [current]
  Adding to it might help (or at least won't hurt more than restarting).
  So extend.

This greedy choice is locally optimal AND globally optimal!
```

---

## 🔗 Related Problems

| Problem | Variation | Link |
|---------|-----------|------|
| Maximum Product Subarray | Product instead of sum | [LC 152](https://leetcode.com/problems/maximum-product-subarray/) |
| Max Circular Subarray | Wrap-around | [LC 918](https://leetcode.com/problems/maximum-sum-circular-subarray/) |
| Best Time Buy/Sell Stock | Difference max | [LC 121](https://leetcode.com/problems/best-time-to-buy-and-sell-stock/) |
| Longest Turbulent Subarray | Sign alternation | [LC 978](https://leetcode.com/problems/longest-turbulent-subarray/) |

---

## 🎤 Interview Tips

<details>
<summary><strong>How to Communicate</strong></summary>

**Opening:**
"This is the classic maximum subarray problem, solved with Kadane's algorithm - a greedy approach."

**Explain the greedy choice:**
"At each index, I make a greedy decision: is the previous subarray sum helping me or hurting me? If it's negative, I discard it and start fresh."

**Implementation:**
"I track current_sum and max_sum. Current is updated as max(nums[i], current + nums[i]), and I keep the best max_sum seen."

**Follow-up for indices:**
"To track indices, I remember where I started fresh (temp_start) and update the final start/end when I find a new maximum."

</details>

---

## ⏱️ Time Estimates

| Activity | Time |
|----------|------|
| Recognize Kadane's | 30 sec |
| Code solution | 2-3 min |
| Trace example | 1-2 min |
| Handle edge cases | 1 min |
| **Total** | **5-7 min** |

---

> **💡 Key Insight:** A negative prefix sum can only hurt future elements. Discard it (start fresh) as soon as it goes negative.

> **🔗 Related:** [Kadane's Algorithm](../../01-Arrays-Strings/01-Arrays/1.4-Common-Techniques/04-Kadanes-Algorithm.md)
