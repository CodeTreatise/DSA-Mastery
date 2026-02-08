# 04 - Binary Search on Answer

> **Optimization Problems with Binary Search**  
> **Interview Value:** ⭐⭐⭐⭐⭐ - HIGH interview frequency  
> **Prerequisites:** [2.1 Binary Search Basics](../2.1-Binary-Search-Basics.md)

---

## Overview

**Binary Search on Answer** is used when you're not searching an array, but searching for the **optimal value** in a range that satisfies some condition.

```
Problem: "Find MINIMUM speed to eat all bananas in H hours"
         Not searching an array!
         Searching for an answer in range [1, max(piles)]
```

The key insight: **If a value X works, we can determine if larger/smaller values work too (monotonic property).**

---

## 🎯 Pattern Recognition

<details>
<summary><strong>How to Identify This Pattern</strong></summary>

**Magic keywords:**
- "Find **minimum** X such that..."
- "Find **maximum** Y such that..."
- "What is the **least/most** possible..."
- "Minimize the **maximum**..."
- "Maximize the **minimum**..."

**The pattern applies when:**
1. Answer lies in a **known range** [lo, hi]
2. You can **verify** if a value works in O(n) or less
3. The answer has a **monotonic property**:
   - If X works, all values ≥ X work (for minimum problems)
   - If X works, all values ≤ X work (for maximum problems)

**Decision flow:**
```
Can you define a range for the answer?
               │
              YES
               │
               ▼
Can you verify if a value works in O(n)?
               │
              YES
               │
               ▼
Is there a monotonic property?
(If X works, do larger/smaller values also work?)
               │
              YES
               │
               ▼
       Binary Search on Answer!
```

</details>

---

## ✅ When to Use

- **Resource allocation** - Minimum capacity to ship packages
- **Time optimization** - Minimum days to complete task
- **Rate problems** - Minimum speed to finish in time
- **Partitioning** - Minimize maximum sum when splitting array
- **Spacing problems** - Maximum minimum distance

---

## ❌ When NOT to Use

| Situation | Use Instead | Why |
|-----------|-------------|-----|
| No clear range for answer | Different approach | Can't define search space |
| Can't verify quickly | DP or Greedy | Verification too expensive |
| No monotonic property | Try all values | Binary search won't work |
| Answer not a number | String/element based | Different problem type |

---

## 🔗 Concept Map

<details>
<summary><strong>Prerequisites & Next Steps</strong></summary>

**Before this, you should know:**
- [Binary Search Basics](../2.1-Binary-Search-Basics.md)
- [Boundary Search](./02-Boundary-Search.md)

**After mastering this:**
- [2D Matrix Search](./05-2D-Matrix-Search.md)
- [Advanced Binary Search](../2.3-Advanced-Binary-Search.md)

**Combines with:**
- Greedy (verification function often uses greedy)
- Prefix Sum (for subarray problems)

</details>

---

## 📐 How It Works

### The Template

```
1. Define the search range [lo, hi]
2. Binary search on this range
3. For each mid value, check if it's feasible
4. Narrow the range based on feasibility
```

### Visualization: Koko Eating Bananas

```
Piles: [3, 6, 7, 11], Hours: 8
Question: Minimum eating speed to finish all bananas?

Search range: [1, 11] (1 banana/hour to max pile)

Speed = 6:
  Pile 3: ceil(3/6) = 1 hour
  Pile 6: ceil(6/6) = 1 hour
  Pile 7: ceil(7/6) = 2 hours
  Pile 11: ceil(11/6) = 2 hours
  Total: 6 hours ≤ 8 ✓ WORKS!
  
Since 6 works, can we go slower?

Speed = 3:
  Total: 1 + 2 + 3 + 4 = 10 hours > 8 ✗ TOO SLOW

Speed = 4:
  Total: 1 + 2 + 2 + 3 = 8 hours = 8 ✓ WORKS!

Binary search finds: minimum speed = 4
```

### The Monotonic Property

```
Speed:    1   2   3   4   5   6   7   8   9   10   11
Works?    ✗   ✗   ✗   ✓   ✓   ✓   ✓   ✓   ✓   ✓    ✓
          ←──────────→ ←─────────────────────────────→
          TOO SLOW              FAST ENOUGH
          
Binary search finds the BOUNDARY between ✗ and ✓
```

---

## 💻 Code Implementation

### Template: Minimum Value That Works

**Python:**
```python
def binary_search_on_answer(lo: int, hi: int) -> int:
    """
    Find MINIMUM value in [lo, hi] that satisfies condition.
    
    Template for: "Find minimum X such that..."
    """
    def is_feasible(value: int) -> bool:
        """Check if this value satisfies the condition."""
        # Implement based on problem
        pass
    
    while lo < hi:
        mid = lo + (hi - lo) // 2
        
        if is_feasible(mid):
            hi = mid  # mid works, try smaller
        else:
            lo = mid + 1  # mid doesn't work, need larger
    
    return lo  # First value that works
```

### Template: Maximum Value That Works

```python
def binary_search_on_answer_max(lo: int, hi: int) -> int:
    """
    Find MAXIMUM value in [lo, hi] that satisfies condition.
    
    Template for: "Find maximum X such that..."
    """
    def is_feasible(value: int) -> bool:
        pass
    
    while lo < hi:
        mid = lo + (hi - lo + 1) // 2  # Note: +1 to avoid infinite loop
        
        if is_feasible(mid):
            lo = mid  # mid works, try larger
        else:
            hi = mid - 1  # mid doesn't work, need smaller
    
    return lo  # Last value that works
```

---

## 💻 Problem 1: Koko Eating Bananas (LC 875)

### Problem Statement
Koko eats bananas at speed k (bananas/hour). Each hour, she picks one pile and eats k bananas. If pile has less than k, she eats all and waits. Find minimum k to finish all piles in h hours.

```
piles = [3, 6, 7, 11], h = 8
Output: 4
```

### Code

```python
import math

def min_eating_speed(piles: list[int], h: int) -> int:
    """
    Find minimum eating speed to finish in h hours.
    
    Time: O(n * log(max_pile))
    Space: O(1)
    """
    def can_finish(speed: int) -> bool:
        """Check if Koko can finish all piles at this speed."""
        hours_needed = sum(math.ceil(pile / speed) for pile in piles)
        return hours_needed <= h
    
    # Search range: [1, max(piles)]
    lo, hi = 1, max(piles)
    
    while lo < hi:
        mid = lo + (hi - lo) // 2
        
        if can_finish(mid):
            hi = mid  # Can finish, try slower
        else:
            lo = mid + 1  # Too slow, need faster
    
    return lo


# Example
print(min_eating_speed([3, 6, 7, 11], 8))  # 4
print(min_eating_speed([30, 11, 23, 4, 20], 5))  # 30
```

```javascript
function minEatingSpeed(piles, h) {
    function canFinish(speed) {
        let hours = 0;
        for (const pile of piles) {
            hours += Math.ceil(pile / speed);
        }
        return hours <= h;
    }
    
    let lo = 1;
    let hi = Math.max(...piles);
    
    while (lo < hi) {
        const mid = lo + Math.floor((hi - lo) / 2);
        
        if (canFinish(mid)) {
            hi = mid;
        } else {
            lo = mid + 1;
        }
    }
    
    return lo;
}
```

---

## 💻 Problem 2: Capacity To Ship Packages (LC 1011)

### Problem Statement
Ship packages in order with a ship of capacity `capacity`. Find minimum capacity to ship all in `days` days.

```
weights = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], days = 5
Output: 15

Day 1: 1, 2, 3, 4, 5 (weight = 15)
Day 2: 6, 7 (weight = 13)
Day 3: 8 (weight = 8)
Day 4: 9 (weight = 9)
Day 5: 10 (weight = 10)
```

### Code

```python
def ship_within_days(weights: list[int], days: int) -> int:
    """
    Find minimum ship capacity to ship all packages in days days.
    
    Time: O(n * log(sum(weights)))
    Space: O(1)
    """
    def can_ship(capacity: int) -> bool:
        """Check if we can ship all packages with this capacity."""
        days_needed = 1
        current_weight = 0
        
        for weight in weights:
            if current_weight + weight > capacity:
                days_needed += 1
                current_weight = weight
            else:
                current_weight += weight
        
        return days_needed <= days
    
    # Range: [max(weights), sum(weights)]
    # min: must carry heaviest package
    # max: carry everything in one day
    lo, hi = max(weights), sum(weights)
    
    while lo < hi:
        mid = lo + (hi - lo) // 2
        
        if can_ship(mid):
            hi = mid  # Can ship, try smaller capacity
        else:
            lo = mid + 1  # Can't ship, need more capacity
    
    return lo


print(ship_within_days([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 5))  # 15
```

```javascript
function shipWithinDays(weights, days) {
    function canShip(capacity) {
        let daysNeeded = 1;
        let currentWeight = 0;
        
        for (const weight of weights) {
            if (currentWeight + weight > capacity) {
                daysNeeded++;
                currentWeight = weight;
            } else {
                currentWeight += weight;
            }
        }
        
        return daysNeeded <= days;
    }
    
    let lo = Math.max(...weights);
    let hi = weights.reduce((a, b) => a + b, 0);
    
    while (lo < hi) {
        const mid = lo + Math.floor((hi - lo) / 2);
        
        if (canShip(mid)) {
            hi = mid;
        } else {
            lo = mid + 1;
        }
    }
    
    return lo;
}
```

---

## 💻 Problem 3: Split Array Largest Sum (LC 410)

### Problem Statement
Split array into m subarrays. Minimize the largest sum among subarrays.

```
nums = [7, 2, 5, 10, 8], m = 2
Output: 18

Split: [7, 2, 5] and [10, 8]
Sums: 14 and 18
Largest sum: 18 (minimized)
```

### Code

```python
def split_array(nums: list[int], m: int) -> int:
    """
    Minimize the largest sum when splitting into m parts.
    
    Time: O(n * log(sum(nums)))
    Space: O(1)
    """
    def can_split(max_sum: int) -> bool:
        """Check if we can split with this max subarray sum."""
        splits = 1
        current_sum = 0
        
        for num in nums:
            if current_sum + num > max_sum:
                splits += 1
                current_sum = num
            else:
                current_sum += num
        
        return splits <= m
    
    # Range: [max(nums), sum(nums)]
    lo, hi = max(nums), sum(nums)
    
    while lo < hi:
        mid = lo + (hi - lo) // 2
        
        if can_split(mid):
            hi = mid  # Can split, try smaller max
        else:
            lo = mid + 1  # Can't split, need larger max
    
    return lo


print(split_array([7, 2, 5, 10, 8], 2))  # 18
```

---

## ⚡ Complexity Analysis

| Problem | Binary Search | Verification | Total |
|---------|--------------|--------------|-------|
| Koko Eating Bananas |" O(log M) "| O(n) |" O(n log M) "|
| Ship Packages |" O(log S) "| O(n) |" O(n log S) "|
| Split Array |" O(log S) "| O(n) |" O(n log S) "|

Where M = max element, S = sum of elements, n = array length

**Key insight:** Binary search reduces O(S) or O(M) search to O(log S) or O(log M)!

---

## 🔄 Variations

| Type | Template | Example |
|------|----------|---------|
| **Minimize value** | `if feasible: hi = mid` | Koko, Ship Packages |
| **Maximize value** | `if feasible: lo = mid` | Aggressive Cows |
| **Minimize maximum** | Same as minimize | Split Array |
| **Maximize minimum** | Same as maximize | Aggressive Cows |

### Maximize Minimum Distance (Aggressive Cows)

```python
def aggressive_cows(stalls: list[int], k: int) -> int:
    """
    Place k cows to MAXIMIZE the MINIMUM distance between any two.
    """
    stalls.sort()
    
    def can_place(min_dist: int) -> bool:
        count = 1
        last_pos = stalls[0]
        
        for stall in stalls[1:]:
            if stall - last_pos >= min_dist:
                count += 1
                last_pos = stall
        
        return count >= k
    
    lo, hi = 1, stalls[-1] - stalls[0]
    
    while lo < hi:
        mid = lo + (hi - lo + 1) // 2  # +1 for maximize
        
        if can_place(mid):
            lo = mid  # Can place, try larger distance
        else:
            hi = mid - 1  # Can't place, reduce distance
    
    return lo
```

---

## ⚠️ Common Mistakes

### 1. Wrong Range Definition

❌ **Wrong:**
```python
lo, hi = 0, len(weights)  # Wrong! Not searching indices
```

✅ **Correct:**
```python
lo, hi = max(weights), sum(weights)  # Searching capacity values
```

### 2. Infinite Loop in Maximize Template

❌ **Wrong:**
```python
# For maximize problems
mid = lo + (hi - lo) // 2  # Can cause infinite loop
```

✅ **Correct:**
```python
# For maximize problems
mid = lo + (hi - lo + 1) // 2  # +1 prevents infinite loop
```

### 3. Wrong Feasibility Check Logic

❌ **Wrong:**
```python
def can_finish(speed):
    hours = 0
    for pile in piles:
        hours += pile / speed  # Wrong! Need ceiling
```

✅ **Correct:**
```python
def can_finish(speed):
    hours = 0
    for pile in piles:
        hours += math.ceil(pile / speed)  # Ceiling for hours
```

---

## 📝 Practice Problems

### Medium

| Problem | Focus | LeetCode |
|---------|-------|----------|
| Koko Eating Bananas | Classic template | [LC 875](https://leetcode.com/problems/koko-eating-bananas/) |
| Capacity To Ship Packages | Same pattern | [LC 1011](https://leetcode.com/problems/capacity-to-ship-packages-within-d-days/) |
| Minimum Days to Make M Bouquets | Variation | [LC 1482](https://leetcode.com/problems/minimum-number-of-days-to-make-m-bouquets/) |

### Hard

| Problem | Focus | LeetCode |
|---------|-------|----------|
| Split Array Largest Sum | Minimize maximum | [LC 410](https://leetcode.com/problems/split-array-largest-sum/) |
| Magnetic Force | Maximize minimum | [LC 1552](https://leetcode.com/problems/magnetic-force-between-two-balls/) |

<details>
<summary><strong>🧠 Spaced Repetition Schedule</strong></summary>

**Week 1:**
- Day 1: Koko Eating Bananas
- Day 3: Capacity to Ship Packages
- Day 5: Redo both, identify the pattern

**Week 2:**
- Day 8: Split Array Largest Sum
- Day 10: Minimize Days for Bouquets
- Day 14: Aggressive Cows (maximize minimum)

**Key Questions:**
1. What is my search range?
2. How do I verify if a value works?
3. Am I minimizing or maximizing?

</details>

---

## 🎤 Interview Context

<details>
<summary><strong>How to Communicate in Interviews</strong></summary>

**Recognizing the pattern:**
> "This is asking for the minimum value that satisfies a condition. The answer lies in a range, and I can verify any value in O(n). This is a classic binary search on answer problem."

**Defining the range:**
> "The minimum possible answer is X because... The maximum is Y because..."

**Explaining the approach:**
> "For each candidate answer, I check if it's feasible using a greedy verification. Binary search finds the optimal value."

**Complexity:**
> "Binary search is O(log range), verification is O(n), so total is O(n log range)."

**Company Focus:**

| Company | Frequency | Common Problems |
|---------|-----------|-----------------|
| Google | ⭐⭐⭐⭐⭐ | Very high |
| Amazon | ⭐⭐⭐⭐⭐ | Koko, Capacity |
| Meta | ⭐⭐⭐⭐ | High |

</details>

---

## ⏱️ Time Estimates

| Activity | Time | Notes |
|----------|------|-------|
| Understand pattern | 30-40 min | Key concepts |
| Koko Eating Bananas | 25-35 min | First problem |
| Capacity to Ship | 20-30 min | Similar pattern |
| Split Array | 35-45 min | Harder variation |
| Master pattern | 1-2 weeks | Multiple problems |

---

## 💡 Key Insight

> **Binary Search on Answer has three parts:**
>
> 1. **Define range:** What's the smallest/largest possible answer?
> 2. **Verify function:** Can you check if a value works in O(n)?
> 3. **Monotonic property:** If X works, do larger (or smaller) values also work?
>
> The verification function is always GREEDY - just check if it's possible, don't optimize!

---

## 🔗 Related

- [Binary Search Basics](../2.1-Binary-Search-Basics.md) - Foundation
- [Boundary Search](./02-Boundary-Search.md) - Finding first/last
- [Rotated Arrays](./03-Rotated-Arrays.md) - Another variation
