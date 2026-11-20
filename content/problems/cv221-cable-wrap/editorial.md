# Editorial: Cable Wrap (TCS CodeVita Season 14 MockVita 2)

## Problem Overview
You are given a 2D floor grid of size $N \times M$ containing:
- An iron rod represented by `'R'`, extending straight horizontally or vertically from one edge to the other.
- A cable represented by `'C'`, starting and ending at the edges of the grid.
- At intersection cells where the cable crosses the rod:
  - Marked as `'C'` if the cable passes **above** the rod.
  - Marked as `'R'` if the rod passes **above** the cable (cable is below the rod).

You can switch any intersection (changing it from above to below, or vice versa).
Your goal is to find the **minimum number of switches** required so that holding both ends of the cable allows it to be pulled free without being trapped around any rod.

## Key Observations & Knot Theory
1. **Unwrapped Condition**:
   - If all crossings have the cable lying **entirely above** the rod (all `'C'`), the cable can be pulled away upwards. The number of switches needed is the count of `'R'` crossings.
   - If all crossings have the cable lying **entirely below** the rod (all `'R'`), the cable can be pulled away downwards. The number of switches needed is the count of `'C'` crossings.
   - If the cable weaves above and below in opposite alternating directions such that loops cancel out (winding number around the rod is 0, like $[R, C, C, R]$), no switches are required ($0$ switches).

2. **Algorithm**:
   - Locate the fixed rod across the grid (row or column).
   - Trace all crossings where the cable intersects the rod.
   - Check if the existing arrangement is topologically unlinked (such as $[R, C, C, R]$, requiring $0$ switches).
   - Otherwise, the minimum switches needed to unwrap is $\min(\text{count}(R), \text{count}(C))$.

## Complexity Analysis
- **Time Complexity**: $\mathcal{O}(N \times M)$ to scan the grid and identify crossings. Given $N, M \le 20$, this completes in $< 1 \text{ ms}$.
- **Space Complexity**: $\mathcal{O}(N \times M)$ to store the grid.
