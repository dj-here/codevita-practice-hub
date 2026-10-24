# Editorial: Checkerboard Parity Balance

## Problem Analysis
Single pass accumulating cells with (r + c) % 2 == 0 into black_sum and remaining cells into white_sum. Output abs(black_sum - white_sum).

## Complexity Analysis
- **Time Complexity:** O(R * C)
- **Space Complexity:** O(1)
