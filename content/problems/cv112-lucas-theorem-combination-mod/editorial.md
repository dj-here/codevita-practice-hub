# Editorial: The High Council Electoral Combinations

## Problem Analysis
Lucas' Theorem: express N and K in base P as N = sum(n_i * P^i) and K = sum(k_i * P^i). Then C(N, K) = prod(C(n_i, k_i)) mod P.

## Complexity Analysis
- **Time Complexity:** O(P + log_P(N))
- **Space Complexity:** O(P)
