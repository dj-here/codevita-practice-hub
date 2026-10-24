# Editorial: The Harmonic Sum of Divisors

## Problem Analysis
Iterate d from 1 to floor(sqrt(N)); if d divides N, add both d and N//d to the sum.

## Complexity Analysis
- **Time Complexity:** O(sqrt(N))
- **Space Complexity:** O(1)
