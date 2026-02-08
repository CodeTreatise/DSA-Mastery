# Best Time to Buy and Sell Stock IV (LC 188)

> **The generalized stock trading problem.** At most K transactions allowed. This combines state machine thinking with the transaction count dimension, creating a 2D state space.

---

## 📋 Problem Statement

**LeetCode:** [188. Best Time to Buy and Sell Stock IV](https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iv/)

You are given an integer array `prices` where `prices[i]` is the price of a given stock on the ith day, and an integer `k`.

Find the maximum profit you can achieve. You may complete at most `k` transactions.

Note: You may not engage in multiple transactions simultaneously (i.e., you must sell the stock before you buy again).

**Examples:**
```
Input: k = 2, prices = [2,4,1]
Output: 2
Explanation: Buy on day 0 (price=2), sell on day 1 (price=4), profit = 2

Input: k = 2, prices = [3,2,6,5,0,3]
Output: 7
Explanation: 
  Buy day 1 (price=2), sell day 2 (price=6), profit = 4
  Buy day 4 (price=0), sell day 5 (price=3), profit = 3
  Total: 7
```

**Constraints:**
- 1 ≤ k ≤ 100
- 1 ≤ prices.length ≤ 1000
- 0 ≤ prices[i] ≤ 1000

---

## 🎯 Pattern Recognition

**Why State Machine DP with Extra Dimension?**
- We have a limit on transactions
- Each transaction = buy + sell
- Need to track: holding state AND number of transactions used

**State Definition:**
```
buy[i]  = max profit when we've completed (i-1) transactions 
          and are currently HOLDING a stock
sell[i] = max profit when we've completed exactly i transactions
          and are NOT holding
```

---

## 📐 State Machine with K Transactions

```
Transaction count: 0, 1, 2, ..., k

For each i from 1 to k:
  buy[i]:  profit after (i-1) sells + 1 buy (holding for i-th transaction)
  sell[i]: profit after i complete transactions (not holding)

Transitions:
  buy[i]  = max(buy[i], sell[i-1] - price)  // Buy for i-th transaction
  sell[i] = max(sell[i], buy[i] + price)    // Sell to complete i-th transaction
```

### Visual State Diagram

```
  sell[0] ──buy──► buy[1] ──sell──► sell[1] ──buy──► buy[2] ──sell──► sell[2] ...
     │                │                 │                │
     └───────────────►│◄────────────────┴────────────────┤
        (stay)         (stay)                (stay)
```

---

## 💻 Solutions

### Solution 1: O(nk) Space-Optimized

```python
def max_profit(k: int, prices: list[int]) -> int:
    """
    At most k transactions.
    Time: O(nk), Space: O(k)
    """
    n = len(prices)
    if n == 0 or k == 0:
        return 0
    
    # Optimization: if k >= n/2, it's unlimited transactions
    if k >= n // 2:
        profit = 0
        for i in range(1, n):
            if prices[i] > prices[i - 1]:
                profit += prices[i] - prices[i - 1]
        return profit
    
    # buy[i] = max profit holding for i-th transaction
    # sell[i] = max profit after completing i transactions
    buy = [float('-inf')] * (k + 1)
    sell = [0] * (k + 1)
    
    for price in prices:
        for i in range(1, k + 1):
            # Buy for i-th transaction (after i-1 sells)
            buy[i] = max(buy[i], sell[i - 1] - price)
            # Sell to complete i-th transaction
            sell[i] = max(sell[i], buy[i] + price)
    
    return sell[k]
```

```javascript
function maxProfit(k, prices) {
    const n = prices.length;
    if (n === 0 || k === 0) return 0;
    
    // Optimization for large k
    if (k >= Math.floor(n / 2)) {
        let profit = 0;
        for (let i = 1; i < n; i++) {
            if (prices[i] > prices[i - 1]) {
                profit += prices[i] - prices[i - 1];
            }
        }
        return profit;
    }
    
    const buy = new Array(k + 1).fill(-Infinity);
    const sell = new Array(k + 1).fill(0);
    
    for (const price of prices) {
        for (let i = 1; i <= k; i++) {
            buy[i] = Math.max(buy[i], sell[i - 1] - price);
            sell[i] = Math.max(sell[i], buy[i] + price);
        }
    }
    
    return sell[k];
}
```

### Solution 2: 2D DP (For Understanding)

```python
def max_profit_2d(k: int, prices: list[int]) -> int:
    """
    Explicit 2D DP: dp[day][transactions][holding]
    Time: O(nk), Space: O(nk)
    """
    n = len(prices)
    if n == 0 or k == 0:
        return 0
    
    if k >= n // 2:
        return sum(max(0, prices[i] - prices[i-1]) for i in range(1, n))
    
    # dp[j][0] = max profit with j transactions, not holding
    # dp[j][1] = max profit with j transactions, holding
    INF = float('inf')
    dp = [[0, -INF] for _ in range(k + 1)]
    
    for price in prices:
        # Process in reverse to use previous day's values
        for j in range(k, 0, -1):
            # Sell: transition from holding to not holding
            dp[j][0] = max(dp[j][0], dp[j][1] + price)
            # Buy: transition from not holding to holding
            dp[j][1] = max(dp[j][1], dp[j - 1][0] - price)
    
    return dp[k][0]
```

### Solution 3: Top-Down with Memoization

```python
def max_profit_memo(k: int, prices: list[int]) -> int:
    """Recursive with memoization."""
    from functools import lru_cache
    
    n = len(prices)
    if n == 0 or k == 0:
        return 0
    
    @lru_cache(maxsize=None)
    def dp(day: int, trans_left: int, holding: bool) -> int:
        if day == n or trans_left == 0:
            return 0
        
        # Option 1: Do nothing
        result = dp(day + 1, trans_left, holding)
        
        if holding:
            # Option 2: Sell (completes a transaction)
            result = max(result, prices[day] + dp(day + 1, trans_left - 1, False))
        else:
            # Option 2: Buy
            result = max(result, -prices[day] + dp(day + 1, trans_left, True))
        
        return result
    
    return dp(0, k, False)
```

### Solution 4: Alternative State Definition

```python
def max_profit_alt(k: int, prices: list[int]) -> int:
    """
    Alternative: buy[i] means 'ready to buy for i-th transaction'
    """
    n = len(prices)
    if n == 0 or k == 0:
        return 0
    
    if k >= n // 2:
        return sum(max(0, prices[i] - prices[i-1]) for i in range(1, n))
    
    # After buying for transaction i, we're "in" transaction i
    # After selling, transaction i is complete
    
    buy = [float('-inf')] * (k + 1)  # buy[i]: bought for i-th, not sold
    sell = [0] * (k + 1)              # sell[i]: sold i-th transaction
    
    for price in prices:
        for i in range(1, k + 1):
            buy[i] = max(buy[i], sell[i - 1] - price)
            sell[i] = max(sell[i], buy[i] + price)
    
    return sell[k]
```

---

## ⚡ Complexity Analysis

| Approach | Time | Space |
|----------|------|-------|
| 1D Arrays | O(nk) | O(k) |
| 2D DP | O(nk) | O(nk) |
| Memoization | O(nk) | O(nk) |

**Why the k >= n/2 optimization?**
- A transaction spans at least 2 days (buy, sell)
- Max possible transactions = n/2
- If k >= n/2, we can do unlimited transactions

---

## 📊 Trace Through Example

```
k = 2, prices = [3, 2, 6, 5, 0, 3]

Initial:
  buy = [-∞, -∞, -∞]
  sell = [0, 0, 0]

Day 0 (price=3):
  i=1: buy[1] = max(-∞, 0 - 3) = -3
       sell[1] = max(0, -3 + 3) = 0
  i=2: buy[2] = max(-∞, 0 - 3) = -3
       sell[2] = max(0, -3 + 3) = 0

Day 1 (price=2):
  i=1: buy[1] = max(-3, 0 - 2) = -2 ✓ (better buy price)
       sell[1] = max(0, -2 + 2) = 0
  i=2: buy[2] = max(-3, 0 - 2) = -2
       sell[2] = max(0, -2 + 2) = 0

Day 2 (price=6):
  i=1: buy[1] = max(-2, 0 - 6) = -2
       sell[1] = max(0, -2 + 6) = 4 ✓ (first transaction profit)
  i=2: buy[2] = max(-2, 4 - 6) = -2
       sell[2] = max(0, -2 + 6) = 4

Day 3 (price=5):
  i=1: buy[1] = max(-2, 0 - 5) = -2
       sell[1] = max(4, -2 + 5) = 4
  i=2: buy[2] = max(-2, 4 - 5) = -1 ✓
       sell[2] = max(4, -1 + 5) = 4

Day 4 (price=0):
  i=1: buy[1] = max(-2, 0 - 0) = 0 ✓ (free stock!)
       sell[1] = max(4, 0 + 0) = 4
  i=2: buy[2] = max(-1, 4 - 0) = 4 ✓ (after first profit of 4)
       sell[2] = max(4, 4 + 0) = 4

Day 5 (price=3):
  i=1: buy[1] = max(0, 0 - 3) = 0
       sell[1] = max(4, 0 + 3) = 4
  i=2: buy[2] = max(4, 4 - 3) = 4
       sell[2] = max(4, 4 + 3) = 7 ✓ (second transaction profit!)

Answer: sell[2] = 7 ✓

Explanation:
  Transaction 1: Buy at 2, sell at 6 → profit 4
  Transaction 2: Buy at 0, sell at 3 → profit 3
  Total: 7
```

---

## ⚠️ Common Mistakes

### 1. Forgetting the k >= n/2 Optimization

**❌ Wrong:**
```python
# TLE for large k
for i in range(1, k + 1):  # k could be 1000000
```

**✅ Correct:**
```python
if k >= n // 2:
    # Unlimited transactions - O(n) solution
    return sum(max(0, prices[i] - prices[i-1]) for i in range(1, n))
```

### 2. Wrong Transaction Counting

**❌ Wrong:**
```python
# Counting buy as a transaction
buy[i] = max(buy[i], sell[i] - price)  # Wrong: uses sell[i] not sell[i-1]
```

**✅ Correct:**
```python
# Transaction completes on SELL, not buy
buy[i] = max(buy[i], sell[i - 1] - price)  # After (i-1) transactions
sell[i] = max(sell[i], buy[i] + price)      # Completes i-th transaction
```

### 3. Array Index Confusion

```python
# buy[i] means we've done (i-1) complete transactions and are holding
# sell[i] means we've done exactly i complete transactions and not holding

# So sell[k] is the answer (k complete transactions)
```

### 4. Not Handling Edge Cases

```python
if n == 0 or k == 0:
    return 0
```

---

## 🔄 Stock Problem Family Comparison

| Problem | Constraint | States |
|---------|-----------|--------|
| Stock I (121) | 1 transaction | min_price, max_profit |
| Stock II (122) | Unlimited | hold, not_hold |
| Stock III (123) | 2 transactions | buy1, sell1, buy2, sell2 |
| Stock IV (188) | k transactions | buy[k], sell[k] |
| With Cooldown (309) | Unlimited + cooldown | hold, sold, rest |
| With Fee (714) | Unlimited + fee | hold, not_hold |

---

## 📝 Practice Problems

| Problem | Difficulty | Key Insight |
|---------|------------|-------------|
| [121. Stock I](https://leetcode.com/problems/best-time-to-buy-and-sell-stock/) | Easy | One transaction |
| [122. Stock II](https://leetcode.com/problems/best-time-to-buy-and-sell-stock-ii/) | Medium | Unlimited |
| [123. Stock III](https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iii/) | Hard | 2 transactions |
| [188. Stock IV](https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iv/) | Hard | This problem |
| [309. Stock with Cooldown](https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-cooldown/) | Medium | 3 states |
| [714. Stock with Fee](https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-transaction-fee/) | Medium | Fee on sell |

---

## 🎤 Interview Tips

**Time to solve:** 25-30 minutes

**Communication template:**
> "This generalizes to k transactions. I'll track two arrays: buy[i] for the max profit when holding for the i-th transaction, and sell[i] for max profit after completing i transactions.

> The key insight is that buying for transaction i requires (i-1) transactions to be complete, so buy[i] depends on sell[i-1].

> I'll also optimize: if k >= n/2, I can do unlimited transactions, which becomes a simpler problem."

**Key points to mention:**
1. Transaction = buy + sell (counted on sell)
2. The k >= n/2 optimization prevents TLE
3. State transition: buy from previous sell, sell from current buy

**Company frequency:**
| Company | Frequency |
|---------|-----------|
| Google | ⭐⭐⭐⭐ |
| Meta | ⭐⭐⭐ |
| Amazon | ⭐⭐⭐ |
| Bloomberg | ⭐⭐⭐⭐ |

---

## 💡 Key Insights

1. **Transaction = buy + sell**: Counted when we SELL
2. **buy[i] uses sell[i-1]**: Must complete previous transaction before starting new
3. **k >= n/2 optimization**: Large k means unlimited transactions
4. **O(k) space**: Only need current day's values for each transaction count
5. **General pattern**: Stock IV subsumes I, II, III as special cases

---

> **💡 Key Insight:** This is the master problem that generalizes all stock problems. The key is tracking both the transaction count AND the holding state. Once you understand this, Stock I-III are just special cases (k=1, k=∞, k=2).

> **🔗 Related:** [State Machine Patterns](../12.1-State-Machine-Patterns.md) | [Stock with Cooldown](./01-Stock-Cooldown-LC309.md) | [Stock III](https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iii/)
