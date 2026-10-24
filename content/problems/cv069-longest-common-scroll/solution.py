import sys

def solve():
    lines = sys.stdin.read().split()
    if len(lines) < 2:
        print(0)
        return
    s1, s2 = lines[0], lines[1]
    n, m = len(s1), len(s2)
    
    prev = [0] * (m + 1)
    curr = [0] * (m + 1)
    
    for i in range(1, n + 1):
        c1 = s1[i - 1]
        for j in range(1, m + 1):
            if c1 == s2[j - 1]:
                curr[j] = prev[j - 1] + 1
            else:
                curr[j] = prev[j] if prev[j] > curr[j - 1] else curr[j - 1]
        prev, curr = curr, [0] * (m + 1)
        
    print(prev[m])

if __name__ == '__main__':
    solve()
