import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    people = []
    idx = 1
    for _ in range(n):
        h = int(data[idx])
        k = int(data[idx+1])
        people.append((h, k))
        idx += 2
        
    # Sort: descending height, ascending k
    people.sort(key=lambda x: (-x[0], x[1]))
    
    queue = []
    for p in people:
        queue.insert(p[1], p)
        
    for h, k in queue:
        print(f"{h} {k}")

if __name__ == '__main__':
    solve()
