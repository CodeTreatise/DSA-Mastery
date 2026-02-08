# Union-Find Variations

> **Advanced Union-Find patterns for complex problems: weighted Union-Find, grouping by property, and path tracking.**
>
> These variations extend the basic pattern for problems like Accounts Merge and weighted graphs.

---

## 🎯 Pattern Recognition

<details>
<summary><strong>How to Identify These Patterns</strong></summary>

**Grouping by equivalence:**
- "Merge accounts with common email"
- "Group items with same property"
- "Collect all connected elements"

**Weighted/Ratio Union-Find:**
- "Given a/b = value, find x/y"
- "Relative relationships between elements"
- "Equations with division/multiplication"

</details>

---

## 📐 Variation 1: Accounts Merge (Grouping)

> Given accounts where each account has [name, email1, email2, ...], merge accounts that share an email.

### The Challenge

```
Input:
  ["John", "john@mail.com", "john_work@mail.com"]
  ["John", "john@mail.com", "john_home@mail.com"]
  ["Mary", "mary@mail.com"]

These share "john@mail.com", so merge:
  ["John", "john@mail.com", "john_home@mail.com", "john_work@mail.com"]
  ["Mary", "mary@mail.com"]
```

### Key Insight

Map emails to indices, union emails that appear in the same account.

**Python:**
```python
from typing import List
from collections import defaultdict

class UnionFind:
    def __init__(self, n: int):
        self.parent = list(range(n))
        self.rank = [0] * n
    
    def find(self, x: int) -> int:
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])
        return self.parent[x]
    
    def union(self, x: int, y: int) -> None:
        root_x, root_y = self.find(x), self.find(y)
        if root_x == root_y:
            return
        if self.rank[root_x] < self.rank[root_y]:
            root_x, root_y = root_y, root_x
        self.parent[root_y] = root_x
        if self.rank[root_x] == self.rank[root_y]:
            self.rank[root_x] += 1


def accountsMerge(accounts: List[List[str]]) -> List[List[str]]:
    """
    Merge accounts that share at least one common email.
    
    Approach:
    1. Map each email to a unique index
    2. Union all emails in the same account
    3. Group all emails by their root
    4. Build result with name + sorted emails
    
    Time: O(n * α(n) * log(n)) where n = total emails
    Space: O(n)
    """
    # Step 1: Assign index to each email, track email-to-name
    email_to_idx = {}
    email_to_name = {}
    idx = 0
    
    for account in accounts:
        name = account[0]
        for email in account[1:]:
            if email not in email_to_idx:
                email_to_idx[email] = idx
                idx += 1
            email_to_name[email] = name
    
    # Step 2: Union all emails in each account
    uf = UnionFind(len(email_to_idx))
    for account in accounts:
        first_email = account[1]
        first_idx = email_to_idx[first_email]
        for email in account[2:]:
            uf.union(first_idx, email_to_idx[email])
    
    # Step 3: Group emails by root
    root_to_emails = defaultdict(list)
    for email, idx in email_to_idx.items():
        root = uf.find(idx)
        root_to_emails[root].append(email)
    
    # Step 4: Build result
    result = []
    for root, emails in root_to_emails.items():
        emails.sort()
        name = email_to_name[emails[0]]
        result.append([name] + emails)
    
    return result


# Example
accounts = [
    ["John", "johnsmith@mail.com", "john_newyork@mail.com"],
    ["John", "johnsmith@mail.com", "john00@mail.com"],
    ["Mary", "mary@mail.com"],
    ["John", "johnnybravo@mail.com"]
]
for acc in accountsMerge(accounts):
    print(acc)
# ["John", "john00@mail.com", "john_newyork@mail.com", "johnsmith@mail.com"]
# ["Mary", "mary@mail.com"]
# ["John", "johnnybravo@mail.com"]
```

**JavaScript:**
```javascript
function accountsMerge(accounts) {
    const emailToIdx = new Map();
    const emailToName = new Map();
    let idx = 0;
    
    // Step 1: Index emails
    for (const account of accounts) {
        const name = account[0];
        for (let i = 1; i < account.length; i++) {
            const email = account[i];
            if (!emailToIdx.has(email)) {
                emailToIdx.set(email, idx++);
            }
            emailToName.set(email, name);
        }
    }
    
    // Step 2: Union emails in same account
    const parent = Array.from({ length: idx }, (_, i) => i);
    const rank = new Array(idx).fill(0);
    
    function find(x) {
        if (parent[x] !== x) parent[x] = find(parent[x]);
        return parent[x];
    }
    
    function union(x, y) {
        let rootX = find(x), rootY = find(y);
        if (rootX === rootY) return;
        if (rank[rootX] < rank[rootY]) [rootX, rootY] = [rootY, rootX];
        parent[rootY] = rootX;
        if (rank[rootX] === rank[rootY]) rank[rootX]++;
    }
    
    for (const account of accounts) {
        const firstIdx = emailToIdx.get(account[1]);
        for (let i = 2; i < account.length; i++) {
            union(firstIdx, emailToIdx.get(account[i]));
        }
    }
    
    // Step 3: Group by root
    const rootToEmails = new Map();
    for (const [email, i] of emailToIdx) {
        const root = find(i);
        if (!rootToEmails.has(root)) rootToEmails.set(root, []);
        rootToEmails.get(root).push(email);
    }
    
    // Step 4: Build result
    const result = [];
    for (const emails of rootToEmails.values()) {
        emails.sort();
        const name = emailToName.get(emails[0]);
        result.push([name, ...emails]);
    }
    
    return result;
}
```

---

## 📐 Variation 2: Weighted Union-Find (Equations)

> Given equations like a/b = 2.0 and b/c = 3.0, evaluate queries like a/c.

### The Challenge

```
equations: [["a","b"], ["b","c"]]
values: [2.0, 3.0]
queries: [["a","c"], ["b","a"], ["a","e"], ["a","a"]]

a/b = 2.0 means a = 2*b
b/c = 3.0 means b = 3*c
Therefore: a = 2*b = 2*3*c = 6*c → a/c = 6.0
```

### Key Insight

Store the ratio to the parent along with the parent pointer.

**Python:**
```python
from typing import List
from collections import defaultdict

class WeightedUnionFind:
    """Union-Find where each node stores weight relative to parent."""
    
    def __init__(self):
        self.parent = {}    # node → parent
        self.weight = {}    # node → weight (node/parent ratio)
    
    def find(self, x: str) -> tuple:
        """
        Returns (root, weight) where weight = x / root.
        
        Also does path compression with weight updates.
        """
        if x not in self.parent:
            self.parent[x] = x
            self.weight[x] = 1.0
            return (x, 1.0)
        
        if self.parent[x] == x:
            return (x, 1.0)
        
        # Recursively find root and update weights
        root, root_weight = self.find(self.parent[x])
        self.parent[x] = root
        self.weight[x] *= root_weight  # x/root = (x/parent) * (parent/root)
        return (root, self.weight[x])
    
    def union(self, x: str, y: str, ratio: float) -> None:
        """
        Union x and y with x/y = ratio.
        """
        root_x, weight_x = self.find(x)  # weight_x = x / root_x
        root_y, weight_y = self.find(y)  # weight_y = y / root_y
        
        if root_x == root_y:
            return  # Already connected
        
        # Connect root_x to root_y
        # We need: root_x / root_y = ?
        # Given: x / y = ratio
        # x / root_x = weight_x → x = weight_x * root_x
        # y / root_y = weight_y → y = weight_y * root_y
        # x / y = ratio
        # (weight_x * root_x) / (weight_y * root_y) = ratio
        # root_x / root_y = ratio * weight_y / weight_x
        
        self.parent[root_x] = root_y
        self.weight[root_x] = ratio * weight_y / weight_x
    
    def query(self, x: str, y: str) -> float:
        """
        Returns x / y if both exist and are connected.
        Returns -1.0 otherwise.
        """
        if x not in self.parent or y not in self.parent:
            return -1.0
        
        root_x, weight_x = self.find(x)
        root_y, weight_y = self.find(y)
        
        if root_x != root_y:
            return -1.0  # Not connected
        
        # x / y = (x / root) / (y / root) = weight_x / weight_y
        return weight_x / weight_y


def calcEquation(equations: List[List[str]], values: List[float], 
                 queries: List[List[str]]) -> List[float]:
    """
    Evaluate division queries given known equation values.
    
    Time: O((E + Q) * α(V)) where E = equations, Q = queries, V = variables
    Space: O(V)
    """
    uf = WeightedUnionFind()
    
    # Build the weighted union-find
    for (x, y), value in zip(equations, values):
        uf.union(x, y, value)  # x / y = value
    
    # Answer queries
    return [uf.query(x, y) for x, y in queries]


# Example
equations = [["a", "b"], ["b", "c"]]
values = [2.0, 3.0]
queries = [["a", "c"], ["b", "a"], ["a", "e"], ["a", "a"], ["x", "x"]]
print(calcEquation(equations, values, queries))
# [6.0, 0.5, -1.0, 1.0, -1.0]
```

**JavaScript:**
```javascript
function calcEquation(equations, values, queries) {
    const parent = new Map();
    const weight = new Map();
    
    function find(x) {
        if (!parent.has(x)) {
            parent.set(x, x);
            weight.set(x, 1.0);
            return [x, 1.0];
        }
        
        if (parent.get(x) === x) {
            return [x, 1.0];
        }
        
        const [root, rootWeight] = find(parent.get(x));
        parent.set(x, root);
        weight.set(x, weight.get(x) * rootWeight);
        return [root, weight.get(x)];
    }
    
    function union(x, y, ratio) {
        const [rootX, weightX] = find(x);
        const [rootY, weightY] = find(y);
        
        if (rootX === rootY) return;
        
        parent.set(rootX, rootY);
        weight.set(rootX, ratio * weightY / weightX);
    }
    
    function query(x, y) {
        if (!parent.has(x) || !parent.has(y)) return -1.0;
        
        const [rootX, weightX] = find(x);
        const [rootY, weightY] = find(y);
        
        if (rootX !== rootY) return -1.0;
        
        return weightX / weightY;
    }
    
    // Build
    for (let i = 0; i < equations.length; i++) {
        union(equations[i][0], equations[i][1], values[i]);
    }
    
    // Query
    return queries.map(([x, y]) => query(x, y));
}
```

---

## 📐 Variation 3: Union-Find with Size

> Track the size of each set (useful for balancing and counting).

**Python:**
```python
class UnionFindWithSize:
    """Union-Find that tracks size of each set."""
    
    def __init__(self, n: int):
        self.parent = list(range(n))
        self.size = [1] * n  # Each set starts with size 1
    
    def find(self, x: int) -> int:
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])
        return self.parent[x]
    
    def union(self, x: int, y: int) -> bool:
        root_x, root_y = self.find(x), self.find(y)
        if root_x == root_y:
            return False
        
        # Union by size (attach smaller to larger)
        if self.size[root_x] < self.size[root_y]:
            root_x, root_y = root_y, root_x
        
        self.parent[root_y] = root_x
        self.size[root_x] += self.size[root_y]
        return True
    
    def get_size(self, x: int) -> int:
        """Get the size of the set containing x."""
        return self.size[self.find(x)]
    
    def get_max_size(self) -> int:
        """Get the size of the largest set."""
        return max(self.size[i] for i in range(len(self.parent)) 
                   if self.parent[i] == i)


# Example: Most Stones Removed with Same Row or Column
def removeStones(stones):
    """
    Stones connected by same row/col can be removed.
    Max removals = n - number of connected components.
    """
    n = len(stones)
    uf = UnionFindWithSize(n)
    
    # Map rows and columns to stone indices
    row_map = {}  # row → first stone index in this row
    col_map = {}  # col → first stone index in this col
    
    for i, (r, c) in enumerate(stones):
        if r in row_map:
            uf.union(i, row_map[r])
        else:
            row_map[r] = i
        
        if c in col_map:
            uf.union(i, col_map[c])
        else:
            col_map[c] = i
    
    # Count unique roots (components)
    roots = set(uf.find(i) for i in range(n))
    return n - len(roots)
```

---

## ⚠️ Common Mistakes

### 1. Accounts Merge: Not Handling Multiple Accounts with Same Name

```python
# ❌ Wrong: Assuming name is unique identifier
result[name].extend(emails)  # May overwrite different person!

# ✅ Correct: Use union-find to determine actual groups
# Multiple Johns who don't share email stay separate
```

### 2. Weighted UF: Wrong Weight Update During Path Compression

```python
# ❌ Wrong: Forgetting to multiply weights
def find(self, x):
    if self.parent[x] != x:
        self.parent[x] = self.find(self.parent[x])
        # Forgot to update weight!
    return self.parent[x]

# ✅ Correct: Update weight along path
def find(self, x):
    if self.parent[x] != x:
        root, root_weight = self.find(self.parent[x])
        self.parent[x] = root
        self.weight[x] *= root_weight  # Accumulate weights
    return (self.parent[x], self.weight[x])
```

### 3. Size: Updating Wrong Size Array

```python
# ❌ Wrong: Updating size at child instead of root
self.parent[root_y] = root_x
self.size[root_y] += self.size[root_x]  # Wrong! root_y is no longer a root

# ✅ Correct: Update at the surviving root
self.parent[root_y] = root_x
self.size[root_x] += self.size[root_y]  # root_x is the new root
```

---

## 📝 Practice Problems

| Problem | Difficulty | Variation |
|---------|------------|-----------|
| [Accounts Merge](https://leetcode.com/problems/accounts-merge/) | Medium | Grouping |
| [Evaluate Division](https://leetcode.com/problems/evaluate-division/) | Medium | Weighted |
| [Most Stones Removed](https://leetcode.com/problems/most-stones-removed-with-same-row-or-column/) | Medium | Size tracking |
| [Sentence Similarity II](https://leetcode.com/problems/sentence-similarity-ii/) | Medium | String grouping |
| [Longest Consecutive Sequence](https://leetcode.com/problems/longest-consecutive-sequence/) | Medium | Size tracking |

---

## ⏱️ Time Estimates

| Variation | Learn Time | Implement Time | Notes |
|-----------|------------|----------------|-------|
| Grouping (Accounts) | 20 min | 25 min | Email indexing |
| Weighted | 30 min | 30 min | Weight math tricky |
| Size tracking | 10 min | 15 min | Simple extension |

---

> **💡 Key Insight:** Union-Find is remarkably flexible. By tracking additional information at each node (size, weight, group members), we can solve problems that seem unrelated to basic connectivity.

> **🔗 Related:** [Union-Find Fundamentals](../1.1-Union-Find-Fundamentals.md) | [Practice Problems →](../1.5-Practice-Problems.md)

---

**Next:** [Practice Problems →](../1.5-Practice-Problems.md)
