# Create Target Array - Editorial

## Problem Summary
Starting from an array of $N$ ones $[1, 1, \dots, 1]$, at each step we can replace any single element with the current array sum. Determine whether a given target array can be reached.

## Working Backwards (Euclidean Reduction)
Forward simulation has branching factor $N$, making it intractable.
However, working backwards from the target array is strictly deterministic!

At the final state, the largest number in the array must have been the most recently placed sum.
Let:
- $\text{largest} = \max(\text{target})$
- $\text{rest} = \sum(\text{target}) - \text{largest}$

Before that operation, the value was:
$$\text{prev} = \text{largest} - \text{rest}$$

If $\text{largest} > \text{rest}$, the value must have undergone multiple additions if $\text{rest} > 1$:
$$\text{new\_val} = \text{largest} \pmod{\text{rest}}$$

### Special Edge Cases
1. $N = 1$: Valid if and only if target is $[1]$.
2. $\text{largest} == 1$ or $\text{rest} == 1$: Reached base state successfully $\to 1$.
3. $\text{rest} \le 0$ or $\text{largest} \le \text{rest}$: Reduction impossible $\to 0$.
4. $\text{new\_val} == 0$: Impossible (elements must remain $\ge 1$) $\to 0$.

## Complexity
- **Time Complexity:** $O(N + k \log N)$ where $k \le \log(\max X)$ by Euclidean modulo reduction. Runs in $< 0.05$ seconds.
- **Space Complexity:** $O(N)$ for the max-heap.
