# 03 - Reverse Nodes in k-Group (LeetCode 25)

> **Pattern:** In-Place Reversal (Group Reversal)  
> **Difficulty:** Hard  
> **Companies:** Amazon, Meta, Google, Microsoft

---

## Overview

Given the head of a linked list, reverse the nodes of the list `k` at a time and return the modified list. `k` is a positive integer and is less than or equal to the length of the linked list. If the number of nodes is not a multiple of `k`, the remaining nodes at the end should stay in their original order.

**Example:**
```
Input:  1 → 2 → 3 → 4 → 5, k = 2
Output: 2 → 1 → 4 → 3 → 5
        ↑___↑   ↑___↑   ↑ (not reversed, < k)

Input:  1 → 2 → 3 → 4 → 5, k = 3
Output: 3 → 2 → 1 → 4 → 5
        ↑_______↑   ↑___↑ (not reversed, < k)
```

**Why This Is Hard:** You need to combine multiple techniques: counting nodes, reversing sublists, and reconnecting groups. Edge cases are tricky.

---

## 🎯 Pattern Recognition

<details>
<summary><strong>How to Identify This Pattern</strong></summary>

**Look for these signals:**
- "Reverse in groups of k"
- "Reverse every k nodes"
- Repeated reversal pattern
- "Leave remaining nodes" (incomplete group)

**Keywords in problem statement:**
- "k at a time", "every k nodes"
- "groups of k"
- "if remaining nodes fewer than k, leave as is"

**Key challenges:**
1. Check if k nodes exist before reversing
2. Reverse exactly k nodes
3. Connect the reversed group to previous and next groups
4. Handle last group with < k nodes

</details>

---

## ✅ When to Use

- Reversing linked list in fixed-size groups
- Problems requiring repeated sublist operations
- When group size is specified
- Building block for complex list manipulation

---

## ❌ When NOT to Use

| Scenario | Why Not | Use Instead |
|----------|---------|-------------|
| Simple pair swap | k=2 is simpler case | LC 24 Swap Pairs |
| Single reversal | Overkill | LC 206 or LC 92 |
| Variable group sizes | Different logic needed | Custom solution |
| Reverse alternate groups | Needs skip logic | Modified approach |

---

## 🔗 Concept Map

<details>
<summary><strong>Prerequisites & Next Steps</strong></summary>

**Before this, you should know:**
- [Reverse Entire List (LC 206)](./01-Reverse-Entire-List.md) - Basic reversal
- [Reverse Between (LC 92)](./02-Reverse-Between.md) - Partial reversal
- [In-Place Reversal](../5.1-Reversal-Technique.md) - Pattern overview
- Linked list length calculation

**After mastering this:**
- You've reached the peak of reversal problems!
- Can handle any reversal variant
- Swap Nodes in Pairs becomes trivial

**This combines:**
- Counting nodes
- Reversing sublists
- Reconnecting sections
- Edge case handling

</details>

---

## 📐 How It Works

### Strategy Overview

1. **Check** if k nodes exist from current position
2. **Reverse** k nodes using sublist reversal
3. **Connect** the reversed group to the previous group
4. **Repeat** for next group
5. **Stop** when fewer than k nodes remain

### Visual Walkthrough

```
Input: 1 → 2 → 3 → 4 → 5, k = 2

Step 1: Check - 2 nodes exist? Yes
  Reverse 1 → 2 to get 2 → 1
  
  Before: dummy → 1 → 2 → 3 → 4 → 5
                  ↑___↑
                 group 1
  
  After:  dummy → 2 → 1 → 3 → 4 → 5
                  ↑___↑
                reversed!

Step 2: Check - 2 nodes exist from node 3? Yes
  Reverse 3 → 4 to get 4 → 3
  
  Before: dummy → 2 → 1 → 3 → 4 → 5
                          ↑___↑
                         group 2
  
  After:  dummy → 2 → 1 → 4 → 3 → 5
                          ↑___↑
                        reversed!

Step 3: Check - 2 nodes exist from node 5? No
  Don't reverse, we're done.

Result: 2 → 1 → 4 → 3 → 5
```

### Key Pointer Management

```
For each group reversal:

Before reversal:
  group_prev → first → ... → last → group_next
  
After reversal:
  group_prev → last → ... → first → group_next
  
We need to track:
- group_prev: node before the group (to connect new head)
- first: original first node (becomes new tail)
- last: original last node (becomes new head)
- group_next: node after the group (to connect new tail)
```

---

## 💻 Code Implementation

### Solution 1: Iterative with Helper Function

**Python:**
```python
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next


def reverse_k_group(head: ListNode, k: int) -> ListNode:
    """
    Reverse nodes in k-groups.
    
    Pattern: In-Place Reversal (Group Reversal)
    Time: O(n), Space: O(1)
    """
    if not head or k == 1:
        return head
    
    # Helper: Check if k nodes exist from current node
    def has_k_nodes(node: ListNode, k: int) -> bool:
        count = 0
        while node and count < k:
            node = node.next
            count += 1
        return count == k
    
    # Helper: Reverse k nodes starting from head, return new head and tail
    def reverse_k(head: ListNode, k: int) -> tuple:
        prev = None
        curr = head
        for _ in range(k):
            next_node = curr.next
            curr.next = prev
            prev = curr
            curr = next_node
        # prev is new head, head is new tail
        # head.next should point to curr (next group's head)
        return prev, head
    
    # Main logic
    dummy = ListNode(0)
    dummy.next = head
    group_prev = dummy
    
    while has_k_nodes(group_prev.next, k):
        # Remember the first node of this group (will become tail)
        group_first = group_prev.next
        
        # Reverse k nodes
        new_head, new_tail = reverse_k(group_first, k)
        
        # Connect to previous group
        group_prev.next = new_head
        
        # new_tail.next should point to the next group (or remaining nodes)
        # After reverse_k, new_tail.next is where we should continue from
        # But we need to save the next group head first
        
        # Move group_prev to the tail of this reversed group
        group_prev = new_tail
    
    return dummy.next


def reverse_k_group_v2(head: ListNode, k: int) -> ListNode:
    """
    Alternative implementation - single pass with inline reversal.
    """
    if not head or k == 1:
        return head
    
    dummy = ListNode(0)
    dummy.next = head
    prev_group_end = dummy
    
    while True:
        # Check if k nodes exist
        kth = prev_group_end
        for _ in range(k):
            kth = kth.next
            if not kth:
                return dummy.next  # Less than k nodes, done
        
        # Save next group's start
        next_group_start = kth.next
        
        # Reverse k nodes: from prev_group_end.next to kth
        prev = next_group_start
        curr = prev_group_end.next
        
        while curr != next_group_start:
            temp = curr.next
            curr.next = prev
            prev = curr
            curr = temp
        
        # Connect previous group to new head
        # prev_group_end.next was the first node, now becomes last
        group_first = prev_group_end.next
        prev_group_end.next = kth  # kth is now the head after reversal
        prev_group_end = group_first  # Move to new end for next iteration
    
    return dummy.next
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
 * Reverse nodes in k-groups.
 * Time: O(n), Space: O(1)
 */
function reverseKGroup(head, k) {
    if (!head || k === 1) return head;
    
    // Check if k nodes exist
    const hasKNodes = (node, k) => {
        let count = 0;
        while (node && count < k) {
            node = node.next;
            count++;
        }
        return count === k;
    };
    
    const dummy = new ListNode(0);
    dummy.next = head;
    let prevGroupEnd = dummy;
    
    while (hasKNodes(prevGroupEnd.next, k)) {
        // Find kth node
        let kth = prevGroupEnd;
        for (let i = 0; i < k; i++) {
            kth = kth.next;
        }
        
        // Save next group start
        const nextGroupStart = kth.next;
        
        // Reverse k nodes
        let prev = nextGroupStart;
        let curr = prevGroupEnd.next;
        
        while (curr !== nextGroupStart) {
            const temp = curr.next;
            curr.next = prev;
            prev = curr;
            curr = temp;
        }
        
        // Reconnect
        const groupFirst = prevGroupEnd.next;
        prevGroupEnd.next = kth;
        prevGroupEnd = groupFirst;
    }
    
    return dummy.next;
}
```

### Solution 2: Recursive

**Python:**
```python
def reverse_k_group_recursive(head: ListNode, k: int) -> ListNode:
    """
    Recursive solution.
    Time: O(n), Space: O(n/k) - recursion stack
    """
    # Check if k nodes exist
    curr = head
    count = 0
    while curr and count < k:
        curr = curr.next
        count += 1
    
    if count < k:
        # Less than k nodes, don't reverse
        return head
    
    # Reverse first k nodes
    prev = None
    curr = head
    for _ in range(k):
        next_node = curr.next
        curr.next = prev
        prev = curr
        curr = next_node
    
    # head is now the tail of reversed section
    # curr is the head of remaining list
    # Recursively reverse remaining and connect
    head.next = reverse_k_group_recursive(curr, k)
    
    # prev is the new head
    return prev
```

**JavaScript:**
```javascript
function reverseKGroupRecursive(head, k) {
    // Check if k nodes exist
    let curr = head;
    let count = 0;
    while (curr && count < k) {
        curr = curr.next;
        count++;
    }
    
    if (count < k) return head;
    
    // Reverse first k nodes
    let prev = null;
    curr = head;
    for (let i = 0; i < k; i++) {
        const nextNode = curr.next;
        curr.next = prev;
        prev = curr;
        curr = nextNode;
    }
    
    // Recursively reverse rest and connect
    head.next = reverseKGroupRecursive(curr, k);
    
    return prev;
}
```

---

## ⚡ Complexity Analysis

| Approach | Time | Space | Notes |
|----------|------|-------|-------|
| Iterative |" O(n) "| O(1) | Optimal |
| Recursive |" O(n) "| O(n/k) | Call stack |

**Detailed Analysis:**
- Each node is visited at most twice (once for check, once for reverse)
- O(2n) = O(n)
- Iterative uses constant extra space

---

## 🔄 Variations

| Variation | Difference | Problem |
|-----------|------------|---------|
| k = 2 | Swap pairs | LC 24 |
| Reverse alternate groups | Skip every other | Custom |
| Left-to-right groups | Keep last group partial | This problem |
| Fully reverse all groups | Pad with nulls | Custom |

### Swap Pairs (k = 2)

```python
def swap_pairs(head: ListNode) -> ListNode:
    """k=2 special case - simpler implementation."""
    dummy = ListNode(0)
    dummy.next = head
    prev = dummy
    
    while prev.next and prev.next.next:
        first = prev.next
        second = prev.next.next
        
        # Swap
        first.next = second.next
        second.next = first
        prev.next = second
        
        prev = first
    
    return dummy.next
```

---

## ⚠️ Common Mistakes

### 1. Not Checking for k Nodes Before Reversing

```python
# ❌ Wrong - reverses even if < k nodes
def reverse_k_group(head, k):
    # ... reverse without checking
    
# ✅ Correct - always check first
if not has_k_nodes(group_prev.next, k):
    break  # Don't reverse incomplete group
```

### 2. Losing Connection Between Groups

```python
# ❌ Wrong - groups get disconnected
# After reversing group 1, we need to:
# 1. Connect prev_group_end to new head of group 1
# 2. Connect new tail of group 1 to group 2

# Make sure to update prev_group_end after each group
prev_group_end = group_first  # New tail
```

### 3. Wrong Reversal Stopping Point

```python
# ❌ Wrong - reverses past k nodes
while curr:
    # ... reverse all nodes

# ✅ Correct - reverse exactly k nodes
for _ in range(k):
    # ... reverse
# or
while curr != next_group_start:
    # ... reverse
```

### 4. Infinite Loop

```python
# ❌ Wrong - not advancing properly
while has_k_nodes(group_prev.next, k):
    # ... reverse
    # Forgot to update group_prev!

# ✅ Correct - move group_prev forward
while has_k_nodes(group_prev.next, k):
    # ... reverse
    group_prev = new_tail  # Move forward!
```

---

## 📝 Practice Problems (Progressive)

### Easy (Foundation)
- [ ] [Reverse Linked List](https://leetcode.com/problems/reverse-linked-list/) - LC 206
- [ ] [Swap Nodes in Pairs](https://leetcode.com/problems/swap-nodes-in-pairs/) - LC 24

### Medium (Build up)
- [ ] [Reverse Linked List II](https://leetcode.com/problems/reverse-linked-list-ii/) - LC 92

### Hard (This level)
- [ ] [Reverse Nodes in k-Group](https://leetcode.com/problems/reverse-nodes-in-k-group/) - LC 25 - This problem!

<details>
<summary><strong>🧠 Spaced Repetition Schedule</strong></summary>

**For LC 25:**
- **Day 1:** Solve with iterative approach
- **Day 3:** Solve with recursive approach
- **Day 7:** Trace through k=3 example by hand
- **Day 14:** Solve LC 24 (should be trivial now)
- **Day 30:** Re-solve LC 25 in under 25 minutes

**Mastery checklist:**
- [ ] Can check for k nodes efficiently
- [ ] Understand connection between groups
- [ ] Handle last incomplete group correctly
- [ ] Can implement both iterative and recursive

</details>

---

## 🎤 Interview Context

<details>
<summary><strong>How to Communicate This in Interviews</strong></summary>

**Opening (1-2 min):**
"I'll process the list in groups. For each group, I'll first check if k nodes exist, then reverse them and connect to the previous group. I'll use a dummy node to simplify the head case."

**Explain the approach:**
1. "I'll use a helper to check if k nodes exist from current position"
2. "For each group, I reverse k nodes using the standard three-pointer technique"
3. "After reversal, I connect the new head to the previous group's tail"
4. "I move my pointer forward and repeat until fewer than k nodes remain"

**Edge cases to mention:**
1. k = 1 → No reversal needed
2. k > length → Return original
3. length % k != 0 → Last group unchanged

**Follow-up questions:**
- "Can you do it without extra space?" → Yes, this is O(1)
- "What about recursively?" → Yes, show recursive version
- "How to reverse alternate groups?" → Add a skip flag

</details>

**Company Focus:**

| Company | Frequency | Notes |
|---------|-----------|-------|
| Amazon | ⭐⭐⭐⭐⭐ | VERY common hard question |
| Meta | ⭐⭐⭐⭐ | Tests deep LL understanding |
| Google | ⭐⭐⭐⭐ |" May ask for proof of O(1) space "|
| Microsoft | ⭐⭐⭐⭐ | Standard hard question |

---

## ⏱️ Time Estimates

| Activity | Time | Notes |
|----------|------|-------|
| First solve | 35-45 min | Many pieces to coordinate |
| After practice | 20-25 min | With explanation |
| Interview target | 25-30 min | With edge cases |
| With follow-up | 35-40 min | Recursive version |

---

> **💡 Key Insight:** Break the problem into smaller pieces: (1) check if k nodes exist, (2) reverse k nodes, (3) reconnect groups. Each piece is manageable. The complexity comes from coordinating them correctly. Always track the tail of the previous group to connect the next group's head.

---

## 🔗 Related

- [In-Place Reversal Technique](../5.1-Reversal-Technique.md) - Pattern overview
- [Reverse Entire List (LC 206)](./01-Reverse-Entire-List.md) - Foundation
- [Reverse Between (LC 92)](./02-Reverse-Between.md) - Partial reversal
- [Swap Nodes in Pairs (LC 24)](https://leetcode.com/problems/swap-nodes-in-pairs/) - k=2 special case
