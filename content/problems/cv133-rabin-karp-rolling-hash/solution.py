import sys

def solve():
    lines = sys.stdin.read().split()
    if len(lines) < 2:
        return
    text = lines[0]
    pattern = lines[1]
    
    n = len(text)
    m = len(pattern)
    if m > n:
        print("-1")
        return
        
    BASE = 257
    MOD = 1000000007
    
    pat_hash = 0
    curr_hash = 0
    power = 1
    
    for i in range(m):
        pat_hash = (pat_hash * BASE + ord(pattern[i])) % MOD
        curr_hash = (curr_hash * BASE + ord(text[i])) % MOD
        if i < m - 1:
            power = (power * BASE) % MOD
            
    matches = []
    for i in range(n - m + 1):
        if curr_hash == pat_hash:
            if text[i:i+m] == pattern:
                matches.append(i)
        if i < n - m:
            curr_hash = (curr_hash - ord(text[i]) * power) % MOD
            curr_hash = (curr_hash * BASE + ord(text[i + m])) % MOD
            curr_hash = (curr_hash + MOD) % MOD
            
    if matches:
        print(' '.join(map(str, matches)))
    else:
        print("-1")

if __name__ == '__main__':
    solve()
