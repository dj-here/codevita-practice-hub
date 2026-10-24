# Editorial: Euler Totient Multi-Test

## Problem Analysis
Factor N into primes. For each distinct prime factor p of N, multiply ans by (1 - 1/p). Runs in O(sqrt(N)).

## Complexity Analysis
- **Time Complexity:** O(sqrt(N))
- **Space Complexity:** O(1)
