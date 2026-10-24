import sys
import math

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    a = int(data[0])
    b = int(data[1])
    c = int(data[2])
    
    g = math.gcd(a, b)
    if c % g == 0:
        print("YES")
    else:
        print("NO")

if __name__ == '__main__':
    solve()
