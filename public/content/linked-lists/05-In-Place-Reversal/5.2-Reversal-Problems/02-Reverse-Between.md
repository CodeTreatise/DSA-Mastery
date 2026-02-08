# 02 - Reverse Linked List II (LeetCode 92)

> **Pattern:** In-Place Reversal (Sub-list)  
> **Difficulty:** Medium  
> **Companies:** Amazon, Meta, Bloomberg, Microsoft

---

## Overview

Given the head of a singly linked list and two integers `left` and `right` where `left <= right`, reverse the nodes of the list from position `left` to position `right`, and return the reversed list. Positions are 1-indexed.

**Example:**
```
Input:  1 → 2 → 3 → 4 → 5, left = 2, right = 4
Output: 1 → 4 → 3 → 2 → 5
              ↑_____↑ reversed
```

**Why This Matters:** This is a significant step up from basic reversal. It requires careful pointer management to handle the connections before and after the reversed section.

---

## 🎯 Pattern Recognition

<details>
<summary><strong>How to Identify This Pattern</strong></summary>

**Look for these signals:**
- "Reverse from position m to n"
- "Reverse between two indices"
- Need to keep parts of the list unchanged
- Partial modification of linked list

**Keywords in problem statement:**
- "reverse between", "from position... to position..."
- "between left and right"
- "portion", "sub-list"

**Key challenges:**
1. Finding the start of the section to reverse
2. Connecting the reversed section back to the unchanged parts
3. Handling edge cases (reverse from head, reverse to tail)

</details>

---

## ✅ When to Use

- Reversing a portion of a linked list
- When boundaries are given by positions
- Problems requiring partial list modification
- Building block for more complex reordering

---

## ❌ When NOT to Use

| Scenario | Why Not | Use Instead |
|----------|---------|-------------|
| Reverse entire list | Simpler approach exists | Basic reversal |
| Reverse by value (not position) | Different logic needed | Custom traversal |
| Doubly linked list | Can traverse both ways | Two-pointer from both ends |
| Need to preserve original | Modifies in-place | Copy first |

---

## 🔗 Concept Map

<details>
<summary><strong>Prerequisites & Next Steps</strong></summary>

**Before this, you should know:**
- [Reverse Entire List (LC 206)](./01-Reverse-Entire-List.md) - Basic technique
- [In-Place Reversal](../5.1-Reversal-Technique.md) - Pattern overview
- Dummy node technique

**After mastering this:**
- [Reverse K-Group (LC 25)](./03-Reverse-K-Group.md) - Repeated reversal
- Swap Nodes in Pairs (LC 24) - Simpler case
- More complex reordering problems

**Key insight:**
Use a dummy node to simplify edge cases (when left = 1).

</details>

---

## 📐 How It Works

### Strategy Overview

1. **Navigate** to the node before position `left`
2. **Reverse** the nodes from `left` to `right`
3. **Reconnect** the reversed section with unchanged parts

### Visual Walkthrough

```
Input: 1 → 2 → 3 → 4 → 5, left=2, right=4

Step 1: Add dummy, find node before 'left'
  dummy → 1 → 2 → 3 → 4 → 5
          ↑   ↑           ↑
        prev left       right
        (before left)

Step 2: Reverse nodes 2,3,4 using "insert at front" technique
  Instead of traditional reversal, we repeatedly move the next node
  to the front of the reversed section:

  Round 1: Move 3 to after prev
    Before: prev(1) → 2 → 3 → 4 → 5
    After:  prev(1) → 3 → 2 → 4 → 5
                      ↑       
                   moved!

  Round 2: Move 4 to after prev  
    Before: prev(1) → 3 → 2 → 4 → 5
    After:  prev(1) → 4 → 3 → 2 → 5
                      ↑
                   moved!

Step 3: Result (remove dummy)
  1 → 4 → 3 → 2 → 5
```

### The "Insert at Front" Technique

Instead of traditional prev/curr/next reversal, we:
1. Keep `left` node fixed as anchor
2. Repeatedly take the node after anchor and move it to front
3. After (right - left) iterations, section is reversed

```
Why this works:
- Original order: 2 → 3 → 4
- After moving 3: 3 → 2 → 4
- After moving 4: 4 → 3 → 2

Each move puts the next node at the front of reversed section.
```

---

## 💻 Code Implementation

### Solution 1: Insert at Front (Recommended)

**Python:**
```python
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next


def reverse_between(head: ListNode, left: int, right: int) -> ListNode:
    """
    Reverse nodes from position left to right (1-indexed).
    
    Pattern: In-Place Reversal with Insert at Front
    Time: O(n), Space: O(1)
    """
    if not head or left == right:
        return head
    
    # Dummy node simplifies edge case when left = 1
    dummy = ListNode(0)
    dummy.next = head
    
    # Step 1: Navigate to the node BEFORE position 'left'
    prev = dummy
    for _ in range(left - 1):
        prev = prev.next
    
    # 'current' is the node at position 'left'
    # This will become the TAIL of the reversed section
    current = prev.next
    
    # Step 2: Reverse by moving nodes to front
    # We need to move (right - left) nodes
    for _ in range(right - left):
        # Node to move
        node_to_move = current.next
        
        # Remove node_to_move from its current position
        current.next = node_to_move.next
        
        # Insert node_to_move right after prev (at front of reversed section)
        node_to_move.next = prev.next
        prev.next = node_to_move
    
    return dummy.next


# Trace for [1,2,3,4,5], left=2, right=4:
#
# Initial: dummy → 1 → 2 → 3 → 4 → 5
#                  ↑   ↑
#                prev curr
#
# Iteration 1 (move 3):
#   node_to_move = 3
#   curr.next = 4 (skip over 3)
#   3.next = 2 (prev.next)
#   prev.next = 3
#   Result: dummy → 1 → 3 → 2 → 4 → 5
#
# Iteration 2 (move 4):
#   node_to_move = 4
#   curr.next = 5 (skip over 4)
#   4.next = 3 (prev.next)
#   prev.next = 4
#   Result: dummy → 1 → 4 → 3 → 2 → 5
```

**JavaScript:**
```javascript
class ListNode {
    constructor(val = 0, next = null) {
        this.val = val;
        this.next = next;
    }
}

/**
 * Reverse nodes from position left to right.
 * Pattern: In-Place Reversal with Insert at Front
 * Time: O(n), Space: O(1)
 */
function reverseBetween(head, left, right) {
    if (!head || left === right) {
        return head;
    }
    
    // Dummy node for edge case when left = 1
    const dummy = new ListNode(0);
    dummy.next = head;
    
    // Find node before left
    let prev = dummy;
    for (let i = 0; i < left - 1; i++) {
        prev = prev.next;
    }
    
    // Current is at position left
    let current = prev.next;
    
    // Move nodes to front
    for (let i = 0; i < right - left; i++) {
        const nodeToMove = current.next;
        current.next = nodeToMove.next;
        nodeToMove.next = prev.next;
        prev.next = nodeToMove;
    }
    
    return dummy.next;
}
```

### Solution 2: Traditional Three-Pointer in Sublist

**Python:**
```python
def reverse_between_traditional(head: ListNode, left: int, right: int) -> ListNode:
    """
    Alternative: Use traditional reversal on the sublist.
    Same complexity, more similar to basic reversal.
    """
    if not head or left == right:
        return head
    
    dummy = ListNode(0)
    dummy.next = head
    
    # Find node before left
    prev_left = dummy
    for _ in range(left - 1):
        prev_left = prev_left.next
    
    # Traditional reversal on sublist
    prev = None
    curr = prev_left.next
    
    # Reverse (right - left + 1) nodes
    for _ in range(right - left + 1):
        next_node = curr.next
        curr.next = prev
        prev = curr
        curr = next_node
    
    # Reconnect:
    # prev_left.next is the old left node (now tail of reversed)
    # prev is the new head of reversed section
    # curr is the node after right
    prev_left.next.next = curr  # Connect tail to rest
    prev_left.next = prev       # Connect prev_left to new head
    
    return dummy.next
```

**JavaScript:**
```javascript
function reverseBetweenTraditional(head, left, right) {
    if (!head || left === right) return head;
    
    const dummy = new ListNode(0);
    dummy.next = head;
    
    let prevLeft = dummy;
    for (let i = 0; i < left - 1; i++) {
        prevLeft = prevLeft.next;
    }
    
    let prev = null;
    let curr = prevLeft.next;
    
    for (let i = 0; i <= right - left; i++) {
        const nextNode = curr.next;
        curr.next = prev;
        prev = curr;
        curr = nextNode;
    }
    
    // Reconnect
    prevLeft.next.next = curr;
    prevLeft.next = prev;
    
    return dummy.next;
}
```

---

## ⚡ Complexity Analysis

| Approach | Time | Space | Notes |
|----------|------|-------|-------|
| Insert at Front |" O(n) "| O(1) | Single pass |
| Traditional Sublist |" O(n) "| O(1) | Also single pass |

**Detailed Analysis:**
- Finding prev_left: O(left) ≤ O(n)
- Reversing section: O(right - left) ≤ O(n)
- Total: O(n)

---

## 🔄 Variations

| Variation | Difference | Problem |
|-----------|------------|---------|
| Swap pairs | left=1, right=2, then 3-4, etc. | LC 24 |
| K-group | Repeated sections of k | LC 25 |
| By value, not position | Find nodes first | Custom |
| Reverse alternating | Every other section | Custom |

---

## ⚠️ Common Mistakes

### 1. Forgetting Dummy Node (Edge Case: left = 1)

```python
# ❌ Wrong - fails when left = 1
def reverse_between(head, left, right):
    prev = head
    for _ in range(left - 1):  # What if left = 1?
        prev = prev.next        # prev is at head, no "before left" node!

# ✅ Correct - dummy handles left = 1
def reverse_between(head, left, right):
    dummy = ListNode(0)
    dummy.next = head
    prev = dummy
    for _ in range(left - 1):
        prev = prev.next  # Now works even when left = 1
```

### 2. Wrong Loop Count

```python
# ❌ Wrong - off by one
for _ in range(right - left + 1):  # One too many moves!
    # ...

# ✅ Correct - we move (right - left) nodes
for _ in range(right - left):
    # ...
```

### 3. Losing Track of Pointers

```python
# ❌ Wrong - modifying in wrong order
node_to_move = current.next
prev.next = node_to_move        # Overwrites connection!
node_to_move.next = prev.next   # Now pointing to itself!
current.next = node_to_move.next

# ✅ Correct - proper order
node_to_move = current.next
current.next = node_to_move.next  # First, skip over node_to_move
node_to_move.next = prev.next     # Point to current front
prev.next = node_to_move          # Update front
```

### 4. Not Handling Single Node Section

```python
# Edge case: left == right (no reversal needed)
if left == right:
    return head  # Return immediately
```

---

## 📝 Practice Problems (Progressive)

### Easy (Foundation)
- [ ] [Reverse Linked List](https://leetcode.com/problems/reverse-linked-list/) - LC 206 - Basic reversal

### Medium (This level)
- [ ] [Reverse Linked List II](https://leetcode.com/problems/reverse-linked-list-ii/) - LC 92 - This problem!
- [ ] [Swap Nodes in Pairs](https://leetcode.com/problems/swap-nodes-in-pairs/) - LC 24 - Simpler case

### Hard (Extension)
- [ ] [Reverse Nodes in k-Group](https://leetcode.com/problems/reverse-nodes-in-k-group/) - LC 25 - Repeated reversal

<details>
<summary><strong>🧠 Spaced Repetition Schedule</strong></summary>

**For LC 92:**
- **Day 1:** Solve with dummy node, understand insert-at-front
- **Day 3:** Trace through with left=1 (edge case)
- **Day 7:** Implement traditional sublist approach
- **Day 14:** Solve LC 25 (builds on this)
- **Day 30:** Revisit and solve in under 15 minutes

**Mastery checklist:**
- [ ] Can explain why dummy node is needed
- [ ] Understand both insertion and traditional approaches
- [ ] Handle edge cases: left=1, left=right, entire list

</details>

---

## 🎤 Interview Context

<details>
<summary><strong>How to Communicate This in Interviews</strong></summary>

**Opening (1 min):**
"I'll use a dummy node to handle the edge case where left equals 1. Then I'll navigate to the node before position left, and reverse the section using an insert-at-front technique."

**Explaining the technique:**
"Instead of traditional reversal, I'll keep the left node fixed and repeatedly move the next node to the front of the reversed section. After (right - left) moves, the section is reversed."

**Edge cases to mention:**
1. left = right → No reversal needed
2. left = 1 → Need dummy node
3. right = list length → Works the same

**Follow-up questions:**
- "Why dummy node?" → Simplifies when left = 1
- "Can you use traditional reversal?" → Yes, show alternative
- "Time complexity?" → O(n) single pass

</details>

**Company Focus:**

| Company | Frequency | Notes |
|---------|-----------|-------|
| Amazon | ⭐⭐⭐⭐ | Common follow-up to LC 206 |
| Meta | ⭐⭐⭐⭐ | Tests pointer manipulation |
| Bloomberg | ⭐⭐⭐⭐ | Frequent question |
| Microsoft | ⭐⭐⭐ | Standard linked list |

---

## ⏱️ Time Estimates

| Activity | Time | Notes |
|----------|------|-------|
| First solve | 20-25 min | Understanding the technique |
| After practice | 12-15 min | With explanation |
| Interview target | 15-18 min | With edge cases |
| With follow-up | 22-28 min | Alternative solution |

---

> **💡 Key Insight:** The "insert at front" technique avoids the complexity of traditional reversal. We keep the left node as an anchor and move each subsequent node to the front. After (right - left) moves, we have the reversed section with correct connections.

---

## 🔗 Related

- [In-Place Reversal Technique](../5.1-Reversal-Technique.md) - Pattern overview
- [Reverse Entire List (LC 206)](./01-Reverse-Entire-List.md) - Basic reversal
- [Reverse K-Group (LC 25)](./03-Reverse-K-Group.md) - Advanced application
- [Swap Nodes in Pairs (LC 24)](https://leetcode.com/problems/swap-nodes-in-pairs/) - Simpler case
