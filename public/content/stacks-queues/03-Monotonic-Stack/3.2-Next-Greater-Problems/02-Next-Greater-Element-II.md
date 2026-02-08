# 02 - Next Greater Element II (LC 503)

> **Grokking Pattern:** Monotonic Stack (Circular Array)
>
> **Difficulty:** Medium | **Frequency:** ⭐⭐⭐⭐ Common follow-up

---

## Problem Statement

Given a **circular** integer array `nums`, return the **next greater number** for every element in `nums`.

The next greater number of a number `x` is the first greater number to its traversing-order next in the array, which means you could search **circularly** to find its next greater number.

```
Input: nums = [1, 2, 1]
Output: [2, -1, 2]

Explanation:
- nums[0] = 1: Next greater (going right, then wrapping) is 2
- nums[1] = 2: No greater element even after wrapping → -1
- nums[2] = 1: Wraps around, finds 2 at index 1 → 2
```

```
Input: nums = [1, 2, 3, 4, 3]
Output: [2, 3, 4, -1, 4]
```

[LeetCode 503 - Next Greater Element II](https://leetcode.com/problems/next-greater-element-ii/)

---

## 🎯 Pattern Recognition

<details>
<summary><strong>How to Identify This Pattern</strong></summary>

**Look for these signals:**
- "Circular array" in problem statement
- "Wrap around" to find the answer
- Same as Next Greater Element I, but circular

**The circular twist:**
- After reaching the end, continue from the beginning
- Simulate by processing the array twice
- Use modulo operator for index wrapping

**Key insight:** Process the array twice (2n elements) to handle wrap-around.

</details>

---

## ✅ When to Use This Approach

- Circular array problems
- When elements can "wrap around" to find answers
- Extension of linear monotonic stack problems

---

## ❌ When NOT to Use

| Situation | Why Not | Use Instead |
|-----------|---------|-------------|
| Linear array | Simpler approach | Next Greater Element I |
| Need actual wrapped index | Modify output | Track wrapped indices |
| Doubly circular | More complex | Different approach |

---

## 🔗 Concept Map

<details>
<summary><strong>Prerequisites & Next Steps</strong></summary>

**Before this, you should know:**
- [Next Greater Element I](./01-Next-Greater-Element-I.md) - Linear version
- [Monotonic Stack Concept](../3.1-Monotonic-Stack-Concept.md)
- Modulo operator for circular indexing

**After mastering this:**
- [Daily Temperatures](./03-Daily-Temperatures.md) - Different output format
- [Largest Rectangle in Histogram](../3.3-Histogram-Problems/01-Largest-Rectangle.md)

**The circular pattern is reusable for:**
- Circular buffer problems
- Josephus problem
- Circular scheduling

</details>

---

## 📐 How It Works

### Two Approaches for Circular Arrays

#### Approach 1: Double the Array (Conceptual)
```
Original: [1, 2, 1]
Doubled:  [1, 2, 1, 1, 2, 1]  (indices 0-5)

Process indices 0-5, but only store answers for 0-2.
```

#### Approach 2: Use Modulo (Memory Efficient)
```
Original: [1, 2, 1] (n=3)

Iterate i from 0 to 2n-1:
  actual_index = i % n

i=0: index=0, nums[0]=1
i=1: index=1, nums[1]=2
i=2: index=2, nums[2]=1
i=3: index=0, nums[0]=1  ← wraps around
i=4: index=1, nums[1]=2
i=5: index=2, nums[2]=1
```

### Visual Walkthrough

```
nums = [1, 2, 1], n=3, iterate 0 to 5

Stack stores INDICES (not values)

i=0: nums[0]=1
     Stack: []
     Push 0
     Stack: [0]

i=1: nums[1]=2
     2 > nums[0]=1 → pop 0, result[0]=2
     Stack empty, push 1
     Stack: [1]

i=2: nums[2]=1
     1 < nums[1]=2 → don't pop
     Push 2
     Stack: [1, 2]

--- Now we're in the "wrapped" portion (i >= n) ---

i=3: actual=0, nums[0]=1
     1 < nums[2]=1 → don't pop (not strictly greater)
     DON'T push (we already have answer for index 0)
     Stack: [1, 2]

i=4: actual=1, nums[1]=2
     2 > nums[2]=1 → pop 2, result[2]=2
     2 = nums[1]=2 → don't pop
     DON'T push (we already have answer for index 1)
     Stack: [1]

i=5: actual=2, nums[2]=1
     1 < nums[1]=2 → don't pop
     DON'T push
     Stack: [1]

End: result[1] stays -1 (no greater element)

Result: [2, -1, 2]
```

---

## 💻 Code Implementation

### Solution 1: Iterate Twice with Modulo (Recommended)

**Python:**
```python
def next_greater_elements(nums: list[int]) -> list[int]:
    """
    Find next greater element in circular array.
    
    Pattern: Monotonic Stack with circular iteration
    Time: O(n), Space: O(n)
    
    Key insight: Iterate 2n times, use modulo for actual index.
    Only push indices in first pass, pop in both passes.
    """
    n = len(nums)
    result = [-1] * n
    stack = []  # Store indices
    
    # Iterate 2n times to handle circular nature
    for i in range(2 * n):
        actual_idx = i % n
        
        # Pop elements smaller than current
        while stack and nums[actual_idx] > nums[stack[-1]]:
            idx = stack.pop()
            result[idx] = nums[actual_idx]
        
        # Only push in first pass (avoid duplicates)
        if i < n:
            stack.append(actual_idx)
    
    return result


def next_greater_elements_v2(nums: list[int]) -> list[int]:
    """
    Alternative: Process right to left, twice.
    """
    n = len(nums)
    result = [-1] * n
    stack = []  # Store values
    
    # Process twice: once to build stack, once to find answers
    for _ in range(2):
        for i in range(n - 1, -1, -1):
            while stack and stack[-1] <= nums[i]:
                stack.pop()
            
            if stack:
                result[i] = stack[-1]
            
            stack.append(nums[i])
    
    return result
```

**JavaScript:**
```javascript
/**
 * Find next greater element in circular array.
 * Pattern: Monotonic Stack with circular iteration
 * Time: O(n), Space: O(n)
 */
function nextGreaterElements(nums) {
    const n = nums.length;
    const result = new Array(n).fill(-1);
    const stack = []; // Store indices
    
    // Iterate 2n times
    for (let i = 0; i < 2 * n; i++) {
        const actualIdx = i % n;
        
        while (stack.length > 0 && nums[actualIdx] > nums[stack[stack.length - 1]]) {
            const idx = stack.pop();
            result[idx] = nums[actualIdx];
        }
        
        // Only push in first pass
        if (i < n) {
            stack.push(actualIdx);
        }
    }
    
    return result;
}

// Alternative: Right to left, twice
function nextGreaterElementsV2(nums) {
    const n = nums.length;
    const result = new Array(n).fill(-1);
    const stack = [];
    
    for (let round = 0; round < 2; round++) {
        for (let i = n - 1; i >= 0; i--) {
            while (stack.length && stack[stack.length - 1] <= nums[i]) {
                stack.pop();
            }
            if (stack.length) {
                result[i] = stack[stack.length - 1];
            }
            stack.push(nums[i]);
        }
    }
    
    return result;
}
```

### Solution 2: Actually Double the Array (Less Efficient but Clear)

**Python:**
```python
def next_greater_elements_doubled(nums: list[int]) -> list[int]:
    """
    Conceptually double the array.
    Time: O(n), Space: O(n) - but uses more space for doubled array
    """
    n = len(nums)
    doubled = nums + nums  # Actually create doubled array
    result = [-1] * n
    stack = []
    
    for i in range(len(doubled)):
        while stack and doubled[i] > doubled[stack[-1]]:
            idx = stack.pop()
            if idx < n:  # Only record for original indices
                result[idx] = doubled[i]
        
        if i < n:  # Only push original indices
            stack.append(i)
    
    return result
```

---

## ⚡ Complexity Analysis

| Approach | Time | Space | Notes |
|----------|------|-------|-------|
| Modulo iteration |" O(n) "| O(n) | 2n iterations, but each element processed 2x max |
| Doubled array |" O(n) "| O(n) | Extra array creation |

**Why still O(n)?**
- We iterate 2n times
- But each element is pushed at most once (in first n iterations)
- Each element is popped at most once
- Total: 2n + n + n = O(n)

---

## 🔄 Variations

| Variation | Description | Example |
|-----------|-------------|---------|
| Circular next smaller | Use increasing stack | - |
| Find the index, not value | Return indices | - |
| K-circular | Wrap k times | - |

---

## ⚠️ Common Mistakes

### 1. Pushing Indices in Both Passes

```python
# ❌ WRONG: Pushing in second pass creates duplicates
for i in range(2 * n):
    actual_idx = i % n
    # ... pop logic ...
    stack.append(actual_idx)  # Wrong! Pushed twice

# ✅ CORRECT: Only push in first pass
for i in range(2 * n):
    actual_idx = i % n
    # ... pop logic ...
    if i < n:  # Only first pass
        stack.append(actual_idx)
```

### 2. Forgetting to Use Actual Index for Comparison

```python
# ❌ WRONG: Using i instead of nums[i % n]
while stack and i > nums[stack[-1]]:  # Wrong!
    ...

# ✅ CORRECT: Use the actual value
while stack and nums[i % n] > nums[stack[-1]]:
    ...
```

### 3. Recording Answer for Wrong Index

```python
# ❌ WRONG: Using actual_idx for result
result[actual_idx] = nums[actual_idx]  # Wrong!

# ✅ CORRECT: Pop index is where answer goes
idx = stack.pop()
result[idx] = nums[actual_idx]
```

---

## 📝 Practice Problems (Progressive)

### Prerequisites
- [ ] [Next Greater Element I](https://leetcode.com/problems/next-greater-element-i/) - LC 496

### This Problem
- [ ] [Next Greater Element II](https://leetcode.com/problems/next-greater-element-ii/) - LC 503 ⭐

### Related Circular Problems
- [ ] [Circular Array Loop](https://leetcode.com/problems/circular-array-loop/) - LC 457
- [ ] [Next Greater Node in Linked List](https://leetcode.com/problems/next-greater-node-in-linked-list/) - LC 1019

<details>
<summary><strong>🧠 Spaced Repetition Schedule</strong></summary>

**Day 1:** Solve with modulo approach
**Day 3:** Solve with right-to-left approach
**Day 7:** Explain why 2n iterations are needed
**Day 14:** Apply circular pattern to a different problem

</details>

---

## 🎤 Interview Context

<details>
<summary><strong>How to Communicate This in Interviews</strong></summary>

**Opening statement:**
> "This is a circular variant of next greater element. I'll use a monotonic stack but iterate 2n times to handle the wrap-around."

**Explain the circular handling:**
> "Instead of actually doubling the array, I'll use modulo to get the actual index. I only push indices in the first pass to avoid duplicates."

**Complexity explanation:**
> "Time is still O(n) because each element is pushed once and popped at most once. The 2n iterations don't change the asymptotic complexity."

**Edge cases:**
- All elements equal (all -1)
- Single element ([-1])
- Strictly increasing → each element's next greater is the next one (with wrap)
- Strictly decreasing → only largest has no answer

</details>

**Company Focus:**

| Company | Frequency | Notes |
|---------|-----------|-------|
| Amazon | ⭐⭐⭐⭐ | Common follow-up to NGE I |
| Meta | ⭐⭐⭐ | Tests understanding of circular arrays |
| Google | ⭐⭐⭐ | May combine with other patterns |

---

## ⏱️ Time Estimates

| Activity | Time | Notes |
|----------|------|-------|
| Understand problem | 2-3 min | Focus on circular aspect |
| Identify circular handling | 2-3 min | Modulo vs doubling |
| Implement | 8-12 min | Careful with index handling |
| Test & debug | 3-5 min | Test wrap-around cases |
| Interview target | 15-20 min | Including explanation |

---

> **💡 Key Insight:** Circular array problems can often be solved by "doubling" the iteration. Instead of creating a new array, use `i % n` to simulate the circular access. This pattern applies to many circular problems beyond just monotonic stack.

---

## 🔗 Related

- [Next Greater Element I](./01-Next-Greater-Element-I.md) - Linear version
- [Monotonic Stack Concept](../3.1-Monotonic-Stack-Concept.md) - Pattern overview
- [Daily Temperatures](./03-Daily-Temperatures.md) - Different output format
