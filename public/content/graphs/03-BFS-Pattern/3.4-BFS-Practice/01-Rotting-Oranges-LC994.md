# LC 994: Rotting Oranges

> **The quintessential Multi-Source BFS problem**
>
> ⏱️ **Interview Time:** 20-25 min | 📊 **Difficulty:** Medium | 🎯 **Frequency:** Very High (Meta, Amazon favorite)

---

## Problem Statement

You are given an `m x n` grid where each cell can have one of three values:
- `0` = empty cell
- `1` = fresh orange
- `2` = rotten orange

Every minute, any fresh orange adjacent (4-directionally) to a rotten orange becomes rotten.

**Return the minimum number of minutes until no fresh orange remains. If impossible, return -1.**

```
Example 1:
Input:  [[2,1,1],
         [1,1,0],
         [0,1,1]]
Output: 4

Visualization:
Min 0: [2,1,1]    Min 1: [2,2,1]    Min 2: [2,2,2]
       [1,1,0]           [2,1,0]           [2,2,0]
       [0,1,1]           [0,1,1]           [0,2,1]

Min 3: [2,2,2]    Min 4: [2,2,2]
       [2,2,0]           [2,2,0]
       [0,2,2]           [0,2,2] ✓ All rotten!

Example 2:
Input:  [[2,1,1],
         [0,1,1],
         [1,0,1]]
Output: -1 (bottom-left orange is isolated)

Example 3:
Input:  [[0,2]]
Output: 0 (no fresh oranges)
```

---

## 🎯 Pattern Recognition

<details>
<summary><strong>Why This is Multi-Source BFS</strong></summary>

**Signals:**
1. "Every minute" → levels in BFS = time
2. Multiple rotten oranges spread "simultaneously" → multi-source
3. "Adjacent" → 4-directional grid traversal
4. "Minimum time" → BFS guarantees shortest path/time

**Key insight:**
All rotten oranges spread at the same time. If we start BFS from ALL rotten oranges simultaneously, each fresh orange will be reached by its nearest rotten orange first!

</details>

---

## 📐 Algorithm Steps

```
1. SCAN: Find all initially rotten oranges (sources)
         Count fresh oranges (to verify all rotted)

2. INITIALIZE: Add all rotten to queue at time=0

3. BFS: Spread from all rotten simultaneously
        - For each rotten orange, check 4 neighbors
        - If neighbor is fresh: rot it, add to queue
        - Track time = levels of BFS

4. CHECK: If fresh_count == 0, return max_time
          Else return -1
```

### Visual Step-by-Step

```
Initial:          t=0 Queue:          t=1 Process:
[2,1,1]           [(0,0,0)]          Rot (0,1) and (1,0)
[1,1,0]           ↓                  Queue: [(0,1,1), (1,0,1)]
[0,1,1]           fresh=6            fresh=4

t=1 Queue:        t=2 Process:        t=2 Queue:
[(0,1,1),(1,0,1)] Rot (0,2),(1,1)    [(0,2,2),(1,1,2)]
                  From (0,1): (0,2)   fresh=2
                  From (1,0): (1,1)

t=2 Queue:        t=3 Process:        t=3 Queue:
[(0,2,2),(1,1,2)] Rot (2,1)          [(2,1,3)]
                  From (1,1): (2,1)   fresh=1

t=3 Queue:        t=4 Process:        DONE!
[(2,1,3)]         Rot (2,2)          fresh=0
                  From (2,1): (2,2)   return 4
```

---

## 💻 Solution

**Python:**
```python
from collections import deque
from typing import List

def orangesRotting(grid: List[List[int]]) -> int:
    """
    Multi-Source BFS: All rotten oranges spread simultaneously.
    
    Time: O(m × n) - each cell visited at most once
    Space: O(m × n) - queue can hold all cells
    """
    rows, cols = len(grid), len(grid[0])
    DIRECTIONS = [(-1, 0), (1, 0), (0, -1), (0, 1)]
    
    # ═══════════════════════════════════════════════════════════
    # STEP 1: Find all rotten oranges and count fresh
    # ═══════════════════════════════════════════════════════════
    queue = deque()
    fresh_count = 0
    
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == 2:
                queue.append((r, c, 0))  # (row, col, time)
            elif grid[r][c] == 1:
                fresh_count += 1
    
    # ═══════════════════════════════════════════════════════════
    # EDGE CASE: No fresh oranges
    # ═══════════════════════════════════════════════════════════
    if fresh_count == 0:
        return 0
    
    # ═══════════════════════════════════════════════════════════
    # STEP 2: Multi-Source BFS
    # ═══════════════════════════════════════════════════════════
    max_time = 0
    
    while queue:
        row, col, time = queue.popleft()
        
        # Try to spread to all 4 neighbors
        for dr, dc in DIRECTIONS:
            new_row, new_col = row + dr, col + dc
            
            # Check bounds AND if it's a fresh orange
            if (0 <= new_row < rows and 
                0 <= new_col < cols and 
                grid[new_row][new_col] == 1):  # Fresh orange
                
                # Rot this orange
                grid[new_row][new_col] = 2
                fresh_count -= 1
                max_time = max(max_time, time + 1)
                queue.append((new_row, new_col, time + 1))
    
    # ═══════════════════════════════════════════════════════════
    # STEP 3: Check if all oranges rotted
    # ═══════════════════════════════════════════════════════════
    return max_time if fresh_count == 0 else -1


# ═══════════════════════════════════════════════════════════════
# Alternative: Level-by-Level BFS
# ═══════════════════════════════════════════════════════════════
def orangesRotting_levelByLevel(grid: List[List[int]]) -> int:
    """
    Alternative approach: process level by level.
    Cleaner time tracking, slightly more code.
    """
    rows, cols = len(grid), len(grid[0])
    DIRECTIONS = [(-1, 0), (1, 0), (0, -1), (0, 1)]
    
    queue = deque()
    fresh_count = 0
    
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == 2:
                queue.append((r, c))
            elif grid[r][c] == 1:
                fresh_count += 1
    
    if fresh_count == 0:
        return 0
    
    time = 0
    
    while queue:
        # Process all oranges at current time level
        level_size = len(queue)
        
        for _ in range(level_size):
            row, col = queue.popleft()
            
            for dr, dc in DIRECTIONS:
                new_row, new_col = row + dr, col + dc
                
                if (0 <= new_row < rows and 
                    0 <= new_col < cols and 
                    grid[new_row][new_col] == 1):
                    
                    grid[new_row][new_col] = 2
                    fresh_count -= 1
                    queue.append((new_row, new_col))
        
        # Only increment time if we rotted something this level
        if queue:  # Still have oranges to process
            time += 1
    
    return time if fresh_count == 0 else -1


# ═══════════════════════════════════════════════════════════════
# Tests
# ═══════════════════════════════════════════════════════════════
if __name__ == "__main__":
    # Test 1: Normal case
    grid1 = [[2,1,1],[1,1,0],[0,1,1]]
    print(f"Test 1: {orangesRotting([row[:] for row in grid1])}")  # 4
    
    # Test 2: Impossible
    grid2 = [[2,1,1],[0,1,1],[1,0,1]]
    print(f"Test 2: {orangesRotting([row[:] for row in grid2])}")  # -1
    
    # Test 3: No fresh oranges
    grid3 = [[0,2]]
    print(f"Test 3: {orangesRotting([row[:] for row in grid3])}")  # 0
    
    # Test 4: No rotten oranges but has fresh
    grid4 = [[1,1,1]]
    print(f"Test 4: {orangesRotting([row[:] for row in grid4])}")  # -1
    
    # Test 5: All empty
    grid5 = [[0]]
    print(f"Test 5: {orangesRotting([row[:] for row in grid5])}")  # 0
```

**JavaScript:**
```javascript
function orangesRotting(grid) {
    const rows = grid.length;
    const cols = grid[0].length;
    const DIRECTIONS = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    
    const queue = [];
    let freshCount = 0;
    
    // Find all rotten and count fresh
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (grid[r][c] === 2) {
                queue.push([r, c, 0]);
            } else if (grid[r][c] === 1) {
                freshCount++;
            }
        }
    }
    
    // Edge case: no fresh oranges
    if (freshCount === 0) return 0;
    
    let maxTime = 0;
    
    // Multi-source BFS
    while (queue.length > 0) {
        const [row, col, time] = queue.shift();
        
        for (const [dr, dc] of DIRECTIONS) {
            const newRow = row + dr;
            const newCol = col + dc;
            
            if (newRow >= 0 && newRow < rows &&
                newCol >= 0 && newCol < cols &&
                grid[newRow][newCol] === 1) {
                
                grid[newRow][newCol] = 2;
                freshCount--;
                maxTime = Math.max(maxTime, time + 1);
                queue.push([newRow, newCol, time + 1]);
            }
        }
    }
    
    return freshCount === 0 ? maxTime : -1;
}

// Test
console.log(orangesRotting([[2,1,1],[1,1,0],[0,1,1]])); // 4
console.log(orangesRotting([[2,1,1],[0,1,1],[1,0,1]])); // -1
console.log(orangesRotting([[0,2]])); // 0
```

---

## ⚡ Complexity Analysis

| Aspect | Complexity | Explanation |
|--------|------------|-------------|
| **Time** | O(m × n) | Each cell visited at most once |
| **Space** | O(m × n) | Queue can hold all cells in worst case |

### Detailed Breakdown

```
Time:
- Initial scan: O(m × n)
- BFS: Each cell enters queue at most once
- Each cell processed once with O(1) work
- Total: O(m × n)

Space:
- Queue: O(m × n) worst case (all cells rotten)
- No additional data structures (modify grid in place)
- Total: O(m × n)
```

---

## ⚠️ Common Mistakes

### 1. Forgetting Fresh Count Check

```python
# ❌ Wrong: Returns 0 even when no rotten oranges exist
if not queue:
    return 0  # Should check fresh_count!

# ✅ Correct
if fresh_count == 0:
    return 0
if not queue:
    return -1  # No rotten oranges but fresh exist
```

### 2. Off-by-One in Time Calculation

```python
# ❌ Wrong: Returns 1 when it should be 0
time = 1
while queue:
    # ...
    queue.append(...)
return time

# ✅ Correct: Start at 0, track max_time
max_time = 0
while queue:
    row, col, time = queue.popleft()
    # ...
    max_time = max(max_time, time + 1)
```

### 3. Modifying Grid Before All Reads

```python
# ❌ Wrong: Modifying grid affects other reads in same pass
# (This is actually fine for BFS since we use queue)

# ⚠️ Caution: If not using queue properly, might double-process
```

---

## 🔄 Follow-up Questions

### Q1: What if rotting takes different times?

> "Use Dijkstra's algorithm with a priority queue instead of regular BFS."

### Q2: What if oranges can un-rot?

> "Track state differently, possibly need different approach."

### Q3: Can you do this in-place without modifying the grid?

> "Use visited set: `visited = set(sources)`, check `(r,c) not in visited` instead of `grid[r][c] == 1`."

---

## 🎤 Interview Walkthrough

**Step 1: Understand and Clarify (1-2 min)**
> "So we have a grid with fresh and rotten oranges. Rotten ones spread to adjacent fresh ones each minute. I need to find the minimum time for all to rot, or -1 if some can never rot."

**Step 2: Discuss Approach (2-3 min)**
> "Since all rotten oranges spread simultaneously, this is multi-source BFS. I'll put all rotten oranges in a queue initially, then spread level by level. Each level represents one minute."

**Step 3: Handle Edge Cases**
> "Edge cases: no fresh oranges (return 0), no rotten oranges with fresh (return -1), isolated fresh oranges (return -1 after BFS)."

**Step 4: Code (8-10 min)**
> Write the solution, explaining as you go.

**Step 5: Test and Analyze (3-4 min)**
> "Time complexity is O(m×n) since each cell is processed once. Space is O(m×n) for the queue."

---

## ⏱️ Time Estimates

| Phase | Time |
|-------|------|
| Understand problem | 2 min |
| Identify pattern | 1 min |
| Plan approach | 2-3 min |
| Code solution | 8-10 min |
| Test and verify | 3-4 min |
| **Total** | **16-20 min** |

---

> **💡 Key Insight:** The "simultaneous spreading" is the clue for multi-source BFS. All rotten oranges start at the same "time = 0", and BFS levels naturally represent time progression.

> **🔗 Related:** [Multi-Source BFS](../3.3-Multi-Source-BFS.md) | [01 Matrix](./02-01-Matrix-LC542.md) | [Walls and Gates](./03-Walls-Gates-LC286.md)

---

**Previous:** [← 3.3 Multi-Source BFS](../3.3-Multi-Source-BFS.md)  
**Next:** [Word Ladder →](./02-Word-Ladder-LC127.md)
