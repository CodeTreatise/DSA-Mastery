# LC 547: Number of Provinces

> **Count connected components in an adjacency matrix - classic Union-Find**
>
> ⏱️ **Interview Time:** 10-15 min | 📊 **Difficulty:** Medium | 🎯 **Frequency:** High

---

## Problem Statement

There are `n` cities. An `n x n` matrix `isConnected` where `isConnected[i][j] = 1` means city `i` and city `j` are directly connected, and `isConnected[i][j] = 0` otherwise.

A **province** is a group of directly or indirectly connected cities.

Return the number of provinces.

```
Example 1:
Input: isConnected = [[1,1,0],[1,1,0],[0,0,1]]
Output: 2
Explanation: Cities 0 and 1 are connected (province 1). City 2 is alone (province 2).

Example 2:
Input: isConnected = [[1,0,0],[0,1,0],[0,0,1]]
Output: 3
Explanation: Each city is its own province.
```

---

## 🎯 Pattern Recognition

**This is "Count Connected Components":**
- Cities are nodes
- Direct connections are edges
- Provinces = connected components

---

## 💻 Solutions

### Solution 1: Union-Find (Recommended)

```python
class UnionFind:
    def __init__(self, n):
        self.parent = list(range(n))
        self.rank = [0] * n
        self.count = n
    
    def find(self, x):
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])
        return self.parent[x]
    
    def union(self, x, y):
        root_x, root_y = self.find(x), self.find(y)
        if root_x == root_y:
            return False
        if self.rank[root_x] < self.rank[root_y]:
            root_x, root_y = root_y, root_x
        self.parent[root_y] = root_x
        if self.rank[root_x] == self.rank[root_y]:
            self.rank[root_x] += 1
        self.count -= 1
        return True


def findCircleNum(isConnected: list[list[int]]) -> int:
    """
    Count provinces using Union-Find.
    
    Time: O(n² × α(n)) ≈ O(n²)
    Space: O(n)
    """
    n = len(isConnected)
    uf = UnionFind(n)
    
    # Process upper triangle only (avoid duplicates)
    for i in range(n):
        for j in range(i + 1, n):
            if isConnected[i][j] == 1:
                uf.union(i, j)
    
    return uf.count


# Test
print(findCircleNum([[1,1,0],[1,1,0],[0,0,1]]))  # 2
print(findCircleNum([[1,0,0],[0,1,0],[0,0,1]]))  # 3
```

### Solution 2: DFS (Alternative)

```python
def findCircleNum_dfs(isConnected: list[list[int]]) -> int:
    """DFS approach - also valid."""
    n = len(isConnected)
    visited = [False] * n
    provinces = 0
    
    def dfs(city):
        visited[city] = True
        for neighbor in range(n):
            if isConnected[city][neighbor] == 1 and not visited[neighbor]:
                dfs(neighbor)
    
    for city in range(n):
        if not visited[city]:
            provinces += 1
            dfs(city)
    
    return provinces
```

**JavaScript:**
```javascript
function findCircleNum(isConnected) {
    const n = isConnected.length;
    const parent = Array.from({ length: n }, (_, i) => i);
    const rank = new Array(n).fill(0);
    let count = n;
    
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
        count--;
        return true;
    }
    
    for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
            if (isConnected[i][j] === 1) {
                union(i, j);
            }
        }
    }
    
    return count;
}
```

---

## ⚡ Complexity Analysis

| Approach | Time | Space |
|----------|------|-------|
| Union-Find | O(n² × α(n)) ≈ O(n²) | O(n) |
| DFS | O(n²) | O(n) |

Both are O(n²) because we must check all n² matrix entries.

---

## 🔄 Union-Find vs DFS

| Aspect | Union-Find | DFS |
|--------|------------|-----|
| Code length | Longer (needs class) | Shorter |
| Intuition | Component counting | Traversal |
| When better | Dynamic queries | One-time count |
| Interview | Shows more skill | Simpler to write |

---

## ⚠️ Common Mistakes

### 1. Processing Full Matrix

```python
# ❌ Slower: processes each edge twice
for i in range(n):
    for j in range(n):
        if isConnected[i][j]:
            uf.union(i, j)

# ✅ Better: upper triangle only
for i in range(n):
    for j in range(i + 1, n):  # j > i
        if isConnected[i][j]:
            uf.union(i, j)
```

### 2. Forgetting Matrix is Symmetric

```python
# Matrix property: isConnected[i][j] == isConnected[j][i]
# Also: isConnected[i][i] == 1 (self-connected)
```

---

## 🎤 Interview Walkthrough

**Clarify:**
> "So I need to count connected components in an undirected graph given as an adjacency matrix."

**Approach:**
> "I can use Union-Find. Start with n components. For each connection in the matrix, union those cities. The final count is my answer."

**Why Union-Find:**
> "While DFS also works here, I'll use Union-Find to demonstrate the pattern. It's also more flexible if we later needed to handle dynamic connections."

---

> **💡 Key Insight:** This is the simplest Union-Find counting problem. Each successful union reduces the component count by 1. Final count = number of provinces.

---

**Next:** [Redundant Connection →](./02-Redundant-Connection-LC684.md)
