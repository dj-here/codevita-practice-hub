import sys

def solve():
    tokens = sys.stdin.read().split()
    if not tokens:
        return
    idx = 0
    N = int(tokens[idx]); idx += 1
    names = tokens[idx:idx + N]; idx += N
    skills = [int(tokens[idx + i]) for i in range(N)]; idx += N
    
    skill_map = {names[i]: skills[i] for i in range(N)}
    
    N1 = int(tokens[idx]); idx += 1
    friend_pairs = []
    in_friend_pair = {}
    for _ in range(N1):
        u = tokens[idx]; idx += 1
        v = tokens[idx]; idx += 1
        friend_pairs.append((u, v))
        in_friend_pair[u] = len(friend_pairs) - 1
        in_friend_pair[v] = len(friend_pairs) - 1
        
    N2 = int(tokens[idx]); idx += 1
    rival_set = set()
    for _ in range(N2):
        u = tokens[idx]; idx += 1
        v = tokens[idx]; idx += 1
        rival_set.add((u, v))
        rival_set.add((v, u))
        
    limit = int(tokens[idx]); idx += 1
    
    # Form indivisible selection units:
    # 1. Friend pairs (must be taken together): size 2, cost skill[u] + skill[v]
    # 2. Single individuals: size 1, cost skill[p]
    units = []
    for u, v in friend_pairs:
        units.append(([u, v], skill_map[u] + skill_map[v], 2))
        
    for p in names:
        if p not in in_friend_pair:
            units.append(([p], skill_map[p], 1))
            
    # Sort units by skill cost per person ascending (greedy heuristic for fast pruning)
    units.sort(key=lambda u: (u[1] / u[2], u[1]))
    
    max_count = 0
    
    def search(i, current_cost, current_count, selected_set):
        nonlocal max_count
        if current_cost > limit:
            return
            
        if current_count > max_count:
            max_count = current_count
            
        # Upper bound pruning: even if all remaining units could be picked
        rem_potential = sum(units[k][2] for k in range(i, len(units)))
        if current_count + rem_potential <= max_count:
            return
            
        if i == len(units):
            return
            
        members, cost, count = units[i]
        
        # Option 1: Pick unit i (if valid with rivals)
        can_pick = True
        if len(members) == 2 and (members[0], members[1]) in rival_set:
            can_pick = False
        else:
            for m in members:
                for s in selected_set:
                    if (m, s) in rival_set:
                        can_pick = False
                        break
                if not can_pick:
                    break
                    
        if can_pick and current_cost + cost <= limit:
            for m in members:
                selected_set.add(m)
            search(i + 1, current_cost + cost, current_count + count, selected_set)
            for m in members:
                selected_set.remove(m)
                
        # Option 2: Skip unit i
        search(i + 1, current_cost, current_count, selected_set)

    search(0, 0, 0, set())
    print(max_count)

if __name__ == '__main__':
    solve()
