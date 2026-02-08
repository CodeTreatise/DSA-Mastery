# 01 - Inorder Traversal (LC 94)

> **Grokking Pattern:** #11 Tree DFS
>
> **Difficulty:** Easy | **Frequency:** ⭐⭐⭐⭐⭐ Must-Know

---

## Problem Statement

Given the `root` of a binary tree, return the **inorder traversal** of its nodes' values.

**Inorder:** Left → Root → Right

```
Input: root = [1,null,2,3]
        1
         \
          2
         /
        3

Output: [1,3,2]

Input: root = []
Output: []

Input: root = [1]
Output: [1]
```

[LeetCode 94 - Binary Tree Inorder Traversal](https://leetcode.com/problems/binary-tree-inorder-traversal/)

---

## 🎯 Pattern Recognition

<details>
<summary><strong>How to Identify This Pattern</strong></summary>

**Look for these signals:**
- "Inorder traversal" explicitly mentioned
- Need BST elements in sorted order
- Process left subtree before root

**Key insight:**
Inorder on a BST gives elements in **sorted ascending order**.

**Three approaches:**
1. Recursive (simplest)
2. Iterative with stack
3. Morris Traversal (O(1) space)

</details>

---

## ✅ When to Use Inorder

- Get BST elements in sorted order
- Validate BST (values should be ascending)
- Find kth smallest in BST
- Convert BST to sorted list

---

## ❌ When NOT to Use

| Situation | Why Not | Use Instead |
|-----------|---------|-------------|
| Need to copy tree structure | Loses structure info | Preorder |
| Processing parent before children | Wrong order | Preorder |
| Need bottom-up computation | Wrong order | Postorder |

---

## 🔗 Concept Map

<details>
<summary><strong>Prerequisites & Next Steps</strong></summary>

**Before this, you should know:**
- [DFS Concept](./00-DFS-Concept.md)
- Basic recursion

**After mastering this:**
- [Validate BST](https://leetcode.com/problems/validate-binary-search-tree/) - LC 98
- [Kth Smallest in BST](https://leetcode.com/problems/kth-smallest-element-in-a-bst/) - LC 230

**Related traversals:**
- [Preorder](./02-Preorder-Traversal.md)
- [Postorder](./03-Postorder-Traversal.md)

</details>

---

## 📐 How It Works

### Inorder: Left → Root → Right

```
        1
       / \
      2   3
     / \
    4   5

Process order: 4 → 2 → 5 → 1 → 3

Step by step:
1. Go left to 2
2. Go left to 4
3. 4 has no left, visit 4
4. 4 has no right, go back to 2
5. Visit 2
6. Go right to 5
7. 5 has no left, visit 5
8. 5 has no right, go back to 1
9. Visit 1
10. Go right to 3
11. 3 has no left, visit 3
12. Done
```

### Why Inorder Gives Sorted BST

```
BST:
        5
       / \
      3   7
     / \   \
    2   4   8

Inorder: 2 → 3 → 4 → 5 → 7 → 8  (sorted!)

In a BST:
- All left descendants < current
- All right descendants > current
- So: left subtree (smaller) → current → right subtree (larger)
```

---

## 💻 Code Implementation

### Solution 1: Recursive (Simplest)

**Python:**
```python
from typing import Optional, List

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right


def inorder_traversal(root: Optional[TreeNode]) -> List[int]:
    """
    Recursive inorder traversal.
    
    Pattern: Left → Root → Right
    Time: O(n), Space: O(h) for recursion stack
    """
    result = []
    
    def inorder(node):
        if not node:
            return
        
        inorder(node.left)      # Left
        result.append(node.val)  # Root
        inorder(node.right)     # Right
    
    inorder(root)
    return result


# One-liner version
def inorder_oneliner(root: Optional[TreeNode]) -> List[int]:
    return (inorder_oneliner(root.left) + [root.val] + 
            inorder_oneliner(root.right)) if root else []
```

**JavaScript:**
```javascript
function inorderTraversal(root) {
    const result = [];
    
    function inorder(node) {
        if (!node) return;
        
        inorder(node.left);
        result.push(node.val);
        inorder(node.right);
    }
    
    inorder(root);
    return result;
}
```

### Solution 2: Iterative with Stack

**Python:**
```python
def inorder_iterative(root: Optional[TreeNode]) -> List[int]:
    """
    Iterative inorder using explicit stack.
    
    Key: Go as far left as possible, then process and go right.
    Time: O(n), Space: O(h)
    """
    result = []
    stack = []
    current = root
    
    while current or stack:
        # Go left as far as possible
        while current:
            stack.append(current)
            current = current.left
        
        # Process current node
        current = stack.pop()
        result.append(current.val)
        
        # Move to right subtree
        current = current.right
    
    return result
```

**JavaScript:**
```javascript
function inorderIterative(root) {
    const result = [];
    const stack = [];
    let current = root;
    
    while (current || stack.length > 0) {
        // Go left as far as possible
        while (current) {
            stack.push(current);
            current = current.left;
        }
        
        // Process current
        current = stack.pop();
        result.push(current.val);
        
        // Move right
        current = current.right;
    }
    
    return result;
}
```

### Solution 3: Morris Traversal (O(1) Space)

**Python:**
```python
def inorder_morris(root: Optional[TreeNode]) -> List[int]:
    """
    Morris traversal - O(1) space by using threaded tree.
    
    Idea: Create temporary links from rightmost of left subtree
    back to current node.
    
    Time: O(n), Space: O(1) - no recursion or stack!
    """
    result = []
    current = root
    
    while current:
        if not current.left:
            # No left subtree, process current and go right
            result.append(current.val)
            current = current.right
        else:
            # Find inorder predecessor (rightmost in left subtree)
            predecessor = current.left
            while predecessor.right and predecessor.right != current:
                predecessor = predecessor.right
            
            if not predecessor.right:
                # Create thread: predecessor → current
                predecessor.right = current
                current = current.left
            else:
                # Thread exists, remove it and process current
                predecessor.right = None
                result.append(current.val)
                current = current.right
    
    return result
```

---

## ⚡ Complexity Analysis

| Approach | Time | Space | Notes |
|----------|------|-------|-------|
| Recursive |" O(n) "| O(h) |" h = height, O(log n) balanced, O(n) skewed "|
| Iterative |" O(n) "| O(h) | Same as recursive |
| Morris |" O(n) "| O(1) | No extra space, modifies tree temporarily |

**Why Morris is O(n) time:**
- Each edge traversed at most 3 times
- Finding predecessor: O(n) total across all nodes

---

## 🔄 Variations

| Variation | Change | Example |
|-----------|--------|---------|
| Reverse Inorder | Right → Root → Left | Descending BST order |
| Inorder Iterator | Lazy evaluation | BST Iterator (LC 173) |
| Threaded Tree | Permanent Morris links | Efficient traversal |

---

## ⚠️ Common Mistakes

### 1. Wrong Order in Recursive Call

```python
# ❌ WRONG: Preorder instead of inorder
def inorder(node):
    result.append(node.val)  # Process first = preorder!
    inorder(node.left)
    inorder(node.right)

# ✅ CORRECT: Process between left and right
def inorder(node):
    inorder(node.left)
    result.append(node.val)  # Process middle = inorder
    inorder(node.right)
```

### 2. Iterative: Wrong Loop Condition

```python
# ❌ WRONG: Only checks stack
while stack:  # Misses initial traversal!

# ✅ CORRECT: Check both current and stack
while current or stack:
```

### 3. Morris: Not Restoring Tree

```python
# ❌ WRONG: Leave threads, corrupts tree
predecessor.right = current
# Never remove thread!

# ✅ CORRECT: Remove thread after processing
predecessor.right = None
```

---

## 📝 Practice Problems (Progressive)

### This Problem
- [ ] [Binary Tree Inorder Traversal](https://leetcode.com/problems/binary-tree-inorder-traversal/) - LC 94

### Applications
- [ ] [Validate Binary Search Tree](https://leetcode.com/problems/validate-binary-search-tree/) - LC 98
- [ ] [Kth Smallest Element in a BST](https://leetcode.com/problems/kth-smallest-element-in-a-bst/) - LC 230
- [ ] [Binary Search Tree Iterator](https://leetcode.com/problems/binary-search-tree-iterator/) - LC 173

<details>
<summary><strong>🧠 Spaced Repetition Schedule</strong></summary>

**Day 1:** Implement recursive inorder
**Day 3:** Implement iterative inorder without looking
**Day 7:** Apply to Validate BST problem
**Day 14:** Implement Morris traversal
**Day 21:** Explain all three approaches

</details>

---

## 🎤 Interview Context

<details>
<summary><strong>How to Communicate in Interviews</strong></summary>

**Mentioning the traversal:**
> "For inorder, I'll process left subtree, then the current node, then right subtree. This gives sorted order for a BST."

**Choosing approach:**
> "I'll start with recursive since it's clearest. If space is a concern, I can use iterative with a stack, or Morris for O(1) space."

**Follow-up questions:**
- "Can you do it iteratively?" → Use stack approach
- "Can you do it with O(1) space?" → Morris traversal
- "What's the time complexity?" → O(n) for all approaches

</details>

**Company Focus:**

| Company | Frequency | Notes |
|---------|-----------|-------|
| Amazon | ⭐⭐⭐⭐⭐ | Basic traversal expected |
| Google | ⭐⭐⭐⭐ | May ask for iterative |
| Meta | ⭐⭐⭐⭐ | Foundation for BST problems |

---

## ⏱️ Time Estimates

| Activity | Time | Notes |
|----------|------|-------|
| Recursive solution | 3-5 min | Should be automatic |
| Iterative solution | 8-10 min | Stack management |
| Morris solution | 15-20 min | Thread logic tricky |

---

> **💡 Key Insight:** Inorder traversal visits nodes in BST sorted order because it processes all smaller values (left subtree) before current, and all larger values (right subtree) after. This makes it the go-to traversal for BST-related problems.

---

## 🔗 Related

- [DFS Concept](./00-DFS-Concept.md)
- [Preorder Traversal](./02-Preorder-Traversal.md)
- [Postorder Traversal](./03-Postorder-Traversal.md)
- [Validate BST](https://leetcode.com/problems/validate-binary-search-tree/)
