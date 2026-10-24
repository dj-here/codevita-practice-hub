# Editorial: The Cellular Automaton Prison Evolution

## Problem Analysis
Cycle detection on finite state space (8 cells = 2^8 = 256 states; periodicity is at most 14 days). Fast forward N modulo cycle length.

## Complexity Analysis
- **Time Complexity:** O(cycle_length) <= 14 operations
- **Space Complexity:** O(1)
