# Editorial: The Royal Archive Common Prefix

## Problem Analysis
Initialize prefix as the first string. For each subsequent string, trim prefix from right until s.startswith(prefix) holds.

## Complexity Analysis
- **Time Complexity:** O(N * M) where M is max length
- **Space Complexity:** O(1)
