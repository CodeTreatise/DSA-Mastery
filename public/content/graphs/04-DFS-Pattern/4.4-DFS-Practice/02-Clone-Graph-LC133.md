# LC 133: Clone Graph

> **Deep copy a graph with cycle handling - classic DFS with memoization**
>
> ⏱️ **Interview Time:** 15-20 min | 📊 **Difficulty:** Medium | 🎯 **Frequency:** High (Meta, Google)

---

## Problem Statement

Given a reference of a node in a connected undirected graph, return a **deep copy** (clone) of the graph.

Each node contains:
- A value `val`
- A list of neighbors `neighbors`

```
Example:
Input: adjList = [[2,4],[1,3],[2,4],[1,3]]
      1 ── 2
      │    │
      4 ── 3

Output: Cloned graph with same structure but new nodes
```

**Constraints:**
- Number of nodes: 0 to 100
- Node values: 1 to 100 (unique)
- No repeated edges, no self-loops
- Graph is connected

---

## 🎯 Pattern Recognition

<details>
<summary><strong>Why This is DFS with Memoization</strong></summary>

**Signals:**
1. "Deep copy" = need to create new nodes
2. "Graph" = may have cycles, need to handle revisits
3. "Return cloned graph" = DFS traversal with node creation

**Key insight:**
- Use a hash map: `original_node → cloned_node`
- If we've seen a node before, return its clone
- This handles cycles naturally

</details>

---

## 📐 Algorithm

```
1. Base case: If node is null, return null
2. Check if node already cloned (in hash map)
   - If yes, return the clone (handles cycles)
3. Create a new node with same value
4. Store in hash map BEFORE recursing (critical!)
5. For each neighbor:
   - Recursively clone neighbor
   - Add cloned neighbor to new node's neighbors
6. Return the cloned node

Visualization:
Original:     Clone Process:
1 ── 2        visit 1 → create 1'
│    │        visit 2 → create 2' → 1'.neighbors = [2']
4 ── 3        visit 3 → create 3' → 2'.neighbors = [1', 3']
              visit 4 → create 4' → 3'.neighbors = [2', 4']
              back to 1 (already cloned) → 4'.neighbors = [1', 3']
```

---

## 💻 Solution

### DFS Approach (Recommended)

**Python:**
```python
class Node:
    def __init__(self, val=0, neighbors=None):
        self.val = val
        self.neighbors = neighbors if neighbors else []


def cloneGraph(node: 'Node') -> 'Node':
    """
    Clone a graph using DFS with memoization.
    
    Time: O(V + E) - visit each node and edge once
    Space: O(V) - hash map + recursion stack
    """
    if not node:
        return None
    
    # Map: original node → cloned node
    cloned = {}
    
    def dfs(original: 'Node') -> 'Node':
        # Already cloned? Return existing clone
        if original in cloned:
            return cloned[original]
        
        # Create clone and store BEFORE recursing
        # This is critical to handle cycles!
        clone = Node(original.val)
        cloned[original] = clone
        
        # Clone all neighbors
        for neighbor in original.neighbors:
            clone.neighbors.append(dfs(neighbor))
        
        return clone
    
    return dfs(node)


# Alternative with explicit visited tracking
def cloneGraph_v2(node: 'Node') -> 'Node':
    """Slightly more explicit version."""
    if not node:
        return None
    
    old_to_new = {}
    
    def clone(node):
        if node in old_to_new:
            return old_to_new[node]
        
        copy = Node(node.val)
        old_to_new[node] = copy
        
        for neighbor in node.neighbors:
            copy.neighbors.append(clone(neighbor))
        
        return copy
    
    return clone(node)
```

### BFS Approach

```python
from collections import deque

def cloneGraph_bfs(node: 'Node') -> 'Node':
    """
    Clone a graph using BFS.
    
    Time: O(V + E)
    Space: O(V)
    """
    if not node:
        return None
    
    # Create clone of starting node
    cloned = {node: Node(node.val)}
    queue = deque([node])
    
    while queue:
        original = queue.popleft()
        
        for neighbor in original.neighbors:
            if neighbor not in cloned:
                # Create clone for neighbor
                cloned[neighbor] = Node(neighbor.val)
                queue.append(neighbor)
            
            # Connect cloned nodes
            cloned[original].neighbors.append(cloned[neighbor])
    
    return cloned[node]
```

**JavaScript:**
```javascript
function Node(val, neighbors) {
    this.val = val === undefined ? 0 : val;
    this.neighbors = neighbors === undefined ? [] : neighbors;
}

function cloneGraph(node) {
    if (!node) return null;
    
    const cloned = new Map();
    
    function dfs(original) {
        if (cloned.has(original)) {
            return cloned.get(original);
        }
        
        const clone = new Node(original.val);
        cloned.set(original, clone);
        
        for (const neighbor of original.neighbors) {
            clone.neighbors.push(dfs(neighbor));
        }
        
        return clone;
    }
    
    return dfs(node);
}


// BFS version
function cloneGraphBFS(node) {
    if (!node) return null;
    
    const cloned = new Map();
    cloned.set(node, new Node(node.val));
    const queue = [node];
    
    while (queue.length > 0) {
        const original = queue.shift();
        
        for (const neighbor of original.neighbors) {
            if (!cloned.has(neighbor)) {
                cloned.set(neighbor, new Node(neighbor.val));
                queue.push(neighbor);
            }
            cloned.get(original).neighbors.push(cloned.get(neighbor));
        }
    }
    
    return cloned.get(node);
}
```

---

## ⚡ Complexity Analysis

| Aspect | Complexity | Notes |
|--------|------------|-------|
| **Time** | O(V + E) | Visit each node once, process each edge once |
| **Space** | O(V) | Hash map stores V nodes + recursion depth |

### Why O(V + E)?

```
V = number of vertices (nodes)
E = number of edges (connections)

- We visit each node exactly once
- For each node, we process all its neighbors
- Total neighbor processing = 2E (each edge counted from both ends)
- Total: O(V) + O(E) = O(V + E)
```

---

## 🔄 Variations

| Variation | Difference | Approach |
|-----------|------------|----------|
| Clone with random pointer | Extra pointer field | Same DFS, handle random in second pass |
| Clone directed graph | Directed edges | Same approach, order matters less |
| Clone weighted graph | Edge weights | Store weight info in edge structure |
| Deep copy linked list | Linear graph | Two-pass or interleaving |

---

## ⚠️ Common Mistakes

### 1. Not Storing Clone Before Recursing

```python
# ❌ Wrong: Infinite loop on cycles!
def dfs(node):
    if node in cloned:
        return cloned[node]
    
    clone = Node(node.val)
    
    for neighbor in node.neighbors:
        clone.neighbors.append(dfs(neighbor))  # May revisit node!
    
    cloned[node] = clone  # Too late!
    return clone

# ✅ Correct: Store clone BEFORE recursing
def dfs(node):
    if node in cloned:
        return cloned[node]
    
    clone = Node(node.val)
    cloned[node] = clone  # Store first!
    
    for neighbor in node.neighbors:
        clone.neighbors.append(dfs(neighbor))
    
    return clone
```

### 2. Using Node Values as Keys

```python
# ❌ Wrong: Values might not be unique in general
cloned = {}
cloned[node.val] = Node(node.val)  # Collision if same values

# ✅ Correct: Use node objects as keys
cloned = {}
cloned[node] = Node(node.val)  # Node identity, not value
```

### 3. Forgetting Null Check

```python
# ❌ Wrong: Crashes on empty graph
def cloneGraph(node):
    return dfs(node)  # What if node is None?

# ✅ Correct: Handle empty graph
def cloneGraph(node):
    if not node:
        return None
    return dfs(node)
```

---

## 🎤 Interview Walkthrough

**Clarify (1 min):**
> "I need to create a deep copy, meaning new node objects with the same connections. The graph may have cycles. Node values are unique?"

**Approach (2 min):**
> "I'll use DFS with a hash map. The key insight is storing the clone BEFORE recursing into neighbors - this handles cycles. When I encounter a node I've already cloned, I just return that clone."

**Code (8-10 min):**
> Write the DFS solution with clear variable names.

**Test (2 min):**
```
Simple cycle: 1 ─ 2

DFS(1): create 1', store cloned[1]=1'
  → DFS(2): create 2', store cloned[2]=2'
    → DFS(1): 1 in cloned, return 1'
  → 2'.neighbors = [1']
→ 1'.neighbors = [2']
Return 1'
```

**Complexity (1 min):**
> "O(V + E) time - we visit each node once and process each edge. O(V) space for the hash map plus O(V) for recursion in the worst case."

---

## 📝 Related Problems

| Problem | Focus | Link |
|---------|-------|------|
| Copy List with Random Pointer | Linear + random | [LC 138](https://leetcode.com/problems/copy-list-with-random-pointer/) |
| Clone Binary Tree with Random | Tree + random | [LC 1485](https://leetcode.com/problems/clone-binary-tree-with-random-pointer/) |
| Clone N-ary Tree | Tree version | [LC 1490](https://leetcode.com/problems/clone-n-ary-tree/) |

---

> **💡 Key Insight:** The critical trick is storing the clone in the map BEFORE recursing into neighbors. This creates a "placeholder" that handles cycles - when we circle back, the clone already exists.

---

**Back:** [← Number of Islands](./01-Number-Of-Islands-LC200.md)
