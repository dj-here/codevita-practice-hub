import sys

def solve():
    s = sys.stdin.read().strip()
    if not s:
        return
        
    res = []
    
    def backtrack(idx, curr):
        if idx == len(s):
            res.append(''.join(curr))
            return
        c = s[idx]
        if c.isalpha():
            curr.append(c.lower())
            backtrack(idx + 1, curr)
            curr.pop()
            
            curr.append(c.upper())
            backtrack(idx + 1, curr)
            curr.pop()
        else:
            curr.append(c)
            backtrack(idx + 1, curr)
            curr.pop()
            
    backtrack(0, [])
    res.sort()
    for item in res:
        print(item)

if __name__ == '__main__':
    solve()
