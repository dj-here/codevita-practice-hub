import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    curr = "1"
    for _ in range(2, n + 1):
        nxt = []
        i = 0
        while i < len(curr):
            char = curr[i]
            count = 0
            while i < len(curr) and curr[i] == char:
                count += 1
                i += 1
            nxt.append(f"{count}{char}")
        curr = "".join(nxt)
    print(curr)

if __name__ == '__main__':
    solve()
