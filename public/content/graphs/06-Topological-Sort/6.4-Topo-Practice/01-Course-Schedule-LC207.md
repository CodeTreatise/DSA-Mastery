# LC 207: Course Schedule

> **The classic topological sort problem - can you finish all courses?**
>
> ⏱️ **Interview Time:** 15-20 min | 📊 **Difficulty:** Medium | 🎯 **Frequency:** Very High (All FAANG)

---

## Problem Statement

There are `numCourses` courses labeled from `0` to `numCourses - 1`. You're given an array `prerequisites` where `prerequisites[i] = [ai, bi]` indicates you must take course `bi` before course `ai`.

Return `true` if you can finish all courses, `false` otherwise.

```
Example 1:
Input: numCourses = 2, prerequisites = [[1,0]]
Output: true
Explanation: Take course 0, then course 1.

Example 2:
Input: numCourses = 2, prerequisites = [[1,0],[0,1]]
Output: false
Explanation: 0 requires 1, 1 requires 0 → cycle!
```

---

## 🎯 Pattern Recognition

**This is "Cycle Detection in Directed Graph":**
- Prerequisites form directed edges: prereq → course
- If no cycle → valid topological order exists → can finish
- If cycle → impossible to finish

---

## 📐 Algorithm

### Approach 1: Kahn's Algorithm (BFS)

```
1. Build graph: prereq → course
2. Calculate in-degrees
3. Process nodes with in-degree 0
4. If all nodes processed → no cycle → true
   Else → cycle exists → false
```

### Approach 2: DFS with Three Colors

```
1. Run DFS from each unvisited node
2. Use WHITE/GRAY/BLACK coloring
3. If we hit a GRAY node → back edge → cycle
4. If all DFS complete without cycle → true
```

---

## 💻 Solution

### Kahn's Algorithm (Recommended)

**Python:**
```python
from collections import deque, defaultdict
from typing import List

def canFinish(numCourses: int, prerequisites: List[List[int]]) -> bool:
    """
    Check if all courses can be finished (no cycle exists).
    
    Time: O(V + E) where V = numCourses, E = len(prerequisites)
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
    
    # Process courses
    finished = 0
    
    while queue:
        course = queue.popleft()
        finished += 1
        
        for next_course in graph[course]:
            in_degree[next_course] -= 1
            if in_degree[next_course] == 0:
                queue.append(next_course)
    
    # If all courses finished, no cycle exists
    return finished == numCourses


# Test cases
print(canFinish(2, [[1,0]]))        # True
print(canFinish(2, [[1,0],[0,1]])) # False (cycle)
print(canFinish(4, [[1,0],[2,0],[3,1],[3,2]]))  # True
```

### DFS with Cycle Detection

```python
def canFinish_dfs(numCourses: int, prerequisites: List[List[int]]) -> bool:
    """DFS approach with three-color marking."""
    graph = defaultdict(list)
    for course, prereq in prerequisites:
        graph[prereq].append(course)
    
    WHITE, GRAY, BLACK = 0, 1, 2
    state = [WHITE] * numCourses
    
    def has_cycle(node: int) -> bool:
        """Returns True if cycle detected from this node."""
        state[node] = GRAY
        
        for neighbor in graph[node]:
            if state[neighbor] == GRAY:
                return True  # Back edge = cycle
            if state[neighbor] == WHITE:
                if has_cycle(neighbor):
                    return True
        
        state[node] = BLACK
        return False
    
    # Check each unvisited node
    for course in range(numCourses):
        if state[course] == WHITE:
            if has_cycle(course):
                return False
    
    return True
```

**JavaScript:**
```javascript
function canFinish(numCourses, prerequisites) {
    // Build graph: prereq → course
    const graph = new Map();
    const inDegree = new Array(numCourses).fill(0);
    
    for (let i = 0; i < numCourses; i++) {
        graph.set(i, []);
    }
    
    for (const [course, prereq] of prerequisites) {
        graph.get(prereq).push(course);
        inDegree[course]++;
    }
    
    // Start with courses having no prerequisites
    const queue = [];
    for (let i = 0; i < numCourses; i++) {
        if (inDegree[i] === 0) queue.push(i);
    }
    
    let finished = 0;
    
    while (queue.length > 0) {
        const course = queue.shift();
        finished++;
        
        for (const nextCourse of graph.get(course)) {
            inDegree[nextCourse]--;
            if (inDegree[nextCourse] === 0) {
                queue.push(nextCourse);
            }
        }
    }
    
    return finished === numCourses;
}
```

---

## ⚡ Complexity Analysis

| Aspect | Complexity | Notes |
|--------|------------|-------|
| **Time** | O(V + E) | V = courses, E = prerequisites |
| **Space** | O(V + E) | Graph + in-degree array |

---

## ⚠️ Common Mistakes

### 1. Wrong Edge Direction

```python
# ❌ Wrong: [course, prereq] but edge goes wrong way
for course, prereq in prerequisites:
    graph[course].append(prereq)  # Wrong!
    
# ✅ Correct: Edge from prereq TO course
for course, prereq in prerequisites:
    graph[prereq].append(course)
```

### 2. Forgetting Isolated Courses

```python
# ❌ Wrong: Only initialize nodes that appear in edges
graph = {}
for course, prereq in prerequisites:
    # Courses with no prereqs might be missed!

# ✅ Correct: Initialize all courses
for course in range(numCourses):
    if in_degree[course] == 0:
        queue.append(course)
```

---

## 🎤 Interview Walkthrough

**Clarify (30 sec):**
> "So prerequisites[i] = [a, b] means I must take b before a. I need to check if there's a valid order to take all courses - which means checking for cycles."

**Approach (1 min):**
> "I'll model this as a directed graph where an edge from b to a means 'take b before a'. If there's no cycle, I can finish all courses. I'll use Kahn's algorithm - start with courses having no prerequisites and process them, updating in-degrees."

**Code (8-10 min):**
> Write the solution.

**Edge cases:**
- No prerequisites → always possible
- Self-loop → cycle
- Disconnected components → handle all

---

## 📝 Related Problems

| Problem | Next Step | Link |
|---------|-----------|------|
| Course Schedule II | Return the actual order | [LC 210](https://leetcode.com/problems/course-schedule-ii/) |
| Parallel Courses | Minimum semesters | [LC 1136](https://leetcode.com/problems/parallel-courses/) |
| Alien Dictionary | Build graph from strings | [LC 269](https://leetcode.com/problems/alien-dictionary/) |

---

> **💡 Key Insight:** "Can you finish all courses?" = "Is there a cycle in the prerequisite graph?" Kahn's algorithm naturally answers this: if we can't process all nodes, there's a cycle.

---

**Next:** [Course Schedule II →](./02-Course-Schedule-II-LC210.md)
