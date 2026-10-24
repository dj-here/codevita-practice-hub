import sys

def solve():
    s = sys.stdin.read().strip()
    if not s:
        return
        
    n = len(s)
    count = 0
    
    # Expand around centers
    for center in range(2 * n - 1):
        left = center // 2
        right = left + center % 2
        while left >= 0 and right < n and s[left] == s[right]:
            count += 1
            left -= 1
            right += 1
            
    print(count)

if __name__ == '__main__':
    solve()
