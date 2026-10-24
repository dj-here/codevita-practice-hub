import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    s = data[0]
    n = len(s)
    if n <= 1:
        print(n)
        return
        
    def expand(left, right):
        while left >= 0 and right < n and s[left] == s[right]:
            left -= 1
            right += 1
        return right - left - 1

    max_len = 1
    for i in range(n):
        len1 = expand(i, i)       # Odd length
        len2 = expand(i, i + 1)   # Even length
        max_len = max(max_len, len1, len2)
        
    print(max_len)

if __name__ == '__main__':
    solve()
