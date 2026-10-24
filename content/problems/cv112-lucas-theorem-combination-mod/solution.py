import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    k = int(data[1])
    p = int(data[2])
    
    if k > n:
        print(0)
        return
    if k == 0 or k == n:
        print(1)
        return
        
    # Precompute factorials modulo P
    fact = [1] * p
    inv = [1] * p
    for i in range(1, p):
        fact[i] = (fact[i - 1] * i) % p
    inv[p - 1] = pow(fact[p - 1], p - 2, p)
    for i in range(p - 2, -1, -1):
        inv[i] = (inv[i + 1] * (i + 1)) % p
        
    def nCr_small(n_i, k_i):
        if k_i > n_i:
            return 0
        return (fact[n_i] * inv[k_i] % p * inv[n_i - k_i] % p)
        
    res = 1
    while n > 0 or k > 0:
        ni = n % p
        ki = k % p
        res = (res * nCr_small(ni, ki)) % p
        n //= p
        k //= p
        if res == 0:
            break
            
    print(res)

if __name__ == '__main__':
    solve()
