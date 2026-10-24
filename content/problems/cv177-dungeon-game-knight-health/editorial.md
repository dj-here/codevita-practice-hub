# Editorial: The Catacomb Knight Minimum Health

## Problem Analysis
Bottom-up dynamic programming working backwards from princess chamber: dp[r][c] = max(1, min(dp[r+1][c], dp[r][c+1]) - grid[r][c]).

## Complexity Analysis
- **Time Complexity:** O(N * M)
- **Space Complexity:** O(N * M)
