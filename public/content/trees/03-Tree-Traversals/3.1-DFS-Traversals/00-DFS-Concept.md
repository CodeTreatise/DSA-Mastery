# Tree DFS - Pattern Overview

> **Grokking Pattern:** #11 Tree DFS
>
> **Priority:** ⭐⭐⭐⭐⭐ HIGH - ~15% of all interview problems
>
> **Key Insight:** Most tree problems are DFS problems - master the recursive template

---

## Definition

**Depth-First Search (DFS)** on trees explores as deep as possible along each branch before backtracking. It's the natural way to traverse trees using recursion.

**Three DFS Traversal Orders:**
- **Inorder:** Left → Root → Right (gives sorted order for BST)
- **Preorder:** Root → Left → Right (useful for copying trees)
- **Postorder:** Left → Right → Root (useful for deleting trees)

---

## 🎯 Pattern Recognition

<details>
<summary><strong>How to Identify Tree DFS Problems</strong></summary>

**Look for these signals:**
- "Binary tree" in the problem statement
- Need to visit all nodes
- Need information from subtrees
- Path-based problems (root to leaf)
- Need to process children before/after parent

**Keywords:**
- "traverse", "visit all nodes"
- "path from root to leaf"
- "height", "depth", "diameter"
- "check if tree has property X"
- "find value in tree"

**DFS is the default for tree problems!**

</details>

---

## ✅ When to Use Tree DFS

- Most tree problems (default choice)
- Path problems (root to leaf, any path)
- Tree property checks (balanced, symmetric)
- Need info from both subtrees
- Building results from bottom-up

---

## ❌ When NOT to Use

| Situation | Why Not | Use Instead |
|-----------|---------|-------------|
| Level-by-level processing | DFS goes deep first | BFS |
| Shortest path in tree | BFS is natural | BFS |
| Need nodes at same depth together | DFS mixes levels | BFS |
| Extremely deep trees (stack overflow) | Recursion limit | Iterative BFS |

---

## 🔗 Concept Map

<details>
<summary><strong>Prerequisites & Next Steps</strong></summary>

**Before this, you should know:**
- [Recursion Basics](../../02-Recursion-Backtracking/01-Recursion/1.1-Recursion-Basics.md)
- [Binary Tree Basics](../02-Binary-Tree-Basics/2.1-Binary-Tree-Definition.md)

**After mastering this:**
- [Inorder Traversal](./01-Inorder-Traversal.md)
- [Tree Properties](../04-Tree-Properties/4.1-Maximum-Depth.md)
- [Path Problems](../05-Path-Problems/5.1-Path-Sum.md)

**Combines with:**
- Backtracking for path collection
- Dynamic Programming for optimization

</details>

---

## 📐 How It Works

### The Universal DFS Template

```
def dfs(node):
    # Base case: empty tree
    if not node:
        return base_value
    
    # Recursive case: process subtrees
    left_result = dfs(node.left)
    right_result = dfs(node.right)
    
    # Combine results with current node
    return combine(node.val, left_result, right_result)
```

### Three Traversal Orders Visualized

```
        1
       / \
      2   3
     / \
    4   5

Inorder (L, Root, R):   4 → 2 → 5 → 1 → 3
Preorder (Root, L, R):  1 → 2 → 4 → 5 → 3
Postorder (L, R, Root): 4 → 5 → 2 → 3 → 1
```

### When Each Order is Used

| Order | Process Node | Use Case |
|-------|--------------|----------|
| **Preorder** | Before children | Copy tree, serialize |
| **Inorder** | Between children | BST sorted order |
| **Postorder** | After children | Delete tree, compute heights |

### DFS Decision Framework

```
┌─────────────────────────────────────────────────────────────┐
│                    TREE DFS DECISIONS                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Q1: What info do I need from subtrees?                     │
│      ├── Height/depth → return int                          │
│      ├── Found/not found → return bool                      │
│      ├── Subtree reference → return node                    │
│      └── Multiple values → return tuple                     │
│                                                             │
│  Q2: When do I process current node?                        │
│      ├── Before recursion → Preorder                        │
│      ├── Between left/right → Inorder                       │
│      └── After recursion → Postorder                        │
│                                                             │
│  Q3: Do I need info across branches?                        │
│      ├── Yes → Use global variable or class member          │
│      └── No → Return value is enough                        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 💻 Code Implementation

### Template 1: Simple Return Value

**Python:**
```python
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right


def tree_dfs_template(root: TreeNode) -> int:
    """
    Template for problems that return a single value.
    Example: max depth, sum of nodes, etc.
    """
    def dfs(node):
        # Base case
        if not node:
            return 0  # or appropriate base value
        
        # Recurse on children
        left = dfs(node.left)
        right = dfs(node.right)
        
        # Combine and return
        return 1 + max(left, right)  # Example: height
    
    return dfs(root)
```

**JavaScript:**
```javascript
class TreeNode {
    constructor(val = 0, left = null, right = null) {
        this.val = val;
        this.left = left;
        this.right = right;
    }
}

function treeDfsTemplate(root) {
    function dfs(node) {
        // Base case
        if (!node) return 0;
        
        // Recurse on children
        const left = dfs(node.left);
        const right = dfs(node.right);
        
        // Combine and return
        return 1 + Math.max(left, right);
    }
    
    return dfs(root);
}
```

### Template 2: Global Variable Pattern

**Python:**
```python
def tree_dfs_global(root: TreeNode) -> int:
    """
    Template when you need to track a value across branches.
    Example: diameter, max path sum.
    """
    result = 0  # Global tracker
    
    def dfs(node):
        nonlocal result
        if not node:
            return 0
        
        left = dfs(node.left)
        right = dfs(node.right)
        
        # Update global with info from both branches
        result = max(result, left + right)  # Example: diameter
        
        # Return info for parent
        return 1 + max(left, right)
    
    dfs(root)
    return result
```

**JavaScript:**
```javascript
function treeDfsGlobal(root) {
    let result = 0;
    
    function dfs(node) {
        if (!node) return 0;
        
        const left = dfs(node.left);
        const right = dfs(node.right);
        
        // Update global
        result = Math.max(result, left + right);
        
        // Return for parent
        return 1 + Math.max(left, right);
    }
    
    dfs(root);
    return result;
}
```

### Template 3: Path Collection (Backtracking)

**Python:**
```python
def collect_paths(root: TreeNode) -> list[list[int]]:
    """
    Template for collecting all root-to-leaf paths.
    Uses backtracking pattern.
    """
    result = []
    
    def dfs(node, path):
        if not node:
            return
        
        # Add current node to path
        path.append(node.val)
        
        # If leaf, save the path
        if not node.left and not node.right:
            result.append(path[:])  # Copy!
        else:
            # Continue to children
            dfs(node.left, path)
            dfs(node.right, path)
        
        # Backtrack
        path.pop()
    
    dfs(root, [])
    return result
```

---

## ⚡ Complexity Analysis

| Aspect | Complexity | Notes |
|--------|------------|-------|
| Time |" O(n) "| Visit each node once |
| Space (balanced) |" O(log n) "| Recursion stack depth |
| Space (skewed) |" O(n) "| Worst case: linked list tree |

**Why O(n) time:**
- Each node is visited exactly once
- Work at each node is O(1)

**Space depends on tree shape:**
```
Balanced:          Skewed:
    1                1
   / \                \
  2   3                2
 / \ / \                \
4  5 6  7                3
                          \
Height: log(n)             4
Space: O(log n)       Height: n
                      Space: O(n)
```

---

## 🔄 DFS Variations

| Variation | Description | Example |
|-----------|-------------|---------|
| Top-Down | Pass info from parent to children | Path sum |
| Bottom-Up | Return info from children to parent | Height |
| Global Variable | Track across branches | Diameter |
| Two-Node DFS | Compare two trees/subtrees | Same tree |

---

## ⚠️ Common Mistakes

### 1. Forgetting Base Case

```python
# ❌ WRONG: No base case
def dfs(node):
    left = dfs(node.left)  # Crashes on None!

# ✅ CORRECT: Handle None
def dfs(node):
    if not node:
        return 0
    left = dfs(node.left)
```

### 2. Wrong Return in Base Case

```python
# ❌ WRONG: Wrong base for height
def height(node):
    if not node:
        return 1  # Should be 0 or -1!

# ✅ CORRECT: Return 0 for empty
def height(node):
    if not node:
        return 0
```

### 3. Not Handling Single Child

```python
# ❌ WRONG: Leaf check misses single child
if not node.left and not node.right:
    # This is a leaf
    
# Some problems need different handling for:
# - True leaf (no children)
# - Node with one child
# - Node with two children
```

### 4. Modifying Path Without Backtracking

```python
# ❌ WRONG: No backtrack
def dfs(node, path):
    path.append(node.val)
    dfs(node.left, path)
    dfs(node.right, path)
    # Path keeps growing!

# ✅ CORRECT: Backtrack
def dfs(node, path):
    path.append(node.val)
    dfs(node.left, path)
    dfs(node.right, path)
    path.pop()  # Remove after processing
```

---

## 📝 Practice Problems (Progressive)

### Easy (Learn the pattern)
- [ ] [Maximum Depth of Binary Tree](https://leetcode.com/problems/maximum-depth-of-binary-tree/) - LC 104
- [ ] [Invert Binary Tree](https://leetcode.com/problems/invert-binary-tree/) - LC 226
- [ ] [Same Tree](https://leetcode.com/problems/same-tree/) - LC 100

### Medium (Apply variations)
- [ ] [Path Sum II](https://leetcode.com/problems/path-sum-ii/) - LC 113
- [ ] [Diameter of Binary Tree](https://leetcode.com/problems/diameter-of-binary-tree/) - LC 543
- [ ] [Lowest Common Ancestor](https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/) - LC 236

### Hard (Master edge cases)
- [ ] [Binary Tree Maximum Path Sum](https://leetcode.com/problems/binary-tree-maximum-path-sum/) - LC 124
- [ ] [Serialize and Deserialize Binary Tree](https://leetcode.com/problems/serialize-and-deserialize-binary-tree/) - LC 297

<details>
<summary><strong>🧠 Spaced Repetition Schedule</strong></summary>

**Day 1:** Implement all three traversals recursively
**Day 3:** Implement maximum depth without looking
**Day 7:** Solve diameter problem (global variable pattern)
**Day 14:** Solve path collection problem
**Day 21:** Explain DFS patterns to someone else

</details>

---

## 🎤 Interview Context

<details>
<summary><strong>How to Communicate DFS in Interviews</strong></summary>

**Opening statement:**
> "For tree problems, I typically start with DFS since most tree problems naturally fit the recursive structure."

**Choosing traversal order:**
> "I'll use [preorder/inorder/postorder] because I need to process the node [before/between/after] its children."

**Explaining the approach:**
> "I'll use a recursive DFS where I first handle the base case of a null node, then recursively process both subtrees, and finally combine the results."

**When asked about iterative:**
> "I can also implement this iteratively using a stack, which avoids recursion stack limits for very deep trees."

</details>

**Company Focus:**

| Company | Frequency | Focus |
|---------|-----------|-------|
| Amazon | ⭐⭐⭐⭐⭐ | All tree problems |
| Google | ⭐⭐⭐⭐⭐ | Complex tree DFS |
| Meta | ⭐⭐⭐⭐⭐ | Path problems |
| Microsoft | ⭐⭐⭐⭐ | Property checks |

---

## ⏱️ Time Estimates

| Activity | Time | Notes |
|----------|------|-------|
| Learn pattern | 30 min | Understand templates |
| Solve easy problem | 10-15 min | With pattern recognition |
| Solve medium problem | 20-25 min | May need variations |
| Master DFS | 15-20 problems | Until automatic |

---

> **💡 Key Insight:** Tree DFS is about trusting the recursion. Define what you need from subtrees, handle the base case, and combine results. The call stack handles the traversal for you.

---

## 🔗 Related

- [Inorder Traversal](./01-Inorder-Traversal.md)
- [Preorder Traversal](./02-Preorder-Traversal.md)
- [Postorder Traversal](./03-Postorder-Traversal.md)
- [Tree BFS](../3.2-BFS-Traversals/00-BFS-Concept.md)
