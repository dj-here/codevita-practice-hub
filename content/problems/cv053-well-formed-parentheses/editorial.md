# Editorial: The Well-Balanced Spell Invocation

## Problem Analysis
Backtracking with parenthesis balance invariants: can add '(' if open_count < N, and can add ')' if close_count < open_count.

## Complexity Analysis
- **Time Complexity:** O(4^N / sqrt(N)) Catalan number
- **Space Complexity:** O(N)
