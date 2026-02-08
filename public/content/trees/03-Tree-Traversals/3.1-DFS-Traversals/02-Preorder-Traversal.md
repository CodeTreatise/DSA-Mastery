# 02 - Preorder Traversal (LC 144)

> **Grokking Pattern:** #11 Tree DFS
>
> **Difficulty:** Easy | **Frequency:** ⭐⭐⭐⭐ Common Foundation

---

## Problem Statement

Given the `root` of a binary tree, return the **preorder traversal** of its nodes' values.

**Preorder:** Root → Left → Right

```
Input: root = [1,null,2,3]
        1
         \
          2
         /
        3

Output: [1,2,3]
```

[LeetCode 144 - Binary Tree Preorder Traversal](https://leetcode.com/problems/binary-tree-preorder-traversal/)

---

## 🎯 Pattern Recognition

<details>
<summary><strong>How to Identify This Pattern</strong></summary>

**Look for these signals:**
- "Preorder traversal" mentioned
- Need to process parent before children
- Copying/cloning tree structure
- Serialization problems

**Key insight:**
Preorder processes node **before** its children, making it ideal for:
- Creating a copy of the tree
- Serializing (can reconstruct tree from preorder + inorder)
- Prefix expression evaluation

</details>

---

## ✅ When to Use Preorder

- Copy/clone a tree
- Serialize tree structure
- Create prefix expression
- Process parent before children needed

---

## ❌ When NOT to Use

| Situation | Why Not | Use Instead |
|-----------|---------|-------------|
| Need sorted BST order | Doesn't give sorted | Inorder |
| Delete tree (need children first) | Wrong order | Postorder |
| Compute heights | Need children info first | Postorder |

---

## 🔗 Concept Map

<details>
<summary><strong>Prerequisites & Next Steps</strong></summary>

**Before this, you should know:**
- [DFS Concept](./00-DFS-Concept.md)
- Basic recursion

**After mastering this:**
- [Construct Tree from Preorder + Inorder](../08-Construction-Problems/8.1-Construct-Preorder-Inorder.md)
- [Serialize and Deserialize](../08-Construction-Problems/8.3-Serialize-Deserialize.md)

**Related traversals:**
- [Inorder](./01-Inorder-Traversal.md)
- [Postorder](./03-Postorder-Traversal.md)

</details>

---

## 📐 How It Works

### Preorder: Root → Left → Right

```
        1
       / \
      2   3
     / \
    4   5

Process order: 1 → 2 → 4 → 5 → 3

Step by step:
1. Visit 1 (root first!)
2. Go left to 2
3. Visit 2
4. Go left to 4
5. Visit 4
6. 4 has no children, backtrack to 2
7. Go right to 5
8. Visit 5
9. Backtrack to 1
10. Go right to 3
11. Visit 3
12. Done
```

### Why Preorder for Serialization

```
Tree:
        1
       / \
      2   3

Preorder: [1, 2, 3]
With nulls: [1, 2, null, null, 3, null, null]

We can rebuild because:
- First element is always root
- Then comes left subtree (recursively)
- Then comes right subtree (recursively)
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


def preorder_traversal(root: Optional[TreeNode]) -> List[int]:
    """
    Recursive preorder traversal.
    
    Pattern: Root → Left → Right
    Time: O(n), Space: O(h)
    """
    result = []
    
    def preorder(node):
        if not node:
            return
        
        result.append(node.val)  # Root first!
        preorder(node.left)      # Then left
        preorder(node.right)     # Then right
    
    preorder(root)
    return result
```

**JavaScript:**
```javascript
function preorderTraversal(root) {
    const result = [];
    
    function preorder(node) {
        if (!node) return;
        
        result.push(node.val);  // Root first
        preorder(node.left);
        preorder(node.right);
    }
    
    preorder(root);
    return result;
}
```

### Solution 2: Iterative with Stack

**Python:**
```python
def preorder_iterative(root: Optional[TreeNode]) -> List[int]:
    """
    Iterative preorder using stack.
    
    Key: Push right first, then left (so left pops first).
    Time: O(n), Space: O(h)
    """
    if not root:
        return []
    
    result = []
    stack = [root]
    
    while stack:
        node = stack.pop()
        result.append(node.val)
        
        # Push right first so left is processed first
        if node.right:
            stack.append(node.right)
        if node.left:
            stack.append(node.left)
    
    return result
```

**JavaScript:**
```javascript
function preorderIterative(root) {
    if (!root) return [];
    
    const result = [];
    const stack = [root];
    
    while (stack.length > 0) {
        const node = stack.pop();
        result.push(node.val);
        
        // Right first, so left pops first
        if (node.right) stack.push(node.right);
        if (node.left) stack.push(node.left);
    }
    
    return result;
}
```

### Solution 3: Morris Traversal

**Python:**
```python
def preorder_morris(root: Optional[TreeNode]) -> List[int]:
    """
    Morris preorder - O(1) space.
    
    Similar to inorder Morris, but process node
    when first visiting (before going left).
    
    Time: O(n), Space: O(1)
    """
    result = []
    current = root
    
    while current:
        if not current.left:
            # No left subtree, process and go right
            result.append(current.val)
            current = current.right
        else:
            # Find predecessor
            predecessor = current.left
            while predecessor.right and predecessor.right != current:
                predecessor = predecessor.right
            
            if not predecessor.right:
                # First visit: process current, create thread
                result.append(current.val)  # Process here for preorder!
                predecessor.right = current
                current = current.left
            else:
                # Second visit: remove thread
                predecessor.right = None
                current = current.right
    
    return result
```

---

## ⚡ Complexity Analysis

| Approach | Time | Space | Notes |
|----------|------|-------|-------|
| Recursive |" O(n) "| O(h) | h = tree height |
| Iterative |" O(n) "| O(h) | Stack size |
| Morris |" O(n) "| O(1) | Thread-based |

---

## 🔄 Variations

| Variation | Change | Example |
|-----------|--------|---------|
| N-ary Preorder | Multiple children | LC 589 |
| Reverse Preorder | Root → Right → Left | Mirror traversal |
| Flatten to List | Modify tree in-place | LC 114 |

---

## ⚠️ Common Mistakes

### 1. Iterative: Wrong Push Order

```python
# ❌ WRONG: Left pushed first = right processed first
if node.left:
    stack.append(node.left)
if node.right:
    stack.append(node.right)

# ✅ CORRECT: Right pushed first = left processed first
if node.right:
    stack.append(node.right)
if node.left:
    stack.append(node.left)
```

### 2. Confusing with Inorder

```python
# ❌ WRONG: Processing after going left = inorder
def preorder(node):
    preorder(node.left)
    result.append(node.val)  # This is inorder!
    preorder(node.right)

# ✅ CORRECT: Process before recursing
def preorder(node):
    result.append(node.val)  # Root first!
    preorder(node.left)
    preorder(node.right)
```

---

## 📝 Practice Problems

### This Problem
- [ ] [Binary Tree Preorder Traversal](https://leetcode.com/problems/binary-tree-preorder-traversal/) - LC 144

### Applications
- [ ] [Flatten Binary Tree to Linked List](https://leetcode.com/problems/flatten-binary-tree-to-linked-list/) - LC 114
- [ ] [Construct Binary Tree from Preorder and Inorder](https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/) - LC 105
- [ ] [N-ary Tree Preorder Traversal](https://leetcode.com/problems/n-ary-tree-preorder-traversal/) - LC 589

<details>
<summary><strong>🧠 Spaced Repetition Schedule</strong></summary>

**Day 1:** Implement recursive and iterative
**Day 3:** Explain push order in iterative
**Day 7:** Apply to flatten tree problem
**Day 14:** Compare with inorder/postorder

</details>

---

## 🎤 Interview Context

<details>
<summary><strong>How to Communicate in Interviews</strong></summary>

**Choosing preorder:**
> "I'll use preorder because I need to process each node before its children, which is perfect for [copying/serializing] the tree."

**Iterative explanation:**
> "For iterative, I use a stack. I push right child first, then left, so when I pop, left comes out first - maintaining the Root → Left → Right order."

</details>

**Company Focus:**

| Company | Frequency | Notes |
|---------|-----------|-------|
| Amazon | ⭐⭐⭐⭐ | Basic expected |
| Meta | ⭐⭐⭐⭐ | Serialization problems |
| Google | ⭐⭐⭐ | May combine with construction |

---

## ⏱️ Time Estimates

| Activity | Time | Notes |
|----------|------|-------|
| Recursive | 2-3 min | Should be instant |
| Iterative | 5-7 min | Stack order is key |

---

> **💡 Key Insight:** Preorder is "root first" - you see the parent before any descendants. This makes it perfect for tasks where you need to know the structure from the top down, like cloning or serializing a tree.

---

## 🔗 Related

- [DFS Concept](./00-DFS-Concept.md)
- [Inorder Traversal](./01-Inorder-Traversal.md)
- [Postorder Traversal](./03-Postorder-Traversal.md)
