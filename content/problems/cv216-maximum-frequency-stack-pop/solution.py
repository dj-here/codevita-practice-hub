import sys
from collections import defaultdict

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    m = int(data[0])
    
    freq = defaultdict(int)
    group = defaultdict(list)
    max_freq = 0
    
    idx = 1
    for _ in range(m):
        cmd = data[idx]
        if cmd == 'PUSH':
            val = int(data[idx+1])
            idx += 2
            f = freq[val] + 1
            freq[val] = f
            if f > max_freq:
                max_freq = f
            group[f].append(val)
        else: # POP
            idx += 1
            val = group[max_freq].pop()
            freq[val] -= 1
            if not group[max_freq]:
                max_freq -= 1
            print(val)

if __name__ == '__main__':
    solve()
