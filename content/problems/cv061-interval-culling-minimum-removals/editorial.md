# Editorial: The Astronomical Window Collision

## Problem Analysis
Sort intervals by end time. Greedily keep intervals that finish earliest to leave maximum room for future intervals. Count skipped/removed intervals.

## Complexity Analysis
- **Time Complexity:** O(N log N)
- **Space Complexity:** O(N)
