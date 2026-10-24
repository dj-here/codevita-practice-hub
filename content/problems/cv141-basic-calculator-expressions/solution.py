import sys

def solve():
    s = sys.stdin.read().strip()
    if not s:
        return
        
    stack = []
    curr_num = 0
    op = '+'
    
    for i, c in enumerate(s):
        if c.isdigit():
            curr_num = curr_num * 10 + int(c)
        if c in '+-*/' or i == len(s) - 1:
            if op == '+':
                stack.append(curr_num)
            elif op == '-':
                stack.append(-curr_num)
            elif op == '*':
                stack.append(stack.pop() * curr_num)
            elif op == '/':
                top = stack.pop()
                # Truncate toward zero
                stack.append(int(top / curr_num))
            op = c
            curr_num = 0
            
    print(sum(stack))

if __name__ == '__main__':
    solve()
