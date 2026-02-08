# Best Time to Buy and Sell Stock with Cooldown (LC 309)

> **The quintessential State Machine DP problem.** After selling a stock, you must wait one day before buying again. This "cooldown" naturally creates three distinct states.

---

## 📋 Problem Statement

**LeetCode:** [309. Best Time to Buy and Sell Stock with Cooldown](https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-cooldown/)

You are given an array `prices` where `prices[i]` is the price of a given stock on the ith day.

Find the maximum profit you can achieve. You may complete as many transactions as you like (i.e., buy one and sell one share of the stock multiple times) with the following restrictions:

- After you sell your stock, you cannot buy stock on the next day (i.e., cooldown one day).

Note: You may not engage in multiple transactions simultaneously (i.e., you must sell the stock before you buy again).

**Examples:**
```
Input: prices = [1,2,3,0,2]
Output: 3
Explanation: 
  Day 0: Buy at 1
  Day 1: Sell at 2 (profit +1, enter cooldown)
  Day 2: Cooldown (can't buy)
  Day 3: Buy at 0
  Day 4: Sell at 2 (profit +2)
  Total: 1 + 2 = 3

Input: prices = [1]
Output: 0
```

**Constraints:**
- 1 ≤ prices.length ≤ 5000
- 0 ≤ prices[i] ≤ 1000

---

## 🎯 Pattern Recognition

**Why State Machine DP?**
- Three distinct states with specific transition rules
- Each day, you're in exactly ONE state
- Transitions depend on current state and action taken

**State Definitions:**
```
HOLD: Currently holding a stock (bought earlier, not sold yet)
SOLD: Just sold a stock TODAY (in cooldown, can't buy tomorrow)
REST: Not holding, not in cooldown (can buy if we want)
```

---

## 📐 State Machine Diagram

```
                    ┌─────────────────────┐
                    │   do nothing        │
                    ▼                     │
         ┌─────► HOLD ────────────────────┘
         │         │
         │ buy     │ sell
         │         ▼
       REST ◄───── SOLD
         ▲           │
         │           │ (forced cooldown)
         └───────────┘
         
  REST can also stay as REST (do nothing)
```

**Transition Rules:**
| From | Action | To |
|------|--------|-----|
| REST | Buy | HOLD |
| REST | Nothing | REST |
| HOLD | Sell | SOLD |
| HOLD | Nothing | HOLD |
| SOLD | (forced) | REST |

---

## 💻 Solutions

### Solution 1: Three States (Clean)

```python
def max_profit(prices: list[int]) -> int:
    """
    Three-state DP: HOLD, SOLD, REST
    Time: O(n), Space: O(1)
    """
    if not prices:
        return 0
    
    # Initial states
    hold = float('-inf')  # Can't hold without buying
    sold = 0              # No profit from selling on day -1
    rest = 0              # No action, no profit
    
    for price in prices:
        # Save previous values (order matters!)
        prev_hold = hold
        prev_sold = sold
        
        # Transitions
        hold = max(prev_hold, rest - price)  # Keep holding OR buy today
        sold = prev_hold + price             # Sell today (must have held)
        rest = max(rest, prev_sold)          # Stay resting OR exit cooldown
    
    # Can't be holding at the end for max profit
    return max(sold, rest)
```

```javascript
function maxProfit(prices) {
    if (prices.length === 0) return 0;
    
    let hold = -Infinity;
    let sold = 0;
    let rest = 0;
    
    for (const price of prices) {
        const prevHold = hold;
        const prevSold = sold;
        
        hold = Math.max(prevHold, rest - price);
        sold = prevHold + price;
        rest = Math.max(rest, prevSold);
    }
    
    return Math.max(sold, rest);
}
```

### Solution 2: Two States with Delay (Alternative)

```python
def max_profit_two_state(prices: list[int]) -> int:
    """
    Two states but track previous 'not holding' for cooldown.
    """
    if len(prices) < 2:
        return 0
    
    hold = -prices[0]  # Buy on day 0
    not_hold = 0       # Don't buy on day 0
    not_hold_prev = 0  # State from 2 days ago
    
    for i in range(1, len(prices)):
        temp = not_hold
        
        # Sell today OR keep not holding
        not_hold = max(not_hold, hold + prices[i])
        
        # Buy today (from 2 days ago's not_hold) OR keep holding
        hold = max(hold, not_hold_prev - prices[i])
        
        not_hold_prev = temp
    
    return not_hold
```

### Solution 3: 2D DP Array (For Understanding)

```python
def max_profit_2d(prices: list[int]) -> int:
    """
    Explicit 2D array version for clarity.
    dp[i][state]: max profit on day i in given state
    state: 0=REST, 1=HOLD, 2=SOLD
    """
    n = len(prices)
    if n == 0:
        return 0
    
    REST, HOLD, SOLD = 0, 1, 2
    dp = [[0] * 3 for _ in range(n)]
    
    # Day 0
    dp[0][REST] = 0
    dp[0][HOLD] = -prices[0]  # Buy on day 0
    dp[0][SOLD] = 0  # Can't sell on day 0 without holding
    
    for i in range(1, n):
        dp[i][REST] = max(dp[i-1][REST], dp[i-1][SOLD])
        dp[i][HOLD] = max(dp[i-1][HOLD], dp[i-1][REST] - prices[i])
        dp[i][SOLD] = dp[i-1][HOLD] + prices[i]
    
    return max(dp[n-1][REST], dp[n-1][SOLD])
```

### Solution 4: Top-Down with Memoization

```python
def max_profit_memo(prices: list[int]) -> int:
    """Recursive with memoization."""
    from functools import lru_cache
    
    n = len(prices)
    
    @lru_cache(maxsize=None)
    def dp(day: int, can_buy: bool) -> int:
        if day >= n:
            return 0
        
        # Do nothing
        result = dp(day + 1, can_buy)
        
        if can_buy:
            # Buy today
            result = max(result, dp(day + 1, False) - prices[day])
        else:
            # Sell today (then skip next day for cooldown)
            result = max(result, dp(day + 2, True) + prices[day])
        
        return result
    
    return dp(0, True)
```

---

## ⚡ Complexity Analysis

| Approach | Time | Space |
|----------|------|-------|
| Three States O(1) | O(n) | O(1) |
| 2D DP Array | O(n) | O(n) |
| Top-Down | O(n) | O(n) |

---

## 📊 Trace Through Example

```
prices = [1, 2, 3, 0, 2]

Day 0 (price=1):
  hold = max(-∞, 0 - 1) = -1  (buy at 1)
  sold = -∞ + 1 = -∞ (can't sell, wasn't holding)
  rest = max(0, 0) = 0
  
Day 1 (price=2):
  hold = max(-1, 0 - 2) = -1  (keep holding, better than buying at 2)
  sold = -1 + 2 = 1  (sell for profit 1)
  rest = max(0, -∞) = 0

Day 2 (price=3):
  hold = max(-1, 0 - 3) = -1  (keep holding, can't buy from sold)
  sold = -1 + 3 = 2  (alternative: sell now for profit 2)
  rest = max(0, 1) = 1  (cooldown from selling day 1)

Day 3 (price=0):
  hold = max(-1, 1 - 0) = 1  (buy at 0 after cooldown!)
  sold = -1 + 0 = -1  (don't sell at 0)
  rest = max(1, 2) = 2

Day 4 (price=2):
  hold = max(1, 2 - 2) = 1  (keep holding)
  sold = 1 + 2 = 3  (sell for profit!)
  rest = max(2, -1) = 2

Answer: max(sold, rest) = max(3, 2) = 3 ✓
```

---

## ⚠️ Common Mistakes

### 1. Forgetting to Save Previous State

**❌ Wrong:**
```python
hold = max(hold, rest - price)
sold = hold + price  # Uses NEW hold, not old!
```

**✅ Correct:**
```python
prev_hold = hold
hold = max(hold, rest - price)
sold = prev_hold + price  # Uses OLD hold
```

### 2. Wrong Initial State for HOLD

**❌ Wrong:**
```python
hold = 0  # Implies profit while holding without buying
```

**✅ Correct:**
```python
hold = float('-inf')  # Impossible to hold without buying
```

### 3. Buying from SOLD State

**❌ Wrong:**
```python
hold = max(hold, sold - price)  # Can't buy during cooldown!
```

**✅ Correct:**
```python
hold = max(hold, rest - price)  # Can only buy from REST
```

### 4. Not Handling Empty Input

```python
if not prices:
    return 0
```

---

## 🔄 Comparison: With vs Without Cooldown

| Aspect | No Cooldown (LC 122) | With Cooldown (LC 309) |
|--------|---------------------|----------------------|
| States | 2 (hold, not_hold) | 3 (hold, sold, rest) |
| Buy from | not_hold | rest only |
| After sell | can buy next day | must wait 1 day |
| Complexity | O(n), O(1) | O(n), O(1) |

```python
# No cooldown
hold = max(hold, not_hold - price)
not_hold = max(not_hold, hold + price)

# With cooldown
hold = max(hold, rest - price)  # Can't buy from sold
sold = hold + price
rest = max(rest, sold)  # Cooldown transition
```

---

## 📝 Practice Problems

| Problem | Difficulty | Key Insight |
|---------|------------|-------------|
| [122. Stock II](https://leetcode.com/problems/best-time-to-buy-and-sell-stock-ii/) | Medium | No cooldown |
| [309. Stock with Cooldown](https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-cooldown/) | Medium | This problem |
| [714. Stock with Fee](https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-transaction-fee/) | Medium | Fee on sell |
| [123. Stock III](https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iii/) | Hard | At most 2 transactions |
| [188. Stock IV](https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iv/) | Hard | At most k transactions |

---

## 🎤 Interview Tips

**Time to solve:** 20-25 minutes

**Communication template:**
> "This is a state machine DP problem. I'll define three states: HOLD (have a stock), SOLD (just sold, in cooldown), and REST (no stock, not in cooldown).

> The key constraint is the cooldown: after selling, we can't buy the next day. This means we can only transition to HOLD from REST, not from SOLD.

> For each day, I'll compute the maximum profit for each state based on the previous day's states."

**State transitions to explain:**
> "HOLD can come from staying in HOLD or buying from REST.
> SOLD can only come from HOLD (by selling).
> REST can come from staying in REST or from SOLD (cooldown ends)."

**Company frequency:**
| Company | Frequency |
|---------|-----------|
| Google | ⭐⭐⭐⭐ |
| Meta | ⭐⭐⭐ |
| Amazon | ⭐⭐⭐ |
| Microsoft | ⭐⭐⭐ |

---

## 💡 Key Insights

1. **Three states** capture all possibilities: holding, just sold, or resting
2. **Cooldown = forced transition**: SOLD must go to REST
3. **Save previous states**: critical for correct transitions
4. **Initialize HOLD as -∞**: can't have profit while holding without buying
5. **Answer excludes HOLD**: must sell everything for final profit

---

> **💡 Key Insight:** The cooldown restriction creates the three-state structure. The "sold" state exists specifically to enforce the one-day waiting period before you can buy again.

> **🔗 Related:** [State Machine Patterns](../12.1-State-Machine-Patterns.md) | [Stock II (No Cooldown)](https://leetcode.com/problems/best-time-to-buy-and-sell-stock-ii/) | [Stock IV (K Transactions)](./02-Stock-IV-LC188.md)
