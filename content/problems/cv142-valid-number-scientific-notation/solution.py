import sys

def solve():
    s = sys.stdin.read().strip()
    if not s:
        print("NO")
        return
        
    seen_digit = False
    seen_dot = False
    seen_e = False
    
    for i, c in enumerate(s):
        if c.isdigit():
            seen_digit = True
        elif c in '+-':
            if i > 0 and s[i - 1] not in 'eE':
                print("NO")
                return
        elif c == '.':
            if seen_dot or seen_e:
                print("NO")
                return
            seen_dot = True
        elif c in 'eE':
            if seen_e or not seen_digit:
                print("NO")
                return
            seen_e = True
            seen_digit = False # Must see digit after e
        else:
            print("NO")
            return
            
    print("YES" if seen_digit else "NO")

if __name__ == '__main__':
    solve()
