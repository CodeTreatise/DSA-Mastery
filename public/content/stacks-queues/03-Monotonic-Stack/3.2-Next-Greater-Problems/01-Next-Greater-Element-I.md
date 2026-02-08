# 01 - Next Greater Element I (LC 496)

> **Grokking Pattern:** Monotonic Stack
>
> **Difficulty:** Easy | **Frequency:** ⭐⭐⭐⭐ Common warm-up problem

---

## Problem Statement

The **next greater element** of some element `x` in an array is the **first greater element** that is to the **right** of `x` in the same array.

You are given two **distinct** 0-indexed integer arrays `nums1` and `nums2`, where `nums1` is a subset of `nums2`.

For each `0 <= i < nums1.length`, find the index `j` such that `nums1[i] == nums2[j]` and determine the next greater element of `nums2[j]` in `nums2`. If there is no next greater element, the answer is `-1`.

```
Input: nums1 = [4,1,2], nums2 = [1,3,4,2]
Output: [-1,3,-1]

Explanation:
- For 4: In nums2, 4 is at index 2. No element to its right is greater. → -1
- For 1: In nums2, 1 is at index 0. Next greater element is 3. → 3
- For 2: In nums2, 2 is at index 3. No element to its right. → -1
```

[LeetCode 496 - Next Greater Element I](https://leetcode.com/problems/next-greater-element-i/)

---

## 🎯 Pattern Recognition

<details>
<summary><strong>How to Identify This Pattern</strong></summary>

**Look for these signals:**
- "Next greater element" in problem statement
- Need to find first element to the RIGHT that is GREATER
- O(n²) brute force is obvious (nested loops)

**This is the foundation problem for Monotonic Stack:**
- Learn the pattern here
- Apply to harder problems later (Daily Temperatures, Histogram)

**Two-part structure:**
1. Build next greater mapping for nums2
2. Look up answers for nums1

</details>

---

## ✅ When to Use This Approach

- Finding next greater element for multiple queries
- Building a mapping of "next greater" relationships
- When elements are distinct (easier hash map usage)

---

## ❌ When NOT to Use

| Situation | Why Not | Use Instead |
|-----------|---------|-------------|
| Finding k-th greater | Different problem | Heap |
| Previous greater | Modify pattern | Different answer timing |
| All greater elements | Too many results | Different approach |
| Need index, not value | Store indices | Modify implementation |

---

## 🔗 Concept Map

<details>
<summary><strong>Prerequisites & Next Steps</strong></summary>

**Before this, you should know:**
- [Stack Basics](../../01-Stack-Fundamentals/1.1-Stack-Basics.md)
- [Monotonic Stack Concept](../3.1-Monotonic-Stack-Concept.md)
- Hash Map basics

**After mastering this:**
- [Next Greater Element II](./02-Next-Greater-Element-II.md) - Circular array
- [Daily Temperatures](./03-Daily-Temperatures.md) - Same pattern, different output
- [Stock Span](./04-Stock-Span.md) - Previous greater variant

**Key insight:** This problem combines Monotonic Stack with Hash Map.

</details>

---

## 📐 How It Works

### Strategy

1. **Process nums2** with monotonic stack to find next greater for ALL elements
2. **Store results** in a hash map (element → next greater)
3. **Look up answers** for each element in nums1

### Visual Walkthrough

```
nums2 = [1, 3, 4, 2]

Process with decreasing stack (left to right):

i=0: element=1
     Stack: []
     Push 1
     Stack: [1]

i=1: element=3
     3 > 1 → pop 1, nextGreater[1] = 3
     Stack empty, push 3
     Stack: [3]

i=2: element=4
     4 > 3 → pop 3, nextGreater[3] = 4
     Stack empty, push 4
     Stack: [4]

i=3: element=2
     2 < 4 → don't pop
     Push 2
     Stack: [4, 2]

End: Elements in stack (4, 2) have no next greater
     nextGreater[4] = -1
     nextGreater[2] = -1

Hash Map Result:
{1: 3, 3: 4, 4: -1, 2: -1}

Now look up for nums1 = [4, 1, 2]:
- nums1[0] = 4 → nextGreater[4] = -1
- nums1[1] = 1 → nextGreater[1] = 3
- nums1[2] = 2 → nextGreater[2] = -1

Output: [-1, 3, -1]
```

---

## 💻 Code Implementation

### Solution: Monotonic Stack + Hash Map

**Python:**
```python
def next_greater_element(nums1: list[int], nums2: list[int]) -> list[int]:
    """
    Find next greater element for each element in nums1 based on nums2.
    
    Pattern: Monotonic Decreasing Stack + Hash Map
    Time: O(n + m) where n = len(nums1), m = len(nums2)
    Space: O(m) for hash map and stack
    
    Args:
        nums1: Query array (subset of nums2)
        nums2: Reference array to find next greater elements
        
    Returns:
        Array of next greater elements for each nums1[i]
    """
    # Step 1: Build next greater mapping for all elements in nums2
    next_greater = {}  # element → next greater element
    stack = []  # Decreasing stack (stores values, not indices)
    
    for num in nums2:
        # Pop elements smaller than current
        # Current is the "next greater" for those elements
        while stack and num > stack[-1]:
            smaller = stack.pop()
            next_greater[smaller] = num
        stack.append(num)
    
    # Elements remaining in stack have no next greater
    while stack:
        next_greater[stack.pop()] = -1
    
    # Step 2: Look up answers for nums1
    return [next_greater[num] for num in nums1]


def next_greater_element_optimized(nums1: list[int], nums2: list[int]) -> list[int]:
    """
    Optimized: Only store elements that are in nums1 in the hash map.
    """
    nums1_set = set(nums1)  # For O(1) lookup
    next_greater = {}
    stack = []
    
    for num in nums2:
        while stack and num > stack[-1]:
            smaller = stack.pop()
            # Only store if it's in nums1
            if smaller in nums1_set:
                next_greater[smaller] = num
        stack.append(num)
    
    # Default to -1 for elements not found
    return [next_greater.get(num, -1) for num in nums1]
```

**JavaScript:**
```javascript
/**
 * Find next greater element for each element in nums1.
 * Pattern: Monotonic Decreasing Stack + Hash Map
 * Time: O(n + m), Space: O(m)
 * 
 * @param {number[]} nums1 - Query array
 * @param {number[]} nums2 - Reference array
 * @return {number[]} - Next greater elements
 */
function nextGreaterElement(nums1, nums2) {
    // Build next greater mapping
    const nextGreater = new Map();
    const stack = [];
    
    for (const num of nums2) {
        while (stack.length > 0 && num > stack[stack.length - 1]) {
            const smaller = stack.pop();
            nextGreater.set(smaller, num);
        }
        stack.push(num);
    }
    
    // Remaining elements have no next greater
    while (stack.length > 0) {
        nextGreater.set(stack.pop(), -1);
    }
    
    // Look up answers
    return nums1.map(num => nextGreater.get(num));
}

// Alternative: Using object instead of Map
function nextGreaterElementSimple(nums1, nums2) {
    const map = {};
    const stack = [];
    
    for (const num of nums2) {
        while (stack.length && num > stack[stack.length - 1]) {
            map[stack.pop()] = num;
        }
        stack.push(num);
    }
    
    return nums1.map(num => map[num] ?? -1);
}
```

### Brute Force (For Comparison)

**Python:**
```python
def next_greater_brute_force(nums1: list[int], nums2: list[int]) -> list[int]:
    """
    Brute force: O(n * m) time
    For each element in nums1, find it in nums2 and search right.
    """
    result = []
    
    for num in nums1:
        # Find index in nums2
        idx = nums2.index(num)
        
        # Search for next greater to the right
        found = -1
        for j in range(idx + 1, len(nums2)):
            if nums2[j] > num:
                found = nums2[j]
                break
        
        result.append(found)
    
    return result
```

---

## ⚡ Complexity Analysis

| Approach | Time | Space | Notes |
|----------|------|-------|-------|
| Brute Force |" O(n * m) "| O(1) | Nested loops |
| Monotonic Stack |" O(n + m) "| O(m) | Each element pushed/popped once |

**Why O(n + m)?**
- O(m) to process nums2 with monotonic stack
- O(n) to look up answers for nums1
- Hash map provides O(1) lookup

**Space breakdown:**
- Stack: O(m) worst case (decreasing array)
- Hash Map: O(m) to store all mappings
- Total: O(m)

---

## 🔄 Variations

| Variation | Change | Example |
|-----------|--------|---------|
| Next Greater Element II | Circular array | LC 503 |
| Previous Greater Element | Answer on push | Stock Span |
| Next Smaller Element | Increasing stack | - |
| Return indices | Store indices in stack | Daily Temperatures |

---

## ⚠️ Common Mistakes

### 1. Forgetting Hash Map for Query Lookup

```python
# ❌ WRONG: Searching nums2 for each query
for num in nums1:
    idx = nums2.index(num)  # O(m) each time!
    # ...

# ✅ CORRECT: Pre-compute with hash map
next_greater = {}  # Build once
for num in nums2:
    # ... monotonic stack logic
return [next_greater[num] for num in nums1]  # O(1) lookup
```

### 2. Wrong Default for Missing Elements

```python
# ❌ WRONG: No default value
return [next_greater[num] for num in nums1]
# KeyError if num not in next_greater!

# ✅ CORRECT: Use .get() with default
return [next_greater.get(num, -1) for num in nums1]
```

### 3. Processing Wrong Array

```python
# ❌ WRONG: Processing nums1 instead of nums2
for num in nums1:  # Wrong!
    # ...

# ✅ CORRECT: Process nums2 to build mapping
for num in nums2:
    # ... monotonic stack logic
```

---

## 📝 Practice Problems (Progressive)

### This Problem
- [ ] [Next Greater Element I](https://leetcode.com/problems/next-greater-element-i/) - LC 496 ⭐

### Related Easy
- [ ] [Final Prices With Special Discount](https://leetcode.com/problems/final-prices-with-a-special-discount-in-a-shop/) - LC 1475

### Next Level (Medium)
- [ ] [Next Greater Element II](https://leetcode.com/problems/next-greater-element-ii/) - LC 503
- [ ] [Daily Temperatures](https://leetcode.com/problems/daily-temperatures/) - LC 739

<details>
<summary><strong>🧠 Spaced Repetition Schedule</strong></summary>

**Day 1:** Solve this problem, understand stack + hash map combo
**Day 3:** Re-implement without looking at solution
**Day 7:** Solve Next Greater Element II
**Day 14:** Compare with Daily Temperatures approach
**Day 21:** Explain the pattern to someone else

</details>

---

## 🎤 Interview Context

<details>
<summary><strong>How to Communicate This in Interviews</strong></summary>

**Opening statement:**
> "I see this is a 'next greater element' problem. I'll use a monotonic stack to pre-compute the next greater element for all elements in nums2, then use a hash map for O(1) lookup."

**Walk through the approach:**
> "I'll maintain a decreasing stack. When I encounter an element larger than the stack top, that element is the 'next greater' for everything I pop."

**Complexity explanation:**
> "Time is O(n + m) - O(m) to process nums2, O(n) for lookups. Space is O(m) for the stack and hash map."

**Edge cases to mention:**
- nums1 has only one element
- All elements in decreasing order (no next greater for any)
- All elements in increasing order (each has next greater)

</details>

**Company Focus:**

| Company | Frequency | Notes |
|---------|-----------|-------|
| Amazon | ⭐⭐⭐⭐ | Common warm-up |
| Meta | ⭐⭐⭐ | Building block for harder problems |
| Google | ⭐⭐⭐ | May ask variations |
| Microsoft | ⭐⭐⭐⭐ | Classic interview question |

---

## ⏱️ Time Estimates

| Activity | Time | Notes |
|----------|------|-------|
| Understand problem | 2-3 min | Read examples carefully |
| Identify pattern | 1-2 min | "Next greater" → Monotonic stack |
| Implement | 8-10 min | Stack + Hash Map |
| Test & debug | 3-5 min | Check edge cases |
| Interview target | 15-20 min | Including explanation |

---

> **💡 Key Insight:** This problem combines two patterns: Monotonic Stack for finding next greater elements efficiently, and Hash Map for answering multiple queries in O(1). This combination is powerful and reusable.

---

## 🔗 Related

- [Monotonic Stack Concept](../3.1-Monotonic-Stack-Concept.md) - Pattern overview
- [Next Greater Element II](./02-Next-Greater-Element-II.md) - Circular variant
- [Daily Temperatures](./03-Daily-Temperatures.md) - Index-based variant
- [Stock Span](./04-Stock-Span.md) - Previous greater variant
