# Editorial: Co-Prime Harvest Season

## Problem Analysis
Iterate all pairs (a, b) such that L <= a < b <= R. Use Euclidean algorithm (math.gcd) to test gcd(a, b) == 1 and increment the counter.

## Complexity Analysis
- **Time Complexity:** O((R - L)^2 * log(R))
- **Space Complexity:** O(1)
