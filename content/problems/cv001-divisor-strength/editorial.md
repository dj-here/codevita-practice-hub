# Editorial: The Divisor Strength of Vaults

## Problem Analysis
Iterate from d = 1 up to sqrt(N). For every divisor d, if N % d == 0, add 1. If d != N // d, also add the paired divisor.

## Complexity Analysis
- **Time Complexity:** O(sqrt(N))
- **Space Complexity:** O(1)
