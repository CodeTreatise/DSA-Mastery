# 02 - Zigzag Level Order Traversal (LC 103)

> **Grokking Pattern:** #10 Tree BFS (Direction Alternation)
>
> **Difficulty:** Medium | **Frequency:** ⭐⭐⭐⭐ Common

---

## Problem Statement

Given the `root` of a binary tree, return the **zigzag level order traversal** of its nodes' values (i.e., from left to right, then right to left for the next level and alternate between).

```
Input: root = [3,9,20,null,null,15,7]
        3
       / \
      9   20
         /  \
        15   7

Output: [[3],[20,9],[15,7]]
        Level 0: Left to Right  → [3]
        Level 1: Right to Left  → [20, 9]
        Level 2: Left to Right  → [15, 7]
```

[LeetCode 103 - Binary Tree Zigzag Level Order Traversal](https://leetcode.com/problems/binary-tree-zigzag-level-order-traversal/)

---

## 🎯 Pattern Recognition

<details>
<summary><strong>How to Identify This Pattern</strong></summary>

**Look for these signals:**
- "Zigzag" or "spiral" traversal
- "Alternate direction" per level
- "Left-to-right then right-to-left"

**Key insight:**
This is standard level order with direction tracking. Two approaches:
1. Use a deque and add to front/back based on direction
2. Collect normally and reverse alternate levels

</details>

---

## ✅ When to Use

- Alternating direction traversal
- Spiral-like tree output
- When order within level matters with alternation

---

## ❌ When NOT to Use

| Situation | Why Not | Use Instead |
|-----------|---------|-------------|
| Standard level order | No zigzag needed | Level Order |
| Only care about level groups | Direction doesn't matter | Standard BFS |

---

## 🔗 Concept Map

<details>
<summary><strong>Prerequisites & Next Steps</strong></summary>

**Before this, you should know:**
- [Level Order Traversal](./01-Level-Order.md) - This is an extension
- [BFS Concept](./00-BFS-Concept.md)

**After mastering this:**
- [Spiral Matrix Traversal](../../related/spiral-matrix.md) - Similar alternation
- More complex tree traversals

</details>

---

## 📐 How It Works

### Approach 1: Collect + Reverse

```
Standard level order: [[3], [9, 20], [15, 7]]

Reverse odd levels:
Level 0 (even): [3]      → [3]
Level 1 (odd):  [9, 20]  → [20, 9]  (reversed)
Level 2 (even): [15, 7]  → [15, 7]

Result: [[3], [20, 9], [15, 7]]
```

### Approach 2: Deque with Direction

```
Use deque for current level:
- left_to_right: append to right
- right_to_left: append to left

Level 0 (L→R): deque → [3]
Level 1 (R→L): process 9, add left; process 20, add left → [20, 9]
Level 2 (L→R): process 15, add right; process 7, add right → [15, 7]
```

---

## 💻 Code Implementation

### Solution 1: Collect + Reverse (Simpler)

**Python:**
```python
from typing import Optional, List
from collections import deque

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right


def zigzag_level_order(root: Optional[TreeNode]) -> List[List[int]]:
    """
    Zigzag traversal using standard BFS + reverse odd levels.
    
    Time: O(n), Space: O(w)
    """
    if not root:
        return []
    
    result = []
    queue = deque([root])
    left_to_right = True
    
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
        
        # Reverse if right-to-left
        if not left_to_right:
            current_level.reverse()
        
        result.append(current_level)
        left_to_right = not left_to_right  # Toggle direction
    
    return result
```

**JavaScript:**
```javascript
// Note: Array.shift() is O(n), but acceptable for interviews
function zigzagLevelOrder(root) {
    if (!root) return [];
    
    const result = [];
    const queue = [root];
    let leftToRight = true;
    
    while (queue.length > 0) {
        const levelSize = queue.length;
        const currentLevel = [];
        
        for (let i = 0; i < levelSize; i++) {
            const node = queue.shift();  // O(n) but acceptable for interviews
            currentLevel.push(node.val);
            
            if (node.left) queue.push(node.left);
            if (node.right) queue.push(node.right);
        }
        
        if (!leftToRight) {
            currentLevel.reverse();
        }
        
        result.push(currentLevel);
        leftToRight = !leftToRight;
    }
    
    return result;
}
```

### Solution 2: Deque for Building Level

**Python:**
```python
def zigzag_level_order_deque(root: Optional[TreeNode]) -> List[List[int]]:
    """
    Use deque to build each level in correct order.
    
    Adds to front or back based on direction.
    Time: O(n), Space: O(w)
    """
    if not root:
        return []
    
    result = []
    queue = deque([root])
    left_to_right = True
    
    while queue:
        level_size = len(queue)
        current_level = deque()  # Use deque for O(1) front insertion
        
        for _ in range(level_size):
            node = queue.popleft()
            
            # Add to level in correct order
            if left_to_right:
                current_level.append(node.val)      # Add to right
            else:
                current_level.appendleft(node.val)  # Add to left
            
            # Always add children left, then right
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
        
        result.append(list(current_level))
        left_to_right = not left_to_right
    
    return result
```

**JavaScript:**
```javascript
function zigzagLevelOrderDeque(root) {
    if (!root) return [];
    
    const result = [];
    const queue = [root];
    let leftToRight = true;
    
    while (queue.length > 0) {
        const levelSize = queue.length;
        const currentLevel = [];
        
        for (let i = 0; i < levelSize; i++) {
            const node = queue.shift();
            
            if (leftToRight) {
                currentLevel.push(node.val);
            } else {
                currentLevel.unshift(node.val);  // O(n) but works
            }
            
            if (node.left) queue.push(node.left);
            if (node.right) queue.push(node.right);
        }
        
        result.push(currentLevel);
        leftToRight = !leftToRight;
    }
    
    return result;
}
```

### Solution 3: DFS with Direction

**Python:**
```python
def zigzag_level_order_dfs(root: Optional[TreeNode]) -> List[List[int]]:
    """
    DFS approach with depth tracking.
    """
    if not root:
        return []
    
    result = []
    
    def dfs(node, depth):
        if not node:
            return
        
        if depth == len(result):
            result.append(deque())
        
        # Add based on depth parity
        if depth % 2 == 0:  # Left to right
            result[depth].append(node.val)
        else:  # Right to left
            result[depth].appendleft(node.val)
        
        dfs(node.left, depth + 1)
        dfs(node.right, depth + 1)
    
    dfs(root, 0)
    return [list(level) for level in result]
```

---

## ⚡ Complexity Analysis

| Approach | Time | Space | Notes |
|----------|------|-------|-------|
| Collect + Reverse |" O(n) "| O(w) |" Reverse is O(level_size) "|
| Deque Building |" O(n) "| O(w) |" O(1) insertions "|
| DFS |" O(n) "| O(h) | Uses recursion stack |

**Note:** Reversing each level adds overhead but is still O(n) total.

---

## 🔄 Variations

| Variation | Change | Notes |
|-----------|--------|-------|
| Spiral Matrix | 2D array traversal | Similar alternation |
| Start Right-to-Left | Swap starting direction | Minor change |
| Reverse Zigzag | Opposite pattern | Just flip boolean |

---

## ⚠️ Common Mistakes

### 1. Wrong Initial Direction

```python
# ❌ WRONG: Starting with right-to-left
left_to_right = False  # First level should be L→R!

# ✅ CORRECT: Start left-to-right
left_to_right = True
```

### 2. Forgetting to Toggle Direction

```python
# ❌ WRONG: Missing toggle
while queue:
    # ... process level ...
    # Forgot to toggle!

# ✅ CORRECT: Toggle after each level
while queue:
    # ... process level ...
    left_to_right = not left_to_right
```

### 3. Modifying Original Level After Adding

```python
# ❌ WRONG: Reversing after appending to result
result.append(current_level)
if not left_to_right:
    current_level.reverse()  # Too late! Already in result

# ✅ CORRECT: Reverse before appending
if not left_to_right:
    current_level.reverse()
result.append(current_level)
```

---

## 📝 Practice Problems

### This Problem
- [ ] [Binary Tree Zigzag Level Order Traversal](https://leetcode.com/problems/binary-tree-zigzag-level-order-traversal/) - LC 103

### Related Problems
- [ ] [Binary Tree Level Order Traversal](https://leetcode.com/problems/binary-tree-level-order-traversal/) - LC 102
- [ ] [Spiral Matrix](https://leetcode.com/problems/spiral-matrix/) - LC 54 (similar alternation)
- [ ] [N-ary Tree Level Order](https://leetcode.com/problems/n-ary-tree-level-order-traversal/) - LC 429

<details>
<summary><strong>🧠 Spaced Repetition Schedule</strong></summary>

**Day 1:** Simple approach (collect + reverse)
**Day 3:** Deque approach
**Day 7:** DFS alternative
**Day 14:** Solve without looking

</details>

---

## 🎤 Interview Context

<details>
<summary><strong>How to Communicate in Interviews</strong></summary>

**Explaining approach:**
> "This is level order with alternating direction. I'll use standard BFS and track the direction with a boolean. When right-to-left, I'll reverse the collected level before adding to result."

**Alternative mention:**
> "Another approach is to use a deque for each level and add to front or back based on direction. This avoids the reverse operation."

**Discussing trade-offs:**
> "The reverse approach is simpler to code. The deque approach is slightly more efficient but adds complexity. Both are O(n) overall."

</details>

**Company Focus:**

| Company | Frequency | Notes |
|---------|-----------|-------|
| Amazon | ⭐⭐⭐⭐ | Common follow-up to level order |
| Meta | ⭐⭐⭐⭐ | Tests BFS understanding |
| Google | ⭐⭐⭐ | May ask for optimization |
| Microsoft | ⭐⭐⭐⭐ | Standard question |

---

## ⏱️ Time Estimates

| Activity | Time | Notes |
|----------|------|-------|
| Simple approach | 7-10 min | Level order + toggle + reverse |
| Deque approach | 10-12 min | If asked |
| Explain both | 3-5 min | Compare trade-offs |

---

> **💡 Key Insight:** Zigzag is just level order with a twist. Track direction with a boolean, toggle after each level, and either reverse odd levels or use a deque for front insertion. The simplest approach is often best in interviews.

---

## 🔗 Related

- [Level Order Traversal](./01-Level-Order.md)
- [BFS Concept](./00-BFS-Concept.md)
- [Right Side View](./04-Right-Side-View.md)
