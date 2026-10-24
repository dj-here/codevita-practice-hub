import sys
import heapq
from collections import Counter

def solve():
    s = sys.stdin.read().strip()
    if not s:
        return
        
    counts = Counter(s)
    max_count = max(counts.values())
    if max_count > (len(s) + 1) // 2:
        print("IMPOSSIBLE")
        return
        
    pq = [(-count, char) for char, count in counts.items()]
    heapq.heapify(pq)
    
    prev_count, prev_char = 0, ''
    res = []
    
    while pq:
        count, char = heapq.heappop(pq)
        res.append(char)
        if prev_count < 0:
            heapq.heappush(pq, (prev_count, prev_char))
        prev_count = count + 1
        prev_char = char
        
    print(''.join(res))

if __name__ == '__main__':
    solve()
