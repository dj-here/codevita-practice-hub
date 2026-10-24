import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    if n <= 1:
        print("NOT PERFECT")
        return
        
    div_sum = 1
    d = 2
    while d * d <= n:
        if n % d == 0:
            div_sum += d
            if d * d != n:
                div_sum += n // d
        d += 1
        
    if div_sum == n:
        print("PERFECT")
    else:
        print("NOT PERFECT")

if __name__ == '__main__':
    solve()
