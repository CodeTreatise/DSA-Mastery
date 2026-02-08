# Jump Game II - Practice Problem

> **LeetCode 45:** [Jump Game II](https://leetcode.com/problems/jump-game-ii/)
> 
> **Difficulty:** Medium | **Pattern:** Greedy + BFS Levels | **Time:** O(n)

---

## 📋 Problem Statement

You are given a **0-indexed** array of integers `nums` of length `n`. You are initially positioned at `nums[0]`.

Each element `nums[i]` represents the maximum length of a forward jump from index `i`. In other words, if you are at `nums[i]`, you can jump to any `nums[i + j]` where:
- `0 <= j <= nums[i]` and
- `i + j < n`

Return the **minimum number of jumps** to reach `nums[n - 1]`. The test cases are generated such that you can reach `nums[n - 1]`.

**Example 1:**
```
Input: nums = [2,3,1,1,4]
Output: 2
Explanation: The minimum number of jumps is 2.
Jump 1 step from index 0 to 1, then 3 steps to the last index.
```

**Example 2:**
```
Input: nums = [2,3,0,1,4]
Output: 2
```

**Constraints:**
- 1 ≤ nums.length ≤ 10^4
- 0 ≤ nums[i] ≤ 1000
- It's guaranteed that you can reach `nums[n - 1]`

---

## 🎯 Pattern Recognition

**Key Insight:**
```
Think of it like BFS levels without a queue!

Level 0: index 0
Level 1: all indices reachable from level 0
Level 2: all indices reachable from level 1
...

Minimum jumps = first level that includes the last index
```

**Greedy Choice:**
```
At each level, we extend our reach as far as possible.
When we exhaust the current level, we increment jumps
and move to the next level.
```

---

## 📐 Solution Approach

### Algorithm

```
Track two boundaries:
- current_end: farthest we can reach with current # of jumps
- farthest: farthest we can reach with one more jump

For each index i from 0 to n-2:
  1. Update farthest = max(farthest, i + nums[i])
  2. If i == current_end (reached boundary):
     - jumps++
     - current_end = farthest
```

### Visual Trace

```
nums = [2, 3, 1, 1, 4]
idx     0  1  2  3  4

Level visualization:
           jump=0  jump=1  jump=2
Index 0:   [──]
Index 1:          [─────────]
Index 2:          [───]
Result: We can reach index 4 with 2 jumps

Step by step:
i=0: farthest = max(0, 0+2) = 2
     i == current_end (0==0)? YES → jumps=1, current_end=2
     
i=1: farthest = max(2, 1+3) = 4
     i == current_end (1==2)? NO

i=2: farthest = max(4, 2+1) = 4  (no improvement)
     i == current_end (2==2)? YES → jumps=2, current_end=4
     4 >= 4 → We've reached the end!
     
Result: 2 jumps
```

---

## 💻 Solutions

### Solution 1: Greedy BFS (Optimal)

```python
def jump(nums: list[int]) -> int:
    """
    Minimum jumps to reach end using greedy BFS-style.
    
    Time: O(n), Space: O(1)
    """
    if len(nums) <= 1:
        return 0
    
    jumps = 0
    current_end = 0    # Farthest we can reach with 'jumps' jumps
    farthest = 0       # Farthest we can reach with 'jumps+1' jumps
    
    # Don't need to process last index (we're trying to reach it)
    for i in range(len(nums) - 1):
        # Update farthest we can reach
        farthest = max(farthest, i + nums[i])
        
        # Reached the end of current level
        if i == current_end:
            jumps += 1
            current_end = farthest
            
            # Early termination
            if current_end >= len(nums) - 1:
                break
    
    return jumps
```

```javascript
function jump(nums) {
    if (nums.length <= 1) return 0;
    
    let jumps = 0;
    let currentEnd = 0;
    let farthest = 0;
    
    for (let i = 0; i < nums.length - 1; i++) {
        farthest = Math.max(farthest, i + nums[i]);
        
        if (i === currentEnd) {
            jumps++;
            currentEnd = farthest;
            if (currentEnd >= nums.length - 1) break;
        }
    }
    
    return jumps;
}
```

---

### Solution 2: Actual BFS (Educational)

```python
from collections import deque

def jumpBFS(nums: list[int]) -> int:
    """
    Explicit BFS - O(n) time but O(n) space.
    Shows the BFS structure clearly.
    """
    if len(nums) <= 1:
        return 0
    
    visited = [False] * len(nums)
    queue = deque([(0, 0)])  # (index, jumps)
    visited[0] = True
    
    while queue:
        idx, jumps = queue.popleft()
        
        # Try all possible jumps from this position
        for next_idx in range(idx + 1, min(idx + nums[idx] + 1, len(nums))):
            if next_idx == len(nums) - 1:
                return jumps + 1
            
            if not visited[next_idx]:
                visited[next_idx] = True
                queue.append((next_idx, jumps + 1))
    
    return -1  # Cannot reach (shouldn't happen per constraints)
```

---

### Solution 3: DP (Reference - Slower)

```python
def jumpDP(nums: list[int]) -> int:
    """
    DP approach - O(n²) - for educational purposes.
    """
    n = len(nums)
    dp = [float('inf')] * n
    dp[0] = 0
    
    for i in range(n):
        for j in range(1, nums[i] + 1):
            if i + j < n:
                dp[i + j] = min(dp[i + j], dp[i] + 1)
    
    return dp[n - 1]
```

---

## 🔍 Detailed Trace

```
Input: [2, 3, 1, 1, 4]
n = 5, target = index 4

Initialize:
  jumps = 0
  current_end = 0
  farthest = 0

i=0:
  farthest = max(0, 0+2) = 2
  i == current_end? (0 == 0) YES
    jumps = 1
    current_end = 2
  current_end >= 4? NO

i=1:
  farthest = max(2, 1+3) = 4
  i == current_end? (1 == 2) NO

i=2:
  farthest = max(4, 2+1) = 4
  i == current_end? (2 == 2) YES
    jumps = 2
    current_end = 4
  current_end >= 4? YES → break!

Result: 2 jumps
```

---

## 📊 Why This Works (BFS Intuition)

```
Think of the array as a graph where edges connect i → [i+1, i+nums[i]]

BFS finds shortest path in unweighted graph.
Our greedy approach simulates BFS level-by-level:

Level 0: {0}
  From 0, can reach 1,2 (nums[0]=2)
Level 1: {1, 2}
  From 1, can reach 2,3,4 (nums[1]=3)
  From 2, can reach 3 (nums[2]=1)
  Combined reach: {2,3,4}
Level 2: {3, 4}
  4 is our target → reached in 2 jumps!

We don't need a queue because we process indices in order.
'current_end' marks the end of current BFS level.
'farthest' marks the end of next BFS level.
```

---

## ⚠️ Edge Cases

| Case | Input | Output | Explanation |
|------|-------|--------|-------------|
| Single element | `[0]` | `0` | Already at end |
| Two elements | `[1,1]` | `1` | One jump |
| Large first jump | `[10,1,1,1,1]` | `1` | Jump directly |
| Zero in path | `[2,3,0,1,4]` | `2` | Jump over zero |
| All ones | `[1,1,1,1]` | `3` | Step by step |

---

## ⚡ Complexity Analysis

| Approach | Time | Space |
|----------|------|-------|
| Greedy BFS | O(n) | O(1) |
| Actual BFS | O(n) | O(n) |
| DP | O(n²) | O(n) |

### Why Greedy is O(n)

```
- We iterate through array once: O(n)
- Each iteration: O(1) operations
- No nested loops despite BFS logic
- The 'level transitions' happen naturally
```

---

## 🔄 Comparison to Jump Game I

| Aspect | Jump Game (LC 55) | Jump Game II (LC 45) |
|--------|-------------------|----------------------|
| Question | Can we reach? | Minimum jumps? |
| Track | max_reachable only | current_end + farthest |
| Return | boolean | integer |
| Logic | Just check reach | Count level transitions |

```python
# Jump Game I - simpler
max_reach = 0
for i in range(len(nums)):
    if i > max_reach: return False
    max_reach = max(max_reach, i + nums[i])
return True

# Jump Game II - adds level tracking
jumps = 0
current_end = farthest = 0
for i in range(len(nums) - 1):
    farthest = max(farthest, i + nums[i])
    if i == current_end:
        jumps += 1
        current_end = farthest
return jumps
```

---

## 📝 Common Mistakes

### 1. Including Last Index in Loop

```python
# ❌ WRONG: Loop includes last index
for i in range(len(nums)):  # Counts extra jump at end

# ✅ CORRECT: Stop before last
for i in range(len(nums) - 1):  # We're trying to REACH last, not jump FROM it
```

### 2. Not Handling Single Element

```python
# ❌ WRONG: Assumes length > 1
# May have indexing issues

# ✅ CORRECT: Handle explicitly
if len(nums) <= 1:
    return 0
```

### 3. Incrementing Jumps Wrong Time

```python
# ❌ WRONG: Increment at start of loop
for i in range(len(nums) - 1):
    jumps += 1  # Wrong!

# ✅ CORRECT: Increment only when hitting boundary
if i == current_end:
    jumps += 1
```

---

## 🎤 Interview Tips

**Opening statement:**
```
"This is minimum jumps, so I'll use a BFS-style approach.

I track two things:
1. current_end: farthest reachable with current jumps
2. farthest: farthest reachable with one more jump

When I hit current_end, I've exhausted the current 'level',
so I increment jumps and extend to farthest.

O(n) time, O(1) space."
```

**Follow-up questions:**
- "What if not guaranteed reachable?" → Add check before returning
- "What if we want the actual path?" → Track previous index
- "What if jumps have costs?" → Use DP or Dijkstra

---

## 🔗 Related Problems

| Problem | Relationship |
|---------|--------------|
| [Jump Game](https://leetcode.com/problems/jump-game/) | Reachability only |
| [Jump Game III](https://leetcode.com/problems/jump-game-iii/) | BFS, start anywhere |
| [Jump Game IV](https://leetcode.com/problems/jump-game-iv/) | BFS with teleports |
| [Frog Jump](https://leetcode.com/problems/frog-jump/) | DP, variable jumps |
