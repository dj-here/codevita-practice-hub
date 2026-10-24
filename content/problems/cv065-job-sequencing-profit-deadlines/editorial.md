# Editorial: The Blacksmith Job Scheduling Profit

## Problem Analysis
Greedy scheduling: sort jobs by profit descending. Place each job in the latest possible empty slot <= its deadline.

## Complexity Analysis
- **Time Complexity:** O(N * max(Deadline))
- **Space Complexity:** O(max(Deadline))
