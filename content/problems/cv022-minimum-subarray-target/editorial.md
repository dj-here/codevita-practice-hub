# Editorial: The Efficient Caravan Supplies

## Problem Analysis
Sliding window / two pointers: expand right pointer adding to curr_sum. Whenever curr_sum >= target, update min_len and shrink from left.

## Complexity Analysis
- **Time Complexity:** O(N)
- **Space Complexity:** O(1)
