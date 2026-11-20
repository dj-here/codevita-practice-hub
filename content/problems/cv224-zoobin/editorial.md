# Editorial: Zoobin (TCS CodeVita Season 14 MockVita 2)

## Problem Overview
The zoo consists of animal enclosures connected by $E$ pathways.
Because pathways cannot be used for two animals crossing or swapping directly, animals are moved simultaneously along simple closed cycles (loops) in the enclosure network (the "Zoobin approach").
Given the current layout (edges between animals) and expected layout (desired edges between animals), determine the minimum number of cycle rotations needed.

## Key Formulation: Permutation State on Fixed Physical Enclosures
1. **Fixed Enclosure Graph**:
   - The physical network of enclosures and paths is defined by the initial connections.
   - A simple loop is a simple cycle of length $\ge 3$ in this undirected graph.

2. **State Space**:
   - Represent each configuration as a permutation $P = (p_0, p_1, \dots, p_{N-1})$, where $p_i$ is the animal residing at enclosure $i$.
   - A cycle rotation along $(v_0, v_1, \dots, v_{k-1})$ moves animal $p_{v_i}$ to enclosure $v_{(i \pm 1) \bmod k}$.
   - The edges between animals are given by $(p_u, p_v)$ for each physical edge $(u, v)$ in the enclosure graph.

3. **Shortest Path via BFS**:
   - Since each rotation has unit step cost $1$, we perform Breadth-First Search (BFS) over permutations.
   - Constraint guarantee: $\text{Number of simple loops} \times E \le 50$, ensuring very few cycles and a compact state graph traversed in a fraction of a second.
