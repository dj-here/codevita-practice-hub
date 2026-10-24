import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    m = int(data[1])
    
    rows = [0] * n
    cols = [0] * n
    diag = 0
    anti_diag = 0
    
    idx = 2
    for move_num in range(1, m + 1):
        r = int(data[idx])
        c = int(data[idx+1])
        p = int(data[idx+2])
        idx += 3
        
        delta = 1 if p == 1 else -1
        rows[r] += delta
        cols[c] += delta
        if r == c:
            diag += delta
        if r + c == n - 1:
            anti_diag += delta
            
        target = n if p == 1 else -n
        if rows[r] == target or cols[c] == target or diag == target or anti_diag == target:
            print(f"PLAYER {p} WINS at move {move_num}")
            return
            
    print("DRAW")

if __name__ == '__main__':
    solve()
