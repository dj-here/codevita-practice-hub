import sys

def solve():
    lines = sys.stdin.read().split()
    if len(lines) < 2:
        return
    num = lines[0]
    target = int(lines[1])
    
    res = []
    n = len(num)
    
    def backtrack(idx, expr, curr_val, last_op):
        if idx == n:
            if curr_val == target:
                res.append(expr)
            return
            
        for i in range(idx, n):
            if i > idx and num[idx] == '0':
                break
            part = num[idx:i+1]
            val = int(part)
            if idx == 0:
                backtrack(i + 1, part, val, val)
            else:
                backtrack(i + 1, expr + '+' + part, curr_val + val, val)
                backtrack(i + 1, expr + '-' + part, curr_val - val, -val)
                backtrack(i + 1, expr + '*' + part, curr_val - last_op + last_op * val, last_op * val)
                
    backtrack(0, "", 0, 0)
    
    if res:
        res.sort()
        for e in res:
            print(e)
    else:
        print("NONE")

if __name__ == '__main__':
    solve()
