# LC 733: Flood Fill

> **The simplest grid DFS problem - perfect for learning the pattern**
>
> ⏱️ **Interview Time:** 10-15 min | 📊 **Difficulty:** Easy | 🎯 **Frequency:** High

---

## Problem Statement

Given an `m x n` image represented by a 2D array, a starting pixel `(sr, sc)`, and a new color, perform a **flood fill**.

Fill all connected pixels of the same color as the starting pixel with the new color.

```
Example:
Input: 
image = [[1,1,1],
         [1,1,0],
         [1,0,1]]
sr = 1, sc = 1, color = 2

Output:
        [[2,2,2],
         [2,2,0],
         [2,0,1]]

Explanation: Starting from (1,1), fill all connected 1s with 2
```

---

## 🎯 Pattern Recognition

**This is a flood fill / connected component problem:**
- Start from a single source
- Spread to all connected cells with same value
- Classic DFS/BFS application

---

## 📐 Algorithm

```
1. Get the original color at starting position
2. If original color == new color, return (no change needed)
3. DFS/BFS from starting position:
   - Change current cell to new color
   - Recursively process all valid neighbors with original color

Visualization:
Start at (1,1), fill with 2:

1 1 1     2 1 1     2 2 1     2 2 2     2 2 2
1 1 0  →  1 1 0  →  2 1 0  →  2 2 0  →  2 2 0
1 0 1     1 0 1     1 0 1     2 0 1     2 0 1
```

---

## 💻 Solution

**Python:**
```python
from typing import List

def floodFill(image: List[List[int]], sr: int, sc: int, color: int) -> List[List[int]]:
    """
    Flood fill starting from (sr, sc) with new color.
    
    Time: O(m × n) - visit each cell at most once
    Space: O(m × n) - recursion stack
    """
    original_color = image[sr][sc]
    
    # Edge case: no change needed
    if original_color == color:
        return image
    
    rows, cols = len(image), len(image[0])
    
    def dfs(r, c):
        # Base case: out of bounds or different color
        if r < 0 or r >= rows or c < 0 or c >= cols:
            return
        if image[r][c] != original_color:
            return
        
        # Fill with new color
        image[r][c] = color
        
        # Explore all 4 directions
        dfs(r + 1, c)
        dfs(r - 1, c)
        dfs(r, c + 1)
        dfs(r, c - 1)
    
    dfs(sr, sc)
    return image


# BFS version
from collections import deque

def floodFill_bfs(image: List[List[int]], sr: int, sc: int, color: int) -> List[List[int]]:
    """BFS approach."""
    original = image[sr][sc]
    
    if original == color:
        return image
    
    rows, cols = len(image), len(image[0])
    queue = deque([(sr, sc)])
    image[sr][sc] = color
    
    while queue:
        r, c = queue.popleft()
        
        for dr, dc in [(0,1), (0,-1), (1,0), (-1,0)]:
            nr, nc = r + dr, c + dc
            if 0 <= nr < rows and 0 <= nc < cols and image[nr][nc] == original:
                image[nr][nc] = color
                queue.append((nr, nc))
    
    return image


# Test
image = [[1,1,1],[1,1,0],[1,0,1]]
print(floodFill([row[:] for row in image], 1, 1, 2))
# [[2,2,2],[2,2,0],[2,0,1]]
```

**JavaScript:**
```javascript
function floodFill(image, sr, sc, color) {
    const originalColor = image[sr][sc];
    
    if (originalColor === color) return image;
    
    const rows = image.length, cols = image[0].length;
    
    function dfs(r, c) {
        if (r < 0 || r >= rows || c < 0 || c >= cols) return;
        if (image[r][c] !== originalColor) return;
        
        image[r][c] = color;
        
        dfs(r + 1, c);
        dfs(r - 1, c);
        dfs(r, c + 1);
        dfs(r, c - 1);
    }
    
    dfs(sr, sc);
    return image;
}
```

---

## ⚡ Complexity Analysis

| Aspect | Complexity | Notes |
|--------|------------|-------|
| **Time** | O(m × n) | Each cell visited at most once |
| **Space** | O(m × n) | Recursion stack in worst case |

---

## ⚠️ Common Mistakes

### 1. Forgetting the Same-Color Check

```python
# ❌ Wrong: Infinite recursion when color == original
def floodFill(image, sr, sc, color):
    original = image[sr][sc]
    def dfs(r, c):
        if image[r][c] != original:  # Never false if color == original
            return
        image[r][c] = color  # Still equals original!
        dfs(r+1, c)  # Infinite loop!

# ✅ Correct: Check at the start
def floodFill(image, sr, sc, color):
    original = image[sr][sc]
    if original == color:  # Early exit
        return image
```

### 2. Not Marking Before Recursing

```python
# ❌ Wrong: May revisit cells
def dfs(r, c):
    if image[r][c] != original:
        return
    dfs(r+1, c)  # Might come back here!
    image[r][c] = color  # Too late

# ✅ Correct: Mark first
def dfs(r, c):
    if image[r][c] != original:
        return
    image[r][c] = color  # Mark first
    dfs(r+1, c)
```

---

## 🎤 Interview Walkthrough

**Clarify (30 sec):**
> "So I start at (sr, sc) and change all connected pixels of the same color to the new color. Connected means up/down/left/right, not diagonals?"

**Approach (1 min):**
> "I'll use DFS. First check if the new color equals the original - if so, nothing to do. Otherwise, recursively fill all connected cells."

**Code (5-7 min):**
> Write the DFS solution with clear base cases.

**Edge cases to mention:**
- Same color (avoid infinite loop)
- Single cell grid
- Already all same color

---

## 📝 Related Problems

| Problem | Similarity | Link |
|---------|------------|------|
| Number of Islands | Multiple sources | [LC 200](https://leetcode.com/problems/number-of-islands/) |
| Max Area of Island | With counting | [LC 695](https://leetcode.com/problems/max-area-of-island/) |
| Surrounded Regions | Boundary handling | [LC 130](https://leetcode.com/problems/surrounded-regions/) |

---

> **💡 Key Insight:** Flood fill is the simplest form of connected component traversal. The critical edge case is when new color equals original color - you must check this to avoid infinite recursion.

---

**Next:** [Shortest Bridge →](./02-Shortest-Bridge-LC934.md)
