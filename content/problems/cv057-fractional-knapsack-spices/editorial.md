# Editorial: The Spice Merchant Fractional Knapsack

## Problem Analysis
Greedy value-per-weight density: sort items descending by V[i] / Wt[i]. Take full items while capacity allows; take the fractional remainder of the last item.

## Complexity Analysis
- **Time Complexity:** O(N log N)
- **Space Complexity:** O(N)
