# Editorial: The Primitive Root Cipher Core

## Problem Analysis
Euler criterion: g is a primitive root mod P iff for every prime factor q of P - 1, g^((P-1)/q) != 1 (mod P). Smallest primitive roots are typically very small.

## Complexity Analysis
- **Time Complexity:** O(sqrt(P) + num_tests * log P)
- **Space Complexity:** O(factors)
