import sys
from collections import Counter

def solve():
    lines = sys.stdin.read().split()
    if len(lines) < 2:
        return
    s, t = lines[0], lines[1]
    
    t_count = Counter(t)
    required = len(t_count)
    
    window_count = {}
    formed = 0
    
    l = 0
    ans = (float('inf'), 0, 0) # (len, l, r)
    
    for r, char in enumerate(s):
        window_count[char] = window_count.get(char, 0) + 1
        if char in t_count and window_count[char] == t_count[char]:
            formed += 1
            
        while l <= r and formed == required:
            curr_len = r - l + 1
            if curr_len < ans[0]:
                ans = (curr_len, l, r)
                
            left_char = s[l]
            window_count[left_char] -= 1
            if left_char in t_count and window_count[left_char] < t_count[left_char]:
                formed -= 1
            l += 1
            
    if ans[0] == float('inf'):
        print("-1")
    else:
        print(s[ans[1]:ans[2]+1])

if __name__ == '__main__':
    solve()
