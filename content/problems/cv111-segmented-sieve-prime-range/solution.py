import sys
import math

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    l = int(data[0])
    r = int(data[1])
    
    limit = int(math.isqrt(r)) + 1
    # Simple sieve up to sqrt(R)
    is_prime_small = [True] * (limit + 1)
    is_prime_small[0] = is_prime_small[1] = False
    primes = []
    for i in range(2, limit + 1):
        if is_prime_small[i]:
            primes.append(i)
            for j in range(i * i, limit + 1, i):
                is_prime_small[j] = False
                
    # Segmented sieve
    length = r - l + 1
    segment = [True] * length
    
    for p in primes:
        start = max(p * p, ((l + p - 1) // p) * p)
        for j in range(start, r + 1, p):
            segment[j - l] = False
            
    count = 0
    for i in range(length):
        val = l + i
        if val > 1 and segment[i]:
            count += 1
            
    print(count)

if __name__ == '__main__':
    solve()
