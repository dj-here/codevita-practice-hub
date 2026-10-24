import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    target = int(data[1])
    arr = [int(x) for x in data[2:2+n]]
    
    seen = set()
    for x in arr:
        comp = target - x
        if comp in seen:
            print("YES")
            return
        seen.add(x)
    print("NO")

if __name__ == '__main__':
    solve()
