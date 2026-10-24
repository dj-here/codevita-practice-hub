import sys

def solve():
    lines = sys.stdin.read().split()
    if len(lines) < 3:
        if len(lines) == 2:
            print("YES" if lines[0] == lines[1] else "NO")
        elif len(lines) == 0:
            print("YES")
        else:
            print("NO")
        return
    s1, s2, s3 = lines[0], lines[1], lines[2]
    
    n, m = len(s1), len(s2)
    if n + m != len(s3):
        print("NO")
        return
        
    dp = [False] * (m + 1)
    dp[0] = True
    
    for j in range(1, m + 1):
        dp[j] = dp[j - 1] and s2[j - 1] == s3[j - 1]
        
    for i in range(1, n + 1):
        dp[0] = dp[0] and s1[i - 1] == s3[i - 1]
        for j in range(1, m + 1):
            dp[j] = (dp[j] and s1[i - 1] == s3[i + j - 1]) or (dp[j - 1] and s2[j - 1] == s3[i + j - 1])
            
    print("YES" if dp[m] else "NO")

if __name__ == '__main__':
    solve()
