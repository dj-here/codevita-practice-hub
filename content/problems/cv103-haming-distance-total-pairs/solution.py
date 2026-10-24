import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    nums = [int(x) for x in data[1:1+n]]
    
    total = 0
    # For each bit position from 0 to 30
    for b in range(31):
        ones = 0
        mask = 1 << b
        for x in nums:
            if x & mask:
                ones += 1
        zeros = n - ones
        total += ones * zeros
        
    print(total)

if __name__ == '__main__':
    solve()
