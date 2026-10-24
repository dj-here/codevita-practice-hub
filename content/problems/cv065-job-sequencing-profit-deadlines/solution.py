import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    idx = 1
    jobs = []
    max_deadline = 0
    for _ in range(n):
        d = int(data[idx])
        p = int(data[idx+1])
        jobs.append((d, p))
        max_deadline = max(max_deadline, d)
        idx += 2
        
    # Sort jobs descending by profit
    jobs.sort(key=lambda x: x[1], reverse=True)
    
    slots = [-1] * (max_deadline + 1)
    total_profit = 0
    
    for d, p in jobs:
        # Find latest available slot from d down to 1
        for t in range(d, 0, -1):
            if slots[t] == -1:
                slots[t] = p
                total_profit += p
                break
                
    print(total_profit)

if __name__ == '__main__':
    solve()
