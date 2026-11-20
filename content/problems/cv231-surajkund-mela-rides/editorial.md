# Surajkund Mela Rides - Editorial

## Problem Summary
Given $N$ rides with intervals $[startTime, endTime]$ and $K$ friends, find the maximum total number of rides the friends can collectively take.

## Greedy Strategy (Movie Festival II)
1. Sort all rides by their end time ascending: $(endTime, startTime)$.
2. For each ride $(s, e)$, we want to assign it to a friend who is currently free at some time $t \le s$.
3. To leave the maximum room for other rides, we greedily pick the friend whose free time $t$ is **as close as possible to $s$** (i.e. the maximum $t \le s$).

## Fast Implementation via Segment Tree
Since $K$ and $N$ can be up to $10^5$, maintaining a dynamic list with linear scans is too slow.
Instead:
- Coordinate compress all distinct times $\{0\} \cup \{s_i\} \cup \{e_i\}$ into at most $2N + 1$ indices.
- Build a Segment Tree over coordinates where each leaf stores the count of friends free at that coordinate.
- Query `find_rightmost(0, s_idx)` to find the largest coordinate $\le s\_idx$ with count $> 0$.
- Decrement count at that position and increment count at $e\_idx$.

## Complexity
- **Time Complexity:** $O(N \log N)$ for sorting and segment tree operations.
- **Space Complexity:** $O(N)$ for coordinate compression and segment tree.
