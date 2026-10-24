# Editorial: Terrace Rainwater Harvesting

## Problem Analysis
Two-pointer technique: maintain left and right pointers moving inward, tracking left_max and right_max. Water trapped at each bar is determined by min(left_max, right_max) - height[i].

## Complexity Analysis
- **Time Complexity:** O(N)
- **Space Complexity:** O(1)
