# Editorial: The Starlight Diagonal Crossing

## Problem Analysis
In a single pass over rows 0 to N-1, add row[i] (primary diagonal) and row[N - 1 - i] (secondary diagonal), skipping if i == N - 1 - i to avoid double counting.

## Complexity Analysis
- **Time Complexity:** O(N^2) to read, O(N) to sum
- **Space Complexity:** O(1)
