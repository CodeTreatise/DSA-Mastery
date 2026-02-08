# Boats to Save People (LeetCode 881)

> **Pattern:** Two Pointers Greedy
> **Difficulty:** Medium
> **Company Focus:** Google, Amazon, Meta

---

## 📋 Problem Statement

You are given an array `people` where `people[i]` is the weight of the `ith` person, and an infinite number of boats where each boat can carry a maximum weight of `limit`. Each boat carries at most two people at the same time.

Return the **minimum number of boats** to carry every given person.

### Examples

```
Input: people = [1,2], limit = 3
Output: 1
Explanation: 1 boat (1, 2)

Input: people = [3,2,2,1], limit = 3
Output: 3
Explanation: 3 boats (1,2), (2), (3)

Input: people = [3,5,3,4], limit = 5
Output: 4
Explanation: 4 boats - each person alone
```

### Constraints

- `1 <= people.length <= 5 * 10^4`
- `1 <= people[i] <= limit <= 3 * 10^4`

---

## 🎯 Pattern Recognition

**Signals:**
- "Minimum number of X to cover all" → greedy
- "At most two items" → pair matching
- Weight constraint → sort and two pointers

**Key insight:** Pair heaviest with lightest if possible.

---

## 🧠 Intuition

### The Greedy Choice

1. The heaviest person must be on a boat
2. Can we add the lightest person to that boat?
   - If yes: pair them (save a boat!)
   - If no: heavy person goes alone

3. Sort by weight, use two pointers (light, heavy)

### Why This Works

```
If heaviest can't pair with lightest, they can't pair with anyone.
If heaviest can pair with lightest, pairing them is never worse than:
  - Heavy alone, light with someone else
  - Heavy with someone else

Because we've used the "least valuable" space (lightest person).
```

---

## 💻 Solution

```python
def numRescueBoats(people: list[int], limit: int) -> int:
    """
    LeetCode 881: Boats to Save People
    
    Sort, then pair heaviest with lightest if possible.
    
    Time: O(n log n), Space: O(1)
    """
    people.sort()
    
    left = 0                # Lightest remaining
    right = len(people) - 1  # Heaviest remaining
    boats = 0
    
    while left <= right:
        # Heavy person takes a boat
        if people[left] + people[right] <= limit:
            left += 1  # Light person joins
        right -= 1     # Heavy person always boards
        boats += 1
    
    return boats
```

```javascript
function numRescueBoats(people, limit) {
    people.sort((a, b) => a - b);
    
    let left = 0, right = people.length - 1;
    let boats = 0;
    
    while (left <= right) {
        if (people[left] + people[right] <= limit) {
            left++;
        }
        right--;
        boats++;
    }
    
    return boats;
}
```

---

## 📐 Step-by-Step Trace

```
people = [3,2,2,1], limit = 3
sorted:  [1,2,2,3]

left=0, right=3: people[0]+people[3] = 1+3 = 4 > 3
  → Heavy (3) goes alone, right=2, boats=1

left=0, right=2: people[0]+people[2] = 1+2 = 3 <= 3
  → Pair (1,2), left=1, right=1, boats=2

left=1, right=1: people[1]+people[1] = 2+2 = 4 > 3
  → (2) goes alone, right=0, boats=3

left > right, done!
Answer: 3 boats
```

---

## ⚡ Complexity Analysis

| Metric | Value | Explanation |
|--------|-------|-------------|
| Time | O(n log n) | Sorting dominates |
| Space | O(1) | In-place sort |

---

## 🔄 Why Not Pair Everyone Heavy-to-Light?

```
Bad idea: Pair adjacent after sorting

people = [1, 2, 2, 3], limit = 3

Adjacent pairing:
  (1,2) → fits ✓
  (2,3) → doesn't fit, need 2 boats

Two-pointer:
  (1,3) → doesn't fit, 3 alone
  (1,2) → fits ✓
  (2) → alone
  = 3 boats

Same result here, but consider:
people = [1, 1, 2, 3], limit = 3

Adjacent: (1,1)✓, (2)?, (3)? = complex
Two-pointer: (1,3)✓, (1,2)✓ = 2 boats (optimal!)
```

---

## ⚠️ Common Mistakes

### 1. Not Handling Same Person Twice

```python
# ❌ Wrong: Using < instead of <=
while left < right:  # Misses single middle person!

# ✅ Correct
while left <= right:  # Handles single remaining person
```

### 2. Moving Pointers Incorrectly

```python
# ❌ Wrong: Always moving both
left += 1
right -= 1  # Wrong when can't pair!

# ✅ Correct: Heavy always moves, light only if paired
if people[left] + people[right] <= limit:
    left += 1
right -= 1  # Heavy always boards
```

### 3. Forgetting to Count Boat

```python
# ❌ Wrong: Not counting when can't pair
if people[left] + people[right] <= limit:
    boats += 1  # Only counting pairs!

# ✅ Correct: Always count (each iteration = 1 boat)
if people[left] + people[right] <= limit:
    left += 1
right -= 1
boats += 1  # Always 1 boat per iteration
```

---

## 📐 Visual

```
people = [1, 2, 3, 4, 5], limit = 5
sorted:  [1, 2, 3, 4, 5]
         L           R

Iteration 1: 1+5=6 > 5 → 5 alone
         L        R
Boats: 1

Iteration 2: 1+4=5 <= 5 → pair (1,4)
            L  R
Boats: 2

Iteration 3: 2+3=5 <= 5 → pair (2,3)
              LR
Boats: 3

Iteration 4: (they've passed)
Answer: 3 boats

Verification: [5], [1,4], [2,3] ✓
```

---

## 🔗 Related Problems

| Problem | Similarity | Link |
|---------|------------|------|
| Assign Cookies | Two pointer matching | [LC 455](https://leetcode.com/problems/assign-cookies/) |
| Two Sum II | Two pointers sorted | [LC 167](https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/) |
| 3Sum | Sort + two pointers | [LC 15](https://leetcode.com/problems/3sum/) |

---

## 🎤 Interview Tips

<details>
<summary><strong>How to Communicate</strong></summary>

**Opening (30 sec):**
"This is a pairing optimization problem. Since each boat holds at most 2 people, I want to maximize pairs. I'll sort by weight and use two pointers."

**Explain greedy (30 sec):**
"The heaviest person must board. If the lightest person fits with them, pair them - it's the best use of remaining capacity. If not, heavy goes alone."

**Why greedy is optimal:**
"If heavy can't pair with lightest, they can't pair with anyone (all others are heavier). If they can pair, using the lightest maximizes remaining options."

</details>

---

## ⏱️ Time Estimates

| Activity | Time |
|----------|------|
| Understand | 1 min |
| Identify pattern | 1-2 min |
| Code | 3-4 min |
| Test | 1 min |
| **Total** | **6-8 min** |

---

> **💡 Key Insight:** When pairing items under a limit, sort and use two pointers from extremes. Heavy always goes, light joins if possible.

> **🔗 Related:** [Assign Cookies](../05-Classic-Greedy/7.2-Classic-Practice/Assign-Cookies.md) | [Sorting Tricks](../06-Greedy-Techniques/8.3-Sorting-Tricks.md)
