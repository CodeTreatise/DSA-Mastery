# Jump Game - Practice Problem

> **LeetCode 55:** [Jump Game](https://leetcode.com/problems/jump-game/)
> 
> **Difficulty:** Medium | **Pattern:** Greedy Reachability | **Time:** O(n)

---

## 📋 Problem Statement

You are given an integer array `nums`. You are initially positioned at the array's **first index**, and each element in the array represents your maximum jump length at that position.

Return `true` if you can reach the last index, or `false` otherwise.

**Example 1:**
```
Input: nums = [2,3,1,1,4]
Output: true
Explanation: Jump 1 step from index 0 to 1, then 3 steps to the last index.
```

**Example 2:**
```
Input: nums = [3,2,1,0,4]
Output: false
Explanation: Always arrive at index 3, whose value is 0. Can never reach index 4.
```

**Constraints:**
- 1 ≤ nums.length ≤ 10^4
- 0 ≤ nums[i] ≤ 10^5

---

## 🎯 Pattern Recognition

**Key Insight:**
```
We don't need to track the exact path!
Just track: what's the FARTHEST index we can reach?

If at any point i > max_reachable, we can't continue.
If max_reachable >= last index, we can reach!
```

**Greedy Choice:**
```
At each position, extend our reach as far as possible.
Having more reach is never worse than having less.
```

---

## 📐 Solution Approach

### Algorithm

```
1. Track max_reachable = 0 (farthest index we can reach)
2. For each index i from 0 to n-1:
   a. If i > max_reachable: return False (can't get here)
   b. Update max_reachable = max(max_reachable, i + nums[i])
   c. If max_reachable >= n-1: return True (can reach end)
3. Return True
```

### Visual Trace

```
nums = [2, 3, 1, 1, 4]
idx     0  1  2  3  4

i=0: Can we reach index 0? 0 <= 0 ✓
     max_reach = max(0, 0+2) = 2
     
i=1: Can we reach index 1? 1 <= 2 ✓
     max_reach = max(2, 1+3) = 4
     4 >= 4 → Can reach last index! ✓

nums = [3, 2, 1, 0, 4]
idx     0  1  2  3  4

i=0: max_reach = max(0, 0+3) = 3
i=1: max_reach = max(3, 1+2) = 3
i=2: max_reach = max(3, 2+1) = 3
i=3: max_reach = max(3, 3+0) = 3
i=4: Can we reach index 4? 4 <= 3? NO → return False ✗
```

---

## 💻 Solutions

### Solution 1: Greedy Forward (Recommended)

```python
def canJump(nums: list[int]) -> bool:
    """
    Track maximum reachable index.
    
    Time: O(n), Space: O(1)
    """
    max_reach = 0
    
    for i in range(len(nums)):
        # Can't reach this index
        if i > max_reach:
            return False
        
        # Update farthest reachable
        max_reach = max(max_reach, i + nums[i])
        
        # Early termination (optimization)
        if max_reach >= len(nums) - 1:
            return True
    
    return True
```

```javascript
function canJump(nums) {
    let maxReach = 0;
    
    for (let i = 0; i < nums.length; i++) {
        if (i > maxReach) return false;
        maxReach = Math.max(maxReach, i + nums[i]);
        if (maxReach >= nums.length - 1) return true;
    }
    
    return true;
}
```

---

### Solution 2: Greedy Backward

```python
def canJumpBackward(nums: list[int]) -> bool:
    """
    Work backwards: track last reachable position.
    
    Time: O(n), Space: O(1)
    """
    last_reachable = len(nums) - 1
    
    for i in range(len(nums) - 2, -1, -1):
        # Can we reach last_reachable from position i?
        if i + nums[i] >= last_reachable:
            last_reachable = i
    
    return last_reachable == 0
```

```javascript
function canJumpBackward(nums) {
    let lastReachable = nums.length - 1;
    
    for (let i = nums.length - 2; i >= 0; i--) {
        if (i + nums[i] >= lastReachable) {
            lastReachable = i;
        }
    }
    
    return lastReachable === 0;
}
```

---

### Solution 3: DP (For Reference - Slower)

```python
def canJumpDP(nums: list[int]) -> bool:
    """
    DP approach - O(n²) - for educational purposes.
    """
    n = len(nums)
    dp = [False] * n
    dp[0] = True
    
    for i in range(1, n):
        for j in range(i):
            if dp[j] and j + nums[j] >= i:
                dp[i] = True
                break
    
    return dp[n - 1]
```

---

## 🔍 Detailed Trace

```
Input: [2, 3, 1, 1, 4]

Initialize: max_reach = 0

i=0: nums[0]=2
  - Check: 0 <= 0? ✓ (can reach index 0)
  - Update: max_reach = max(0, 0+2) = 2
  - Check: 2 >= 4? ✗ (continue)

i=1: nums[1]=3
  - Check: 1 <= 2? ✓ (can reach index 1)
  - Update: max_reach = max(2, 1+3) = 4
  - Check: 4 >= 4? ✓ EARLY RETURN True!

Output: true
```

---

## ⚠️ Edge Cases

| Case | Input | Output | Explanation |
|------|-------|--------|-------------|
| Single element | `[0]` | `true` | Already at end |
| Zero at start | `[0,1,2]` | `false` | Can't move |
| All zeros | `[0,0,0]` | `false` | Stuck at start |
| Large jump | `[10,0,0,0,0]` | `true` | One jump covers all |
| Zero trap | `[1,0,1,0]` | `false` | Gets stuck at index 1 |
| Exactly reach | `[1,2,0,1]` | `true` | Just barely reaches |

---

## ⚡ Complexity Analysis

| Aspect | Complexity | Explanation |
|--------|------------|-------------|
| **Time** | O(n) | Single pass through array |
| **Space** | O(1) | Only track max_reach |

### Why Greedy Works

```
Claim: If we can reach position X, we can reach all positions 0 to X.

Why? At each position i, we update:
  max_reach = max(max_reach, i + nums[i])

This only increases (or stays same). If max_reach ever >= n-1,
we can definitely reach the end.

If at any point i > max_reach, there's no way to get to i,
so we can't reach the end.
```

---

## 🔄 Comparison: Forward vs Backward

| Approach | Direction | Tracks | When to Use |
|----------|-----------|--------|-------------|
| Forward | 0 → n-1 | Max reachable | Default choice |
| Backward | n-1 → 0 | Last reachable from 0 | Alternative |

**Forward advantages:**
- More intuitive (simulates jumping)
- Early termination possible
- Easier to extend to "min jumps"

**Backward advantages:**
- Slightly simpler logic
- Works well for "find all starting points" variants

---

## 📝 Common Mistakes

### 1. Forgetting Check Before Update

```python
# ❌ WRONG: Update without checking reachability
for i in range(len(nums)):
    max_reach = max(max_reach, i + nums[i])  # What if we can't reach i?

# ✅ CORRECT: Check first
for i in range(len(nums)):
    if i > max_reach:
        return False
    max_reach = max(max_reach, i + nums[i])
```

### 2. Off-by-One in Final Check

```python
# ❌ WRONG: Using > instead of >=
if max_reach > len(nums) - 1:  # Misses exact reach

# ✅ CORRECT: >= for exact reach
if max_reach >= len(nums) - 1:
```

### 3. Not Handling Single Element

```python
# ❌ WRONG: Assumes length > 1
# May have issues with loop bounds

# ✅ CORRECT: Works for any length >= 1
# Because if len=1, we're already at the end
```

---

## 🎤 Interview Tips

**Opening statement:**
```
"This is a reachability problem. I don't need to find the actual 
path, just whether reaching the end is possible.

I'll track the maximum index I can reach. At each position,
I extend my reach. If I ever can't reach my current position,
return false.

O(n) time, O(1) space."
```

**Follow-up questions:**
- "What's the minimum jumps?" → Jump Game II
- "What if we can jump backward?" → BFS or DP
- "What if there are obstacles?" → Modified reachability
- "Find all starting positions that can reach end" → Backward sweep

---

## 🔗 Related Problems

| Problem | Relationship |
|---------|--------------|
| [Jump Game II](https://leetcode.com/problems/jump-game-ii/) | Min jumps |
| [Jump Game III](https://leetcode.com/problems/jump-game-iii/) | BFS, bidirectional |
| [Jump Game IV](https://leetcode.com/problems/jump-game-iv/) | BFS with teleports |
| [Jump Game VII](https://leetcode.com/problems/jump-game-vii/) | Range jumps |
