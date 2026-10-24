# Editorial: The Duplicate Jewel Unique Power Sets

## Problem Analysis
Sort array first, then skip duplicates at the same recursion depth (if i > start and nums[i] == nums[i-1]).

## Complexity Analysis
- **Time Complexity:** O(2^N)
- **Space Complexity:** O(N)
