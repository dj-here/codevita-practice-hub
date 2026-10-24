import sys

def solve():
    path = sys.stdin.read().strip()
    if not path:
        return
        
    parts = path.split('/')
    stack = []
    
    for p in parts:
        if p == '' or p == '.':
            continue
        elif p == '..':
            if stack:
                stack.pop()
        else:
            stack.append(p)
            
    print('/' + '/'.join(stack))

if __name__ == '__main__':
    solve()
