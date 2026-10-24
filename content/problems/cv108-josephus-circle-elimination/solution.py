import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    k = int(data[1])
    
    # Josephus 0-indexed formula: J(n, k) = (J(n-1, k) + k) % n
    survivor = 0
    for i in range(2, n + 1):
        survivor = (survivor + k) % i
        
    print(survivor + 1)

if __name__ == '__main__':
    solve()
