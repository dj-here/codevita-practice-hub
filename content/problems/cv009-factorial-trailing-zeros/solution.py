import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    zeros = 0
    divisor = 5
    while divisor <= n:
        zeros += n // divisor
        divisor *= 5
    print(zeros)

if __name__ == '__main__':
    solve()
