# 01 - Largest Rectangle in Histogram (LC 84)

> **Grokking Pattern:** Monotonic Stack (Advanced)
>
> **Difficulty:** Hard | **Frequency:** ⭐⭐⭐⭐⭐ Classic Interview Problem

---

## Problem Statement

Given an array of integers `heights` representing the histogram's bar heights where the width of each bar is `1`, return the **area of the largest rectangle** in the histogram.

```
Input: heights = [2, 1, 5, 6, 2, 3]
Output: 10

Visualization:
        ┌───┐
      ┌─┤   │
      │ │   │ ┌───┐
      │ │   │ │   │
  ┌───┤ │   │ │   │
  │   │ │   │ │   │
──┴───┴─┴───┴─┴───┴──
   2  1  5  6  2  3

Largest rectangle: width=2 (bars 5 and 6), height=5 → area=10
```

```
Input: heights = [2, 4]
Output: 4
```

[LeetCode 84 - Largest Rectangle in Histogram](https://leetcode.com/problems/largest-rectangle-in-histogram/)

---

## 🎯 Pattern Recognition

<details>
<summary><strong>How to Identify This Pattern</strong></summary>

**Look for these signals:**
- Finding maximum area/span based on heights
- Need to find "how far left/right can this bar extend?"
- Each bar's rectangle is limited by the first smaller bar on each side

**Key insight:**
For each bar, we need:
- **Left boundary:** First bar to the left that is shorter (Previous Smaller Element)
- **Right boundary:** First bar to the right that is shorter (Next Smaller Element)
- **Width:** right_boundary - left_boundary - 1
- **Area:** height * width

**This is a "double monotonic stack" problem:**
1. Find previous smaller element for each bar
2. Find next smaller element for each bar
3. Or: Do it in one pass with a clever approach

</details>

---

## ✅ When to Use This Approach

- Rectangle area maximization problems
- When boundaries are defined by "first smaller" elements
- Skyline or histogram-type visualizations

---

## ❌ When NOT to Use

| Situation | Why Not | Use Instead |
|-----------|---------|-------------|
| Matrix version directly | Need preprocessing | Row-by-row histogram |
| Largest square | Different constraint | DP approach |
| Variable bar widths | Different formula | Modify accordingly |

---

## 🔗 Concept Map

<details>
<summary><strong>Prerequisites & Next Steps</strong></summary>

**Before this, you should know:**
- [Monotonic Stack Concept](../3.1-Monotonic-Stack-Concept.md)
- [Next Smaller Element](../3.1-Monotonic-Stack-Concept.md#next-smaller-element)
- Previous Smaller Element

**After mastering this:**
- [Maximal Rectangle](https://leetcode.com/problems/maximal-rectangle/) - LC 85 (2D version)
- [Trapping Rain Water](./02-Trapping-Rain-Water.md) - Similar structure

**This problem combines:**
- Previous Smaller Element (left boundary)
- Next Smaller Element (right boundary)

</details>

---

## 📐 How It Works

### Core Insight

For each bar at index `i` with height `h`:
- The rectangle using this bar as the **shortest bar** extends from:
  - Left: First bar shorter than `h` + 1
  - Right: First bar shorter than `h` - 1

```
heights = [2, 1, 5, 6, 2, 3]
          [0][1][2][3][4][5]

For bar at index 2 (height=5):
- Previous smaller: index 1 (height=1)
- Next smaller: index 4 (height=2)
- Width: 4 - 1 - 1 = 2 (indices 2 and 3)
- Area: 5 * 2 = 10

For bar at index 3 (height=6):
- Previous smaller: index 2 (height=5)
- Next smaller: index 4 (height=2)
- Width: 4 - 2 - 1 = 1
- Area: 6 * 1 = 6
```

### Approach 1: Two Pass (Left and Right Arrays)

```
Step 1: Find left boundaries (previous smaller index)
heights:     [2, 1, 5, 6, 2, 3]
left:        [-1,-1, 1, 2, 1, 4]

Step 2: Find right boundaries (next smaller index)
heights:     [2, 1, 5, 6, 2, 3]
right:       [1, 6, 4, 4, 6, 6]   (6 = n, meaning "no smaller to right")

Step 3: Calculate areas
For each i:
  width = right[i] - left[i] - 1
  area = heights[i] * width

i=0: width = 1-(-1)-1 = 1, area = 2*1 = 2
i=1: width = 6-(-1)-1 = 6, area = 1*6 = 6
i=2: width = 4-1-1 = 2, area = 5*2 = 10  ← Maximum!
i=3: width = 4-2-1 = 1, area = 6*1 = 6
i=4: width = 6-1-1 = 4, area = 2*4 = 8
i=5: width = 6-4-1 = 1, area = 3*1 = 3

Maximum: 10
```

### Approach 2: Single Pass (Pop and Calculate)

Use an increasing stack. When we pop, we calculate the rectangle with the popped bar as the shortest.

```
heights = [2, 1, 5, 6, 2, 3]
Add sentinel: [2, 1, 5, 6, 2, 3, 0]  ← 0 ensures all bars get popped

Stack: [] (stores indices)
max_area = 0

i=0: height=2
     Stack empty, push 0
     Stack: [0]

i=1: height=1
     1 < heights[0]=2, pop 0
     Popped index=0, height=2
     Width: Stack empty → width = i = 1
     Area = 2 * 1 = 2
     max_area = 2
     Push 1
     Stack: [1]

i=2: height=5
     5 > heights[1]=1, push 2
     Stack: [1, 2]

i=3: height=6
     6 > heights[2]=5, push 3
     Stack: [1, 2, 3]

i=4: height=2
     2 < heights[3]=6, pop 3
     Popped height=6, width = 4-2-1 = 1, area = 6
     2 < heights[2]=5, pop 2
     Popped height=5, width = 4-1-1 = 2, area = 10
     max_area = 10
     Push 4
     Stack: [1, 4]

i=5: height=3
     3 > heights[4]=2, push 5
     Stack: [1, 4, 5]

i=6: height=0 (sentinel)
     Pop all:
     Pop 5: height=3, width = 6-4-1 = 1, area = 3
     Pop 4: height=2, width = 6-1-1 = 4, area = 8
     Pop 1: height=1, width = 6 (stack empty), area = 6

Final max_area = 10
```

---

## 💻 Code Implementation

### Solution 1: Two Pass with Left/Right Arrays

**Python:**
```python
def largest_rectangle_area_two_pass(heights: list[int]) -> int:
    """
    Find largest rectangle using two passes.
    
    Pass 1: Find previous smaller element (left boundary)
    Pass 2: Find next smaller element (right boundary)
    
    Time: O(n), Space: O(n)
    """
    n = len(heights)
    if n == 0:
        return 0
    
    # left[i] = index of previous smaller element (-1 if none)
    left = [-1] * n
    stack = []
    for i in range(n):
        while stack and heights[stack[-1]] >= heights[i]:
            stack.pop()
        if stack:
            left[i] = stack[-1]
        stack.append(i)
    
    # right[i] = index of next smaller element (n if none)
    right = [n] * n
    stack = []
    for i in range(n - 1, -1, -1):
        while stack and heights[stack[-1]] >= heights[i]:
            stack.pop()
        if stack:
            right[i] = stack[-1]
        stack.append(i)
    
    # Calculate max area
    max_area = 0
    for i in range(n):
        width = right[i] - left[i] - 1
        area = heights[i] * width
        max_area = max(max_area, area)
    
    return max_area
```

### Solution 2: Single Pass with Stack (Recommended)

**Python:**
```python
def largest_rectangle_area(heights: list[int]) -> int:
    """
    Find largest rectangle in single pass.
    
    Pattern: Monotonic Increasing Stack
    When popping, the current index is the right boundary.
    The new stack top is the left boundary.
    
    Time: O(n), Space: O(n)
    """
    stack = []  # Store indices
    max_area = 0
    
    # Process each bar plus a sentinel (height 0) at the end
    for i in range(len(heights) + 1):
        # Current height (0 for sentinel to pop everything)
        current_height = heights[i] if i < len(heights) else 0
        
        # Pop bars taller than current
        while stack and current_height < heights[stack[-1]]:
            # Popped bar's height defines the rectangle height
            h = heights[stack.pop()]
            
            # Width calculation:
            # Right boundary: current index i
            # Left boundary: new stack top (or -1 if empty)
            if stack:
                width = i - stack[-1] - 1
            else:
                width = i
            
            area = h * width
            max_area = max(max_area, area)
        
        stack.append(i)
    
    return max_area
```

**JavaScript:**
```javascript
/**
 * Find largest rectangle in histogram.
 * Pattern: Monotonic Increasing Stack
 * Time: O(n), Space: O(n)
 */
function largestRectangleArea(heights) {
    const stack = [];
    let maxArea = 0;
    
    // Add sentinel at end
    for (let i = 0; i <= heights.length; i++) {
        const currentHeight = i < heights.length ? heights[i] : 0;
        
        while (stack.length > 0 && currentHeight < heights[stack[stack.length - 1]]) {
            const h = heights[stack.pop()];
            const width = stack.length > 0 ? i - stack[stack.length - 1] - 1 : i;
            maxArea = Math.max(maxArea, h * width);
        }
        
        stack.push(i);
    }
    
    return maxArea;
}

// Two-pass version
function largestRectangleAreaTwoPass(heights) {
    const n = heights.length;
    if (n === 0) return 0;
    
    // Previous smaller
    const left = new Array(n).fill(-1);
    let stack = [];
    for (let i = 0; i < n; i++) {
        while (stack.length && heights[stack[stack.length - 1]] >= heights[i]) {
            stack.pop();
        }
        if (stack.length) left[i] = stack[stack.length - 1];
        stack.push(i);
    }
    
    // Next smaller
    const right = new Array(n).fill(n);
    stack = [];
    for (let i = n - 1; i >= 0; i--) {
        while (stack.length && heights[stack[stack.length - 1]] >= heights[i]) {
            stack.pop();
        }
        if (stack.length) right[i] = stack[stack.length - 1];
        stack.push(i);
    }
    
    // Calculate max
    let maxArea = 0;
    for (let i = 0; i < n; i++) {
        maxArea = Math.max(maxArea, heights[i] * (right[i] - left[i] - 1));
    }
    return maxArea;
}
```

---

## ⚡ Complexity Analysis

| Approach | Time | Space | Notes |
|----------|------|-------|-------|
| Brute Force |" O(n²) "| O(1) | Try all pairs |
| Two Pass |" O(n) "| O(n) | Three iterations |
| Single Pass |" O(n) "| O(n) | One iteration |

**Why O(n)?**
- Each bar is pushed onto stack once
- Each bar is popped from stack at most once
- Total: 2n operations

---

## 🔄 Variations

| Variation | Description | Problem |
|-----------|-------------|---------|
| Maximal Rectangle | 2D matrix version | LC 85 |
| Trapping Rain Water | Similar structure | LC 42 |
| Container With Most Water | Different constraint | LC 11 |

---

## ⚠️ Common Mistakes

### 1. Forgetting the Sentinel

```python
# ❌ WRONG: Some bars may never get processed
for i in range(len(heights)):
    # ... stack logic

# ✅ CORRECT: Add sentinel to force final pops
for i in range(len(heights) + 1):
    current_height = heights[i] if i < len(heights) else 0
```

### 2. Wrong Width Calculation

```python
# ❌ WRONG: Using popped index for left boundary
width = i - popped_idx

# ✅ CORRECT: Using new stack top for left boundary
if stack:
    width = i - stack[-1] - 1
else:
    width = i
```

### 3. Using Wrong Comparison for Stack Type

```python
# ❌ WRONG: Decreasing stack for this problem
while stack and current > heights[stack[-1]]:  # Wrong direction

# ✅ CORRECT: Increasing stack (pop when current is smaller)
while stack and current < heights[stack[-1]]:
```

---

## 📝 Practice Problems (Progressive)

### This Problem
- [ ] [Largest Rectangle in Histogram](https://leetcode.com/problems/largest-rectangle-in-histogram/) - LC 84 ⭐

### Prerequisite
- [ ] [Daily Temperatures](https://leetcode.com/problems/daily-temperatures/) - LC 739

### Next Level
- [ ] [Maximal Rectangle](https://leetcode.com/problems/maximal-rectangle/) - LC 85
- [ ] [Trapping Rain Water](https://leetcode.com/problems/trapping-rain-water/) - LC 42

<details>
<summary><strong>🧠 Spaced Repetition Schedule</strong></summary>

**Day 1:** Understand both approaches, implement two-pass
**Day 3:** Implement single-pass from scratch
**Day 7:** Solve without looking at notes
**Day 14:** Solve Maximal Rectangle (uses this as subroutine)
**Day 21:** Explain why we need both boundaries

</details>

---

## 🎤 Interview Context

<details>
<summary><strong>How to Communicate This in Interviews</strong></summary>

**Opening statement:**
> "For each bar, I need to find how far it can extend left and right. This means finding the previous smaller and next smaller elements."

**Approach options:**
> "I can do this in two passes - one for left boundaries, one for right boundaries. Or I can use a single-pass approach where I calculate the area when popping from the stack."

**Single-pass explanation:**
> "I maintain an increasing stack. When I pop a bar, the current index is the right boundary, and the new stack top is the left boundary. This gives me the width for that bar's rectangle."

**Complexity:**
> "Time is O(n) because each bar is pushed and popped exactly once. Space is O(n) for the stack."

</details>

**Company Focus:**

| Company | Frequency | Notes |
|---------|-----------|-------|
| Amazon | ⭐⭐⭐⭐⭐ | Very common |
| Google | ⭐⭐⭐⭐⭐ | Classic hard problem |
| Meta | ⭐⭐⭐⭐ | Tests advanced monotonic stack |
| Microsoft | ⭐⭐⭐⭐ | May ask variations |

---

## ⏱️ Time Estimates

| Activity | Time | Notes |
|----------|------|-------|
| Understand problem | 3-5 min | Draw the histogram |
| Identify pattern | 3-5 min | Recognize left/right boundaries |
| Implement two-pass | 12-15 min | More straightforward |
| Implement single-pass | 15-20 min | Trickier width calculation |
| Interview target | 25-35 min | Expect discussion |

---

> **💡 Key Insight:** The power of this problem lies in recognizing that each bar's maximum rectangle is bounded by the first smaller bars on each side. Once you see this, it becomes a "previous smaller + next smaller element" problem - classic monotonic stack territory.

---

## 🔗 Related

- [Monotonic Stack Concept](../3.1-Monotonic-Stack-Concept.md) - Pattern overview
- [Trapping Rain Water](./02-Trapping-Rain-Water.md) - Similar structure
- [Maximal Rectangle](https://leetcode.com/problems/maximal-rectangle/) - 2D version (LC 85)
