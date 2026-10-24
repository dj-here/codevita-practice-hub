# Editorial: Astronomical Factorial Zeros

## Problem Analysis
Trailing zeros are produced by factors of 10 = 2 * 5. Since factors of 2 exceed factors of 5, Legendre's formula sums floor(N / 5^k) for k >= 1.

## Complexity Analysis
- **Time Complexity:** O(log_5(N))
- **Space Complexity:** O(1)
