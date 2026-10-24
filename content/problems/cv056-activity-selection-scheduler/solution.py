import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    idx = 1
    meetings = []
    for _ in range(n):
        s = int(data[idx])
        f = int(data[idx+1])
        meetings.append((s, f))
        idx += 2
        
    # Greedy: sort by finish time
    meetings.sort(key=lambda m: m[1])
    
    count = 0
    last_finish = -1
    for s, f in meetings:
        if s >= last_finish:
            count += 1
            last_finish = f
            
    print(count)

if __name__ == '__main__':
    solve()
