# Non-Overlapping Intervals - Practice Problem

> **LeetCode 435:** [Non-overlapping Intervals](https://leetcode.com/problems/non-overlapping-intervals/)
> 
> **Difficulty:** Medium | **Pattern:** Sort by End | **Time:** O(n log n)

---

## 📋 Problem Statement

Given an array of intervals `intervals` where `intervals[i] = [start_i, end_i]`, return the **minimum number of intervals you need to remove** to make the rest of the intervals non-overlapping.

**Example 1:**
```
Input: intervals = [[1,2],[2,3],[3,4],[1,3]]
Output: 1
Explanation: [1,3] can be removed and the rest are non-overlapping.
```

**Example 2:**
```
Input: intervals = [[1,2],[1,2],[1,2]]
Output: 2
Explanation: Remove two [1,2] to make just one left.
```

**Example 3:**
```
Input: intervals = [[1,2],[2,3]]
Output: 0
Explanation: Already non-overlapping (touching is OK).
```

**Constraints:**
- 1 ≤ intervals.length ≤ 10^5
- intervals[i].length == 2
- -5 × 10^4 ≤ start_i < end_i ≤ 5 × 10^4

---

## 🎯 Pattern Recognition

**Key Insight:**
```
Minimum removed = Total - Maximum kept

To KEEP maximum non-overlapping intervals:
→ Sort by END time (Activity Selection pattern)
→ Greedily take intervals that end earliest
```

**Why sort by END?**
```
Ending earliest leaves MOST ROOM for remaining intervals.

Bad: Take [1,10] first → blocks everything from 1-10
Good: Take [1,2] first → only blocks 1-2, leaves 2-∞ free
```

---

## 📐 Solution Approach

### Algorithm

```
1. Sort intervals by END time (ascending)
2. Take first interval (ends earliest)
3. For each remaining interval:
   - If start >= last_end → KEEP it (no overlap)
   - Else → would need to REMOVE it
4. Return: total - kept
```

### Visual Trace

```
Input: [[1,2],[2,3],[3,4],[1,3]]

Sort by end: [[1,2],[2,3],[1,3],[3,4]]
             end=2  end=3  end=3  end=4

Process:
[1,2]  [=]         ← Keep, last_end=2
[2,3]    [=]       ← 2>=2, Keep, last_end=3
[1,3] [==]         ← 1<3, Skip (overlaps)
[3,4]      [=]     ← 3>=3, Keep, last_end=4

Kept: 3, Total: 4
Remove: 4 - 3 = 1
```

---

## 💻 Solutions

### Python Solution

```python
def eraseOverlapIntervals(intervals: list[list[int]]) -> int:
    """
    Minimum intervals to remove for non-overlapping.
    
    Strategy: Find max to KEEP, then remove = total - kept.
    
    Time: O(n log n), Space: O(1)
    """
    if not intervals:
        return 0
    
    # Sort by END time (key for max selection)
    intervals.sort(key=lambda x: x[1])
    
    keep_count = 1
    last_end = intervals[0][1]
    
    for i in range(1, len(intervals)):
        start, end = intervals[i]
        
        # Non-overlapping: can keep this interval
        if start >= last_end:
            keep_count += 1
            last_end = end
        # Overlapping: skip (implicitly "remove")
    
    return len(intervals) - keep_count
```

### JavaScript Solution

```javascript
function eraseOverlapIntervals(intervals) {
    if (intervals.length === 0) return 0;
    
    // Sort by end time
    intervals.sort((a, b) => a[1] - b[1]);
    
    let keepCount = 1;
    let lastEnd = intervals[0][1];
    
    for (let i = 1; i < intervals.length; i++) {
        const [start, end] = intervals[i];
        
        if (start >= lastEnd) {
            keepCount++;
            lastEnd = end;
        }
    }
    
    return intervals.length - keepCount;
}
```

---

## 🔍 Detailed Trace

```
Input: [[1,2],[2,3],[3,4],[1,3]]

Step 1: Sort by end time
  [[1,2], [2,3], [1,3], [3,4]]
  Note: [2,3] and [1,3] both end at 3, order doesn't matter

Step 2: Initialize
  keep_count = 1, last_end = 2 (first interval)

Step 3: Check [2,3]
  start=2, end=3
  2 >= 2? YES → keep it!
  keep_count = 2, last_end = 3

Step 4: Check [1,3]
  start=1, end=3
  1 >= 3? NO → skip (overlaps with previous)
  keep_count = 2 (unchanged)

Step 5: Check [3,4]
  start=3, end=4
  3 >= 3? YES → keep it!
  keep_count = 3, last_end = 4

Result: 4 - 3 = 1 interval to remove ✓
```

---

## ⚠️ Edge Cases

| Case | Input | Output | Explanation |
|------|-------|--------|-------------|
| Empty | `[]` | `0` | Nothing to remove |
| Single | `[[1,2]]` | `0` | Already non-overlapping |
| All same | `[[1,2],[1,2],[1,2]]` | `2` | Keep 1, remove 2 |
| None overlap | `[[1,2],[3,4],[5,6]]` | `0` | Keep all |
| All overlap | `[[1,5],[2,6],[3,7]]` | `2` | Keep earliest ending |
| Touching | `[[1,2],[2,3]]` | `0` | Touching ≠ overlapping |
| Negative | `[[-5,-1],[-2,3]]` | `1` | Works with negatives |

---

## ⚡ Complexity Analysis

| Aspect | Complexity | Explanation |
|--------|------------|-------------|
| **Time** | O(n log n) | Sorting + single pass |
| **Space** | O(1) | In-place (depends on sort) |

---

## 🔄 Why Sort by End Works

### Mathematical Proof (Intuition)

```
Claim: Greedy choice (earliest end) is always part of optimal solution.

Proof by exchange:
1. Let OPT be an optimal solution
2. Let G be our greedy first choice (earliest end)
3. If G ∈ OPT, done
4. If G ∉ OPT:
   - OPT has some first interval F
   - G ends ≤ F ends (by greedy choice)
   - Replace F with G in OPT
   - New solution has same size (still optimal)
   - G is now in optimal solution ✓

Therefore, greedy choice is always safe.
```

### Counterexample for Sort by Start

```
Intervals: [[1,10], [2,3], [3,4]]

Sort by START: [1,10], [2,3], [3,4]
Greedy (by start): Take [1,10] → blocks [2,3], [3,4]
Result: Keep 1, Remove 2

Sort by END: [2,3], [3,4], [1,10]
Greedy (by end): Take [2,3] → Take [3,4] → Skip [1,10]
Result: Keep 2, Remove 1

Sort by end is better! ✓
```

---

## 📝 Alternative Approaches

### Approach 2: DP (Weighted Job Scheduling Style)

```python
def eraseOverlapIntervalsDP(intervals):
    """
    DP approach - less efficient but educational.
    
    Time: O(n²), Space: O(n)
    """
    if not intervals:
        return 0
    
    intervals.sort(key=lambda x: x[1])
    n = len(intervals)
    
    # dp[i] = max intervals we can keep ending at or before i
    dp = [1] * n
    
    for i in range(1, n):
        for j in range(i):
            if intervals[j][1] <= intervals[i][0]:
                dp[i] = max(dp[i], dp[j] + 1)
    
    return n - max(dp)
```

**Why greedy is better:**
- Greedy: O(n log n)
- DP: O(n²)
- Same result, greedy is faster!

---

## 🎤 Interview Tips

**Communication template:**
```
"This is an interval selection problem. I want to maximize 
the number I can KEEP, then subtract from total to get removals.

To maximize kept: sort by end time. Intervals ending earliest 
leave the most room for remaining intervals.

Complexity: O(n log n) for sort, O(n) for scan, O(1) space."
```

**Common mistakes:**
- ❌ Sorting by start time
- ❌ Using `>` instead of `>=` for non-overlap check
- ❌ Counting removals directly (harder than counting keeps)

**Follow-up questions:**
- "What if intervals have weights?" → DP (Weighted Job Scheduling)
- "What if we want the actual intervals to keep?" → Track indices
- "Online version?" → Harder, may need interval tree

---

## 🔗 Related Problems

| Problem | Relationship |
|---------|--------------|
| [Minimum Number of Arrows](https://leetcode.com/problems/minimum-number-of-arrows-to-burst-balloons/) | Same pattern, count groups |
| [Meeting Rooms](https://leetcode.com/problems/meeting-rooms/) | Check if any overlap |
| [Maximum Length of Pair Chain](https://leetcode.com/problems/maximum-length-of-pair-chain/) | Identical problem |
