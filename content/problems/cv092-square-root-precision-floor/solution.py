import sys

def solve():
    line = sys.stdin.read().strip()
    if not line:
        return
    n = int(line)
    if n <= 1:
        print(n)
        return
        
    low, high = 1, min(n, 10**9)
    ans = 1
    while low <= high:
        mid = (low + high) // 2
        if mid * mid <= n:
            ans = mid
            low = mid + 1
        else:
            high = mid - 1
            
    print(ans)

if __name__ == '__main__':
    solve()
