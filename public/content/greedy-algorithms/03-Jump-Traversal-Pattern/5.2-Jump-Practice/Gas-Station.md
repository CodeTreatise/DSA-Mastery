# Gas Station - Practice Problem

> **LeetCode 134:** [Gas Station](https://leetcode.com/problems/gas-station/)
> 
> **Difficulty:** Medium | **Pattern:** Circular Traversal + Running Surplus | **Time:** O(n)

---

## 📋 Problem Statement

There are `n` gas stations along a circular route, where the amount of gas at the `ith` station is `gas[i]`.

You have a car with an unlimited gas tank and it costs `cost[i]` of gas to travel from the `ith` station to its next `(i + 1)th` station. You begin the journey with an empty tank at one of the gas stations.

Given two integer arrays `gas` and `cost`, return the starting gas station's index if you can travel around the circuit once in the clockwise direction, otherwise return `-1`. If there exists a solution, it is **guaranteed to be unique**.

**Example 1:**
```
Input: gas = [1,2,3,4,5], cost = [3,4,5,1,2]
Output: 3
Explanation:
Start at station 3 (index 3) and fill up with 4 units of gas. Tank = 0 + 4 = 4
Travel to station 4. Tank = 4 - 1 + 5 = 8
Travel to station 0. Tank = 8 - 2 + 1 = 7
Travel to station 1. Tank = 7 - 3 + 2 = 6
Travel to station 2. Tank = 6 - 4 + 3 = 5
Travel to station 3. The cost is 5. Tank is just enough to travel back.
```

**Example 2:**
```
Input: gas = [2,3,4], cost = [3,4,3]
Output: -1
Explanation: You can't complete the circuit.
```

**Constraints:**
- n == gas.length == cost.length
- 1 ≤ n ≤ 10^5
- 0 ≤ gas[i], cost[i] ≤ 10^4

---

## 🎯 Pattern Recognition

**Key Insights:**

1. **Feasibility Check:**
```
If sum(gas) >= sum(cost), a solution EXISTS.
If sum(gas) < sum(cost), NO solution.
```

2. **Finding the Start:**
```
If starting from station i we run out of gas before station j,
then NO station between i and j can be the start either.
→ Skip directly to j+1 as new candidate.
```

**Greedy Choice:**
```
Track running surplus (tank).
When tank goes negative, reset:
- The current start can't work
- No station before current can work either
- Start over from next station
```

---

## 📐 Solution Approach

### Algorithm

```
1. total_tank = 0 (tracks overall feasibility)
2. current_tank = 0 (tracks current run)
3. start = 0 (candidate starting station)

4. For each station i:
   a. surplus = gas[i] - cost[i]
   b. Add surplus to both tanks
   c. If current_tank < 0:
      - Can't complete from current start
      - Try starting from i+1
      - Reset current_tank = 0

5. If total_tank >= 0: return start
   Else: return -1
```

### Visual Trace

```
gas  = [1, 2, 3, 4, 5]
cost = [3, 4, 5, 1, 2]
diff = [-2,-2,-2,+3,+3]

Running surplus from each start:

Start 0: -2 → negative at station 0! Try station 1.
Start 1: -2 → negative at station 1! Try station 2.
Start 2: -2 → negative at station 2! Try station 3.
Start 3: +3 → ok
  Station 4: +3+3=+6 → ok
  Station 0: +6-2=+4 → ok
  Station 1: +4-2=+2 → ok
  Station 2: +2-2=0 → ok, back to start!

Total sum = -2-2-2+3+3 = 0 >= 0 → solution exists at station 3
```

---

## 💻 Solutions

### Solution 1: Single Pass Greedy (Optimal)

```python
def canCompleteCircuit(gas: list[int], cost: list[int]) -> int:
    """
    Find starting station for circular route.
    
    Key insight: 
    - If total_gas >= total_cost, solution exists
    - Start from first station after last deficit point
    
    Time: O(n), Space: O(1)
    """
    total_tank = 0   # Total surplus (for feasibility)
    current_tank = 0 # Current running tank
    start = 0        # Candidate starting station
    
    for i in range(len(gas)):
        surplus = gas[i] - cost[i]
        total_tank += surplus
        current_tank += surplus
        
        # Can't reach next station from current start
        if current_tank < 0:
            start = i + 1      # Try next station
            current_tank = 0   # Reset tank
    
    # If total surplus is non-negative, 'start' is the answer
    return start if total_tank >= 0 else -1
```

```javascript
function canCompleteCircuit(gas, cost) {
    let totalTank = 0;
    let currentTank = 0;
    let start = 0;
    
    for (let i = 0; i < gas.length; i++) {
        const surplus = gas[i] - cost[i];
        totalTank += surplus;
        currentTank += surplus;
        
        if (currentTank < 0) {
            start = i + 1;
            currentTank = 0;
        }
    }
    
    return totalTank >= 0 ? start : -1;
}
```

---

### Solution 2: Brute Force (For Verification)

```python
def canCompleteCircuitBrute(gas: list[int], cost: list[int]) -> int:
    """
    O(n²) brute force - try each starting point.
    Use to verify greedy solution.
    """
    n = len(gas)
    
    for start in range(n):
        tank = 0
        success = True
        
        for i in range(n):
            station = (start + i) % n
            tank += gas[station] - cost[station]
            
            if tank < 0:
                success = False
                break
        
        if success:
            return start
    
    return -1
```

---

## 🔍 Detailed Trace

```
gas  = [1, 2, 3, 4, 5]
cost = [3, 4, 5, 1, 2]

Initialize:
  total_tank = 0
  current_tank = 0
  start = 0

i=0:
  surplus = 1 - 3 = -2
  total_tank = -2
  current_tank = -2
  current_tank < 0? YES
    start = 1
    current_tank = 0

i=1:
  surplus = 2 - 4 = -2
  total_tank = -4
  current_tank = -2
  current_tank < 0? YES
    start = 2
    current_tank = 0

i=2:
  surplus = 3 - 5 = -2
  total_tank = -6
  current_tank = -2
  current_tank < 0? YES
    start = 3
    current_tank = 0

i=3:
  surplus = 4 - 1 = +3
  total_tank = -3
  current_tank = +3
  current_tank < 0? NO

i=4:
  surplus = 5 - 2 = +3
  total_tank = 0
  current_tank = +6
  current_tank < 0? NO

Final check:
  total_tank = 0 >= 0? YES → return start = 3
```

---

## 📊 Why This Works

### Theorem: If sum(gas) >= sum(cost), a valid start exists

**Proof Sketch:**
```
Consider the prefix sums of (gas[i] - cost[i]).
The minimum prefix sum occurs at some index k.
Starting from k+1 guarantees we never go negative
because we "postpone" the negative portion to the end.

Since total sum >= 0, when we reach the end and wrap around,
we'll have enough accumulated surplus to cover the initial deficit.
```

### Why Skip to Next Station?

```
If we can't reach station j from station i:
  tank at j < 0

Can we start from any station between i and j? NO!

Proof:
  Starting from i: tank[i] = surplus[i]
  At i+1: tank[i+1] = surplus[i] + surplus[i+1]
  ...
  At j: tank[j] < 0

If we started from i+1 instead:
  tank'[j] = surplus[i+1] + ... + surplus[j]
           = tank[j] - surplus[i]
           
Since surplus[i] ≥ 0 (otherwise we'd have failed earlier),
tank'[j] ≤ tank[j] < 0

So starting from i+1 is even worse! Same for i+2, etc.
→ Must skip all the way to j+1.
```

---

## ⚠️ Edge Cases

| Case | Input | Output | Explanation |
|------|-------|--------|-------------|
| All surplus | gas=[5,5], cost=[1,1] | 0 | Any start works |
| All deficit | gas=[1,1], cost=[5,5] | -1 | Impossible |
| Single station | gas=[5], cost=[4] | 0 | Only option |
| Single station fail | gas=[4], cost=[5] | -1 | Not enough gas |
| Zero everywhere | gas=[0,0], cost=[0,0] | 0 | Trivial solution |
| Last station start | gas=[1,1,3], cost=[2,2,1] | 2 | Start at end |

---

## ⚡ Complexity Analysis

| Approach | Time | Space |
|----------|------|-------|
| Greedy | O(n) | O(1) |
| Brute Force | O(n²) | O(1) |

**Greedy optimization:**
- Single pass through array
- Each station visited exactly once
- No need for circular iteration (the math handles it)

---

## 🔄 Common Variations

### Variation 1: Return All Valid Starts

```python
def allValidStarts(gas, cost):
    """
    Find all valid starting stations.
    (Only one exists per problem constraints, but for general case)
    """
    n = len(gas)
    result = []
    
    for start in range(n):
        tank = 0
        valid = True
        
        for i in range(n):
            idx = (start + i) % n
            tank += gas[idx] - cost[idx]
            if tank < 0:
                valid = False
                break
        
        if valid:
            result.append(start)
    
    return result
```

### Variation 2: Minimum Start Gas Needed

```python
def minStartGas(gas, cost):
    """
    If starting with extra gas, what's the minimum needed?
    """
    min_tank = 0
    tank = 0
    
    for i in range(len(gas)):
        tank += gas[i] - cost[i]
        min_tank = min(min_tank, tank)
    
    return max(0, -min_tank)
```

---

## 📝 Common Mistakes

### 1. Not Checking Total Feasibility

```python
# ❌ WRONG: Only tracking current tank
# May return invalid start

# ✅ CORRECT: Track both total and current
total_tank += surplus
current_tank += surplus
...
return start if total_tank >= 0 else -1
```

### 2. Off-by-One for Start Index

```python
# ❌ WRONG: Set start = i (the failing station)
if current_tank < 0:
    start = i  # Wrong! This station also fails

# ✅ CORRECT: Start from NEXT station
if current_tank < 0:
    start = i + 1
```

### 3. Forgetting to Reset Tank

```python
# ❌ WRONG: Not resetting current_tank
if current_tank < 0:
    start = i + 1
    # Forgot to reset!

# ✅ CORRECT: Reset current_tank
if current_tank < 0:
    start = i + 1
    current_tank = 0
```

---

## 🎤 Interview Tips

**Opening statement:**
```
"This is a circular traversal problem. I need to find where to start.

Key insight: If total gas >= total cost, a solution exists.
The question is just WHERE to start.

I'll track running surplus. When it goes negative, I know
my current start (and all previous) can't work, so I reset
to the next station.

O(n) time, O(1) space."
```

**What to clarify:**
- "Is solution guaranteed to be unique?" (Yes, per problem)
- "Can gas or cost be negative?" (No, both >= 0)
- "Is 0 a valid tank level?" (Yes, can arrive with empty tank)

**Follow-up questions:**
- "What if multiple solutions?" → Return all or first
- "What's the minimum extra gas needed?" → Track min prefix sum
- "What if route is not circular?" → Simpler, just track suffix

---

## 🔗 Related Problems

| Problem | Relationship |
|---------|--------------|
| [Jump Game](https://leetcode.com/problems/jump-game/) | Similar reachability |
| [Jump Game II](https://leetcode.com/problems/jump-game-ii/) | Min steps traversal |
| [Circular Array Loop](https://leetcode.com/problems/circular-array-loop/) | Circular traversal |
| [Car Pooling](https://leetcode.com/problems/car-pooling/) | Resource tracking |
