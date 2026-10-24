import sys

def solve():
    line = sys.stdin.read().strip()
    if not line:
        return
    p = int(line)
    if p == 2:
        print(1)
        return
        
    phi = p - 1
    # Find prime factors of phi
    factors = []
    temp = phi
    d = 2
    while d * d <= temp:
        if temp % d == 0:
            factors.append(d)
            while temp % d == 0:
                temp //= d
        d += 1
    if temp > 1:
        factors.append(temp)
        
    for g in range(2, p):
        is_primitive = True
        for q in factors:
            if pow(g, phi // q, p) == 1:
                is_primitive = False
                break
        if is_primitive:
            print(g)
            return
            
    print(-1)

if __name__ == '__main__':
    solve()
