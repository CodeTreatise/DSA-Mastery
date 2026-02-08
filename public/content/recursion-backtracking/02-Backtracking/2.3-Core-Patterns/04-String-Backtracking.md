# 04 String Backtracking

> **Classic String Generation Problems Using Backtracking**  
> **Interview Frequency:** ⭐⭐⭐⭐⭐ - Phone Number, Parentheses, Palindrome Partitioning  
> **Grokking Pattern:** #27 Backtracking (String variants)

---

## Overview

**String Backtracking** applies the backtracking template to string generation and manipulation problems. These problems involve building strings character by character, with specific constraints that guide the exploration.

The three most common string backtracking problems are:
1. **Letter Combinations of Phone Number** - Cartesian product
2. **Generate Parentheses** - Constraint tracking
3. **Palindrome Partitioning** - Substring validation

---

## 🎯 Pattern Recognition

<details>
<summary><strong>How to Identify String Backtracking Problems</strong></summary>

**Look for these signals:**
- "Generate all **valid strings**" matching a pattern
- "All **letter combinations**" from input
- "**Partition** string into valid parts"
- Building strings with **constraints** (balanced, palindrome, etc.)
- Multiple choices per position in output

**Keywords in problem statement:**
- "letter combinations", "all possible strings"
- "generate", "valid parentheses", "balanced"
- "partition into palindromes"
- "restore IP addresses"

**Key characteristics:**
- Building output string incrementally
- Each position has multiple choices
- Constraints limit valid combinations
- Need ALL valid results

</details>

---

## ✅ When to Use String Backtracking

- **Letter combinations** from digits (phone keypad)
- **Generate valid parentheses** sequences
- **Partition strings** into valid substrings
- **Restore IP addresses** from digit string
- Any **string construction** with constraints

---

## ❌ When NOT to Use

| Situation | Use Instead | Why |
|-----------|-------------|-----|
| Finding ONE valid string | Greedy/BFS | Don't enumerate all |
| Counting valid strings | DP (Catalan, etc.) | Math is faster |
| Pattern matching | KMP, Rabin-Karp | Different problem type |
| String transformation | BFS (word ladder) | Shortest path problem |

---

## 🔗 Concept Map

<details>
<summary><strong>Prerequisites & Next Steps</strong></summary>

**Before this, you should know:**
- [Backtracking Template](../2.2-Backtracking-Template.md) - Core template
- [Subsets Pattern](./01-Subsets-Pattern.md) - Basic backtracking

**After mastering this:**
- [Grid Backtracking](../2.4-Grid-Backtracking.md) - Word Search
- [Classic Problems](../2.5-Classic-Problems.md) - Sudoku, N-Queens

**Combines with:**
- **String operations** - Substring, palindrome check
- **Constraint tracking** - Open/close parentheses count
- **Pruning** - Early termination for invalid states

</details>

---

## Problem 1: Letter Combinations of Phone Number

### Problem Statement
Given a string of digits 2-9, return all possible letter combinations.

```
Input: "23"
Output: ["ad","ae","af","bd","be","bf","cd","ce","cf"]
```

### 📐 How It Works

```
Phone keypad:
2 → abc    5 → jkl    8 → tuv
3 → def    6 → mno    9 → wxyz
4 → ghi    7 → pqrs

digits = "23"

      ""
    / | \
   a  b  c     (from "2")
  /|\ /|\ /|\
 d e f d e f d e f   (from "3")
 
Results: ad, ae, af, bd, be, bf, cd, ce, cf
```

### 💻 Code

```python
def letter_combinations(digits: str) -> list[str]:
    """
    Generate all letter combinations for phone number digits.
    
    Time: O(4^n * n) where n = len(digits)
    Space: O(n) for recursion
    """
    if not digits:
        return []
    
    phone_map = {
        '2': 'abc', '3': 'def', '4': 'ghi', '5': 'jkl',
        '6': 'mno', '7': 'pqrs', '8': 'tuv', '9': 'wxyz'
    }
    
    result = []
    
    def backtrack(index: int, current: list):
        # Base case: processed all digits
        if index == len(digits):
            result.append(''.join(current))
            return
        
        # Get letters for current digit
        letters = phone_map[digits[index]]
        
        # Try each letter
        for letter in letters:
            current.append(letter)
            backtrack(index + 1, current)
            current.pop()
    
    backtrack(0, [])
    return result

# Example
print(letter_combinations("23"))
# ['ad', 'ae', 'af', 'bd', 'be', 'bf', 'cd', 'ce', 'cf']
```

```javascript
function letterCombinations(digits) {
    if (!digits) return [];
    
    const phoneMap = {
        '2': 'abc', '3': 'def', '4': 'ghi', '5': 'jkl',
        '6': 'mno', '7': 'pqrs', '8': 'tuv', '9': 'wxyz'
    };
    
    const result = [];
    
    function backtrack(index, current) {
        if (index === digits.length) {
            result.push(current.join(''));
            return;
        }
        
        for (const letter of phoneMap[digits[index]]) {
            current.push(letter);
            backtrack(index + 1, current);
            current.pop();
        }
    }
    
    backtrack(0, []);
    return result;
}
```

---

## Problem 2: Generate Parentheses

### Problem Statement
Generate all valid combinations of n pairs of parentheses.

```
Input: n = 3
Output: ["((()))","(()())","(())()","()(())","()()()"]
```

### 📐 How It Works

**Key insight:** Track open and close counts as constraints.
- Can add `(` if `open < n`
- Can add `)` if `close < open` (can't close without matching open)

```
n = 2

                ""
               /  \
              (    X (can't start with ))
             / \
           ((   ()
           /    / \
         (()   ()(  X
          |     |
         (()) ()()

Valid: ["(())", "()()"]
```

### 💻 Code

```python
def generate_parenthesis(n: int) -> list[str]:
    """
    Generate all valid combinations of n pairs of parentheses.
    
    Time: O(4^n / √n) - Catalan number
    Space: O(n) for recursion
    """
    result = []
    
    def backtrack(current: list, open_count: int, close_count: int):
        # Base case: used all parentheses
        if len(current) == 2 * n:
            result.append(''.join(current))
            return
        
        # Can add open if haven't used all
        if open_count < n:
            current.append('(')
            backtrack(current, open_count + 1, close_count)
            current.pop()
        
        # Can add close if it would be balanced
        if close_count < open_count:
            current.append(')')
            backtrack(current, open_count, close_count + 1)
            current.pop()
    
    backtrack([], 0, 0)
    return result

# Example
print(generate_parenthesis(3))
# ['((()))', '(()())', '(())()', '()(())', '()()()']
```

```javascript
function generateParenthesis(n) {
    const result = [];
    
    function backtrack(current, openCount, closeCount) {
        if (current.length === 2 * n) {
            result.push(current.join(''));
            return;
        }
        
        if (openCount < n) {
            current.push('(');
            backtrack(current, openCount + 1, closeCount);
            current.pop();
        }
        
        if (closeCount < openCount) {
            current.push(')');
            backtrack(current, openCount, closeCount + 1);
            current.pop();
        }
    }
    
    backtrack([], 0, 0);
    return result;
}
```

### Alternative: String concatenation (simpler but less efficient)

```python
def generate_parenthesis_simple(n: int) -> list[str]:
    """Simpler version using string concatenation."""
    result = []
    
    def backtrack(s: str, open_count: int, close_count: int):
        if len(s) == 2 * n:
            result.append(s)
            return
        
        if open_count < n:
            backtrack(s + '(', open_count + 1, close_count)
        
        if close_count < open_count:
            backtrack(s + ')', open_count, close_count + 1)
    
    backtrack('', 0, 0)
    return result
```

---

## Problem 3: Palindrome Partitioning

### Problem Statement
Partition a string such that every substring is a palindrome. Return all possible partitions.

```
Input: "aab"
Output: [["a","a","b"], ["aa","b"]]
```

### 📐 How It Works

At each position, try all possible substrings starting there. If it's a palindrome, recurse on the remainder.

```
"aab"

Start at index 0:
  - "a" is palindrome → recurse on "ab"
      - "a" is palindrome → recurse on "b"
          - "b" is palindrome → result: ["a", "a", "b"]
      - "ab" not palindrome → skip
  - "aa" is palindrome → recurse on "b"
      - "b" is palindrome → result: ["aa", "b"]
  - "aab" not palindrome → skip

Results: [["a","a","b"], ["aa","b"]]
```

### 💻 Code

```python
def partition(s: str) -> list[list[str]]:
    """
    Partition string into all possible palindrome substrings.
    
    Time: O(n * 2^n), Space: O(n)
    """
    result = []
    
    def is_palindrome(string: str, left: int, right: int) -> bool:
        while left < right:
            if string[left] != string[right]:
                return False
            left += 1
            right -= 1
        return True
    
    def backtrack(start: int, current: list):
        # Base case: reached end of string
        if start == len(s):
            result.append(current[:])
            return
        
        # Try all substrings starting at 'start'
        for end in range(start, len(s)):
            # Only proceed if substring is palindrome
            if is_palindrome(s, start, end):
                current.append(s[start:end + 1])
                backtrack(end + 1, current)
                current.pop()
    
    backtrack(0, [])
    return result

# Example
print(partition("aab"))
# [['a', 'a', 'b'], ['aa', 'b']]
```

```javascript
function partition(s) {
    const result = [];
    
    function isPalindrome(str, left, right) {
        while (left < right) {
            if (str[left] !== str[right]) return false;
            left++;
            right--;
        }
        return true;
    }
    
    function backtrack(start, current) {
        if (start === s.length) {
            result.push([...current]);
            return;
        }
        
        for (let end = start; end < s.length; end++) {
            if (isPalindrome(s, start, end)) {
                current.push(s.substring(start, end + 1));
                backtrack(end + 1, current);
                current.pop();
            }
        }
    }
    
    backtrack(0, []);
    return result;
}
```

### Optimized with Memoization for Palindrome Check

```python
def partition_optimized(s: str) -> list[list[str]]:
    """Optimized with DP for palindrome checking."""
    n = len(s)
    
    # Precompute palindrome matrix
    # dp[i][j] = True if s[i:j+1] is palindrome
    dp = [[False] * n for _ in range(n)]
    
    for i in range(n - 1, -1, -1):
        for j in range(i, n):
            if s[i] == s[j] and (j - i <= 2 or dp[i + 1][j - 1]):
                dp[i][j] = True
    
    result = []
    
    def backtrack(start: int, current: list):
        if start == n:
            result.append(current[:])
            return
        
        for end in range(start, n):
            if dp[start][end]:  # O(1) lookup instead of O(n)
                current.append(s[start:end + 1])
                backtrack(end + 1, current)
                current.pop()
    
    backtrack(0, [])
    return result
```

---

## Problem 4: Restore IP Addresses

### Problem Statement
Given a string of digits, return all valid IP addresses.

```
Input: "25525511135"
Output: ["255.255.11.135", "255.255.111.35"]
```

### 💻 Code

```python
def restore_ip_addresses(s: str) -> list[str]:
    """
    Restore all valid IP addresses from digit string.
    
    Constraints:
    - 4 segments
    - Each segment: 1-3 digits, value 0-255
    - No leading zeros (except "0" itself)
    
    Time: O(1) - bounded by 3^4 possibilities
    Space: O(1)
    """
    result = []
    
    def is_valid(segment: str) -> bool:
        # Length check
        if len(segment) > 3 or len(segment) == 0:
            return False
        # Leading zero check
        if len(segment) > 1 and segment[0] == '0':
            return False
        # Range check
        return int(segment) <= 255
    
    def backtrack(start: int, segments: list):
        # Pruning: too many/few segments for remaining chars
        remaining = len(s) - start
        needed = 4 - len(segments)
        
        if remaining < needed or remaining > needed * 3:
            return
        
        # Base case: 4 segments and used all characters
        if len(segments) == 4:
            if start == len(s):
                result.append('.'.join(segments))
            return
        
        # Try segments of length 1, 2, 3
        for length in range(1, 4):
            if start + length > len(s):
                break
            
            segment = s[start:start + length]
            if is_valid(segment):
                segments.append(segment)
                backtrack(start + length, segments)
                segments.pop()
    
    backtrack(0, [])
    return result

# Example
print(restore_ip_addresses("25525511135"))
# ['255.255.11.135', '255.255.111.35']
```

```javascript
function restoreIpAddresses(s) {
    const result = [];
    
    function isValid(segment) {
        if (segment.length > 3 || segment.length === 0) return false;
        if (segment.length > 1 && segment[0] === '0') return false;
        return parseInt(segment) <= 255;
    }
    
    function backtrack(start, segments) {
        const remaining = s.length - start;
        const needed = 4 - segments.length;
        
        if (remaining < needed || remaining > needed * 3) return;
        
        if (segments.length === 4) {
            if (start === s.length) {
                result.push(segments.join('.'));
            }
            return;
        }
        
        for (let len = 1; len <= 3; len++) {
            if (start + len > s.length) break;
            
            const segment = s.substring(start, start + len);
            if (isValid(segment)) {
                segments.push(segment);
                backtrack(start + len, segments);
                segments.pop();
            }
        }
    }
    
    backtrack(0, []);
    return result;
}
```

---

## ⚡ Complexity Analysis

| Problem | Time | Space | Notes |
|---------|------|-------|-------|
| Letter Combinations |" O(4ⁿ * n) "| O(n) | n digits, max 4 letters each |
| Generate Parentheses |" O(4ⁿ/√n) "| O(n) | Catalan number |
| Palindrome Partition |" O(n * 2ⁿ) "| O(n) | 2ⁿ ways to partition |
| Restore IP |" O(1) "| O(1) | Bounded by 3⁴ = 81 |

---

## 🔄 Variations

| Variation | Description | Problem |
|-----------|-------------|---------|
| **Letter Combinations** | Phone keypad mapping | LC 17 |
| **Generate Parentheses** | Balanced brackets | LC 22 |
| **Palindrome Partition** | Substring validation | LC 131 |
| **Restore IP** | Segment constraints | LC 93 |
| **Word Break II** | Dictionary validation | LC 140 |
| **Expression Add Operators** | Insert +, -, * | LC 282 |

---

## ⚠️ Common Mistakes

### 1. Forgetting Empty Input Check (Letter Combinations)

❌ **Wrong:**
```python
def letter_combinations(digits):
    result = []
    backtrack(0, [])  # Returns [[]] for empty input
```

✅ **Correct:**
```python
def letter_combinations(digits):
    if not digits:
        return []
    # ...
```

### 2. Wrong Parentheses Constraint

❌ **Wrong:**
```python
if close_count < n:  # Can always add close if under n
```

✅ **Correct:**
```python
if close_count < open_count:  # Can only close if there's unmatched open
```

### 3. Not Checking All Lengths (Palindrome Partition)

❌ **Wrong:**
```python
for end in range(start + 1, len(s)):  # Misses single-char palindromes
```

✅ **Correct:**
```python
for end in range(start, len(s)):  # Include single characters
```

### 4. IP Validation Missing Leading Zero Check

❌ **Wrong:**
```python
def is_valid(segment):
    return 0 <= int(segment) <= 255  # "01" passes but shouldn't
```

✅ **Correct:**
```python
def is_valid(segment):
    if len(segment) > 1 and segment[0] == '0':
        return False
    return 0 <= int(segment) <= 255
```

---

## 📝 Practice Problems

### Medium (Learn the pattern)

| Problem | Focus | LeetCode |
|---------|-------|----------|
| Letter Combinations of Phone | Cartesian product | [LC 17](https://leetcode.com/problems/letter-combinations-of-a-phone-number/) |
| Generate Parentheses | Constraint tracking | [LC 22](https://leetcode.com/problems/generate-parentheses/) |
| Palindrome Partitioning | Substring validation | [LC 131](https://leetcode.com/problems/palindrome-partitioning/) |
| Restore IP Addresses | Segment constraints | [LC 93](https://leetcode.com/problems/restore-ip-addresses/) |

### Hard (Master the pattern)

| Problem | Focus | LeetCode |
|---------|-------|----------|
| Word Break II | Dictionary + backtracking | [LC 140](https://leetcode.com/problems/word-break-ii/) |
| Expression Add Operators | Complex constraints | [LC 282](https://leetcode.com/problems/expression-add-operators/) |
| Scramble String | String recursion | [LC 87](https://leetcode.com/problems/scramble-string/) |

<details>
<summary><strong>🧠 Spaced Repetition Schedule</strong></summary>

**Mastery progression:**
1. **Day 1:** Solve LC 17 (Letter Combinations)
2. **Day 2:** Solve LC 22 (Generate Parentheses)
3. **Day 4:** Solve LC 131 (Palindrome Partitioning)
4. **Day 7:** Solve LC 93 (Restore IP)
5. **Day 14:** Review all four without hints
6. **Day 30:** Try LC 140 (Word Break II)

</details>

---

## 🎤 Interview Context

<details>
<summary><strong>How to Communicate in Interviews</strong></summary>

**Letter Combinations opening:**
> "I'll use backtracking to explore all combinations. For each digit, I iterate through its letters, add each to current combination, recurse, and backtrack."

**Generate Parentheses opening:**
> "I'll track open and close counts. I can add open if under n, and add close only if close < open to maintain balance."

**Palindrome Partitioning opening:**
> "At each position, I try all substrings starting there. If a substring is a palindrome, I add it and recurse on the remainder."

**Company Focus:**

| Company | String Backtracking Focus |
|---------|--------------------------|
| Google | Generate Parentheses, IP Addresses |
| Amazon | Letter Combinations |
| Meta | Palindrome Partitioning |
| Microsoft | All common ones |

</details>

---

## ⏱️ Time Estimates

| Activity | Time | Notes |
|----------|------|-------|
| Letter Combinations | 15-20 min | Straightforward |
| Generate Parentheses | 20-25 min | Constraint tracking |
| Palindrome Partitioning | 25-30 min | Substring logic |
| Restore IP | 25-30 min | Multiple validations |
| All four problems | 3-4 hours | First time through |

---

## 💡 Key Insight

> **String backtracking problems all follow the same template, with different constraints:**
> - **Letter Combinations:** Fixed mapping, no constraints
> - **Generate Parentheses:** Track counts (open, close)
> - **Palindrome Partition:** Validate substrings before recursing
> - **Restore IP:** Multiple validity checks (length, leading zero, range)
>
> Master the template once, then focus on identifying the specific constraints for each problem.

---

## 🔗 Related

- [Backtracking Template](../2.2-Backtracking-Template.md) - Foundation
- [Subsets Pattern](./01-Subsets-Pattern.md) - Simpler backtracking
- [Combinations Pattern](./03-Combinations-Pattern.md) - Selection problems
- [Grid Backtracking](../2.4-Grid-Backtracking.md) - Word Search
