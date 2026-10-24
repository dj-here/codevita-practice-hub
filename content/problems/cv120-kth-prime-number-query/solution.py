import sys

def solve():
    line = sys.stdin.read().strip()
    if not line:
        return
    k = int(line)
    
    # 50,000th prime is ~611,953; allocate up to 700,000
    LIMIT = 700000
    is_prime = [True] * LIMIT
    is_prime[0] = is_prime[1] = False
    
    count = 0
    for i in range(2, LIMIT):
        if is_prime[i]:
            count += 1
            if count == k:
                print(i)
                return
            for j in range(i * i, LIMIT, i):
                is_prime[j] = False

if __name__ == '__main__':
    solve()
