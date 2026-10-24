# Editorial: The Fortress Rubble Obstacle Navigation

## Problem Analysis
1D space-optimized grid DP: dp[c] = dp[c] + dp[c-1], resetting dp[c] = 0 when cell is an obstacle.

## Complexity Analysis
- **Time Complexity:** O(N * M)
- **Space Complexity:** O(M)
