import sys

def solve():
    s = sys.stdin.read().strip()
    if not s:
        return
        
    stack = [0]
    for c in s:
        if c == '(':
            stack.append(0)
        else:
            val = stack.pop()
            score = max(2 * val, 1)
            stack[-1] += score
            
    print(stack[0])

if __name__ == '__main__':
    solve()
