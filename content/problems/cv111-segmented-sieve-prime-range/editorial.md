# Editorial: The Starlight Sector Prime Density

## Problem Analysis
Segmented Sieve: sieve primes up to sqrt(R), then use those primes to mark composite multiples in the range [L, R].

## Complexity Analysis
- **Time Complexity:** O(sqrt(R) log(log sqrt(R)) + (R - L) log(log R))
- **Space Complexity:** O(R - L + sqrt(R))
