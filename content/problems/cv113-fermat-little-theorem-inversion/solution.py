import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    a = int(data[0])
    p = int(data[1])
    
    if a % p == 0:
        print(-1)
        return
        
    ans = pow(a % p, p - 2, p)
    print(ans)

if __name__ == '__main__':
    solve()
