import sys

def solve():
    s = sys.stdin.read().strip()
    if not s:
        return
        
    stack = []
    curr_str = ""
    curr_num = 0
    
    for c in s:
        if c.isdigit():
            curr_num = curr_num * 10 + int(c)
        elif c == '[':
            stack.append((curr_str, curr_num))
            curr_str = ""
            curr_num = 0
        elif c == ']':
            prev_str, num = stack.pop()
            curr_str = prev_str + curr_str * num
        else:
            curr_str += c
            
    print(curr_str)

if __name__ == '__main__':
    solve()
