# Editorial: The Royal Carpenter Rod Optimizer

## Problem Analysis
Unbounded knapsack / rod-cutting DP: dp[i] = max over j in 1..i of (price[j] + dp[i - j]).

## Complexity Analysis
- **Time Complexity:** O(N^2)
- **Space Complexity:** O(N)
