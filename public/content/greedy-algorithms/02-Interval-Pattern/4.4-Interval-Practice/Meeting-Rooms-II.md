# Meeting Rooms II - Practice Problem

> **LeetCode 253:** [Meeting Rooms II](https://leetcode.com/problems/meeting-rooms-ii/)
> 
> **Difficulty:** Medium | **Pattern:** Interval + Heap/Sweep | **Time:** O(n log n)

---

## 📋 Problem Statement

Given an array of meeting time intervals `intervals` where `intervals[i] = [start_i, end_i]`, return the **minimum number of conference rooms required**.

**Example 1:**
```
Input: intervals = [[0,30],[5,10],[15,20]]
Output: 2
Explanation: 
- Meeting 1: [0,30] needs room A
- Meeting 2: [5,10] starts while meeting 1 is ongoing → needs room B
- Meeting 3: [15,20] starts while meeting 1 is ongoing → needs room B (meeting 2 ended)
```

**Example 2:**
```
Input: intervals = [[7,10],[2,4]]
Output: 1
Explanation: No overlap, one room is enough.
```

**Constraints:**
- 1 ≤ intervals.length ≤ 10^4
- 0 ≤ start_i < end_i ≤ 10^6

---

## 🎯 Pattern Recognition

**This is different from Activity Selection!**

```
Activity Selection: Pick max non-overlapping (one person)
Meeting Rooms II: Accommodate ALL meetings (min resources)

Different question = different approach!
```

**Key Insight:**
```
Rooms needed = Maximum simultaneous overlap at any time

When a meeting starts:
  - Can we reuse a room that freed up?
  - Or do we need a new room?

Track earliest ending meeting → use MIN-HEAP
```

---

## 📐 Solution Approaches

### Approach 1: Min-Heap (Recommended)

```
Algorithm:
1. Sort meetings by START time
2. Use min-heap to track END times of ongoing meetings
3. For each meeting:
   - If heap.top() <= current_start: pop (room freed)
   - Push current_end (assign room)
4. Heap size = rooms in use
```

### Approach 2: Sweep Line / Two Pointers

```
Algorithm:
1. Extract all START times, sort
2. Extract all END times, sort
3. Two pointers: when start < end, need new room
4. When start >= end, reuse room
```

---

## 💻 Solutions

### Solution 1: Min-Heap (Python)

```python
import heapq

def minMeetingRooms(intervals: list[list[int]]) -> int:
    """
    Minimum meeting rooms using min-heap.
    
    Heap stores end times of meetings in progress.
    Size of heap = rooms currently in use.
    
    Time: O(n log n), Space: O(n)
    """
    if not intervals:
        return 0
    
    # Sort by start time
    intervals.sort(key=lambda x: x[0])
    
    # Min-heap of end times
    heap = []
    
    for start, end in intervals:
        # Check if earliest ending meeting has ended
        if heap and heap[0] <= start:
            heapq.heappop(heap)  # Reuse that room
        
        # Assign room to current meeting
        heapq.heappush(heap, end)
    
    # Heap size = max rooms needed
    return len(heap)
```

### Solution 1: Min-Heap (JavaScript)

```javascript
// Using a simple implementation since JS lacks built-in heap
function minMeetingRooms(intervals) {
    if (intervals.length === 0) return 0;
    
    intervals.sort((a, b) => a[0] - b[0]);
    
    // Track end times (simple approach for small inputs)
    const endTimes = [];
    
    for (const [start, end] of intervals) {
        // Find if any room is free
        let roomFreed = false;
        for (let i = 0; i < endTimes.length; i++) {
            if (endTimes[i] <= start) {
                endTimes[i] = end;  // Reuse room
                roomFreed = true;
                break;
            }
        }
        
        if (!roomFreed) {
            endTimes.push(end);  // Need new room
        }
    }
    
    return endTimes.length;
}
```

---

### Solution 2: Sweep Line / Two Pointers

```python
def minMeetingRoomsSweep(intervals: list[list[int]]) -> int:
    """
    Sweep line approach using sorted start and end times.
    
    Time: O(n log n), Space: O(n)
    """
    if not intervals:
        return 0
    
    # Separate and sort start/end times
    starts = sorted([i[0] for i in intervals])
    ends = sorted([i[1] for i in intervals])
    
    rooms = 0
    end_ptr = 0
    
    for start in starts:
        if start < ends[end_ptr]:
            # Meeting starts before earliest end → need new room
            rooms += 1
        else:
            # A meeting ended → reuse room
            end_ptr += 1
    
    return rooms
```

```javascript
function minMeetingRoomsSweep(intervals) {
    if (intervals.length === 0) return 0;
    
    const starts = intervals.map(i => i[0]).sort((a, b) => a - b);
    const ends = intervals.map(i => i[1]).sort((a, b) => a - b);
    
    let rooms = 0;
    let endPtr = 0;
    
    for (const start of starts) {
        if (start < ends[endPtr]) {
            rooms++;
        } else {
            endPtr++;
        }
    }
    
    return rooms;
}
```

---

### Solution 3: Event-Based Sweep

```python
def minMeetingRoomsEvents(intervals: list[list[int]]) -> int:
    """
    Event-based approach: track room changes at each time.
    
    +1 when meeting starts, -1 when meeting ends.
    Max running sum = max rooms.
    
    Time: O(n log n), Space: O(n)
    """
    events = []
    
    for start, end in intervals:
        events.append((start, 1))   # +1 room needed
        events.append((end, -1))    # -1 room freed
    
    # Sort by time; if tie, process ends before starts
    events.sort(key=lambda x: (x[0], x[1]))
    
    current_rooms = 0
    max_rooms = 0
    
    for time, delta in events:
        current_rooms += delta
        max_rooms = max(max_rooms, current_rooms)
    
    return max_rooms
```

---

## 🔍 Detailed Trace (Heap Approach)

```
Input: [[0,30],[5,10],[15,20]]

Step 1: Sort by start → [[0,30],[5,10],[15,20]]

Step 2: Process meetings

Meeting [0,30]:
  - heap is empty
  - Push end=30
  - heap = [30]
  - Rooms in use: 1

Meeting [5,10]:
  - heap[0] = 30
  - 30 <= 5? NO → no room freed
  - Push end=10
  - heap = [10, 30]
  - Rooms in use: 2 ← MAX

Meeting [15,20]:
  - heap[0] = 10
  - 10 <= 15? YES → room freed! Pop 10
  - heap = [30]
  - Push end=20
  - heap = [20, 30]
  - Rooms in use: 2

Result: max(heap) = 2 rooms needed ✓
```

---

## 🔍 Trace (Sweep Line Approach)

```
Input: [[0,30],[5,10],[15,20]]

starts = [0, 5, 15]
ends   = [10, 20, 30]

Process:
  start=0: 0 < ends[0]=10? YES → rooms++ → rooms=1
  start=5: 5 < ends[0]=10? YES → rooms++ → rooms=2
  start=15: 15 < ends[0]=10? NO → end_ptr++ → reuse

Result: 2 rooms ✓
```

---

## ⚠️ Edge Cases

| Case | Input | Output | Explanation |
|------|-------|--------|-------------|
| Empty | `[]` | `0` | No meetings |
| Single | `[[1,5]]` | `1` | One room |
| No overlap | `[[1,2],[3,4]]` | `1` | Sequential |
| All overlap | `[[1,5],[1,5],[1,5]]` | `3` | All concurrent |
| Touching | `[[1,2],[2,3]]` | `1` | 2==2, room freed |
| Nested | `[[1,10],[2,3],[4,5]]` | `2` | [2,3] inside [1,10] |

---

## ⚡ Complexity Comparison

| Approach | Time | Space | Notes |
|----------|------|-------|-------|
| Min-Heap | O(n log n) | O(n) | Most intuitive |
| Two Pointers | O(n log n) | O(n) | Elegant |
| Event Sweep | O(n log n) | O(n) | Most general |

All approaches have same complexity!

---

## 🔄 Why This Works

### Min-Heap Intuition

```
The heap is like a "room tracker":
- Each element = end time of a meeting in a room
- heap[0] = earliest ending meeting
- If new meeting starts after heap[0]: reuse that room
- If new meeting starts before heap[0]: need new room

Max heap size = max concurrent meetings = rooms needed
```

### Two Pointers Intuition

```
Think of it as a timeline:
- Walking through all start times
- For each start: has some meeting ended?
  - YES (start >= end) → reuse room, advance end pointer
  - NO (start < end) → need new room

We never decrease rooms because we track MAX needed.
```

---

## 📝 Variation: Track Which Room

```python
def minMeetingRoomsWithAssignment(intervals):
    """
    Return room assignments, not just count.
    """
    import heapq
    
    if not intervals:
        return []
    
    # Add original indices
    indexed = [(start, end, i) for i, (start, end) in enumerate(intervals)]
    indexed.sort(key=lambda x: x[0])
    
    # Heap: (end_time, room_number)
    heap = []
    assignments = [0] * len(intervals)
    next_room = 0
    
    for start, end, orig_idx in indexed:
        if heap and heap[0][0] <= start:
            _, room = heapq.heappop(heap)
        else:
            room = next_room
            next_room += 1
        
        assignments[orig_idx] = room
        heapq.heappush(heap, (end, room))
    
    return assignments
```

---

## 🎤 Interview Tips

**Opening statement:**
```
"This asks for MINIMUM rooms to fit ALL meetings - different 
from activity selection. I need to find maximum concurrent overlap.

I'll use a min-heap approach:
1. Sort meetings by start time
2. Heap tracks end times of meetings in progress
3. For each meeting, check if we can reuse a room
4. Heap size at end = rooms needed

O(n log n) time, O(n) space."
```

**What to clarify:**
- "Is a meeting at [1,2] and [2,3] overlap?" (Usually no)
- "Can I modify the input?"
- "Are times guaranteed valid (start < end)?"

**Follow-up questions:**
- "Can you do it without heap?" → Two pointers / sweep line
- "What if meetings have priorities?" → More complex scheduling
- "What if rooms have different sizes?" → Assignment problem

---

## 🔗 Related Problems

| Problem | Relationship |
|---------|--------------|
| [Meeting Rooms](https://leetcode.com/problems/meeting-rooms/) | Check if 1 room is enough |
| [Car Pooling](https://leetcode.com/problems/car-pooling/) | Same sweep pattern |
| [My Calendar II](https://leetcode.com/problems/my-calendar-ii/) | Dynamic booking |
| [Employee Free Time](https://leetcode.com/problems/employee-free-time/) | Find gaps |
