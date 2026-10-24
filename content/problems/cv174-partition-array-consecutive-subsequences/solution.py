import sys
from collections import Counter, defaultdict

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    nums = [int(x) for x in data[1:1+n]]
    
    count = Counter(nums)
    tails = defaultdict(int)
    
    for x in nums:
        if count[x] == 0:
            continue
            
        count[x] -= 1
        # Try appending to existing chain ending at x - 1
        if tails[x - 1] > 0:
            tails[x - 1] -= 1
            tails[x] += 1
        # Otherwise create new chain of length 3: x, x+1, x+2
        elif count[x + 1] > 0 and count[x + 2] > 0:
            count[x + 1] -= 1
            count[x + 2] -= 1
            tails[x + 2] += 1
        else:
            print("NO")
            return
            
    print("YES")

if __name__ == '__main__':
    solve()
