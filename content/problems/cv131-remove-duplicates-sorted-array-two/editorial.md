# Editorial: The Inventory Quota Redundancy Filter

## Problem Analysis
Two pointers: write index k advances when nums[i] != nums[k - 2], guaranteeing no element appears more than twice.

## Complexity Analysis
- **Time Complexity:** O(N)
- **Space Complexity:** O(1)
