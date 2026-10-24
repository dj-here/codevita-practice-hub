import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    
    count = 0
    cols = set()
    diag1 = set()  # r - c
    diag2 = set()  # r + c
    
    def backtrack(r):
        nonlocal count
        if r == n:
            count += 1
            return
            
        for c in range(n):
            if c in cols or (r - c) in diag1 or (r + c) in diag2:
                continue
                
            cols.add(c)
            diag1.add(r - c)
            diag2.add(r + c)
            
            backtrack(r + 1)
            
            cols.remove(c)
            diag1.remove(r - c)
            diag2.remove(r + c)

    backtrack(0)
    print(count)

if __name__ == '__main__':
    solve()
