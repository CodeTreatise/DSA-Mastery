# LC 684: Redundant Connection

> **Find the edge that creates a cycle - classic Union-Find cycle detection**
>
> ⏱️ **Interview Time:** 15 min | 📊 **Difficulty:** Medium | 🎯 **Frequency:** High

---

## Problem Statement

A tree is a connected graph with no cycles. Given a graph that started as a tree with `n` nodes, then **one additional edge** was added. The graph has `n` edges.

Find and return the edge that creates the cycle. If there are multiple answers, return the edge that appears **last** in the input.

```
Example 1:
Input: edges = [[1,2],[1,3],[2,3]]
Output: [2,3]
Explanation: 
  1
 / \
2 - 3  ← Edge [2,3] creates the cycle

Example 2:
Input: edges = [[1,2],[2,3],[3,4],[1,4],[1,5]]
Output: [1,4]
Explanation:
5 - 1 - 2
    |   |
    4 - 3  ← Edge [1,4] creates the cycle
```

---

## 🎯 Pattern Recognition

**This is "Cycle Detection with Union-Find":**
- A tree with n nodes has n-1 edges
- We have n edges → exactly one extra edge
- The extra edge connects two already-connected nodes → cycle!

**Key insight:**
When we try to union two nodes that are already in the same component, that edge forms a cycle.

---

## 📐 Algorithm

```
1. Process edges one by one
2. For each edge [u, v]:
   - If u and v already connected → this edge creates cycle!
   - Otherwise, union them
3. Return the first edge that creates a cycle
   (Since we process in order, the last such edge wins)
```

---

## 💻 Solution

**Python:**
```python
from typing import List

class UnionFind:
    def __init__(self, n):
        self.parent = list(range(n))
        self.rank = [0] * n
    
    def find(self, x):
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])
        return self.parent[x]
    
    def union(self, x, y):
        root_x, root_y = self.find(x), self.find(y)
        if root_x == root_y:
            return False  # Already connected!
        if self.rank[root_x] < self.rank[root_y]:
            root_x, root_y = root_y, root_x
        self.parent[root_y] = root_x
        if self.rank[root_x] == self.rank[root_y]:
            self.rank[root_x] += 1
        return True


def findRedundantConnection(edges: List[List[int]]) -> List[int]:
    """
    Find the edge that creates a cycle.
    
    Time: O(n × α(n)) ≈ O(n)
    Space: O(n)
    """
    n = len(edges)
    uf = UnionFind(n + 1)  # 1-indexed nodes
    
    for u, v in edges:
        if not uf.union(u, v):
            return [u, v]  # This edge forms a cycle!
    
    return []  # Should never reach here


# Test
print(findRedundantConnection([[1,2],[1,3],[2,3]]))  # [2, 3]
print(findRedundantConnection([[1,2],[2,3],[3,4],[1,4],[1,5]]))  # [1, 4]
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
        let rootX = find(x), rootY = find(y);
        if (rootX === rootY) return false;
        
        if (rank[rootX] < rank[rootY]) {
            [rootX, rootY] = [rootY, rootX];
        }
        parent[rootY] = rootX;
        if (rank[rootX] === rank[rootY]) rank[rootX]++;
        return true;
    }
    
    for (const [u, v] of edges) {
        if (!union(u, v)) {
            return [u, v];
        }
    }
    
    return [];
}
```

---

## 🔄 Step-by-Step Trace

```
edges = [[1,2],[1,3],[2,3]]

Process [1,2]:
  Find(1) = 1, Find(2) = 2
  Different roots → union them
  parent: [_, 1, 1, 3]  (1 is root of 2)

Process [1,3]:
  Find(1) = 1, Find(3) = 3
  Different roots → union them
  parent: [_, 1, 1, 1]  (1 is root of all)

Process [2,3]:
  Find(2) = 1, Find(3) = 1
  SAME ROOT! → This edge creates cycle
  Return [2, 3] ✓
```

---

## ⚡ Complexity Analysis

| Aspect | Complexity | Notes |
|--------|------------|-------|
| **Time** | O(n × α(n)) ≈ O(n) | n unions, each nearly O(1) |
| **Space** | O(n) | Parent and rank arrays |

---

## 🔄 Variations

### Redundant Connection II (LC 685)

**Directed graph version - much harder!**

The graph is a rooted tree with one extra directed edge. Three cases:
1. A node has two parents (edge to delete is one of them)
2. There's a cycle (edge to delete is in the cycle)
3. Both (node with two parents AND cycle)

```python
def findRedundantDirectedConnection(edges):
    """
    Directed version - handle three cases.
    """
    n = len(edges)
    parent = [0] * (n + 1)  # Parent in the tree structure
    candidates = []  # Edges that might be deleted
    
    # Find node with two parents
    for u, v in edges:
        if parent[v] == 0:
            parent[v] = u
        else:
            # v has two parents: parent[v] and u
            candidates = [[parent[v], v], [u, v]]
    
    # Reset and use Union-Find
    uf_parent = list(range(n + 1))
    
    def find(x):
        if uf_parent[x] != x:
            uf_parent[x] = find(uf_parent[x])
        return uf_parent[x]
    
    def union(x, y):
        root_x, root_y = find(x), find(y)
        if root_x == root_y:
            return False
        uf_parent[root_y] = root_x
        return True
    
    for u, v in edges:
        if candidates and [u, v] == candidates[1]:
            continue  # Skip second candidate
        if not union(u, v):
            # Cycle detected
            return candidates[0] if candidates else [u, v]
    
    return candidates[1]
```

---

## ⚠️ Common Mistakes

### 1. 0-indexed vs 1-indexed

```python
# ❌ Wrong: Nodes are 1-indexed but array is 0-indexed
uf = UnionFind(n)  # Size n, indices 0 to n-1

# ✅ Correct: Use n+1 for 1-indexed nodes
uf = UnionFind(n + 1)  # Indices 0 to n
```

### 2. Not Checking Union Result

```python
# ❌ Wrong: Always union without checking
for u, v in edges:
    uf.union(u, v)
    # How do we know which edge is redundant?

# ✅ Correct: Check if union succeeds
for u, v in edges:
    if not uf.union(u, v):
        return [u, v]  # This is the redundant edge!
```

---

## 🎤 Interview Walkthrough

**Clarify:**
> "So we have a tree plus one extra edge. I need to find that extra edge. If multiple edges could be removed, return the one that appears last."

**Approach:**
> "I'll use Union-Find. As I process each edge, if the two nodes are already connected, adding this edge would create a cycle - so that's my answer."

**Why Union-Find:**
> "Since we're processing edges and need to track connectivity, Union-Find is perfect. The first time union() returns false, that edge is redundant."

---

> **💡 Key Insight:** When `union(u, v)` returns false, u and v are already connected. In a tree, they shouldn't be - so this edge must be the extra one that creates the cycle.

---

**Back:** [← Number of Provinces](./01-Number-Of-Provinces-LC547.md)
