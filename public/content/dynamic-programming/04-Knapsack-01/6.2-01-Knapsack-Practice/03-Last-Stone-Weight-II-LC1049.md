# Last Stone Weight II (LC 1049)

> **The hidden knapsack problem.** This problem looks like simulation but is actually a partition problem in disguise. We want to split stones into two groups with minimum difference—classic 0/1 Knapsack!

---

## 📋 Problem Statement

**LeetCode:** [1049. Last Stone Weight II](https://leetcode.com/problems/last-stone-weight-ii/)

You are given an array of integers `stones` where `stones[i]` is the weight of the ith stone.

We are playing a game with the stones. On each turn, we choose any two stones and smash them together. Suppose the stones have weights x and y with x ≤ y:
- If x == y, both stones are destroyed
- If x != y, stone of weight x is destroyed and stone of weight y has new weight y - x

At the end, there is at most one stone left. Return the smallest possible weight of the left stone (or 0 if no stones are left).

**Examples:**
```
Input: stones = [2,7,4,1,8,1]
Output: 1
Explanation: 
  Smash 2 and 4 → 2
  Smash 7 and 8 → 1
  Smash 2 and 1 → 1
  Smash 1 and 1 → 0
  Final: 1

Input: stones = [31,26,33,21,40]
Output: 5

Input: stones = [1,2]
Output: 1
```

**Constraints:**
- 1 ≤ stones.length ≤ 30
- 1 ≤ stones[i] ≤ 100

---

## 🎯 Pattern Recognition

<details>
<summary><strong>How to Identify This as Knapsack</strong></summary>

**The Insight:**
When we smash stones, we're essentially assigning + or - to each stone!

```
Smash sequence: (a-b), then ((a-b)-c), then...
This is equivalent to: a - b - c + d - e...
                     = (a + d + ...) - (b + c + e + ...)
                     = Sum(Group1) - Sum(Group2)
```

So the problem becomes: **Partition stones into two groups to minimize |Sum1 - Sum2|**

This is exactly the **Partition Equal Subset Sum** variant!

**Why it's 0/1 Knapsack:**
- Each stone used exactly once ✓
- Choosing subset with target sum ✓
- Minimize difference = maximize sum ≤ total/2 ✓

</details>

---

## ✅ When to Use This Approach

- Problems that can be reduced to partitioning
- "Minimize difference between two groups"
- Smashing/combining with subtraction operations

## ❌ When NOT to Use

| Situation | Use Instead |
|-----------|-------------|
| Must use stones in specific order | Simulation/Greedy |
| Stones can be used multiple times | Unbounded Knapsack |
| Need to track actual partition | Add reconstruction |

---

## 📐 Core Transformation

**Step 1: Recognize the Partition**
```
All smash operations = assigning + or - to each stone
Result = |Sum(+stones) - Sum(-stones)|
       = |Group1 - Group2|
```

**Step 2: Minimize the Difference**
```
Let total = sum of all stones
Let S = sum of one group

Other group = total - S
Difference = |S - (total - S)| = |2S - total|

To minimize: S should be as close to total/2 as possible
```

**Step 3: Apply 0/1 Knapsack**
```
Find the largest sum S ≤ total/2 that can be formed
Answer = total - 2*S
```

---

## 💻 Solution: 0/1 Knapsack

```python
def lastStoneWeightII(stones: list[int]) -> int:
    """
    Partition stones to minimize |Group1 - Group2|.
    
    Find largest subset sum ≤ total/2, then:
    Answer = total - 2 * (largest sum ≤ total/2)
    
    Time: O(n * sum), Space: O(sum)
    """
    total = sum(stones)
    target = total // 2
    
    # dp[w] = True if sum w is achievable
    dp = [False] * (target + 1)
    dp[0] = True  # Empty subset has sum 0
    
    for stone in stones:
        # Iterate RIGHT TO LEFT (0/1 knapsack)
        for w in range(target, stone - 1, -1):
            dp[w] = dp[w] or dp[w - stone]
    
    # Find largest achievable sum ≤ target
    for s in range(target, -1, -1):
        if dp[s]:
            # Group1 = s, Group2 = total - s
            # Difference = (total - s) - s = total - 2*s
            return total - 2 * s
    
    return total  # Should never reach here
```

```javascript
function lastStoneWeightII(stones) {
    const total = stones.reduce((a, b) => a + b, 0);
    const target = Math.floor(total / 2);
    
    // dp[w] = true if sum w is achievable
    const dp = Array(target + 1).fill(false);
    dp[0] = true;
    
    for (const stone of stones) {
        // RIGHT TO LEFT for 0/1 knapsack
        for (let w = target; w >= stone; w--) {
            dp[w] = dp[w] || dp[w - stone];
        }
    }
    
    // Find largest achievable sum ≤ target
    for (let s = target; s >= 0; s--) {
        if (dp[s]) {
            return total - 2 * s;
        }
    }
    
    return total;
}
```

---

## 💻 Alternative: Track Achievable Sums with Set

```python
def lastStoneWeightII(stones: list[int]) -> int:
    """
    Use set to track all achievable sums.
    More intuitive but potentially slower.
    
    Time: O(n * sum), Space: O(sum)
    """
    total = sum(stones)
    achievable = {0}
    
    for stone in stones:
        # Add stone to each existing sum
        achievable = achievable | {s + stone for s in achievable}
    
    # Find sum closest to total/2
    target = total // 2
    for s in range(target, -1, -1):
        if s in achievable:
            return total - 2 * s
    
    return total
```

---

## 🔄 Trace Example

```
stones = [2, 7, 4, 1, 8, 1]
total = 23
target = 11 (we want subset sum ≤ 11)

After processing each stone:
  stone=2: dp[2] = True
  stone=7: dp[7], dp[9] = True  
  stone=4: dp[4], dp[6], dp[11] = True
  stone=1: dp[1], dp[3], dp[5], dp[7], dp[8], dp[10] = True
  stone=8: (many more become True)
  stone=1: (even more)

Final: largest achievable ≤ 11 is 11
Answer = 23 - 2*11 = 1 ✓

Verification: Group1 = 11 (e.g., 2+1+8), Group2 = 12 (e.g., 7+4+1)
Difference = |11 - 12| = 1 ✓
```

---

## ⚡ Complexity Analysis

| Approach | Time | Space |
|----------|------|-------|
| DP Array | O(n × sum) | O(sum/2) |
| Set-based | O(n × 2^n) worst | O(2^n) worst |

Where n = number of stones, sum = total of all stones.

**Why these bounds:**
- Maximum sum = 30 × 100 = 3000
- Target = 1500
- So worst case: O(30 × 1500) = O(45,000) ✓

---

## ⚠️ Common Mistakes

### 1. Wrong Iteration Direction
```python
# ❌ Wrong: LEFT TO RIGHT uses stone multiple times
for w in range(stone, target + 1):
    dp[w] = dp[w] or dp[w - stone]

# ✅ Correct: RIGHT TO LEFT for 0/1 knapsack
for w in range(target, stone - 1, -1):
    dp[w] = dp[w] or dp[w - stone]
```

### 2. Wrong Answer Formula
```python
# ❌ Wrong
return 2 * s - total  # Could be negative!

# ✅ Correct (s is the smaller group)
return total - 2 * s
```

### 3. Not Seeing the Partition Insight
```python
# ❌ Wrong: Trying to simulate smashing
# This is exponential complexity!

# ✅ Correct: Recognize as partition problem
# Smashing = assigning + or - to each stone
```

### 4. Off-by-One in Target
```python
# ❌ Wrong: Using total instead of total//2
target = total

# ✅ Correct: We only need to find sum ≤ half
target = total // 2
```

---

## 🔗 Related Problems

| Problem | Similarity | Key Difference |
|---------|------------|----------------|
| [416. Partition Equal Subset Sum](https://leetcode.com/problems/partition-equal-subset-sum/) | Same pattern | Exact half vs closest to half |
| [494. Target Sum](https://leetcode.com/problems/target-sum/) | Same transformation | Count ways vs check possibility |
| [1046. Last Stone Weight](https://leetcode.com/problems/last-stone-weight/) | Same theme | Greedy version (always smash largest) |

---

## 📝 Practice Problems

| Problem | Difficulty | Key Insight |
|---------|------------|-------------|
| [1049. Last Stone Weight II](https://leetcode.com/problems/last-stone-weight-ii/) | Medium | Partition to minimize diff |
| [416. Partition Equal Subset Sum](https://leetcode.com/problems/partition-equal-subset-sum/) | Medium | Check if half is achievable |
| [494. Target Sum](https://leetcode.com/problems/target-sum/) | Medium | Count partitions with target diff |

---

## 🎤 Interview Tips

<details>
<summary><strong>How to Present This Solution</strong></summary>

**Opening (the key insight!):**
> "This looks like a simulation problem, but there's a key insight: when we smash stones, we're essentially assigning + or - signs to each stone. So the final result is |Group1 - Group2|, and we want to partition stones to minimize this difference."

**Connecting to Knapsack:**
> "This is exactly the partition problem! We want to find the subset with sum closest to total/2. We can use 0/1 knapsack where dp[w] tells us if sum w is achievable."

**Why RIGHT TO LEFT:**
> "We iterate backwards so each stone is used at most once. If we went left to right, we'd be using the same stone multiple times."

</details>

**Company Focus:**
| Company | Frequency | Notes |
|---------|-----------|-------|
| Google | ⭐⭐⭐ | Tests problem transformation skills |
| Amazon | ⭐⭐ | May appear in OA |
| Microsoft | ⭐⭐ | Tests DP fundamentals |

---

> **💡 Key Insight:** Smashing stones is equivalent to assigning + or - to each stone. The final answer is the difference between two groups, so minimize this by finding a subset sum closest to half the total.

> **🔗 Related:** [0/1 Knapsack Pattern](../6.1-Knapsack-01-Pattern.md) | [Partition Equal Subset Sum](01-Partition-Equal-LC416.md) | [Target Sum](02-Target-Sum-LC494.md)
