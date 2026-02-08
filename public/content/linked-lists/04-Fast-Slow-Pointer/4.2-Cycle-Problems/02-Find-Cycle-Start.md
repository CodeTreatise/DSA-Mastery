# 02 - Find Cycle Start (LeetCode 142)

> **Pattern:** Fast & Slow Pointer + Floyd's Algorithm  
> **Difficulty:** Medium  
> **Companies:** Amazon, Meta, Google, Microsoft

---

## Overview

Given a linked list, return the node where the cycle begins. If there is no cycle, return `null`. This is the classic **Floyd's Cycle Detection Algorithm** (complete version), extending basic cycle detection to find the exact entry point.

**Why This Matters:** This problem tests deeper understanding of the Fast & Slow pattern. Interviewers love asking "Can you find WHERE the cycle starts?" as a follow-up to cycle detection.

---

## 🎯 Pattern Recognition

<details>
<summary><strong>How to Identify This Pattern</strong></summary>

**Look for these signals:**
- "Find the node where cycle begins"
- "Return the start of the loop"
- Need to find entry point, not just detect existence
- Often a follow-up to basic cycle detection

**Keywords in problem statement:**
- "where the cycle begins", "start of cycle"
- "return the node" (not boolean)
- "entry point of loop"

**Two-phase recognition:**
When you need to find the START of a cycle → Floyd's two-phase algorithm

</details>

---

## ✅ When to Use

- Finding the exact node where a cycle begins
- Detecting and removing cycles
- Memory leak debugging (finding circular references)
- Problems requiring cycle entry point

---

## ❌ When NOT to Use

| Scenario | Why Not | Use Instead |
|----------|---------|-------------|
| Only need to detect cycle | Overkill - phase 1 is enough | Simple fast/slow |
|" Can use O(n) space "| HashSet is simpler | HashSet approach |
| Tree/graph structures | Different traversal patterns | DFS with parent tracking |
| Need all cycle nodes | Only finds entry | Traverse cycle after finding start |

---

## 🔗 Concept Map

<details>
<summary><strong>Prerequisites & Next Steps</strong></summary>

**Before this, you should know:**
- [Cycle Detection (LC 141)](./01-Cycle-Detection.md) - Basic fast/slow
- [Fast & Slow Concept](../4.1-Concept.md) - Why pointers meet

**After mastering this:**
- Cycle removal problems
- [Find Duplicate Number (LC 287)](https://leetcode.com/problems/find-the-duplicate-number/) - Same algorithm on arrays
- Complex linked list manipulation

**Combines with:**
- Cycle length calculation
- List modification (removing cycle)

</details>

---

## 📐 How It Works

### Floyd's Algorithm: Two Phases

**Phase 1: Detect Cycle (find meeting point)**
- Fast moves 2 steps, slow moves 1 step
- If they meet, cycle exists

**Phase 2: Find Entry Point**
- Reset one pointer to head
- Move BOTH pointers 1 step at a time
- They meet at cycle start

### Mathematical Proof

```
Let's define:
- F = distance from head to cycle start
- C = cycle length
- a = distance from cycle start to meeting point

When they first meet:
- Slow traveled: F + a
- Fast traveled: F + a + n*C (n = number of complete cycles)

Since fast moves 2x speed:
  2(F + a) = F + a + n*C
  F + a = n*C
  F = n*C - a

Key insight: If we start one pointer at head and one at meeting point,
and move both at same speed, they will meet at cycle start after F steps!

Because: F = n*C - a
The pointer starting at meeting point will travel n*C - a steps,
which is the same as going around the cycle n times and back a steps,
landing exactly at the cycle start.
```

### Visual Walkthrough

```
List with cycle:

Head ──► [1] ──► [2] ──► [3] ──► [4] ──► [5]
                          ▲               │
                          │               ▼
                         [8] ◄── [7] ◄── [6]

F = 2 (nodes before cycle: 1, 2)
C = 6 (cycle length: 3,4,5,6,7,8)

Phase 1: Find meeting point
┌────────────────────────────────────────┐
│ Step  │ Slow │ Fast │ Notes            │
├────────────────────────────────────────┤
│ Start │  1   │  1   │ Both at head     │
│  1    │  2   │  3   │                  │
│  2    │  3   │  5   │                  │
│  3    │  4   │  7   │                  │
│  4    │  5   │  4   │ Fast lapped      │
│  5    │  6   │  6   │ MEET! (at node 6)│
└────────────────────────────────────────┘

Phase 2: Find cycle start
┌────────────────────────────────────────┐
│ Step  │ ptr1 │ ptr2 │ Notes            │
├────────────────────────────────────────┤
│ Start │  1   │  6   │ Head & meet point│
│  1    │  2   │  7   │                  │
│  2    │  3   │  8   │                  │
│  3    │  3   │  3   │ MEET! Cycle start│
└────────────────────────────────────────┘
```

---

## 💻 Code Implementation

### Solution 1: Floyd's Two-Phase Algorithm (Optimal)

**Python:**
```python
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next


def detect_cycle(head: ListNode) -> ListNode:
    """
    Find the node where cycle begins.
    
    Pattern: Floyd's Cycle Detection (Two-phase)
    Time: O(n), Space: O(1)
    
    Returns:
        The node where cycle starts, or None if no cycle
    """
    if not head or not head.next:
        return None
    
    # Phase 1: Detect cycle using fast & slow
    slow = head
    fast = head
    
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        
        if slow == fast:
            # Cycle detected! Move to Phase 2
            break
    else:
        # No cycle (fast reached end)
        return None
    
    # Phase 2: Find cycle start
    # Reset one pointer to head, keep other at meeting point
    ptr1 = head
    ptr2 = slow  # Meeting point
    
    # Move both at same speed until they meet
    while ptr1 != ptr2:
        ptr1 = ptr1.next
        ptr2 = ptr2.next
    
    return ptr1  # Cycle start


def detect_cycle_verbose(head: ListNode) -> ListNode:
    """Same algorithm with detailed comments."""
    if not head or not head.next:
        return None
    
    slow = fast = head
    has_cycle = False
    
    # Phase 1: Find meeting point
    while fast and fast.next:
        slow = slow.next         # 1 step
        fast = fast.next.next    # 2 steps
        
        if slow == fast:
            has_cycle = True
            break
    
    if not has_cycle:
        return None
    
    # Phase 2: Mathematical magic
    # Distance from head to cycle start = 
    # Distance from meeting point to cycle start (going forward)
    ptr1 = head        # Start at head
    ptr2 = slow        # Start at meeting point
    
    while ptr1 != ptr2:
        ptr1 = ptr1.next
        ptr2 = ptr2.next
    
    return ptr1
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
 * Find the node where cycle begins.
 * Pattern: Floyd's Cycle Detection (Two-phase)
 * Time: O(n), Space: O(1)
 * 
 * @param {ListNode} head
 * @return {ListNode} - Cycle start node or null
 */
function detectCycle(head) {
    if (!head || !head.next) {
        return null;
    }
    
    let slow = head;
    let fast = head;
    
    // Phase 1: Detect cycle
    while (fast && fast.next) {
        slow = slow.next;
        fast = fast.next.next;
        
        if (slow === fast) {
            // Phase 2: Find cycle start
            let ptr1 = head;
            let ptr2 = slow;
            
            while (ptr1 !== ptr2) {
                ptr1 = ptr1.next;
                ptr2 = ptr2.next;
            }
            
            return ptr1;
        }
    }
    
    return null; // No cycle
}
```

### Solution 2: HashSet Approach (Simpler)

**Python:**
```python
def detect_cycle_hashset(head: ListNode) -> ListNode:
    """
    Find cycle start using HashSet.
    Time: O(n), Space: O(n)
    """
    seen = set()
    current = head
    
    while current:
        if current in seen:
            return current  # First repeated node = cycle start
        seen.add(current)
        current = current.next
    
    return None
```

**JavaScript:**
```javascript
function detectCycleHashSet(head) {
    const seen = new Set();
    let current = head;
    
    while (current) {
        if (seen.has(current)) {
            return current;
        }
        seen.add(current);
        current = current.next;
    }
    
    return null;
}
```

### Bonus: Find Cycle Length

**Python:**
```python
def get_cycle_length(head: ListNode) -> int:
    """Find cycle length after detecting cycle."""
    # First, find meeting point
    slow = fast = head
    
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        
        if slow == fast:
            # Count cycle length
            length = 1
            current = slow.next
            while current != slow:
                length += 1
                current = current.next
            return length
    
    return 0  # No cycle
```

---

## ⚡ Complexity Analysis

### Floyd's Algorithm (Optimal)

| Phase | Time | Space | Notes |
|-------|------|-------|-------|
| Phase 1 |" O(n) "| O(1) | Detect meeting point |
| Phase 2 |" O(n) "| O(1) | Find cycle start |
| **Total** |" **O(n)** "| **O(1)** | Two sequential passes |

**Detailed Analysis:**
- Phase 1: At most n + k steps (k = cycle length)
- Phase 2: Exactly F steps (F = distance to cycle)
- Total: O(n) since F + k ≤ n

### HashSet Approach

| Metric | Complexity | Notes |
|--------|------------|-------|
| Time |" O(n) "| Single pass |
| Space |" O(n) "| Stores all visited nodes |

**Trade-off:** HashSet is simpler to implement but uses O(n) extra space.

---

## 🔄 Variations

| Variation | Modification | Use Case |
|-----------|--------------|----------|
| Find cycle length | Count after meeting | Pre-processing |
| Remove cycle | Find node before entry | Fix corrupted list |
| Find distance to cycle | Count in phase 2 | Analysis |
| Array version | Array indices as pointers | LC 287 |

### Remove Cycle

```python
def remove_cycle(head: ListNode) -> None:
    """Remove cycle from linked list in place."""
    if not head or not head.next:
        return
    
    slow = fast = head
    
    # Phase 1: Find meeting point
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow == fast:
            break
    else:
        return  # No cycle
    
    # Phase 2: Find cycle start
    ptr1 = head
    ptr2 = slow
    
    # Special case: cycle starts at head
    if ptr1 == ptr2:
        while ptr2.next != ptr1:
            ptr2 = ptr2.next
    else:
        while ptr1.next != ptr2.next:
            ptr1 = ptr1.next
            ptr2 = ptr2.next
    
    # ptr2.next is now the cycle start, cut the link
    ptr2.next = None
```

---

## ⚠️ Common Mistakes

### 1. Forgetting the No-Cycle Case

```python
# ❌ Wrong - assumes cycle always exists
def detect_cycle(head):
    slow = fast = head
    while True:  # Infinite loop if no cycle!
        slow = slow.next
        fast = fast.next.next
        if slow == fast:
            break
    # Phase 2...

# ✅ Correct - handle no-cycle case
def detect_cycle(head):
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow == fast:
            # Cycle found, proceed to phase 2
            break
    else:
        return None  # No cycle!
```

### 2. Wrong Pointer Reset in Phase 2

```python
# ❌ Wrong - resetting wrong pointer or wrong position
ptr1 = slow  # Should be head!
ptr2 = head  # Should be meeting point!

# ✅ Correct - one at head, one at meeting point
ptr1 = head
ptr2 = slow  # slow is at meeting point
```

### 3. Phase 2 Speed Error

```python
# ❌ Wrong - using different speeds in phase 2
while ptr1 != ptr2:
    ptr1 = ptr1.next
    ptr2 = ptr2.next.next  # Should be 1 step!

# ✅ Correct - both move at same speed
while ptr1 != ptr2:
    ptr1 = ptr1.next
    ptr2 = ptr2.next  # Both 1 step
```

### 4. Missing Edge Cases

```python
# Edge cases to handle:
# 1. Empty list: head = None
# 2. Single node no cycle: head.next = None
# 3. Single node self-loop: head.next = head
# 4. Cycle at head: last node points to head
```

---

## 📝 Practice Problems (Progressive)

### Easy (Build foundation)
- [ ] [Linked List Cycle](https://leetcode.com/problems/linked-list-cycle/) - LC 141 - Phase 1 only

### Medium (This problem level)
- [ ] [Linked List Cycle II](https://leetcode.com/problems/linked-list-cycle-ii/) - LC 142 - This problem!
- [ ] [Happy Number](https://leetcode.com/problems/happy-number/) - LC 202 - Implicit cycle

### Hard (Advanced application)
- [ ] [Find the Duplicate Number](https://leetcode.com/problems/find-the-duplicate-number/) - LC 287 - Same algorithm, array format

<details>
<summary><strong>🧠 Spaced Repetition Schedule</strong></summary>

**For LC 142 (Find Cycle Start):**
- **Day 1:** Redo without looking, focus on the math
- **Day 3:** Explain the proof to someone (or rubber duck)
- **Day 7:** Solve LC 287 (Find Duplicate) using same concept
- **Day 14:** Implement cycle removal variant
- **Day 30:** Review all cycle problems together

**Mastery indicators:**
- [ ] Can derive the mathematical proof
- [ ] Implement both phases without hesitation
- [ ] Handle all edge cases naturally
- [ ] Apply to array problems (LC 287)

</details>

---

## 🎤 Interview Context

<details>
<summary><strong>How to Communicate This in Interviews</strong></summary>

**Opening statement:**
"I'll use Floyd's Tortoise and Hare algorithm in two phases. First, I'll detect if there's a cycle using fast and slow pointers. Then, I'll find the cycle start using a mathematical property."

**Explaining the math (if asked):**
"When fast and slow meet, slow has traveled F + a distance, where F is the distance to cycle start and a is the distance inside the cycle. Fast traveled 2(F + a). The difference is the cycle length times some integer. This means F equals the distance from meeting point to cycle start, so if we start one pointer at head and one at meeting point, moving at the same speed, they'll meet at the cycle start."

**Simplified explanation (if interviewer seems confused):**
"Think of it this way - when they meet inside the cycle, the distance from head to cycle start equals the distance from meeting point to cycle start (going forward in the cycle). So if we walk both distances at the same speed, we'll arrive at the same place."

**Follow-up questions to expect:**
- "Why does phase 2 work?" → Explain the math
- "Can you do this with O(n) space?" → Yes, HashSet, but this is O(1)
- "How would you remove the cycle?" → Find node before entry, set next to null

</details>

**Company Focus:**

| Company | Frequency | Notes |
|---------|-----------|-------|
| Amazon | ⭐⭐⭐⭐⭐ | Common follow-up to LC 141 |
| Meta | ⭐⭐⭐⭐ | Expect to explain the math |
| Google | ⭐⭐⭐⭐ | May ask for formal proof |
| Microsoft | ⭐⭐⭐⭐ | Standard question |

---

## ⏱️ Time Estimates

| Activity | Time | Notes |
|----------|------|-------|
| First solution | 20-25 min | Understanding two phases |
| Optimal solution | 10-15 min | After learning pattern |
| Interview target | 12-15 min | Including explanation |
| With math explanation | 18-22 min | Full proof |

---

> **💡 Key Insight:** The mathematical property F = nC - a is the heart of Floyd's algorithm. It ensures that one pointer starting at head and one at the meeting point, both moving at speed 1, will meet exactly at the cycle start.

---

## 🔗 Related

- [Cycle Detection (LC 141)](./01-Cycle-Detection.md) - Phase 1 only
- [Happy Number (LC 202)](./03-Happy-Number.md) - Cycle in number sequence
- [Fast & Slow Concept](../4.1-Concept.md) - Pattern overview
- [Find Duplicate Number](https://leetcode.com/problems/find-the-duplicate-number/) - Array application
