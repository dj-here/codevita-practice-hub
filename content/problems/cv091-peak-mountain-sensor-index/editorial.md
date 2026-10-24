# Editorial: The Mountain Ridge Peak Elevation

## Problem Analysis
Binary search on gradient: if nums[mid] < nums[mid + 1], peak must lie strictly to the right, else to the left or at mid.

## Complexity Analysis
- **Time Complexity:** O(log N)
- **Space Complexity:** O(1)
