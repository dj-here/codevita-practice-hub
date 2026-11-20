import sys
import heapq

def solve():
    input_data = sys.stdin.read().split()
    if not input_data:
        return
    it = iter(input_data)
    try:
        T = int(next(it))
    except StopIteration:
        return
        
    for _ in range(T):
        N = int(next(it))
        target = [int(next(it)) for _ in range(N)]
        
        if N == 1:
            print(1 if target[0] == 1 else 0)
            continue
            
        total = sum(target)
        heap = [-x for x in target]
        heapq.heapify(heap)
        
        possible = True
        while True:
            largest = -heapq.heappop(heap)
            rest = total - largest
            
            if largest == 1 or rest == 1:
                break
            if rest <= 0 or largest <= rest:
                possible = False
                break
                
            new_val = largest % rest
            if new_val == 0:
                possible = False
                break
                
            total = rest + new_val
            heapq.heappush(heap, -new_val)
            
        print(1 if possible else 0)

if __name__ == "__main__":
    solve()
