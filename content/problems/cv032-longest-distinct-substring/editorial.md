# Editorial: The Non-Repeating Mosaic Pattern

## Problem Analysis
Sliding window with hash map: store the latest index of each seen character. When duplicate encountered in current window, jump left pointer to char_map[char] + 1.

## Complexity Analysis
- **Time Complexity:** O(N)
- **Space Complexity:** O(min(N, Sigma))
