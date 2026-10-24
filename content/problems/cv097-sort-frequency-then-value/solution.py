import sys
from collections import Counter

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    nums = [int(x) for x in data[1:1+n]]
    
    freq = Counter(nums)
    # Sort key: (-frequency, value)
    sorted_nums = sorted(nums, key=lambda x: (-freq[x], x))
    print(' '.join(map(str, sorted_nums)))

if __name__ == '__main__':
    solve()
