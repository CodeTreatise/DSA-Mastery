# Decode Ways (LC 91)

> **Fibonacci with conditions.** This problem extends the pattern by adding validity checks—not every step is valid, which makes the recurrence more nuanced. A favorite in interviews.

---

## 📋 Problem Statement

**LeetCode:** [91. Decode Ways](https://leetcode.com/problems/decode-ways/)

A message containing letters A-Z can be encoded: 'A' = "1", 'B' = "2", ..., 'Z' = "26".

Given a string `s` containing only digits, return the number of ways to decode it.

**Constraints:**
- 1 ≤ s.length ≤ 100
- s contains only digits and may have leading zeros

---

## 🎯 Pattern Recognition

**This is Fibonacci Pattern because:**
- Count ways (like Climbing Stairs)
- At each position: decode 1 digit OR 2 digits
- `dp[i] = dp[i-1] + dp[i-2]` (with validity conditions)

**The twist:**
- Not all single digits are valid ('0' alone is invalid)
- Not all two-digit combinations are valid (must be 10-26)
- Conditions create variations of the recurrence

---

## 📐 Approach Analysis

### Understanding the Recurrence

```
At position i, we can:
1. Decode s[i-1] as single digit (if it's 1-9, not '0')
   → Add dp[i-1] ways
2. Decode s[i-2:i] as two digits (if it's 10-26)
   → Add dp[i-2] ways

dp[i] = (valid_single ? dp[i-1] : 0) + (valid_double ? dp[i-2] : 0)
```

**Visualization:**
```
s = "226"

Position 0 (empty): 1 way (base case)
Position 1 ("2"):   1 way ['B']
Position 2 ("22"):  2 ways ['BB', 'V']
                    - single '2' valid: add dp[1] = 1
                    - double '22' valid: add dp[0] = 1
Position 3 ("226"): 3 ways ['BBF', 'VF', 'BZ']
                    - single '6' valid: add dp[2] = 2
                    - double '26' valid: add dp[1] = 1

Answer: 3
```

### Edge Cases

```
s = "0"     → 0 ways (can't decode '0')
s = "06"    → 0 ways (leading '0' invalid)
s = "10"    → 1 way ['J'] (only two-digit valid)
s = "27"    → 1 way ['BG'] (only single digits valid)
s = "12"    → 2 ways ['AB', 'L']
```

---

## 💻 Solutions

### Solution 1: Tabulation

```python
def num_decodings_table(s: str) -> int:
    """
    dp[i] = ways to decode s[0:i]
    Time: O(n), Space: O(n)
    """
    if not s or s[0] == '0':
        return 0
    
    n = len(s)
    dp = [0] * (n + 1)
    dp[0] = 1  # Empty string: 1 way (base)
    dp[1] = 1  # First char valid (already checked s[0] != '0')
    
    for i in range(2, n + 1):
        # Single digit decode
        if s[i-1] != '0':
            dp[i] += dp[i-1]
        
        # Two digit decode
        two_digit = int(s[i-2:i])
        if 10 <= two_digit <= 26:
            dp[i] += dp[i-2]
    
    return dp[n]
```

### Solution 2: Space Optimized (Optimal)

```python
def num_decodings(s: str) -> int:
    """
    Only need previous 2 values.
    Time: O(n), Space: O(1)
    """
    if not s or s[0] == '0':
        return 0
    
    # prev2 = dp[i-2], prev1 = dp[i-1]
    prev2 = 1  # dp[0]: empty string
    prev1 = 1  # dp[1]: first char (valid since s[0] != '0')
    
    for i in range(2, len(s) + 1):
        curr = 0
        
        # Single digit: s[i-1]
        if s[i-1] != '0':
            curr += prev1
        
        # Two digits: s[i-2:i]
        two_digit = int(s[i-2:i])
        if 10 <= two_digit <= 26:
            curr += prev2
        
        prev2 = prev1
        prev1 = curr
    
    return prev1
```

```javascript
function numDecodings(s) {
    if (!s || s[0] === '0') return 0;
    
    let prev2 = 1;
    let prev1 = 1;
    
    for (let i = 2; i <= s.length; i++) {
        let curr = 0;
        
        // Single digit
        if (s[i-1] !== '0') {
            curr += prev1;
        }
        
        // Two digits
        const twoDigit = parseInt(s.slice(i-2, i));
        if (twoDigit >= 10 && twoDigit <= 26) {
            curr += prev2;
        }
        
        prev2 = prev1;
        prev1 = curr;
    }
    
    return prev1;
}
```

### Solution 3: Memoization

```python
def num_decodings_memo(s: str) -> int:
    """
    Top-down with memoization.
    """
    if not s or s[0] == '0':
        return 0
    
    memo = {}
    
    def helper(idx):
        # Base case: reached end
        if idx == len(s):
            return 1
        
        # Leading zero is invalid
        if s[idx] == '0':
            return 0
        
        if idx in memo:
            return memo[idx]
        
        # Single digit decode
        ways = helper(idx + 1)
        
        # Two digit decode
        if idx + 1 < len(s) and int(s[idx:idx+2]) <= 26:
            ways += helper(idx + 2)
        
        memo[idx] = ways
        return ways
    
    return helper(0)
```

---

## ⚡ Complexity Analysis

| Approach | Time | Space |
|----------|------|-------|
| Tabulation | O(n) | O(n) |
| **Space Optimized** | **O(n)** | **O(1)** |
| Memoization | O(n) | O(n) |

---

## ⚠️ Common Mistakes

### 1. Not Handling '0' Correctly

**❌ Wrong:**
```python
# Treating '0' as valid single digit
if s[i-1]:  # Always truthy for string char!
    dp[i] += dp[i-1]
```

**✅ Correct:**
```python
if s[i-1] != '0':  # '0' is not a valid single digit encoding
    dp[i] += dp[i-1]
```

### 2. Two-Digit Range Wrong

**❌ Wrong:**
```python
if 1 <= two_digit <= 26:  # Allows "01", "02", etc.
```

**✅ Correct:**
```python
if 10 <= two_digit <= 26:  # "01" is invalid, use "1" instead
```

### 3. Off-by-One with String Indices

**❌ Wrong:**
```python
for i in range(1, n + 1):
    single = s[i]  # IndexError at i = n!
```

**✅ Correct:**
```python
for i in range(2, n + 1):
    single = s[i-1]  # 1-indexed dp, but 0-indexed string
```

### 4. Not Returning 0 for Invalid Strings

**❌ Wrong:**
```python
def num_decodings(s):
    # Doesn't check s[0] == '0' upfront
    ...
    # Returns garbage for "0123"
```

**✅ Correct:**
```python
def num_decodings(s):
    if not s or s[0] == '0':
        return 0  # Can't decode if starts with '0'
```

---

## 🔄 Variations

### Decode Ways II (with Wildcards)

**Problem:** s can contain '*' (wildcard for 1-9).

```python
def num_decodings_ii(s: str) -> int:
    """
    * can be 1-9 for single, or part of 1*-2* for double.
    MOD = 10^9 + 7
    """
    MOD = 10**9 + 7
    
    if not s or s[0] == '0':
        return 0
    
    # Single digit possibilities
    def single(c):
        if c == '*':
            return 9  # 1-9
        elif c == '0':
            return 0
        else:
            return 1
    
    # Two digit possibilities
    def double(c1, c2):
        if c1 == '*' and c2 == '*':
            return 15  # 11-19 (9) + 21-26 (6)
        elif c1 == '*':
            if c2 <= '6':
                return 2  # 1X, 2X
            else:
                return 1  # only 1X
        elif c2 == '*':
            if c1 == '1':
                return 9  # 11-19
            elif c1 == '2':
                return 6  # 21-26
            else:
                return 0
        else:
            num = int(c1 + c2)
            return 1 if 10 <= num <= 26 else 0
    
    prev2 = 1
    prev1 = single(s[0])
    
    for i in range(1, len(s)):
        curr = 0
        curr += single(s[i]) * prev1
        curr += double(s[i-1], s[i]) * prev2
        curr %= MOD
        prev2 = prev1
        prev1 = curr
    
    return prev1
```

---

## 📝 Trace Through Examples

### Example 1: s = "12"

```
i=0: prev2 = 1, prev1 = 1 (base cases)
i=2: 
  - s[1] = '2' != '0': curr = prev1 = 1
  - s[0:2] = "12" → 12 in [10,26]: curr += prev2 = 2
  Answer: 2 ["AB", "L"]
```

### Example 2: s = "226"

```
i=0: prev2 = 1, prev1 = 1
i=2: 
  - '2' valid: curr = 1
  - "22" = 22 valid: curr = 2
  prev2 = 1, prev1 = 2
i=3:
  - '6' valid: curr = prev1 = 2
  - "26" = 26 valid: curr += prev2 = 3
  Answer: 3 ["BBF", "BZ", "VF"]
```

### Example 3: s = "06"

```
s[0] = '0' → return 0 immediately
(leading zero invalid)
```

### Example 4: s = "10"

```
i=0: prev2 = 1, prev1 = 1
i=2:
  - s[1] = '0' not valid: curr = 0
  - "10" = 10 valid: curr += prev2 = 1
  Answer: 1 ["J"]
```

---

## 📝 Related Problems

- [ ] [Climbing Stairs](https://leetcode.com/problems/climbing-stairs/) - Simpler version
- [ ] [Decode Ways II](https://leetcode.com/problems/decode-ways-ii/) - With wildcards
- [ ] [Number of Ways to Separate Numbers](https://leetcode.com/problems/number-of-ways-to-separate-numbers/) - Harder

---

## 🎤 Interview Tips

**Time to solve:** 15-25 minutes

**Communication template:**
> "This is similar to Climbing Stairs—I can decode 1 or 2 digits at a time. The key difference is validity: single digit can't be '0', and two digits must be 10-26. I'll use dp[i] for ways to decode first i characters. The recurrence adds valid options."

**Common follow-ups:**
- "What if there are wildcards?" → Decode Ways II
- "What are the edge cases?" → Leading zero, consecutive zeros, numbers > 26

**What interviewers evaluate:**
1. Handling '0' correctly (major pitfall)
2. Range check for two digits (10-26, not 1-26)
3. Clear base cases
4. Clean code with O(1) space

---

> **💡 Key Insight:** This is "Fibonacci with conditions." The structure is `dp[i] = dp[i-1] + dp[i-2]`, but each term is only added if the corresponding decode is valid. Handling '0' is the main pitfall—it's invalid alone but valid as part of "10" or "20".

> **🔗 Related:** [Climbing Stairs](./01-Climbing-Stairs-LC70.md) | [House Robber](./02-House-Robber-LC198.md) | [Fibonacci Pattern](../4.1-Fibonacci-Pattern-Overview.md)
