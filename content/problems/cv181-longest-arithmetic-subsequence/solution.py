import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    nums = [int(x) for x in data[1:1+n]]
    
    dp = {}
    max_len = 2
    
    for i in range(n):
        for j in range(i):
            diff = nums[i] - nums[j]
            dp[(i, diff)] = dp.get((j, diff), 1) + 1
            if dp[(i, diff)] > max_len:
                max_len = dp[(i, diff)]
                
    print(max_len)

if __name__ == '__main__':
    solve()
