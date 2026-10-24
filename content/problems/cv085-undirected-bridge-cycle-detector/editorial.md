# Editorial: The Stone Bridge Loop Detector

## Problem Analysis
Disjoint Set Union (Union-Find) with path compression: adding an edge between two vertices already in the same connected component creates an undirected cycle.

## Complexity Analysis
- **Time Complexity:** O(E * alpha(V))
- **Space Complexity:** O(V)
