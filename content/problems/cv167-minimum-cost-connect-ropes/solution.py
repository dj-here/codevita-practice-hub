import sys
import heapq

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    ropes = [int(x) for x in data[1:1+n]]
    
    if n <= 1:
        print(0)
        return
        
    heapq.heapify(ropes)
    total_cost = 0
    
    while len(ropes) > 1:
        first = heapq.heappop(ropes)
        second = heapq.heappop(ropes)
        cost = first + second
        total_cost += cost
        heapq.heappush(ropes, cost)
        
    print(total_cost)

if __name__ == '__main__':
    solve()
