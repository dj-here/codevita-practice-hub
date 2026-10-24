import sys
from collections import defaultdict

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    k = int(data[1])
    arr = [int(x) for x in data[2:2+n]]
    
    prefix_counts = defaultdict(int)
    prefix_counts[0] = 1
    curr_sum = 0
    ans = 0
    
    for x in arr:
        curr_sum += x
        ans += prefix_counts[curr_sum - k]
        prefix_counts[curr_sum] += 1
        
    print(ans)

if __name__ == '__main__':
    solve()
