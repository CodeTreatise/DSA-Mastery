# Edit Distance (LC 72)

> **The quintessential interview DP problem.** Edit Distance (Levenshtein Distance) is asked at every major tech company. It elegantly demonstrates how to handle three types of operations (insert, delete, replace) in a single DP framework.

---

## 📋 Problem Statement

**LeetCode:** [72. Edit Distance](https://leetcode.com/problems/edit-distance/)

Given two strings `word1` and `word2`, return the minimum number of operations required to convert `word1` to `word2`.

You have three operations:
- Insert a character
- Delete a character  
- Replace a character

**Examples:**
```
Input: word1 = "horse", word2 = "ros"
Output: 3
Explanation: 
horse → rorse (replace 'h' with 'r')
rorse → rose (delete 'r')
rose → ros (delete 'e')

Input: word1 = "intention", word2 = "execution"
Output: 5
```

**Constraints:**
- 0 ≤ word1.length, word2.length ≤ 500
- word1 and word2 consist of lowercase English letters

---

## 🎯 Pattern Recognition

**This is LCS-style DP because:**
- Two sequences to compare
- Character-by-character decisions
- Optimal substructure (min ops for prefixes)

**Difference from LCS:**
- LCS: maximize matches (counting)
- Edit Distance: minimize operations (cost)

**Key insight:**
```
If s1[i] == s2[j]:
    No operation needed, move diagonally
Else:
    Try all 3 operations, take minimum:
    - Replace: dp[i-1][j-1] + 1
    - Delete:  dp[i-1][j] + 1
    - Insert:  dp[i][j-1] + 1
```

---

## 📐 Approach Analysis

### DP State Definition

```
dp[i][j] = minimum operations to convert word1[0:i] to word2[0:j]

Base cases:
  dp[0][j] = j  (insert j characters into empty string)
  dp[i][0] = i  (delete i characters to get empty string)

Recurrence:
  if word1[i-1] == word2[j-1]:
      dp[i][j] = dp[i-1][j-1]  (no operation)
  else:
      dp[i][j] = 1 + min(
          dp[i-1][j-1],  # Replace
          dp[i-1][j],    # Delete from word1
          dp[i][j-1]     # Insert into word1
      )
```

### Visualization

```
         ""   r    o    s
    ""    0   1    2    3     ← Insert operations
    h     1   1    2    3
    o     2   2    1    2     ← 'o' matches!
    r     3   2    2    2
    s     4   3    3    2     ← 's' matches!
    e     5   4    4    3

Answer: 3 (replace h→r, delete r, delete e)
```

---

## 💻 Solutions

### Solution 1: Standard 2D DP

```python
def min_distance(word1: str, word2: str) -> int:
    """
    Classic Edit Distance with 2D DP.
    Time: O(m × n), Space: O(m × n)
    """
    m, n = len(word1), len(word2)
    
    # dp[i][j] = min ops to convert word1[0:i] to word2[0:j]
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    
    # Base cases
    for i in range(m + 1):
        dp[i][0] = i  # Delete all chars from word1
    for j in range(n + 1):
        dp[0][j] = j  # Insert all chars into word1
    
    # Fill DP table
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if word1[i-1] == word2[j-1]:
                # Characters match: no operation needed
                dp[i][j] = dp[i-1][j-1]
            else:
                # Take minimum of three operations
                dp[i][j] = 1 + min(
                    dp[i-1][j-1],  # Replace word1[i-1] with word2[j-1]
                    dp[i-1][j],    # Delete word1[i-1]
                    dp[i][j-1]     # Insert word2[j-1] after word1[i-1]
                )
    
    return dp[m][n]
```

```javascript
function minDistance(word1, word2) {
    const m = word1.length, n = word2.length;
    
    const dp = Array.from({length: m + 1}, 
                          () => new Array(n + 1).fill(0));
    
    // Base cases
    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;
    
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (word1[i-1] === word2[j-1]) {
                dp[i][j] = dp[i-1][j-1];
            } else {
                dp[i][j] = 1 + Math.min(
                    dp[i-1][j-1],  // replace
                    dp[i-1][j],    // delete
                    dp[i][j-1]     // insert
                );
            }
        }
    }
    
    return dp[m][n];
}
```

### Solution 2: Space-Optimized (Two Rows)

```python
def min_distance_optimized(word1: str, word2: str) -> int:
    """
    Space-optimized: only keep two rows.
    Time: O(m × n), Space: O(n)
    """
    m, n = len(word1), len(word2)
    
    # Ensure word2 is shorter for space efficiency
    if m < n:
        return min_distance_optimized(word2, word1)
    
    prev = list(range(n + 1))  # dp[i-1][*]
    curr = [0] * (n + 1)        # dp[i][*]
    
    for i in range(1, m + 1):
        curr[0] = i  # Base case: delete i chars
        
        for j in range(1, n + 1):
            if word1[i-1] == word2[j-1]:
                curr[j] = prev[j-1]
            else:
                curr[j] = 1 + min(prev[j-1], prev[j], curr[j-1])
        
        prev, curr = curr, prev
    
    return prev[n]
```

### Solution 3: One Row (Diagonal Tracking)

```python
def min_distance_one_row(word1: str, word2: str) -> int:
    """
    Single row with diagonal variable.
    Time: O(m × n), Space: O(n)
    """
    m, n = len(word1), len(word2)
    
    if m < n:
        return min_distance_one_row(word2, word1)
    
    dp = list(range(n + 1))
    
    for i in range(1, m + 1):
        prev_diag = dp[0]  # dp[i-1][0]
        dp[0] = i  # Base case
        
        for j in range(1, n + 1):
            temp = dp[j]  # Save dp[i-1][j]
            if word1[i-1] == word2[j-1]:
                dp[j] = prev_diag
            else:
                dp[j] = 1 + min(prev_diag, dp[j], dp[j-1])
            prev_diag = temp
    
    return dp[n]
```

### Solution 4: Top-Down Memoization

```python
def min_distance_memo(word1: str, word2: str) -> int:
    """Recursive with memoization."""
    from functools import lru_cache
    
    @lru_cache(maxsize=None)
    def helper(i, j):
        # Base cases
        if i == 0:
            return j  # Insert j characters
        if j == 0:
            return i  # Delete i characters
        
        if word1[i-1] == word2[j-1]:
            return helper(i-1, j-1)
        
        return 1 + min(
            helper(i-1, j-1),  # Replace
            helper(i-1, j),    # Delete
            helper(i, j-1)     # Insert
        )
    
    return helper(len(word1), len(word2))
```

---

## ⚡ Complexity Analysis

| Approach | Time | Space |
|----------|------|-------|
| 2D DP | O(m × n) | O(m × n) |
| Two Rows | O(m × n) | O(min(m, n)) |
| One Row | O(m × n) | O(min(m, n)) |
| Memoization | O(m × n) | O(m × n) |

---

## 📊 Understanding the Three Operations

### Visual Guide

```
word1 = "ABCD", word2 = "AEF"

At position (i=2, j=2): word1[1]='B', word2[1]='E'

1. REPLACE 'B' with 'E':
   "ABCD" → "AECD"
   Cost: dp[1][1] + 1 (diagonal + 1)
   
2. DELETE 'B' from word1:
   "ABCD" → "ACD"
   Cost: dp[1][2] + 1 (up + 1)
   Now word1[0:1] needs to become word2[0:2]
   
3. INSERT 'E' into word1:
   "ABCD" → "AEBCD"
   Cost: dp[2][1] + 1 (left + 1)
   Now word1[0:2] needs to become word2[0:1]
```

### Why These Transitions Work

```
dp[i-1][j-1] + 1: Replace
  We've matched word1[0:i-1] with word2[0:j-1]
  Replace word1[i-1] with word2[j-1] → one operation

dp[i-1][j] + 1: Delete
  We've matched word1[0:i-1] with word2[0:j]
  Delete word1[i-1] → one operation
  
dp[i][j-1] + 1: Insert
  We've matched word1[0:i] with word2[0:j-1]
  Insert word2[j-1] → one operation
```

---

## ⚠️ Common Mistakes

### 1. Forgetting Base Cases

**❌ Wrong:**
```python
dp = [[0] * (n + 1) for _ in range(m + 1)]
# Empty strings require operations!
```

**✅ Correct:**
```python
dp = [[0] * (n + 1) for _ in range(m + 1)]
for i in range(m + 1):
    dp[i][0] = i  # Delete all
for j in range(n + 1):
    dp[0][j] = j  # Insert all
```

### 2. Wrong Operation Understanding

**❌ Wrong thinking:**
```python
# "Insert" means inserting into word2
```

**✅ Correct thinking:**
```python
# All operations are on word1 to transform it into word2
# Insert: add character to word1
# Delete: remove character from word1
# Replace: change character in word1
```

### 3. Not Including +1 for Operations

**❌ Wrong:**
```python
dp[i][j] = min(dp[i-1][j-1], dp[i-1][j], dp[i][j-1])
# Missing the cost of the operation!
```

**✅ Correct:**
```python
dp[i][j] = 1 + min(dp[i-1][j-1], dp[i-1][j], dp[i][j-1])
```

### 4. Adding +1 on Match

**❌ Wrong:**
```python
if word1[i-1] == word2[j-1]:
    dp[i][j] = dp[i-1][j-1] + 1  # No operation needed!
```

**✅ Correct:**
```python
if word1[i-1] == word2[j-1]:
    dp[i][j] = dp[i-1][j-1]  # No operation = no +1
```

---

## 📊 Trace Through Example

```
word1 = "horse", word2 = "ros"

Base cases filled:
         ""   r    o    s
    ""    0   1    2    3
    h     1   
    o     2   
    r     3   
    s     4   
    e     5   

Row 'h' (i=1):
  j=1: 'h'≠'r' → 1+min(dp[0][0], dp[0][1], dp[1][0]) = 1+min(0,1,1) = 1
  j=2: 'h'≠'o' → 1+min(dp[0][1], dp[0][2], dp[1][1]) = 1+min(1,2,1) = 2
  j=3: 'h'≠'s' → 1+min(dp[0][2], dp[0][3], dp[1][2]) = 1+min(2,3,2) = 3

Row 'o' (i=2):
  j=2: 'o'=='o' → dp[1][1] = 1 ⭐ Match!

Row 's' (i=4):
  j=3: 's'=='s' → dp[3][2] = 2 ⭐ Match!

Final answer: dp[5][3] = 3
```

---

## 🔄 Variations

### Edit Distance with Different Costs

```python
def weighted_edit_distance(word1: str, word2: str, 
                           insert_cost=1, delete_cost=1, replace_cost=1) -> int:
    """Edit distance with custom operation costs."""
    m, n = len(word1), len(word2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    
    for i in range(m + 1):
        dp[i][0] = i * delete_cost
    for j in range(n + 1):
        dp[0][j] = j * insert_cost
    
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if word1[i-1] == word2[j-1]:
                dp[i][j] = dp[i-1][j-1]
            else:
                dp[i][j] = min(
                    dp[i-1][j-1] + replace_cost,
                    dp[i-1][j] + delete_cost,
                    dp[i][j-1] + insert_cost
                )
    
    return dp[m][n]
```

### Edit Distance with Only Insert/Delete

```python
def delete_operations(word1: str, word2: str) -> int:
    """LC 583: Min deletions to make equal (no replace)."""
    lcs = longest_common_subsequence(word1, word2)
    return len(word1) + len(word2) - 2 * lcs
```

### One Edit Distance (LC 161)

```python
def is_one_edit_distance(s: str, t: str) -> bool:
    """Check if exactly one edit apart."""
    m, n = len(s), len(t)
    if abs(m - n) > 1:
        return False
    if m > n:
        s, t = t, s
        m, n = n, m
    
    for i in range(m):
        if s[i] != t[i]:
            if m == n:
                return s[i+1:] == t[i+1:]  # Replace
            else:
                return s[i:] == t[i+1:]    # Insert/Delete
    
    return n - m == 1  # Extra char at end
```

---

## 📝 Related Problems

| Problem | Difficulty | Note |
|---------|------------|------|
| [583. Delete Operation for Two Strings](https://leetcode.com/problems/delete-operation-for-two-strings/) | Medium | No replace |
| [712. Minimum ASCII Delete Sum](https://leetcode.com/problems/minimum-ascii-delete-sum-for-two-strings/) | Medium | Weighted deletes |
| [161. One Edit Distance](https://leetcode.com/problems/one-edit-distance/) | Medium | Check if exactly 1 |
| [1035. Uncrossed Lines](https://leetcode.com/problems/uncrossed-lines/) | Medium | LCS variant |

---

## 🎤 Interview Tips

**Time to solve:** 20-25 minutes

**Communication template:**
> "I'll use dp[i][j] for minimum operations to convert word1[0:i] to word2[0:j]. Base cases: converting to/from empty string costs i or j operations. When characters match, no operation needed. Otherwise, I try all three operations and take minimum."

**Key points to mention:**
1. Three operations: insert, delete, replace
2. All operations on word1 to transform to word2
3. Base cases are crucial (empty strings)

**Drawing the grid:**
```
Always draw a small example grid!
Show the base case row and column.
Trace through 2-3 cells.
```

**Company frequency:**
| Company | Frequency |
|---------|-----------|
| Amazon | ⭐⭐⭐⭐⭐ |
| Google | ⭐⭐⭐⭐⭐ |
| Meta | ⭐⭐⭐⭐ |
| Microsoft | ⭐⭐⭐⭐ |
| Bloomberg | ⭐⭐⭐⭐ |

---

> **💡 Key Insight:** The three operations elegantly map to three directions in the DP grid: diagonal (replace), up (delete), left (insert). When characters match, you get a "free" move diagonally. This is why Edit Distance is sometimes called "grid DP" despite being about strings.

> **🔗 Related:** [LCS Fundamentals](../6.5-LCS-Fundamentals.md) | [LCS Problem](./01-LCS-LC1143.md) | [Longest Palindromic Subsequence](./03-Longest-Palindromic-Subseq-LC516.md)
