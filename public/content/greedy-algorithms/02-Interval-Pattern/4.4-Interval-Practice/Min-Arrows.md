# Minimum Number of Arrows to Burst Balloons - Practice Problem

> **LeetCode 452:** [Minimum Number of Arrows to Burst Balloons](https://leetcode.com/problems/minimum-number-of-arrows-to-burst-balloons/)
> 
> **Difficulty:** Medium | **Pattern:** Sort by End | **Time:** O(n log n)

---

## 📋 Problem Statement

There are some spherical balloons taped onto a flat wall that represents the XY-plane. The balloons are represented as a 2D integer array `points` where `points[i] = [xstart, xend]` denotes a balloon whose horizontal diameter stretches between `xstart` and `xend`. You do not know the exact y-coordinates of the balloons.

Arrows can be shot up vertically from different points along the x-axis. A balloon with `xstart` and `xend` is burst by an arrow shot at `x` if `xstart <= x <= xend`. There is no limit to the number of arrows that can be shot.

Return the **minimum number of arrows** that must be shot to burst all balloons.

**Example 1:**
```
Input: points = [[10,16],[2,8],[1,6],[7,12]]
Output: 2
Explanation: 
- Arrow at x=6: bursts [2,8] and [1,6]
- Arrow at x=11: bursts [10,16] and [7,12]
```

**Example 2:**
```
Input: points = [[1,2],[3,4],[5,6],[7,8]]
Output: 4
Explanation: No overlapping, need 4 arrows.
```

**Example 3:**
```
Input: points = [[1,2],[2,3],[3,4],[4,5]]
Output: 2
Explanation: Arrow at x=2 bursts [1,2] and [2,3]. Arrow at x=4 bursts [3,4] and [4,5].
```

**Constraints:**
- 1 ≤ points.length ≤ 10^5
- points[i].length == 2
- -2^31 ≤ xstart < xend ≤ 2^31 - 1

---

## 🎯 Pattern Recognition

**Reframe the problem:**
```
Each balloon = interval on x-axis
Arrow at x bursts all balloons containing x
Minimum arrows = Minimum groups of overlapping balloons

This is equivalent to:
"What is the minimum number of groups where each group 
 shares at least one common point?"
```

**Pattern: Sort by End Time**
```
Why? Shooting at the END of a balloon's range:
- Definitely hits that balloon
- Has best chance to hit overlapping balloons

Same as Activity Selection: pick earliest ending first!
```

---

## 📐 Solution Approach

### Algorithm

```
1. Sort balloons by END point (ascending)
2. Shoot first arrow at first balloon's end
3. For each remaining balloon:
   - If balloon.start > arrow_position:
     → Need new arrow at balloon.end
   - Otherwise:
     → Current arrow already bursts this balloon
4. Count arrows
```

### Visual Trace

```
Balloons: [[10,16],[2,8],[1,6],[7,12]]

Sort by end: [[1,6],[2,8],[7,12],[10,16]]

     1   2   3   4   5   6   7   8   9  10  11  12  13  14  15  16
     [===========] (1,6)
         [==============] (2,8)
                     [=============] (7,12)
                             [===================] (10,16)

Arrow 1 at x=6:
  ✓ Bursts [1,6] (6 is within [1,6])
  ✓ Bursts [2,8] (6 is within [2,8])
  
Arrow 2 at x=12:
  ✓ Bursts [7,12] (12 is within [7,12])
  ✓ Bursts [10,16] (12 is within [10,16])

Total: 2 arrows
```

---

## 💻 Solutions

### Python Solution

```python
def findMinArrowShots(points: list[list[int]]) -> int:
    """
    Minimum arrows to burst all balloons.
    
    Key insight: Sort by end point, shoot at end of each group.
    
    Time: O(n log n), Space: O(1)
    """
    if not points:
        return 0
    
    # Sort by END point
    points.sort(key=lambda x: x[1])
    
    arrows = 1
    arrow_pos = points[0][1]  # Shoot at end of first balloon
    
    for i in range(1, len(points)):
        start, end = points[i]
        
        # Current arrow doesn't reach this balloon
        if start > arrow_pos:
            arrows += 1
            arrow_pos = end  # New arrow at this balloon's end
        # Otherwise, current arrow already hits this balloon
    
    return arrows
```

### JavaScript Solution

```javascript
function findMinArrowShots(points) {
    if (points.length === 0) return 0;
    
    // Sort by end point
    points.sort((a, b) => a[1] - b[1]);
    
    let arrows = 1;
    let arrowPos = points[0][1];
    
    for (let i = 1; i < points.length; i++) {
        const [start, end] = points[i];
        
        if (start > arrowPos) {
            arrows++;
            arrowPos = end;
        }
    }
    
    return arrows;
}
```

---

## 🔍 Detailed Trace

```
Input: [[10,16],[2,8],[1,6],[7,12]]

Step 1: Sort by end
  [[1,6], [2,8], [7,12], [10,16]]

Step 2: Initialize
  arrows = 1
  arrow_pos = 6 (end of first balloon)

Step 3: Check [2,8]
  start=2, end=8
  2 > 6? NO → arrow at 6 hits [2,8]
  (arrows stays 1)

Step 4: Check [7,12]
  start=7, end=12
  7 > 6? YES → need new arrow!
  arrows = 2
  arrow_pos = 12

Step 5: Check [10,16]
  start=10, end=16
  10 > 12? NO → arrow at 12 hits [10,16]
  (arrows stays 2)

Result: 2 arrows ✓
```

---

## ⚠️ Edge Cases

| Case | Input | Output | Explanation |
|------|-------|--------|-------------|
| Empty | `[]` | `0` | No balloons |
| Single | `[[1,5]]` | `1` | One arrow |
| No overlap | `[[1,2],[3,4]]` | `2` | One each |
| All overlap | `[[1,10],[2,9],[3,8]]` | `1` | One hits all |
| Touching | `[[1,2],[2,3]]` | `1` | Arrow at 2 hits both |
| Same balloon | `[[1,2],[1,2],[1,2]]` | `1` | All same |
| Large values | `[[-2^31, 2^31-1]]` | `1` | Use long/bigint |

### Integer Overflow Warning

```python
# ⚠️ Be careful with very large/small integers!
# In languages with fixed-size ints, sorting comparison might overflow

# Python handles this naturally (arbitrary precision)
# JavaScript: Safe for 2^53, larger needs BigInt
# Java/C++: Be careful with comparison operations
```

---

## ⚡ Complexity Analysis

| Aspect | Complexity | Explanation |
|--------|------------|-------------|
| **Time** | O(n log n) | Sorting dominates |
| **Space** | O(1) | In-place (depends on sort) |

---

## 🔄 Relationship to Other Problems

### This is the "Inverse" of Non-overlapping Intervals

```
Non-overlapping Intervals (LC 435):
  - Find MIN REMOVALS for non-overlap
  - Equivalently: Find MAX we can KEEP
  - min_removed = total - max_kept

Minimum Arrows (LC 452):
  - Find MIN GROUPS of overlapping
  - Each group = one arrow
  - min_arrows = number of non-overlapping groups
```

### Same Pattern, Different Framing

```python
# LC 435: Non-overlapping Intervals
def eraseOverlapIntervals(intervals):
    # Count max non-overlapping we can KEEP
    # Return: total - kept

# LC 452: Minimum Arrows
def findMinArrowShots(points):
    # Count non-overlapping GROUPS
    # Each group = 1 arrow
```

---

## 📝 Why Sort by End Works

```
Claim: Shooting at the earliest end point is optimal.

Proof intuition:
- Shooting earlier in a balloon's range might miss overlapping balloons
- Shooting at the END maximizes overlap potential
- Greedy: always shoot at the "limit" of current group

Example:
  Balloon A: [1, 10]
  Balloon B: [5, 6]
  
  Shoot at x=6 (end of B):
  ✓ Hits both A and B
  
  If we shot at x=10 (end of A):
  ✗ Misses B (6 < 10)
  Need 2 arrows instead of 1
```

---

## 🎤 Interview Tips

**Opening statement:**
```
"This is asking for minimum groups of overlapping intervals.
Each group can be burst with one arrow.

I'll sort by END point - shooting at the end of a balloon
has the best chance of hitting overlapping balloons.

For each balloon, if the current arrow can't reach it,
I need a new arrow at its end point.

Time: O(n log n), Space: O(1)."
```

**Key questions to ask:**
- "Are endpoints inclusive?" (Usually yes based on problem)
- "Can balloons have zero width?" (Usually no, start < end)
- "Range of values?" (Careful with overflow)

**Common mistakes:**
- ❌ Sorting by start instead of end
- ❌ Using `>=` instead of `>` for gap check
- ❌ Integer overflow in comparison

---

## 🔗 Related Problems

| Problem | Relationship |
|---------|--------------|
| [Non-overlapping Intervals](https://leetcode.com/problems/non-overlapping-intervals/) | Same pattern (sort by end) |
| [Maximum Length of Pair Chain](https://leetcode.com/problems/maximum-length-of-pair-chain/) | Identical algorithm |
| [Meeting Rooms](https://leetcode.com/problems/meeting-rooms/) | Simpler - just check overlap |
| [Merge Intervals](https://leetcode.com/problems/merge-intervals/) | Different pattern (sort by start) |
