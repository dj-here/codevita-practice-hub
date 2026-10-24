# Editorial: The Arbitrage Negative Weight Cycle Investigator

## Problem Analysis
Bellman-Ford algorithm: relax all E edges V-1 times; a further relaxation on step V proves the presence of a negative cycle.

## Complexity Analysis
- **Time Complexity:** O(V * E)
- **Space Complexity:** O(V)
