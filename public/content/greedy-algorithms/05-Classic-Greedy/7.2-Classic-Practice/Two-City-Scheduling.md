# Two City Scheduling (LeetCode 1029)

> **Pattern:** Difference Greedy (Cost Comparison)
> **Difficulty:** Medium
> **Company Focus:** Amazon, Google (optimization problems)

---

## 📋 Problem Statement

A company is planning to interview `2n` people. Given the array `costs` where `costs[i] = [aCosti, bCosti]`:
- `aCosti` is the cost of flying the `ith` person to city A
- `bCosti` is the cost of flying the `ith` person to city B

Return the **minimum cost** to fly every person to a city such that exactly `n` people arrive in each city.

### Examples

```
Input: costs = [[10,20],[30,200],[400,50],[30,20]]
Output: 110
Explanation:
- Person 0 → City A (10)
- Person 1 → City A (30)
- Person 2 → City B (50)
- Person 3 → City B (20)
Total: 10 + 30 + 50 + 20 = 110

Input: costs = [[259,770],[448,54],[926,667],[184,139],[840,118],[577,469]]
Output: 1859
```

### Constraints

- `2 * n == costs.length`
- `1 <= costs.length <= 100`
- `costs.length` is even
- `1 <= aCosti, bCosti <= 1000`

---

## 🎯 Pattern Recognition

**Signals:**
- Two choices per item (city A or B)
- Constraint: equal split (n each)
- Minimize total cost
- Cost difference matters

**Key Pattern: Sort by difference (aCost - bCost)**

---

## 🧠 Intuition

### The Greedy Insight

For each person, the "cost of choosing A over B" is `aCost - bCost`.

- Negative difference → A is cheaper
- Positive difference → B is cheaper

**Strategy:** Sort by `aCost - bCost`, send first n to A (most beneficial for A), rest to B.

### Visual Example

```
costs = [[10,20], [30,200], [400,50], [30,20]]
differences:
  Person 0: 10-20 = -10 (A is $10 cheaper)
  Person 1: 30-200 = -170 (A is $170 cheaper!)
  Person 2: 400-50 = 350 (B is $350 cheaper)
  Person 3: 30-20 = 10 (B is $10 cheaper)

Sorted by diff: [-170, -10, 10, 350]
→ Persons [1, 0] → City A
→ Persons [3, 2] → City B

Cost: 30 + 10 + 20 + 50 = 110 ✓
```

---

## 💻 Solution

### Approach: Sort by Cost Difference

```python
def twoCitySchedCost(costs: list[list[int]]) -> int:
    """
    LeetCode 1029: Two City Scheduling
    
    Sort by (cost_A - cost_B) to find who benefits most from city A.
    Send first n to A, rest to B.
    
    Time: O(n log n), Space: O(1) for in-place sort
    """
    n = len(costs) // 2
    
    # Sort by difference: who saves most by going to A?
    costs.sort(key=lambda x: x[0] - x[1])
    
    total = 0
    
    # First n people go to A (smallest difference = biggest savings for A)
    for i in range(n):
        total += costs[i][0]  # City A cost
    
    # Remaining n people go to B
    for i in range(n, 2 * n):
        total += costs[i][1]  # City B cost
    
    return total
```

```javascript
function twoCitySchedCost(costs) {
    const n = costs.length / 2;
    
    // Sort by difference (aCost - bCost)
    costs.sort((a, b) => (a[0] - a[1]) - (b[0] - b[1]));
    
    let total = 0;
    
    // First n to A
    for (let i = 0; i < n; i++) {
        total += costs[i][0];
    }
    
    // Rest to B
    for (let i = n; i < 2 * n; i++) {
        total += costs[i][1];
    }
    
    return total;
}
```

---

## 📐 Step-by-Step Trace

```
costs = [[259,770], [448,54], [926,667], [184,139], [840,118], [577,469]]

Calculate differences:
  [259,770]: 259-770 = -511
  [448,54]:  448-54 = 394
  [926,667]: 926-667 = 259
  [184,139]: 184-139 = 45
  [840,118]: 840-118 = 722
  [577,469]: 577-469 = 108

Sorted by diff: [-511, 45, 108, 259, 394, 722]
Corresponding: [259,770], [184,139], [577,469], [926,667], [448,54], [840,118]

n = 3:
- First 3 → City A: 259 + 184 + 577 = 1020
- Last 3 → City B: 667 + 54 + 118 = 839

Total: 1020 + 839 = 1859 ✓
```

---

## ⚡ Complexity Analysis

| Metric | Value | Explanation |
|--------|-------|-------------|
| Time | O(n log n) | Sorting dominates |
| Space | O(1) or O(n) | Depends on sort implementation |

---

## 🔄 Alternative View: Refund Interpretation

Another way to think about it:

1. Send everyone to city A initially: `sum(aCost for all)`
2. For n people, "refund" them to B: add `(bCost - aCost)` for each

To minimize cost after refund, choose n people with most negative refund (i.e., `bCost - aCost` smallest).

```python
def twoCitySchedCost_refund(costs: list[list[int]]) -> int:
    """Alternative view: Start with all A, refund some to B."""
    total_a = sum(c[0] for c in costs)
    
    # Refund = bCost - aCost (add this to switch to B)
    refunds = [c[1] - c[0] for c in costs]
    refunds.sort()
    
    # Apply n smallest refunds (most beneficial switches)
    n = len(costs) // 2
    return total_a + sum(refunds[:n])
```

Both approaches give the same result!

---

## ⚠️ Common Mistakes

### 1. Sorting Wrong Direction

```python
# ❌ Wrong: Sorting by absolute difference
costs.sort(key=lambda x: abs(x[0] - x[1]))

# ✅ Correct: Sort by actual difference
costs.sort(key=lambda x: x[0] - x[1])
```

### 2. Forgetting to Split Evenly

```python
# ❌ Wrong: Just picking cheapest for each person
for cost in costs:
    total += min(cost)  # Might send 0 to one city!

# ✅ Correct: Ensure n go to each city
```

### 3. Index Confusion in JavaScript

```javascript
// ❌ Wrong: Off-by-one in loop
for (let i = 0; i <= n; i++) // Too many!

// ✅ Correct
for (let i = 0; i < n; i++)
```

---

## 📐 Why This Works (Proof Sketch)

**Claim:** Sorting by `aCost - bCost` and sending first n to A is optimal.

**Proof idea:**
- Suppose we don't send person X (with smaller diff) to A, but send person Y (with larger diff) to A.
- Swapping them saves `(diffY - diffX) > 0`.
- So any deviation from sorted order can be improved.
- Therefore, sorted order is optimal.

This is an **exchange argument** proof.

---

## 🔗 Related Problems

| Problem | Similarity | Link |
|---------|------------|------|
| Assign Cookies | Matching by sort | [LC 455](https://leetcode.com/problems/assign-cookies/) |
| Boats to Save People | Pair matching | [LC 881](https://leetcode.com/problems/boats-to-save-people/) |
| Task Scheduler | Cost/assignment | [LC 621](https://leetcode.com/problems/task-scheduler/) |

---

## 🎤 Interview Tips

<details>
<summary><strong>How to Communicate</strong></summary>

**Opening:**
"This is a cost optimization with an equal-split constraint. The key insight is that we care about the relative difference between choosing A vs B for each person."

**Explain greedy:**
"If I sort people by how much cheaper A is for them (aCost - bCost), then the first n people benefit most from going to A, and the rest should go to B."

**Why it's optimal:**
"This is optimal because any swap between the two groups would increase total cost - the person we moved to A would have a worse difference than someone we moved to B."

</details>

---

## ⏱️ Time Estimates

| Activity | Time |
|----------|------|
| Understand problem | 2 min |
| Find greedy insight | 3-4 min |
| Code solution | 3 min |
| Verify | 2 min |
| **Total** | **10-12 min** |

---

> **💡 Key Insight:** When making binary choices (A vs B) with constraints, sort by the difference in cost between choices. This reveals who benefits most from each option.

> **🔗 Related:** [Classic Overview](../7.1-Classic-Problems-Overview.md) | [Exchange Argument](../../01-Greedy-Fundamentals/2.2-Exchange-Argument.md)
