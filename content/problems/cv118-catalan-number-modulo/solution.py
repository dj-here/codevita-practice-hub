import sys

MOD = 1000000007

def solve():
    line = sys.stdin.read().strip()
    if not line:
        return
    n = int(line)
    if n <= 1:
        print(1)
        return
        
    c = 1
    for i in range(1, n + 1):
        c = (c * (4 * i - 2) % MOD * pow(i + 1, MOD - 2, MOD)) % MOD
        
    print(c)

if __name__ == '__main__':
    solve()
