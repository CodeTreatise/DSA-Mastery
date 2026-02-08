# Hash Map Technique

> **Grokking Pattern #14** | **ROI: ⭐⭐⭐⭐⭐ (Foundation for many patterns)**
>
> 📚 *Trade O(n) space for O(1) lookup - the most versatile tool in your toolkit*

---

> **📌 Note:** This file focuses on **Hash Map as an algorithm technique** - patterns like Two Sum, frequency counting, and complement lookup. For **Hash Map fundamentals** (how hashing works, collision handling, language APIs), see [3.1 Hash Maps](../../03-Hashing/3.1-Hash-Maps.md).

---

## Overview

- [ ] Hash Map technique
  - Frequency counting
  - Two Sum pattern (complement lookup)
  - Index tracking
  - Grouping / Anagram detection
  - Prefix sum + hash map

**Hash Map** (also called hash table, dictionary, or object) provides O(1) average time lookup, insertion, and deletion. It's the go-to technique when you need to quickly check "have I seen this before?" or "how many times have I seen this?"

---

## 🎯 Pattern Recognition

<details>
<summary><strong>How to Identify This Pattern</strong></summary>

**Look for these signals:**
- "Find if there exists..." (existence check)
- "Find **two numbers** that sum to target" (complement lookup)
- "Count **frequency** of elements"
- "Group **anagrams**" (canonical form mapping)
- "Find **first unique** character" (frequency = 1)
- Need O(1) lookup to **avoid nested loops**
- "Return **indices**" (need to store positions)

**Keywords in problem statement:**
- "two sum", "pair with sum"
- "frequency", "count occurrences"
- "anagram", "permutation"
- "duplicate", "unique"
- "first non-repeating"

**Common problem types:**
- Two Sum (unsorted)
- Group Anagrams
- Valid Anagram
- Contains Duplicate
- First Unique Character
- Longest Substring Without Repeating
- Subarray Sum Equals K

</details>

---

## ✅ When to Use

- **O(1) lookup needed** - replace O(n) search with O(1)
- **Counting frequency** - track how many times each element appears
- **Finding complement** - "does target - current exist?"
- **Grouping by property** - same hash → same group
- **Tracking indices** - when problem asks "return the indices"
- **Avoiding duplicates** - use set (hash set) for O(1) contains

## ❌ When NOT to Use

### 🔀 Decision Flowchart

```mermaid
flowchart TD
    A["Need O(1) lookup?"] --> B{Data sorted?}
    B -->|Yes| C{Need O(1) space?}
    C -->|Yes| D[✅ Two Pointers]
    C -->|No| E[Hash Map or Two Pointers]
    B -->|No| F{Need to preserve order?}
    F -->|Yes| G[✅ Hash Map]
    F -->|No, need sorted output| H[TreeMap / Sort after]
    
    style D fill:#90EE90
    style G fill:#87CEEB
```

| Situation | Why | Use Instead |
|-----------|-----|-------------|
| Already sorted data |" Two pointers is O(1) space "| Two Pointers |
| Need ordered traversal | Hash map has no order | TreeMap / Sorted structure |
| Limited memory |" O(n) space overhead "| In-place techniques |
| Small fixed alphabet | Array is faster | Fixed-size array |
|" Worst case must be O(1) "| Hash collision can be O(n) | Balanced BST |

---

## 🔗 Concept Map

<details>
<summary><strong>Prerequisites & Next Steps</strong></summary>

**Before this, you should know:**
- [Array Basics](../1.1-Array-Basics.md) - iteration
- [Hash function concept](../../09-Hashing.md) - why O(1)

**After mastering this:**
- [Prefix Sum + Hash Map](./03-Prefix-Sum.md) - subarray sum equals k
- [Sliding Window + Hash Map](./02-Sliding-Window.md) - character tracking
- [LRU Cache](../../09-Hashing.md) - hash map + doubly linked list

**Combines with:**
- **Prefix Sum** - count subarrays with sum k
- **Sliding Window** - track window contents
- **Two Pointers** - when space is constrained

</details>

---

## 📐 How It Works

### Core Operations

| Operation | Time (Avg) | Time (Worst) | Notes |
|-----------|------------|--------------|-------|
| Insert |" O(1) "| O(n) | Worst case: all collisions |
| Lookup |" O(1) "| O(n) |" Amortized O(1) in practice "|
| Delete |" O(1) "| O(n) | Same as lookup |

### Common Patterns

#### 1. Frequency Counting
```
Array: [1, 2, 2, 3, 1, 1, 4]

Build frequency map:
{
  1: 3,  ← appears 3 times
  2: 2,
  3: 1,
  4: 1
}

Query: How many 1s? → map[1] = 3 in O(1)
```

#### 2. Complement Lookup (Two Sum)
```
Array: [2, 7, 11, 15]  Target: 9

For each num, look for (target - num):
- num=2: look for 7. Not in map. Store 2→index 0.
- num=7: look for 2. Found at index 0! Return [0, 1]

Map: {2: 0, 7: 1, ...}
```

#### 3. Grouping by Canonical Form (Anagrams)
```
Words: ["eat", "tea", "tan", "ate", "nat", "bat"]

Canonical form = sorted characters:
- "eat" → "aet"
- "tea" → "aet"
- "tan" → "ant"
- "ate" → "aet"

Group by canonical:
{
  "aet": ["eat", "tea", "ate"],
  "ant": ["tan", "nat"],
  "abt": ["bat"]
}
```

---

## 💻 Code Implementation

### Two Sum (Classic)

**Python:**
```python
def two_sum(nums: list[int], target: int) -> list[int]:
    """
    Find indices of two numbers that add up to target.
    
    Pattern: Hash Map (complement lookup)
    Time: O(n), Space: O(n)
    
    Key insight: For each num, check if (target - num) exists.
    """
    num_to_index = {}  # value → index
    
    for i, num in enumerate(nums):
        complement = target - num
        
        if complement in num_to_index:
            return [num_to_index[complement], i]
        
        num_to_index[num] = i
    
    return []  # No solution found


# Example usage
nums = [2, 7, 11, 15]
print(two_sum(nums, 9))   # [0, 1] (2 + 7 = 9)
print(two_sum(nums, 22))  # [1, 3] (7 + 15 = 22)
```

**JavaScript:**
```javascript
/**
 * Find indices of two numbers that add up to target.
 * Pattern: Hash Map (complement lookup)
 * Time: O(n), Space: O(n)
 */
function twoSum(nums, target) {
    const numToIndex = new Map();
    
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        
        if (numToIndex.has(complement)) {
            return [numToIndex.get(complement), i];
        }
        
        numToIndex.set(nums[i], i);
    }
    
    return [];
}

// Example usage
console.log(twoSum([2, 7, 11, 15], 9));   // [0, 1]
console.log(twoSum([2, 7, 11, 15], 22));  // [1, 3]
```

---

### Frequency Counting

**Python:**
```python
from collections import Counter

def top_k_frequent(nums: list[int], k: int) -> list[int]:
    """
    Find the k most frequent elements.
    
    Pattern: Frequency counting with hash map
    Time: O(n log k) with heap, O(n) with bucket sort
    """
    # Count frequencies
    freq = Counter(nums)  # or use defaultdict(int)
    
    # Get top k (simple approach)
    # For optimal, use heap or bucket sort
    sorted_items = sorted(freq.items(), key=lambda x: -x[1])
    
    return [item[0] for item in sorted_items[:k]]


# Example usage
nums = [1, 1, 1, 2, 2, 3]
print(top_k_frequent(nums, 2))  # [1, 2]


def first_unique_char(s: str) -> int:
    """
    Find index of first non-repeating character.
    
    Time: O(n), Space: O(1) - at most 26 letters
    """
    freq = Counter(s)
    
    for i, char in enumerate(s):
        if freq[char] == 1:
            return i
    
    return -1


# Example usage
print(first_unique_char("leetcode"))     # 0 ('l')
print(first_unique_char("loveleetcode")) # 2 ('v')
```

**JavaScript:**
```javascript
/**
 * Find the k most frequent elements.
 */
function topKFrequent(nums, k) {
    const freq = new Map();
    
    // Count frequencies
    for (const num of nums) {
        freq.set(num, (freq.get(num) || 0) + 1);
    }
    
    // Sort by frequency and take top k
    return [...freq.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, k)
        .map(entry => entry[0]);
}

/**
 * Find index of first non-repeating character.
 */
function firstUniqueChar(s) {
    const freq = new Map();
    
    for (const char of s) {
        freq.set(char, (freq.get(char) || 0) + 1);
    }
    
    for (let i = 0; i < s.length; i++) {
        if (freq.get(s[i]) === 1) {
            return i;
        }
    }
    
    return -1;
}
```

---

### Group Anagrams

**Python:**
```python
from collections import defaultdict

def group_anagrams(strs: list[str]) -> list[list[str]]:
    """
    Group strings that are anagrams of each other.
    
    Pattern: Hash map with canonical form as key
    Time: O(n * k log k) where k = max string length
          O(n * k) with counting sort key
    Space: O(n * k)
    """
    groups = defaultdict(list)
    
    for s in strs:
        # Canonical form: sorted characters
        key = tuple(sorted(s))  # Must be hashable (tuple, not list)
        groups[key].append(s)
    
    return list(groups.values())


def group_anagrams_optimal(strs: list[str]) -> list[list[str]]:
    """
    Optimal version using character count as key.
    
    Time: O(n * k) - no sorting needed
    """
    groups = defaultdict(list)
    
    for s in strs:
        # Count characters (26 letters)
        count = [0] * 26
        for char in s:
            count[ord(char) - ord('a')] += 1
        
        # Use tuple of counts as key
        key = tuple(count)
        groups[key].append(s)
    
    return list(groups.values())


# Example usage
strs = ["eat", "tea", "tan", "ate", "nat", "bat"]
print(group_anagrams(strs))
# [['eat', 'tea', 'ate'], ['tan', 'nat'], ['bat']]
```

**JavaScript:**
```javascript
/**
 * Group strings that are anagrams of each other.
 */
function groupAnagrams(strs) {
    const groups = new Map();
    
    for (const s of strs) {
        // Canonical form: sorted characters
        const key = s.split('').sort().join('');
        
        if (!groups.has(key)) {
            groups.set(key, []);
        }
        groups.get(key).push(s);
    }
    
    return [...groups.values()];
}

/**
 * Optimal version using character count as key.
 */
function groupAnagramsOptimal(strs) {
    const groups = new Map();
    
    for (const s of strs) {
        // Count characters
        const count = new Array(26).fill(0);
        for (const char of s) {
            count[char.charCodeAt(0) - 'a'.charCodeAt(0)]++;
        }
        
        const key = count.join('#');  // Make string key
        
        if (!groups.has(key)) {
            groups.set(key, []);
        }
        groups.get(key).push(s);
    }
    
    return [...groups.values()];
}
```

---

### Contains Duplicate Variants

**Python:**
```python
def contains_duplicate(nums: list[int]) -> bool:
    """Check if any value appears at least twice."""
    seen = set()  # Hash set for O(1) lookup
    
    for num in nums:
        if num in seen:
            return True
        seen.add(num)
    
    return False


def contains_nearby_duplicate(nums: list[int], k: int) -> bool:
    """
    Check if nums[i] == nums[j] and abs(i - j) <= k.
    
    Pattern: Hash map with sliding window of size k
    """
    window = set()  # Track last k elements
    
    for i, num in enumerate(nums):
        if num in window:
            return True
        
        window.add(num)
        
        # Maintain window size k
        if len(window) > k:
            window.remove(nums[i - k])
    
    return False


# Example usage
print(contains_duplicate([1, 2, 3, 1]))        # True
print(contains_nearby_duplicate([1, 2, 3, 1], 3))  # True (indices 0 and 3)
print(contains_nearby_duplicate([1, 2, 3, 1], 2))  # False (distance is 3)
```

---

### Valid Anagram

**Python:**
```python
from collections import Counter

def is_anagram(s: str, t: str) -> bool:
    """
    Check if t is an anagram of s.
    
    Time: O(n), Space: O(1) - at most 26 letters
    """
    if len(s) != len(t):
        return False
    
    return Counter(s) == Counter(t)


def is_anagram_optimal(s: str, t: str) -> bool:
    """
    Optimal: Single pass with character counting.
    """
    if len(s) != len(t):
        return False
    
    count = [0] * 26
    
    for i in range(len(s)):
        count[ord(s[i]) - ord('a')] += 1
        count[ord(t[i]) - ord('a')] -= 1
    
    return all(c == 0 for c in count)


# Example usage
print(is_anagram("anagram", "nagaram"))  # True
print(is_anagram("rat", "car"))          # False
```

---

## ⚡ Complexity Analysis

### Time Complexity

| Pattern | Time | Notes |
|---------|------|-------|
| Two Sum |" O(n) "| One pass, O(1) per lookup |
| Frequency Count |" O(n) "| One pass to count |
| Group Anagrams |" O(n * k log k) or O(n * k) "| Depends on key generation |
| Contains Duplicate |" O(n) "| One pass |
| First Unique |" O(n) "| Two passes |

### Space Complexity

| Pattern | Space | Notes |
|---------|-------|-------|
| Two Sum |" O(n) "| Store all elements |
| Frequency Count |" O(n) or O(k) "| k = unique elements |
| Group Anagrams |" O(n * k) "| Store all strings |
| Contains Duplicate |" O(n) "| Worst: all unique |
| Fixed alphabet |" O(1) "| Array of 26 or 256 |

### Hash Map vs Alternatives

| Approach | Time | Space | When to Use |
|----------|------|-------|-------------|
| Brute force |" O(n²) "| O(1) | Never (too slow) |
| **Hash Map** |" O(n) "| O(n) | Default choice |
| Sorting |" O(n log n) "| O(1) | When space matters |
| Two Pointers |" O(n) "| O(1) | Already sorted |
| Fixed Array |" O(n) "| O(1) | Small fixed alphabet |

---

## 🔄 Variations

| Variation | Key Type | Use Case |
|-----------|----------|----------|
| **Value → Index** | element | Two Sum, find position |
| **Value → Count** | element | Frequency counting |
| **Canonical → List** | sorted/counted | Group anagrams |
| **Value → Boolean** | element | Contains duplicate (set) |
| **Prefix Sum → Count** | running sum | Subarray sum equals k |
| **Difference → Count** | pairs | Count pairs with diff k |

### Subarray Sum Equals K (Prefix + Hash Map)

```python
def subarray_sum(nums: list[int], k: int) -> int:
    """
    Count subarrays with sum equal to k.
    
    Key insight: If prefix[j] - prefix[i] = k,
    subarray from i+1 to j has sum k.
    """
    count = 0
    prefix_sum = 0
    prefix_count = {0: 1}  # Empty prefix
    
    for num in nums:
        prefix_sum += num
        
        # How many times have we seen (prefix_sum - k)?
        count += prefix_count.get(prefix_sum - k, 0)
        
        # Record this prefix sum
        prefix_count[prefix_sum] = prefix_count.get(prefix_sum, 0) + 1
    
    return count
```

---

## ⚠️ Common Mistakes

### 1. **Modifying map while iterating**
```python
# ❌ WRONG: Modifying during iteration
for key in my_map:
    if condition:
        del my_map[key]  # RuntimeError!

# ✅ CORRECT: Create list of keys or use copy
for key in list(my_map.keys()):
    if condition:
        del my_map[key]
```

### 2. **Using list as dictionary key**
```python
# ❌ WRONG: Lists are not hashable
key = [1, 2, 3]
my_map[key] = "value"  # TypeError!

# ✅ CORRECT: Use tuple instead
key = tuple([1, 2, 3])
my_map[key] = "value"  # Works!
```

### 3. **Forgetting to handle missing keys**
```python
# ❌ WRONG: KeyError if not found
count = my_map[key] + 1

# ✅ CORRECT: Use get() or defaultdict
count = my_map.get(key, 0) + 1
# or
from collections import defaultdict
my_map = defaultdict(int)
```

### 4. **Storing index after value in Two Sum**
```python
# ❌ WRONG: Store first, check later
for i, num in enumerate(nums):
    num_to_index[num] = i
    if complement in num_to_index:  # Might find same element!
        ...

# ✅ CORRECT: Check first, store later
for i, num in enumerate(nums):
    if complement in num_to_index:
        return [num_to_index[complement], i]
    num_to_index[num] = i  # Store AFTER checking
```

### 5. **Not considering hash collisions in interviews**
```python
# When asked about worst case:
# "Hash map is O(1) average, but O(n) worst case due to collisions.
#  In practice, with a good hash function, collisions are rare."
```

---

## 📝 Practice Problems (Progressive)

### Easy (Learn the pattern)
- [ ] [Two Sum](https://leetcode.com/problems/two-sum/) - The classic complement lookup
- [ ] [Valid Anagram](https://leetcode.com/problems/valid-anagram/) - Frequency matching
- [ ] [Contains Duplicate](https://leetcode.com/problems/contains-duplicate/) - Hash set
- [ ] [First Unique Character](https://leetcode.com/problems/first-unique-character-in-a-string/) - Frequency = 1
- [ ] [Ransom Note](https://leetcode.com/problems/ransom-note/) - Character availability

### Medium (Apply variations)
- [ ] [Group Anagrams](https://leetcode.com/problems/group-anagrams/) - Canonical form grouping
- [ ] [Top K Frequent Elements](https://leetcode.com/problems/top-k-frequent-elements/) - Frequency + sorting/heap
- [ ] [Subarray Sum Equals K](https://leetcode.com/problems/subarray-sum-equals-k/) - Prefix sum + hash map
- [ ] [Longest Consecutive Sequence](https://leetcode.com/problems/longest-consecutive-sequence/) - O(n) with hash set
- [ ] [Contains Duplicate II](https://leetcode.com/problems/contains-duplicate-ii/) - Sliding window + hash set
- [ ] [4Sum II](https://leetcode.com/problems/4sum-ii/) - Two-pair counting

### Hard (Master edge cases)
- [ ] [Minimum Window Substring](https://leetcode.com/problems/minimum-window-substring/) - Sliding window + frequency
- [ ] [Longest Substring with At Most K Distinct](https://leetcode.com/problems/longest-substring-with-at-most-k-distinct-characters/) - Window + hash map

<details>
<summary><strong>🧠 Spaced Repetition Schedule</strong></summary>

| Day | Activity |
|-----|----------|
| **Day 1** | Solve Two Sum without looking |
| **Day 3** | Solve Valid Anagram, Group Anagrams |
| **Day 7** | Solve Subarray Sum Equals K |
| **Day 14** | Explain when to use hash map vs two pointers |
| **Day 30** | Solve Longest Consecutive Sequence cold |

**Pattern mastery checklist:**
- [ ] Can identify complement lookup problems instantly
- [ ] Know when to use hash map vs hash set
- [ ] Can use defaultdict and Counter fluently
- [ ] Understand frequency counting applications
- [ ] Know canonical form grouping technique
- [ ] Can combine hash map with prefix sum

</details>

---

## 🎤 Interview Context

<details>
<summary><strong>How to Communicate This in Interviews</strong></summary>

### Explain the Trade-off

> "I'll use a hash map to trade O(n) space for O(1) lookup time. This reduces time complexity from O(n²) to O(n)."

### For Two Sum

> "For each number, I check if its complement (target - num) exists in my hash map. If yes, I found the pair. If no, I store the current number. This way, I only need one pass."

### For Frequency Problems

> "I'll count the frequency of each element first, then query based on the problem requirements. For anagrams, two strings are anagrams if they have the same character frequencies."

### Handle Follow-ups

| Question | Response |
|----------|----------|
| "What's the space complexity?" |" "O(n) in the worst case when all elements are unique." "|
| "What about hash collisions?" |" "Average O(1), worst O(n). Modern hash maps handle this well." "|
|" "Can you do it in O(1) space?" "| "If the array is sorted, I can use two pointers. Or if there's a fixed small alphabet, I can use a fixed-size array." |

</details>

### Company Focus

| Company | Frequency | Common Problems |
|---------|-----------|-----------------|
| **Amazon** | ⭐⭐⭐ High | Two Sum, Group Anagrams |
| **Meta** | ⭐⭐⭐ High | Frequency counting, Subarray Sum |
| **Google** | ⭐⭐⭐ High | Combined with other techniques |
| **Microsoft** | ⭐⭐⭐ High | Two Sum, Contains Duplicate |
| **All Companies** | ⭐⭐⭐ | Fundamental technique |

---

## ⏱️ Time Estimates

| Activity | Time | Notes |
|----------|------|-------|
| Learn hash map basics | 15-20 min | If new to concept |
| Solve Two Sum | 10-15 min | Should be quick |
| Solve Valid Anagram | 10-15 min | Frequency matching |
| Solve Group Anagrams | 20-25 min | Canonical form |
| Learn prefix + hash map | 30-40 min | Trickier combination |
| Master pattern | 3-4 hours | 8-10 problems |

**Interview timing:**
- Two Sum: **5-10 minutes** (must be very fast)
- Frequency problems: **10-15 minutes**
- Subarray Sum Equals K: **20-25 minutes**
- Complex combinations: **25-35 minutes**

---

> **💡 Key Insight:** Hash map is the ultimate "have I seen this before?" tool. It transforms O(n) searches into O(1) lookups. The key to using it effectively is identifying what to store: sometimes it's value → index, sometimes value → count, sometimes canonical_form → group. Ask yourself: "What do I need to look up quickly?"

> **🔗 Related:** [Two Pointers](./01-Two-Pointers.md) | [Prefix Sum](./03-Prefix-Sum.md) | [Sliding Window](./02-Sliding-Window.md)

---

**Previous:** [04 Kadane's Algorithm](./04-Kadanes-Algorithm.md)
**Next:** [1.5 Array Sorting](../1.5-Array-Sorting.md)
