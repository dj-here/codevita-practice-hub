import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    s = data[0]
    k = int(data[1])
    words = set(data[2:2+k])
    
    n = len(s)
    dp = [False] * (n + 1)
    dp[0] = True
    
    # Store unique lengths of words to optimize inner loop
    word_lens = sorted(list(set(len(w) for w in words)))
    
    for i in range(1, n + 1):
        for l in word_lens:
            if l > i:
                break
            if dp[i - l] and s[i - l:i] in words:
                dp[i] = True
                break
                
    print("YES" if dp[n] else "NO")

if __name__ == '__main__':
    solve()
