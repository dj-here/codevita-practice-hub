import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    nums = [int(x) for x in data[1:1+n]]
    
    xor_all = 0
    for x in nums:
        xor_all ^= x
        
    # Get rightmost set bit
    diff_bit = xor_all & (-xor_all)
    
    a, b = 0, 0
    for x in nums:
        if x & diff_bit:
            a ^= x
        else:
            b ^= x
            
    if a > b:
        a, b = b, a
        
    print(f"{a} {b}")

if __name__ == '__main__':
    solve()
