# Editorial: The Astronomical Telescope Schedule Cull

## Problem Analysis
Greedy activity selection: sort intervals by end time and select maximum non-overlapping intervals. Removals = N - kept.

## Complexity Analysis
- **Time Complexity:** O(N log N)
- **Space Complexity:** O(N)
