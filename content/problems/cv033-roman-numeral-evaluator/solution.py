import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    s = data[0]
    vals = {'I': 1, 'V': 5, 'X': 10, 'L': 50, 'C': 100, 'D': 500, 'M': 1000}
    total = 0
    n = len(s)
    for i in range(n):
        v = vals[s[i]]
        if i + 1 < n and v < vals[s[i + 1]]:
            total -= v
        else:
            total += v
    print(total)

if __name__ == '__main__':
    solve()
