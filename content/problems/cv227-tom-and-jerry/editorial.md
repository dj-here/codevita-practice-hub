# Tom and Jerry - Editorial

## Problem Summary
Jerry starts at vertex 1, Tom starts at vertex 2, and a hole is located at vertex 0.
Jerry moves first, and players alternate moves along undirected graph edges.
Tom cannot enter vertex 0.
- Jerry wins if he enters vertex 0.
- Tom wins if he reaches the same vertex as Jerry.
- If a position repeats, the game is a `DRAW`.

## Approach: Retrograde Analysis on State Graphs
This problem is an instance of combinatorial game theory on graphs (similar to Cat and Mouse).
We model each game state as a tuple:
`(turn, jerry, tom)`
where:
- `turn = 0` (Jerry's move)
- `turn = 1` (Tom's move)
- `jerry` is Jerry's current vertex ($0 \le jerry < N$)
- `tom` is Tom's current vertex ($0 \le tom < N$, $tom \ne 0$)

### State Colors / Winners
- `1` = `JERRY`
- `2` = `TOM`
- `0` = `DRAW` (unresolved / cycle)

### Retrograde BFS Algorithm
1. Initialize degrees for each state:
   - For Jerry's turn: out-degree equals number of neighbors of `jerry`.
   - For Tom's turn: out-degree equals number of neighbors of `tom` excluding vertex 0.
2. Queue terminal states:
   - `(turn, 0, tom)` is a win for Jerry (`1`).
   - `(turn, j, j)` with $j \ge 1$ is a win for Tom (`2`).
3. Propagate backwards:
   - For a state `prev`, if the current player whose turn it is can move to a state where they win, `prev` is immediately marked as winning for that player and enqueued.
   - Otherwise, decrement `out_degree[prev]`. If all valid moves from `prev` lead to the opponent's victory (`out_degree[prev] == 0`), then `prev` is marked as a win for the opponent.
4. Any states that remain uncolored when the BFS queue is empty are drawn positions.

## Complexity
- **Time Complexity:** $O(N \cdot M)$ states and edge transitions. With $N \le 100$, execution takes $< 0.1$ seconds.
- **Space Complexity:** $O(N^2)$ to store state tables and BFS queue.
