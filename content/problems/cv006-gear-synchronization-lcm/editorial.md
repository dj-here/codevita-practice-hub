# Editorial: Mechanical Gear Synchronization

## Problem Analysis
Factor each number into prime powers and take the maximum exponent for each prime across all numbers. Compute the product modulo 10^9+7.

## Complexity Analysis
- **Time Complexity:** O(N * sqrt(max(T)))
- **Space Complexity:** O(P) where P is number of distinct primes <= 1000
