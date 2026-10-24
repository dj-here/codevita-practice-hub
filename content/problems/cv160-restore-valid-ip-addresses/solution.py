import sys

def solve():
    s = sys.stdin.read().strip()
    if not s or len(s) < 4 or len(s) > 12:
        print("NONE")
        return
        
    res = []
    
    def backtrack(idx, parts):
        if len(parts) == 4:
            if idx == len(s):
                res.append('.'.join(parts))
            return
            
        for l in range(1, 4):
            if idx + l <= len(s):
                part = s[idx:idx+l]
                if (len(part) == 1 or part[0] != '0') and 0 <= int(part) <= 255:
                    parts.append(part)
                    backtrack(idx + l, parts)
                    parts.pop()
                    
    backtrack(0, [])
    
    if res:
        res.sort()
        for ip in res:
            print(ip)
    else:
        print("NONE")

if __name__ == '__main__':
    solve()
