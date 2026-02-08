# Palindrome Partitioning II (LC 132)

> **A classic hard DP problem.** This combines palindrome precomputation with linear DP to find minimum cuts. It's a beautiful example of how breaking a problem into two phases (precompute + optimize) makes a hard problem manageable.

---

## 📋 Problem Statement

**LeetCode:** [132. Palindrome Partitioning II](https://leetcode.com/problems/palindrome-partitioning-ii/)

Given a string `s`, partition `s` such that every substring of the partition is a palindrome.

Return the minimum cuts needed for a palindrome partitioning of `s`.

**Examples:**
```
Input: s = "aab"
Output: 1
Explanation: ["aa", "b"] - one cut after "aa"

Input: s = "a"
Output: 0

Input: s = "ab"
Output: 1
Explanation: ["a", "b"] - one cut between them
```

**Constraints:**
- 1 ≤ s.length ≤ 2000
- s consists of lowercase English letters only

---

## 🎯 Pattern Recognition

**This is Palindrome DP + Linear DP because:**
- Need to check if substrings are palindromes (palindrome DP)
- Need to minimize cuts (optimization DP)
- Subproblems: optimal cuts for prefixes

**Two-phase approach:**
1. **Phase 1:** Precompute which substrings are palindromes
2. **Phase 2:** DP to find minimum cuts

---

## 📐 Approach Analysis

### Phase 1: Palindrome Precomputation

```
isPal[i][j] = True if s[i:j+1] is a palindrome

Recurrence:
  isPal[i][j] = (s[i] == s[j]) AND isPal[i+1][j-1]
  
Base cases:
  isPal[i][i] = True (single char)
  isPal[i][i+1] = (s[i] == s[i+1]) (two chars)
```

### Phase 2: Minimum Cuts DP

```
dp[i] = minimum cuts to partition s[0:i+1]

Recurrence:
  If s[0:i+1] is a palindrome: dp[i] = 0
  Otherwise: dp[i] = min(dp[j] + 1) for all j where s[j+1:i+1] is palindrome

Answer: dp[n-1]
```

---

## 💻 Solutions

### Solution 1: Two-Phase DP (Standard)

```python
def min_cut(s: str) -> int:
    """
    Phase 1: Precompute palindromes
    Phase 2: DP for minimum cuts
    Time: O(n²), Space: O(n²)
    """
    n = len(s)
    if n <= 1:
        return 0
    
    # Phase 1: Precompute palindrome table
    is_pal = [[False] * n for _ in range(n)]
    
    # Base case: single characters
    for i in range(n):
        is_pal[i][i] = True
    
    # Base case: two characters
    for i in range(n - 1):
        is_pal[i][i + 1] = (s[i] == s[i + 1])
    
    # Fill for longer lengths
    for length in range(3, n + 1):
        for i in range(n - length + 1):
            j = i + length - 1
            is_pal[i][j] = (s[i] == s[j]) and is_pal[i + 1][j - 1]
    
    # Phase 2: DP for minimum cuts
    dp = [float('inf')] * n
    
    for i in range(n):
        if is_pal[0][i]:
            # Entire prefix is palindrome - no cuts needed
            dp[i] = 0
        else:
            # Try all possible last palindrome positions
            for j in range(i):
                if is_pal[j + 1][i]:
                    dp[i] = min(dp[i], dp[j] + 1)
    
    return dp[n - 1]
```

```javascript
function minCut(s) {
    const n = s.length;
    if (n <= 1) return 0;
    
    // Phase 1: Precompute palindrome table
    const isPal = Array.from({length: n}, 
                             () => new Array(n).fill(false));
    
    for (let i = 0; i < n; i++) {
        isPal[i][i] = true;
    }
    for (let i = 0; i < n - 1; i++) {
        isPal[i][i + 1] = (s[i] === s[i + 1]);
    }
    for (let len = 3; len <= n; len++) {
        for (let i = 0; i <= n - len; i++) {
            const j = i + len - 1;
            isPal[i][j] = (s[i] === s[j]) && isPal[i + 1][j - 1];
        }
    }
    
    // Phase 2: DP for minimum cuts
    const dp = new Array(n).fill(Infinity);
    
    for (let i = 0; i < n; i++) {
        if (isPal[0][i]) {
            dp[i] = 0;
        } else {
            for (let j = 0; j < i; j++) {
                if (isPal[j + 1][i]) {
                    dp[i] = Math.min(dp[i], dp[j] + 1);
                }
            }
        }
    }
    
    return dp[n - 1];
}
```

### Solution 2: Optimized with Expanding Palindromes

```python
def min_cut_optimized(s: str) -> int:
    """
    Compute palindromes and cuts simultaneously.
    Use center expansion for palindrome detection.
    Time: O(n²), Space: O(n)
    """
    n = len(s)
    
    # dp[i] = minimum cuts for s[0:i]
    # We use dp[i] for string of length i (0-indexed would be s[0:i])
    dp = list(range(-1, n))  # dp[0] = -1, dp[1] = 0, dp[2] = 1, ...
    
    for center in range(n):
        # Odd length palindromes
        left, right = center, center
        while left >= 0 and right < n and s[left] == s[right]:
            # s[left:right+1] is palindrome
            dp[right + 1] = min(dp[right + 1], dp[left] + 1)
            left -= 1
            right += 1
        
        # Even length palindromes
        left, right = center, center + 1
        while left >= 0 and right < n and s[left] == s[right]:
            dp[right + 1] = min(dp[right + 1], dp[left] + 1)
            left -= 1
            right += 1
    
    return dp[n]
```

### Solution 3: Alternative with Center Expansion

```python
def min_cut_v2(s: str) -> int:
    """
    Alternative implementation with cleaner logic.
    """
    n = len(s)
    if n == 0:
        return 0
    
    # cut[i] = min cuts to partition s[i:]
    # We compute right to left
    cut = list(range(n, -1, -1))  # cut[n] = 0, cut[n-1] = 1, etc.
    cut[n] = -1  # No string = -1 cuts (so first palindrome = 0 cuts)
    
    is_pal = [[False] * n for _ in range(n)]
    
    for i in range(n - 1, -1, -1):
        for j in range(i, n):
            if s[i] == s[j] and (j - i <= 1 or is_pal[i + 1][j - 1]):
                is_pal[i][j] = True
                cut[i] = min(cut[i], 1 + cut[j + 1])
    
    return cut[0]
```

---

## ⚡ Complexity Analysis

| Approach | Time | Space |
|----------|------|-------|
| Two-Phase | O(n²) | O(n²) |
| Center Expansion | O(n²) | O(n) |

---

## 📊 Trace Through Example

```
s = "aab"

Phase 1: Palindrome Table
  is_pal[0][0] = True  ('a')
  is_pal[1][1] = True  ('a')
  is_pal[2][2] = True  ('b')
  is_pal[0][1] = True  ('aa')
  is_pal[1][2] = False ('ab')
  is_pal[0][2] = False ('aab')

Phase 2: Minimum Cuts
  i=0: is_pal[0][0]=True → dp[0] = 0
       (Just 'a', no cuts needed)
  
  i=1: is_pal[0][1]=True → dp[1] = 0
       (Just 'aa', no cuts needed)
  
  i=2: is_pal[0][2]=False
       Try j=0: is_pal[1][2]=False ❌
       Try j=1: is_pal[2][2]=True ✓
                dp[2] = dp[1] + 1 = 0 + 1 = 1
       (Partition: "aa" | "b")

Answer: dp[2] = 1
```

---

## ⚠️ Common Mistakes

### 1. Off-by-One in DP Indexing

**❌ Wrong:**
```python
dp[i] = min(dp[i], dp[j] + 1)  # Where j is the cut position
# Confusion about what j represents
```

**✅ Correct:**
```python
# If s[j+1:i+1] is palindrome, we cut after position j
dp[i] = min(dp[i], dp[j] + 1)
# dp[j] = cuts for s[0:j+1], then one more cut after j
```

### 2. Wrong Base Case

**❌ Wrong:**
```python
dp = [0] * n  # Implies no cuts needed for anything
```

**✅ Correct:**
```python
dp = [float('inf')] * n  # We need to find minimum
# Or for prefix is_palindrome, set dp[i] = 0
```

### 3. Filling Palindrome Table in Wrong Order

**❌ Wrong:**
```python
for i in range(n):
    for j in range(i, n):
        # is_pal[i+1][j-1] might not be computed yet!
```

**✅ Correct:**
```python
for length in range(1, n + 1):  # By increasing length
    for i in range(n - length + 1):
        j = i + length - 1
        # Now is_pal[i+1][j-1] is guaranteed to be ready
```

### 4. Not Handling Single Character Case

```python
if n <= 1:
    return 0  # Single character is already palindrome
```

---

## 🔄 Variations

### Palindrome Partitioning I (LC 131) - All Partitions

```python
def partition(s: str) -> list[list[str]]:
    """Return all possible palindrome partitions."""
    def is_palindrome(sub):
        return sub == sub[::-1]
    
    def backtrack(start, path):
        if start == len(s):
            result.append(path[:])
            return
        
        for end in range(start + 1, len(s) + 1):
            if is_palindrome(s[start:end]):
                path.append(s[start:end])
                backtrack(end, path)
                path.pop()
    
    result = []
    backtrack(0, [])
    return result
```

### Palindrome Partitioning III (LC 1278) - K Partitions

```python
def palindrome_partition_k(s: str, k: int) -> int:
    """Minimum changes to partition into k palindromes."""
    n = len(s)
    
    # cost[i][j] = min changes to make s[i:j+1] palindrome
    cost = [[0] * n for _ in range(n)]
    for length in range(2, n + 1):
        for i in range(n - length + 1):
            j = i + length - 1
            cost[i][j] = cost[i + 1][j - 1] + (0 if s[i] == s[j] else 1)
    
    # dp[i][p] = min changes to partition s[0:i+1] into p parts
    dp = [[float('inf')] * (k + 1) for _ in range(n)]
    
    for i in range(n):
        dp[i][1] = cost[0][i]  # One partition = cost to make it palindrome
        for p in range(2, min(i + 2, k + 1)):
            for j in range(p - 1, i + 1):
                dp[i][p] = min(dp[i][p], dp[j - 1][p - 1] + cost[j][i])
    
    return dp[n - 1][k]
```

### Minimum Insertions for Palindrome Partitioning

```python
def min_insertions(s: str) -> int:
    """Min insertions to make entire string palindrome."""
    # This equals n - LPS(s)
    n = len(s)
    rev = s[::-1]
    
    # Find LCS of s and reverse(s) = LPS
    dp = [[0] * (n + 1) for _ in range(n + 1)]
    for i in range(1, n + 1):
        for j in range(1, n + 1):
            if s[i-1] == rev[j-1]:
                dp[i][j] = dp[i-1][j-1] + 1
            else:
                dp[i][j] = max(dp[i-1][j], dp[i][j-1])
    
    lps = dp[n][n]
    return n - lps
```

---

## 📝 Related Problems

| Problem | Difficulty | Note |
|---------|------------|------|
| [131. Palindrome Partitioning](https://leetcode.com/problems/palindrome-partitioning/) | Medium | List all partitions |
| [1278. Palindrome Partitioning III](https://leetcode.com/problems/palindrome-partitioning-iii/) | Hard | K partitions |
| [1745. Palindrome Partitioning IV](https://leetcode.com/problems/palindrome-partitioning-iv/) | Hard | Check if 3 parts possible |
| [5. Longest Palindromic Substring](https://leetcode.com/problems/longest-palindromic-substring/) | Medium | Related preprocessing |

---

## 🎤 Interview Tips

**Time to solve:** 25-30 minutes

**Communication template:**
> "I'll solve this in two phases. First, I precompute which substrings are palindromes using 2D DP. Then, I use linear DP where dp[i] represents minimum cuts for the prefix ending at i. For each position, if the entire prefix is a palindrome, no cuts needed; otherwise, I try all possible last palindrome positions."

**Key points:**
1. Explain the two-phase approach
2. Draw the palindrome table for a small example
3. Show how cuts DP uses the precomputed table

**Optimization to mention:**
> "We can optimize space to O(n) by using center expansion instead of 2D precomputation."

**Company frequency:**
| Company | Frequency |
|---------|-----------|
| Amazon | ⭐⭐⭐⭐ |
| Google | ⭐⭐⭐ |
| Meta | ⭐⭐⭐ |
| Bloomberg | ⭐⭐⭐ |

---

> **💡 Key Insight:** This problem beautifully demonstrates the "precompute + optimize" pattern. By separating palindrome detection (O(n²) precompute) from cut optimization (O(n²) DP), we make the solution clean and efficient. Each phase has a clear purpose.

> **🔗 Related:** [Palindrome DP Patterns](../8.1-Palindrome-DP-Patterns.md) | [Longest Palindromic Substring](./01-Longest-Palindromic-Substring-LC5.md) | [Palindrome Partitioning I](https://leetcode.com/problems/palindrome-partitioning/)
