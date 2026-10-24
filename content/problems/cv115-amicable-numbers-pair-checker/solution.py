import sys

def sum_proper_divisors(n):
    if n <= 1:
        return 0
    total = 1
    d = 2
    while d * d <= n:
        if n % d == 0:
            total += d
            if d * d != n:
                total += n // d
        d += 1
    return total

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    a = int(data[0])
    b = int(data[1])
    
    if a != b and sum_proper_divisors(a) == b and sum_proper_divisors(b) == a:
        print("YES")
    else:
        print("NO")

if __name__ == '__main__':
    solve()
