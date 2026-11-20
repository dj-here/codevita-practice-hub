# Editorial: Uno Game (TCS CodeVita Season 14 MockVita 2)

## Problem Overview
Dhruv wants to select the maximum number of children from $N$ players ($N \le 25$) such that:
1. **Friends Rule**: If one friend is selected, their friend must also be selected. Each friend pair is disjoint and of size 2.
2. **Rivals Rule**: No two rivals can both be in the selected team.
3. **Skill Limit**: The sum of skill scores of all selected players cannot exceed a threshold `limit`.

## Algorithmic Strategy: Unit Grouping & Branch-and-Bound
1. **Form Indivisible Units**:
   - Because friend pairs must always be taken together, we bundle each friend pair $(A, B)$ into a single unit of size $2$ and combined cost $\text{skill}[A] + \text{skill}[B]$.
   - Every player without a friend pair forms an individual unit of size $1$ with cost $\text{skill}[P]$.
   - This reduces the items to at most $N$ independent selection units.

2. **Branch-and-Bound Search**:
   - For each unit, we branch into two choices:
     - **Take unit**: Valid if no member of the unit is rivals with any previously selected player and current cost does not exceed `limit`.
     - **Leave unit**.
   - **Pruning**:
     - Stop if `current_cost > limit`.
     - Upper-bound pruning: `current_count + remaining_available_players <= max_count`.
     - Sorting units by cost efficiency $(\text{cost}/\text{size})$ rapidly discovers optimal configurations and prunes unpromising branches.

## Complexity Analysis
- Given $N \le 25$ and $\text{friends} + \text{rivals} \le 10$, the search tree is very small with pruning.
- Runs in $< 10 \text{ ms}$ and uses minimal memory $\mathcal{O}(N)$.
