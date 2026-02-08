# LC 127: Word Ladder

> **The classic BFS state transformation problem**
>
> ⏱️ **Interview Time:** 25-30 min | 📊 **Difficulty:** Hard | 🎯 **Frequency:** Very High (Amazon, Meta, Google)

---

## Problem Statement

Given two words, `beginWord` and `endWord`, and a dictionary `wordList`, return the **length of the shortest transformation sequence** from `beginWord` to `endWord`, such that:

1. Only one letter can be changed at a time
2. Each transformed word must exist in the word list

Return `0` if there is no such transformation sequence.

```
Example 1:
beginWord = "hit"
endWord = "cog"
wordList = ["hot","dot","dog","lot","log","cog"]

Output: 5

Transformation: hit → hot → dot → dog → cog
                 ↑     ↑     ↑     ↑
              change change change change
                i→o   h→d   o→o   d→c

Length = 5 (counting beginWord)

Example 2:
beginWord = "hit"
endWord = "cog"
wordList = ["hot","dot","dog","lot","log"]

Output: 0 (endWord "cog" not in wordList)
```

---

## 🎯 Pattern Recognition

<details>
<summary><strong>Why This is BFS (State Transformation)</strong></summary>

**Signals:**
1. "Shortest transformation sequence" → BFS finds shortest path
2. One change at a time → each valid transformation is an "edge"
3. Dictionary of valid states → defines the "graph"

**Key insight:**
Each word is a "state". Transforming one letter is moving to a "neighbor state". We're finding the shortest path from beginWord to endWord in this implicit graph!

```
Graph visualization:
          hit
           │
          hot ─── lot
         ╱           ╲
       dot           log
         ╲           ╱
          dog ─── cog

Edges = words differing by 1 letter
BFS finds shortest path: hit → hot → dot → dog → cog (5 nodes)
```

</details>

---

## 📐 Algorithm Approaches

### Approach 1: Basic BFS with Neighbor Generation

For each word, try changing each position to every letter a-z.

**Time:** O(M² × N) where M = word length, N = wordList size

### Approach 2: BFS with Pattern Mapping (Optimized)

Pre-process: Create pattern → words mapping.
`"hot" → ["*ot", "h*t", "ho*"]`

**Time:** O(M² × N) preprocessing, O(M × N) BFS

### Approach 3: Bidirectional BFS (Advanced)

BFS from both ends, meet in the middle.

**Time:** O(M × N) - faster in practice for large state spaces

---

## 💻 Solution: Approach 1 (Basic BFS)

**Python:**
```python
from collections import deque
from typing import List

def ladderLength(beginWord: str, endWord: str, wordList: List[str]) -> int:
    """
    BFS to find shortest transformation path.
    
    Key: Generate all possible neighbors by changing one letter
    
    Time: O(M² × N) where M = word length, N = number of words
    Space: O(M × N)
    """
    # ═══════════════════════════════════════════════════════════
    # Edge case: endWord must be in dictionary
    # ═══════════════════════════════════════════════════════════
    word_set = set(wordList)
    if endWord not in word_set:
        return 0
    
    # ═══════════════════════════════════════════════════════════
    # BFS Setup
    # ═══════════════════════════════════════════════════════════
    queue = deque([(beginWord, 1)])  # (word, path_length)
    visited = {beginWord}
    
    def get_neighbors(word):
        """Generate all valid one-letter transformations."""
        neighbors = []
        for i in range(len(word)):
            for c in 'abcdefghijklmnopqrstuvwxyz':
                if c != word[i]:
                    new_word = word[:i] + c + word[i+1:]
                    if new_word in word_set:
                        neighbors.append(new_word)
        return neighbors
    
    # ═══════════════════════════════════════════════════════════
    # BFS Loop
    # ═══════════════════════════════════════════════════════════
    while queue:
        word, length = queue.popleft()
        
        for neighbor in get_neighbors(word):
            if neighbor == endWord:
                return length + 1
            
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append((neighbor, length + 1))
    
    return 0  # No path found


# Test
print(ladderLength("hit", "cog", ["hot","dot","dog","lot","log","cog"]))  # 5
print(ladderLength("hit", "cog", ["hot","dot","dog","lot","log"]))  # 0
```

---

## 💻 Solution: Approach 2 (Pattern Mapping - Optimized)

**Python:**
```python
from collections import deque, defaultdict
from typing import List

def ladderLength_optimized(beginWord: str, endWord: str, wordList: List[str]) -> int:
    """
    Optimized BFS using pattern matching.
    
    Key insight: Words sharing pattern like "h*t" are neighbors.
    Pre-compute pattern → words mapping for O(1) neighbor lookup.
    
    Time: O(M² × N) total, but faster neighbor lookup
    Space: O(M² × N) for pattern mapping
    """
    if endWord not in wordList:
        return 0
    
    # ═══════════════════════════════════════════════════════════
    # Preprocessing: Build pattern → words mapping
    # ═══════════════════════════════════════════════════════════
    # "hot" → ["*ot", "h*t", "ho*"]
    # pattern_map["*ot"] = ["hot", "dot", "lot", ...]
    
    pattern_map = defaultdict(list)
    word_len = len(beginWord)
    
    for word in wordList:
        for i in range(word_len):
            pattern = word[:i] + '*' + word[i+1:]
            pattern_map[pattern].append(word)
    
    # ═══════════════════════════════════════════════════════════
    # BFS using patterns to find neighbors
    # ═══════════════════════════════════════════════════════════
    queue = deque([(beginWord, 1)])
    visited = {beginWord}
    
    while queue:
        word, length = queue.popleft()
        
        # Check all patterns of current word
        for i in range(word_len):
            pattern = word[:i] + '*' + word[i+1:]
            
            # All words with this pattern are neighbors
            for neighbor in pattern_map[pattern]:
                if neighbor == endWord:
                    return length + 1
                
                if neighbor not in visited:
                    visited.add(neighbor)
                    queue.append((neighbor, length + 1))
    
    return 0


# Test
print(ladderLength_optimized("hit", "cog", ["hot","dot","dog","lot","log","cog"]))  # 5
```

---

## 💻 Solution: Approach 3 (Bidirectional BFS - Advanced)

**Python:**
```python
from collections import deque, defaultdict
from typing import List

def ladderLength_bidirectional(beginWord: str, endWord: str, wordList: List[str]) -> int:
    """
    Bidirectional BFS: search from both ends simultaneously.
    
    Key insight: If shortest path is length L, regular BFS explores O(b^L) states.
    Bidirectional explores O(2 × b^(L/2)) = O(b^(L/2)) - much smaller!
    
    Time: O(M² × N) worst case, but often much faster
    Space: O(M × N)
    """
    if endWord not in wordList:
        return 0
    
    # Include beginWord in wordList for uniform processing
    word_set = set(wordList)
    word_set.add(beginWord)
    
    word_len = len(beginWord)
    
    def get_neighbors(word):
        """Get all valid neighbors of a word."""
        neighbors = []
        for i in range(word_len):
            for c in 'abcdefghijklmnopqrstuvwxyz':
                if c != word[i]:
                    new_word = word[:i] + c + word[i+1:]
                    if new_word in word_set:
                        neighbors.append(new_word)
        return neighbors
    
    # ═══════════════════════════════════════════════════════════
    # Two frontiers: from begin and from end
    # ═══════════════════════════════════════════════════════════
    front_begin = {beginWord}
    front_end = {endWord}
    visited = {beginWord, endWord}
    length = 1
    
    while front_begin and front_end:
        # Always expand the smaller frontier (optimization)
        if len(front_begin) > len(front_end):
            front_begin, front_end = front_end, front_begin
        
        next_front = set()
        
        for word in front_begin:
            for neighbor in get_neighbors(word):
                # Frontiers meet!
                if neighbor in front_end:
                    return length + 1
                
                if neighbor not in visited:
                    visited.add(neighbor)
                    next_front.add(neighbor)
        
        front_begin = next_front
        length += 1
    
    return 0


# Test
print(ladderLength_bidirectional("hit", "cog", ["hot","dot","dog","lot","log","cog"]))  # 5
```

**JavaScript:**
```javascript
function ladderLength(beginWord, endWord, wordList) {
    const wordSet = new Set(wordList);
    if (!wordSet.has(endWord)) return 0;
    
    const queue = [[beginWord, 1]];
    const visited = new Set([beginWord]);
    
    function getNeighbors(word) {
        const neighbors = [];
        for (let i = 0; i < word.length; i++) {
            for (let c = 97; c <= 122; c++) {  // a-z
                const char = String.fromCharCode(c);
                if (char !== word[i]) {
                    const newWord = word.slice(0, i) + char + word.slice(i + 1);
                    if (wordSet.has(newWord)) {
                        neighbors.push(newWord);
                    }
                }
            }
        }
        return neighbors;
    }
    
    while (queue.length > 0) {
        const [word, length] = queue.shift();
        
        for (const neighbor of getNeighbors(word)) {
            if (neighbor === endWord) {
                return length + 1;
            }
            
            if (!visited.has(neighbor)) {
                visited.add(neighbor);
                queue.push([neighbor, length + 1]);
            }
        }
    }
    
    return 0;
}

// Test
console.log(ladderLength("hit", "cog", ["hot","dot","dog","lot","log","cog"])); // 5
```

---

## ⚡ Complexity Analysis

| Approach | Time | Space | Best For |
|----------|------|-------|----------|
| Basic BFS | O(M² × N) | O(M × N) | Simple implementation |
| Pattern Mapping | O(M² × N) | O(M² × N) | Faster neighbor lookup |
| Bidirectional | O(M² × N) | O(M × N) | Large state spaces |

**Where M = word length, N = wordList size**

### Detailed Breakdown

```
Basic BFS:
- For each word in queue: O(queue size) iterations
- Generate neighbors: O(M × 26) = O(M) per word
- Check if in word_set: O(M) for string hashing
- Total: O(M² × N)

Pattern Mapping:
- Preprocessing: O(M × N) patterns, O(M) per pattern = O(M² × N)
- BFS: O(M × N) - faster neighbor access
- Overall: O(M² × N), but faster in practice

Bidirectional:
- Explores √N states instead of N in best case
- Still O(M² × N) worst case, but often much faster
```

---

## 🔄 Variations

| Variation | Difference | Problem |
|-----------|------------|---------|
| Find actual path | Track parent, reconstruct | Word Ladder II |
| Multiple end words | Any of several targets | Custom |
| Different transition rules | Not just one letter | Custom |
| Minimum "cost" path | Weighted edges | Dijkstra variant |

---

## ⚠️ Common Mistakes

### 1. Not Checking endWord in wordList

```python
# ❌ Wrong: BFS runs but endWord unreachable
def ladderLength(beginWord, endWord, wordList):
    word_set = set(wordList)
    # Forgot to check if endWord in wordList!
    
# ✅ Correct
def ladderLength(beginWord, endWord, wordList):
    word_set = set(wordList)
    if endWord not in word_set:
        return 0
```

### 2. Using List Instead of Set for wordList

```python
# ❌ Wrong: O(N) lookup per check
if new_word in wordList:  # O(N)

# ✅ Correct: O(1) lookup
word_set = set(wordList)
if new_word in word_set:  # O(1)
```

### 3. Counting Path Length Wrong

```python
# ❌ Wrong: Off by one
queue.append((beginWord, 0))  # Starting at 0
# Returns length - 1

# ✅ Correct: Count includes beginWord
queue.append((beginWord, 1))  # Starting at 1
# Returns correct length
```

### 4. Not Marking Visited Before Adding to Queue

```python
# ❌ Wrong: May add same word multiple times
if neighbor not in visited:
    queue.append((neighbor, length + 1))
    visited.add(neighbor)  # Too late!

# ✅ Correct: Mark visited immediately
if neighbor not in visited:
    visited.add(neighbor)  # Mark first
    queue.append((neighbor, length + 1))
```

---

## 📐 Visual Trace

```
beginWord = "hit", endWord = "cog"
wordList = ["hot","dot","dog","lot","log","cog"]

Graph:
         hit
          │
         hot ←────┐
        ╱   ╲      │
      dot    lot   │
        ╲   ╱      │
        dog  log   │
          ╲  ╱     │
          cog ─────┘

BFS Trace:
Level 0: Queue = ["hit"]
         Process "hit" → neighbors: ["hot"]
         
Level 1: Queue = ["hot"]
         Process "hot" → neighbors: ["dot", "lot", "hot"(skip)]
         
Level 2: Queue = ["dot", "lot"]
         Process "dot" → neighbors: ["dog", "hot"(visited)]
         Process "lot" → neighbors: ["log", "hot"(visited)]
         
Level 3: Queue = ["dog", "log"]
         Process "dog" → neighbors: ["cog"] ← FOUND!
         
Return: 3 + 1 = 4... wait, that's edges.
Path: hit → hot → dot → dog → cog = 5 nodes ✓
```

---

## 🎤 Interview Walkthrough

**Step 1: Clarify (1-2 min)**
> "So I need to transform beginWord to endWord, changing one letter at a time, and each intermediate word must be in the dictionary. I return the length of the shortest sequence, or 0 if impossible."

**Step 2: Approach (2-3 min)**
> "This is a shortest path problem where words are nodes and edges connect words differing by one letter. I'll use BFS since all edges have the same 'weight'. I'll generate neighbors by trying all 26 letters at each position."

**Step 3: Edge Cases**
> "I need to check if endWord is in the list. beginWord doesn't need to be in the list. I'll use a set for O(1) word lookup."

**Step 4: Code (10-12 min)**
> Write the solution, explaining neighbor generation and BFS loop.

**Step 5: Complexity (2-3 min)**
> "Time is O(M² × N): BFS visits up to N words, each generating O(M × 26) candidates, and string operations are O(M). Space is O(M × N) for the queue and visited set."

---

## 🔗 Follow-up: Word Ladder II

If asked to return **all shortest paths**, not just length:

```python
# Key differences:
# 1. Don't stop at first path found - collect all at same level
# 2. Track parents (multiple possible) for each word
# 3. Reconstruct all paths at the end

def findLadders(beginWord, endWord, wordList):
    # Similar BFS, but:
    # - Track parent[word] = [list of parents]
    # - Process entire level before checking if found
    # - Backtrack to build all paths
    pass  # See Word Ladder II for full solution
```

---

## ⏱️ Time Estimates

| Phase | Time |
|-------|------|
| Understand problem | 2 min |
| Identify BFS pattern | 1 min |
| Discuss approaches | 3 min |
| Code solution | 10-12 min |
| Test and verify | 3-4 min |
| **Total** | **19-22 min** |

---

> **💡 Key Insight:** The word transformation problem is really a shortest path problem on an implicit graph. Words are nodes, and edges connect words that differ by exactly one letter. BFS finds the shortest path.

> **🔗 Related:** [BFS Template](../3.2-BFS-Template.md) | [Open the Lock (LC 752)](./03-Open-Lock-LC752.md) | [Word Ladder II (LC 126)](./04-Word-Ladder-II-LC126.md)

---

**Previous:** [← Rotting Oranges](./01-Rotting-Oranges-LC994.md)  
**Next:** [DFS Fundamentals →](../../04-DFS-Pattern/4.1-DFS-Fundamentals.md)
