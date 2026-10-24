# Editorial: The Dual Tapestry Thread Interleaver

## Problem Analysis
2D DP with 1D rolling array optimization: dp[j] indicates whether s1[0..i] and s2[0..j] can interleave to form s3[0..i+j].

## Complexity Analysis
- **Time Complexity:** O(N * M)
- **Space Complexity:** O(M)
