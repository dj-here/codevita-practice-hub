import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    nums = [int(x) for x in data[1:1+n]]
    
    unique = 0
    for x in nums:
        unique ^= x
        
    print(unique)

if __name__ == '__main__':
    solve()
