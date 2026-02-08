# Partition Labels (LeetCode 763)

> **Pattern:** Greedy with Last Occurrence
> **Difficulty:** Medium
> **Company Focus:** Amazon, Meta, Google

---

## 📋 Problem Statement

You are given a string `s`. We want to partition the string into as many parts as possible so that each letter appears in at most one part.

Return a list of integers representing the size of these parts.

### Examples

```
Input: s = "ababcbacadefegdehijhklij"
Output: [9,7,8]
Explanation: 
- "ababcbaca" - all a,b,c appear only here
- "defegde" - all d,e,f,g appear only here
- "hijhklij" - all h,i,j,k,l appear only here

Input: s = "eccbbbbdec"
Output: [10]
Explanation: All letters overlap, can't partition
```

### Constraints

- `1 <= s.length <= 500`
- `s` consists of lowercase English letters

---

## 🎯 Pattern Recognition

**Signals:**
- "Each letter in at most one part" → track last occurrence
- "As many parts as possible" → greedy partitioning
- String partitioning → expand/shrink window logic

**Key insight:** A partition must extend to include the last occurrence of every character within it.

---

## 🧠 Intuition

### The Greedy Choice

1. For each character, we know its last occurrence
2. Start a partition at index 0
3. The partition must extend at least to the last occurrence of s[0]
4. As we scan, if any character's last occurrence is further, extend
5. When we reach the current partition end, we found a valid partition

### Visual

```
s = "ababcbacadefegdehijhklij"
     012345678901234567890123

Last occurrences:
a: 8, b: 5, c: 7, d: 14, e: 15, f: 11, g: 13, h: 19, i: 22, j: 23, k: 20, l: 21

Partition 1:
i=0, char='a', last[a]=8 → must go to 8
i=1, char='b', last[b]=5 → already within 8
i=2, char='a', last[a]=8 → already within 8
...
i=8 = end → partition ends! Size = 9

Partition 2:
i=9, char='d', last[d]=14 → must go to 14
i=10, char='e', last[e]=15 → extend to 15!
...
i=15 = end → partition ends! Size = 7

Partition 3: Remaining = 8
```

---

## 💻 Solution

```python
def partitionLabels(s: str) -> list[int]:
    """
    LeetCode 763: Partition Labels
    
    Greedy: Extend partition to last occurrence of each char.
    
    Time: O(n), Space: O(1) - 26 letters
    """
    # Step 1: Record last occurrence of each character
    last = {}
    for i, c in enumerate(s):
        last[c] = i
    
    result = []
    start = 0
    end = 0
    
    # Step 2: Greedily expand partition
    for i, c in enumerate(s):
        end = max(end, last[c])  # Extend if needed
        
        if i == end:
            # Reached partition boundary
            result.append(end - start + 1)
            start = i + 1
    
    return result
```

```javascript
function partitionLabels(s) {
    // Record last occurrence
    const last = {};
    for (let i = 0; i < s.length; i++) {
        last[s[i]] = i;
    }
    
    const result = [];
    let start = 0, end = 0;
    
    for (let i = 0; i < s.length; i++) {
        end = Math.max(end, last[s[i]]);
        
        if (i === end) {
            result.push(end - start + 1);
            start = i + 1;
        }
    }
    
    return result;
}
```

---

## 📐 Step-by-Step Trace

```
s = "ababcbacadefegdehijhklij"

Last occurrences:
{a:8, b:5, c:7, d:14, e:15, f:11, g:13, h:19, i:22, j:23, k:20, l:21}

i=0: c='a', end=max(0,8)=8
i=1: c='b', end=max(8,5)=8
i=2: c='a', end=max(8,8)=8
i=3: c='b', end=max(8,5)=8
i=4: c='c', end=max(8,7)=8
i=5: c='b', end=max(8,5)=8
i=6: c='a', end=max(8,8)=8
i=7: c='c', end=max(8,7)=8
i=8: c='a', end=max(8,8)=8 → i==end! Add 8-0+1=9, start=9

i=9:  c='d', end=max(0,14)=14
i=10: c='e', end=max(14,15)=15
i=11: c='f', end=max(15,11)=15
i=12: c='e', end=max(15,15)=15
i=13: c='g', end=max(15,13)=15
i=14: c='d', end=max(15,14)=15
i=15: c='e', end=max(15,15)=15 → i==end! Add 15-9+1=7, start=16

i=16: c='h', end=max(0,19)=19
i=17: c='i', end=max(19,22)=22
i=18: c='j', end=max(22,23)=23
i=19: c='h', end=max(23,19)=23
i=20: c='k', end=max(23,20)=23
i=21: c='l', end=max(23,21)=23
i=22: c='i', end=max(23,22)=23
i=23: c='j', end=max(23,23)=23 → i==end! Add 23-16+1=8

Result: [9, 7, 8]
```

---

## ⚡ Complexity Analysis

| Metric | Value | Explanation |
|--------|-------|-------------|
| Time | O(n) | Two passes: build last + scan |
| Space | O(1) | At most 26 characters |

---

## 🔄 Alternative: Interval Merge View

This problem can also be viewed as interval merging:

```python
def partitionLabels_intervals(s: str) -> list[int]:
    """View each character as an interval [first, last]."""
    first = {}
    last = {}
    
    for i, c in enumerate(s):
        if c not in first:
            first[c] = i
        last[c] = i
    
    # Create intervals and merge
    intervals = [[first[c], last[c]] for c in first]
    intervals.sort()
    
    merged = [intervals[0]]
    for start, end in intervals[1:]:
        if start <= merged[-1][1]:
            merged[-1][1] = max(merged[-1][1], end)
        else:
            merged.append([start, end])
    
    return [end - start + 1 for start, end in merged]
```

Same result, different perspective!

---

## ⚠️ Common Mistakes

### 1. Forgetting to Track Start

```python
# ❌ Wrong: Only tracking end
if i == end:
    result.append(end + 1)  # Wrong size!

# ✅ Correct: Track both start and end
result.append(end - start + 1)
start = i + 1
```

### 2. Not Extending End

```python
# ❌ Wrong: Just using current char's last
end = last[c]  # Might shrink end!

# ✅ Correct: Take maximum
end = max(end, last[c])
```

---

## 🔗 Related Problems

| Problem | Similarity | Link |
|---------|------------|------|
| Merge Intervals | Overlapping partitions | [LC 56](https://leetcode.com/problems/merge-intervals/) |
| Minimum Arrows | Greedy partitioning | [LC 452](https://leetcode.com/problems/minimum-number-of-arrows-to-burst-balloons/) |
| Optimal Partition of String | Min partitions | [LC 2405](https://leetcode.com/problems/optimal-partition-of-string/) |

---

## 🎤 Interview Tips

<details>
<summary><strong>How to Communicate</strong></summary>

**Opening:**
"Each character must be entirely within one partition. So I need to track where each character last appears and ensure my partition extends that far."

**Key insight:**
"As I scan, I continuously extend the partition end to cover all characters I've seen. When I reach that end, I've found a valid partition."

**Why greedy works:**
"Making the partition as small as possible at each step (ending exactly at the required point) maximizes the number of partitions."

</details>

---

## ⏱️ Time Estimates

| Activity | Time |
|----------|------|
| Understand | 2 min |
| Identify greedy | 2-3 min |
| Code | 5 min |
| Trace example | 2 min |
| **Total** | **11-14 min** |

---

> **💡 Key Insight:** Track last occurrences first, then greedily expand. When current index equals the partition end, you've found a boundary.

> **🔗 Related:** [Sorting Tricks](../06-Greedy-Techniques/8.3-Sorting-Tricks.md)
