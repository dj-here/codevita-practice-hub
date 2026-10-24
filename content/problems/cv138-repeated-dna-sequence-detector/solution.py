import sys
from collections import Counter

def solve():
    s = sys.stdin.read().strip()
    if len(s) < 10:
        print("NONE")
        return
        
    counts = Counter()
    for i in range(len(s) - 9):
        sub = s[i:i+10]
        counts[sub] += 1
        
    repeated = sorted([k for k, v in counts.items() if v > 1])
    if repeated:
        for seq in repeated:
            print(seq)
    else:
        print("NONE")

if __name__ == '__main__':
    solve()
