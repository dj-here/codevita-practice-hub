# Editorial: The Canonical Subsequence Occurrence Count

## Problem Analysis
1D space-optimized DP updating backwards: dp[j] = (dp[j] + dp[j - 1]) % MOD whenever s[i] == t[j].

## Complexity Analysis
- **Time Complexity:** O(|S| * |T|)
- **Space Complexity:** O(|T|)
