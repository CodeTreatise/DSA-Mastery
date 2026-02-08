# Candy (LeetCode 135)

> **Pattern:** Two-Pass Greedy
> **Difficulty:** Hard
> **Company Focus:** Amazon, Google, Meta (common hard greedy)

---

## 📋 Problem Statement

There are `n` children standing in a line. Each child is assigned a rating value given in the integer array `ratings`.

You are giving candies to these children subjected to the following requirements:
1. Each child must have **at least one candy**
2. Children with a **higher rating** get **more candies** than their neighbors

Return the **minimum** number of candies you need to distribute.

### Examples

```
Input: ratings = [1,0,2]
Output: 5
Explanation: [2,1,2] - middle child has lowest rating

Input: ratings = [1,2,2]
Output: 4
Explanation: [1,2,1] - last two have same rating, no constraint

Input: ratings = [1,2,3,4,5]
Output: 15
Explanation: [1,2,3,4,5] - strictly increasing
```

### Constraints

- `n == ratings.length`
- `1 <= n <= 2 * 10^4`
- `0 <= ratings[i] <= 2 * 10^4`

---

## 🎯 Pattern Recognition

**Signals that indicate two-pass greedy:**
- Constraints involving BOTH directions (left AND right neighbors)
- "More than neighbors" → bidirectional comparison
- Minimize total → greedy, but need to satisfy both sides

**Key insight:** Can't solve in one pass because we need info from both directions.

---

## 🧠 Intuition

### Why One Pass Fails

```
ratings = [1, 2, 3, 1]

Left to right only:
candies = [1, 2, 3, 1]  ✓ (each > left if rated higher)

But wait! ratings[2]=3 > ratings[3]=1, so candies[2] > candies[3]
Already satisfied! Lucky case.

ratings = [3, 2, 1]
Left to right: [1, 1, 1]  ❌ (3 > 2, should get more)

We need RIGHT-to-LEFT pass too!
```

### Two-Pass Strategy

1. **Left → Right:** Ensure each child has more than left neighbor (if rated higher)
2. **Right → Left:** Ensure each child has more than right neighbor (if rated higher), but keep the MAX (don't reduce)

---

## 💻 Solution

### Approach: Two-Pass O(n) Space

```python
def candy(ratings: list[int]) -> int:
    """
    LeetCode 135: Candy Distribution
    
    Two-pass greedy:
    1. L→R: Handle left neighbors
    2. R→L: Handle right neighbors (take max)
    
    Time: O(n), Space: O(n)
    """
    n = len(ratings)
    candies = [1] * n  # Everyone gets at least 1
    
    # Pass 1: Left to Right
    # If I'm rated higher than my left neighbor, I get more candy
    for i in range(1, n):
        if ratings[i] > ratings[i - 1]:
            candies[i] = candies[i - 1] + 1
    
    # Pass 2: Right to Left
    # If I'm rated higher than my right neighbor, I need more than them
    # But don't reduce! Take max of current and needed
    for i in range(n - 2, -1, -1):
        if ratings[i] > ratings[i + 1]:
            candies[i] = max(candies[i], candies[i + 1] + 1)
    
    return sum(candies)
```

```javascript
function candy(ratings) {
    const n = ratings.length;
    const candies = new Array(n).fill(1);
    
    // Left to right
    for (let i = 1; i < n; i++) {
        if (ratings[i] > ratings[i - 1]) {
            candies[i] = candies[i - 1] + 1;
        }
    }
    
    // Right to left
    for (let i = n - 2; i >= 0; i--) {
        if (ratings[i] > ratings[i + 1]) {
            candies[i] = Math.max(candies[i], candies[i + 1] + 1);
        }
    }
    
    return candies.reduce((a, b) => a + b, 0);
}
```

---

## 📐 Step-by-Step Trace

```
ratings = [1, 2, 87, 87, 87, 2, 1]

Initial:  [1, 1, 1, 1, 1, 1, 1]

=== Pass 1: Left → Right ===
i=1: ratings[1]=2 > ratings[0]=1 → candies[1] = 1+1 = 2
i=2: ratings[2]=87 > ratings[1]=2 → candies[2] = 2+1 = 3
i=3: ratings[3]=87 = ratings[2]=87 → no change
i=4: ratings[4]=87 = ratings[3]=87 → no change
i=5: ratings[5]=2 < ratings[4]=87 → no change
i=6: ratings[6]=1 < ratings[5]=2 → no change

After L→R: [1, 2, 3, 1, 1, 1, 1]

=== Pass 2: Right → Left ===
i=5: ratings[5]=2 > ratings[6]=1 → candies[5] = max(1, 1+1) = 2
i=4: ratings[4]=87 > ratings[5]=2 → candies[4] = max(1, 2+1) = 3
i=3: ratings[3]=87 = ratings[4]=87 → no change
i=2: ratings[2]=87 = ratings[3]=87 → no change (already 3)
i=1: ratings[1]=2 < ratings[2]=87 → no change
i=0: ratings[0]=1 < ratings[1]=2 → no change

After R→L: [1, 2, 3, 1, 3, 2, 1]

Answer: 1+2+3+1+3+2+1 = 13
```

---

## 🔄 Alternative: O(1) Space (Advanced)

For interviews, the O(n) solution is preferred. But O(1) exists:

```python
def candy_optimized(ratings: list[int]) -> int:
    """
    O(1) space solution using up/down slopes.
    More complex to implement and explain.
    """
    n = len(ratings)
    if n <= 1:
        return n
    
    candies = 0
    up = down = peak = 0
    
    for i in range(1, n):
        if ratings[i] > ratings[i - 1]:
            up += 1
            down = 0
            peak = up
            candies += 1 + up
        elif ratings[i] < ratings[i - 1]:
            up = 0
            down += 1
            candies += 1 + down
            if down > peak:
                candies += 1  # Extend peak
        else:
            up = down = peak = 0
            candies += 1
    
    return candies + 1  # +1 for first child
```

**Recommendation:** Stick with two-pass O(n) in interviews—clearer logic.

---

## ⚡ Complexity Analysis

| Solution | Time | Space |
|----------|------|-------|
| Two-Pass | O(n) | O(n) |
| Optimized | O(n) | O(1) |

---

## ⚠️ Common Mistakes

### 1. Using Min Instead of Max in Pass 2

```python
# ❌ Wrong: This can reduce candies
candies[i] = candies[i + 1] + 1  # Ignores what Pass 1 set

# ✅ Correct: Keep the maximum
candies[i] = max(candies[i], candies[i + 1] + 1)
```

### 2. Equal Ratings Edge Case

```python
# ❌ Wrong: Treating equal as "greater"
if ratings[i] >= ratings[i - 1]:  # Wrong operator!
    candies[i] = candies[i - 1] + 1

# ✅ Correct: Only strictly greater requires more
if ratings[i] > ratings[i - 1]:
    candies[i] = candies[i - 1] + 1
```

### 3. Forgetting Initial Value

```python
# ❌ Wrong: Not initializing to 1
candies = [0] * n  # Child gets 0 candies!

# ✅ Correct: Everyone gets at least 1
candies = [1] * n
```

---

## 📐 Visual: Why Two Passes Work

```
ratings: [1, 3, 2, 2, 1]

Pass 1 (L→R) handles increasing sequences:
         ↗
[1, 3, 2, 2, 1]
[1, 2, ?, ?, ?]  ← 3 > 1, so gets 2

Pass 2 (R→L) handles decreasing sequences:
               ↘
[1, 3, 2, 2, 1]
[?, ?, 2, 1, 1]  ← 2 > 1, 2 > 1 working backward

Combine with MAX:
[1, 2, 1, 1, 1]  from Pass 1
[1, 1, 2, 1, 1]  from Pass 2
[1, 2, 2, 1, 1]  MAX → Final answer = 7
```

---

## 🔗 Related Problems

| Problem | Similarity | Link |
|---------|------------|------|
| Trapping Rain Water | Two-pass technique | [LC 42](https://leetcode.com/problems/trapping-rain-water/) |
| Product Except Self | Forward/backward passes | [LC 238](https://leetcode.com/problems/product-of-array-except-self/) |
| Gas Station | Circular greedy | [LC 134](https://leetcode.com/problems/gas-station/) |

---

## 🎤 Interview Tips

<details>
<summary><strong>How to Communicate in Interview</strong></summary>

**Opening:**
"This problem has bidirectional constraints - each child must compare with BOTH neighbors. A single pass can't capture both directions, so I'll use two passes."

**Explain approach:**
"Pass 1 (left to right): Ensure higher-rated children have more than their left neighbor.
Pass 2 (right to left): Ensure higher-rated children have more than their right neighbor. I take the MAX to satisfy both constraints."

**Edge case to mention:**
"Equal ratings don't require different candy counts - only strictly greater ratings matter."

</details>

---

## ⏱️ Time Estimates

| Activity | Time |
|----------|------|
| Understand problem | 2 min |
| Realize two-pass needed | 2-3 min |
| Code solution | 5 min |
| Trace example | 3 min |
| **Total** | **12-15 min** |

---

> **💡 Key Insight:** When constraints involve both directions, consider two-pass greedy—process left-to-right, then right-to-left, combining results.

> **🔗 Related:** [Two-Pass Technique](../../06-Greedy-Techniques/8.1-Two-Pass-Greedy.md) | [Classic Overview](../7.1-Classic-Problems-Overview.md)
