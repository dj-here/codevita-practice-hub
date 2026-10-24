import sys
from collections import Counter

def solve():
    s = sys.stdin.read().strip()
    if not s:
        return
        
    counts = Counter(s)
    seen_frequencies = set()
    deletions = 0
    
    for char, freq in counts.items():
        while freq > 0 and freq in seen_frequencies:
            freq -= 1
            deletions += 1
        if freq > 0:
            seen_frequencies.add(freq)
            
    print(deletions)

if __name__ == '__main__':
    solve()
