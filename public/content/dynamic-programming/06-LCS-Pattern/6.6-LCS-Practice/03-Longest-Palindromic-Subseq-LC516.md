# Longest Palindromic Subsequence (LC 516)

> **A beautiful transformation: LPS = LCS(s, reverse(s)).** This problem demonstrates the power of problem reduction. Instead of creating a new DP, we transform it into an already-solved problem!

---

## 📋 Problem Statement

**LeetCode:** [516. Longest Palindromic Subsequence](https://leetcode.com/problems/longest-palindromic-subsequence/)

Given a string `s`, find the longest palindromic subsequence's length in `s`.

A **subsequence** is a sequence that can be derived from another sequence by deleting some or no elements without changing the order of the remaining elements.

**Examples:**
```
Input: s = "bbbab"
Output: 4
Explanation: "bbbb" is the longest palindromic subsequence

Input: s = "cbbd"
Output: 2
Explanation: "bb" is the longest palindromic subsequence
```

**Constraints:**
- 1 ≤ s.length ≤ 1000
- s consists only of lowercase English letters

---

## 🎯 Pattern Recognition

### The Key Transformation

**Insight:** A palindrome reads the same forwards and backwards.

So if we want the **Longest Palindromic Subsequence** of string `s`:
- It must appear in `s` (going forward)
- It must ALSO appear in `reverse(s)` (going backward)
- Therefore: **LPS(s) = LCS(s, reverse(s))**

**Example:**
```
s = "bbbab"
r = "babbb"

LCS("bbbab", "babbb") = "bbbb" (length 4)
```

This is a COMMON SUBSEQUENCE of s and reverse(s), and since it appears in both directions, it's a PALINDROME!

---

## 📐 Two Approaches

### Approach 1: LCS Transformation

```
LPS(s) = LCS(s, reverse(s))
```

- **Pros:** Uses existing LCS code, easy to understand
- **Cons:** Creates the reversed string, standard LCS complexity

### Approach 2: Direct Interval DP

Define `dp[i][j]` = LPS of s[i:j+1]

- **Pros:** More direct, can optimize differently
- **Cons:** Need to understand interval DP

---

## 💻 Solutions

### Solution 1: LCS Transformation (Recommended)

```python
def longest_palindrome_subseq(s: str) -> int:
    """
    LPS = LCS(s, reverse(s))
    Time: O(n²), Space: O(n²)
    """
    rev = s[::-1]
    n = len(s)
    
    # Standard LCS
    dp = [[0] * (n + 1) for _ in range(n + 1)]
    
    for i in range(1, n + 1):
        for j in range(1, n + 1):
            if s[i-1] == rev[j-1]:
                dp[i][j] = dp[i-1][j-1] + 1
            else:
                dp[i][j] = max(dp[i-1][j], dp[i][j-1])
    
    return dp[n][n]
```

```javascript
function longestPalindromeSubseq(s) {
    const rev = s.split('').reverse().join('');
    const n = s.length;
    
    const dp = Array.from({length: n + 1}, 
                          () => new Array(n + 1).fill(0));
    
    for (let i = 1; i <= n; i++) {
        for (let j = 1; j <= n; j++) {
            if (s[i-1] === rev[j-1]) {
                dp[i][j] = dp[i-1][j-1] + 1;
            } else {
                dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1]);
            }
        }
    }
    
    return dp[n][n];
}
```

### Solution 2: Space-Optimized LCS

```python
def longest_palindrome_subseq_optimized(s: str) -> int:
    """
    Space-optimized: O(n) space.
    """
    rev = s[::-1]
    n = len(s)
    
    prev = [0] * (n + 1)
    curr = [0] * (n + 1)
    
    for i in range(1, n + 1):
        for j in range(1, n + 1):
            if s[i-1] == rev[j-1]:
                curr[j] = prev[j-1] + 1
            else:
                curr[j] = max(prev[j], curr[j-1])
        prev, curr = curr, prev
    
    return prev[n]
```

### Solution 3: Direct Interval DP

```python
def longest_palindrome_subseq_interval(s: str) -> int:
    """
    Interval DP: dp[i][j] = LPS of s[i:j+1]
    Time: O(n²), Space: O(n²)
    """
    n = len(s)
    
    # dp[i][j] = LPS length for s[i:j+1]
    dp = [[0] * n for _ in range(n)]
    
    # Base case: single characters
    for i in range(n):
        dp[i][i] = 1
    
    # Fill for increasing lengths
    for length in range(2, n + 1):
        for i in range(n - length + 1):
            j = i + length - 1
            
            if s[i] == s[j]:
                # Outer characters match
                dp[i][j] = dp[i+1][j-1] + 2
            else:
                # Try excluding either end
                dp[i][j] = max(dp[i+1][j], dp[i][j-1])
    
    return dp[0][n-1]
```

```javascript
function longestPalindromeSubseqInterval(s) {
    const n = s.length;
    const dp = Array.from({length: n}, () => new Array(n).fill(0));
    
    // Base case
    for (let i = 0; i < n; i++) {
        dp[i][i] = 1;
    }
    
    // Fill for increasing lengths
    for (let len = 2; len <= n; len++) {
        for (let i = 0; i <= n - len; i++) {
            const j = i + len - 1;
            if (s[i] === s[j]) {
                dp[i][j] = dp[i+1][j-1] + 2;
            } else {
                dp[i][j] = Math.max(dp[i+1][j], dp[i][j-1]);
            }
        }
    }
    
    return dp[0][n-1];
}
```

### Solution 4: Space-Optimized Interval DP

```python
def longest_palindrome_subseq_1d(s: str) -> int:
    """
    1D space: process by length.
    Only need dp[i+1] when computing dp[i].
    """
    n = len(s)
    dp = [1] * n  # Each char is a palindrome of length 1
    
    for i in range(n - 2, -1, -1):
        prev = 0  # dp[i+1][j-1] before updates
        for j in range(i + 1, n):
            temp = dp[j]  # Save dp[i+1][j]
            if s[i] == s[j]:
                dp[j] = prev + 2
            else:
                dp[j] = max(dp[j], dp[j-1])
            prev = temp
    
    return dp[n-1]
```

---

## ⚡ Complexity Analysis

| Approach | Time | Space |
|----------|------|-------|
| LCS 2D | O(n²) | O(n²) |
| LCS 1D | O(n²) | O(n) |
| Interval 2D | O(n²) | O(n²) |
| Interval 1D | O(n²) | O(n) |

---

## 📊 Why LCS Transformation Works

```
s = "bbbab"
r = "babbb"

LCS Table:
         ""   b    a    b    b    b
    ""    0   0    0    0    0    0
    b     0   1    1    1    1    1
    b     0   1    1    2    2    2
    b     0   1    1    2    3    3
    a     0   1    2    2    3    3
    b     0   1    2    3    3    4

LCS = 4 → "bbbb"

Why is "bbbb" palindromic?
- It appears in s: b[0], b[1], b[2], b[4]
- It appears in reverse(s): same positions reversed
- Any common subsequence of s and reverse(s) is a palindrome!
```

---

## ⚠️ Common Mistakes

### 1. Confusing Subsequence with Substring

**Subsequence:** Characters in order, not necessarily contiguous
- "bbbb" is a subsequence of "bbbab" ✅

**Substring:** Must be contiguous
- "bbb" is a longest palindromic substring of "bbbab"

**Different problems!**

### 2. Wrong Interval DP Base Case

**❌ Wrong:**
```python
dp = [[0] * n for _ in range(n)]
# Missing: dp[i][i] = 1
```

**✅ Correct:**
```python
dp = [[0] * n for _ in range(n)]
for i in range(n):
    dp[i][i] = 1  # Single char is palindrome of length 1
```

### 3. Wrong Interval DP Recurrence

**❌ Wrong:**
```python
if s[i] == s[j]:
    dp[i][j] = dp[i+1][j-1] + 1  # Should be +2!
```

**✅ Correct:**
```python
if s[i] == s[j]:
    dp[i][j] = dp[i+1][j-1] + 2  # Adding BOTH matching chars
```

### 4. Filling Interval DP in Wrong Order

**❌ Wrong:**
```python
for i in range(n):
    for j in range(i, n):
        # dp[i+1][j] and dp[i][j-1] might not be computed yet!
```

**✅ Correct:**
```python
for length in range(2, n + 1):  # Increasing length
    for i in range(n - length + 1):
        j = i + length - 1
        # Now dp[i+1][j] and dp[i][j-1] are ready
```

---

## 📊 Trace Through Example

### LCS Method

```
s = "cbbd", rev = "dbbc"

         ""   d    b    b    c
    ""    0   0    0    0    0
    c     0   0    0    0    1
    b     0   0    1    1    1
    b     0   0    1    2    2  ← "bb" found!
    d     0   1    1    2    2

Answer: 2 ("bb")
```

### Interval DP Method

```
s = "cbbd"

Base: dp[i][i] = 1 for all i
      dp = [[1,_,_,_], [_,1,_,_], [_,_,1,_], [_,_,_,1]]

Length 2:
  i=0,j=1: s[0]='c' ≠ s[1]='b' → max(dp[1][1], dp[0][0]) = 1
  i=1,j=2: s[1]='b' == s[2]='b' → dp[2][1] + 2 = 0 + 2 = 2 ⭐
  i=2,j=3: s[2]='b' ≠ s[3]='d' → max(dp[3][3], dp[2][2]) = 1

Length 3:
  i=0,j=2: 'c' ≠ 'b' → max(dp[1][2], dp[0][1]) = max(2,1) = 2
  i=1,j=3: 'b' ≠ 'd' → max(dp[2][3], dp[1][2]) = max(1,2) = 2

Length 4:
  i=0,j=3: 'c' ≠ 'd' → max(dp[1][3], dp[0][2]) = max(2,2) = 2

Answer: dp[0][3] = 2
```

---

## 🔄 Related Transformations

### Min Deletions to Make Palindrome

```python
def min_deletions_palindrome(s: str) -> int:
    """Remove minimum chars to make palindrome."""
    lps = longest_palindrome_subseq(s)
    return len(s) - lps
```

### Min Insertions to Make Palindrome

```python
def min_insertions_palindrome(s: str) -> int:
    """Insert minimum chars to make palindrome."""
    # Same as min deletions!
    lps = longest_palindrome_subseq(s)
    return len(s) - lps
```

### Count Palindromic Subsequences (LC 730)

```python
def count_palindromic_subsequences(s: str) -> int:
    """Count distinct palindromic subsequences."""
    MOD = 10**9 + 7
    n = len(s)
    dp = [[0] * n for _ in range(n)]
    
    for i in range(n):
        dp[i][i] = 1
    
    for length in range(2, n + 1):
        for i in range(n - length + 1):
            j = i + length - 1
            if s[i] == s[j]:
                dp[i][j] = dp[i+1][j] + dp[i][j-1] + 1
            else:
                dp[i][j] = dp[i+1][j] + dp[i][j-1] - dp[i+1][j-1]
            dp[i][j] %= MOD
    
    return dp[0][n-1]
```

---

## 📝 Related Problems

| Problem | Difficulty | Note |
|---------|------------|------|
| [5. Longest Palindromic Substring](https://leetcode.com/problems/longest-palindromic-substring/) | Medium | Substring, not subsequence |
| [647. Palindromic Substrings](https://leetcode.com/problems/palindromic-substrings/) | Medium | Count substrings |
| [730. Count Different Palindromic Subsequences](https://leetcode.com/problems/count-different-palindromic-subsequences/) | Hard | Count distinct |
| [1312. Min Insertions to Make String Palindrome](https://leetcode.com/problems/minimum-insertion-steps-to-make-a-string-palindrome/) | Hard | n - LPS |

---

## 🎤 Interview Tips

**Time to solve:** 15-20 minutes

**Communication template:**
> "I recognize that the longest palindromic subsequence can be found using the LCS transformation: LPS(s) = LCS(s, reverse(s)). A palindrome reads the same forwards and backwards, so any common subsequence of s and its reverse must be palindromic."

**Key insight to emphasize:**
> "The beauty is we don't need new DP logic—we transform to a solved problem!"

**Alternative approach to mention:**
> "We could also use interval DP directly: dp[i][j] represents the LPS of s[i:j+1], filling by increasing substring length."

**Company frequency:**
| Company | Frequency |
|---------|-----------|
| Amazon | ⭐⭐⭐⭐ |
| LinkedIn | ⭐⭐⭐⭐ |
| Google | ⭐⭐⭐ |
| Meta | ⭐⭐⭐ |

---

> **💡 Key Insight:** LPS(s) = LCS(s, reverse(s)) is one of the most elegant problem reductions in DP. It demonstrates that recognizing problem transformations can be more valuable than deriving new recurrences from scratch. Always ask: "Can I transform this into something I already know?"

> **🔗 Related:** [LCS Fundamentals](../6.5-LCS-Fundamentals.md) | [LCS Problem](./01-LCS-LC1143.md) | [Interval DP](../../08-Interval-DP/)
