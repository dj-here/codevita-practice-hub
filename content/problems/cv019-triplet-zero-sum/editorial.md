# Editorial: The Alchemical Zero-Sum Triplet

## Problem Analysis
Sort the array. Fix the first element A[i] and use two pointers (left and right) to find matching pairs with sum -A[i]. Skip duplicates to ensure uniqueness.

## Complexity Analysis
- **Time Complexity:** O(N^2)
- **Space Complexity:** O(1) extra space beyond sorting
