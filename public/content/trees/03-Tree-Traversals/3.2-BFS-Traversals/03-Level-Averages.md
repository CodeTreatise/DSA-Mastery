# 03 - Average of Levels in Binary Tree (LC 637)

> **Grokking Pattern:** #10 Tree BFS (Level Aggregation)
>
> **Difficulty:** Easy | **Frequency:** ⭐⭐⭐ Common

---

## Problem Statement

Given the `root` of a non-empty binary tree, return the **average value of the nodes on each level** in the form of an array.

```
Input: root = [3,9,20,null,null,15,7]
        3
       / \
      9   20
         /  \
        15   7

Output: [3.00000, 14.50000, 11.00000]
Explanation:
- Level 0: 3/1 = 3
- Level 1: (9+20)/2 = 14.5
- Level 2: (15+7)/2 = 11
```

[LeetCode 637 - Average of Levels in Binary Tree](https://leetcode.com/problems/average-of-levels-in-binary-tree/)

---

## 🎯 Pattern Recognition

<details>
<summary><strong>How to Identify This Pattern</strong></summary>

**Look for these signals:**
- "Average per level"
- "Sum per level" / "Max per level"
- Any aggregate computation on each level

**Key insight:**
Standard BFS level order with aggregation (sum, count) instead of collecting values.

</details>

---

## ✅ When to Use

- Computing aggregates per level (avg, sum, max, min)
- Statistics on each tree depth
- Level-based metrics

---

## ❌ When NOT to Use

| Situation | Why Not | Use Instead |
|-----------|---------|-------------|
| Overall average | Don't need levels | Simple traversal |
| Path-based computation | Not level-based | DFS |
| Need actual nodes | Just computing aggregate | Level Order |

---

## 🔗 Concept Map

<details>
<summary><strong>Prerequisites & Next Steps</strong></summary>

**Before this, you should know:**
- [Level Order Traversal](./01-Level-Order.md)
- [BFS Concept](./00-BFS-Concept.md)

**After mastering this:**
- Maximum/Minimum per level
- Level with maximum sum
- Level-based tree statistics

</details>

---

## 📐 How It Works

### Level Sum and Count

```
        3           Level 0: sum=3, count=1, avg=3.0
       / \
      9   20        Level 1: sum=29, count=2, avg=14.5
         /  \
        15   7      Level 2: sum=22, count=2, avg=11.0

Instead of collecting [9, 20], just track:
- sum = 9 + 20 = 29
- count = 2
- average = 29 / 2 = 14.5
```

---

## 💻 Code Implementation

### Solution 1: BFS with Level Sum

**Python:**
```python
from typing import Optional, List
from collections import deque

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right


def average_of_levels(root: Optional[TreeNode]) -> List[float]:
    """
    Calculate average of each level using BFS.
    
    Time: O(n), Space: O(w)
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

**JavaScript:**
```javascript
// Note: Array.shift() is O(n), but acceptable for interviews
function averageOfLevels(root) {
    if (!root) return [];
    
    const result = [];
    const queue = [root];
    
    while (queue.length > 0) {
        const levelSize = queue.length;
        let levelSum = 0;
        
        for (let i = 0; i < levelSize; i++) {
            const node = queue.shift();  // O(n) but acceptable
            levelSum += node.val;
            
            if (node.left) queue.push(node.left);
            if (node.right) queue.push(node.right);
        }
        
        result.push(levelSum / levelSize);
    }
    
    return result;
}
```

### Solution 2: DFS with Depth Tracking

**Python:**
```python
def average_of_levels_dfs(root: Optional[TreeNode]) -> List[float]:
    """
    DFS approach - collect sums and counts per level.
    
    Time: O(n), Space: O(h)
    """
    if not root:
        return []
    
    level_data = []  # [(sum, count), ...]
    
    def dfs(node, depth):
        if not node:
            return
        
        if depth == len(level_data):
            level_data.append([0, 0])  # [sum, count]
        
        level_data[depth][0] += node.val
        level_data[depth][1] += 1
        
        dfs(node.left, depth + 1)
        dfs(node.right, depth + 1)
    
    dfs(root, 0)
    
    return [total / count for total, count in level_data]
```

**JavaScript:**
```javascript
function averageOfLevelsDFS(root) {
    if (!root) return [];
    
    const levelData = [];  // [[sum, count], ...]
    
    function dfs(node, depth) {
        if (!node) return;
        
        if (depth === levelData.length) {
            levelData.push([0, 0]);
        }
        
        levelData[depth][0] += node.val;
        levelData[depth][1] += 1;
        
        dfs(node.left, depth + 1);
        dfs(node.right, depth + 1);
    }
    
    dfs(root, 0);
    
    return levelData.map(([sum, count]) => sum / count);
}
```

### Generalized: Max/Min Per Level

**Python:**
```python
def max_of_levels(root: Optional[TreeNode]) -> List[int]:
    """
    Maximum value at each level.
    """
    if not root:
        return []
    
    result = []
    queue = deque([root])
    
    while queue:
        level_size = len(queue)
        level_max = float('-inf')
        
        for _ in range(level_size):
            node = queue.popleft()
            level_max = max(level_max, node.val)
            
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
        
        result.append(level_max)
    
    return result


def largest_values_each_row(root: Optional[TreeNode]) -> List[int]:
    """LC 515 - Find Largest Value in Each Tree Row"""
    return max_of_levels(root)
```

---

## ⚡ Complexity Analysis

| Approach | Time | Space | Notes |
|----------|------|-------|-------|
| BFS |" O(n) "| O(w) | w = max width |
| DFS |" O(n) "| O(h) | h = height |

---

## 🔄 Variations

| Variation | Change | LeetCode |
|-----------|--------|----------|
| Largest Value Each Row | Max instead of avg | LC 515 |
| Sum at Each Level | No division | - |
| Max Level Sum | Level with highest sum | LC 1161 |
| Find Bottom Left | First node at deepest level | LC 513 |

---

## ⚠️ Common Mistakes

### 1. Integer Division

```python
# ❌ WRONG in some languages: Integer division
result.append(level_sum // level_size)  # Truncates!

# ✅ CORRECT: Float division
result.append(level_sum / level_size)
```

### 2. Integer Overflow (for very large values)

```python
# ❌ POTENTIAL ISSUE: Sum might overflow (in some languages)
level_sum += node.val  # Could overflow with 32-bit ints

# ✅ SAFER: Use appropriate data types
# Python handles big integers automatically
# In Java/C++: use long for sum
```

### 3. Empty Level Handling

```python
# This shouldn't happen in valid trees, but good to be aware
# An empty level would cause division by zero
# BFS naturally handles this - empty queue ends the loop
```

---

## 📝 Practice Problems

### This Problem
- [ ] [Average of Levels in Binary Tree](https://leetcode.com/problems/average-of-levels-in-binary-tree/) - LC 637

### Related Problems
- [ ] [Find Largest Value in Each Tree Row](https://leetcode.com/problems/find-largest-value-in-each-tree-row/) - LC 515
- [ ] [Maximum Level Sum of a Binary Tree](https://leetcode.com/problems/maximum-level-sum-of-a-binary-tree/) - LC 1161
- [ ] [Find Bottom Left Tree Value](https://leetcode.com/problems/find-bottom-left-tree-value/) - LC 513

<details>
<summary><strong>🧠 Spaced Repetition Schedule</strong></summary>

**Day 1:** Average of levels (this problem)
**Day 3:** Maximum per level (LC 515)
**Day 7:** Maximum level sum (LC 1161)
**Day 14:** Solve all without notes

</details>

---

## 🎤 Interview Context

<details>
<summary><strong>How to Communicate in Interviews</strong></summary>

**Explaining approach:**
> "This is standard BFS level order, but instead of collecting node values, I'll track the sum and count for each level, then compute the average."

**Handling precision:**
> "I'll use floating-point division to get accurate averages. In Python, the `/` operator gives float division."

**Follow-up variations:**
> "For maximum per level, I'd initialize with negative infinity and update with max. For level sum, I'd just not divide at the end."

</details>

**Company Focus:**

| Company | Frequency | Notes |
|---------|-----------|-------|
| Amazon | ⭐⭐⭐ | May combine with other metrics |
| Meta | ⭐⭐⭐ | Straightforward application |
| Google | ⭐⭐ | May ask follow-ups |
| Microsoft | ⭐⭐⭐ | Standard BFS application |

---

## ⏱️ Time Estimates

| Activity | Time | Notes |
|----------|------|-------|
| BFS solution | 5-7 min | Trivial extension of level order |
| With variations | 10 min | Max, min, sum |
| Explain approach | 2 min | Should be quick |

---

> **💡 Key Insight:** Any level aggregation problem (average, max, min, sum) is just level order traversal with aggregation instead of collection. The BFS skeleton stays the same; only what you do with each node changes.

---

## 🔗 Related

- [Level Order Traversal](./01-Level-Order.md)
- [BFS Concept](./00-BFS-Concept.md)
- [Right Side View](./04-Right-Side-View.md)
