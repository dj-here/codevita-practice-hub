import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    
    # Sieve up to n
    is_prime = bytearray([1]) * (n + 1)
    is_prime[0] = is_prime[1] = 0
    p = 2
    while p * p <= n:
        if is_prime[p]:
            is_prime[p*p : n+1 : p] = bytearray(len(range(p*p, n+1, p)))
        p += 1

    count = 0
    for p1 in range(2, n // 2 + 1):
        if is_prime[p1] and is_prime[n - p1]:
            count += 1
    print(count)

if __name__ == '__main__':
    solve()
