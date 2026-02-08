# Cycle Detection with Union-Find

> **Detect cycles in undirected graphs: if two nodes are already connected, adding an edge creates a cycle.**
>
> Core insight: Union returns False when nodes are already in the same set → cycle found!

---

## 🎯 Pattern Recognition

<details>
<summary><strong>How to Identify This Pattern</strong></summary>

**Problem statement signals:**
- "Find the edge that creates a cycle"
- "Redundant connection in a graph"
- "Detect if adding an edge creates a cycle"
- "Find the edge to remove to make a valid tree"

**Key characteristics:**
- Undirected graph
- Given edges one at a time
- Need to detect cycle formation
- Tree must have exactly n-1 edges for n nodes

</details>

---

## ✅ When to Use

| Scenario | Why Union-Find |
|----------|----------------|
| Edges processed one at a time | Check connectivity before adding |
| Undirected graph cycles | Symmetric relationship |
| Need to identify the specific cycle-creating edge | Union returns which edge caused it |
| Building a tree from edges | Detect when edge would create cycle |

---

## ❌ When NOT to Use

| Scenario | Better Alternative |
|----------|-------------------|
| Directed graph cycles | DFS with recursion stack |
| Need to find all cycles | DFS + tracking |
| Need the actual cycle path | DFS backtracking |
| Topological sort related | Kahn's algorithm |

---

## 📐 How It Works

### The Key Insight

```
When processing edge (u, v):
1. Find root of u
2. Find root of v
3. If same root → already connected → adding edge creates cycle!
4. If different roots → safe to add, union them
```

**Visualization:**
```
Processing edges: (0,1), (1,2), (0,2)

Edge (0,1): 
  find(0)=0, find(1)=1 → different → union
  Sets: {0, 1}

Edge (1,2):
  find(1)=0, find(2)=2 → different → union
  Sets: {0, 1, 2}

Edge (0,2):
  find(0)=0, find(2)=0 → SAME! → CYCLE!
  Adding (0,2) would create: 0—1—2—0
```

---

## 💻 Implementation

### LeetCode 684: Redundant Connection

> Given a graph that was originally a tree with n nodes plus one extra edge, find that redundant edge.

**Python:**
```python
from typing import List

class UnionFind:
    def __init__(self, n: int):
        self.parent = list(range(n))
        self.rank = [0] * n
    
    def find(self, x: int) -> int:
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])
        return self.parent[x]
    
    def union(self, x: int, y: int) -> bool:
        """Returns False if x and y are already connected (cycle!)"""
        root_x, root_y = self.find(x), self.find(y)
        if root_x == root_y:
            return False  # Cycle detected!
        
        if self.rank[root_x] < self.rank[root_y]:
            root_x, root_y = root_y, root_x
        self.parent[root_y] = root_x
        if self.rank[root_x] == self.rank[root_y]:
            self.rank[root_x] += 1
        return True


def findRedundantConnection(edges: List[List[int]]) -> List[int]:
    """
    Find the edge that creates a cycle in the graph.
    
    The graph was a tree (n-1 edges) but has n edges,
    so exactly one edge is redundant.
    
    Time: O(n * α(n)) ≈ O(n)
    Space: O(n)
    """
    n = len(edges)
    uf = UnionFind(n + 1)  # 1-indexed nodes
    
    for u, v in edges:
        if not uf.union(u, v):
            # This edge connects already-connected nodes
            return [u, v]
    
    return []  # Should not reach here


# Example
edges = [[1, 2], [1, 3], [2, 3]]
print(findRedundantConnection(edges))  # [2, 3]

# Walkthrough:
# Edge [1,2]: union(1,2) → True, sets: {1,2}
# Edge [1,3]: union(1,3) → True, sets: {1,2,3}
# Edge [2,3]: union(2,3) → False! Both already in same set
# Return [2,3]
```

**JavaScript:**
```javascript
function findRedundantConnection(edges) {
    const n = edges.length;
    const parent = Array.from({ length: n + 1 }, (_, i) => i);
    const rank = new Array(n + 1).fill(0);
    
    function find(x) {
        if (parent[x] !== x) {
            parent[x] = find(parent[x]);
        }
        return parent[x];
    }
    
    function union(x, y) {
        let rootX = find(x);
        let rootY = find(y);
        
        if (rootX === rootY) return false;  // Cycle!
        
        if (rank[rootX] < rank[rootY]) {
            [rootX, rootY] = [rootY, rootX];
        }
        parent[rootY] = rootX;
        if (rank[rootX] === rank[rootY]) {
            rank[rootX]++;
        }
        return true;
    }
    
    for (const [u, v] of edges) {
        if (!union(u, v)) {
            return [u, v];
        }
    }
    
    return [];
}

// Example
console.log(findRedundantConnection([[1, 2], [1, 3], [2, 3]]));  // [2, 3]
```

---

## 🔍 Detailed Walkthrough

```
Input: edges = [[1,2], [2,3], [3,4], [1,4], [1,5]]
       
       (This forms: 1—2—3—4—1, plus 5 connected to 1)

Initial: Each node is its own set
  parent: [0, 1, 2, 3, 4, 5]

Process [1, 2]:
  find(1)=1, find(2)=2 → Different → Union
  parent: [0, 1, 1, 3, 4, 5]
  Graph: 1—2

Process [2, 3]:
  find(2)=1, find(3)=3 → Different → Union
  parent: [0, 1, 1, 1, 4, 5]
  Graph: 1—2—3

Process [3, 4]:
  find(3)=1, find(4)=4 → Different → Union
  parent: [0, 1, 1, 1, 1, 5]
  Graph: 1—2—3—4

Process [1, 4]:
  find(1)=1, find(4)=1 → SAME! → CYCLE!
  Return [1, 4]

The edge [1,4] would complete the cycle: 1—2—3—4—1
```

---

## 📊 Comparison with DFS

| Aspect | Union-Find | DFS |
|--------|------------|-----|
| Time | O(n α(n)) | O(n + m) |
| Online (streaming edges) | ✅ Excellent | ❌ Need all edges |
| Find specific cycle-causing edge | ✅ Easy | ⚠️ More complex |
| Find cycle path | ❌ Hard | ✅ Easy |
| Directed graphs | ❌ No | ✅ Yes |

---

## ⚠️ Common Mistakes

### 1. Wrong Index for 1-Indexed Problems

```python
# ❌ Wrong: Off by one
def findRedundantConnection(edges):
    n = len(edges)
    uf = UnionFind(n)  # Nodes are 1 to n!
    
# ✅ Correct: Account for 1-indexing
def findRedundantConnection(edges):
    n = len(edges)
    uf = UnionFind(n + 1)  # Indices 0 to n, using 1 to n
```

### 2. Returning Wrong Format

```python
# ❌ Wrong: Returning as tuple when list expected
if not uf.union(u, v):
    return (u, v)  # LeetCode expects list!

# ✅ Correct
if not uf.union(u, v):
    return [u, v]
```

### 3. Not Understanding the Return Value

```python
# ❌ Wrong: Thinking union returns root
result = uf.union(u, v)
if result == u:  # Wrong! Union returns bool

# ✅ Correct: Union returns True/False
if not uf.union(u, v):  # False means cycle
    return [u, v]
```

---

## 🔄 Variations

### 1. First Edge That Creates Cycle (In Order)

The standard approach already returns the first cycle-creating edge in input order.

### 2. All Cycle-Creating Edges

```python
def findAllRedundantConnections(edges):
    """Find all edges that create cycles."""
    n = len(edges)
    uf = UnionFind(n + 1)
    redundant = []
    
    for u, v in edges:
        if not uf.union(u, v):
            redundant.append([u, v])
    
    return redundant
```

### 3. Check if Graph is a Valid Tree

```python
def isValidTree(n: int, edges: List[List[int]]) -> bool:
    """
    Graph is a tree if:
    1. Exactly n-1 edges
    2. No cycles
    3. All nodes connected
    """
    if len(edges) != n - 1:
        return False
    
    uf = UnionFind(n)
    for u, v in edges:
        if not uf.union(u, v):
            return False  # Cycle detected
    
    return uf.get_count() == 1  # All connected
```

---

## 📝 Practice Problems

| Problem | Difficulty | Key Insight |
|---------|------------|-------------|
| [Redundant Connection](https://leetcode.com/problems/redundant-connection/) | Medium | First cycle-creating edge |
| [Redundant Connection II](https://leetcode.com/problems/redundant-connection-ii/) | Hard | Directed graph variant |
| [Graph Valid Tree](https://leetcode.com/problems/graph-valid-tree/) | Medium | n-1 edges + no cycle + connected |
| [Number of Operations to Make Network Connected](https://leetcode.com/problems/number-of-operations-to-make-network-connected/) | Medium | Count redundant + components |

---

## 🎤 Interview Communication

**Opening:**
> "I'll use Union-Find because I can detect a cycle the moment I try to connect two already-connected nodes. When union returns False, that edge creates the cycle."

**During coding:**
> "I'm processing edges in order. For each edge, I check if the endpoints are already in the same set. If they are, connecting them would create a cycle, so that's the redundant edge."

**Complexity discussion:**
> "With path compression and union by rank, each operation is O(α(n)) which is effectively constant. For n edges, the total time is O(n)."

---

## ⏱️ Time Estimates

| Activity | Time | Notes |
|----------|------|-------|
| Understand the pattern | 10 min | Union returns False = cycle |
| Implement solution | 15 min | Standard Union-Find |
| Debug edge cases | 5-10 min | 1-indexing issues |

---

> **💡 Key Insight:** Union-Find's union operation naturally tells us when we're about to create a cycle. If two nodes are already connected (same root), adding an edge between them creates a cycle. This is why union returns a boolean!

> **🔗 Related:** [Connected Components](./01-Connected-Components.md) | [Dynamic Connectivity →](./03-Dynamic-Connectivity.md)

---

**Next:** [Dynamic Connectivity →](./03-Dynamic-Connectivity.md)
