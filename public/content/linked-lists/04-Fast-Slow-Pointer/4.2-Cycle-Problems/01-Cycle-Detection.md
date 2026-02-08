# 01 - Cycle Detection (LeetCode 141)

> **Pattern:** Fast & Slow Pointer (Grokking #2)  
> **Difficulty:** Easy  
> **Companies:** Amazon, Microsoft, Meta, Google

---

## Overview

Given a linked list, determine if it has a cycle. A cycle exists if a node can be reached again by continuously following the `next` pointer.

**The Classic Problem:** This is the foundational problem for the Fast & Slow Pointer pattern and one of the most common linked list interview questions.

---

## 🎯 Pattern Recognition

<details>
<summary><strong>How to Identify This Pattern</strong></summary>

**Look for these signals:**
- "Detect if there's a cycle/loop"
- "Check if linked list is circular"
- Need to determine if traversal ever ends
- O(1) space constraint for cycle detection

**Keywords in problem statement:**
- "cycle", "loop", "circular"
- "return true if there is a cycle"
- "pos" (often indicates cycle position in examples)

**Immediate recognition:**
When you see "detect cycle in linked list" → Fast & Slow Pointer is the optimal solution.

</details>

---

## ✅ When to Use

- Determining if a linked list has a cycle
- Validating linked list integrity
- As a first step before finding cycle start
- When O(1) space is required

---

## ❌ When NOT to Use

| Scenario | Why Not | Use Instead |
|----------|---------|-------------|
| Need to find WHERE cycle starts | This only detects existence | Floyd's algorithm phase 2 |
| Need to find cycle length | Requires additional logic | Extend after detection |
| Hash-based detection acceptable |" Simpler but O(n) space "| HashSet approach |
| Tree/graph structures | Multiple paths possible | DFS with visited set |

---

## 🔗 Concept Map

<details>
<summary><strong>Prerequisites & Next Steps</strong></summary>

**Before this, you should know:**
- [Linked List Basics](../../01-Singly-LL/1.1-Basics.md) - Node structure, traversal
- [Fast & Slow Concept](../4.1-Concept.md) - Why the pattern works

**After mastering this:**
- [Find Cycle Start](./02-Find-Cycle-Start.md) - Phase 2 of Floyd's algorithm
- [Find Cycle Length](./02-Find-Cycle-Start.md#cycle-length) - Count nodes in cycle
- [Happy Number](./03-Happy-Number.md) - Apply pattern to number sequences

**Combines with:**
- Cycle removal (detect + remove)
- Linked list validation
- Memory leak detection

</details>

---

## 📐 How It Works

### The Algorithm

1. Initialize two pointers at head: `slow` and `fast`
2. Move `slow` by 1, `fast` by 2 in each iteration
3. If `fast` reaches `null`, no cycle exists
4. If `slow` and `fast` meet, a cycle exists

### Visual Walkthrough

```
Example: 1 → 2 → 3 → 4 → 5
                     ↓   ↑
                     └───┘
                     
Initial:
  1 → 2 → 3 → 4 → 5
  S               ↓ ↑
  F               └─┘

Step 1: slow=2, fast=3
  1 → 2 → 3 → 4 → 5
      S   F       ↓ ↑
                  └─┘

Step 2: slow=3, fast=5
  1 → 2 → 3 → 4 → 5
          S       F
                  ↓ ↑
                  └─┘

Step 3: slow=4, fast=4 (inside cycle)
  1 → 2 → 3 → 4 → 5
              S       
              F   ↓ ↑
                  └─┘
  
  S == F → CYCLE DETECTED!
```

### Why They Must Meet

In a cycle of length `k`:
- Fast gains 1 position on slow each step
- After at most `k` steps, they will be at the same position
- They cannot skip past each other (gaining only 1 step at a time)

---

## 💻 Code Implementation

### Solution 1: Fast & Slow Pointer (Optimal)

**Python:**
```python
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next


def has_cycle(head: ListNode) -> bool:
    """
    Detect if linked list has a cycle.
    
    Pattern: Fast & Slow Pointer
    Time: O(n), Space: O(1)
    
    Args:
        head: Head of the linked list
        
    Returns:
        True if cycle exists, False otherwise
    """
    # Edge case: empty list or single node without self-loop
    if not head or not head.next:
        return False
    
    slow = head
    fast = head
    
    # Continue while fast can move
    while fast and fast.next:
        slow = slow.next         # Move 1 step
        fast = fast.next.next    # Move 2 steps
        
        # If they meet, cycle exists
        if slow == fast:
            return True
    
    # Fast reached end, no cycle
    return False
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
 * Detect if linked list has a cycle.
 * Pattern: Fast & Slow Pointer
 * Time: O(n), Space: O(1)
 * 
 * @param {ListNode} head - Head of the linked list
 * @return {boolean} - True if cycle exists
 */
function hasCycle(head) {
    // Edge case: empty or single node
    if (!head || !head.next) {
        return false;
    }
    
    let slow = head;
    let fast = head;
    
    while (fast && fast.next) {
        slow = slow.next;       // Move 1 step
        fast = fast.next.next;  // Move 2 steps
        
        if (slow === fast) {
            return true;  // Cycle detected
        }
    }
    
    return false;  // No cycle
}
```

### Solution 2: HashSet (Alternative)

**Python:**
```python
def has_cycle_hashset(head: ListNode) -> bool:
    """
    Detect cycle using HashSet.
    
    Time: O(n), Space: O(n)
    Simpler but uses more space.
    """
    seen = set()
    current = head
    
    while current:
        if current in seen:
            return True  # Node visited before = cycle
        seen.add(current)
        current = current.next
    
    return False
```

**JavaScript:**
```javascript
function hasCycleHashSet(head) {
    // Time: O(n), Space: O(n)
    const seen = new Set();
    let current = head;
    
    while (current) {
        if (seen.has(current)) {
            return true;
        }
        seen.add(current);
        current = current.next;
    }
    
    return false;
}
```

---

## ⚡ Complexity Analysis

### Fast & Slow Pointer (Optimal)

| Case | Time | Space | Notes |
|------|------|-------|-------|
| No cycle |" O(n) "| O(1) | Fast traverses entire list |
| Cycle |" O(n) "| O(1) | At most 2 passes through cycle |
| Empty/Single |" O(1) "| O(1) | Early return |

**Detailed Time Analysis:**
- Let `n` = total nodes, `k` = cycle length
- Non-cycle part: both traverse
- Cycle part: fast catches slow within `k` steps
- Total: O(n + k) = O(n) since k ≤ n

### HashSet Approach

| Case | Time | Space | Notes |
|------|------|-------|-------|
| All cases |" O(n) "| O(n) | Stores all visited nodes |

---

## 🔄 Variations

| Variation | Modification | LeetCode Problem |
|-----------|--------------|------------------|
| Find cycle start | Two-phase algorithm | LC 142 |
| Find cycle length | Count after detection | Part of LC 142 |
| Remove cycle | Detect + find last node | Interview variant |
| Count nodes before cycle | Track distance | Interview variant |

### Find Cycle Length

```python
def get_cycle_length(head: ListNode) -> int:
    """
    Find length of cycle. Returns 0 if no cycle.
    """
    if not head or not head.next:
        return 0
    
    slow = fast = head
    
    # Phase 1: Detect cycle
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow == fast:
            # Phase 2: Count cycle length
            count = 1
            current = slow.next
            while current != slow:
                count += 1
                current = current.next
            return count
    
    return 0  # No cycle
```

---

## ⚠️ Common Mistakes

### 1. Incorrect Loop Condition

```python
# ❌ Wrong - crashes when fast is None
while fast.next:
    fast = fast.next.next

# ✅ Correct - check both fast AND fast.next
while fast and fast.next:
    slow = slow.next
    fast = fast.next.next
```

### 2. Missing Edge Cases

```python
# ❌ Wrong - crashes on empty list
def has_cycle(head):
    slow = head
    fast = head.next  # Crash if head is None!

# ✅ Correct - handle edge cases first
def has_cycle(head):
    if not head or not head.next:
        return False
    slow = head
    fast = head
```

### 3. Comparing Values Instead of Nodes

```python
# ❌ Wrong - values might be duplicate
if slow.val == fast.val:
    return True

# ✅ Correct - compare node references
if slow == fast:
    return True
```

### 4. Starting Pointers at Wrong Positions

```python
# ❌ Problematic - may miss cycles or give wrong result
slow = head
fast = head.next.next

# ✅ Standard - both start at head
slow = head
fast = head
```

---

## 📝 Practice Problems (Progressive)

### Easy (Core problem)
- [ ] [Linked List Cycle](https://leetcode.com/problems/linked-list-cycle/) - LC 141 - This problem!

### Medium (Extensions)
- [ ] [Linked List Cycle II](https://leetcode.com/problems/linked-list-cycle-ii/) - LC 142 - Find cycle start
- [ ] [Happy Number](https://leetcode.com/problems/happy-number/) - LC 202 - Cycle in number sequence
- [ ] [Find the Duplicate Number](https://leetcode.com/problems/find-the-duplicate-number/) - LC 287 - Array as linked list

### Related Easy
- [ ] [Middle of the Linked List](https://leetcode.com/problems/middle-of-the-linked-list/) - LC 876 - Same pattern, different use

<details>
<summary><strong>🧠 Spaced Repetition Schedule</strong></summary>

**For LC 141 (Cycle Detection):**
- **Day 1:** Solve without looking at notes
- **Day 3:** Explain why fast and slow meet
- **Day 7:** Solve LC 142 (builds on this)
- **Day 14:** Solve LC 287 (advanced application)
- **Day 30:** Review all cycle problems together

**Mastery indicators:**
- [ ] Can write solution in under 5 minutes
- [ ] Can explain the math behind it
- [ ] Can handle all edge cases without thinking
- [ ] Can apply to non-linked-list problems

</details>

---

## 🎤 Interview Context

<details>
<summary><strong>How to Communicate This in Interviews</strong></summary>

**Opening statement:**
"I'll use the Fast and Slow pointer technique. One pointer moves at 2x speed. If there's a cycle, they'll eventually meet; if not, the fast pointer will reach null."

**Walkthrough script:**
1. "First, I'll handle edge cases: empty list or single node without self-loop"
2. "I'll initialize both pointers at head"
3. "In each iteration, slow moves 1 step, fast moves 2"
4. "The key is checking `fast and fast.next` before moving"
5. "If they meet, we have a cycle; if fast hits null, we don't"

**Follow-up questions to expect:**
- "Why does this work?" → Explain the mathematical proof
- "Can you find WHERE the cycle starts?" → Lead into LC 142
- "What's the space complexity?" → O(1), that's the point!
- "Could you use a HashSet?" → Yes, but O(n) space

</details>

**Company Focus:**

| Company | Frequency | Notes |
|---------|-----------|-------|
| Amazon | ⭐⭐⭐⭐⭐ | Very common, expect follow-ups |
| Microsoft | ⭐⭐⭐⭐ | Standard question |
| Meta | ⭐⭐⭐⭐ | Often leads to cycle II |
| Google | ⭐⭐⭐ | May ask for proof |

---

## ⏱️ Time Estimates

| Activity | Time | Notes |
|----------|------|-------|
| First solution | 10-15 min | Understanding the pattern |
| Optimal solution | 5-10 min | After learning pattern |
| Interview target | 5-8 min | Including explanation |
| With follow-ups | 15-20 min | Cycle start, length |

---

> **💡 Key Insight:** The fast pointer gains exactly 1 step on the slow pointer each iteration. In a cycle of length k, they MUST meet within k iterations. This is mathematically guaranteed - they cannot skip past each other.

---

## 🔗 Related

- [Fast & Slow Pointer Concept](../4.1-Concept.md)
- [Find Cycle Start (LC 142)](./02-Find-Cycle-Start.md)
- [Happy Number (LC 202)](./03-Happy-Number.md)
- [Find Middle](../../07-Two-Pointer-Problems/7.1-Find-Middle.md)
