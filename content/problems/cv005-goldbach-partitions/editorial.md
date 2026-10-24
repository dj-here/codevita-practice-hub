# Editorial: Goldbach Unique Partitions

## Problem Analysis
Run the Sieve of Eratosthenes up to N using a compact bytearray. Then count prime p1 in [2, N//2] where N - p1 is also prime.

## Complexity Analysis
- **Time Complexity:** O(N log log N)
- **Space Complexity:** O(N)
