import sys
import heapq

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    freqs = [int(x) for x in data[1:1+n]]
    
    if n == 1:
        print(freqs[0]) # 1-bit per symbol
        return
        
    heapq.heapify(freqs)
    total_cost = 0
    
    while len(freqs) > 1:
        a = heapq.heappop(freqs)
        b = heapq.heappop(freqs)
        combined = a + b
        total_cost += combined
        heapq.heappush(freqs, combined)
        
    print(total_cost)

if __name__ == '__main__':
    solve()
