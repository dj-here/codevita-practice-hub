# Editorial: Ladder Problem (TCS CodeVita Season 14 MockVita 2)

## Problem Overview
You need to relocate a ladder of fixed length $L$ ($2 \le L \le 6$) on an $M \times N$ grid ($0 \le M, N \le 15$) from starting cells `'I'` to destination cells `'L'`.
Obstacles are marked as `'B'` (Blocks) and free cells as `'E'`.

Allowed moves (each costs 1 step):
1. **Translate**: Move 1 step Up, Down, Left, or Right maintaining current orientation.
2. **Rotate**: Rotate 90 degrees (Horizontal $\leftrightarrow$ Vertical) if and only if the $L \times L$ square enclosing the transformation is completely inside the grid and contains no obstacles `'B'`.

## State Representation & BFS
Since all transitions have weight 1, this is a shortest path problem solvable via Breadth-First Search (BFS).

### State Tuple: `(orientation, r, c)`
- `orientation`: `'H'` (horizontal) or `'V'` (vertical)
- `(r, c)`: top-left cell occupied by the ladder.
  - Horizontal: occupies cells $(r, c), (r, c+1), \dots, (r, c+L-1)$ where $0 \le r < M$ and $0 \le c \le N-L$.
  - Vertical: occupies cells $(r, c), (r+1, c), \dots, (r+L-1, c)$ where $0 \le r \le M-L$ and $0 \le c < N$.

### Rotations:
- When horizontal at $(r, c)$, any enclosing $L \times L$ square has top-left corner $(r - dr, c)$ for $0 \le dr < L$.
- If this entire square is free of `'B'`, rotating to any column $c + dc$ within this square ($0 \le dc < L$) is legal and results in vertical state `('V', r - dr, c + dc)`.
- Symmetrically for vertical to horizontal.

## Complexity
- Total possible states: $2 \times M \times N \le 2 \times 15 \times 15 = 450$ states.
- BFS visits each state at most once with small constant fan-out $\le 4 + L^2 \le 40$.
- Runs in $< 5 \text{ ms}$, well within the 1.0 second time limit.
