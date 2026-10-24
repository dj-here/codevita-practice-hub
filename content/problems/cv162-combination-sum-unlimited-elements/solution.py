import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    target = int(data[1])
    candidates = sorted([int(x) for x in data[2:2+n]])
    
    results = []
    
    def backtrack(start, remain, path):
        if remain == 0:
            results.append(path[:])
            return
        for i in range(start, n):
            c = candidates[i]
            if c > remain:
                break
            path.append(c)
            backtrack(i, remain - c, path) # Allow reuse of candidate i
            path.pop()
            
    backtrack(0, target, [])
    
    if results:
        results.sort()
        for r in results:
            print(' '.join(map(str, r)))
    else:
        print("NONE")

if __name__ == '__main__':
    solve()
