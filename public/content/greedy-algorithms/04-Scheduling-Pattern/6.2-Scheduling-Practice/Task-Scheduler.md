# Task Scheduler - Practice Problem

> **LeetCode 621:** [Task Scheduler](https://leetcode.com/problems/task-scheduler/)
> 
> **Difficulty:** Medium | **Pattern:** Greedy + Frequency | **Time:** O(n)

---

## 📋 Problem Statement

Given a characters array `tasks`, representing the tasks a CPU needs to do, where each letter represents a different task. Tasks could be done in any order. Each task is done in one unit of time. For each unit of time, the CPU could complete either one task or just be idle.

However, there is a non-negative integer `n` that represents the cooldown period between two **same** tasks (the same letter in the array), that is that there must be at least `n` units of time between any two same tasks.

Return the **least number of units of times** that the CPU will take to finish all the given tasks.

**Example 1:**
```
Input: tasks = ["A","A","A","B","B","B"], n = 2
Output: 8
Explanation: A -> B -> idle -> A -> B -> idle -> A -> B
```

**Example 2:**
```
Input: tasks = ["A","A","A","B","B","B"], n = 0
Output: 6
Explanation: Any permutation works. No cooldown needed.
```

**Example 3:**
```
Input: tasks = ["A","A","A","A","A","A","B","C","D","E","F","G"], n = 2
Output: 16
Explanation: A -> B -> C -> A -> D -> E -> A -> F -> G -> A -> idle -> idle -> A -> idle -> idle -> A
```

**Constraints:**
- 1 ≤ tasks.length ≤ 10^4
- tasks[i] is upper-case English letter
- 0 ≤ n ≤ 100

---

## 🎯 Pattern Recognition

**Key Insight:**
```
The most frequent task determines the minimum time!

If task A appears max_freq times with cooldown n:
  We need at least (max_freq - 1) * (n + 1) + count(max_freq) slots

Visual:
A appears 3 times, n = 2
A _ _ A _ _ A
  └─┘   └─┘
  n=2   n=2

Then fill in other tasks in the gaps.
```

**Greedy Choice:**
```
Prioritize the most frequent task.
Fill cooldown gaps with less frequent tasks.
Only need idle if we run out of other tasks.
```

---

## 📐 Solution Approach

### Formula Approach (Optimal)

```
Let max_freq = frequency of most common task
Let max_count = number of tasks with max_freq

Formula: max((max_freq - 1) * (n + 1) + max_count, len(tasks))

Visual explanation for A=3, B=2, C=2, n=2:
Frame: (max_freq - 1) groups of size (n + 1)
       [A _ _] [A _ _] [A]
       
Fill frame with other tasks:
       [A B C] [A B C] [A]
       
If tasks overflow frame, no idle needed.
```

### Algorithm

```
1. Count frequency of each task
2. Find max_freq and max_count
3. Calculate frame size: (max_freq - 1) * (n + 1) + max_count
4. Return max(frame_size, total_tasks)
```

---

## 💻 Solutions

### Solution 1: Formula (Optimal)

```python
from collections import Counter

def leastInterval(tasks: list[str], n: int) -> int:
    """
    Minimum time to complete all tasks with cooldown.
    
    Time: O(n), Space: O(1) (26 letters max)
    """
    # Count task frequencies
    freq = Counter(tasks)
    
    # Find max frequency
    max_freq = max(freq.values())
    
    # Count how many tasks have max frequency
    max_count = sum(1 for f in freq.values() if f == max_freq)
    
    # Calculate frame: (max_freq - 1) groups of (n + 1) slots + max_count
    frame_time = (max_freq - 1) * (n + 1) + max_count
    
    # Answer is max of frame time or total tasks (if no idle needed)
    return max(frame_time, len(tasks))
```

```javascript
function leastInterval(tasks, n) {
    // Count frequencies
    const freq = new Array(26).fill(0);
    for (const task of tasks) {
        freq[task.charCodeAt(0) - 65]++;
    }
    
    // Find max frequency
    const maxFreq = Math.max(...freq);
    
    // Count tasks with max frequency
    const maxCount = freq.filter(f => f === maxFreq).length;
    
    // Calculate frame time
    const frameTime = (maxFreq - 1) * (n + 1) + maxCount;
    
    return Math.max(frameTime, tasks.length);
}
```

---

### Solution 2: Simulation with Max Heap

```python
from collections import Counter
import heapq

def leastIntervalHeap(tasks: list[str], n: int) -> int:
    """
    Simulate using max heap.
    
    Time: O(n * m) where m = unique tasks, Space: O(m)
    """
    freq = Counter(tasks)
    
    # Max heap (negate for max behavior)
    heap = [-f for f in freq.values()]
    heapq.heapify(heap)
    
    time = 0
    
    while heap:
        cycle = []  # Tasks to do in this cycle
        
        # Try to do (n + 1) tasks in this cycle
        for _ in range(n + 1):
            if heap:
                count = -heapq.heappop(heap)
                if count > 1:
                    cycle.append(count - 1)
        
        # Put remaining tasks back
        for count in cycle:
            heapq.heappush(heap, -count)
        
        # Time for this cycle
        if heap:
            time += n + 1  # Full cycle with possible idle
        else:
            time += len(cycle) + (n + 1 - len(cycle)) * 0  # Last partial cycle
            # Actually: just count what we did in last iteration
    
    return time


# Cleaner heap simulation
def leastIntervalHeapClean(tasks: list[str], n: int) -> int:
    freq = Counter(tasks)
    heap = [-f for f in freq.values()]
    heapq.heapify(heap)
    
    time = 0
    
    while heap:
        temp = []
        cycle_len = min(len(heap), n + 1)
        
        for _ in range(n + 1):
            if heap:
                count = -heapq.heappop(heap)
                if count > 1:
                    temp.append(-(count - 1))
        
        for item in temp:
            heapq.heappush(heap, item)
        
        time += (n + 1) if heap else len(temp) + (n + 1 - len(temp)) - (n + 1 - cycle_len)
    
    # Simpler: just return formula result
    return time
```

---

## 🔍 Detailed Trace

```
Input: tasks = ["A","A","A","B","B","B"], n = 2

Step 1: Count frequencies
  freq = {"A": 3, "B": 3}

Step 2: Find max_freq
  max_freq = 3

Step 3: Count max_count
  max_count = 2 (both A and B have freq 3)

Step 4: Calculate frame
  frame_time = (3 - 1) * (2 + 1) + 2
             = 2 * 3 + 2
             = 8

Step 5: Compare with total tasks
  max(8, 6) = 8

Visual:
  [A B _] [A B _] [A B]
   └─────┘ └─────┘
   cycle 1  cycle 2  final

Output: 8
```

---

## 📊 Why the Formula Works

```
Consider the most frequent task appearing max_freq times.

We MUST have gaps between occurrences:
  Task: X _ _ X _ _ X _ _ ... X
        └─n─┘ └─n─┘

This creates (max_freq - 1) gaps, each of size n.
Total slots in gaps: (max_freq - 1) * n

Plus the max_freq task slots themselves: max_freq
Total minimum: max_freq + (max_freq - 1) * n
             = (max_freq - 1) * (n + 1) + 1

If multiple tasks have max_freq, they all go in the final "partial" slot:
             = (max_freq - 1) * (n + 1) + max_count

If we have enough other tasks to fill all gaps, no idle needed:
  Answer = max(frame_time, total_tasks)
```

---

## ⚠️ Edge Cases

| Case | Input | Output | Explanation |
|------|-------|--------|-------------|
| No cooldown | `["A","A","B","B"]`, n=0 | 4 | Any order |
| Single task | `["A"]`, n=5 | 1 | Just one task |
| All same | `["A","A","A"]`, n=2 | 7 | A_A_A |
| Enough variety | `["A","B","C","D"]`, n=2 | 4 | No idle |
| High cooldown | `["A","A"]`, n=10 | 12 | A___...___A |

---

## ⚡ Complexity Analysis

| Approach | Time | Space |
|----------|------|-------|
| Formula | O(n) | O(1) |
| Heap Simulation | O(n * m) | O(m) |

Where n = number of tasks, m = unique task types (max 26)

---

## 🔄 Variations

### Variation: Return the Schedule

```python
def leastIntervalWithSchedule(tasks, n):
    """Return actual schedule, not just time."""
    from collections import Counter
    import heapq
    
    freq = Counter(tasks)
    heap = [(-f, task) for task, f in freq.items()]
    heapq.heapify(heap)
    
    schedule = []
    
    while heap:
        cycle = []
        temp = []
        
        for _ in range(n + 1):
            if heap:
                count, task = heapq.heappop(heap)
                schedule.append(task)
                if count < -1:
                    temp.append((count + 1, task))
                cycle.append(task)
            elif temp or heap:
                schedule.append("idle")
        
        for item in temp:
            heapq.heappush(heap, item)
    
    # Remove trailing idles
    while schedule and schedule[-1] == "idle":
        schedule.pop()
    
    return schedule, len(schedule)
```

---

## 📝 Common Mistakes

### 1. Forgetting max_count

```python
# ❌ WRONG: Assuming only one max frequency task
frame = (max_freq - 1) * (n + 1) + 1

# ✅ CORRECT: Count all tasks with max frequency
frame = (max_freq - 1) * (n + 1) + max_count
```

### 2. Not Taking Max with Total

```python
# ❌ WRONG: Just returning frame
return frame_time

# ✅ CORRECT: May need more time if many unique tasks
return max(frame_time, len(tasks))
```

### 3. Off-by-One in Frame Calculation

```python
# ❌ WRONG: max_freq groups instead of max_freq - 1
frame = max_freq * (n + 1)

# ✅ CORRECT: Last occurrence doesn't need cooldown after it
frame = (max_freq - 1) * (n + 1) + max_count
```

---

## 🎤 Interview Tips

**Opening statement:**
```
"This is a scheduling problem with cooldown constraints.

Key insight: The most frequent task determines minimum time.
We need gaps of size n between same tasks.

I'll use a formula:
- frame = (max_freq - 1) * (n + 1) + max_count
- But if we have enough tasks, no idle needed

Answer = max(frame, total_tasks)

O(n) time, O(1) space (only 26 letters)."
```

**What to clarify:**
- "Can different tasks run back-to-back?" (Yes)
- "Do we need the actual schedule or just time?" (Usually just time)
- "Are tasks case-sensitive?" (Only uppercase per constraints)

**Follow-up questions:**
- "What if we want the actual schedule?" → Heap simulation
- "What if there are dependencies?" → Topological sort
- "What if different tasks have different cooldowns?" → More complex

---

## 🔗 Related Problems

| Problem | Relationship |
|---------|--------------|
| [Reorganize String](https://leetcode.com/problems/reorganize-string/) | Similar frequency analysis |
| [Rearrange String k Distance Apart](https://leetcode.com/problems/rearrange-string-k-distance-apart/) | Variable distance |
| [Course Schedule III](https://leetcode.com/problems/course-schedule-iii/) | Scheduling with deadlines |
