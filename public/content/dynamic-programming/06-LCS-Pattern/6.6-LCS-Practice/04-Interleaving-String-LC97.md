# Interleaving String (LC 97)

> **Can two strings weave together to form a third?** This problem is a beautiful application of 2D DP where we track progress through both source strings simultaneously. It tests your understanding of state design and transition logic.

---

## 📋 Problem Statement

**LeetCode:** [97. Interleaving String](https://leetcode.com/problems/interleaving-string/)

Given strings `s1`, `s2`, and `s3`, find whether `s3` is formed by an interleaving of `s1` and `s2`.

An **interleaving** of two strings s and t is a configuration where s and t are divided into n and m substrings respectively, such that:
- s = s1 + s2 + ... + sn
- t = t1 + t2 + ... + tm
- |n - m| ≤ 1
- The interleaving is s1 + t1 + s2 + t2 + s3 + t3 + ... or t1 + s1 + t2 + s2 + t3 + s3 + ...

**Examples:**
```
Input: s1 = "aabcc", s2 = "dbbca", s3 = "aadbbcbcac"
Output: true
Explanation: s3 can be formed by interleaving s1 and s2:
  "aa" + "dbbc" + "bc" + "a" + "c"
   ^^     ^^^^    ^^     ^     ^
   s1      s2     s1    s2    s1

Input: s1 = "aabcc", s2 = "dbbca", s3 = "aadbbbaccc"
Output: false

Input: s1 = "", s2 = "", s3 = ""
Output: true
```

**Constraints:**
- 0 ≤ s1.length, s2.length ≤ 100
- 0 ≤ s3.length ≤ 200
- s1, s2, and s3 consist of lowercase English letters

---

## 🎯 Pattern Recognition

<details>
<summary><strong>How to Identify This Problem</strong></summary>

**This is 2D DP on strings because:**
- Two source strings → two dimensions
- Need to track progress in both strings
- Subproblem: can we form s3[0:i+j] using s1[0:i] and s2[0:j]?

**Similar to LCS but different:**
- LCS: finding common subsequence
- Interleaving: checking if concatenation order works

**Key Observation:**
- If we've used i chars from s1 and j chars from s2
- We must be at position (i+j) in s3
- Current s3 char must match either s1[i] or s2[j]

</details>

---

## ✅ When to Use This Approach

- Combining two sequences in order
- Tracking progress through multiple sources
- "Can X be formed from Y and Z"

## ❌ When NOT to Use

| Situation | Use Instead |
|-----------|-------------|
| Finding longest common part | LCS |
| Order doesn't matter | Counting/multiset |
| More than 2 source strings | Higher-dimension DP (rare) |

---

## 📐 State Definition

**State:** `dp[i][j]` = Can we form `s3[0:i+j]` using `s1[0:i]` and `s2[0:j]`?

**Transition:**
```python
dp[i][j] = (
    (dp[i-1][j] and s1[i-1] == s3[i+j-1])  # Take from s1
    or
    (dp[i][j-1] and s2[j-1] == s3[i+j-1])  # Take from s2
)
```

**Visual:**
```
s1 = "ab"    s2 = "cd"    s3 = "acbd"

         j (s2 index)
         0   1   2
        ""  "c" "cd"
    ┌───────────────
  0 | T   F   F       dp[0][0] = True (empty matches empty)
i 1 | T   T   F       dp[1][1] = True (a+c = "ac" matches s3[0:2])
  2 | F   T   T       dp[2][2] = True ("ab"+"cd" can form "acbd")
    
 s1: "" "a" "ab"
```

---

## 💻 Solution 1: 2D DP

```python
def isInterleave(s1: str, s2: str, s3: str) -> bool:
    """
    Check if s3 is interleaving of s1 and s2.
    
    dp[i][j] = can form s3[0:i+j] using s1[0:i] and s2[0:j]
    
    Time: O(m*n), Space: O(m*n)
    """
    m, n, l = len(s1), len(s2), len(s3)
    
    # Quick length check
    if m + n != l:
        return False
    
    # dp[i][j] = can we form s3[0:i+j] from s1[0:i] and s2[0:j]
    dp = [[False] * (n + 1) for _ in range(m + 1)]
    
    # Base case: empty strings
    dp[0][0] = True
    
    # First column: only using s1
    for i in range(1, m + 1):
        dp[i][0] = dp[i-1][0] and s1[i-1] == s3[i-1]
    
    # First row: only using s2
    for j in range(1, n + 1):
        dp[0][j] = dp[0][j-1] and s2[j-1] == s3[j-1]
    
    # Fill rest of table
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            # Current position in s3
            k = i + j - 1
            
            # Take from s1 or take from s2
            dp[i][j] = (
                (dp[i-1][j] and s1[i-1] == s3[k]) or
                (dp[i][j-1] and s2[j-1] == s3[k])
            )
    
    return dp[m][n]
```

```javascript
function isInterleave(s1, s2, s3) {
    const m = s1.length, n = s2.length, l = s3.length;
    
    // Quick length check
    if (m + n !== l) return false;
    
    // dp[i][j] = can form s3[0:i+j] from s1[0:i] and s2[0:j]
    const dp = Array.from({length: m + 1}, () => 
        Array(n + 1).fill(false)
    );
    
    dp[0][0] = true;
    
    // First column: only using s1
    for (let i = 1; i <= m; i++) {
        dp[i][0] = dp[i-1][0] && s1[i-1] === s3[i-1];
    }
    
    // First row: only using s2
    for (let j = 1; j <= n; j++) {
        dp[0][j] = dp[0][j-1] && s2[j-1] === s3[j-1];
    }
    
    // Fill rest
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            const k = i + j - 1;
            dp[i][j] = (
                (dp[i-1][j] && s1[i-1] === s3[k]) ||
                (dp[i][j-1] && s2[j-1] === s3[k])
            );
        }
    }
    
    return dp[m][n];
}
```

---

## 💻 Solution 2: Space-Optimized (1D)

```python
def isInterleave(s1: str, s2: str, s3: str) -> bool:
    """
    Space-optimized: only keep current row.
    
    Time: O(m*n), Space: O(n)
    """
    m, n, l = len(s1), len(s2), len(s3)
    
    if m + n != l:
        return False
    
    # Optimization: use shorter string for columns
    if m < n:
        s1, s2, m, n = s2, s1, n, m
    
    dp = [False] * (n + 1)
    dp[0] = True
    
    # First row (only s2)
    for j in range(1, n + 1):
        dp[j] = dp[j-1] and s2[j-1] == s3[j-1]
    
    # Fill row by row
    for i in range(1, m + 1):
        # First column of this row
        dp[0] = dp[0] and s1[i-1] == s3[i-1]
        
        for j in range(1, n + 1):
            k = i + j - 1
            dp[j] = (
                (dp[j] and s1[i-1] == s3[k]) or      # From top (old dp[j])
                (dp[j-1] and s2[j-1] == s3[k])       # From left
            )
    
    return dp[n]
```

---

## 💻 Solution 3: Memoized DFS

```python
def isInterleave(s1: str, s2: str, s3: str) -> bool:
    """
    Top-down with memoization.
    Sometimes clearer for interviews.
    
    Time: O(m*n), Space: O(m*n)
    """
    m, n, l = len(s1), len(s2), len(s3)
    
    if m + n != l:
        return False
    
    from functools import lru_cache
    
    @lru_cache(maxsize=None)
    def dfs(i: int, j: int) -> bool:
        """Can we form s3[i+j:] using s1[i:] and s2[j:]?"""
        # Base: consumed all characters
        if i == m and j == n:
            return True
        
        k = i + j  # Current position in s3
        
        # Try taking from s1
        if i < m and s1[i] == s3[k] and dfs(i + 1, j):
            return True
        
        # Try taking from s2
        if j < n and s2[j] == s3[k] and dfs(i, j + 1):
            return True
        
        return False
    
    return dfs(0, 0)
```

```javascript
function isInterleave(s1, s2, s3) {
    const m = s1.length, n = s2.length;
    
    if (m + n !== s3.length) return false;
    
    const memo = new Map();
    
    function dfs(i, j) {
        if (i === m && j === n) return true;
        
        const key = `${i},${j}`;
        if (memo.has(key)) return memo.get(key);
        
        const k = i + j;
        let result = false;
        
        if (i < m && s1[i] === s3[k] && dfs(i + 1, j)) {
            result = true;
        } else if (j < n && s2[j] === s3[k] && dfs(i, j + 1)) {
            result = true;
        }
        
        memo.set(key, result);
        return result;
    }
    
    return dfs(0, 0);
}
```

---

## 🔄 Trace Example

```
s1 = "aab", s2 = "axy", s3 = "aaxaby"

Check length: 3 + 3 = 6 ✓

DP Table:
         ""    "a"   "ax"  "axy"
         j=0   j=1   j=2   j=3
    ┌────────────────────────────
 "" │ T     T     F     F      
i=0 │                          
    │                          
"a" │ T     T     T     F      
i=1 │       ↑s3[1]='a'         
    │       matches s1[0]      
    │                          
"aa"│ F     T     T     T      
i=2 │       ↑     ↑            
    │                          
"aab"│F     F     T     T ✓    
i=3 │             ↑'b'=s3[5]   

Result: True
```

---

## ⚡ Complexity Analysis

| Approach | Time | Space |
|----------|------|-------|
| 2D DP | O(m×n) | O(m×n) |
| 1D DP | O(m×n) | O(min(m,n)) |
| Memoized DFS | O(m×n) | O(m×n) |

**Why O(m×n):** Each (i,j) pair computed once, O(1) work per pair.

---

## ⚠️ Common Mistakes

### 1. Forgetting Length Check
```python
# ❌ Wrong: Skip validation
def isInterleave(s1, s2, s3):
    # Start DP without checking...

# ✅ Correct: Early exit
if len(s1) + len(s2) != len(s3):
    return False
```

### 2. Wrong Index for s3
```python
# ❌ Wrong: Using i or j as s3 index
s3[i]  # or s3[j]

# ✅ Correct: s3 index is i+j-1 (0-indexed for used chars)
k = i + j - 1  # When checking dp[i][j]
s3[k]
```

### 3. Confusing 0-indexed vs 1-indexed
```python
# ❌ Wrong: Mixing up indices
dp[i][j] represents s1[0:i-1]  # Confusing

# ✅ Correct: Be consistent
# dp[i][j] = using first i chars of s1, first j chars of s2
# So compare s1[i-1] and s2[j-1] (0-indexed)
```

### 4. Not Handling Empty Strings
```python
# ❌ Wrong: Assuming non-empty
for i in range(1, m + 1):  # Misses base cases

# ✅ Correct: Initialize first row/column
dp[0][0] = True
for i in range(1, m + 1):
    dp[i][0] = dp[i-1][0] and s1[i-1] == s3[i-1]
```

---

## 🔗 Related Problems

| Problem | Similarity | Key Difference |
|---------|------------|----------------|
| [1143. LCS](https://leetcode.com/problems/longest-common-subsequence/) | 2D string DP | Finding common vs matching combined |
| [72. Edit Distance](https://leetcode.com/problems/edit-distance/) | 2D string DP | Transforming vs combining |
| [115. Distinct Subsequences](https://leetcode.com/problems/distinct-subsequences/) | 2D string DP | Counting vs checking |

---

## 📝 Practice Problems

| Problem | Difficulty | Key Insight |
|---------|------------|-------------|
| [97. Interleaving String](https://leetcode.com/problems/interleaving-string/) | Medium | 2D DP, i+j = position in s3 |
| [115. Distinct Subsequences](https://leetcode.com/problems/distinct-subsequences/) | Hard | Similar state tracking |
| [44. Wildcard Matching](https://leetcode.com/problems/wildcard-matching/) | Hard | Pattern matching DP |

---

## 🎤 Interview Tips

<details>
<summary><strong>How to Present This Solution</strong></summary>

**Opening:**
> "We need to check if s3 can be formed by interleaving s1 and s2. I'll use 2D DP where dp[i][j] represents whether we can form the first i+j characters of s3 using the first i characters of s1 and first j characters of s2."

**Key Insight:**
> "The key observation is that if we've used i chars from s1 and j chars from s2, we must be at position i+j in s3. So we just need to check if the current s3 character matches either the next s1 or s2 character."

**Optimization:**
> "We can reduce space to O(min(m,n)) since each row only depends on the previous row and current row values."

</details>

**Company Focus:**
| Company | Frequency | Notes |
|---------|-----------|-------|
| Google | ⭐⭐⭐ | Classic DP interview problem |
| Amazon | ⭐⭐ | May appear in phone screens |
| Meta | ⭐⭐ | Tests 2D DP understanding |

---

> **💡 Key Insight:** The position in s3 is always i+j when we've used i chars from s1 and j chars from s2. This constraint makes the DP work: we just need to check which source string can provide the next character.

> **🔗 Related:** [LCS Fundamentals](../6.5-LCS-Fundamentals.md) | [Edit Distance](./02-Edit-Distance-LC72.md) | [Distinct Subsequences](../../10-String-DP/10.2-String-Practice/02-Distinct-Subsequences-LC115.md)
