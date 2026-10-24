# Editorial: The Vault Subset Sum Target

## Problem Analysis
Recursive backtracking: at each index, branch into including or excluding arr[idx]. Prune branches exceeding Target.

## Complexity Analysis
- **Time Complexity:** O(2^N)
- **Space Complexity:** O(N)
