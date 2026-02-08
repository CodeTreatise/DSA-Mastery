# Coin Change (LC 322)

> **The definitive Unbounded Knapsack problem.** If you understand Coin Change, you understand unbounded DP. This problem appears constantly in interviews and forms the basis for many variations.

---

## 📋 Problem Statement

**LeetCode:** [322. Coin Change](https://leetcode.com/problems/coin-change/)

You are given an integer array `coins` representing coins of different denominations and an integer `amount` representing a total amount of money.

Return the fewest number of coins that you need to make up that amount. If that amount cannot be made up by any combination of the coins, return -1.

You may assume that you have an infinite number of each kind of coin.

**Constraints:**
- 1 ≤ coins.length ≤ 12
- 1 ≤ coins[i] ≤ 2³¹ - 1
- 0 ≤ amount ≤ 10⁴

---

## 🎯 Pattern Recognition

**This is Unbounded Knapsack because:**
- Infinite supply of each coin
- Minimizing number of items (coins) to reach capacity (amount)
- Each coin can be used multiple times

**Signals:**
- "infinite number of each"
- "fewest coins"
- Making an exact amount

---

## 📐 Approach Analysis

### DP State Definition

```
dp[a] = minimum coins needed to make amount a

Base case: dp[0] = 0 (0 coins for amount 0)
Recurrence: dp[a] = min(dp[a - coin] + 1) for all valid coins
```

**Visualization:**
```
coins = [1, 2, 5], amount = 11

dp[0] = 0 (base case)
dp[1] = dp[0] + 1 = 1 (use coin 1)
dp[2] = min(dp[1]+1, dp[0]+1) = 1 (use coin 2)
dp[3] = min(dp[2]+1, dp[1]+1) = 2 (2+1 or 1+1+1)
dp[4] = min(dp[3]+1, dp[2]+1) = 2 (2+2)
dp[5] = min(dp[4]+1, dp[3]+1, dp[0]+1) = 1 (use coin 5)
...
dp[11] = 3 (5+5+1)
```

---

## 💻 Solutions

### Solution 1: Bottom-Up DP (Optimal)

```python
def coin_change(coins: list[int], amount: int) -> int:
    """
    Unbounded Knapsack: minimize coins.
    Time: O(amount * n), Space: O(amount)
    """
    # dp[a] = min coins for amount a
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0  # 0 coins to make 0
    
    for coin in coins:
        # Forward iteration = unlimited use
        for a in range(coin, amount + 1):
            dp[a] = min(dp[a], dp[a - coin] + 1)
    
    return dp[amount] if dp[amount] != float('inf') else -1
```

```javascript
function coinChange(coins, amount) {
    const dp = new Array(amount + 1).fill(Infinity);
    dp[0] = 0;
    
    for (const coin of coins) {
        for (let a = coin; a <= amount; a++) {
            dp[a] = Math.min(dp[a], dp[a - coin] + 1);
        }
    }
    
    return dp[amount] === Infinity ? -1 : dp[amount];
}
```

### Solution 2: Alternative Loop Order

```python
def coin_change_v2(coins: list[int], amount: int) -> int:
    """
    Amount outer loop - still works for unbounded.
    """
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0
    
    for a in range(1, amount + 1):
        for coin in coins:
            if coin <= a and dp[a - coin] != float('inf'):
                dp[a] = min(dp[a], dp[a - coin] + 1)
    
    return dp[amount] if dp[amount] != float('inf') else -1
```

### Solution 3: Top-Down with Memoization

```python
def coin_change_memo(coins: list[int], amount: int) -> int:
    """
    Recursive with memoization.
    """
    from functools import lru_cache
    
    @lru_cache(maxsize=None)
    def helper(remaining):
        if remaining == 0:
            return 0
        if remaining < 0:
            return float('inf')
        
        min_coins = float('inf')
        for coin in coins:
            result = helper(remaining - coin)
            min_coins = min(min_coins, result + 1)
        
        return min_coins
    
    result = helper(amount)
    return result if result != float('inf') else -1
```

### Solution 4: BFS Approach

```python
def coin_change_bfs(coins: list[int], amount: int) -> int:
    """
    BFS: each level = one more coin used.
    First time we reach amount = minimum coins.
    """
    if amount == 0:
        return 0
    
    from collections import deque
    
    visited = set([0])
    queue = deque([0])
    level = 0
    
    while queue:
        level += 1
        for _ in range(len(queue)):
            curr = queue.popleft()
            for coin in coins:
                next_amount = curr + coin
                if next_amount == amount:
                    return level
                if next_amount < amount and next_amount not in visited:
                    visited.add(next_amount)
                    queue.append(next_amount)
    
    return -1
```

---

## ⚡ Complexity Analysis

| Approach | Time | Space |
|----------|------|-------|
| Bottom-Up DP | O(n × amount) | O(amount) |
| Top-Down | O(n × amount) | O(amount) |
| BFS | O(amount) | O(amount) |

**Which to use:**
- DP: Standard, always works
- BFS: Can be faster if answer is small (early termination)

---

## ⚠️ Common Mistakes

### 1. Wrong Initialization

**❌ Wrong:**
```python
dp = [0] * (amount + 1)  # 0 = 0 coins needed for all amounts?
```

**✅ Correct:**
```python
dp = [float('inf')] * (amount + 1)
dp[0] = 0  # Only amount 0 needs 0 coins
```

### 2. Backward Instead of Forward Loop

**❌ Wrong:**
```python
for coin in coins:
    for a in range(amount, coin - 1, -1):  # Backward = 0/1!
        dp[a] = min(dp[a], dp[a - coin] + 1)
# This limits each coin to ONE use
```

**✅ Correct:**
```python
for coin in coins:
    for a in range(coin, amount + 1):  # Forward = unlimited!
        dp[a] = min(dp[a], dp[a - coin] + 1)
```

### 3. Not Handling Impossible Case

**❌ Wrong:**
```python
return dp[amount]  # Could be infinity!
```

**✅ Correct:**
```python
return dp[amount] if dp[amount] != float('inf') else -1
```

### 4. Integer Overflow in Check

**❌ Wrong:**
```python
if dp[a - coin] + 1 < dp[a]:  # Works in Python, can overflow in other languages
```

**✅ Safer:**
```python
if dp[a - coin] != float('inf'):
    dp[a] = min(dp[a], dp[a - coin] + 1)
```

---

## 📊 Trace Through Example

```
coins = [1, 2, 5], amount = 11

Initial: dp = [0, ∞, ∞, ∞, ∞, ∞, ∞, ∞, ∞, ∞, ∞, ∞]

Processing coin = 1:
  a=1: dp[1] = min(∞, dp[0]+1) = 1
  a=2: dp[2] = min(∞, dp[1]+1) = 2
  ...
  a=11: dp[11] = 11
dp = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]

Processing coin = 2:
  a=2: dp[2] = min(2, dp[0]+1) = 1
  a=3: dp[3] = min(3, dp[1]+1) = 2
  a=4: dp[4] = min(4, dp[2]+1) = 2
  a=5: dp[5] = min(5, dp[3]+1) = 3
  ...
dp = [0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6]

Processing coin = 5:
  a=5: dp[5] = min(3, dp[0]+1) = 1
  a=6: dp[6] = min(3, dp[1]+1) = 2
  a=7: dp[7] = min(4, dp[2]+1) = 2
  ...
  a=10: dp[10] = min(5, dp[5]+1) = 2
  a=11: dp[11] = min(6, dp[6]+1) = 3
dp = [0, 1, 1, 2, 2, 1, 2, 2, 3, 3, 2, 3]

Answer: dp[11] = 3 (coins: 5 + 5 + 1)
```

---

## 🔄 Variations

### Count Ways (Coin Change II)

```python
def change(amount: int, coins: list[int]) -> int:
    """Count combinations that sum to amount."""
    dp = [0] * (amount + 1)
    dp[0] = 1
    
    for coin in coins:
        for a in range(coin, amount + 1):
            dp[a] += dp[a - coin]
    
    return dp[amount]
```

### Minimum Coins with Limited Supply

```python
def coin_change_limited(coins: list[int], counts: list[int], amount: int) -> int:
    """Each coin[i] has counts[i] copies available."""
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0
    
    for i, coin in enumerate(coins):
        # Process each coin's copies
        for _ in range(counts[i]):
            for a in range(amount, coin - 1, -1):  # Backward!
                dp[a] = min(dp[a], dp[a - coin] + 1)
    
    return dp[amount] if dp[amount] != float('inf') else -1
```

---

## 📝 Related Problems

- [ ] [Coin Change II](https://leetcode.com/problems/coin-change-ii/) - Count ways
- [ ] [Perfect Squares](https://leetcode.com/problems/perfect-squares/) - Squares as coins
- [ ] [Minimum Cost For Tickets](https://leetcode.com/problems/minimum-cost-for-tickets/) - Similar concept
- [ ] [Combination Sum IV](https://leetcode.com/problems/combination-sum-iv/) - Permutations

---

## 🎤 Interview Tips

**Time to solve:** 15-20 minutes

**Communication template:**
> "This is classic unbounded knapsack—we have unlimited coins and want minimum count to reach the amount. I'll use dp[a] for minimum coins to make amount a. Since coins are unlimited, I iterate forward: dp[a] = min(dp[a], dp[a-coin] + 1). I initialize to infinity except dp[0] = 0."

**Key points:**
1. Infinite supply → forward iteration
2. Minimize → initialize to infinity
3. Handle impossible case (return -1)

**Company frequency:**
| Company | Frequency |
|---------|-----------|
| Amazon | ⭐⭐⭐⭐⭐ |
| Google | ⭐⭐⭐⭐ |
| Meta | ⭐⭐⭐⭐ |
| Microsoft | ⭐⭐⭐⭐ |

---

> **💡 Key Insight:** This is THE canonical unbounded knapsack problem. Forward iteration allows reusing coins. The only tricky part is remembering to return -1 for impossible cases and initializing to infinity (not 0).

> **🔗 Related:** [Unbounded Knapsack Pattern](../6.3-Unbounded-Knapsack-Pattern.md) | [Coin Change II](./02-Coin-Change-II-LC518.md) | [0/1 Knapsack](../../04-Knapsack-01/)
