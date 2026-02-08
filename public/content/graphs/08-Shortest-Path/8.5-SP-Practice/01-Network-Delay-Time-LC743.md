# LC 743: Network Delay Time

> **Classic Dijkstra implementation - find time for signal to reach all nodes**
>
> ⏱️ **Interview Time:** 20 min | 📊 **Difficulty:** Medium | 🎯 **Pattern:** Dijkstra

---

## Problem Statement

You are given a network of `n` nodes, labeled from `1` to `n`. You are also given `times`, a list of travel times as directed edges `times[i] = (ui, vi, wi)`, where `ui` is the source node, `vi` is the target node, and `wi` is the time it takes for a signal to travel from source to target.

We will send a signal from a given node `k`. Return **the minimum time it takes for all the n nodes to receive the signal**. If it is impossible for all the `n` nodes to receive the signal, return `-1`.

```
Example 1:
Input: times = [[2,1,1],[2,3,1],[3,4,1]], n = 4, k = 2
Output: 2

    1 ← (1) ─ 2 ─ (1) → 3 ─ (1) → 4
              ↓
            start

Signal reaches: node 2 at t=0, node 1 at t=1, node 3 at t=1, node 4 at t=2
Answer = max(all times) = 2

Example 2:
Input: times = [[1,2,1]], n = 2, k = 2
Output: -1
(Can't reach node 1 from node 2)
```

---

## 🎯 Pattern Recognition

**This is a classic Dijkstra problem:**
- Weighted directed graph
- Non-negative weights (travel times)
- Single source (node k)
- Need shortest path to ALL nodes

**Key insight:**
The answer is `max(shortest_path[k][i] for all i)` - the time for the signal to reach the farthest node.

---

## 📐 Algorithm

```
1. Build adjacency list from times
2. Run Dijkstra from node k
3. Return max distance (or -1 if any node unreachable)
```

---

## 💻 Solution

**Python:**
```python
import heapq
from collections import defaultdict
from typing import List

def networkDelayTime(times: List[List[int]], n: int, k: int) -> int:
    """
    Find time for signal to reach all nodes from k.
    
    Time: O(E log V)
    Space: O(V + E)
    """
    # Build graph (1-indexed nodes)
    graph = defaultdict(list)
    for u, v, w in times:
        graph[u].append((v, w))
    
    # Dijkstra from k
    dist = {k: 0}
    heap = [(0, k)]
    
    while heap:
        d, u = heapq.heappop(heap)
        
        if d > dist.get(u, float('inf')):
            continue
        
        for v, w in graph[u]:
            if d + w < dist.get(v, float('inf')):
                dist[v] = d + w
                heapq.heappush(heap, (dist[v], v))
    
    # Check if all nodes reachable
    if len(dist) != n:
        return -1
    
    return max(dist.values())


# Alternative: Array-based for faster access
def networkDelayTimeArray(times: List[List[int]], n: int, k: int) -> int:
    graph = defaultdict(list)
    for u, v, w in times:
        graph[u].append((v, w))
    
    dist = [float('inf')] * (n + 1)  # 1-indexed
    dist[k] = 0
    heap = [(0, k)]
    
    while heap:
        d, u = heapq.heappop(heap)
        
        if d > dist[u]:
            continue
        
        for v, w in graph[u]:
            if dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
                heapq.heappush(heap, (dist[v], v))
    
    result = max(dist[1:])  # Skip index 0
    return result if result != float('inf') else -1


# Test
print(networkDelayTime([[2,1,1],[2,3,1],[3,4,1]], 4, 2))  # 2
print(networkDelayTime([[1,2,1]], 2, 2))  # -1
```

**JavaScript:**
```javascript
function networkDelayTime(times, n, k) {
    // Build graph
    const graph = new Map();
    for (const [u, v, w] of times) {
        if (!graph.has(u)) graph.set(u, []);
        graph.get(u).push([v, w]);
    }
    
    // Dijkstra
    const dist = new Array(n + 1).fill(Infinity);
    dist[k] = 0;
    const heap = [[0, k]]; // [distance, node]
    
    while (heap.length > 0) {
        heap.sort((a, b) => a[0] - b[0]);
        const [d, u] = heap.shift();
        
        if (d > dist[u]) continue;
        
        for (const [v, w] of (graph.get(u) || [])) {
            if (dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
                heap.push([dist[v], v]);
            }
        }
    }
    
    const result = Math.max(...dist.slice(1));
    return result === Infinity ? -1 : result;
}
```

---

## 🔄 Step-by-Step Trace

```
times = [[2,1,1],[2,3,1],[3,4,1]], n = 4, k = 2

Graph:
  2 → [(1,1), (3,1)]
  3 → [(4,1)]

Dijkstra from k=2:
Initial: dist = {2: 0}, heap = [(0, 2)]

Pop (0, 2):
  Neighbor 1: dist[1] = 0 + 1 = 1
  Neighbor 3: dist[3] = 0 + 1 = 1
  heap = [(1, 1), (1, 3)]

Pop (1, 1):
  No neighbors
  heap = [(1, 3)]

Pop (1, 3):
  Neighbor 4: dist[4] = 1 + 1 = 2
  heap = [(2, 4)]

Pop (2, 4):
  No neighbors
  heap = []

Final: dist = {1: 1, 2: 0, 3: 1, 4: 2}
Answer = max(0, 1, 1, 2) = 2 ✓
```

---

## ⚡ Complexity Analysis

| Aspect | Complexity | Notes |
|--------|------------|-------|
| **Time** | O(E log V) | Standard Dijkstra |
| **Space** | O(V + E) | Graph + dist array |

---

## ⚠️ Common Mistakes

### 1. Forgetting 1-indexed Nodes

```python
# ❌ Wrong: Array size n, but nodes are 1 to n
dist = [float('inf')] * n  # Index 0 to n-1

# ✅ Correct: Array size n+1
dist = [float('inf')] * (n + 1)  # Index 1 to n
```

### 2. Not Checking All Nodes Reachable

```python
# ❌ Wrong: Just return max without checking
return max(dist)

# ✅ Correct: Check for unreachable nodes
result = max(dist[1:])
return result if result != float('inf') else -1
```

---

## 🎤 Interview Tips

**Opening:**
> "This is a single-source shortest path problem with non-negative weights. I'll use Dijkstra's algorithm to find the shortest time from k to all nodes, then return the maximum."

**Complexity explanation:**
> "With a binary heap, Dijkstra runs in O(E log V). We have E edges and V nodes, so this is efficient."

---

> **💡 Key Insight:** The time for ALL nodes to receive the signal equals the time for the FARTHEST node to receive it. So we want `max(shortest_path_times)`.

---

**Next:** [Path With Minimum Effort →](./02-Min-Effort-Path-LC1631.md)
