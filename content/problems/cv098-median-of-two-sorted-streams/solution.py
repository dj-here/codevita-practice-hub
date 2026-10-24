import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    m = int(data[1])
    idx = 2
    a = [int(x) for x in data[idx:idx+n]]
    idx += n
    b = [int(x) for x in data[idx:idx+m]]
    
    if len(a) > len(b):
        a, b = b, a
        n, m = m, n
        
    total = n + m
    half = (total + 1) // 2
    
    low, high = 0, n
    while low <= high:
        i = (low + high) // 2
        j = half - i
        
        a_left = a[i - 1] if i > 0 else float('-inf')
        a_right = a[i] if i < n else float('inf')
        b_left = b[j - 1] if j > 0 else float('-inf')
        b_right = b[j] if j < m else float('inf')
        
        if a_left <= b_right and b_left <= a_right:
            if total % 2 != 0:
                med = max(a_left, b_left)
            else:
                med = (max(a_left, b_left) + min(a_right, b_right)) / 2.0
            print(f"{med:.1f}")
            return
        elif a_left > b_right:
            high = i - 1
        else:
            low = i + 1

if __name__ == '__main__':
    solve()
