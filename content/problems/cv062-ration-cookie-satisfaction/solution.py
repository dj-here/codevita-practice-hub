import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    m = int(data[1])
    g = sorted([int(x) for x in data[2:2+n]])
    s = sorted([int(x) for x in data[2+n:2+n+m]])
    
    child = 0
    cookie = 0
    while child < n and cookie < m:
        if s[cookie] >= g[child]:
            child += 1
        cookie += 1
        
    print(child)

if __name__ == '__main__':
    solve()
