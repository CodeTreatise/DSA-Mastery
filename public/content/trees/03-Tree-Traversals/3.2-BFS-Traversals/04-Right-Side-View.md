# 04 - Binary Tree Right Side View (LC 199)

> **Grokking Pattern:** #10 Tree BFS (Level Extremes)
>
> **Difficulty:** Medium | **Frequency:** ⭐⭐⭐⭐⭐ Very Common

---

## Problem Statement

Given the `root` of a binary tree, imagine yourself standing on the **right side** of it, return the values of the nodes you can see ordered from top to bottom.

```
Input: root = [1,2,3,null,5,null,4]
        1            <--- 1
       / \
      2   3          <--- 3
       \   \
        5   4        <--- 4

Output: [1,3,4]
```

```
Input: root = [1,2,3,4,null,null,null,5]
        1            <--- 1
       / \
      2   3          <--- 3
     /
    4                <--- 4
   /
  5                  <--- 5

Output: [1,3,4,5] (not [1,3]! The left side can be visible too)
```

[LeetCode 199 - Binary Tree Right Side View](https://leetcode.com/problems/binary-tree-right-side-view/)

---

## 🎯 Pattern Recognition

<details>
<summary><strong>How to Identify This Pattern</strong></summary>

**Look for these signals:**
- "Right side view" or "left side view"
- "Rightmost node at each level"
- "First/last visible from a direction"

**Key insight:**
For each level, we want the **rightmost** node (last node in level-order).

Two approaches:
1. **BFS:** Process level, keep only last node
2. **DFS:** Go right first, track depth, add first node at each new depth

</details>

---

## ✅ When to Use

- Finding rightmost/leftmost at each level
- "View from side" problems
- First/last node per depth

---

## ❌ When NOT to Use

| Situation | Why Not | Use Instead |
|-----------|---------|-------------|
| Need all nodes per level | Not just rightmost | Level Order |
| Need path to rightmost | Just values | Path tracking |
| Vertical order | Different dimension | Vertical Order |

---

## 🔗 Concept Map

<details>
<summary><strong>Prerequisites & Next Steps</strong></summary>

**Before this, you should know:**
- [Level Order Traversal](./01-Level-Order.md)
- [BFS Concept](./00-BFS-Concept.md)

**After mastering this:**
- Left Side View (mirror of this)
- [Vertical Order Traversal](../06-View-Problems/6.1-Vertical-Order.md)
- Bottom View of Binary Tree

**Note:**
Can also be solved with DFS (right-to-left preorder)!

</details>

---

## 📐 How It Works

### BFS Approach

```
        1            Level 0: [1] → rightmost = 1
       / \
      2   3          Level 1: [2, 3] → rightmost = 3
       \   \
        5   4        Level 2: [5, 4] → rightmost = 4

Result: [1, 3, 4]
```

### DFS Approach (Right-to-Left)

```
Visit right subtree first!
When we reach a new depth for the first time,
that node is the rightmost (because we went right first).

Order: 1 → 3 → 4 → 2 → 5

Depth 0: first visit → add 1
Depth 1: first visit → add 3
Depth 2: first visit → add 4
Depth 1: already seen (skip 2)
Depth 2: already seen (skip 5)

Result: [1, 3, 4]
```

---

## 💻 Code Implementation

### Solution 1: BFS (Most Intuitive)

**Python:**
```python
from typing import Optional, List
from collections import deque

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right


def right_side_view(root: Optional[TreeNode]) -> List[int]:
    """
    Right side view using BFS.
    
    Take the last node of each level.
    Time: O(n), Space: O(w)
    """
    if not root:
        return []
    
    result = []
    queue = deque([root])
    
    while queue:
        level_size = len(queue)
        
        for i in range(level_size):
            node = queue.popleft()
            
            # Last node in level is rightmost
            if i == level_size - 1:
                result.append(node.val)
            
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
    
    return result
```

**JavaScript:**
```javascript
// Note: Array.shift() is O(n), but acceptable for interviews
function rightSideView(root) {
    if (!root) return [];
    
    const result = [];
    const queue = [root];
    
    while (queue.length > 0) {
        const levelSize = queue.length;
        
        for (let i = 0; i < levelSize; i++) {
            const node = queue.shift();  // O(n) but acceptable
            
            // Last node in level
            if (i === levelSize - 1) {
                result.push(node.val);
            }
            
            if (node.left) queue.push(node.left);
            if (node.right) queue.push(node.right);
        }
    }
    
    return result;
}
```

### Solution 2: DFS (Right-First Traversal)

**Python:**
```python
def right_side_view_dfs(root: Optional[TreeNode]) -> List[int]:
    """
    Right side view using DFS.
    
    Visit right subtree first.
    First node at each new depth is the rightmost.
    Time: O(n), Space: O(h)
    """
    result = []
    
    def dfs(node, depth):
        if not node:
            return
        
        # If this is first time reaching this depth, it's rightmost
        if depth == len(result):
            result.append(node.val)
        
        # Go right first!
        dfs(node.right, depth + 1)
        dfs(node.left, depth + 1)
    
    dfs(root, 0)
    return result
```

**JavaScript:**
```javascript
function rightSideViewDFS(root) {
    const result = [];
    
    function dfs(node, depth) {
        if (!node) return;
        
        if (depth === result.length) {
            result.push(node.val);
        }
        
        dfs(node.right, depth + 1);  // Right first!
        dfs(node.left, depth + 1);
    }
    
    dfs(root, 0);
    return result;
}
```

### Left Side View (Mirror)

**Python:**
```python
def left_side_view(root: Optional[TreeNode]) -> List[int]:
    """
    Left side view - mirror of right side view.
    
    BFS: Take first node of each level.
    DFS: Go left first.
    """
    if not root:
        return []
    
    result = []
    queue = deque([root])
    
    while queue:
        level_size = len(queue)
        
        for i in range(level_size):
            node = queue.popleft()
            
            # First node in level is leftmost
            if i == 0:
                result.append(node.val)
            
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
    
    return result
```

---

## ⚡ Complexity Analysis

| Approach | Time | Space | Notes |
|----------|------|-------|-------|
| BFS |" O(n) "| O(w) | w = max width |
| DFS |" O(n) "| O(h) | h = height |

**When to prefer each:**
- BFS: More intuitive, better for wide trees
- DFS: Better for deep narrow trees, uses recursion

---

## 🔄 Variations

| Variation | Change | Notes |
|-----------|--------|-------|
| Left Side View | First per level or left-first DFS | Mirror |
| Bottom View | Project to column, take deepest | Different problem |
| Top View | Project to column, take shallowest | Different problem |

---

## ⚠️ Common Mistakes

### 1. Thinking Only Right Subtree Matters

```
# ❌ WRONG THINKING: Just traverse right subtree
        1
       / \
      2   3
     /
    4      ← 4 is visible from right! Not in right subtree.

# The LEFT subtree can have the rightmost node at a level!
# Must consider both subtrees.
```

### 2. DFS: Wrong Order

```python
# ❌ WRONG: Going left first
def dfs(node, depth):
    dfs(node.left, depth + 1)   # Left first = leftmost seen first
    dfs(node.right, depth + 1)

# ✅ CORRECT: Go right first for right side view
def dfs(node, depth):
    dfs(node.right, depth + 1)  # Right first!
    dfs(node.left, depth + 1)
```

### 3. BFS: Wrong Index Check

```python
# ❌ WRONG: Taking first instead of last
if i == 0:  # This is left side view!
    result.append(node.val)

# ✅ CORRECT: Take last for right side view
if i == level_size - 1:
    result.append(node.val)
```

---

## 📝 Practice Problems

### This Problem
- [ ] [Binary Tree Right Side View](https://leetcode.com/problems/binary-tree-right-side-view/) - LC 199

### Related Problems
- [ ] [Binary Tree Level Order Traversal](https://leetcode.com/problems/binary-tree-level-order-traversal/) - LC 102
- [ ] [Vertical Order Traversal](https://leetcode.com/problems/vertical-order-traversal-of-a-binary-tree/) - LC 987
- [ ] [Boundary of Binary Tree](https://leetcode.com/problems/boundary-of-binary-tree/) - LC 545 (Premium)

<details>
<summary><strong>🧠 Spaced Repetition Schedule</strong></summary>

**Day 1:** BFS approach
**Day 3:** DFS approach
**Day 7:** Left side view (mirror)
**Day 14:** Solve both approaches without notes

</details>

---

## 🎤 Interview Context

<details>
<summary><strong>How to Communicate in Interviews</strong></summary>

**Explaining BFS approach:**
> "I'll use BFS level order. For each level, the rightmost node is the last one processed, so I add it when the index equals level_size - 1."

**Explaining DFS approach:**
> "Alternatively, I can use DFS visiting the right subtree first. The first time I reach a new depth, that node is the rightmost because I went right first."

**Discussing trade-offs:**
> "BFS uses O(w) space where w is the max width. DFS uses O(h) space where h is height. For wide trees, DFS is better. For deep narrow trees, BFS is better."

**Common follow-up - Left Side:**
> "For left side view, I'd take the first node per level in BFS, or go left first in DFS."

</details>

**Company Focus:**

| Company | Frequency | Notes |
|---------|-----------|-------|
| Amazon | ⭐⭐⭐⭐⭐ | Very common |
| Meta | ⭐⭐⭐⭐⭐ | Classic question |
| Google | ⭐⭐⭐⭐ | May ask DFS approach |
| Microsoft | ⭐⭐⭐⭐ | Standard interview |
| Apple | ⭐⭐⭐⭐ | Common question |

---

## ⏱️ Time Estimates

| Activity | Time | Notes |
|----------|------|-------|
| BFS solution | 7-10 min | Most intuitive |
| DFS solution | 7-10 min | If asked |
| Both approaches | 15 min | Good to know both |

---

> **💡 Key Insight:** Right Side View = "last node per level" in BFS, or "first node at each new depth" in right-first DFS. The tricky part is realizing that left subtree nodes CAN be visible from the right if the right subtree doesn't extend that deep.

---

## 🔗 Related

- [Level Order Traversal](./01-Level-Order.md)
- [BFS Concept](./00-BFS-Concept.md)
- [Vertical Order Traversal](../06-View-Problems/6.1-Vertical-Order.md)
