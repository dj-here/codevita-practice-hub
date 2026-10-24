import sys
from collections import defaultdict

def solve():
    lines = sys.stdin.read().split()
    if not lines:
        return
    s = lines[0]
    k = int(lines[1])
    
    count = defaultdict(int)
    max_freq = 0
    left = 0
    ans = 0
    
    for right, char in enumerate(s):
        count[char] += 1
        max_freq = max(max_freq, count[char])
        
        # If number of replacements needed > k, shrink window
        if (right - left + 1) - max_freq > k:
            count[s[left]] -= 1
            left += 1
            
        ans = max(ans, right - left + 1)
        
    print(ans)

if __name__ == '__main__':
    solve()
