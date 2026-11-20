import sys
import bisect

def solve():
    input_data = sys.stdin.read().split()
    if not input_data:
        return
    it = iter(input_data)
    try:
        T = int(next(it))
    except StopIteration:
        return
        
    for _ in range(T):
        N = int(next(it))
        tops = []
        for _ in range(N):
            x = int(next(it))
            idx = bisect.bisect_right(tops, x)
            if idx < len(tops):
                tops[idx] = x
            else:
                tops.append(x)
        print(len(tops))

if __name__ == "__main__":
    solve()
