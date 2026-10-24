# Editorial: The Lexicographical Permutation Rank

## Problem Analysis
Factorial counting: at each index, count remaining available characters smaller than current, scaled by (remaining - 1)! modulo 10^9+7.

## Complexity Analysis
- **Time Complexity:** O(N^2)
- **Space Complexity:** O(N)
