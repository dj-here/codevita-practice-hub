# Editorial: Path Finder (TCS CodeVita Season 14 MockVita 2)

## Problem Overview
Lilly starts at source $(s_r, s_c)$ on an $N \times M$ grid and must reach $(d_r, d_c)$.
From any cell, she can move to any of its 8 unblocked neighbouring cells that has the **strictly maximum value** among all unblocked neighbours.
- If the neighbour already has the unique maximum value among neighbours AND is strictly greater than the current cell, moving costs $0$.
- Otherwise, its value must be temporarily elevated to $\max(\text{max\_neighbour}, \text{current\_cell}) + 1$. The cost incurred is the difference added:
  $$\text{cost} = (\max(\text{max\_neighbour}, \text{current\_cell}) + 1) - \text{original\_value}$$
- Values revert back immediately after stepping onto the cell.
- Blocked cells cannot be stepped into and cannot be considered when calculating maximums.

## Graph Modeling & Dijkstra's Algorithm
Since all transition costs are non-negative ($\ge 0$), this is equivalent to finding the single-source shortest path on a weighted directed graph where:
- Nodes: grid cells $(r, c)$ with $N \times M \le 400$.
- Edges: up to 8 directed transitions to adjacent unblocked cells with edge weight equal to the required value boost.

### Dijkstra Implementation
1. Initialize min-heap priority queue with $(0, s_r, s_c)$.
2. For the extracted cell $(r, c)$ with distance $d$:
   - If $(r, c) = (d_r, d_c)$, return $d$.
   - Identify unblocked neighbors.
   - Compute `max_val` and `curr_val`.
   - Calculate cost to each neighbor and relax adjacent edges.

## Complexity
- **Time Complexity**: $\mathcal{O}(V \log V + E)$ where $V = N \times M \le 400$ and $E \le 8 V \le 3200$. Runs in $< 2 \text{ ms}$.
- **Space Complexity**: $\mathcal{O}(N \times M)$ for the distance map and grid.
