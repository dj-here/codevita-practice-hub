import sys

def solve():
    s = sys.stdin.read().rstrip('\r\n')
    if not s:
        print(0)
        return
        
    last_pos = {}
    max_len = 0
    start = 0
    
    for i, char in enumerate(s):
        if char in last_pos and last_pos[char] >= start:
            start = last_pos[char] + 1
        last_pos[char] = i
        max_len = max(max_len, i - start + 1)
        
    print(max_len)

if __name__ == '__main__':
    solve()
