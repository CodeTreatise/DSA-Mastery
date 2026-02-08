# Assign Cookies (LeetCode 455)

> **Pattern:** Sorting + Two Pointers Greedy
> **Difficulty:** Easy
> **Company Focus:** Amazon, Google, Microsoft (warm-up problem)

---

## 📋 Problem Statement

Assume you are an awesome parent and want to give your children some cookies. Each child `i` has a greed factor `g[i]`, which is the minimum size of a cookie that the child will be content with.

Each cookie `j` has a size `s[j]`. If `s[j] >= g[i]`, we can assign cookie `j` to child `i`, and the child will be content.

Your goal is to **maximize the number of content children**.

### Examples

```
Input: g = [1,2,3], s = [1,1]
Output: 1
Explanation: Only one child can be satisfied (greed=1 with cookie=1)

Input: g = [1,2], s = [1,2,3]  
Output: 2
Explanation: All children can be satisfied

Input: g = [10,9,8,7], s = [5,6,7,8]
Output: 2
Explanation: Only children with greed 7,8 can be satisfied
```

### Constraints

- `1 <= g.length <= 3 * 10^4`
- `0 <= s.length <= 3 * 10^4`
- `1 <= g[i], s[j] <= 2^31 - 1`

---

## 🎯 Pattern Recognition

**Signals that indicate this pattern:**
- "Maximize number of" → optimization
- Matching problem (children to cookies)
- Each item used at most once
- Simple satisfaction condition (≥)

**This is a classic greedy matching problem.**

---

## 🧠 Intuition

Why greedy works here:

1. **Don't waste big cookies on small greed:** A size-10 cookie can satisfy any child with greed ≤ 10. Using it on greed-1 wastes its potential.

2. **Smallest first matching:** Match the smallest greed with the smallest sufficient cookie.

3. **No regret:** If we satisfy child with greed `g[i]` using cookie `s[j]`, we don't lose any options for larger-greed children.

---

## 💻 Solution

### Approach: Sort Both + Two Pointers

```python
def findContentChildren(g: list[int], s: list[int]) -> int:
    """
    LeetCode 455: Assign Cookies
    
    Greedy: Match smallest greed with smallest sufficient cookie.
    
    Time: O(n log n + m log m) for sorting
    Space: O(1) excluding sort space
    """
    g.sort()  # Sort greed factors (ascending)
    s.sort()  # Sort cookie sizes (ascending)
    
    child = 0  # Pointer to current child
    cookie = 0  # Pointer to current cookie
    
    while child < len(g) and cookie < len(s):
        if s[cookie] >= g[child]:
            # Cookie can satisfy this child
            child += 1  # Move to next child
        # Always move to next cookie (used or too small)
        cookie += 1
    
    return child  # Number of satisfied children
```

```javascript
function findContentChildren(g, s) {
    g.sort((a, b) => a - b);
    s.sort((a, b) => a - b);
    
    let child = 0, cookie = 0;
    
    while (child < g.length && cookie < s.length) {
        if (s[cookie] >= g[child]) {
            child++;
        }
        cookie++;
    }
    
    return child;
}
```

---

## 📐 Step-by-Step Trace

```
g = [1, 2, 3], s = [1, 2, 3]
After sorting: Same

Step 1: child=0 (greed=1), cookie=0 (size=1)
        1 >= 1 ✓ → child=1, cookie=1

Step 2: child=1 (greed=2), cookie=1 (size=2)
        2 >= 2 ✓ → child=2, cookie=2

Step 3: child=2 (greed=3), cookie=2 (size=3)
        3 >= 3 ✓ → child=3, cookie=3

Exit: cookie=3 >= len(s)
Answer: child = 3
```

---

## ⚡ Complexity Analysis

| Metric | Value | Explanation |
|--------|-------|-------------|
| Time | O(n log n + m log m) | Sorting both arrays |
| Space | O(1) | Only pointers (in-place sort) |

Where n = len(g), m = len(s)

---

## 🔄 Alternative Approach: Largest First

You can also match from the largest:

```python
def findContentChildren_largest(g: list[int], s: list[int]) -> int:
    """Alternative: Match largest greed with largest cookie."""
    g.sort(reverse=True)
    s.sort(reverse=True)
    
    child = 0
    cookie = 0
    
    while child < len(g) and cookie < len(s):
        if s[cookie] >= g[child]:
            # Cookie can satisfy this child
            child += 1
            cookie += 1
        else:
            # Cookie too small, try smaller greed child
            child += 1
    
    return child
```

Both approaches give optimal results, but smallest-first is more intuitive.

---

## ⚠️ Common Mistakes

### 1. Not Sorting

```python
# ❌ Wrong: Without sorting
def wrong(g, s):
    count = 0
    for greed in g:
        for size in s:
            if size >= greed:
                count += 1
                break  # Cookie reused!
    return count

# ✅ Correct: Sort and match
```

### 2. Using Cookie Multiple Times

```python
# ❌ Wrong: Cookie used multiple times
for i in range(len(g)):
    for j in range(len(s)):  # Same cookie checked again
        if s[j] >= g[i]:
            count += 1

# ✅ Correct: Use two pointers, each cookie checked once
```

### 3. Wrong Pointer Movement

```python
# ❌ Wrong: Only move cookie when match
if s[cookie] >= g[child]:
    child += 1
    cookie += 1
# Missing: else cookie += 1

# ✅ Correct: Always move cookie
if s[cookie] >= g[child]:
    child += 1
cookie += 1  # Always move
```

---

## 🔗 Related Problems

| Problem | Difference | Link |
|---------|------------|------|
| Boats to Save People | Two people per boat | [LC 881](https://leetcode.com/problems/boats-to-save-people/) |
| Two City Scheduling | Cost optimization | [LC 1029](https://leetcode.com/problems/two-city-scheduling/) |
| Candy | Bidirectional constraint | [LC 135](https://leetcode.com/problems/candy/) |

---

## 🎤 Interview Tips

<details>
<summary><strong>How to Communicate in Interview</strong></summary>

**Opening (30 sec):**
"This is a matching problem - assign cookies to children. Since each cookie can only be used once, and we want to maximize satisfied children, I'll use a greedy approach."

**Explain greedy choice (30 sec):**
"I'll sort both arrays and match smallest greed with smallest sufficient cookie. This way we don't waste big cookies on small needs."

**Code (3 min):**
Talk through two-pointer approach.

**Verify (1 min):**
Walk through example showing both pointers moving.

</details>

---

## ⏱️ Time Estimates

| Activity | Time |
|----------|------|
| Understand problem | 1-2 min |
| Identify greedy | 1 min |
| Code solution | 3-5 min |
| Test + edge cases | 2 min |
| **Total** | **7-10 min** |

---

> **💡 Key Insight:** In matching problems, sorting enables greedy. Match smallest available to smallest need to maximize total matches.

> **🔗 Related:** [Classic Greedy Overview](../7.1-Classic-Problems-Overview.md)
