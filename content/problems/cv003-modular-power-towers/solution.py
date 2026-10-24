import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    A = int(data[0])
    N = int(data[1])
    M = int(data[2])
    
    total = 0
    curr = A % M
    for i in range(1, N + 1):
        total = (total + curr) % M
        curr = (curr * (A % M)) % M
    print(total)

if __name__ == '__main__':
    solve()
