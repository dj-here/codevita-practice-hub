# Editorial: The Hieroglyphic Parchment Segmenter

## Problem Analysis
Dynamic programming: dp[i] is true if prefix of length i can be segmented. Iterate over distinct dictionary word lengths.

## Complexity Analysis
- **Time Complexity:** O(L * K_lens)
- **Space Complexity:** O(L)
