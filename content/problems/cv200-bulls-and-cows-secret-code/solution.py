import sys
from collections import Counter

def solve():
    lines = sys.stdin.read().split()
    if len(lines) < 2:
        return
    secret, guess = lines[0], lines[1]
    
    bulls = 0
    s_cows = Counter()
    g_cows = Counter()
    
    for s, g in zip(secret, guess):
        if s == g:
            bulls += 1
        else:
            s_cows[s] += 1
            g_cows[g] += 1
            
    cows = sum(min(s_cows[k], g_cows[k]) for k in s_cows)
    print(f"{bulls}A{cows}B")

if __name__ == '__main__':
    solve()
