# LC 130: Surrounded Regions

> **Boundary DFS - save cells connected to boundary, capture the rest**
>
> ⏱️ **Interview Time:** 15-20 min | 📊 **Difficulty:** Medium | 🎯 **Frequency:** High

---

## Problem Statement

Given an `m x n` matrix `board` containing `'X'` and `'O'`:
- **Capture** all regions of `'O'` that are **surrounded by 'X'**.
- A region is captured by flipping all `'O'`s to `'X'`s.
- A region is **NOT** surrounded if it's connected to the boundary.

```
Example:
Input:                    Output:
X X X X                   X X X X
X O O X        →          X X X X
X X O X                   X X X X
X O X X                   X O X X

Explanation:
- The O in bottom-left is connected to boundary → NOT captured
- All other O's are surrounded → captured (flipped to X)
```

---

## 🎯 Pattern Recognition

<details>
<summary><strong>Why Boundary DFS?</strong></summary>

**Key insight:**
- O's connected to boundary can NEVER be captured
- All other O's are surrounded and SHOULD be captured

**Strategy (reverse thinking):**
1. Find all O's connected to boundary (mark them as "safe")
2. Flip all remaining O's to X (they're surrounded)
3. Restore safe O's back to O

</details>

---

## 📐 Algorithm

```
Phase 1: Mark boundary-connected O's as 'T' (temporary)
- DFS from all boundary O's
- Mark them as 'T' to protect them

Phase 2: Capture surrounded O's
- Scan entire board
- 'O' → 'X' (surrounded, capture it)
- 'T' → 'O' (was safe, restore it)

Visualization:
Original:     After Phase 1:    After Phase 2:
X X X X       X X X X           X X X X
X O O X   →   X O O X       →   X X X X
X X O X       X X O X           X X X X
X O X X       X T X X           X O X X
              ↑ Connected       ↑ Restored
                to boundary
```

---

## 💻 Solution

**Python:**
```python
from typing import List

def solve(board: List[List[str]]) -> None:
    """
    Capture surrounded regions in-place.
    
    Time: O(m × n)
    Space: O(m × n) for recursion stack
    """
    if not board or not board[0]:
        return
    
    rows, cols = len(board), len(board[0])
    
    def dfs(r, c):
        """Mark O's connected to boundary as 'T' (temporary safe)."""
        if r < 0 or r >= rows or c < 0 or c >= cols:
            return
        if board[r][c] != 'O':
            return
        
        board[r][c] = 'T'  # Mark as safe
        
        dfs(r + 1, c)
        dfs(r - 1, c)
        dfs(r, c + 1)
        dfs(r, c - 1)
    
    # Phase 1: DFS from all boundary O's
    # Top and bottom rows
    for c in range(cols):
        dfs(0, c)
        dfs(rows - 1, c)
    
    # Left and right columns
    for r in range(rows):
        dfs(r, 0)
        dfs(r, cols - 1)
    
    # Phase 2: Capture and restore
    for r in range(rows):
        for c in range(cols):
            if board[r][c] == 'O':
                board[r][c] = 'X'  # Capture surrounded
            elif board[r][c] == 'T':
                board[r][c] = 'O'  # Restore safe


# BFS version
from collections import deque

def solve_bfs(board: List[List[str]]) -> None:
    """BFS approach - better for large boards."""
    if not board or not board[0]:
        return
    
    rows, cols = len(board), len(board[0])
    
    def bfs(start_r, start_c):
        """Mark boundary-connected O's."""
        if board[start_r][start_c] != 'O':
            return
        
        queue = deque([(start_r, start_c)])
        board[start_r][start_c] = 'T'
        
        while queue:
            r, c = queue.popleft()
            
            for dr, dc in [(0,1), (0,-1), (1,0), (-1,0)]:
                nr, nc = r + dr, c + dc
                if 0 <= nr < rows and 0 <= nc < cols and board[nr][nc] == 'O':
                    board[nr][nc] = 'T'
                    queue.append((nr, nc))
    
    # Phase 1: Mark boundary-connected
    for c in range(cols):
        bfs(0, c)
        bfs(rows - 1, c)
    for r in range(rows):
        bfs(r, 0)
        bfs(r, cols - 1)
    
    # Phase 2: Capture and restore
    for r in range(rows):
        for c in range(cols):
            if board[r][c] == 'O':
                board[r][c] = 'X'
            elif board[r][c] == 'T':
                board[r][c] = 'O'


# Test
board = [
    ['X','X','X','X'],
    ['X','O','O','X'],
    ['X','X','O','X'],
    ['X','O','X','X']
]
solve(board)
print(board)
# [['X','X','X','X'],
#  ['X','X','X','X'],
#  ['X','X','X','X'],
#  ['X','O','X','X']]
```

**JavaScript:**
```javascript
function solve(board) {
    if (!board || !board[0]) return;
    
    const rows = board.length, cols = board[0].length;
    
    function dfs(r, c) {
        if (r < 0 || r >= rows || c < 0 || c >= cols) return;
        if (board[r][c] !== 'O') return;
        
        board[r][c] = 'T';
        
        dfs(r + 1, c);
        dfs(r - 1, c);
        dfs(r, c + 1);
        dfs(r, c - 1);
    }
    
    // Phase 1: Mark boundary O's
    for (let c = 0; c < cols; c++) {
        dfs(0, c);
        dfs(rows - 1, c);
    }
    for (let r = 0; r < rows; r++) {
        dfs(r, 0);
        dfs(r, cols - 1);
    }
    
    // Phase 2: Capture and restore
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (board[r][c] === 'O') {
                board[r][c] = 'X';
            } else if (board[r][c] === 'T') {
                board[r][c] = 'O';
            }
        }
    }
}
```

---

## ⚡ Complexity Analysis

| Aspect | Complexity | Notes |
|--------|------------|-------|
| **Time** | O(m × n) | Each cell visited at most twice |
| **Space** | O(m × n) | Recursion stack (DFS) or queue (BFS) |

---

## 🔄 Variations

| Variation | Difference | Problem |
|-----------|------------|---------|
| Count enclaves | Count instead of modify | LC 1020 |
| Number of closed islands | Islands not touching boundary | LC 1254 |
| Make island bigger | Different modification | LC 1034 |

---

## ⚠️ Common Mistakes

### 1. Trying to Detect "Surrounded" Directly

```python
# ❌ Wrong approach: Try to detect if region is surrounded
def is_surrounded(r, c, visited):
    # Complex logic to check if touching boundary
    # Easy to miss edge cases!

# ✅ Correct: Reverse thinking - mark what's NOT surrounded
# Much simpler: boundary-connected = not surrounded
```

### 2. Forgetting to Restore Safe Cells

```python
# ❌ Wrong: Forget to change T back to O
for r in range(rows):
    for c in range(cols):
        if board[r][c] == 'O':
            board[r][c] = 'X'
        # Missing: T → O restoration!

# ✅ Correct: Handle both cases
if board[r][c] == 'O':
    board[r][c] = 'X'
elif board[r][c] == 'T':
    board[r][c] = 'O'
```

### 3. Not Handling All Boundaries

```python
# ❌ Wrong: Only checking some boundaries
for c in range(cols):
    dfs(0, c)  # Only top row!

# ✅ Correct: Check all 4 boundaries
for c in range(cols):
    dfs(0, c)          # Top
    dfs(rows - 1, c)   # Bottom
for r in range(rows):
    dfs(r, 0)          # Left
    dfs(r, cols - 1)   # Right
```

---

## 🎤 Interview Walkthrough

**Clarify (1 min):**
> "So 'surrounded' means the region doesn't touch any boundary. I need to capture (flip to X) all surrounded O regions in place."

**Key insight:**
> "Rather than checking if each O region is surrounded, I'll reverse the logic: find all O's connected to boundary (they're safe), then capture everything else."

**Approach (1 min):**
> "Three steps:
> 1. DFS from boundary O's, mark them as 'T' (temporary safe)
> 2. Scan board: O→X (surrounded), T→O (restore safe)
> Done in O(m×n) time."

**Code (8-10 min):**
> Write the solution with clear phase comments.

---

## 📝 Related Problems

| Problem | Similarity | Link |
|---------|------------|------|
| Number of Enclaves | Count boundary-disconnected | [LC 1020](https://leetcode.com/problems/number-of-enclaves/) |
| Closed Islands | Similar concept | [LC 1254](https://leetcode.com/problems/number-of-closed-islands/) |
| Pacific Atlantic | Boundary reachability | [LC 417](https://leetcode.com/problems/pacific-atlantic-water-flow/) |

---

> **💡 Key Insight:** When dealing with "surrounded" or "enclosed" regions, reverse the problem: find what's NOT surrounded (boundary-connected), then handle the rest. This avoids complex surrounded-detection logic.

---

**Back:** [← Pacific Atlantic](./03-Pacific-Atlantic-LC417.md)
