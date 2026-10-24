import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    strings = data[1:n+1]
    if not strings:
        print("-1")
        return
    prefix = strings[0]
    for s in strings[1:]:
        while not s.startswith(prefix):
            prefix = prefix[:-1]
            if not prefix:
                print("-1")
                return
    print(prefix if prefix else "-1")

if __name__ == '__main__':
    solve()
