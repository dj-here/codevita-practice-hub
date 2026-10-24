# Editorial: The Rune Crypt Word Search

## Problem Analysis
Backtracking DFS: explore 4 directions matching Word[k]. Mark cell visited during exploration and unmark upon backtrack.

## Complexity Analysis
- **Time Complexity:** O(R * C * 4^L) where L = len(Word)
- **Space Complexity:** O(L) recursion stack
