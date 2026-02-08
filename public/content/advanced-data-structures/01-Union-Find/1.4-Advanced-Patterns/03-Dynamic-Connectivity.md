# Dynamic Connectivity

> **Handle connectivity queries as edges are added incrementally (online).**
>
> Classic example: Number of Islands II - count islands as land cells are added one by one.

---

## 🎯 Pattern Recognition

<details>
<summary><strong>How to Identify This Pattern</strong></summary>

**Problem statement signals:**
- "Process queries in order"
- "Add elements/connections incrementally"
- "After each addition, return [count/status/result]"
- "Online algorithm" or "streaming"
- Grid problems with "adding land" cells

**Key characteristics:**
- Elements/connections added over time
- Need answer after each addition
- Can't look ahead at future operations
- Union-Find supports only additions (not deletions)

</details>

---

## ✅ When to Use

| Scenario | Why Union-Find |
|----------|----------------|
| Edges added incrementally | Union is O(α(n)) |
| Need answer after each addition | Query is O(α(n)) |
| Count components dynamically | Track during unions |
| Check connectivity dynamically | Same root = connected |

---

## ❌ When NOT to Use

| Scenario | Better Alternative |
|----------|-------------------|
| Edges can be removed | Link-Cut Trees |
| Static graph queries | Precompute once |
| Need shortest paths | BFS/Dijkstra |
| Need all paths | DFS |

---

## 📐 Core Concept

### The Challenge

```
Traditional approach for each query:
1. Add element/connection
2. Rebuild entire graph
3. Run BFS/DFS to count components
→ O(n + m) per query → O(q * (n + m)) total

Union-Find approach:
1. Add element/connection
2. Update Union-Find (O(α(n)))
3. Return count (O(1))
→ O(α(n)) per query → O(q * α(n)) total
```

---

## 💻 LeetCode 305: Number of Islands II

> Given a 2D grid of 0s (water), add land cells one by one. After each addition, return the number of islands.

**Key insight:** When adding land, check 4 neighbors. Each water neighbor = nothing. Each land neighbor = potential union (might reduce count).

**Python:**
```python
from typing import List

class UnionFind:
    def __init__(self, n: int):
        self.parent = list(range(n))
        self.rank = [0] * n
        self.count = 0  # Start with 0, add as land is created
    
    def find(self, x: int) -> int:
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])
        return self.parent[x]
    
    def union(self, x: int, y: int) -> bool:
        root_x, root_y = self.find(x), self.find(y)
        if root_x == root_y:
            return False
        
        if self.rank[root_x] < self.rank[root_y]:
            root_x, root_y = root_y, root_x
        self.parent[root_y] = root_x
        if self.rank[root_x] == self.rank[root_y]:
            self.rank[root_x] += 1
        self.count -= 1  # Merged two islands into one
        return True
    
    def add_island(self) -> None:
        """When new land is created, it's a new island initially."""
        self.count += 1
    
    def get_count(self) -> int:
        return self.count


def numIslands2(m: int, n: int, positions: List[List[int]]) -> List[int]:
    """
    Count islands after each land addition.
    
    Time: O(k * α(m*n)) where k = number of positions
    Space: O(m * n)
    """
    def get_index(row: int, col: int) -> int:
        """Convert 2D coordinate to 1D index."""
        return row * n + col
    
    uf = UnionFind(m * n)
    grid = [[0] * n for _ in range(m)]  # Track which cells are land
    result = []
    directions = [(-1, 0), (1, 0), (0, -1), (0, 1)]
    
    for row, col in positions:
        # Handle duplicate positions
        if grid[row][col] == 1:
            result.append(uf.get_count())
            continue
        
        # Create new land
        grid[row][col] = 1
        uf.add_island()  # New island
        
        # Check 4 neighbors
        idx = get_index(row, col)
        for dr, dc in directions:
            nr, nc = row + dr, col + dc
            if 0 <= nr < m and 0 <= nc < n and grid[nr][nc] == 1:
                neighbor_idx = get_index(nr, nc)
                uf.union(idx, neighbor_idx)  # Merge if neighbor is land
        
        result.append(uf.get_count())
    
    return result


# Example
m, n = 3, 3
positions = [[0,0], [0,1], [1,2], [2,1]]
print(numIslands2(m, n, positions))  # [1, 1, 2, 3]

# Walkthrough:
# Add (0,0): Create island → [1]
#   Grid: 1 0 0
#         0 0 0
#         0 0 0
#
# Add (0,1): Create island, union with (0,0) → [1]
#   Grid: 1 1 0
#         0 0 0
#         0 0 0
#
# Add (1,2): Create island, no land neighbors → [2]
#   Grid: 1 1 0
#         0 0 1
#         0 0 0
#
# Add (2,1): Create island, no land neighbors → [3]
#   Grid: 1 1 0
#         0 0 1
#         0 1 0
```

**JavaScript:**
```javascript
function numIslands2(m, n, positions) {
    const parent = Array.from({ length: m * n }, (_, i) => i);
    const rank = new Array(m * n).fill(0);
    let count = 0;
    const grid = Array.from({ length: m }, () => new Array(n).fill(0));
    const result = [];
    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    
    const getIndex = (row, col) => row * n + col;
    
    function find(x) {
        if (parent[x] !== x) {
            parent[x] = find(parent[x]);
        }
        return parent[x];
    }
    
    function union(x, y) {
        let rootX = find(x);
        let rootY = find(y);
        
        if (rootX === rootY) return false;
        
        if (rank[rootX] < rank[rootY]) {
            [rootX, rootY] = [rootY, rootX];
        }
        parent[rootY] = rootX;
        if (rank[rootX] === rank[rootY]) {
            rank[rootX]++;
        }
        count--;
        return true;
    }
    
    for (const [row, col] of positions) {
        if (grid[row][col] === 1) {
            result.push(count);
            continue;
        }
        
        grid[row][col] = 1;
        count++;  // New island
        
        const idx = getIndex(row, col);
        for (const [dr, dc] of directions) {
            const nr = row + dr, nc = col + dc;
            if (nr >= 0 && nr < m && nc >= 0 && nc < n && grid[nr][nc] === 1) {
                union(idx, getIndex(nr, nc));
            }
        }
        
        result.push(count);
    }
    
    return result;
}

console.log(numIslands2(3, 3, [[0,0], [0,1], [1,2], [2,1]]));  // [1, 1, 2, 3]
```

---

## 🔍 Detailed Visualization

```
Grid: 3x3, positions: [(0,0), (0,1), (1,2), (2,1), (1,1)]

Initial: All water
  0 0 0
  0 0 0
  0 0 0
  Islands: 0

Add (0,0):
  1 0 0     New land, no neighbors
  0 0 0     +1 island
  0 0 0     
  Islands: 1

Add (0,1):
  1 1 0     New land, neighbor (0,0) is land
  0 0 0     +1, then union with (0,0): -1
  0 0 0     
  Islands: 1

Add (1,2):
  1 1 0     New land, no land neighbors
  0 0 1     +1 island
  0 0 0     
  Islands: 2

Add (2,1):
  1 1 0     New land, no land neighbors
  0 0 1     +1 island
  0 1 0     
  Islands: 3

Add (1,1):
  1 1 0     New land, neighbors: (0,1)=land, (2,1)=land, (1,2)=land
  0 1 1     +1, then 3 unions: -3
  0 1 0     All connected now!
  Islands: 1

Result: [1, 1, 2, 3, 1]
```

---

## ⚡ Complexity Analysis

| Operation | Time | Space |
|-----------|------|-------|
| Initialize | O(m × n) | O(m × n) |
| Each position | O(4 × α(m×n)) | O(1) |
| k positions | O(k × α(m×n)) | O(1) |
| **Total** | O(m×n + k×α(m×n)) | O(m × n) |

**Why this is efficient:**
- Naive approach: BFS/DFS after each addition → O(k × m × n)
- Union-Find: O(k × α(m × n)) ≈ O(k)
- α(n) is the inverse Ackermann function, effectively ≤ 5 for any practical input

---

## ⚠️ Common Mistakes

### 1. Forgetting Duplicate Positions

```python
# ❌ Wrong: Creates extra island for duplicate
grid[row][col] = 1
uf.add_island()  # Always adds!

# ✅ Correct: Check first
if grid[row][col] == 1:
    result.append(uf.get_count())
    continue
grid[row][col] = 1
uf.add_island()
```

### 2. Wrong Count Update

```python
# ❌ Wrong: Union increases count
def union(x, y):
    ...
    self.count += 1  # Wrong! Merging decreases count

# ✅ Correct
def union(x, y):
    ...
    self.count -= 1  # Merging reduces islands
```

### 3. Wrong 2D to 1D Mapping

```python
# ❌ Wrong: row * m instead of row * n
def get_index(row, col):
    return row * m + col  # Wrong! Should be n (number of columns)

# ✅ Correct
def get_index(row, col):
    return row * n + col  # row * num_cols + col
```

---

## 🔄 Related Patterns

### 1. Network Connectivity (LC 1319)

Similar idea: count components after adding edges incrementally.

```python
def makeConnected(n: int, connections: List[List[int]]) -> int:
    """Minimum cables to connect all computers."""
    if len(connections) < n - 1:
        return -1  # Not enough cables
    
    uf = UnionFind(n)
    for a, b in connections:
        uf.union(a, b)
    
    return uf.get_count() - 1  # Need this many more connections
```

### 2. Earliest Time When Everyone Becomes Friends (LC 1101)

```python
def earliestAcq(logs: List[List[int]], n: int) -> int:
    """Find timestamp when all n people are connected."""
    logs.sort()  # Sort by timestamp
    uf = UnionFind(n)
    
    for timestamp, x, y in logs:
        uf.union(x, y)
        if uf.get_count() == 1:
            return timestamp
    
    return -1
```

---

## 📝 Practice Problems

| Problem | Difficulty | Key Insight |
|---------|------------|-------------|
| [Number of Islands II](https://leetcode.com/problems/number-of-islands-ii/) | Hard | Grid + incremental land |
| [Earliest Time When Everyone Becomes Friends](https://leetcode.com/problems/the-earliest-moment-when-everyone-become-friends/) | Medium | Sort by time + track count |
| [Making A Large Island](https://leetcode.com/problems/making-a-large-island/) | Hard | Try each 0 → 1 change |
| [Number of Operations to Make Network Connected](https://leetcode.com/problems/number-of-operations-to-make-network-connected/) | Medium | Count redundant + components |

---

## 🎤 Interview Communication

**Opening:**
> "This is a dynamic connectivity problem - we need to answer queries as elements are added. Union-Find is perfect because union and find are both O(α(n)), effectively constant time."

**Key design decision:**
> "For the grid problem, I'll convert 2D coordinates to 1D indices using row * numCols + col. This lets me use a standard Union-Find with a 1D array."

**Handling tricky cases:**
> "I need to handle duplicate positions - if land is already there, just return current count. Also, the initial count is 0, and I increment when adding new land, decrement when merging with neighbors."

---

## ⏱️ Time Estimates

| Activity | Time | Notes |
|----------|------|-------|
| Understand the pattern | 15 min | Incremental + count |
| Design approach | 10 min | Grid mapping |
| Implement | 20 min | Handle edge cases |
| Debug | 10 min | Duplicates, bounds |

---

> **💡 Key Insight:** When adding new elements, first create them as isolated (increment count), then merge with existing neighbors (each merge decrements count). This naturally tracks the component count dynamically.

> **🔗 Related:** [Connected Components](./01-Connected-Components.md) | [Union-Find Variations →](./04-Union-Find-Variations.md)

---

**Next:** [Union-Find Variations →](./04-Union-Find-Variations.md)
