# Coin Change II (LC 518)

> **Count COMBINATIONS to make an amount.** This is Coin Change's cousin that asks "how many ways" instead of "minimum coins." The key difference: loop order matters for combinations vs permutations!

---

## 📋 Problem Statement

**LeetCode:** [518. Coin Change II](https://leetcode.com/problems/coin-change-ii/)

You are given an integer array `coins` representing coins of different denominations and an integer `amount` representing a total amount of money.

Return the number of combinations that make up that amount. If that amount cannot be made up by any combination of the coins, return 0.

You may assume that you have an infinite number of each kind of coin.

The answer is guaranteed to fit into a signed 32-bit integer.

**Constraints:**
- 1 ≤ coins.length ≤ 300
- 1 ≤ coins[i] ≤ 5000
- All values of coins are unique
- 0 ≤ amount ≤ 5000

---

## 🎯 Pattern Recognition

**This is Unbounded Knapsack because:**
- Infinite supply of each coin
- Counting ways to reach capacity (amount)
- Each coin can be used multiple times

**Difference from Coin Change I:**
- Coin Change: **minimize** coins → use `min()`
- Coin Change II: **count** ways → use `+=`

**Critical insight:**
- Combinations: {1,2} and {2,1} are the SAME
- Permutations: {1,2} and {2,1} are DIFFERENT
- Loop order determines which we count!

---

## 📐 Approach Analysis

### Why Loop Order Matters

**Coins outer loop → COMBINATIONS:**
```python
for coin in coins:          # Pick coin type first
    for a in range(coin, amount + 1):
        dp[a] += dp[a - coin]
```
This processes all uses of coin 1, then all uses of coin 2, etc.
So we never count "1 then 2" and "2 then 1" separately.

**Amount outer loop → PERMUTATIONS:**
```python
for a in range(1, amount + 1):    # Pick amount first
    for coin in coins:
        if coin <= a:
            dp[a] += dp[a - coin]
```
At each amount, we consider all ways to get there.
"1 then 2" and "2 then 1" are counted separately.

---

## 💻 Solutions

### Solution 1: Bottom-Up Combinations (Correct)

```python
def change(amount: int, coins: list[int]) -> int:
    """
    Count combinations to make amount.
    Coins outer loop = combinations (not permutations).
    Time: O(n × amount), Space: O(amount)
    """
    dp = [0] * (amount + 1)
    dp[0] = 1  # One way to make 0: use nothing
    
    # Coins outer → combinations
    for coin in coins:
        for a in range(coin, amount + 1):
            dp[a] += dp[a - coin]
    
    return dp[amount]
```

```javascript
function change(amount, coins) {
    const dp = new Array(amount + 1).fill(0);
    dp[0] = 1;
    
    // Coins outer → combinations
    for (const coin of coins) {
        for (let a = coin; a <= amount; a++) {
            dp[a] += dp[a - coin];
        }
    }
    
    return dp[amount];
}
```

### Solution 2: Top-Down with Memoization

```python
def change_memo(amount: int, coins: list[int]) -> int:
    """
    Recursive with memoization.
    """
    from functools import lru_cache
    
    @lru_cache(maxsize=None)
    def helper(remaining, idx):
        """Count ways using coins[idx:] to make remaining."""
        if remaining == 0:
            return 1
        if remaining < 0 or idx >= len(coins):
            return 0
        
        # Either use this coin or skip to next
        use_it = helper(remaining - coins[idx], idx)  # Can reuse
        skip_it = helper(remaining, idx + 1)
        
        return use_it + skip_it
    
    return helper(amount, 0)
```

### Solution 3: 2D DP (Clearer Logic)

```python
def change_2d(amount: int, coins: list[int]) -> int:
    """
    2D DP for clearer understanding.
    dp[i][a] = ways using coins[0:i] to make amount a
    """
    n = len(coins)
    dp = [[0] * (amount + 1) for _ in range(n + 1)]
    
    # Base case: 1 way to make 0
    for i in range(n + 1):
        dp[i][0] = 1
    
    for i in range(1, n + 1):
        coin = coins[i - 1]
        for a in range(amount + 1):
            dp[i][a] = dp[i - 1][a]  # Don't use this coin
            if a >= coin:
                dp[i][a] += dp[i][a - coin]  # Use this coin
    
    return dp[n][amount]
```

---

## ⚡ Complexity Analysis

| Approach | Time | Space |
|----------|------|-------|
| 1D DP | O(n × amount) | O(amount) |
| Top-Down | O(n × amount) | O(n × amount) |
| 2D DP | O(n × amount) | O(n × amount) |

**Why 1D works:**
- We only need the previous row's data
- Forward iteration updates current row in-place

---

## ⚠️ Common Mistakes

### 1. Loop Order → Permutations Instead of Combinations

**❌ Wrong (counts permutations):**
```python
for a in range(1, amount + 1):
    for coin in coins:
        if coin <= a:
            dp[a] += dp[a - coin]
# Counts {1,2} and {2,1} as different!
```

**✅ Correct (counts combinations):**
```python
for coin in coins:
    for a in range(coin, amount + 1):
        dp[a] += dp[a - coin]
# {1,2} and {2,1} are the same combination
```

### 2. Wrong Base Case

**❌ Wrong:**
```python
dp = [0] * (amount + 1)
# Missing dp[0] = 1!
```

**✅ Correct:**
```python
dp = [0] * (amount + 1)
dp[0] = 1  # 1 way to make 0: use no coins
```

### 3. Confusing with Coin Change I

| Problem | Goal | Update |
|---------|------|--------|
| Coin Change I | Minimum | `min(dp[a], dp[a-coin] + 1)` |
| Coin Change II | Count | `dp[a] += dp[a-coin]` |

### 4. Off-by-One in Range

**❌ Wrong:**
```python
for a in range(1, amount + 1):  # Skips a=0 if coin = 0 (edge case)
```

**✅ Correct:**
```python
for a in range(coin, amount + 1):  # Start from coin value
```

---

## 📊 Trace Through Example

```
amount = 5, coins = [1, 2, 5]

Initial: dp = [1, 0, 0, 0, 0, 0]

Processing coin = 1:
  a=1: dp[1] = dp[1] + dp[0] = 0 + 1 = 1
  a=2: dp[2] = dp[2] + dp[1] = 0 + 1 = 1
  a=3: dp[3] = dp[3] + dp[2] = 0 + 1 = 1
  a=4: dp[4] = dp[4] + dp[3] = 0 + 1 = 1
  a=5: dp[5] = dp[5] + dp[4] = 0 + 1 = 1
dp = [1, 1, 1, 1, 1, 1]

Processing coin = 2:
  a=2: dp[2] = dp[2] + dp[0] = 1 + 1 = 2    → {1,1} or {2}
  a=3: dp[3] = dp[3] + dp[1] = 1 + 1 = 2    → {1,1,1} or {1,2}
  a=4: dp[4] = dp[4] + dp[2] = 1 + 2 = 3    → {1,1,1,1}, {1,1,2}, {2,2}
  a=5: dp[5] = dp[5] + dp[3] = 1 + 2 = 3    → {1,1,1,1,1}, {1,1,1,2}, {1,2,2}
dp = [1, 1, 2, 2, 3, 3]

Processing coin = 5:
  a=5: dp[5] = dp[5] + dp[0] = 3 + 1 = 4    → add {5}
dp = [1, 1, 2, 2, 3, 4]

Answer: 4 ways
{1,1,1,1,1}, {1,1,1,2}, {1,2,2}, {5}
```

---

## 🔄 Variations

### Count Permutations (Combination Sum IV)

```python
def combination_sum4(nums: list[int], target: int) -> int:
    """
    LC 377: Count permutations, not combinations.
    Amount outer loop!
    """
    dp = [0] * (target + 1)
    dp[0] = 1
    
    # Amount outer → permutations
    for a in range(1, target + 1):
        for num in nums:
            if num <= a:
                dp[a] += dp[a - num]
    
    return dp[target]
```

### Limited Coins

```python
def change_limited(amount: int, coins: list[int], counts: list[int]) -> int:
    """Each coin[i] has limited counts[i]."""
    dp = [0] * (amount + 1)
    dp[0] = 1
    
    for i, coin in enumerate(coins):
        for _ in range(counts[i]):  # Use each copy once
            for a in range(amount, coin - 1, -1):  # Backward!
                dp[a] += dp[a - coin]
    
    return dp[amount]
```

### Combinations with Exactly K Coins

```python
def change_k_coins(amount: int, coins: list[int], k: int) -> int:
    """Ways to make amount using exactly k coins."""
    # dp[c][a] = ways using exactly c coins to make a
    dp = [[0] * (amount + 1) for _ in range(k + 1)]
    dp[0][0] = 1
    
    for coin in coins:
        for c in range(1, k + 1):
            for a in range(coin, amount + 1):
                dp[c][a] += dp[c - 1][a - coin]
    
    return dp[k][amount]
```

---

## 📝 Related Problems

| Problem | Difficulty | Note |
|---------|------------|------|
| [Coin Change](https://leetcode.com/problems/coin-change/) | Medium | Minimize instead of count |
| [Combination Sum IV](https://leetcode.com/problems/combination-sum-iv/) | Medium | Count permutations |
| [Target Sum](https://leetcode.com/problems/target-sum/) | Medium | 0/1 variant |
| [Number of Ways to Earn Points](https://leetcode.com/problems/number-of-ways-to-earn-points/) | Hard | 2D knapsack |

---

## 🎤 Interview Tips

**Time to solve:** 15-20 minutes

**Communication template:**
> "This is unbounded knapsack counting combinations. I'll use dp[a] for ways to make amount a. The key insight is loop order: coins outer loop counts combinations, not permutations. dp[a] += dp[a-coin] accumulates the count."

**Key points to mention:**
1. Combinations vs permutations depends on loop order
2. Base case dp[0] = 1 (one way to make 0)
3. Forward iteration for unbounded

**Common follow-up questions:**
- "What if we wanted permutations?" → Swap loop order
- "What if each coin could only be used once?" → Backward iteration (0/1 knapsack)

**Company frequency:**
| Company | Frequency |
|---------|-----------|
| Amazon | ⭐⭐⭐⭐ |
| Meta | ⭐⭐⭐⭐ |
| Google | ⭐⭐⭐ |
| Bloomberg | ⭐⭐⭐ |

---

> **💡 Key Insight:** The difference between combinations and permutations is just loop order! Coins outer = combinations (process all of coin A before coin B). Amount outer = permutations (at each amount, consider all coins fresh).

> **🔗 Related:** [Coin Change](./01-Coin-Change-LC322.md) | [Unbounded Knapsack Pattern](../6.3-Unbounded-Knapsack-Pattern.md) | [Combination Sum IV](https://leetcode.com/problems/combination-sum-iv/)
