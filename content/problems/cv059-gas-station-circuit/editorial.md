# Editorial: The Great Desert Circular Rally

## Problem Analysis
Greedy one-pass: if total_gas < total_cost, impossible (-1). If curr_tank dips below 0 at station i, the valid start must be after i.

## Complexity Analysis
- **Time Complexity:** O(N)
- **Space Complexity:** O(1)
