import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    arr = [int(x) for x in data[1:n+1]]
    MOD = 1000000007
    
    prefix = [1] * n
    for i in range(1, n):
        prefix[i] = (prefix[i - 1] * arr[i - 1]) % MOD
        
    suffix = 1
    for i in range(n - 1, -1, -1):
        prefix[i] = (prefix[i] * suffix) % MOD
        suffix = (suffix * arr[i]) % MOD
        
    print(' '.join(map(str, prefix)))

if __name__ == '__main__':
    solve()
