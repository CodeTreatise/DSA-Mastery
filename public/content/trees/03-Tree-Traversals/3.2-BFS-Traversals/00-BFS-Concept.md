# BFS Concept - Tree Level Order Traversal

> **Grokking Pattern:** #10 Tree BFS
>
> **Interview Frequency:** ⭐⭐⭐⭐⭐ Highest Priority (Part of ~25% of problems with DFS)

---

## What is Tree BFS?

**Breadth-First Search (BFS)** explores a tree level by level, processing all nodes at depth `d` before any node at depth `d+1`.

```
        1           Level 0: [1]
       / \
      2   3         Level 1: [2, 3]
     / \   \
    4   5   6       Level 2: [4, 5, 6]

BFS order: 1 → 2 → 3 → 4 → 5 → 6
```

**Key Data Structure:** Queue (FIFO)

---

## 🎯 Pattern Recognition

<details>
<summary><strong>How to Identify BFS Problems</strong></summary>

**BFS is the right choice when:**
- Problem mentions "level" or "level-by-level"
- Need to find "shortest path" (in terms of edges)
- Process nodes "at the same depth"
- Find "minimum distance" to something
- "Rightmost" or "leftmost" at each level

**Keywords:**
- "Level order", "breadth-first"
- "Minimum depth to leaf"
- "Right side view", "bottom view"
- "Level averages", "level sums"
- "Zigzag" traversal

</details>

---

## ✅ When to Use BFS

- Level-by-level processing
- Finding minimum depth/distance
- Getting nodes at each level
- Right/left side views
- "First occurrence" at each depth

---

## ❌ When NOT to Use

| Situation | Why Not | Use Instead |
|-----------|---------|-------------|
| Need to go deep first | Wrong traversal order | DFS |
| Path from root to node | DFS more natural | DFS with path tracking |
| Compute heights | Need children info first | DFS Postorder |
| Memory-constrained, deep tree | Queue too large | DFS |

---

## 🔗 Concept Map

<details>
<summary><strong>Prerequisites & Next Steps</strong></summary>

**Before this, you should know:**
- Queue data structure
- [DFS Concept](../3.1-DFS-Traversals/00-DFS-Concept.md) - For comparison

**After mastering this:**
- [Level Order Traversal](./01-Level-Order.md)
- [Zigzag Level Order](./02-Zigzag-Level-Order.md)
- [Right Side View](./04-Right-Side-View.md)

**BFS in Graphs:**
- Same concept, but need visited set to avoid cycles

</details>

---

## 📐 How BFS Works

### The Queue Approach

```
Initialize: queue = [root]

While queue not empty:
    1. Record level size (how many nodes at this level)
    2. Process all nodes at current level:
       - Dequeue node
       - Process it
       - Enqueue its children
    3. Move to next level
```

### Visualization

```
Initial:          Queue: [1]
                  Level 0 processing

After Level 0:    Queue: [2, 3]
                  Processed: [1]

After Level 1:    Queue: [4, 5, 6]
                  Processed: [1, 2, 3]

After Level 2:    Queue: []
                  Processed: [1, 2, 3, 4, 5, 6]
```

---

## 💻 Universal BFS Template

### Template 1: Basic Level Order

**Python:**
```python
from typing import Optional, List
from collections import deque

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right


def bfs_template(root: Optional[TreeNode]) -> List[List[int]]:
    """
    Universal BFS template for trees.
    
    Returns nodes grouped by level.
    Time: O(n), Space: O(w) where w = max width
    """
    if not root:
        return []
    
    result = []
    queue = deque([root])
    
    while queue:
        level_size = len(queue)  # Important: capture size BEFORE processing
        level_nodes = []
        
        for _ in range(level_size):
            node = queue.popleft()
            level_nodes.append(node.val)  # Process node
            
            # Add children for next level
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
        
        result.append(level_nodes)
    
    return result
```

**JavaScript:**
```javascript
// Note: Array.shift() is O(n), but acceptable for interviews.
// For production, consider a proper Queue implementation.
function bfsTemplate(root) {
    if (!root) return [];
    
    const result = [];
    const queue = [root];
    
    while (queue.length > 0) {
        const levelSize = queue.length;
        const levelNodes = [];
        
        for (let i = 0; i < levelSize; i++) {
            const node = queue.shift();  // O(n) but acceptable for interviews
            levelNodes.push(node.val);
            
            if (node.left) queue.push(node.left);
            if (node.right) queue.push(node.right);
        }
        
        result.push(levelNodes);
    }
    
    return result;
}
```

### Template 2: Single Value Per Level (e.g., Rightmost)

**Python:**
```python
def bfs_rightmost(root: Optional[TreeNode]) -> List[int]:
    """
    Get the rightmost node at each level.
    """
    if not root:
        return []
    
    result = []
    queue = deque([root])
    
    while queue:
        level_size = len(queue)
        
        for i in range(level_size):
            node = queue.popleft()
            
            # Only add the last node of each level
            if i == level_size - 1:
                result.append(node.val)
            
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
    
    return result
```

### Template 3: Level Aggregate (e.g., Average)

**Python:**
```python
def bfs_level_average(root: Optional[TreeNode]) -> List[float]:
    """
    Calculate average value at each level.
    """
    if not root:
        return []
    
    result = []
    queue = deque([root])
    
    while queue:
        level_size = len(queue)
        level_sum = 0
        
        for _ in range(level_size):
            node = queue.popleft()
            level_sum += node.val
            
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
        
        result.append(level_sum / level_size)
    
    return result
```

---

## ⚡ Complexity Analysis

| Aspect | Value | Notes |
|--------|-------|-------|
| Time |" O(n) "| Visit each node once |
| Space |" O(w) "| w = max width of tree |

**Space Analysis:**
- Best case (skewed tree): O(1) - only one node per level
- Worst case (complete tree): O(n/2) = O(n) - bottom level has n/2 nodes
- Balanced tree: O(n) at the widest level

---

## 🔄 BFS Variations

| Variation | Key Change | LeetCode |
|-----------|------------|----------|
| Level Order | Standard BFS | LC 102 |
| Zigzag | Alternate direction per level | LC 103 |
| Right Side View | Only rightmost per level | LC 199 |
| Level Averages | Compute average | LC 637 |
| Bottom-Up Level Order | Reverse result | LC 107 |
| Vertical Order | Track column | LC 987 |

---

## ⚠️ Common Mistakes

### 1. Not Capturing Level Size

```python
# ❌ WRONG: Queue size changes during iteration
while queue:
    for _ in range(len(queue)):  # len(queue) changes!
        node = queue.popleft()
        queue.append(node.left)  # Size increased!

# ✅ CORRECT: Capture size before processing
while queue:
    level_size = len(queue)  # Capture once
    for _ in range(level_size):
        # Now this is stable
```

### 2. Forgetting Null Check for Children

```python
# ❌ WRONG: Adding null to queue
if node.left:
    queue.append(node.left)
queue.append(node.right)  # Might be None!

# ✅ CORRECT: Check both
if node.left:
    queue.append(node.left)
if node.right:
    queue.append(node.right)
```

### 3. Using List Instead of Deque

```python
# ❌ SLOW: pop(0) is O(n)
queue = []
node = queue.pop(0)  # O(n) operation

# ✅ FAST: popleft() is O(1)
from collections import deque
queue = deque()
node = queue.popleft()  # O(1) operation
```

---

## 📝 BFS Practice Problems

### Easy
- [ ] [Binary Tree Level Order Traversal](https://leetcode.com/problems/binary-tree-level-order-traversal/) - LC 102
- [ ] [Average of Levels in Binary Tree](https://leetcode.com/problems/average-of-levels-in-binary-tree/) - LC 637
- [ ] [Minimum Depth of Binary Tree](https://leetcode.com/problems/minimum-depth-of-binary-tree/) - LC 111

### Medium
- [ ] [Binary Tree Zigzag Level Order](https://leetcode.com/problems/binary-tree-zigzag-level-order-traversal/) - LC 103
- [ ] [Binary Tree Right Side View](https://leetcode.com/problems/binary-tree-right-side-view/) - LC 199
- [ ] [Vertical Order Traversal](https://leetcode.com/problems/vertical-order-traversal-of-a-binary-tree/) - LC 987

<details>
<summary><strong>🧠 Spaced Repetition Schedule</strong></summary>

**Day 1:** Basic level order (LC 102)
**Day 3:** Right side view (LC 199)
**Day 7:** Zigzag traversal (LC 103)
**Day 14:** Vertical order (LC 987)

</details>

---

## 🎤 Interview Context

<details>
<summary><strong>How to Communicate in Interviews</strong></summary>

**When to mention BFS:**
> "Since this problem asks for level-by-level processing, I'll use BFS with a queue."

**Explaining the approach:**
> "I'll process the tree level by level. For each level, I capture the current queue size, process that many nodes, and their children become the next level."

**Comparing with DFS:**
> "I could use DFS with a depth parameter, but BFS is more natural here because we're explicitly working with levels."

</details>

**Company Focus:**

| Company | Frequency | Notes |
|---------|-----------|-------|
| Amazon | ⭐⭐⭐⭐⭐ | Very common |
| Meta | ⭐⭐⭐⭐⭐ | Often with variations |
| Google | ⭐⭐⭐⭐ | May combine with other techniques |
| Microsoft | ⭐⭐⭐⭐⭐ | Classic interview topic |

---

## ⏱️ Time Estimates

| Activity | Time | Notes |
|----------|------|-------|
| Basic level order | 5-7 min | Template application |
| With variation | 10-15 min | Depending on complexity |
| Explain approach | 2-3 min | Should be concise |

---

> **💡 Key Insight:** The critical moment in BFS is capturing `level_size = len(queue)` BEFORE the for loop. This tells you exactly how many nodes are at the current level, even as you add their children to the queue.

---

## 🔗 Related

- [DFS Concept](../3.1-DFS-Traversals/00-DFS-Concept.md) - Compare DFS vs BFS
- [Level Order Traversal](./01-Level-Order.md)
- [Graph BFS](../../../10-Graphs/bfs.md) - Same concept, needs visited set
