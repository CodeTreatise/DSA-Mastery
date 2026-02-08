# Lemonade Change (LeetCode 860)

> **Pattern:** Simulation Greedy
> **Difficulty:** Easy
> **Company Focus:** Amazon, Microsoft (easy interview warm-up)

---

## 📋 Problem Statement

At a lemonade stand, each lemonade costs `$5`. Customers are standing in a queue to buy from you. Each customer will only buy one lemonade and pay with a `$5`, `$10`, or `$20` bill.

You must provide the correct change to each customer. Note that you don't have any change in hand at first.

Return `true` if you can provide every customer with correct change, or `false` otherwise.

### Examples

```
Input: bills = [5,5,5,10,20]
Output: true
Explanation:
- First 3 give $5 → keep
- Fourth gives $10 → give $5 back (have 2×$5, 1×$10)
- Fifth gives $20 → give $10+$5 back ✓

Input: bills = [5,5,10,10,20]
Output: false
Explanation:
- 5,5 → keep (2×$5)
- 10 → give $5 back (1×$5, 1×$10)
- 10 → give $5 back (0×$5, 2×$10)
- 20 → need $15, but only have 2×$10 ❌

Input: bills = [5,5,10]
Output: true
```

### Constraints

- `1 <= bills.length <= 10^5`
- `bills[i]` is either `5`, `10`, or `20`

---

## 🎯 Pattern Recognition

**Signals:**
- Simulation of real-world process
- Limited resources (bills) to manage
- Greedy choice: use $10 before $5 for $15 change

**This is a simple simulation with one greedy decision.**

---

## 🧠 Intuition

### The Key Greedy Choice

When giving $15 change (for $20 bill), you have two options:
1. Give 1×$10 + 1×$5
2. Give 3×$5

**Greedy: Prefer option 1** (use $10 first)

Why? The $5 bill is more versatile:
- $5 change → only $5 works
- $15 change → both work, but $10 is less useful alone

---

## 💻 Solution

```python
def lemonadeChange(bills: list[int]) -> bool:
    """
    LeetCode 860: Lemonade Change
    
    Track $5 and $10 bills. For $15 change, prefer $10+$5.
    
    Time: O(n), Space: O(1)
    """
    five = ten = 0
    
    for bill in bills:
        if bill == 5:
            five += 1
        
        elif bill == 10:
            if five == 0:
                return False
            five -= 1
            ten += 1
        
        else:  # bill == 20
            # Prefer $10 + $5 over 3×$5
            if ten > 0 and five > 0:
                ten -= 1
                five -= 1
            elif five >= 3:
                five -= 3
            else:
                return False
    
    return True
```

```javascript
function lemonadeChange(bills) {
    let five = 0, ten = 0;
    
    for (const bill of bills) {
        if (bill === 5) {
            five++;
        } else if (bill === 10) {
            if (five === 0) return false;
            five--;
            ten++;
        } else { // bill === 20
            if (ten > 0 && five > 0) {
                ten--;
                five--;
            } else if (five >= 3) {
                five -= 3;
            } else {
                return false;
            }
        }
    }
    
    return true;
}
```

---

## 📐 Step-by-Step Trace

```
bills = [5, 5, 5, 10, 20]

Initial: five=0, ten=0

bill=5:  five=1, ten=0
bill=5:  five=2, ten=0
bill=5:  five=3, ten=0
bill=10: Need $5 change → five=2, ten=1
bill=20: Need $15 change
         ten>0 && five>0 → five=1, ten=0 ✓

All processed → return true
```

---

## ⚡ Complexity Analysis

| Metric | Value | Explanation |
|--------|-------|-------------|
| Time | O(n) | Single pass through bills |
| Space | O(1) | Only two counters |

---

## ⚠️ Common Mistakes

### 1. Tracking $20 Bills

```python
# ❌ Wrong: Tracking twenties
twenty = 0
if bill == 20:
    twenty += 1  # Never used for change!

# ✅ Correct: Don't track $20 (never give as change)
# Only track five and ten
```

### 2. Wrong Order for $15 Change

```python
# ❌ Wrong: Try 3×$5 first
if five >= 3:
    five -= 3
elif ten > 0 and five > 0:
    ten -= 1
    five -= 1

# ✅ Correct: Use $10 first (preserve $5s)
if ten > 0 and five > 0:
    ten -= 1
    five -= 1
elif five >= 3:
    five -= 3
```

### 3. Forgetting to Check Before Decrement

```python
# ❌ Wrong: Not checking availability
five -= 1  # Could go negative!

# ✅ Correct: Check first
if five == 0:
    return False
five -= 1
```

---

## 🔄 Why Greedy Order Matters

```
Example where order matters:
bills = [5, 5, 10, 20, 5, 5, 10]

If we use 3×$5 for $20:
- After 5,5,10: five=1, ten=1
- 20: Use 3×$5... but only have 1! ❌

If we use $10+$5 for $20:
- After 5,5,10: five=1, ten=1
- 20: Use $10+$5 → five=0, ten=0 ✓
- 5: five=1
- 5: five=2
- 10: Use $5 → five=1, ten=1 ✓

Same scenario, different outcome based on greedy choice!
```

---

## 🔗 Related Problems

| Problem | Connection | Link |
|---------|------------|------|
| Assign Cookies | Simple matching | [LC 455](https://leetcode.com/problems/assign-cookies/) |
| Gas Station | Resource management | [LC 134](https://leetcode.com/problems/gas-station/) |
| Coin Change | Change making (DP) | [LC 322](https://leetcode.com/problems/coin-change/) |

---

## 🎤 Interview Tips

<details>
<summary><strong>How to Communicate</strong></summary>

**Opening (15 sec):**
"I'll simulate the process, tracking my $5 and $10 bills. The key decision is when giving $15 change - I should use a $10 if available to preserve my $5s."

**Why preserve $5s:**
"$5 bills are more versatile - they're needed for both $5 and $15 change, while $10 only helps with $15 change."

**Code (2-3 min):**
Simple if-else for three cases.

</details>

---

## ⏱️ Time Estimates

| Activity | Time |
|----------|------|
| Understand problem | 1 min |
| Identify greedy choice | 1 min |
| Code solution | 3 min |
| Test | 1 min |
| **Total** | **6-8 min** |

---

> **💡 Key Insight:** In resource management problems, preserve the more versatile resource. Here, $5 is more versatile than $10, so use $10 first when possible.

> **🔗 Related:** [Classic Overview](../7.1-Classic-Problems-Overview.md)
