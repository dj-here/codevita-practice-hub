# Editorial: The Traveling Merchant Profit Surge

## Problem Analysis
Kadane's algorithm maintains the maximum subarray sum ending at index i: curr_max = max(A[i], curr_max + A[i]). Updates global max.

## Complexity Analysis
- **Time Complexity:** O(N)
- **Space Complexity:** O(1)
