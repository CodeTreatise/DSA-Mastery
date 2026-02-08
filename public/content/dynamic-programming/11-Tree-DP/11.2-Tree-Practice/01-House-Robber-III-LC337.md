# House Robber III (LC 337)

> **The classic take-or-skip Tree DP problem.** You can rob houses in a binary tree, but not two directly-linked houses. This perfectly demonstrates the two-state Tree DP pattern.

---

## 📋 Problem Statement

**LeetCode:** [337. House Robber III](https://leetcode.com/problems/house-robber-iii/)

The thief has found himself a new place for his thievery again. There is only one entrance to this area, called root.

Besides the root, each house has one and only one parent house. After a tour, the smart thief realized that all houses in this place form a binary tree.

It will automatically contact the police if two directly-linked houses were broken into on the same night.

Given the root of the binary tree, return the maximum amount of money the thief can rob without alerting the police.

**Examples:**
```
Input: root = [3,2,3,null,3,null,1]
        3
       / \
      2   3
       \   \
        3   1
Output: 7
Explanation: 3 + 3 + 1 = 7 (rob root, and the two grandchildren)

Input: root = [3,4,5,1,3,null,1]
        3
       / \
      4   5
     / \   \
    1   3   1
Output: 9
Explanation: 4 + 5 = 9 (rob the two children of root)
```

**Constraints:**
- The number of nodes in the tree is in range [1, 10⁴]
- 0 ≤ Node.val ≤ 10⁴

---

## 🎯 Pattern Recognition

**Why Tree DP with Two States?**
- Each node has a choice: rob or skip
- If we rob a node, we CAN'T rob its children
- If we skip a node, we CAN rob its children (but don't have to)
- Optimal solution for a node depends on optimal solutions for children

**State Definition:**
```
For each node, compute:
  rob[node]  = max money if we ROB this node
  skip[node] = max money if we SKIP this node
```

---

## 📐 Approach Analysis

### Recurrence Relations

```
rob[node] = node.val + skip[left] + skip[right]
  → If we rob this node, children MUST be skipped

skip[node] = max(rob[left], skip[left]) + max(rob[right], skip[right])
  → If we skip this node, each child can be robbed OR skipped (take best)
```

### Why not just "skip[node] = rob[left] + rob[right]"?

**Counterexample:**
```
    1
   / \
  4   5
 / \
1   1

If we skip root, should we rob 4 and 5?
- rob[4] = 4 + 0 + 0 = 4 (rob 4, skip its children)
- skip[4] = 1 + 1 = 2 (skip 4, rob children)
- Best for left subtree: max(4, 2) = 4

So skip[1] = max(4, 2) + max(5, 0) = 4 + 5 = 9
NOT skip[1] = rob[4] + rob[5] = 4 + 5 = 9 (same here, but principle differs)

Actually in this case it's the same, but consider:
    1
   /
  2
 / \
10 10

skip[1] = max(rob[2], skip[2])
rob[2] = 2, skip[2] = 10 + 10 = 20
So skip[1] = 20, NOT rob[2] = 2
```

---

## 💻 Solutions

### Solution 1: Clean Two-State DFS

```python
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def rob(root: TreeNode) -> int:
    """
    Two-state Tree DP: (rob_this, skip_this)
    Time: O(n), Space: O(h)
    """
    def dfs(node):
        if not node:
            return (0, 0)  # (rob, skip)
        
        left_rob, left_skip = dfs(node.left)
        right_rob, right_skip = dfs(node.right)
        
        # Rob this node → children must be skipped
        rob_this = node.val + left_skip + right_skip
        
        # Skip this node → take best from each child
        skip_this = max(left_rob, left_skip) + max(right_rob, right_skip)
        
        return (rob_this, skip_this)
    
    return max(dfs(root))
```

```javascript
function rob(root) {
    function dfs(node) {
        if (!node) return [0, 0]; // [rob, skip]
        
        const [leftRob, leftSkip] = dfs(node.left);
        const [rightRob, rightSkip] = dfs(node.right);
        
        // Rob this node
        const robThis = node.val + leftSkip + rightSkip;
        
        // Skip this node
        const skipThis = Math.max(leftRob, leftSkip) + Math.max(rightRob, rightSkip);
        
        return [robThis, skipThis];
    }
    
    return Math.max(...dfs(root));
}
```

### Solution 2: With Memoization (Naive Approach)

```python
def rob_memo(root: TreeNode) -> int:
    """
    Alternative: memoize based on (node, can_rob).
    Less elegant but shows the idea.
    """
    memo = {}
    
    def dfs(node, can_rob):
        if not node:
            return 0
        
        if (node, can_rob) in memo:
            return memo[(node, can_rob)]
        
        # Option 1: Skip this node (always possible)
        skip = dfs(node.left, True) + dfs(node.right, True)
        
        # Option 2: Rob this node (only if allowed)
        rob = 0
        if can_rob:
            rob = node.val + dfs(node.left, False) + dfs(node.right, False)
        
        memo[(node, can_rob)] = max(skip, rob)
        return memo[(node, can_rob)]
    
    return dfs(root, True)
```

### Solution 3: Explicit DP Maps (Alternative)

```python
def rob_explicit(root: TreeNode) -> int:
    """
    Store results in explicit dictionaries.
    """
    rob_map = {}
    skip_map = {}
    
    def dfs(node):
        if not node:
            return
        
        dfs(node.left)
        dfs(node.right)
        
        left_rob = rob_map.get(node.left, 0)
        left_skip = skip_map.get(node.left, 0)
        right_rob = rob_map.get(node.right, 0)
        right_skip = skip_map.get(node.right, 0)
        
        rob_map[node] = node.val + left_skip + right_skip
        skip_map[node] = max(left_rob, left_skip) + max(right_rob, right_skip)
    
    dfs(root)
    return max(rob_map.get(root, 0), skip_map.get(root, 0))
```

---

## ⚡ Complexity Analysis

| Approach | Time | Space |
|----------|------|-------|
| Two-State DFS | O(n) | O(h) |
| Memoization | O(n) | O(n) |
| Explicit Maps | O(n) | O(n) |

**Why O(h) for Two-State DFS?**
- Recursion depth = height of tree
- No extra storage (just return tuples)
- h = O(log n) for balanced, O(n) for skewed

---

## 📊 Trace Through Example

```
        3
       / \
      4   5
     / \   \
    1   3   1

Post-order: 1, 3, 4, 1, 5, 3 (leaves first)

Node 1 (left of 4): (1, 0)
Node 3 (right of 4): (3, 0)
Node 4:
  rob = 4 + skip[1] + skip[3] = 4 + 0 + 0 = 4
  skip = max(1,0) + max(3,0) = 1 + 3 = 4
  → (4, 4)

Node 1 (right of 5): (1, 0)
Node 5:
  rob = 5 + 0 + 0 = 5
  skip = max(1,0) = 1
  → (5, 1)

Node 3 (root):
  rob = 3 + skip[4] + skip[5] = 3 + 4 + 1 = 8
  skip = max(4,4) + max(5,1) = 4 + 5 = 9
  → (8, 9)

Answer: max(8, 9) = 9 ✓
```

---

## ⚠️ Common Mistakes

### 1. Wrong Skip Transition

**❌ Wrong:**
```python
# If we skip, we MUST rob children
skip_this = left_rob + right_rob
```

**✅ Correct:**
```python
# If we skip, we CAN rob children (take best option)
skip_this = max(left_rob, left_skip) + max(right_rob, right_skip)
```

### 2. Forgetting Null Check

**❌ Wrong:**
```python
def dfs(node):
    left_rob, left_skip = dfs(node.left)  # Crashes if node.left is None!
```

**✅ Correct:**
```python
def dfs(node):
    if not node:
        return (0, 0)
    left_rob, left_skip = dfs(node.left)
```

### 3. Not Returning the Max

**❌ Wrong:**
```python
return dfs(root)[0]  # Only returns rob value
```

**✅ Correct:**
```python
return max(dfs(root))  # Returns max of (rob, skip)
```

---

## 🔄 Related Problems

### House Robber I (LC 198) - Linear Version

```python
def rob_linear(nums: list[int]) -> int:
    """Linear houses: can't rob adjacent."""
    n = len(nums)
    if n == 1:
        return nums[0]
    
    prev2, prev1 = 0, nums[0]
    for i in range(1, n):
        curr = max(prev1, prev2 + nums[i])
        prev2, prev1 = prev1, curr
    
    return prev1
```

### House Robber II (LC 213) - Circular Version

```python
def rob_circular(nums: list[int]) -> int:
    """Circular: first and last are adjacent."""
    if len(nums) == 1:
        return nums[0]
    
    def rob_range(start, end):
        prev2, prev1 = 0, 0
        for i in range(start, end):
            curr = max(prev1, prev2 + nums[i])
            prev2, prev1 = prev1, curr
        return prev1
    
    # Rob 0 to n-2 OR 1 to n-1
    return max(rob_range(0, len(nums) - 1), rob_range(1, len(nums)))
```

### Binary Tree Cameras (LC 968) - Three States

```python
def min_camera_cover(root: TreeNode) -> int:
    """
    3 states: covered, has_camera, not_covered
    """
    # Even more complex Tree DP!
    pass
```

---

## 📝 Practice Problems

| Problem | Difficulty | States |
|---------|------------|--------|
| [198. House Robber](https://leetcode.com/problems/house-robber/) | Medium | 1D version |
| [213. House Robber II](https://leetcode.com/problems/house-robber-ii/) | Medium | Circular |
| [337. House Robber III](https://leetcode.com/problems/house-robber-iii/) | Medium | This problem |
| [968. Binary Tree Cameras](https://leetcode.com/problems/binary-tree-cameras/) | Hard | 3 states |
| [1377. Frog Position After T Seconds](https://leetcode.com/problems/frog-position-after-t-seconds/) | Hard | Tree DP with time |

---

## 🎤 Interview Tips

**Time to solve:** 20-25 minutes

**Communication template:**
> "This is a Tree DP problem where I need to track two states for each node: the maximum money if I rob this node versus if I skip it.

> If I rob a node, I must skip its children (constraint). If I skip a node, I can choose the best option for each child independently.

> I'll use post-order DFS, returning a tuple (rob, skip) for each node. The answer is the maximum of the root's tuple."

**State transition explanation:**
> "rob[node] = node.val + skip[left] + skip[right] because children can't be robbed.
> skip[node] = max(rob[left], skip[left]) + max(rob[right], skip[right]) because each child's decision is independent."

**Company frequency:**
| Company | Frequency |
|---------|-----------|
| Google | ⭐⭐⭐⭐ |
| Amazon | ⭐⭐⭐⭐ |
| Meta | ⭐⭐⭐ |
| Microsoft | ⭐⭐⭐ |

---

## 💡 Key Insights

1. **Two states per node** naturally captures the take-or-skip decision
2. **Post-order traversal** ensures children are processed before parent
3. **Skip doesn't mean children must be robbed** - it means children CAN be robbed
4. **Return tuple** is cleaner than global variables or hash maps
5. **O(h) space** because we only need the call stack

---

> **💡 Key Insight:** The two-state pattern (rob, skip) elegantly handles the constraint. When you skip a node, you're NOT forcing children to be robbed—you're just freeing them to make their own optimal choice.

> **🔗 Related:** [Tree DP Patterns](../11.1-Tree-DP-Patterns.md) | [House Robber I](../../02-Fibonacci-Pattern/4.4-Fibonacci-Practice/02-House-Robber-LC198.md) | [Max Path Sum](./02-Max-Path-Sum-LC124.md)
