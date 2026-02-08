# 01 - Level Order Traversal (LC 102)

> **Grokking Pattern:** #10 Tree BFS
>
> **Difficulty:** Medium | **Frequency:** ⭐⭐⭐⭐⭐ Very Common

---

## Problem Statement

Given the `root` of a binary tree, return the **level order traversal** of its nodes' values (i.e., from left to right, level by level).

```
Input: root = [3,9,20,null,null,15,7]
        3
       / \
      9   20
         /  \
        15   7

Output: [[3],[9,20],[15,7]]
```

[LeetCode 102 - Binary Tree Level Order Traversal](https://leetcode.com/problems/binary-tree-level-order-traversal/)

---

## 🎯 Pattern Recognition

<details>
<summary><strong>How to Identify This Pattern</strong></summary>

**Look for these signals:**
- "Level order" or "level by level"
- "Breadth-first" traversal
- Need nodes grouped by depth

**This is the canonical BFS problem.** Master it and you can solve all BFS variations.

</details>

---

## ✅ When to Use

- Need nodes grouped by level
- Process tree level by level
- Foundation for other BFS problems

---

## ❌ When NOT to Use

| Situation | Why Not | Use Instead |
|-----------|---------|-------------|
| Just need flattened list | No level grouping | Simple BFS |
| Need path from root | DFS more natural | DFS |
| Memory constraints | Queue can be large | DFS with depth |

---

## 🔗 Concept Map

<details>
<summary><strong>Prerequisites & Next Steps</strong></summary>

**Before this, you should know:**
- [BFS Concept](./00-BFS-Concept.md)
- Queue data structure

**After mastering this:**
- [Zigzag Level Order](./02-Zigzag-Level-Order.md)
- [Right Side View](./04-Right-Side-View.md)
- [Level Averages](./03-Level-Averages.md)

**Related:**
- [Bottom-Up Level Order](https://leetcode.com/problems/binary-tree-level-order-traversal-ii/) - Just reverse result

</details>

---

## 📐 How It Works

### Level by Level Processing

```
        3           Level 0
       / \
      9   20        Level 1
         /  \
        15   7      Level 2

Queue states:
Start:     [3]
Level 0:   process 3, add 9,20 → [9, 20]
Level 1:   process 9,20, add 15,7 → [15, 7]
Level 2:   process 15,7, no children → []

Result: [[3], [9, 20], [15, 7]]
```

### The Key: Capturing Level Size

```
At start of each level:
level_size = len(queue)  # How many nodes in current level

Then process EXACTLY that many nodes.
Their children form the next level.
```

---

## 💻 Code Implementation

### Solution 1: BFS with Queue

**Python:**
```python
from typing import Optional, List
from collections import deque

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right


def level_order(root: Optional[TreeNode]) -> List[List[int]]:
    """
    Level order traversal using BFS.
    
    Time: O(n), Space: O(w) where w = max width
    """
    if not root:
        return []
    
    result = []
    queue = deque([root])
    
    while queue:
        level_size = len(queue)
        current_level = []
        
        for _ in range(level_size):
            node = queue.popleft()
            current_level.append(node.val)
            
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
        
        result.append(current_level)
    
    return result
```

**JavaScript:**
```javascript
// Note: Array.shift() is O(n), but acceptable for interviews.
// For production, consider a proper Queue implementation.
function levelOrder(root) {
    if (!root) return [];
    
    const result = [];
    const queue = [root];
    
    while (queue.length > 0) {
        const levelSize = queue.length;
        const currentLevel = [];
        
        for (let i = 0; i < levelSize; i++) {
            const node = queue.shift();  // O(n) but acceptable for interviews
            currentLevel.push(node.val);
            
            if (node.left) queue.push(node.left);
            if (node.right) queue.push(node.right);
        }
        
        result.push(currentLevel);
    }
    
    return result;
}
```

### Solution 2: DFS with Depth Tracking

**Python:**
```python
def level_order_dfs(root: Optional[TreeNode]) -> List[List[int]]:
    """
    Level order using DFS with depth parameter.
    
    Alternative approach - useful when BFS not ideal.
    Time: O(n), Space: O(h)
    """
    result = []
    
    def dfs(node, depth):
        if not node:
            return
        
        # Extend result if we've reached a new level
        if depth == len(result):
            result.append([])
        
        result[depth].append(node.val)
        
        dfs(node.left, depth + 1)
        dfs(node.right, depth + 1)
    
    dfs(root, 0)
    return result
```

**JavaScript:**
```javascript
function levelOrderDFS(root) {
    const result = [];
    
    function dfs(node, depth) {
        if (!node) return;
        
        if (depth === result.length) {
            result.push([]);
        }
        
        result[depth].push(node.val);
        
        dfs(node.left, depth + 1);
        dfs(node.right, depth + 1);
    }
    
    dfs(root, 0);
    return result;
}
```

### Solution 3: BFS - Bottom Up (LC 107)

**Python:**
```python
def level_order_bottom(root: Optional[TreeNode]) -> List[List[int]]:
    """
    Bottom-up level order - just reverse the result.
    
    LeetCode 107 - Level Order Traversal II
    """
    if not root:
        return []
    
    result = []
    queue = deque([root])
    
    while queue:
        level_size = len(queue)
        current_level = []
        
        for _ in range(level_size):
            node = queue.popleft()
            current_level.append(node.val)
            
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
        
        result.append(current_level)
    
    return result[::-1]  # Just reverse!
```

---

## ⚡ Complexity Analysis

| Approach | Time | Space | Notes |
|----------|------|-------|-------|
| BFS |" O(n) "| O(w) | w = max width |
| DFS |" O(n) "| O(h) | h = height |

**BFS Space:**
- Balanced tree: O(n/2) ≈ O(n) at bottom level
- Skewed tree: O(1)

**DFS Space:**
- Balanced tree: O(log n)
- Skewed tree: O(n)

---

## 🔄 Variations

| Variation | Change | LeetCode |
|-----------|--------|----------|
| Bottom-Up | Reverse result | LC 107 |
| Zigzag | Alternate direction | LC 103 |
| Right Side View | Last per level | LC 199 |
| Averages | Mean per level | LC 637 |
| N-ary Level Order | Multiple children | LC 429 |

---

## ⚠️ Common Mistakes

### 1. Not Capturing Level Size Correctly

```python
# ❌ WRONG: Using len(queue) inside loop
for i in range(len(queue)):  # This changes as we add children!
    node = queue.popleft()
    queue.append(node.left)  # len(queue) just increased!

# ✅ CORRECT: Capture size before loop
level_size = len(queue)
for _ in range(level_size):
    node = queue.popleft()
    # Add children - size doesn't matter now
```

### 2. Forgetting Empty Tree Check

```python
# ❌ WRONG: Crashes on empty tree
def level_order(root):
    queue = deque([root])  # [None] in queue!
    while queue:
        node = queue.popleft()
        node.val  # NoneType has no attribute 'val'

# ✅ CORRECT: Check for empty tree
def level_order(root):
    if not root:
        return []
    queue = deque([root])
    # ...
```

### 3. Using Slow List Operations

```python
# ❌ SLOW: list.pop(0) is O(n)
queue = [root]
node = queue.pop(0)  # O(n) operation

# ✅ FAST: deque.popleft() is O(1)
from collections import deque
queue = deque([root])
node = queue.popleft()  # O(1) operation
```

---

## 📝 Practice Problems

### This Problem
- [ ] [Binary Tree Level Order Traversal](https://leetcode.com/problems/binary-tree-level-order-traversal/) - LC 102

### Variations
- [ ] [Level Order Traversal II (Bottom-Up)](https://leetcode.com/problems/binary-tree-level-order-traversal-ii/) - LC 107
- [ ] [N-ary Tree Level Order Traversal](https://leetcode.com/problems/n-ary-tree-level-order-traversal/) - LC 429
- [ ] [Cousins in Binary Tree](https://leetcode.com/problems/cousins-in-binary-tree/) - LC 993

<details>
<summary><strong>🧠 Spaced Repetition Schedule</strong></summary>

**Day 1:** Standard BFS solution
**Day 3:** DFS alternative approach
**Day 7:** Solve bottom-up variation
**Day 14:** Solve without looking at notes

</details>

---

## 🎤 Interview Context

<details>
<summary><strong>How to Communicate in Interviews</strong></summary>

**Starting the problem:**
> "This is a classic BFS problem. I'll use a queue and process nodes level by level, capturing the level size at the start of each iteration."

**Explaining the key insight:**
> "The trick is to capture `len(queue)` before the loop. This tells me exactly how many nodes are at the current level, even as I add their children to the queue."

**Follow-up - DFS alternative:**
> "I could also use DFS with a depth parameter. When depth equals the result length, I create a new level. This uses O(h) space instead of O(w)."

**Trade-off discussion:**
> "BFS is more intuitive for level-order but uses O(w) space. For very wide trees, DFS might be better. For very deep trees, BFS might be better."

</details>

**Company Focus:**

| Company | Frequency | Notes |
|---------|-----------|-------|
| Amazon | ⭐⭐⭐⭐⭐ | Very common |
| Meta | ⭐⭐⭐⭐⭐ | Basic expectation |
| Google | ⭐⭐⭐⭐ | Foundation for harder problems |
| Microsoft | ⭐⭐⭐⭐⭐ | Classic question |
| Apple | ⭐⭐⭐⭐ | Standard interview |

---

## ⏱️ Time Estimates

| Activity | Time | Notes |
|----------|------|-------|
| BFS solution | 5-7 min | Should be quick |
| DFS alternative | 5-7 min | If asked |
| Explain trade-offs | 2-3 min | BFS vs DFS space |

---

> **💡 Key Insight:** Level order traversal is THE fundamental BFS problem. The pattern of `level_size = len(queue)` followed by processing exactly that many nodes is used in virtually every BFS tree problem. Master this and you can tackle any level-based tree problem.

---

## 🔗 Related

- [BFS Concept](./00-BFS-Concept.md)
- [Zigzag Level Order](./02-Zigzag-Level-Order.md)
- [Right Side View](./04-Right-Side-View.md)
