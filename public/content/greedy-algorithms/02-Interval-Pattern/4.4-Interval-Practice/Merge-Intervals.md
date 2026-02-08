# Merge Intervals - Practice Problem

> **LeetCode 56:** [Merge Intervals](https://leetcode.com/problems/merge-intervals/)
> 
> **Difficulty:** Medium | **Pattern:** Sort by Start | **Time:** O(n log n)

---

## 📋 Problem Statement

Given an array of intervals where `intervals[i] = [start_i, end_i]`, merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.

**Example 1:**
```
Input: intervals = [[1,3],[2,6],[8,10],[15,18]]
Output: [[1,6],[8,10],[15,18]]
Explanation: [1,3] and [2,6] overlap, so merge them into [1,6].
```

**Example 2:**
```
Input: intervals = [[1,4],[4,5]]
Output: [[1,5]]
Explanation: [1,4] and [4,5] are considered overlapping.
```

**Constraints:**
- 1 ≤ intervals.length ≤ 10^4
- intervals[i].length == 2
- 0 ≤ start_i ≤ end_i ≤ 10^4

---

## 🎯 Pattern Recognition

**Signals that indicate this pattern:**
- Array of intervals → Interval problem
- "Merge overlapping" → Sort by start
- Need to combine ranges → Extend or add

**This is NOT:**
- Activity selection (would sort by end)
- Counting overlaps (would use heap)

---

## 📐 Solution Approach

### Intuition

```
Process intervals left-to-right:
1. Sort by start time
2. For each interval:
   - If overlaps with last merged → extend
   - If gap exists → add as new

Visual:
[1,3]  [===]
[2,6]   [====]     ← Overlaps [1,3], extend to [1,6]
[8,10]        [==]  ← Gap after [1,6], new interval
```

### Algorithm

```
1. Sort intervals by start time
2. Initialize result with first interval
3. For each remaining interval:
   a. Get last interval in result
   b. If current.start <= last.end:
      - Extend: last.end = max(last.end, current.end)
   c. Else:
      - Add current to result
4. Return result
```

---

## 💻 Solutions

### Python Solution

```python
def merge(intervals: list[list[int]]) -> list[list[int]]:
    """
    Merge overlapping intervals.
    
    Time: O(n log n) - dominated by sorting
    Space: O(n) - for the result (O(log n) for sorting)
    """
    if not intervals:
        return []
    
    # Sort by start time
    intervals.sort(key=lambda x: x[0])
    
    merged = [intervals[0]]
    
    for i in range(1, len(intervals)):
        curr_start, curr_end = intervals[i]
        last_end = merged[-1][1]
        
        if curr_start <= last_end:
            # Overlap - extend
            merged[-1][1] = max(last_end, curr_end)
        else:
            # No overlap - add new
            merged.append([curr_start, curr_end])
    
    return merged
```

### JavaScript Solution

```javascript
function merge(intervals) {
    if (intervals.length === 0) return [];
    
    intervals.sort((a, b) => a[0] - b[0]);
    
    const merged = [intervals[0]];
    
    for (let i = 1; i < intervals.length; i++) {
        const [currStart, currEnd] = intervals[i];
        const last = merged[merged.length - 1];
        
        if (currStart <= last[1]) {
            last[1] = Math.max(last[1], currEnd);
        } else {
            merged.push([currStart, currEnd]);
        }
    }
    
    return merged;
}
```

---

## 🔍 Trace Through Example

```
Input: [[1,3],[2,6],[8,10],[15,18]]

After sorting: [[1,3],[2,6],[8,10],[15,18]] (already sorted)

Step 1: merged = [[1,3]]

Step 2: [2,6]
  - last = [1,3], currStart = 2
  - 2 <= 3? YES → overlap
  - merged[-1][1] = max(3, 6) = 6
  - merged = [[1,6]]

Step 3: [8,10]
  - last = [1,6], currStart = 8
  - 8 <= 6? NO → gap
  - merged.append([8,10])
  - merged = [[1,6],[8,10]]

Step 4: [15,18]
  - last = [8,10], currStart = 15
  - 15 <= 10? NO → gap
  - merged.append([15,18])
  - merged = [[1,6],[8,10],[15,18]]

Output: [[1,6],[8,10],[15,18]] ✓
```

---

## ⚠️ Edge Cases

| Case | Input | Output | Why |
|------|-------|--------|-----|
| Empty | `[]` | `[]` | Handle early |
| Single | `[[1,5]]` | `[[1,5]]` | No merge needed |
| All overlap | `[[1,10],[2,3],[4,5]]` | `[[1,10]]` | All inside first |
| All separate | `[[1,2],[3,4],[5,6]]` | Same | No overlaps |
| Touching | `[[1,2],[2,3]]` | `[[1,3]]` | 2 <= 2, overlap! |

---

## ⚡ Complexity Analysis

| Aspect | Complexity | Explanation |
|--------|------------|-------------|
| **Time** | O(n log n) | Sorting dominates |
| **Space** | O(n) | Result array |

**Sorting breakdown:**
- Sorting: O(n log n)
- Single pass: O(n)
- Total: O(n log n)

---

## 🔄 Related Problems

| Problem | Relationship |
|---------|--------------|
| [Insert Interval](https://leetcode.com/problems/insert-interval/) | Pre-sorted version |
| [Meeting Rooms](https://leetcode.com/problems/meeting-rooms/) | Check any overlap |
| [Meeting Rooms II](https://leetcode.com/problems/meeting-rooms-ii/) | Count max overlap |

---

## 🎤 Interview Tips

**What interviewer expects:**
1. ✅ Recognize sort-by-start pattern immediately
2. ✅ Handle overlap condition correctly (<=, not <)
3. ✅ Handle edge cases (empty, single)
4. ✅ Explain why sorting works

**Common mistakes to avoid:**
- ❌ Sorting by end time (wrong pattern)
- ❌ Using `<` instead of `<=` for overlap check
- ❌ Forgetting to take `max(last.end, curr.end)`

**Follow-up questions:**
- "What if we can't sort?" → Use interval tree
- "What if intervals are streaming?" → Online algorithm needed
