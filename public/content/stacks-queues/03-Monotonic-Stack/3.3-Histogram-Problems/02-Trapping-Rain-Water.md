# 02 - Trapping Rain Water (LC 42)

> **Grokking Pattern:** Monotonic Stack / Two Pointers / Dynamic Programming
>
> **Difficulty:** Hard | **Frequency:** ⭐⭐⭐⭐⭐ One of the Most Common Hard Problems

---

## Problem Statement

Given `n` non-negative integers representing an elevation map where the width of each bar is `1`, compute how much water it can trap after raining.

```
Input: height = [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]
Output: 6

Visualization:
                     ┌───┐
             ┌───────┤   │
             │   ┌───┤   ├───┐   ┌───┐
         ┌───┤   │   │   │   │   │   │
         │   │   │   │   │   ├───┤   │
         └───┴───┴───┴───┴───┴───┴───┴───
height:   0  1  0  2  1  0  1  3  2  1  2  1

Water (shown as ~):
                     ┌───┐
             ┌~~~~~~~~~~~┤
             │ ~ ┌~~~┤   ├~~~┐   ┌───┐
         ┌───┤ ~ │   │   │   │ ~ │   │
         │   │ ~ │   │   │   ├───┤   │
         └───┴───┴───┴───┴───┴───┴───┴───

Total water = 6 units
```

[LeetCode 42 - Trapping Rain Water](https://leetcode.com/problems/trapping-rain-water/)

---

## 🎯 Pattern Recognition

<details>
<summary><strong>How to Identify This Pattern</strong></summary>

**Look for these signals:**
- Elevation/height based problem
- Water/liquid trapped between heights
- Need to find "bounded" regions

**Key insight:**
Water above position `i` = min(max_left, max_right) - height[i]

For water to be trapped at position `i`:
1. There must be a taller bar somewhere to the LEFT
2. There must be a taller bar somewhere to the RIGHT
3. Water level = min of those two maxes
4. Water at i = water_level - height[i] (if positive)

**Multiple approaches work:**
1. **Brute Force:** For each position, scan left and right → O(n²)
2. **DP:** Precompute left_max and right_max arrays → O(n)
3. **Two Pointers:** Process from both ends → O(n), O(1) space
4. **Monotonic Stack:** Calculate water when finding boundaries → O(n)

</details>

---

## ✅ When to Use Each Approach

| Approach | Time | Space | Best When |
|----------|------|-------|-----------|
| Two Pointers |" O(n) "| O(1) | Want optimal space |
| DP |" O(n) "| O(n) | Easy to understand |
| Monotonic Stack |" O(n) "| O(n) | Consistent with other stack problems |

---

## ❌ When NOT to Use

| Situation | Why Not | Use Instead |
|-----------|---------|-------------|
| 2D grid flooding | Different problem | BFS/DFS |
| Variable width bars | Different formula | Modify accordingly |
| Need to return positions | Extra tracking needed | Modify approach |

---

## 🔗 Concept Map

<details>
<summary><strong>Prerequisites & Next Steps</strong></summary>

**Before this, you should know:**
- [Monotonic Stack Concept](../3.1-Monotonic-Stack-Concept.md)
- [Two Pointers Technique](../../01-Arrays-Strings/01-Arrays/1.4-Common-Techniques/01-Two-Pointers.md)
- [Largest Rectangle in Histogram](./01-Largest-Rectangle.md)

**After mastering this:**
- [Container With Most Water](https://leetcode.com/problems/container-with-most-water/) - LC 11
- [Trapping Rain Water II](https://leetcode.com/problems/trapping-rain-water-ii/) - LC 407 (3D)
- [Pour Water](https://leetcode.com/problems/pour-water/) - LC 755

**This problem connects:**
- Arrays (Two Pointers)
- Dynamic Programming
- Monotonic Stack

</details>

---

## 📐 How It Works

### Understanding Water Trapping

```
For position i, water level is determined by:
- max_left[i] = maximum height in heights[0..i]
- max_right[i] = maximum height in heights[i..n-1]
- water_level[i] = min(max_left[i], max_right[i])
- water[i] = max(0, water_level[i] - height[i])

height:      [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]
max_left:    [0, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 3]
max_right:   [3, 3, 3, 3, 3, 3, 3, 3, 2, 2, 2, 1]
water_level: [0, 1, 1, 2, 2, 2, 2, 3, 2, 2, 2, 1]
water:       [0, 0, 1, 0, 1, 2, 1, 0, 0, 1, 0, 0] = 6
```

### Visual: Two Pointers Approach

```
height = [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]
          L                             R

Key insight: Process from the side with lower max!
- If left_max < right_max: Water at L is bounded by left_max
- If left_max >= right_max: Water at R is bounded by right_max

Step 1: L=0, R=11
        left_max=0, right_max=1
        left_max < right_max → process L
        water += max(0, 0-0) = 0
        L++

Step 2: L=1, R=11
        height[L]=1 > left_max=0 → left_max=1
        left_max=1, right_max=1
        left_max >= right_max → process R
        water += max(0, 1-1) = 0
        R--

[Continue until L > R...]

Final water = 6
```

---

## 💻 Code Implementation

### Solution 1: Two Pointers (Optimal)

**Python:**
```python
def trap_two_pointers(height: list[int]) -> int:
    """
    Trap rain water using two pointers.
    
    Key insight: Process from the side with smaller max.
    That side's water is bounded by its own max.
    
    Time: O(n), Space: O(1)
    """
    if not height:
        return 0
    
    left, right = 0, len(height) - 1
    left_max, right_max = 0, 0
    water = 0
    
    while left < right:
        if height[left] < height[right]:
            # Water at left is bounded by left_max
            if height[left] >= left_max:
                left_max = height[left]
            else:
                water += left_max - height[left]
            left += 1
        else:
            # Water at right is bounded by right_max
            if height[right] >= right_max:
                right_max = height[right]
            else:
                water += right_max - height[right]
            right -= 1
    
    return water
```

**JavaScript:**
```javascript
/**
 * Trap rain water using two pointers.
 * Time: O(n), Space: O(1)
 */
function trap(height) {
    if (height.length === 0) return 0;
    
    let left = 0, right = height.length - 1;
    let leftMax = 0, rightMax = 0;
    let water = 0;
    
    while (left < right) {
        if (height[left] < height[right]) {
            if (height[left] >= leftMax) {
                leftMax = height[left];
            } else {
                water += leftMax - height[left];
            }
            left++;
        } else {
            if (height[right] >= rightMax) {
                rightMax = height[right];
            } else {
                water += rightMax - height[right];
            }
            right--;
        }
    }
    
    return water;
}
```

### Solution 2: Dynamic Programming

**Python:**
```python
def trap_dp(height: list[int]) -> int:
    """
    Trap rain water using DP.
    
    Precompute max heights from left and right.
    
    Time: O(n), Space: O(n)
    """
    if not height:
        return 0
    
    n = len(height)
    
    # max_left[i] = max height in height[0..i]
    max_left = [0] * n
    max_left[0] = height[0]
    for i in range(1, n):
        max_left[i] = max(max_left[i-1], height[i])
    
    # max_right[i] = max height in height[i..n-1]
    max_right = [0] * n
    max_right[n-1] = height[n-1]
    for i in range(n-2, -1, -1):
        max_right[i] = max(max_right[i+1], height[i])
    
    # Calculate water
    water = 0
    for i in range(n):
        water_level = min(max_left[i], max_right[i])
        water += water_level - height[i]
    
    return water
```

**JavaScript:**
```javascript
function trapDP(height) {
    if (height.length === 0) return 0;
    
    const n = height.length;
    const maxLeft = new Array(n);
    const maxRight = new Array(n);
    
    maxLeft[0] = height[0];
    for (let i = 1; i < n; i++) {
        maxLeft[i] = Math.max(maxLeft[i-1], height[i]);
    }
    
    maxRight[n-1] = height[n-1];
    for (let i = n-2; i >= 0; i--) {
        maxRight[i] = Math.max(maxRight[i+1], height[i]);
    }
    
    let water = 0;
    for (let i = 0; i < n; i++) {
        water += Math.min(maxLeft[i], maxRight[i]) - height[i];
    }
    
    return water;
}
```

### Solution 3: Monotonic Stack

**Python:**
```python
def trap_stack(height: list[int]) -> int:
    """
    Trap rain water using monotonic stack.
    
    Maintain decreasing stack. When we find a taller bar,
    we can calculate water trapped in the "valley".
    
    Time: O(n), Space: O(n)
    """
    stack = []  # Store indices
    water = 0
    
    for i in range(len(height)):
        # While current is taller than stack top
        while stack and height[i] > height[stack[-1]]:
            # Pop the bottom of the valley
            bottom = stack.pop()
            
            # Need a left wall to trap water
            if not stack:
                break
            
            left = stack[-1]
            
            # Width between left wall and current (right wall)
            width = i - left - 1
            
            # Height of water = min of walls - bottom
            h = min(height[left], height[i]) - height[bottom]
            
            water += width * h
        
        stack.append(i)
    
    return water
```

**JavaScript:**
```javascript
function trapStack(height) {
    const stack = [];
    let water = 0;
    
    for (let i = 0; i < height.length; i++) {
        while (stack.length && height[i] > height[stack[stack.length - 1]]) {
            const bottom = stack.pop();
            
            if (!stack.length) break;
            
            const left = stack[stack.length - 1];
            const width = i - left - 1;
            const h = Math.min(height[left], height[i]) - height[bottom];
            
            water += width * h;
        }
        
        stack.push(i);
    }
    
    return water;
}
```

---

## ⚡ Complexity Analysis

| Approach | Time | Space | Notes |
|----------|------|-------|-------|
| Brute Force |" O(n²) "| O(1) | Scan left/right for each position |
| DP |" O(n) "| O(n) | Two auxiliary arrays |
| Two Pointers |" O(n) "| O(1) | Optimal space |
| Monotonic Stack |" O(n) "| O(n) | Calculates layer by layer |

**Which to use?**
- **Interview:** Two Pointers (optimal) or DP (easier to explain)
- **Consistency:** Stack (if you're already in stack-based problems)
- **Understanding:** DP is most intuitive

---

## 🔄 Variations

| Variation | Difference | Problem |
|-----------|------------|---------|
| Container With Most Water | Only two walls matter | LC 11 |
| Trapping Rain Water II | 3D version | LC 407 |
| Pour Water | Simulate water falling | LC 755 |

---

## ⚠️ Common Mistakes

### 1. Forgetting Edge Cases

```python
# ❌ WRONG: No check for empty or single element
def trap(height):
    left, right = 0, len(height) - 1  # Error if empty!

# ✅ CORRECT: Handle edge cases
def trap(height):
    if len(height) < 3:  # Need at least 3 bars
        return 0
```

### 2. Wrong Condition for Two Pointers

```python
# ❌ WRONG: Using <= instead of <
while left <= right:  # May process same element twice

# ✅ CORRECT: Strict less than
while left < right:
```

### 3. Stack: Forgetting Left Wall Check

```python
# ❌ WRONG: Calculate water without left wall
while stack and height[i] > height[stack[-1]]:
    bottom = stack.pop()
    # No check if stack is empty!
    left = stack[-1]  # Error!

# ✅ CORRECT: Check for left wall
while stack and height[i] > height[stack[-1]]:
    bottom = stack.pop()
    if not stack:  # No left wall
        break
    left = stack[-1]
```

---

## 📝 Practice Problems (Progressive)

### Prerequisite
- [ ] [Container With Most Water](https://leetcode.com/problems/container-with-most-water/) - LC 11 (Two Pointers)

### This Problem
- [ ] [Trapping Rain Water](https://leetcode.com/problems/trapping-rain-water/) - LC 42 ⭐

### Advanced
- [ ] [Trapping Rain Water II](https://leetcode.com/problems/trapping-rain-water-ii/) - LC 407 (3D, BFS + Heap)

<details>
<summary><strong>🧠 Spaced Repetition Schedule</strong></summary>

**Day 1:** Implement DP approach (most intuitive)
**Day 3:** Implement Two Pointers approach
**Day 7:** Implement Stack approach
**Day 14:** Solve without notes, explain all three approaches
**Day 21:** Compare with Container With Most Water

</details>

---

## 🎤 Interview Context

<details>
<summary><strong>How to Communicate This in Interviews</strong></summary>

**Opening statement:**
> "Water at any position depends on the maximum heights to its left and right. The water level is the minimum of those two maxes."

**Approach selection:**
> "I'll use the two-pointer approach for O(1) space. The key insight is that we can process from the side with the smaller max, because that side's water is bounded by its own max."

**Alternative:**
> "I could also use DP with two arrays to precompute max heights, or a monotonic stack to calculate water in layers."

**Edge cases:**
- Empty array: return 0
- Less than 3 elements: can't trap water
- All same height: no water
- Monotonically increasing/decreasing: no water

</details>

**Company Focus:**

| Company | Frequency | Notes |
|---------|-----------|-------|
| Amazon | ⭐⭐⭐⭐⭐ | Extremely common |
| Google | ⭐⭐⭐⭐⭐ | Classic hard problem |
| Meta | ⭐⭐⭐⭐⭐ | Very common |
| Microsoft | ⭐⭐⭐⭐ | Classic interview |
| Goldman Sachs | ⭐⭐⭐⭐⭐ | Finance-themed |

---

## ⏱️ Time Estimates

| Activity | Time | Notes |
|----------|------|-------|
| Understand problem | 3-5 min | Visualize with drawing |
| DP approach | 10-15 min | Most straightforward |
| Two Pointers | 12-18 min | Needs careful logic |
| Stack approach | 15-20 min | Trickiest |
| Interview target | 20-30 min | One approach + explanation |

---

> **💡 Key Insight:** The two-pointer approach works because water at any position is bounded by the MINIMUM of the max heights on each side. If left_max < right_max, the water at the left position is fully determined by left_max (regardless of what's on the right). This lets us process from both ends, always moving the pointer on the side with smaller max.

---

## 🔗 Related

- [Monotonic Stack Concept](../3.1-Monotonic-Stack-Concept.md) - Stack approach
- [Largest Rectangle in Histogram](./01-Largest-Rectangle.md) - Similar boundary problem
- [Container With Most Water](https://leetcode.com/problems/container-with-most-water/) - Simpler two-pointer version
