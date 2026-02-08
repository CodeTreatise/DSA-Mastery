# LC 210: Course Schedule II

> **Return the actual course order - topological sort with result extraction**
>
> ⏱️ **Interview Time:** 15-20 min | 📊 **Difficulty:** Medium | 🎯 **Frequency:** Very High

---

## Problem Statement

There are `numCourses` courses labeled `0` to `numCourses - 1`. Given `prerequisites` where `prerequisites[i] = [ai, bi]` means you must take `bi` before `ai`.

Return the ordering of courses to finish all courses. If impossible, return an empty array.

```
Example 1:
Input: numCourses = 2, prerequisites = [[1,0]]
Output: [0,1]
Explanation: Take course 0 first, then course 1.

Example 2:
Input: numCourses = 4, prerequisites = [[1,0],[2,0],[3,1],[3,2]]
Output: [0,1,2,3] or [0,2,1,3]
Explanation: Multiple valid orderings exist.

Example 3:
Input: numCourses = 1, prerequisites = []
Output: [0]
```

---

## 🎯 Pattern Recognition

**This is Topological Sort:**
- Course Schedule I asked "is it possible?"
- Course Schedule II asks "what is the order?"
- Same algorithm, just collect the result

---

## 💻 Solution

### Kahn's Algorithm (BFS)

**Python:**
```python
from collections import deque, defaultdict
from typing import List

def findOrder(numCourses: int, prerequisites: List[List[int]]) -> List[int]:
    """
    Return a valid course order, or empty list if impossible.
    
    Time: O(V + E)
    Space: O(V + E)
    """
    # Build graph: prereq → course
    graph = defaultdict(list)
    in_degree = [0] * numCourses
    
    for course, prereq in prerequisites:
        graph[prereq].append(course)
        in_degree[course] += 1
    
    # Start with courses having no prerequisites
    queue = deque()
    for course in range(numCourses):
        if in_degree[course] == 0:
            queue.append(course)
    
    order = []
    
    while queue:
        course = queue.popleft()
        order.append(course)  # Add to result!
        
        for next_course in graph[course]:
            in_degree[next_course] -= 1
            if in_degree[next_course] == 0:
                queue.append(next_course)
    
    # Return order only if all courses can be taken
    return order if len(order) == numCourses else []


# Test
print(findOrder(4, [[1,0],[2,0],[3,1],[3,2]]))
# [0, 1, 2, 3] or [0, 2, 1, 3]
```

### DFS Approach

```python
def findOrder_dfs(numCourses: int, prerequisites: List[List[int]]) -> List[int]:
    """DFS approach with post-order collection."""
    graph = defaultdict(list)
    for course, prereq in prerequisites:
        graph[prereq].append(course)
    
    WHITE, GRAY, BLACK = 0, 1, 2
    state = [WHITE] * numCourses
    order = []
    has_cycle = [False]
    
    def dfs(node: int) -> None:
        if has_cycle[0]:
            return
        
        state[node] = GRAY
        
        for neighbor in graph[node]:
            if state[neighbor] == GRAY:
                has_cycle[0] = True
                return
            if state[neighbor] == WHITE:
                dfs(neighbor)
        
        state[node] = BLACK
        order.append(node)  # Post-order
    
    for course in range(numCourses):
        if state[course] == WHITE:
            dfs(course)
            if has_cycle[0]:
                return []
    
    return order[::-1]  # Reverse post-order!
```

**JavaScript:**
```javascript
function findOrder(numCourses, prerequisites) {
    const graph = new Map();
    const inDegree = new Array(numCourses).fill(0);
    
    for (let i = 0; i < numCourses; i++) {
        graph.set(i, []);
    }
    
    for (const [course, prereq] of prerequisites) {
        graph.get(prereq).push(course);
        inDegree[course]++;
    }
    
    const queue = [];
    for (let i = 0; i < numCourses; i++) {
        if (inDegree[i] === 0) queue.push(i);
    }
    
    const order = [];
    
    while (queue.length > 0) {
        const course = queue.shift();
        order.push(course);
        
        for (const next of graph.get(course)) {
            inDegree[next]--;
            if (inDegree[next] === 0) queue.push(next);
        }
    }
    
    return order.length === numCourses ? order : [];
}
```

---

## 🔄 Step-by-Step Trace

```
numCourses = 4
prerequisites = [[1,0],[2,0],[3,1],[3,2]]

Graph:
0 → 1 → 3
0 → 2 → 3

In-degrees: [0, 1, 1, 2]

Step 1: Queue = [0], Order = []
        Process 0: reduce in-deg of 1, 2
        In-degrees: [-, 0, 0, 2]
        
Step 2: Queue = [1, 2], Order = [0]
        Process 1: reduce in-deg of 3
        In-degrees: [-, -, 0, 1]

Step 3: Queue = [2], Order = [0, 1]
        Process 2: reduce in-deg of 3
        In-degrees: [-, -, -, 0]

Step 4: Queue = [3], Order = [0, 1, 2]
        Process 3

Final: Order = [0, 1, 2, 3] ✓
```

---

## ⚡ Complexity Analysis

| Aspect | Complexity | Notes |
|--------|------------|-------|
| **Time** | O(V + E) | Same as Course Schedule I |
| **Space** | O(V + E) | Graph + result array |

---

## ⚠️ Common Mistakes

### 1. Returning Wrong Result on Cycle

```python
# ❌ Wrong: Returning partial order
return order  # May be incomplete

# ✅ Correct: Check if all courses included
return order if len(order) == numCourses else []
```

### 2. DFS Without Reversal

```python
# ❌ Wrong: DFS collects in post-order (reversed)
return order

# ✅ Correct: Reverse for topological order
return order[::-1]
```

---

## 🎤 Interview Walkthrough

**Clarify:**
> "Same as Course Schedule I, but now I need to return one valid ordering. If there's a cycle, return empty array."

**Approach:**
> "I'll use Kahn's algorithm. Instead of just counting, I'll collect the order of courses as I process them."

**Follow-up questions:**
- **Q: What if multiple valid orderings?**
  > A: Any valid ordering is acceptable. Different queue orders give different results.

- **Q: What if no prerequisites?**
  > A: All courses have in-degree 0, so any order works: [0, 1, 2, ...n-1]

---

## 📝 Variations

| Variation | Difference | Link |
|-----------|------------|------|
| Minimum semesters | Level-by-level BFS | LC 1136 |
| All valid orderings | Backtracking | Custom |
| Parallel execution | Concurrent courses | LC 1136 |

---

> **💡 Key Insight:** Course Schedule II is just Course Schedule I with result collection. The only difference is `order.append(course)` and returning the order instead of a boolean.

---

**Back:** [← Course Schedule](./01-Course-Schedule-LC207.md)
