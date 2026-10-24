import sys
import math

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    nums = [int(x) for x in data[1:1+n]]
    
    count = 0
    for i in range(n):
        for j in range(i + 1, n):
            if math.gcd(nums[i], nums[j]) == 1:
                count += 1
                
    print(count)

if __name__ == '__main__':
    solve()
