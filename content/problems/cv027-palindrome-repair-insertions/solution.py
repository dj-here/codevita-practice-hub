import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    s = data[0]
    n = len(s)
    rev_s = s[::-1]
    
    # LCS of s and rev_s gives Longest Palindromic Subsequence (LPS)
    dp = [0] * (n + 1)
    for i in range(1, n + 1):
        prev = 0
        for j in range(1, n + 1):
            temp = dp[j]
            if s[i - 1] == rev_s[j - 1]:
                dp[j] = prev + 1
            else:
                dp[j] = max(dp[j], dp[j - 1])
            prev = temp
            
    lps = dp[n]
    print(n - lps)

if __name__ == '__main__':
    solve()
