import sys
from functools import cmp_to_key

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    nums = data[1:n+1]
    
    # Custom comparator: a + b vs b + a
    def compare(x, y):
        if x + y > y + x:
            return -1
        elif x + y < y + x:
            return 1
        return 0

    nums.sort(key=cmp_to_key(compare))
    ans = ''.join(nums).lstrip('0')
    print(ans if ans else '0')

if __name__ == '__main__':
    solve()
