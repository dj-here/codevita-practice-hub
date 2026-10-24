import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    gas = [int(x) for x in data[1:1+n]]
    cost = [int(x) for x in data[1+n:1+2*n]]
    
    total_tank = 0
    curr_tank = 0
    start_station = 0
    
    for i in range(n):
        diff = gas[i] - cost[i]
        total_tank += diff
        curr_tank += diff
        if curr_tank < 0:
            start_station = i + 1
            curr_tank = 0
            
    print(start_station if total_tank >= 0 else -1)

if __name__ == '__main__':
    solve()
