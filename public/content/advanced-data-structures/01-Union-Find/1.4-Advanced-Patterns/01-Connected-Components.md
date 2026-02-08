# Connected Components Pattern

> **The most common Union-Find application: counting and tracking groups.**
>
> Pattern: "How many groups?" → Track component count during union operations.

---

## 🎯 Pattern Recognition

<details>
<summary><strong>How to Identify This Pattern</strong></summary>

**Classic problem phrasings:**
- "Find the number of connected components"
- "Count how many groups/provinces/islands"
- "How many separate networks?"
- "Find number of friend circles"

**Visual signal:**
```
Given edges/connections → Count distinct groups

  0 — 1     2 — 3     4
  (group 1) (group 2) (group 3)
  
  Answer: 3 components
```

</details>

---

## ✅ When to Use

| Scenario | Why Union-Find |
|----------|----------------|
| Count connected components in graph | Track count during union |
| Dynamic grouping (edges added over time) | O(1) updates |
| Need component count, not traversal | More efficient than DFS for many queries |
| Adjacency matrix given | Iterate and union |

---

## ❌ When NOT to Use

| Scenario | Better Alternative |
|----------|-------------------|
| Need to list all nodes in a component | DFS/BFS |
| Single traversal query | Simple DFS |
| Need shortest path | BFS |
| Directed graph | Tarjan's SCC |

---

## 📐 How It Works

### The Pattern

1. **Initialize:** `count = n` (each node is its own component)
2. **On each edge (u, v):**
   - If `union(u, v)` succeeds (returns True), decrement count
   - If already same component, count stays same
3. **Answer:** Final value of `count`

```
Initial: 5 nodes, count = 5
         0    1    2    3    4

Edge (0,1): union succeeds, count = 4
         0—1  2    3    4

Edge (2,3): union succeeds, count = 3
         0—1  2—3  4

Edge (0,3): union succeeds, count = 2
         0—1—2—3  4

Edge (1,2): already connected, count = 2 (no change)

Final: 2 components
```

---

## 💻 Solution Template

**Python:**
```python
class UnionFind:
    def __init__(self, n: int):
        self.parent = list(range(n))
        self.rank = [0] * n
        self.count = n  # Track number of components
    
    def find(self, x: int) -> int:
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])
        return self.parent[x]
    
    def union(self, x: int, y: int) -> bool:
        root_x, root_y = self.find(x), self.find(y)
        
        if root_x == root_y:
            return False  # Already connected
        
        # Union by rank
        if self.rank[root_x] < self.rank[root_y]:
            root_x, root_y = root_y, root_x
        self.parent[root_y] = root_x
        if self.rank[root_x] == self.rank[root_y]:
            self.rank[root_x] += 1
        
        self.count -= 1  # Key: decrement count on successful union
        return True
    
    def get_count(self) -> int:
        return self.count
```

**JavaScript:**
```javascript
class UnionFind {
    constructor(n) {
        this.parent = Array.from({ length: n }, (_, i) => i);
        this.rank = new Array(n).fill(0);
        this.count = n;
    }
    
    find(x) {
        if (this.parent[x] !== x) {
            this.parent[x] = this.find(this.parent[x]);
        }
        return this.parent[x];
    }
    
    union(x, y) {
        let rootX = this.find(x);
        let rootY = this.find(y);
        
        if (rootX === rootY) return false;
        
        if (this.rank[rootX] < this.rank[rootY]) {
            [rootX, rootY] = [rootY, rootX];
        }
        this.parent[rootY] = rootX;
        if (this.rank[rootX] === this.rank[rootY]) {
            this.rank[rootX]++;
        }
        
        this.count--;
        return true;
    }
    
    getCount() {
        return this.count;
    }
}
```

---

## 📝 Classic Problems

### Problem 1: Number of Provinces (LC 547)

**Problem:** Given `n` cities and an adjacency matrix `isConnected`, return the number of provinces.

**Python:**
```python
def findCircleNum(isConnected: list[list[int]]) -> int:
    """
    LC 547: Number of Provinces
    
    Time: O(n² × α(n)) ≈ O(n²)
    Space: O(n)
    """
    n = len(isConnected)
    uf = UnionFind(n)
    
    for i in range(n):
        for j in range(i + 1, n):  # Upper triangle only
            if isConnected[i][j] == 1:
                uf.union(i, j)
    
    return uf.get_count()


# Test
print(findCircleNum([[1,1,0],[1,1,0],[0,0,1]]))  # 2
print(findCircleNum([[1,0,0],[0,1,0],[0,0,1]]))  # 3
```

**JavaScript:**
```javascript
function findCircleNum(isConnected) {
    const n = isConnected.length;
    const uf = new UnionFind(n);
    
    for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
            if (isConnected[i][j] === 1) {
                uf.union(i, j);
            }
        }
    }
    
    return uf.getCount();
}
```

---

### Problem 2: Number of Connected Components (LC 323)

**Problem:** Given `n` nodes and a list of edges, count connected components.

**Python:**
```python
def countComponents(n: int, edges: list[list[int]]) -> int:
    """
    LC 323: Number of Connected Components in an Undirected Graph
    
    Time: O(E × α(n)) ≈ O(E)
    Space: O(n)
    """
    uf = UnionFind(n)
    
    for u, v in edges:
        uf.union(u, v)
    
    return uf.get_count()


# Test
print(countComponents(5, [[0,1],[1,2],[3,4]]))  # 2
print(countComponents(5, [[0,1],[1,2],[2,3],[3,4]]))  # 1
```

**JavaScript:**
```javascript
function countComponents(n, edges) {
    const uf = new UnionFind(n);
    
    for (const [u, v] of edges) {
        uf.union(u, v);
    }
    
    return uf.getCount();
}
```

---

### Problem 3: Number of Islands (Bonus - Grid Version)

**Problem:** Given a 2D grid, count islands (connected 1s).

**Key insight:** Map 2D coordinates to 1D index: `index = row * cols + col`

**Python:**
```python
def numIslands(grid: list[list[str]]) -> int:
    """
    LC 200: Number of Islands (Union-Find approach)
    
    Note: DFS/BFS is typically simpler for this problem,
    but Union-Find shows the pattern.
    
    Time: O(m × n × α(m×n))
    Space: O(m × n)
    """
    if not grid:
        return 0
    
    rows, cols = len(grid), len(grid[0])
    uf = UnionFind(rows * cols)
    
    # Count water cells (they shouldn't contribute to components)
    water_count = 0
    
    for i in range(rows):
        for j in range(cols):
            if grid[i][j] == '0':
                water_count += 1
            else:
                # Union with neighbors (right and down only to avoid duplicates)
                idx = i * cols + j
                
                # Right neighbor
                if j + 1 < cols and grid[i][j + 1] == '1':
                    uf.union(idx, idx + 1)
                
                # Down neighbor
                if i + 1 < rows and grid[i + 1][j] == '1':
                    uf.union(idx, idx + cols)
    
    # Total components minus water cells
    # But we also need to subtract water from initial count
    # Actually easier: count unique roots among land cells
    roots = set()
    for i in range(rows):
        for j in range(cols):
            if grid[i][j] == '1':
                roots.add(uf.find(i * cols + j))
    
    return len(roots)
```

---

## ⚡ Complexity Analysis

| Problem | Time | Space | Notes |
|---------|------|-------|-------|
| Number of Provinces | O(n² × α(n)) | O(n) | n² edges in matrix |
| Connected Components | O(E × α(n)) | O(n) | E edges to process |
| Number of Islands | O(m × n × α(mn)) | O(mn) | Grid traversal |

---

## ⚠️ Common Mistakes

### 1. Counting Root Nodes Instead of Using Counter

```python
# ❌ Wrong: Counting self-loops at the end
count = sum(1 for i in range(n) if uf.parent[i] == i)
# This fails with path compression! Parent might be outdated.

# ✅ Correct: Track count during unions
self.count -= 1  # In union() when successful
return self.count
```

### 2. Double-Counting Edges in Matrix

```python
# ❌ Wrong: Full matrix traversal
for i in range(n):
    for j in range(n):  # Processes each edge twice!
        if matrix[i][j]:
            uf.union(i, j)

# ✅ Correct: Upper triangle only
for i in range(n):
    for j in range(i + 1, n):  # j > i to avoid duplicates
        if matrix[i][j]:
            uf.union(i, j)
```

### 3. Forgetting Self-Loops in Matrix

```python
# Note: matrix[i][i] = 1 typically (self-connected)
# This doesn't affect Union-Find (union(i,i) is a no-op)
# But be aware when counting edges
```

---

## 🎤 Interview Communication

**Explain approach:**
> "I'll use Union-Find to track connected components. I'll initialize the count to n (each node is its own component), then for each edge, I'll union the two nodes. If the union is successful (they were in different components), I'll decrement the count. The final count is the answer."

**Why Union-Find over DFS:**
> "For this problem, both Union-Find and DFS work well. Union-Find is particularly good when we have many connectivity queries or edges are added dynamically. DFS might be simpler for a one-time count."

---

## 📝 Practice Problems

| Problem | Difficulty | Key Insight |
|---------|------------|-------------|
| [Number of Provinces](https://leetcode.com/problems/number-of-provinces/) | Medium | Matrix → edges |
| [Number of Connected Components](https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph/) | Medium | Edge list version |
| [Friend Circles](https://leetcode.com/problems/friend-circles/) | Medium | Same as Provinces |
| [Number of Islands](https://leetcode.com/problems/number-of-islands/) | Medium | 2D → 1D mapping |

---

> **💡 Key Insight:** The beauty of the connected components pattern is that we get the answer "for free" by tracking count during unions. No need for a separate traversal at the end.

> **🔗 Related:** [Cycle Detection](./02-Cycle-Detection.md) | [Dynamic Connectivity](./03-Dynamic-Connectivity.md)

---

**Next:** [Cycle Detection →](./02-Cycle-Detection.md)
