import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    w = int(data[1])
    idx = 2
    items = []
    for _ in range(n):
        v = int(data[idx])
        wt = int(data[idx+1])
        items.append((v, wt, v / wt))
        idx += 2
        
    # Sort descending by value-to-weight ratio
    items.sort(key=lambda x: x[2], reverse=True)
    
    total_val = 0.0
    rem_cap = w
    for v, wt, ratio in items:
        if rem_cap <= 0:
            break
        if wt <= rem_cap:
            total_val += v
            rem_cap -= wt
        else:
            total_val += ratio * rem_cap
            rem_cap = 0
            
    print(f"{total_val:.2f}")

if __name__ == '__main__':
    solve()
