# Towers - Editorial

## Problem Summary
Given $N$ cubes in sequential order, place each cube on top of an existing tower or start a new tower.
Condition: An upper cube must be strictly smaller than the lower cube.
Minimize the total number of towers.

## Greedy Strategy & Patience Sorting
To minimize towers, when placing cube $x$, we should place it on top of an existing tower whose current top cube is strictly greater than $x$, and as small as possible (tightest fit).
- If no such tower top exists, $x$ must start a new tower.
- If one or more tower tops are $> x$, pick the smallest one and update its top to $x$.

Since the list of tower tops is always maintained in non-decreasing order:
- We can use binary search (`bisect_right`) to find the first top cube $> x$ in $O(\log k)$ time.
- If found at index `idx`, replace `tops[idx] = x`.
- Otherwise, append $x$ to `tops`.

## Complexity
- **Time Complexity:** $O(N \log N)$ per test case.
- **Space Complexity:** $O(N)$ to store tower tops.
