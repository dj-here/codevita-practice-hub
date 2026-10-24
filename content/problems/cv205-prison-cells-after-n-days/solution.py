import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    cells = [int(x) for x in data[:8]]
    n = int(data[8])
    
    seen = {}
    history = []
    
    for day in range(n):
        state = tuple(cells)
        if state in seen:
            cycle_len = day - seen[state]
            rem = (n - day) % cycle_len
            cells = list(history[seen[state] + rem])
            break
        seen[state] = day
        history.append(state)
        
        nxt = [0] * 8
        for i in range(1, 7):
            nxt[i] = 1 if cells[i - 1] == cells[i + 1] else 0
        cells = nxt
        
    print(' '.join(map(str, cells)))

if __name__ == '__main__':
    solve()
