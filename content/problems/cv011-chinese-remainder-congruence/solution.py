import sys

def ext_gcd(a, b):
    if b == 0:
        return a, 1, 0
    g, x1, y1 = ext_gcd(b, a % b)
    x = y1
    y = x1 - (a // b) * y1
    return g, x, y

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    idx = 1
    rem = []
    mod = []
    prod = 1
    for _ in range(n):
        r = int(data[idx])
        m = int(data[idx+1])
        rem.append(r)
        mod.append(m)
        prod *= m
        idx += 2
        
    x = 0
    for i in range(n):
        m_i = prod // mod[i]
        _, inv, _ = ext_gcd(m_i, mod[i])
        x = (x + rem[i] * m_i * inv) % prod
        
    print((x % prod + prod) % prod)

if __name__ == '__main__':
    solve()
