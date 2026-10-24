import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    R = int(data[0])
    C = int(data[1])
    idx = 2
    black_sum = 0
    white_sum = 0
    for r in range(R):
        for c in range(C):
            val = int(data[idx])
            idx += 1
            if (r + c) % 2 == 0:
                black_sum += val
            else:
                white_sum += val
    print(abs(black_sum - white_sum))

if __name__ == '__main__':
    solve()
