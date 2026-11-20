# Lucky Group - Editorial

## Problem Summary
Given an $N \times M$ grid with values in $\{0, 1, 2, 3\}$, find the maximum number of cell-disjoint paths of the form $0 \to 1 \to 2 \to 3$ between orthogonally adjacent cells.

## Graph Modeling: Maximum Flow with Vertex Capacities
Every lucky group is a 4-vertex directed path $0 \to 1 \to 2 \to 3$.
Because each cell can participate in at most one lucky group, each vertex has capacity 1.

We construct a flow network:
1. **Vertex Splitting:** For every cell $u = (r, c)$, split it into two nodes $u_{in}$ and $u_{out}$ connected by a directed edge $u_{in} \to u_{out}$ with capacity 1.
2. **Source and Sink:**
   - Source $S \to u_{in}$ for all cells where $grid[r][c] = 0$ with capacity 1.
   - $u_{out} \to T$ (Sink) for all cells where $grid[r][c] = 3$ with capacity 1.
3. **Layer Transitions:**
   - For any adjacent cells $u$ and $v$ where $grid[v] = grid[u] + 1$, add directed edge $u_{out} \to v_{in}$ with capacity 1.

The maximum number of cell-disjoint lucky groups is exactly the maximum flow from $S$ to $T$.

## Complexity
- **Time Complexity:** Using Dinic's Algorithm on a unit network with $V \le 2 \times 400 + 2 = 802$ and $E \le 2400$, the flow runs in $O(E \sqrt{V}) \approx 2400 \times 28 < 7 \times 10^4$ operations, terminating in $< 0.05$ seconds.
- **Space Complexity:** $O(V + E)$ for the adjacency lists.
