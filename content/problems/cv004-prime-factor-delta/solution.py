import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    if n <= 1:
        print(0)
        return
    factors = []
    d = 2
    temp = n
    while d * d <= temp:
        if temp % d == 0:
            factors.append(d)
            while temp % d == 0:
                temp //= d
        d += 1
    if temp > 1:
        factors.append(temp)
    if len(factors) <= 1:
        print(0)
    else:
        print(max(factors) - min(factors))

if __name__ == '__main__':
    solve()
