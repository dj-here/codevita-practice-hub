# Editorial: The Total Bit Hamming Divergence

## Problem Analysis
Examine each of the 31 bit positions independently: for a given bit, if k numbers have bit 1 and (N-k) have bit 0, they contribute k * (N-k) to total Hamming distance.

## Complexity Analysis
- **Time Complexity:** O(31 * N)
- **Space Complexity:** O(1)
