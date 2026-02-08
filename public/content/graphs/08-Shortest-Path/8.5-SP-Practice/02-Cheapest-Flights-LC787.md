# LC 787: Cheapest Flights Within K Stops

> **Bellman-Ford variant - shortest path with limited edges**
>
> ⏱️ **Interview Time:** 25 min | 📊 **Difficulty:** Medium | 🎯 **Pattern:** Modified BFS/Bellman-Ford

---

## Problem Statement

There are `n` cities connected by some number of flights. You are given an array `flights` where `flights[i] = [fromi, toi, pricei]` indicates a flight from city `fromi` to city `toi` with cost `pricei`.

You are also given three integers `src`, `dst`, and `k`, return **the cheapest price** from `src` to `dst` with **at most k stops**. If there is no such route, return `-1`.

```
Example 1:
Input: n = 4, flights = [[0,1,100],[1,2,100],[2,0,100],[1,3,600],[2,3,200]], 
       src = 0, dst = 3, k = 1
Output: 700

    0 ─(100)→ 1 ─(600)→ 3
    ↑         ↓
   (100)    (100)
    ↓         ↓
    2 ←───────┘
      ─(200)→ 3

Path: 0 → 1 → 3 costs 100 + 600 = 700 (1 stop at node 1)
Path: 0 → 1 → 2 → 3 would be 100 + 100 + 200 = 400, but that's 2 stops!
```

---

## 🎯 Pattern Recognition

**This is "Limited Edge Shortest Path":**
- Shortest path with constraint on number of edges
- K stops = K+1 edges maximum
- Can't just use regular Dijkstra (greed doesn't work with constraints)

**Three valid approaches:**
1. **Bellman-Ford with K+1 iterations** - O(K × E)
2. **BFS with level tracking** - O(K × V)
3. **Dijkstra with state (node, stops)** - O(K × E log V)

---

## 💻 Solution 1: Bellman-Ford (Recommended)

```python
from typing import List

def findCheapestPrice(n: int, flights: List[List[int]], 
                      src: int, dst: int, k: int) -> int:
    """
    Bellman-Ford limited to k+1 iterations.
    
    Key: Use copy of distances to prevent "cascading" within same iteration.
    
    Time: O(K × E)
    Space: O(V)
    """
    INF = float('inf')
    dist = [INF] * n
    dist[src] = 0
    
    # K stops = K+1 edges
    for _ in range(k + 1):
        # CRITICAL: Use copy to avoid using updates from this iteration!
        new_dist = dist.copy()
        
        for u, v, price in flights:
            if dist[u] != INF and dist[u] + price < new_dist[v]:
                new_dist[v] = dist[u] + price
        
        dist = new_dist
    
    return dist[dst] if dist[dst] != INF else -1


# Test
print(findCheapestPrice(
    4, [[0,1,100],[1,2,100],[2,0,100],[1,3,600],[2,3,200]], 
    0, 3, 1
))  # 700
```

**JavaScript:**
```javascript
function findCheapestPrice(n, flights, src, dst, k) {
    let dist = new Array(n).fill(Infinity);
    dist[src] = 0;
    
    for (let i = 0; i <= k; i++) {
        const newDist = [...dist]; // Copy!
        
        for (const [u, v, price] of flights) {
            if (dist[u] !== Infinity && dist[u] + price < newDist[v]) {
                newDist[v] = dist[u] + price;
            }
        }
        
        dist = newDist;
    }
    
    return dist[dst] === Infinity ? -1 : dist[dst];
}
```

---

## 💻 Solution 2: BFS with Level Tracking

```python
from collections import defaultdict, deque

def findCheapestPriceBFS(n: int, flights: List[List[int]], 
                         src: int, dst: int, k: int) -> int:
    """
    BFS approach - explore level by level.
    
    Time: O(K × E)  
    Space: O(V)
    """
    graph = defaultdict(list)
    for u, v, price in flights:
        graph[u].append((v, price))
    
    dist = [float('inf')] * n
    dist[src] = 0
    queue = deque([(src, 0)])  # (node, cost)
    stops = 0
    
    while queue and stops <= k:
        for _ in range(len(queue)):
            u, cost_u = queue.popleft()
            
            for v, price in graph[u]:
                new_cost = cost_u + price
                
                # Only add to queue if this is a better path
                if new_cost < dist[v]:
                    dist[v] = new_cost
                    queue.append((v, new_cost))
        
        stops += 1
    
    return dist[dst] if dist[dst] != float('inf') else -1
```

---

## 💻 Solution 3: Dijkstra with State

```python
import heapq
from collections import defaultdict

def findCheapestPriceDijkstra(n: int, flights: List[List[int]], 
                              src: int, dst: int, k: int) -> int:
    """
    Dijkstra with state = (cost, node, stops_remaining)
    
    Time: O(K × E log V)
    Space: O(K × V)
    """
    graph = defaultdict(list)
    for u, v, price in flights:
        graph[u].append((v, price))
    
    # (cost, node, stops_remaining)
    heap = [(0, src, k + 1)]
    
    # Track best cost to reach (node, stops) state
    visited = {}
    
    while heap:
        cost, node, stops = heapq.heappop(heap)
        
        if node == dst:
            return cost
        
        if stops == 0:
            continue
        
        # Skip if we've seen this state with lower cost
        if (node, stops) in visited:
            continue
        visited[(node, stops)] = cost
        
        for neighbor, price in graph[node]:
            new_cost = cost + price
            heapq.heappush(heap, (new_cost, neighbor, stops - 1))
    
    return -1
```

---

## 🔄 Step-by-Step Trace (Bellman-Ford)

```
flights = [[0,1,100],[1,2,100],[2,0,100],[1,3,600],[2,3,200]]
src = 0, dst = 3, k = 1

Initial: dist = [0, ∞, ∞, ∞]

Iteration 1 (1 edge allowed):
  Copy: new_dist = [0, ∞, ∞, ∞]
  Edge (0,1,100): new_dist[1] = min(∞, 0+100) = 100
  Edge (1,2,100): dist[1] = ∞, skip
  Edge (2,0,100): dist[2] = ∞, skip
  Edge (1,3,600): dist[1] = ∞, skip
  Edge (2,3,200): dist[2] = ∞, skip
  After: dist = [0, 100, ∞, ∞]

Iteration 2 (2 edges = 1 stop):
  Copy: new_dist = [0, 100, ∞, ∞]
  Edge (0,1,100): new_dist[1] = min(100, 0+100) = 100
  Edge (1,2,100): new_dist[2] = min(∞, 100+100) = 200
  Edge (2,0,100): new_dist[0] = min(0, ∞) = 0
  Edge (1,3,600): new_dist[3] = min(∞, 100+600) = 700 ✓
  Edge (2,3,200): new_dist[3] = min(700, ∞) = 700
  After: dist = [0, 100, 200, 700]

Answer: dist[3] = 700 ✓
```

---

## ⚡ Complexity Analysis

| Approach | Time | Space | Notes |
|----------|------|-------|-------|
| Bellman-Ford | O(K × E) | O(V) | Simple and efficient |
| BFS | O(K × E) | O(V) | Level by level |
| Dijkstra | O(K × E log V) | O(K × V) | More complex |

---

## ⚠️ Common Mistakes

### 1. Not Using Distance Copy (CRITICAL!)

```python
# ❌ WRONG: Updates cascade within same iteration
for u, v, price in flights:
    if dist[u] + price < dist[v]:
        dist[v] = dist[u] + price
# Problem: If we update dist[1], then dist[1] is used to update dist[2]
# in the same iteration! This allows more than intended edges.

# ✅ CORRECT: Copy distances before iteration
new_dist = dist.copy()
for u, v, price in flights:
    if dist[u] + price < new_dist[v]:
        new_dist[v] = dist[u] + price
dist = new_dist
```

### 2. Wrong Number of Iterations

```python
# ❌ Wrong: k iterations for k stops
for _ in range(k):  # This allows only k edges!

# ✅ Correct: k+1 iterations for k stops (k stops = k+1 edges)
for _ in range(k + 1):
```

### 3. Dijkstra Without State Tracking

```python
# ❌ Wrong: Regular Dijkstra ignores stop constraint
# It might find cheaper path with more stops and miss valid answer

# ✅ Correct: Track (node, stops_remaining) as state
visited[(node, stops)] = cost
```

---

## 🎤 Interview Tips

**Opening:**
> "This is a shortest path with a constraint on edge count. Regular Dijkstra doesn't work because the greedy choice might use too many edges. I'll use Bellman-Ford limited to K+1 iterations."

**Why copy distances:**
> "We need to copy distances before each iteration to ensure we only use paths from the previous iteration. Otherwise updates within the same pass would effectively use more edges than allowed."

---

> **💡 Key Insight:** The copy of distances is crucial! Without it, updates within one iteration can "cascade" and effectively use more edges than the current iteration should allow.

---

**Back:** [← Network Delay Time](./01-Network-Delay-Time-LC743.md)
