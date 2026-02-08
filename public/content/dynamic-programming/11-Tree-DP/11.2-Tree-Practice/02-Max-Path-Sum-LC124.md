# Binary Tree Maximum Path Sum (LC 124)

> **The hardest Tree DP problem you'll face.** This problem requires understanding the difference between paths that EXTEND to a parent versus paths that are COMPLETE at a node. Master this, and you've mastered Tree DP.

---

## 📋 Problem Statement

**LeetCode:** [124. Binary Tree Maximum Path Sum](https://leetcode.com/problems/binary-tree-maximum-path-sum/)

A path in a binary tree is a sequence of nodes where each pair of adjacent nodes in the sequence has an edge connecting them. A node can only appear in the sequence at most once.

The path sum is the sum of the node's values in the path.

Given the root of a binary tree, return the maximum path sum of any non-empty path.

**Examples:**
```
Input: root = [1,2,3]
     1
    / \
   2   3
Output: 6
Explanation: The optimal path is 2 → 1 → 3 with sum = 2 + 1 + 3 = 6

Input: root = [-10,9,20,null,null,15,7]
      -10
      /  \
     9   20
        /  \
       15   7
Output: 42
Explanation: The optimal path is 15 → 20 → 7 with sum = 15 + 20 + 7 = 42
```

**Constraints:**
- The number of nodes in the tree is in range [1, 3 × 10⁴]
- -1000 ≤ Node.val ≤ 1000

---

## 🎯 Pattern Recognition

**Why is this hard?**
- Path can start and end ANYWHERE
- Path doesn't have to include root
- We need to track TWO things at each node:
  1. Best "complete" path (for global answer)
  2. Best "extending" path (for parent to use)

**Key Insight:**
```
EXTENDING path: goes UP to parent (picks AT MOST one child)
  → This is what we RETURN

COMPLETE path: ends at this subtree (can use BOTH children)  
  → This is what we UPDATE globally
```

---

## 📐 Approach Analysis

### Two Types of Paths

```
        A
       / \
      B   C

EXTENDING (return to parent):
  - Just A: A
  - A with left: A → B (one path down)
  - A with right: A → C (one path down)
  → Return: A + max(0, best_from_B, best_from_C)

COMPLETE (update global max):
  - A alone
  - A with one child
  - A with both children: B ← A → C
  → Update: A + max(0, left_gain) + max(0, right_gain)
```

### Why max(0, child_gain)?

Negative paths should be IGNORED, not included!
```
      -5
     /
    10

If we return -5 + 10 = 5 for root, parent uses 5.
But we should also consider just 10 (ignore -5 entirely).

Actually for EXTENDING: root can use 10 but path continues to root's parent.
The max(0, ...) handles: "don't go down a negative path."
```

---

## 💻 Solutions

### Solution 1: Clean DFS with Global Update

```python
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def max_path_sum(root: TreeNode) -> int:
    """
    Tree DP: track extending path (return) and complete path (global).
    Time: O(n), Space: O(h)
    """
    max_sum = [float('-inf')]  # Use list for mutability in nested function
    
    def dfs(node):
        """Return max sum of path EXTENDING upward from this node."""
        if not node:
            return 0
        
        # Get max extending gain from children (ignore negative)
        left_gain = max(0, dfs(node.left))
        right_gain = max(0, dfs(node.right))
        
        # COMPLETE path through this node (update global)
        complete_path = node.val + left_gain + right_gain
        max_sum[0] = max(max_sum[0], complete_path)
        
        # EXTENDING path to parent (pick at most one side)
        return node.val + max(left_gain, right_gain)
    
    dfs(root)
    return max_sum[0]
```

```javascript
function maxPathSum(root) {
    let maxSum = -Infinity;
    
    function dfs(node) {
        if (!node) return 0;
        
        // Max gain from each side (ignore negative)
        const leftGain = Math.max(0, dfs(node.left));
        const rightGain = Math.max(0, dfs(node.right));
        
        // Complete path through this node
        const completePath = node.val + leftGain + rightGain;
        maxSum = Math.max(maxSum, completePath);
        
        // Extending path to parent
        return node.val + Math.max(leftGain, rightGain);
    }
    
    dfs(root);
    return maxSum;
}
```

### Solution 2: Returning Tuple (Alternative)

```python
def max_path_sum_tuple(root: TreeNode) -> int:
    """
    Return tuple (max_extending, max_complete) at each node.
    Avoids global variable but more complex.
    """
    def dfs(node):
        if not node:
            return (0, float('-inf'))  # (extending, complete)
        
        left_ext, left_comp = dfs(node.left)
        right_ext, right_comp = dfs(node.right)
        
        # Extending path (pick better side, or no side if negative)
        extending = node.val + max(0, left_ext, right_ext)
        
        # Complete path options:
        # 1. Just this node
        # 2. Extend with one child
        # 3. Extend with both children
        # 4. Complete path entirely in left subtree
        # 5. Complete path entirely in right subtree
        complete = max(
            node.val,
            node.val + left_ext,
            node.val + right_ext,
            node.val + left_ext + right_ext,
            left_comp,
            right_comp
        )
        
        return (extending, complete)
    
    _, answer = dfs(root)
    return answer
```

### Solution 3: Handling All Negative Values

```python
def max_path_sum_all_negative(root: TreeNode) -> int:
    """
    Explicitly handle trees with all negative values.
    """
    max_sum = [float('-inf')]
    
    def dfs(node):
        if not node:
            return 0
        
        left = dfs(node.left)
        right = dfs(node.right)
        
        # For extending: use child only if positive
        left_gain = max(0, left)
        right_gain = max(0, right)
        
        # Complete path through this node
        # Even if negative, this node could be the answer
        max_sum[0] = max(max_sum[0], node.val + left_gain + right_gain)
        
        # Return extending (could be just node.val if children negative)
        return node.val + max(left_gain, right_gain)
    
    dfs(root)
    return max_sum[0]
```

---

## ⚡ Complexity Analysis

| Metric | Value |
|--------|-------|
| Time | O(n) |
| Space | O(h) |

**Why O(n) time?**
- Visit each node exactly once
- O(1) work per node

**Why O(h) space?**
- Recursion depth = height of tree
- No additional data structures

---

## 📊 Trace Through Example

```
      -10
      /  \
     9   20
        /  \
       15   7

Post-order traversal:

Node 9: 
  left_gain = 0, right_gain = 0
  complete = 9 + 0 + 0 = 9 → max_sum = 9
  extending = 9 + max(0, 0) = 9
  return 9

Node 15:
  left_gain = 0, right_gain = 0
  complete = 15 → max_sum = 15
  extending = 15
  return 15

Node 7:
  left_gain = 0, right_gain = 0
  complete = 7 → max_sum = 15 (no change)
  extending = 7
  return 7

Node 20:
  left_gain = max(0, 15) = 15
  right_gain = max(0, 7) = 7
  complete = 20 + 15 + 7 = 42 → max_sum = 42 ✓
  extending = 20 + max(15, 7) = 35
  return 35

Node -10:
  left_gain = max(0, 9) = 9
  right_gain = max(0, 35) = 35
  complete = -10 + 9 + 35 = 34 → max_sum = 42 (no change)
  extending = -10 + 35 = 25
  return 25

Answer: 42 ✓
```

---

## ⚠️ Common Mistakes

### 1. Returning Complete Instead of Extending

**❌ Wrong:**
```python
# Returning the complete path (with both children)
return node.val + left_gain + right_gain  # Can't extend this!
```

**✅ Correct:**
```python
# Extending path picks AT MOST one child
return node.val + max(left_gain, right_gain)
```

### 2. Initializing max_sum to 0

**❌ Wrong:**
```python
max_sum = [0]  # Fails for all-negative trees
```

**✅ Correct:**
```python
max_sum = [float('-inf')]  # Handle all-negative trees
```

### 3. Not Ignoring Negative Gains

**❌ Wrong:**
```python
left_gain = dfs(node.left)  # Could be negative!
right_gain = dfs(node.right)
```

**✅ Correct:**
```python
left_gain = max(0, dfs(node.left))  # Ignore negative paths
right_gain = max(0, dfs(node.right))
```

### 4. Confusing "Complete" and "Extending"

```
COMPLETE: left ← node → right (both children, stays in subtree)
  → Used to UPDATE global maximum
  
EXTENDING: node → one_child (or just node)
  → RETURNED to parent for further extension
```

---

## 🔄 Related Problems

### Tree Diameter (LC 543)

```python
def diameter(root: TreeNode) -> int:
    """Similar structure: track depth, update diameter."""
    max_diameter = [0]
    
    def depth(node):
        if not node:
            return 0
        
        left = depth(node.left)
        right = depth(node.right)
        
        # Diameter through this node
        max_diameter[0] = max(max_diameter[0], left + right)
        
        # Return depth for parent
        return 1 + max(left, right)
    
    depth(root)
    return max_diameter[0]
```

### Longest Univalue Path (LC 687)

```python
def longest_univalue_path(root: TreeNode) -> int:
    """Same pattern but only count matching values."""
    max_length = [0]
    
    def dfs(node, parent_val):
        if not node:
            return 0
        
        left = dfs(node.left, node.val)
        right = dfs(node.right, node.val)
        
        # Complete path through node
        max_length[0] = max(max_length[0], left + right)
        
        # Extending to parent (only if values match)
        if node.val == parent_val:
            return 1 + max(left, right)
        return 0
    
    dfs(root, None)
    return max_length[0]
```

---

## 📝 Practice Problems

| Problem | Difficulty | Similarity |
|---------|------------|------------|
| [543. Binary Tree Diameter](https://leetcode.com/problems/diameter-of-binary-tree/) | Easy | Same pattern (depth) |
| [687. Longest Univalue Path](https://leetcode.com/problems/longest-univalue-path/) | Medium | Same pattern (constraint) |
| [124. Binary Tree Maximum Path Sum](https://leetcode.com/problems/binary-tree-maximum-path-sum/) | Hard | This problem |
| [1372. Longest ZigZag Path](https://leetcode.com/problems/longest-zigzag-path-in-a-binary-tree/) | Medium | Direction-aware |
| [2246. Longest Path With Different Adjacent Characters](https://leetcode.com/problems/longest-path-with-different-adjacent-characters/) | Hard | N-ary tree variant |

---

## 🎤 Interview Tips

**Time to solve:** 25-30 minutes

**Communication template:**
> "This problem requires tracking two things at each node: the best path that can EXTEND to the parent, and the best COMPLETE path that ends within this subtree.

> For extending, I can use at most one child (the path continues upward). For complete, I can use both children (the path stays in my subtree).

> I'll return the extending value and update a global maximum for the complete value. I use max(0, child) to ignore negative paths."

**Key insight to emphasize:**
> "The difference between extending and complete is crucial. Extending goes UP to parent—can only pick one child. Complete stays in subtree—can use both children."

**Edge cases to mention:**
- All negative values → answer is the least negative
- Single node → answer is that node's value
- Skewed tree → still works, recursion depth = n

**Company frequency:**
| Company | Frequency |
|---------|-----------|
| Google | ⭐⭐⭐⭐⭐ |
| Meta | ⭐⭐⭐⭐⭐ |
| Amazon | ⭐⭐⭐⭐ |
| Microsoft | ⭐⭐⭐⭐ |

---

## 💡 Key Insights

1. **Two concepts**: extending (goes up, one child) vs complete (stays, both children)
2. **max(0, gain)**: never include negative paths
3. **Global update**: complete paths don't return, they update max
4. **Return**: only extending paths are returned
5. **Initialize -∞**: handles all-negative trees

---

> **💡 Key Insight:** The magic is separating "what I return to my parent" (extending, one-sided) from "what updates the global answer" (complete, two-sided). Every Tree DP with paths follows this pattern.

> **🔗 Related:** [Tree DP Patterns](../11.1-Tree-DP-Patterns.md) | [Tree Diameter](https://leetcode.com/problems/diameter-of-binary-tree/) | [House Robber III](./01-House-Robber-III-LC337.md)
