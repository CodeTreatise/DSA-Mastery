# 04 - Online Stock Span (LC 901)

> **Grokking Pattern:** Monotonic Stack (Previous Greater)
>
> **Difficulty:** Medium | **Frequency:** ⭐⭐⭐⭐ Common in Finance-Themed Interviews

---

## Problem Statement

Design an algorithm that collects daily price quotes for a stock and returns the **span** of that stock's price for the current day.

The **span** of the stock's price in one day is the maximum number of consecutive days (starting from that day and going backward) for which the stock price was less than or equal to the price of that day.

```
Input: ["StockSpanner", "next", "next", "next", "next", "next", "next", "next"]
       [[], [100], [80], [60], [70], [60], [75], [85]]
Output: [null, 1, 1, 1, 2, 1, 4, 6]

Explanation:
- Day 1: price=100, no previous days → span = 1
- Day 2: price=80, 80 < 100 → span = 1
- Day 3: price=60, 60 < 80 → span = 1
- Day 4: price=70, 70 > 60 → span = 2 (days 3, 4)
- Day 5: price=60, 60 < 70 → span = 1
- Day 6: price=75, 75 > 60, 75 > 70, 75 > 60, 75 < 80 → span = 4 (days 3, 4, 5, 6)
- Day 7: price=85, 85 > 75, 85 > 60, 85 > 70, 85 > 60, 85 > 80, 85 < 100 → span = 6
```

[LeetCode 901 - Online Stock Span](https://leetcode.com/problems/online-stock-span/)

---

## 🎯 Pattern Recognition

<details>
<summary><strong>How to Identify This Pattern</strong></summary>

**Look for these signals:**
- "Consecutive days" going **backward**
- Looking for elements **less than or equal** to current
- This is **Previous Greater Element** in disguise!

**Key insight:**
- Span = distance to the previous greater element
- If no previous greater element, span = all days so far

**Comparison with other problems:**
| Problem | Direction | Looking For | Returns |
|---------|-----------|-------------|---------|
| Next Greater | Forward | First greater | Value or index |
| Daily Temperatures | Forward | First greater | Distance |
| Stock Span | Backward | First greater | Count (distance + 1) |

</details>

---

## ✅ When to Use This Approach

- Counting consecutive elements meeting a condition
- Looking backward for the first element that breaks the pattern
- Online algorithms (streaming data, one element at a time)

---

## ❌ When NOT to Use

| Situation | Why Not | Use Instead |
|-----------|---------|-------------|
| Need forward span | Wrong direction | Standard monotonic stack |
| Average over window | Different problem | Sliding Window |
| Non-consecutive count | Different pattern | - |

---

## 🔗 Concept Map

<details>
<summary><strong>Prerequisites & Next Steps</strong></summary>

**Before this, you should know:**
- [Monotonic Stack Concept](../3.1-Monotonic-Stack-Concept.md)
- [Daily Temperatures](./03-Daily-Temperatures.md) - Similar but forward-looking

**After mastering this:**
- [Largest Rectangle in Histogram](../3.3-Histogram-Problems/01-Largest-Rectangle.md)
- [Sum of Subarray Minimums](https://leetcode.com/problems/sum-of-subarray-minimums/)

**Design pattern insight:**
This is an "online" algorithm - processes data as it arrives, can't look ahead.

</details>

---

## 📐 How It Works

### Strategy

1. Maintain a **decreasing stack** of (price, span) pairs
2. For each new price:
   - Pop all prices ≤ current price
   - Sum up their spans (they get "absorbed")
   - Current span = 1 + sum of absorbed spans
   - Push (price, span) onto stack

### Visual Walkthrough

```
Prices: [100, 80, 60, 70, 60, 75, 85]

Day 1: price=100
       Stack: []
       No pops, span = 1
       Push (100, 1)
       Stack: [(100, 1)]
       Return: 1

Day 2: price=80
       Stack: [(100, 1)]
       80 < 100, no pops, span = 1
       Push (80, 1)
       Stack: [(100, 1), (80, 1)]
       Return: 1

Day 3: price=60
       Stack: [(100, 1), (80, 1)]
       60 < 80, no pops, span = 1
       Push (60, 1)
       Stack: [(100, 1), (80, 1), (60, 1)]
       Return: 1

Day 4: price=70
       Stack: [(100, 1), (80, 1), (60, 1)]
       70 > 60, pop (60, 1), absorbed_span = 1
       70 < 80, stop
       span = 1 + 1 = 2
       Push (70, 2)
       Stack: [(100, 1), (80, 1), (70, 2)]
       Return: 2

Day 5: price=60
       Stack: [(100, 1), (80, 1), (70, 2)]
       60 < 70, no pops, span = 1
       Push (60, 1)
       Stack: [(100, 1), (80, 1), (70, 2), (60, 1)]
       Return: 1

Day 6: price=75
       Stack: [(100, 1), (80, 1), (70, 2), (60, 1)]
       75 > 60, pop (60, 1), absorbed = 1
       75 > 70, pop (70, 2), absorbed = 1 + 2 = 3
       75 < 80, stop
       span = 1 + 3 = 4
       Push (75, 4)
       Stack: [(100, 1), (80, 1), (75, 4)]
       Return: 4

Day 7: price=85
       Stack: [(100, 1), (80, 1), (75, 4)]
       85 > 75, pop (75, 4), absorbed = 4
       85 > 80, pop (80, 1), absorbed = 4 + 1 = 5
       85 < 100, stop
       span = 1 + 5 = 6
       Push (85, 6)
       Stack: [(100, 1), (85, 6)]
       Return: 6
```

### Why Store (price, span) Instead of Just Price?

When we pop an element, we lose its information. By storing the span, we "absorb" the days that element represented.

```
Example: At day 6 (price=75), we pop (70, 2)

That span=2 means: day 4 (70) already "absorbed" day 3 (60)
So when we pop (70, 2), we absorb 2 days at once!

Without storing span:
- We'd need to re-examine all previous elements
- Would be O(n²) in worst case

With storing span:
- Each element effectively carries history
- O(1) amortized per operation
```

---

## 💻 Code Implementation

### Solution: Monotonic Stack with (Price, Span) Pairs

**Python:**
```python
class StockSpanner:
    """
    Online stock span calculator using monotonic stack.
    
    Pattern: Monotonic Decreasing Stack
    Each element is pushed once, popped at most once.
    Time: O(1) amortized per next() call
    Space: O(n) total for n calls
    """
    
    def __init__(self):
        # Stack stores (price, span) tuples
        # Maintains decreasing prices from bottom to top
        self.stack = []
    
    def next(self, price: int) -> int:
        """
        Process new price and return its span.
        
        Args:
            price: Today's stock price
            
        Returns:
            Span (consecutive days with price <= today's price)
        """
        span = 1  # At minimum, today counts
        
        # Pop all prices <= current price
        # Absorb their spans
        while self.stack and price >= self.stack[-1][0]:
            _, prev_span = self.stack.pop()
            span += prev_span
        
        # Push current price with its span
        self.stack.append((price, span))
        
        return span


# Alternative: Store (price, index) and compute span from indices
class StockSpannerWithIndex:
    def __init__(self):
        self.stack = []  # (price, index)
        self.day = 0
    
    def next(self, price: int) -> int:
        # Pop smaller or equal prices
        while self.stack and price >= self.stack[-1][0]:
            self.stack.pop()
        
        # Span = distance to previous greater price
        if self.stack:
            span = self.day - self.stack[-1][1]
        else:
            span = self.day + 1  # All days so far
        
        self.stack.append((price, self.day))
        self.day += 1
        
        return span
```

**JavaScript:**
```javascript
class StockSpanner {
    constructor() {
        // Stack of [price, span] pairs
        this.stack = [];
    }
    
    /**
     * Process new price and return its span.
     * Time: O(1) amortized
     */
    next(price) {
        let span = 1;
        
        // Pop all prices <= current
        while (this.stack.length > 0 && 
               price >= this.stack[this.stack.length - 1][0]) {
            const [, prevSpan] = this.stack.pop();
            span += prevSpan;
        }
        
        this.stack.push([price, span]);
        return span;
    }
}

// Alternative: Using indices
class StockSpannerWithIndex {
    constructor() {
        this.stack = []; // [price, index]
        this.day = 0;
    }
    
    next(price) {
        while (this.stack.length > 0 && 
               price >= this.stack[this.stack.length - 1][0]) {
            this.stack.pop();
        }
        
        let span;
        if (this.stack.length > 0) {
            span = this.day - this.stack[this.stack.length - 1][1];
        } else {
            span = this.day + 1;
        }
        
        this.stack.push([price, this.day]);
        this.day++;
        
        return span;
    }
}
```

---

## ⚡ Complexity Analysis

| Operation | Time | Space | Notes |
|-----------|------|-------|-------|
| next() |" O(1) amortized "| O(1) | Each price pushed once, popped once |
| n calls |" O(n) total "| O(n) | Stack size never exceeds n |

**Why O(1) amortized for next()?**

Even though `next()` has a while loop:
- Each price is pushed onto the stack exactly once
- Each price is popped from the stack at most once
- Over n calls: n pushes + at most n pops = O(2n) = O(n)
- Per call: O(n) / n = O(1) amortized

---

## 🔄 Variations

| Variation | Difference | Problem |
|-----------|------------|---------|
| Strictly greater | Use `>` instead of `>=` | - |
| Forward span | Look ahead instead of back | - |
| With removal | Need to support deletions | More complex data structure |

---

## ⚠️ Common Mistakes

### 1. Using Strictly Greater Instead of ≥

```python
# ❌ WRONG: Problem says "less than or equal"
while self.stack and price > self.stack[-1][0]:  # Misses equal!

# ✅ CORRECT: Include equal prices in span
while self.stack and price >= self.stack[-1][0]:
```

### 2. Forgetting to Include Current Day

```python
# ❌ WRONG: Not counting current day
span = 0
while self.stack and ...:
    span += prev_span

# ✅ CORRECT: Start with 1 for current day
span = 1
while self.stack and ...:
    span += prev_span
```

### 3. Not Accumulating Absorbed Spans

```python
# ❌ WRONG: Just popping without accumulating
while self.stack and price >= self.stack[-1][0]:
    self.stack.pop()  # Lost the span information!

# ✅ CORRECT: Accumulate spans
while self.stack and price >= self.stack[-1][0]:
    _, prev_span = self.stack.pop()
    span += prev_span  # Absorb the span
```

---

## 📝 Practice Problems (Progressive)

### This Problem
- [ ] [Online Stock Span](https://leetcode.com/problems/online-stock-span/) - LC 901 ⭐

### Related Problems
- [ ] [Daily Temperatures](https://leetcode.com/problems/daily-temperatures/) - LC 739
- [ ] [Sum of Subarray Minimums](https://leetcode.com/problems/sum-of-subarray-minimums/) - LC 907
- [ ] [Sum of Subarray Ranges](https://leetcode.com/problems/sum-of-subarray-ranges/) - LC 2104

<details>
<summary><strong>🧠 Spaced Repetition Schedule</strong></summary>

**Day 1:** Implement with (price, span) approach
**Day 3:** Implement with (price, index) approach
**Day 7:** Compare with Daily Temperatures
**Day 14:** Explain why storing spans enables O(1) amortized
**Day 21:** Solve Sum of Subarray Minimums

</details>

---

## 🎤 Interview Context

<details>
<summary><strong>How to Communicate This in Interviews</strong></summary>

**Opening statement:**
> "This is a 'previous greater element' problem in disguise. I need to find how far back I can go before hitting a price greater than today's."

**Design explanation:**
> "I'll use a class with a monotonic decreasing stack. Each element stores both price and span. When I pop elements, I absorb their spans."

**Why (price, span) pairs:**
> "If I just stored prices, I'd lose information when popping. By storing spans, when I pop (70, 2), I know that day represented 2 consecutive days of lower prices."

**Complexity explanation:**
> "Each price is pushed and popped at most once across all calls, so n operations take O(n) total time - O(1) amortized per call."

</details>

**Company Focus:**

| Company | Frequency | Notes |
|---------|-----------|-------|
| Bloomberg | ⭐⭐⭐⭐⭐ | Finance-themed, very common |
| Amazon | ⭐⭐⭐⭐ | Online algorithm design |
| Google | ⭐⭐⭐ | May combine with other concepts |

---

## ⏱️ Time Estimates

| Activity | Time | Notes |
|----------|------|-------|
| Understand problem | 3-5 min | The span definition needs careful reading |
| Identify pattern | 2-3 min | Recognize as previous greater |
| Design class | 3-5 min | Decide on stack content |
| Implement | 8-10 min | Handle edge cases |
| Interview target | 20-25 min | Including explanation |

---

> **💡 Key Insight:** The "span" approach of storing (price, span) pairs is powerful because it compresses history. When we pop an element, its span tells us how many days it already "absorbed". This is a common technique in online algorithms where we can't afford to re-examine history.

---

## 🔗 Related

- [Monotonic Stack Concept](../3.1-Monotonic-Stack-Concept.md) - Pattern overview
- [Daily Temperatures](./03-Daily-Temperatures.md) - Forward-looking variant
- [Largest Rectangle](../3.3-Histogram-Problems/01-Largest-Rectangle.md) - Uses similar span concept
