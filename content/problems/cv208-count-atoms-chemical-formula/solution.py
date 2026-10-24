import sys
from collections import defaultdict

def solve():
    formula = sys.stdin.read().strip()
    if not formula:
        return
        
    stack = [defaultdict(int)]
    i = 0
    n = len(formula)
    
    while i < n:
        if formula[i] == '(':
            stack.append(defaultdict(int))
            i += 1
        elif formula[i] == ')':
            i += 1
            start = i
            while i < n and formula[i].isdigit():
                i += 1
            mult = int(formula[start:i]) if i > start else 1
            top = stack.pop()
            for elem, cnt in top.items():
                stack[-1][elem] += cnt * mult
        else:
            # Parse element name
            start = i
            i += 1
            while i < n and formula[i].islower():
                i += 1
            elem = formula[start:i]
            
            # Parse count
            start = i
            while i < n and formula[i].isdigit():
                i += 1
            cnt = int(formula[start:i]) if i > start else 1
            stack[-1][elem] += cnt
            
    res = []
    final_counts = stack[0]
    for elem in sorted(final_counts):
        res.append(elem)
        if final_counts[elem] > 1:
            res.append(str(final_counts[elem]))
            
    print(''.join(res))

if __name__ == '__main__':
    solve()
