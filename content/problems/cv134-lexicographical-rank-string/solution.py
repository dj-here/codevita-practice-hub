import sys

MOD = 1000000007

def solve():
    s = sys.stdin.read().strip()
    if not s:
        return
    n = len(s)
    
    fact = [1] * (n + 1)
    for i in range(1, n + 1):
        fact[i] = (fact[i - 1] * i) % MOD
        
    rank = 1
    chars = sorted(list(s))
    
    for i, c in enumerate(s):
        smaller = 0
        for x in chars:
            if x < c:
                smaller += 1
            else:
                break
        rank = (rank + smaller * fact[n - 1 - i]) % MOD
        chars.remove(c)
        
    print(rank)

if __name__ == '__main__':
    solve()
