import sys

def solve():
    s = sys.stdin.read().strip()
    if not s:
        return
        
    last = {char: i for i, char in enumerate(s)}
    
    start, end = 0, 0
    ans = []
    
    for i, char in enumerate(s):
        end = max(end, last[char])
        if i == end:
            ans.append(end - start + 1)
            start = i + 1
            
    print(' '.join(map(str, ans)))

if __name__ == '__main__':
    solve()
