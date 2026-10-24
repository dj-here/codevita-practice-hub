# Editorial: The Labyrinth Mouse Path Counter

## Problem Analysis
DFS backtracking with visited tracking: mark current cell visited, explore all 4 adjacent cells with 1, and unmark visited upon backtrack.

## Complexity Analysis
- **Time Complexity:** O(4^(N^2)) worst case, bounded by small N <= 7
- **Space Complexity:** O(N^2)
