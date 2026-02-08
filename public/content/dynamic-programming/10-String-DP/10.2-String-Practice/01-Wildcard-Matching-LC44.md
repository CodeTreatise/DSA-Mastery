# Wildcard Matching (LC 44)

> **Pattern matching with `?` and `*`.** The wildcard `*` can match ANY sequence (including empty), making this simpler than regex but still requiring careful DP reasoning.

---

## 📋 Problem Statement

**LeetCode:** [44. Wildcard Matching](https://leetcode.com/problems/wildcard-matching/)

Given an input string `s` and a pattern `p`, implement wildcard pattern matching with support for:
- `?` - Matches any single character
- `*` - Matches any sequence of characters (including empty)

The matching should cover the **entire** input string (not partial).

**Examples:**
```
Input: s = "aa", p = "a"
Output: false

Input: s = "aa", p = "*"
Output: true

Input: s = "cb", p = "?a"
Output: false

Input: s = "adceb", p = "*a*b"
Output: true

Input: s = "acdcb", p = "a*c?b"
Output: false
```

**Constraints:**
- 0 ≤ s.length, p.length ≤ 2000
- s contains only lowercase English letters
- p contains only lowercase English letters, `?` or `*`

---

## 🎯 Pattern Recognition

**Why DP?**
- Overlapping subproblems: matching prefixes
- Optimal substructure: prefix match + rest
- `*` creates branching (empty OR extend)

**State:** `dp[i][j]` = does `s[0..i-1]` match `p[0..j-1]`?

---

## 📐 Approach Analysis

### Transition Cases

```
Case 1: p[j-1] is a regular character
  dp[i][j] = (s[i-1] == p[j-1]) AND dp[i-1][j-1]
  
Case 2: p[j-1] == '?'
  dp[i][j] = dp[i-1][j-1]  (? matches any single char)
  
Case 3: p[j-1] == '*'
  dp[i][j] = dp[i][j-1]    (* matches empty sequence)
          OR dp[i-1][j]    (* matches one more character)
```

### The `*` Insight

When `*` is at position `j-1`:
- `dp[i][j-1]`: Star matches EMPTY (skip star, keep same s)
- `dp[i-1][j]`: Star matches ONE MORE char (extend match)

Why does `dp[i-1][j]` work for "any sequence"?
- It's like saying: "if s[0..i-2] matches p[0..j-1], then `*` can extend to include s[i-1]"
- Repeatedly applying this covers any sequence length

---

## 💻 Solutions

### Solution 1: 2D DP (Clear)

```python
def is_match(s: str, p: str) -> bool:
    """
    Wildcard matching with ? and *.
    Time: O(mn), Space: O(mn)
    """
    m, n = len(s), len(p)
    
    # dp[i][j] = s[:i] matches p[:j]
    dp = [[False] * (n + 1) for _ in range(m + 1)]
    
    # Base case: empty string matches empty pattern
    dp[0][0] = True
    
    # Empty string can only match pattern of all *s
    for j in range(1, n + 1):
        if p[j - 1] == '*':
            dp[0][j] = dp[0][j - 1]
        else:
            break  # Non-* breaks the chain
    
    # Fill DP table
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if p[j - 1] == '*':
                # Empty match OR extend match
                dp[i][j] = dp[i][j - 1] or dp[i - 1][j]
            elif p[j - 1] == '?' or p[j - 1] == s[i - 1]:
                # Single char match
                dp[i][j] = dp[i - 1][j - 1]
            # else: dp[i][j] stays False
    
    return dp[m][n]
```

```javascript
function isMatch(s, p) {
    const m = s.length, n = p.length;
    const dp = Array.from({length: m + 1}, () => new Array(n + 1).fill(false));
    
    dp[0][0] = true;
    
    // Empty string vs pattern of *s
    for (let j = 1; j <= n && p[j - 1] === '*'; j++) {
        dp[0][j] = true;
    }
    
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (p[j - 1] === '*') {
                dp[i][j] = dp[i][j - 1] || dp[i - 1][j];
            } else if (p[j - 1] === '?' || p[j - 1] === s[i - 1]) {
                dp[i][j] = dp[i - 1][j - 1];
            }
        }
    }
    
    return dp[m][n];
}
```

### Solution 2: Space-Optimized 1D DP

```python
def is_match_optimized(s: str, p: str) -> bool:
    """
    Space-optimized version.
    Time: O(mn), Space: O(n)
    """
    m, n = len(s), len(p)
    
    # dp[j] = current row's value for column j
    dp = [False] * (n + 1)
    dp[0] = True
    
    # Initialize: empty string vs pattern
    for j in range(1, n + 1):
        if p[j - 1] == '*':
            dp[j] = dp[j - 1]
        else:
            break
    
    for i in range(1, m + 1):
        # prev stores dp[i-1][j-1]
        prev = dp[0]
        dp[0] = False  # Non-empty string vs empty pattern
        
        for j in range(1, n + 1):
            temp = dp[j]  # Save dp[i-1][j] before overwriting
            
            if p[j - 1] == '*':
                # dp[i][j] = dp[i][j-1] OR dp[i-1][j]
                dp[j] = dp[j - 1] or dp[j]
            elif p[j - 1] == '?' or p[j - 1] == s[i - 1]:
                # dp[i][j] = dp[i-1][j-1]
                dp[j] = prev
            else:
                dp[j] = False
            
            prev = temp
    
    return dp[n]
```

### Solution 3: Two-Pointer Greedy (O(1) Space)

```python
def is_match_greedy(s: str, p: str) -> bool:
    """
    Greedy approach with backtracking for *.
    Time: O(mn) worst, often O(m+n), Space: O(1)
    """
    m, n = len(s), len(p)
    si, pi = 0, 0
    star_idx = -1  # Position of last * in pattern
    match_idx = 0  # Position in s when * was encountered
    
    while si < m:
        if pi < n and (p[pi] == '?' or p[pi] == s[si]):
            # Single char match
            si += 1
            pi += 1
        elif pi < n and p[pi] == '*':
            # Record * position and try matching empty first
            star_idx = pi
            match_idx = si
            pi += 1  # Move past *
        elif star_idx != -1:
            # Backtrack: * matches one more character
            pi = star_idx + 1
            match_idx += 1
            si = match_idx
        else:
            return False
    
    # Pattern remaining must be all *s
    while pi < n and p[pi] == '*':
        pi += 1
    
    return pi == n
```

---

## ⚡ Complexity Analysis

| Approach | Time | Space |
|----------|------|-------|
| 2D DP | O(mn) | O(mn) |
| 1D DP | O(mn) | O(n) |
| Greedy | O(mn) worst, O(m+n) avg | O(1) |

---

## 📊 Trace Through Example

```
s = "adceb", p = "*a*b"

     ""   *    a    *    b
""   T    T    F    F    F
a    F    T    T    T    F
d    F    T    F    T    F
c    F    T    F    T    F
e    F    T    F    T    F
b    F    T    F    T    T

Key transitions:
- dp[1][2] = dp[0][1] (first * matches empty, then 'a'='a')
- dp[1][3] = dp[1][2] (* matches empty after 'a')
- dp[5][4] = dp[4][4] or dp[5][3] = T (* extends to include 'b')
- dp[5][5] = dp[4][4] = T ('b' = 'b')

Answer: True
```

---

## ⚠️ Common Mistakes

### 1. Wrong Base Case for Empty String

**❌ Wrong:**
```python
# Forgot to handle empty string matching "*" or "**"
dp[0][j] = False  # Wrong for p = "***"
```

**✅ Correct:**
```python
for j in range(1, n + 1):
    if p[j - 1] == '*':
        dp[0][j] = dp[0][j - 1]  # Carry forward
    else:
        break  # Can't match after non-*
```

### 2. Confusing `*` Transitions

**❌ Wrong:**
```python
if p[j-1] == '*':
    dp[i][j] = dp[i-1][j-1]  # Wrong! Not diagonal
```

**✅ Correct:**
```python
if p[j-1] == '*':
    dp[i][j] = dp[i][j-1] or dp[i-1][j]
    # Left: * matches empty
    # Up: * matches one more char
```

### 3. Space Optimization `prev` Bug

```python
# Must save prev BEFORE updating dp[j]
temp = dp[j]
# ... update dp[j] ...
prev = temp  # NOT dp[j]!
```

---

## 🔄 Wildcard vs Regex Comparison

| Aspect | Wildcard (`*`) | Regex (`*`) |
|--------|----------------|-------------|
| `*` meaning | Any sequence | Zero+ of preceding |
| `*` depends on | Nothing | Previous character |
| Transition for `*` | `dp[i][j-1] or dp[i-1][j]` | `dp[i][j-2] or dp[i-1][j]` (if match) |
| Example | `a*b` matches "aXXXb" | `a*b` matches "aaaaab" |

---

## 🔗 Related Patterns

### Regular Expression Matching (LC 10)

```python
def is_match_regex(s: str, p: str) -> bool:
    """
    Key difference: * depends on preceding char!
    """
    m, n = len(s), len(p)
    dp = [[False] * (n + 1) for _ in range(m + 1)]
    dp[0][0] = True
    
    # a* can match empty
    for j in range(2, n + 1, 2):
        if p[j - 1] == '*':
            dp[0][j] = dp[0][j - 2]
    
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if p[j - 1] == s[i - 1] or p[j - 1] == '.':
                dp[i][j] = dp[i - 1][j - 1]
            elif p[j - 1] == '*':
                # Zero occurrences
                dp[i][j] = dp[i][j - 2]
                # More occurrences (if preceding matches)
                if p[j - 2] == s[i - 1] or p[j - 2] == '.':
                    dp[i][j] = dp[i][j] or dp[i - 1][j]
    
    return dp[m][n]
```

---

## 📝 Practice Problems

| Problem | Difficulty | Key Insight |
|---------|------------|-------------|
| [44. Wildcard Matching](https://leetcode.com/problems/wildcard-matching/) | Hard | This problem |
| [10. Regular Expression Matching](https://leetcode.com/problems/regular-expression-matching/) | Hard | * depends on preceding |
| [72. Edit Distance](https://leetcode.com/problems/edit-distance/) | Medium | Similar 2D structure |
| [115. Distinct Subsequences](https://leetcode.com/problems/distinct-subsequences/) | Hard | Count instead of bool |

---

## 🎤 Interview Tips

**Time to solve:** 25-30 minutes

**Communication template:**
> "This is a classic DP matching problem. I'll use dp[i][j] to track whether s[0..i-1] matches p[0..j-1].

> For `?`, it matches any single character, so I just look at dp[i-1][j-1].

> For `*`, it can match empty (look left: dp[i][j-1]) OR match one more character (look up: dp[i-1][j]).

> The key insight is that the 'up' transition allows * to match sequences of any length by repeated application."

**Edge cases to mention:**
- Empty string matching "***"
- Pattern ending with *
- Multiple consecutive *s

**Company frequency:**
| Company | Frequency |
|---------|-----------|
| Google | ⭐⭐⭐⭐⭐ |
| Meta | ⭐⭐⭐⭐ |
| Amazon | ⭐⭐⭐ |
| Microsoft | ⭐⭐⭐ |

---

> **💡 Key Insight:** The `*` transition `dp[i][j] = dp[i][j-1] OR dp[i-1][j]` elegantly handles any-length matching: left means empty, up means extend by one. Repeated "up" transitions cover any sequence length.

> **🔗 Related:** [String DP Patterns](../10.1-String-DP-Patterns.md) | [Distinct Subsequences](./02-Distinct-Subsequences-LC115.md) | [Edit Distance](../../06-LCS-Pattern/6.6-LCS-Practice/02-Edit-Distance-LC72.md)
