import sys
import math

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    nums = [int(x) for x in data[1:n+1]]
    MOD = 1000000007
    
    # Track max power of each prime up to 1000
    max_prime_pow = {}
    for x in nums:
        temp = x
        d = 2
        while d * d <= temp:
            if temp % d == 0:
                count = 0
                while temp % d == 0:
                    count += 1
                    temp //= d
                max_prime_pow[d] = max(max_prime_pow.get(d, 0), count)
            d += 1
        if temp > 1:
            max_prime_pow[temp] = max(max_prime_pow.get(temp, 0), 1)
            
    ans = 1
    for p, power in max_prime_pow.items():
        ans = (ans * pow(p, power, MOD)) % MOD
    print(ans)

if __name__ == '__main__':
    solve()
