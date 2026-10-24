# Editorial: The Cryptographic Beacon Occurrences

## Problem Analysis
Knuth-Morris-Pratt (KMP) algorithm: preprocess the pattern into a Longest Prefix Suffix (LPS) table in O(M), then match text in O(N) linear time without backtracking.

## Complexity Analysis
- **Time Complexity:** O(N + M)
- **Space Complexity:** O(M)
