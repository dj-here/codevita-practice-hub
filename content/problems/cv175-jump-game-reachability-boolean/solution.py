import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    nums = [int(x) for x in data[1:1+n]]
    
    max_reach = 0
    for i, jump in enumerate(nums):
        if i > max_reach:
            print("NO")
            return
        max_reach = max(max_reach, i + jump)
        if max_reach >= n - 1:
            print("YES")
            return
            
    print("YES" if max_reach >= n - 1 else "NO")

if __name__ == '__main__':
    solve()
