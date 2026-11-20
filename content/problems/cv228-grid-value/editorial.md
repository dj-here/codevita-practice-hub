# Grid Value - Editorial

## Problem Summary
Given an $N \times M$ grid, place at most $countA$ people of Type A and $countB$ people of Type B:
- Type A initial satisfaction: 80, decreases by 20 for every adjacent neighbor.
- Type B initial satisfaction: 50, increases by 10 for every adjacent neighbor.
Maximize total satisfaction across all placed residents.

## Key Observations
When two neighbors are adjacent:
- A adjacent to A: each loses 20, total delta = $-40$.
- A adjacent to B: A loses 20, B gains 10, total delta = $-10$.
- B adjacent to B: each gains 10, total delta = $+20$.

Since $N, M \le 6$ and $countA, countB \le 6$, this is an optimal placement problem solvable by Profile Dynamic Programming / Memoized DFS.

## Dynamic Programming State
We fill cells in row-major order:
`dfs(pos, a_left, b_left, prev_row)`
- `pos`: current cell index $0 \le pos < N \times M$.
- `a_left`, `b_left`: remaining people available to place.
- `prev_row`: a tuple of length $M$ containing the occupants of the previous $M$ processed cells.

At each step `pos`, the cell above is `prev_row[0]`, and the cell to the left (if not on column 0) is `prev_row[-1]`. We consider three transitions:
1. Leave empty
2. Place Type A (if $a_{left} > 0$)
3. Place Type B (if $b_{left} > 0$)

## Complexity
- **Time Complexity:** At most $O(N \cdot M \cdot \text{countA} \cdot \text{countB} \cdot 3^M)$ states. With $M \le 6$, this runs in $< 0.2$ seconds.
- **Space Complexity:** $O(\text{number of states})$ for memoization table.
