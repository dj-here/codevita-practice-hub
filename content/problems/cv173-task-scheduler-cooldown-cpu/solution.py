import sys
from collections import Counter

def solve():
    lines = sys.stdin.read().split()
    if len(lines) < 2:
        return
    tasks = lines[0]
    n = int(lines[1])
    
    counts = Counter(tasks)
    max_freq = max(counts.values())
    max_count_elements = sum(1 for c in counts.values() if c == max_freq)
    
    time_needed = (max_freq - 1) * (n + 1) + max_count_elements
    print(max(len(tasks), time_needed))

if __name__ == '__main__':
    solve()
