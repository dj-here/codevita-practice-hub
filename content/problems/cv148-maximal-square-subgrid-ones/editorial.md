# Editorial: The Fortress Maximal Bastion Square

## Problem Analysis
Dynamic programming: dp[r][c] = min(dp[r-1][c], dp[r][c-1], dp[r-1][c-1]) + 1 with 1D space optimization.

## Complexity Analysis
- **Time Complexity:** O(N * M)
- **Space Complexity:** O(M)
