# 03 - Postorder Traversal (LC 145)

> **Grokking Pattern:** #11 Tree DFS
>
> **Difficulty:** Easy | **Frequency:** ⭐⭐⭐⭐ Common Foundation

---

## Problem Statement

Given the `root` of a binary tree, return the **postorder traversal** of its nodes' values.

**Postorder:** Left → Right → Root

```
Input: root = [1,null,2,3]
        1
         \
          2
         /
        3

Output: [3,2,1]
```

[LeetCode 145 - Binary Tree Postorder Traversal](https://leetcode.com/problems/binary-tree-postorder-traversal/)

---

## 🎯 Pattern Recognition

<details>
<summary><strong>How to Identify This Pattern</strong></summary>

**Look for these signals:**
- Need to process children before parent
- Deleting or freeing tree nodes
- Computing aggregate from children (height, size, sum)
- "Bottom-up" computation

**Key insight:**
Postorder visits node **last** - you have all information from children before processing parent. Perfect for:
- Computing heights/depths
- Evaluating expression trees
- Deleting trees safely

</details>

---

## ✅ When to Use Postorder

- Delete/free tree nodes safely
- Compute height or depth
- Evaluate expression trees
- Calculate subtree aggregates

---

## ❌ When NOT to Use

| Situation | Why Not | Use Instead |
|-----------|---------|-------------|
| Need sorted BST output | Doesn't sort | Inorder |
| Clone tree structure | Wrong order | Preorder |
| Level-by-level | DFS not suitable | BFS |

---

## 🔗 Concept Map

<details>
<summary><strong>Prerequisites & Next Steps</strong></summary>

**Before this, you should know:**
- [DFS Concept](./00-DFS-Concept.md)
- [Preorder Traversal](./02-Preorder-Traversal.md)

**After mastering this:**
- [Maximum Depth](../04-Tree-Properties/4.1-Maximum-Depth.md) - Uses postorder
- [Diameter of Tree](../04-Tree-Properties/4.3-Diameter-of-Tree.md) - Uses postorder

**Related traversals:**
- [Inorder](./01-Inorder-Traversal.md)
- [Preorder](./02-Preorder-Traversal.md)

</details>

---

## 📐 How It Works

### Postorder: Left → Right → Root

```
        1
       / \
      2   3
     / \
    4   5

Process order: 4 → 5 → 2 → 3 → 1

Step by step:
1. Start at 1, go left to 2
2. At 2, go left to 4
3. At 4, no children, process 4
4. Back to 2, go right to 5
5. At 5, no children, process 5
6. Back to 2, both children done, process 2
7. Back to 1, go right to 3
8. At 3, no children, process 3
9. Back to 1, both children done, process 1
```

### Why Postorder for Deletion

```
To delete this tree safely:
        1
       / \
      2   3

Must delete: 2, 3 BEFORE 1
(Can't delete parent while children still reference it)

Postorder gives: [2, 3, 1] - perfect order!
```

### Why Postorder for Height

```
To compute height of node 1:
        1           height(1) = 1 + max(height(2), height(3))
       / \
      2   3         Must know heights of 2 and 3 first!

Postorder ensures we compute children before parent.
```

---

## 💻 Code Implementation

### Solution 1: Recursive

**Python:**
```python
from typing import Optional, List

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right


def postorder_traversal(root: Optional[TreeNode]) -> List[int]:
    """
    Recursive postorder traversal.
    
    Pattern: Left → Right → Root
    Time: O(n), Space: O(h)
    """
    result = []
    
    def postorder(node):
        if not node:
            return
        
        postorder(node.left)        # Left first
        postorder(node.right)       # Then right
        result.append(node.val)     # Root last!
    
    postorder(root)
    return result
```

**JavaScript:**
```javascript
function postorderTraversal(root) {
    const result = [];
    
    function postorder(node) {
        if (!node) return;
        
        postorder(node.left);
        postorder(node.right);
        result.push(node.val);  // Root last
    }
    
    postorder(root);
    return result;
}
```

### Solution 2: Iterative with Two Stacks

**Python:**
```python
def postorder_two_stacks(root: Optional[TreeNode]) -> List[int]:
    """
    Iterative postorder using two stacks.
    
    Idea: Reverse of (Root → Right → Left) gives (Left → Right → Root)
    
    Stack1: Traverse Root → Right → Left
    Stack2: Stores nodes in reverse order
    
    Time: O(n), Space: O(n)
    """
    if not root:
        return []
    
    result = []
    stack1 = [root]
    stack2 = []
    
    # Stack1 does modified preorder: Root → Right → Left
    while stack1:
        node = stack1.pop()
        stack2.append(node)
        
        # Push left first so right is processed first
        if node.left:
            stack1.append(node.left)
        if node.right:
            stack1.append(node.right)
    
    # Stack2 has nodes in reverse postorder
    while stack2:
        result.append(stack2.pop().val)
    
    return result
```

**JavaScript:**
```javascript
function postorderTwoStacks(root) {
    if (!root) return [];
    
    const result = [];
    const stack1 = [root];
    const stack2 = [];
    
    while (stack1.length > 0) {
        const node = stack1.pop();
        stack2.push(node);
        
        if (node.left) stack1.push(node.left);
        if (node.right) stack1.push(node.right);
    }
    
    while (stack2.length > 0) {
        result.push(stack2.pop().val);
    }
    
    return result;
}
```

### Solution 3: Iterative with One Stack

**Python:**
```python
def postorder_one_stack(root: Optional[TreeNode]) -> List[int]:
    """
    Iterative postorder with single stack.
    
    Key insight: Track the last visited node.
    Only process current node if:
    1. It has no right child, OR
    2. Right child was just visited (last_visited)
    
    Time: O(n), Space: O(h)
    """
    if not root:
        return []
    
    result = []
    stack = []
    current = root
    last_visited = None
    
    while stack or current:
        # Go all the way left
        while current:
            stack.append(current)
            current = current.left
        
        # Peek at the top
        peek_node = stack[-1]
        
        # If right exists and hasn't been visited, go right
        if peek_node.right and peek_node.right != last_visited:
            current = peek_node.right
        else:
            # Process node
            node = stack.pop()
            result.append(node.val)
            last_visited = node
    
    return result
```

**JavaScript:**
```javascript
function postorderOneStack(root) {
    if (!root) return [];
    
    const result = [];
    const stack = [];
    let current = root;
    let lastVisited = null;
    
    while (stack.length > 0 || current) {
        while (current) {
            stack.push(current);
            current = current.left;
        }
        
        const peekNode = stack[stack.length - 1];
        
        if (peekNode.right && peekNode.right !== lastVisited) {
            current = peekNode.right;
        } else {
            const node = stack.pop();
            result.push(node.val);
            lastVisited = node;
        }
    }
    
    return result;
}
```

---

## ⚡ Complexity Analysis

| Approach | Time | Space | Notes |
|----------|------|-------|-------|
| Recursive |" O(n) "| O(h) | h = tree height |
| Two Stacks |" O(n) "| O(n) | Extra stack |
| One Stack |" O(n) "| O(h) | More complex logic |

---

## 🔄 Variations

| Variation | Change | Example |
|-----------|--------|---------|
| N-ary Postorder | Multiple children | LC 590 |
| Reverse Postorder | Root → Right → Left | Used in two-stack solution |
| Delete Tree | Actually free nodes | Memory cleanup |

---

## ⚠️ Common Mistakes

### 1. One Stack: Forgetting to Track Last Visited

```python
# ❌ WRONG: Will revisit right subtree infinitely
if peek_node.right:
    current = peek_node.right

# ✅ CORRECT: Check if right was already visited
if peek_node.right and peek_node.right != last_visited:
    current = peek_node.right
```

### 2. Two Stacks: Wrong Push Order

```python
# ❌ WRONG: Pushing right first
if node.right:
    stack1.append(node.right)
if node.left:
    stack1.append(node.left)

# ✅ CORRECT: Push left first (so right pops first → gives Root→Right→Left)
if node.left:
    stack1.append(node.left)
if node.right:
    stack1.append(node.right)
```

### 3. Confusing Position of result.append()

```python
# ❌ WRONG: Processing before children = preorder
def postorder(node):
    result.append(node.val)
    postorder(node.left)
    postorder(node.right)

# ✅ CORRECT: Process after children
def postorder(node):
    postorder(node.left)
    postorder(node.right)
    result.append(node.val)  # Last!
```

---

## 📝 Practice Problems

### This Problem
- [ ] [Binary Tree Postorder Traversal](https://leetcode.com/problems/binary-tree-postorder-traversal/) - LC 145

### Applications (Postorder Pattern)
- [ ] [Maximum Depth of Binary Tree](https://leetcode.com/problems/maximum-depth-of-binary-tree/) - LC 104
- [ ] [Balanced Binary Tree](https://leetcode.com/problems/balanced-binary-tree/) - LC 110
- [ ] [Binary Tree Maximum Path Sum](https://leetcode.com/problems/binary-tree-maximum-path-sum/) - LC 124

<details>
<summary><strong>🧠 Spaced Repetition Schedule</strong></summary>

**Day 1:** Recursive + two-stack approach
**Day 3:** One-stack approach with last_visited
**Day 7:** Apply to height calculation
**Day 14:** Solve path sum problems

</details>

---

## 🎤 Interview Context

<details>
<summary><strong>How to Communicate in Interviews</strong></summary>

**Choosing postorder:**
> "I'll use postorder because I need to know information about both children before processing the parent. This is the 'bottom-up' approach."

**Explaining two-stack:**
> "The two-stack approach reverses a modified preorder (Root→Right→Left) to get postorder (Left→Right→Root)."

**Explaining one-stack:**
> "With one stack, I track the last visited node to know if I've already processed the right subtree."

</details>

**Company Focus:**

| Company | Frequency | Notes |
|---------|-----------|-------|
| Amazon | ⭐⭐⭐⭐ | Height/depth problems |
| Meta | ⭐⭐⭐ | Path sum problems |
| Google | ⭐⭐⭐ | Expression tree evaluation |

---

## ⏱️ Time Estimates

| Activity | Time | Notes |
|----------|------|-------|
| Recursive | 2-3 min | Should be instant |
| Two-Stack | 5-7 min | Understand the reversal |
| One-Stack | 8-10 min | Track last_visited |

---

> **💡 Key Insight:** Postorder is "children first" - you have all information from descendants before processing the current node. This makes it the natural choice for any "bottom-up" computation like heights, sizes, or aggregates.

---

## 🔗 Related

- [DFS Concept](./00-DFS-Concept.md)
- [Preorder Traversal](./02-Preorder-Traversal.md)
- [Inorder Traversal](./01-Inorder-Traversal.md)
- [Maximum Depth](../04-Tree-Properties/4.1-Maximum-Depth.md)
