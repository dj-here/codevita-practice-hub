import sys
import math

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    L, R = int(data[0]), int(data[1])
    count = 0
    for a in range(L, R):
        for b in range(a + 1, R + 1):
            if math.gcd(a, b) == 1:
                count += 1
    print(count)

if __name__ == '__main__':
    solve()
