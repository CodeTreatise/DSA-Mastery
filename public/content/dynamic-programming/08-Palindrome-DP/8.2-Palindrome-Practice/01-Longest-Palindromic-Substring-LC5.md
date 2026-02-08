# Longest Palindromic Substring (LC 5)

> **The most common palindrome interview question.** This problem teaches the elegant center expansion technique—O(n²) time with O(1) space. It's simple, efficient, and rarely requires the more complex Manacher's algorithm in interviews.

---

## 📋 Problem Statement

**LeetCode:** [5. Longest Palindromic Substring](https://leetcode.com/problems/longest-palindromic-substring/)

Given a string `s`, return the longest palindromic substring in `s`.

**Examples:**
```
Input: s = "babad"
Output: "bab" (or "aba" is also valid)

Input: s = "cbbd"
Output: "bb"

Input: s = "a"
Output: "a"
```

**Constraints:**
- 1 ≤ s.length ≤ 1000
- s consists of only digits and English letters

---

## 🎯 Pattern Recognition

**This is Palindrome Substring because:**
- Looking for contiguous characters
- Palindrome = reads same forwards and backwards
- Want maximum length

**Key difference from Longest Palindromic Subsequence:**
- **Substring:** Must be contiguous → Center expansion
- **Subsequence:** Can skip characters → Interval DP

---

## 📐 Approach Analysis

### Approach 1: Center Expansion (Recommended)

For each position, treat it as the center and expand outward.

**Key insight:** Every palindrome has a center:
- Odd length: single character center ("aba" → center at 'b')
- Even length: between two characters ("abba" → center between two 'b's)

### Approach 2: 2D DP

`dp[i][j]` = True if s[i:j+1] is palindrome.

**Trade-off:** More space (O(n²)) but useful when you need to check palindromes multiple times.

### Approach 3: Manacher's Algorithm

O(n) time, but complex. Rarely expected in interviews.

---

## 💻 Solutions

### Solution 1: Center Expansion (Best for Interviews)

```python
def longest_palindrome(s: str) -> str:
    """
    Expand around each center.
    Time: O(n²), Space: O(1)
    """
    def expand(left: int, right: int) -> tuple[int, int]:
        """Expand while palindrome, return (start, end) of palindrome."""
        while left >= 0 and right < len(s) and s[left] == s[right]:
            left -= 1
            right += 1
        # Return valid palindrome bounds (after loop, l and r are outside)
        return left + 1, right
    
    start, end = 0, 0
    
    for i in range(len(s)):
        # Odd length: center at i
        l1, r1 = expand(i, i)
        if r1 - l1 > end - start:
            start, end = l1, r1
        
        # Even length: center between i and i+1
        l2, r2 = expand(i, i + 1)
        if r2 - l2 > end - start:
            start, end = l2, r2
    
    return s[start:end]
```

```javascript
function longestPalindrome(s) {
    let start = 0, maxLen = 0;
    
    function expand(left, right) {
        while (left >= 0 && right < s.length && s[left] === s[right]) {
            left--;
            right++;
        }
        // Length of palindrome
        return right - left - 1;
    }
    
    for (let i = 0; i < s.length; i++) {
        const len1 = expand(i, i);       // Odd
        const len2 = expand(i, i + 1);   // Even
        const len = Math.max(len1, len2);
        
        if (len > maxLen) {
            maxLen = len;
            // Calculate start position
            start = i - Math.floor((len - 1) / 2);
        }
    }
    
    return s.substring(start, start + maxLen);
}
```

### Solution 2: 2D DP

```python
def longest_palindrome_dp(s: str) -> str:
    """
    DP approach: dp[i][j] = is s[i:j+1] palindrome?
    Time: O(n²), Space: O(n²)
    """
    n = len(s)
    if n <= 1:
        return s
    
    dp = [[False] * n for _ in range(n)]
    start, max_len = 0, 1
    
    # Base case: single characters
    for i in range(n):
        dp[i][i] = True
    
    # Base case: two characters
    for i in range(n - 1):
        if s[i] == s[i + 1]:
            dp[i][i + 1] = True
            start, max_len = i, 2
    
    # Fill for longer lengths
    for length in range(3, n + 1):
        for i in range(n - length + 1):
            j = i + length - 1
            
            # Palindrome if ends match AND inner is palindrome
            if s[i] == s[j] and dp[i + 1][j - 1]:
                dp[i][j] = True
                start, max_len = i, length
    
    return s[start:start + max_len]
```

### Solution 3: Cleaner Center Expansion

```python
def longest_palindrome_v2(s: str) -> str:
    """Alternative implementation returning the string directly."""
    result = ""
    
    for i in range(len(s)):
        # Odd length
        left, right = i, i
        while left >= 0 and right < len(s) and s[left] == s[right]:
            if right - left + 1 > len(result):
                result = s[left:right + 1]
            left -= 1
            right += 1
        
        # Even length
        left, right = i, i + 1
        while left >= 0 and right < len(s) and s[left] == s[right]:
            if right - left + 1 > len(result):
                result = s[left:right + 1]
            left -= 1
            right += 1
    
    return result
```

---

## ⚡ Complexity Analysis

| Approach | Time | Space |
|----------|------|-------|
| Center Expansion | O(n²) | O(1) |
| 2D DP | O(n²) | O(n²) |
| Manacher's | O(n) | O(n) |

**Why O(n²) for center expansion:**
- n centers (each position)
- Each expansion takes O(n) worst case
- Total: O(n²)

---

## 📊 Trace Through Example

```
s = "babad"

Center at 0 ('b'):
  Odd:  expand(0,0) → 'b' (len 1)
  Even: expand(0,1) → 'b'≠'a', stop (len 0)

Center at 1 ('a'):
  Odd:  expand(1,1) → 'a' → 'bab' (len 3) ⭐
  Even: expand(1,2) → 'a'≠'b', stop

Center at 2 ('b'):
  Odd:  expand(2,2) → 'b' → 'aba' (len 3)
  Even: expand(2,3) → 'b'≠'a', stop

Center at 3 ('a'):
  Odd:  expand(3,3) → 'a' → 'bad' no, 'a' (len 1)
  Even: expand(3,4) → 'a'≠'d', stop

Center at 4 ('d'):
  Odd:  expand(4,4) → 'd' (len 1)
  Even: out of bounds

Result: "bab" (length 3)
```

---

## ⚠️ Common Mistakes

### 1. Forgetting Even Length Palindromes

**❌ Wrong:**
```python
for i in range(len(s)):
    expand(i, i)  # Only odd!
```

**✅ Correct:**
```python
for i in range(len(s)):
    expand(i, i)      # Odd: "aba"
    expand(i, i + 1)  # Even: "abba"
```

### 2. Off-by-One in Expand Return

**❌ Wrong:**
```python
def expand(l, r):
    while l >= 0 and r < len(s) and s[l] == s[r]:
        l -= 1
        r += 1
    return l, r  # l and r are now OUTSIDE the palindrome!
```

**✅ Correct:**
```python
def expand(l, r):
    while l >= 0 and r < len(s) and s[l] == s[r]:
        l -= 1
        r += 1
    return l + 1, r  # Adjust back to valid bounds
```

### 3. Substring vs Subsequence

**❌ Wrong approach for substring:**
```python
# Using LCS or interval DP for SUBSTRING problem
# This is overkill and more complex than needed
```

**✅ Correct:**
```python
# Center expansion is simpler and uses O(1) space
```

### 4. Not Handling Single Character

```python
# Edge case: s = "a"
# Should return "a"
# Center expansion naturally handles this
```

---

## 🔄 Variations

### Count All Palindromic Substrings (LC 647)

```python
def count_substrings(s: str) -> int:
    """Count all palindromic substrings."""
    count = 0
    
    for i in range(len(s)):
        # Odd length
        left, right = i, i
        while left >= 0 and right < len(s) and s[left] == s[right]:
            count += 1
            left -= 1
            right += 1
        
        # Even length
        left, right = i, i + 1
        while left >= 0 and right < len(s) and s[left] == s[right]:
            count += 1
            left -= 1
            right += 1
    
    return count
```

### Check if Palindrome Possible with One Deletion (LC 680)

```python
def valid_palindrome_ii(s: str) -> bool:
    """Can we delete at most one char to make palindrome?"""
    def is_palindrome(l: int, r: int) -> bool:
        while l < r:
            if s[l] != s[r]:
                return False
            l += 1
            r -= 1
        return True
    
    left, right = 0, len(s) - 1
    while left < right:
        if s[left] != s[right]:
            # Try deleting left or right character
            return is_palindrome(left + 1, right) or is_palindrome(left, right - 1)
        left += 1
        right -= 1
    
    return True
```

### Longest Palindrome by Concatenating Two Words (LC 2131)

```python
def longest_palindrome_concat(words: list[str]) -> int:
    """Find longest palindrome by concatenating words."""
    from collections import Counter
    
    count = Counter(words)
    length = 0
    has_center = False
    
    for word in count:
        rev = word[::-1]
        if word == rev:
            # Self-palindrome: use pairs
            pairs = count[word] // 2
            length += pairs * 4
            if count[word] % 2 == 1:
                has_center = True
        elif word < rev and rev in count:
            # Form palindrome with reverse
            pairs = min(count[word], count[rev])
            length += pairs * 4
    
    if has_center:
        length += 2
    
    return length
```

---

## 📝 Related Problems

| Problem | Difficulty | Note |
|---------|------------|------|
| [647. Palindromic Substrings](https://leetcode.com/problems/palindromic-substrings/) | Medium | Count all |
| [516. Longest Palindromic Subsequence](https://leetcode.com/problems/longest-palindromic-subsequence/) | Medium | Subsequence version |
| [680. Valid Palindrome II](https://leetcode.com/problems/valid-palindrome-ii/) | Easy | One deletion |
| [214. Shortest Palindrome](https://leetcode.com/problems/shortest-palindrome/) | Hard | Add prefix |
| [131. Palindrome Partitioning](https://leetcode.com/problems/palindrome-partitioning/) | Medium | Backtracking |

---

## 🎤 Interview Tips

**Time to solve:** 15-20 minutes

**Communication template:**
> "I'll use center expansion. For each position, I treat it as the center of both odd and even length palindromes, expanding outward while characters match. I track the longest found. This gives O(n²) time and O(1) space."

**Key points:**
1. Explain odd vs even centers
2. Show the expand helper function
3. Trace through a small example

**Common follow-ups:**
- "What about O(n)?" → Mention Manacher's (rarely need to implement)
- "What if we need all palindromes?" → Same technique, collect all
- "Subsequence instead?" → Different problem, use interval DP

**Company frequency:**
| Company | Frequency |
|---------|-----------|
| Amazon | ⭐⭐⭐⭐⭐ |
| Microsoft | ⭐⭐⭐⭐ |
| Google | ⭐⭐⭐⭐ |
| Meta | ⭐⭐⭐⭐ |
| Apple | ⭐⭐⭐ |

---

> **💡 Key Insight:** Every palindrome has a center. By checking all possible centers (n for odd, n-1 for even), we're guaranteed to find every palindrome. The expansion is greedy—we extend as far as possible from each center.

> **🔗 Related:** [Palindrome DP Patterns](../8.1-Palindrome-DP-Patterns.md) | [Palindrome Partitioning](./02-Palindrome-Partitioning-II-LC132.md) | [LPS](../../06-LCS-Pattern/6.6-LCS-Practice/03-Longest-Palindromic-Subseq-LC516.md)
