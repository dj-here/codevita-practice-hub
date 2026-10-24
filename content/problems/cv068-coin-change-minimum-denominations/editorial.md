# Editorial: The Alchemist Coin Dispenser

## Problem Analysis
Unbounded knapsack DP: dp[i] represents minimum coins to form value i, computed as min(dp[i], dp[i - coin] + 1).

## Complexity Analysis
- **Time Complexity:** O(N * Target)
- **Space Complexity:** O(Target)
