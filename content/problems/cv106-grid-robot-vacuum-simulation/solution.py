import sys

def solve():
    cmd = sys.stdin.read().strip()
    if not cmd:
        return
        
    # Directions: 0=N, 1=E, 2=S, 3=W
    dirs = ['N', 'E', 'S', 'W']
    dx = [0, 1, 0, -1]
    dy = [1, 0, -1, 0]
    
    x, y = 0, 0
    d = 0 # Facing North
    
    for c in cmd:
        if c == 'F':
            x += dx[d]
            y += dy[d]
        elif c == 'R':
            d = (d + 1) % 4
        elif c == 'L':
            d = (d + 3) % 4
            
    print(f"{x} {y} {dirs[d]}")

if __name__ == '__main__':
    solve()
