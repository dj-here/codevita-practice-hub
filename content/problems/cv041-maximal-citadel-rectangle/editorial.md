# Editorial: The Maximal Citadel Territory

## Problem Analysis
Convert the 2D grid into dynamic 1D histograms. For each row r, heights[c] accumulates consecutive 1s. Then compute Largest Rectangle in Histogram using a monotonic stack in O(C).

## Complexity Analysis
- **Time Complexity:** O(R * C)
- **Space Complexity:** O(C)
