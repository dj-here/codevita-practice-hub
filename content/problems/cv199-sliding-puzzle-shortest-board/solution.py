import sys
from collections import deque

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    board_str = ''.join(data)
    target = "123450"
    
    if board_str == target:
        print(0)
        return
        
    moves = {
        0: [1, 3],
        1: [0, 2, 4],
        2: [1, 5],
        3: [0, 4],
        4: [1, 3, 5],
        5: [2, 4]
    }
    
    q = deque([(board_str, 0)])
    visited = {board_str}
    
    while q:
        curr, steps = q.popleft()
        if curr == target:
            print(steps)
            return
            
        zero_idx = curr.index('0')
        for nxt_idx in moves[zero_idx]:
            curr_list = list(curr)
            curr_list[zero_idx], curr_list[nxt_idx] = curr_list[nxt_idx], curr_list[zero_idx]
            nxt_str = ''.join(curr_list)
            if nxt_str not in visited:
                visited.add(nxt_str)
                q.append((nxt_str, steps + 1))
                
    print(-1)

if __name__ == '__main__':
    solve()
