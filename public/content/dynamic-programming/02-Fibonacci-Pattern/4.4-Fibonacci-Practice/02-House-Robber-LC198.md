# House Robber (LC 198)

> **The classic take-or-skip DP problem.** Understanding House Robber unlocks a whole family of problems where you make binary decisions with constraints on adjacent elements.

---

## 📋 Problem Statement

**LeetCode:** [198. House Robber](https://leetcode.com/problems/house-robber/)

You are a robber planning to rob houses along a street. Each house has a certain amount of money. Adjacent houses have security systems connected—if two adjacent houses are robbed on the same night, the police will be alerted.

Given an integer array `nums` representing money in each house, return the maximum amount you can rob without alerting the police.

**Constraints:**
- 1 ≤ nums.length ≤ 100
- 0 ≤ nums[i] ≤ 400

---

## 🎯 Pattern Recognition

**This is Fibonacci Pattern because:**
- At each house: binary decision (rob or skip)
- Decision depends only on previous 2 states
- `dp[i] = max(dp[i-1], dp[i-2] + nums[i])`

**Signals:**
- "Can't choose adjacent elements"
- Maximum/minimum with constraints
- Linear array, binary choice at each position

---

## 📐 Approach Analysis

### Understanding the Recurrence

```
At house i, you have two choices:
1. SKIP house i: max money = dp[i-1] (whatever you had before)
2. ROB house i:  max money = dp[i-2] + nums[i] (skip i-1, add current)

dp[i] = max(skip, rob) = max(dp[i-1], dp[i-2] + nums[i])
```

**Visualization:**
```
Houses: [2, 7, 9, 3, 1]
         ↓  ↓  ↓  ↓  ↓
         
House 0: Rob 2        → dp[0] = 2
House 1: max(2, 7)    → dp[1] = 7  (skip 2, rob 7)
House 2: max(7, 2+9)  → dp[2] = 11 (rob 2, skip 7, rob 9)
House 3: max(11, 7+3) → dp[3] = 11 (11 > 10)
House 4: max(11, 11+1)→ dp[4] = 12 (rob 2, skip 7, rob 9, skip 3, rob 1)

Answer: 12
Optimal path: houses 0, 2, 4 → 2 + 9 + 1 = 12
```

**Why max(dp[i-1], dp[i-2] + nums[i])?**
- If you rob house i, you couldn't have robbed i-1, so best before that is dp[i-2]
- If you skip house i, you keep dp[i-1]

---

## 💻 Solutions

### Solution 1: Tabulation

```python
def rob_tabulation(nums: list[int]) -> int:
    """
    Build dp array from left to right.
    Time: O(n), Space: O(n)
    """
    if not nums:
        return 0
    if len(nums) == 1:
        return nums[0]
    
    n = len(nums)
    dp = [0] * n
    dp[0] = nums[0]
    dp[1] = max(nums[0], nums[1])
    
    for i in range(2, n):
        dp[i] = max(dp[i-1], dp[i-2] + nums[i])
    
    return dp[n-1]
```

### Solution 2: Space Optimized (Optimal)

```python
def rob(nums: list[int]) -> int:
    """
    Only need previous 2 values.
    Time: O(n), Space: O(1)
    """
    if not nums:
        return 0
    if len(nums) == 1:
        return nums[0]
    
    # prev2 = dp[i-2], prev1 = dp[i-1]
    prev2 = nums[0]
    prev1 = max(nums[0], nums[1])
    
    for i in range(2, len(nums)):
        curr = max(prev1, prev2 + nums[i])
        prev2 = prev1
        prev1 = curr
    
    return prev1
```

```javascript
function rob(nums) {
    if (!nums.length) return 0;
    if (nums.length === 1) return nums[0];
    
    let prev2 = nums[0];
    let prev1 = Math.max(nums[0], nums[1]);
    
    for (let i = 2; i < nums.length; i++) {
        const curr = Math.max(prev1, prev2 + nums[i]);
        prev2 = prev1;
        prev1 = curr;
    }
    
    return prev1;
}
```

### Solution 3: Memoization (Top-Down)

```python
def rob_memo(nums: list[int]) -> int:
    """
    Recursive with memoization.
    Time: O(n), Space: O(n)
    """
    memo = {}
    
    def helper(i):
        if i < 0:
            return 0
        if i in memo:
            return memo[i]
        
        # Rob house i or skip it
        memo[i] = max(helper(i-1), helper(i-2) + nums[i])
        return memo[i]
    
    return helper(len(nums) - 1)
```

### Solution 4: Alternative DP Formulation

```python
def rob_alt(nums: list[int]) -> int:
    """
    Alternative: track 'include current' vs 'exclude current' states.
    Some find this more intuitive.
    """
    if not nums:
        return 0
    
    # include = max money if we rob current house
    # exclude = max money if we skip current house
    include = 0
    exclude = 0
    
    for num in nums:
        new_include = exclude + num  # Must have skipped previous
        new_exclude = max(include, exclude)  # Can come from either
        include = new_include
        exclude = new_exclude
    
    return max(include, exclude)
```

---

## ⚡ Complexity Analysis

| Approach | Time | Space | Notes |
|----------|------|-------|-------|
| Tabulation | O(n) | O(n) | Array |
| **Space Optimized** | **O(n)** | **O(1)** | **Optimal** |
| Memoization | O(n) | O(n) | Recursion stack + memo |
| Include/Exclude | O(n) | O(1) | Alternative formulation |

---

## ⚠️ Common Mistakes

### 1. Incorrect Base Case for dp[1]

**❌ Wrong:**
```python
dp[1] = nums[1]  # Wrong! Should consider nums[0] too
```

**✅ Correct:**
```python
dp[1] = max(nums[0], nums[1])  # Best of first two houses
```

### 2. Not Handling Single House

**❌ Wrong:**
```python
def rob(nums):
    prev2 = nums[0]
    prev1 = max(nums[0], nums[1])  # IndexError if len(nums) == 1!
```

**✅ Correct:**
```python
def rob(nums):
    if len(nums) == 1:
        return nums[0]
    prev2 = nums[0]
    prev1 = max(nums[0], nums[1])
```

### 3. Wrong Variable Semantics

**❌ Confusing:**
```python
# Is prev2 the value AT index i-2, or the best UP TO index i-2?
```

**✅ Clear:**
```python
# prev2 = best robbery amount considering houses 0 to i-2
# prev1 = best robbery amount considering houses 0 to i-1
```

---

## 🔄 Variations

### House Robber II (Circular)

**Problem:** Houses arranged in a circle—first and last are adjacent.

```python
def rob_ii(nums: list[int]) -> int:
    """
    Can't rob both first and last house.
    Two cases:
    1. Rob houses 0 to n-2 (exclude last)
    2. Rob houses 1 to n-1 (exclude first)
    """
    if len(nums) == 1:
        return nums[0]
    
    def rob_linear(houses):
        if not houses:
            return 0
        if len(houses) == 1:
            return houses[0]
        
        prev2 = houses[0]
        prev1 = max(houses[0], houses[1])
        
        for i in range(2, len(houses)):
            curr = max(prev1, prev2 + houses[i])
            prev2 = prev1
            prev1 = curr
        
        return prev1
    
    return max(rob_linear(nums[:-1]), rob_linear(nums[1:]))
```

### House Robber III (Binary Tree)

**Problem:** Houses form a binary tree. Can't rob parent and child together.

```python
def rob_iii(root) -> int:
    """
    Return (max_if_rob_root, max_if_skip_root)
    """
    def helper(node):
        if not node:
            return (0, 0)
        
        left = helper(node.left)
        right = helper(node.right)
        
        # If we rob this node, can't rob children
        rob = node.val + left[1] + right[1]
        
        # If we skip this node, take best from each child
        skip = max(left) + max(right)
        
        return (rob, skip)
    
    return max(helper(root))
```

---

## 📝 Related Problems

- [ ] [House Robber II](https://leetcode.com/problems/house-robber-ii/) - Circular
- [ ] [House Robber III](https://leetcode.com/problems/house-robber-iii/) - Tree
- [ ] [Delete and Earn](https://leetcode.com/problems/delete-and-earn/) - Transforms to House Robber
- [ ] [Pizza With 3n Slices](https://leetcode.com/problems/pizza-with-3n-slices/) - Hard variant

---

## 🎤 Interview Tips

**Time to solve:** 10-15 minutes

**Communication template:**
> "At each house, I have two choices: rob it or skip it. If I rob house i, I couldn't have robbed i-1, so my previous best is dp[i-2] plus current value. If I skip, I keep dp[i-1]. This gives me the recurrence dp[i] = max(dp[i-1], dp[i-2] + nums[i]). Since I only need previous two values, I can optimize to O(1) space."

**Follow-up questions:**
- "What if houses are in a circle?" → Two linear passes
- "What if houses are in a tree?" → Tree DP
- "What if you can skip at most k houses?" → Need more states

**Company frequency:**
| Company | Frequency |
|---------|-----------|
| Amazon | ⭐⭐⭐⭐ |
| Google | ⭐⭐⭐ |
| Meta | ⭐⭐⭐ |
| Microsoft | ⭐⭐⭐ |

---

## 📊 Trace Through Example

```
nums = [1, 2, 3, 1]

i=0: prev2 = 1 (can only rob house 0)
i=1: prev1 = max(1, 2) = 2 (better to rob house 1)
i=2: curr = max(2, 1+3) = 4 (rob houses 0 and 2)
     prev2 = 2, prev1 = 4
i=3: curr = max(4, 2+1) = 4 (skip house 3, keep 4)
     prev2 = 4, prev1 = 4

Answer: 4 (rob houses 0 and 2: 1+3=4)
```

---

> **💡 Key Insight:** The "can't choose adjacent" constraint creates the Fibonacci recurrence. Any time you see this constraint, think House Robber pattern: `dp[i] = max(dp[i-1], dp[i-2] + value[i])`.

> **🔗 Related:** [Climbing Stairs](./01-Climbing-Stairs-LC70.md) | [Delete and Earn](https://leetcode.com/problems/delete-and-earn/) | [Fibonacci Pattern](../4.1-Fibonacci-Pattern-Overview.md)
