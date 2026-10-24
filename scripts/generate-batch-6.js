const { createProblem } = require('./problem-helper');

const problems = [
  // --------------------------------------------------------------------------
  // cv111: Number Theory - Segmented Sieve (MEDIUM)
  // --------------------------------------------------------------------------
  {
    id: 'cv111',
    slug: 'segmented-sieve-prime-range',
    title: 'The Starlight Sector Prime Density',
    difficulty: 'MEDIUM',
    topics: ['Number Theory & Primes'],
    timeLimitMs: 1500,
    memoryLimitKb: 262144,
    statement: `An astronomer surveys a designated deep-space coordinate sector [L, R].
Calculate the total count of prime numbers within the inclusive interval [L, R].
Because coordinates L and R can be as large as 10^9, a traditional sieve of Eratosthenes is insufficient; you must employ a Segmented Sieve.`,
    inputFormat: 'A single line containing two integers L and R.',
    outputFormat: 'Print the count of primes in [L, R].',
    constraints: '1 <= L <= R <= 10^9\nR - L <= 100000',
    sampleCases: [
      { input: '1 10', expectedOutput: '4', explanation: 'Primes in [1, 10]: 2, 3, 5, 7 (count is 4).' },
      { input: '10 20', expectedOutput: '4', explanation: 'Primes in [10, 20]: 11, 13, 17, 19 (count is 4).' },
    ],
    hiddenCases: [
      { input: '1 1' },
      { input: '2 2' },
      { input: '100 200' },
      { input: '1000000000 1000050000' },
      { input: '5000000 5050000' },
      { input: '999900000 1000000000' },
      { input: '23 23' },
      { input: '24 28' },
    ],
    solutionCode: `
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
`,
    editorial: {
      approach: 'Segmented Sieve: sieve primes up to sqrt(R), then use those primes to mark composite multiples in the range [L, R].',
      timeComplexity: 'O(sqrt(R) log(log sqrt(R)) + (R - L) log(log R))',
      spaceComplexity: 'O(R - L + sqrt(R))',
    },
  },

  // --------------------------------------------------------------------------
  // cv112: Number Theory - Lucas Theorem Combination Modulo (HARD)
  // --------------------------------------------------------------------------
  {
    id: 'cv112',
    slug: 'lucas-theorem-combination-mod',
    title: 'The High Council Electoral Combinations',
    difficulty: 'HARD',
    topics: ['Number Theory & Primes'],
    timeLimitMs: 1500,
    memoryLimitKb: 262144,
    statement: `A Galactic Republic must select K planetary delegates from N candidates.
The constitution requires computing the exact combination count modulo a prime modulus P:
C(N, K) mod P.

Given that N and K can be astronomical (up to 10^12) while P is a relatively small prime (P < 1000), calculate C(N, K) % P using Lucas' Theorem.`,
    inputFormat: 'A single line containing three integers N, K, and P.',
    outputFormat: 'Print C(N, K) % P.',
    constraints: '0 <= K <= N <= 10^12\n2 <= P <= 997 (P is prime)',
    sampleCases: [
      { input: '10 2 13', expectedOutput: '6', explanation: 'C(10, 2) = 45. 45 % 13 = 6.' },
      { input: '5 3 7', expectedOutput: '3', explanation: 'C(5, 3) = 10. 10 % 7 = 3.' },
    ],
    hiddenCases: [
      { input: '0 0 11' },
      { input: '1000 500 13' },
      { input: '1000000000000 500000000000 17' },
      { input: '123456789 9876543 23' },
      { input: '50 60 7' },
      { input: '100 0 101' },
      { input: '1000000000 1 31' },
      { input: '999999999999 1234567 43' },
    ],
    solutionCode: `
import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    k = int(data[1])
    p = int(data[2])
    
    if k > n:
        print(0)
        return
    if k == 0 or k == n:
        print(1)
        return
        
    # Precompute factorials modulo P
    fact = [1] * p
    inv = [1] * p
    for i in range(1, p):
        fact[i] = (fact[i - 1] * i) % p
    inv[p - 1] = pow(fact[p - 1], p - 2, p)
    for i in range(p - 2, -1, -1):
        inv[i] = (inv[i + 1] * (i + 1)) % p
        
    def nCr_small(n_i, k_i):
        if k_i > n_i:
            return 0
        return (fact[n_i] * inv[k_i] % p * inv[n_i - k_i] % p)
        
    res = 1
    while n > 0 or k > 0:
        ni = n % p
        ki = k % p
        res = (res * nCr_small(ni, ki)) % p
        n //= p
        k //= p
        if res == 0:
            break
            
    print(res)

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: "Lucas' Theorem: express N and K in base P as N = sum(n_i * P^i) and K = sum(k_i * P^i). Then C(N, K) = prod(C(n_i, k_i)) mod P.",
      timeComplexity: 'O(P + log_P(N))',
      spaceComplexity: 'O(P)',
    },
  },

  // --------------------------------------------------------------------------
  // cv113: Number Theory - Modular Inverse Fermat (MEDIUM)
  // --------------------------------------------------------------------------
  {
    id: 'cv113',
    slug: 'fermat-little-theorem-inversion',
    title: 'Cryptographic Modular Inverse Vault',
    difficulty: 'MEDIUM',
    topics: ['Number Theory & Primes'],
    timeLimitMs: 1000,
    memoryLimitKb: 262144,
    statement: `In modular cryptography, dividing by an integer A modulo a prime P is equivalent to multiplying by A's modular multiplicative inverse A^(-1) mod P.
By Fermat's Little Theorem, if P is prime and A is not divisible by P:
A^(P - 1) = 1 (mod P) => A * A^(P - 2) = 1 (mod P).
Thus, A^(-1) = A^(P - 2) mod P.

Given integers A and prime P, compute the modular inverse of A modulo P.
If A is a multiple of P, no inverse exists; print -1.`,
    inputFormat: 'A single line containing two integers A and P.',
    outputFormat: 'Print the modular inverse or -1.',
    constraints: '1 <= A <= 10^18\n2 <= P <= 10^9 + 7 (P is a prime)',
    sampleCases: [
      { input: '3 7', expectedOutput: '5', explanation: '3 * 5 = 15 = 1 (mod 7).' },
      { input: '10 5', expectedOutput: '-1', explanation: '10 is divisible by 5, no modular inverse.' },
    ],
    hiddenCases: [
      { input: '1 13' },
      { input: '2 1000000007' },
      { input: '1000 1000000007' },
      { input: '7 11' },
      { input: '25 29' },
      { input: '123456789 998244353' },
      { input: '7 7' },
      { input: '42 43' },
    ],
    solutionCode: `
import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    a = int(data[0])
    p = int(data[1])
    
    if a % p == 0:
        print(-1)
        return
        
    ans = pow(a % p, p - 2, p)
    print(ans)

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: "Compute A^(P-2) mod P using modular exponentiation in O(log P).",
      timeComplexity: 'O(log P)',
      spaceComplexity: 'O(1)',
    },
  },

  // --------------------------------------------------------------------------
  // cv114: Number Theory - Sum of Divisors Sigma (EASY)
  // --------------------------------------------------------------------------
  {
    id: 'cv114',
    slug: 'sum-of-divisors-sigma',
    title: 'The Harmonic Sum of Divisors',
    difficulty: 'EASY',
    topics: ['Number Theory & Primes'],
    timeLimitMs: 1000,
    memoryLimitKb: 262144,
    statement: `Given an integer N, compute sigma(N), defined as the sum of all positive divisors of N (including 1 and N itself).`,
    inputFormat: 'A single integer N.',
    outputFormat: 'Print sigma(N).',
    constraints: '1 <= N <= 10^9',
    sampleCases: [
      { input: '6', expectedOutput: '12', explanation: 'Divisors of 6 are 1, 2, 3, 6. Sum = 12.' },
      { input: '12', expectedOutput: '28', explanation: 'Divisors of 12 are 1, 2, 3, 4, 6, 12. Sum = 28.' },
    ],
    hiddenCases: [
      { input: '1' },
      { input: '2' },
      { input: '13' },
      { input: '36' },
      { input: '100' },
      { input: '1000000' },
      { input: '999999999' },
      { input: '1000000000' },
    ],
    solutionCode: `
import sys

def solve():
    line = sys.stdin.read().strip()
    if not line:
        return
    n = int(line)
    
    total = 0
    d = 1
    while d * d <= n:
        if n % d == 0:
            total += d
            if d * d != n:
                total += n // d
        d += 1
        
    print(total)

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: 'Iterate d from 1 to floor(sqrt(N)); if d divides N, add both d and N//d to the sum.',
      timeComplexity: 'O(sqrt(N))',
      spaceComplexity: 'O(1)',
    },
  },

  // --------------------------------------------------------------------------
  // cv115: Number Theory - Amicable Numbers Pair Checker (EASY)
  // --------------------------------------------------------------------------
  {
    id: 'cv115',
    slug: 'amicable-numbers-pair-checker',
    title: 'The Resonance of Amicable Pairs',
    difficulty: 'EASY',
    topics: ['Number Theory & Primes'],
    timeLimitMs: 1000,
    memoryLimitKb: 262144,
    statement: `Two distinct integers A and B are called amicable numbers if the sum of proper divisors of A equals B, and the sum of proper divisors of B equals A.
(A proper divisor of N is any positive divisor of N strictly less than N).

Given two distinct positive integers A and B, determine if they form an amicable pair.
Print YES if they are amicable, otherwise print NO.`,
    inputFormat: 'A single line containing two integers A and B.',
    outputFormat: 'Print YES or NO.',
    constraints: '1 <= A, B <= 10^7\nA != B',
    sampleCases: [
      { input: '220 284', expectedOutput: 'YES', explanation: 'Proper divisors of 220 sum to 284; proper divisors of 284 sum to 220.' },
      { input: '10 20', expectedOutput: 'NO', explanation: 'Not amicable.' },
    ],
    hiddenCases: [
      { input: '1184 1210' },
      { input: '2620 2924' },
      { input: '5020 5564' },
      { input: '6232 6368' },
      { input: '100 200' },
      { input: '6 28' },
      { input: '17296 18416' },
      { input: '12 18' },
    ],
    solutionCode: `
import sys

def sum_proper_divisors(n):
    if n <= 1:
        return 0
    total = 1
    d = 2
    while d * d <= n:
        if n % d == 0:
            total += d
            if d * d != n:
                total += n // d
        d += 1
    return total

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    a = int(data[0])
    b = int(data[1])
    
    if a != b and sum_proper_divisors(a) == b and sum_proper_divisors(b) == a:
        print("YES")
    else:
        print("NO")

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: 'Compute sum of proper divisors for both numbers in O(sqrt(A) + sqrt(B)) and check equality.',
      timeComplexity: 'O(sqrt(A) + sqrt(B))',
      spaceComplexity: 'O(1)',
    },
  },

  // --------------------------------------------------------------------------
  // cv116: Number Theory - Fibonacci Matrix Exponentiation (HARD)
  // --------------------------------------------------------------------------
  {
    id: 'cv116',
    slug: 'fibonacci-matrix-exponentiation',
    title: 'The Great Matrix Fibonacci Prophecy',
    difficulty: 'HARD',
    topics: ['Number Theory & Primes'],
    timeLimitMs: 1000,
    memoryLimitKb: 262144,
    statement: `The Fibonacci sequence is defined as:
F(0) = 0, F(1) = 1, F(N) = F(N - 1) + F(N - 2) for N >= 2.

Given an astronomical index N, compute F(N) modulo 10^9 + 7 using 2x2 matrix exponentiation in O(log N) time.`,
    inputFormat: 'A single integer N.',
    outputFormat: 'Print F(N) % 1000000007.',
    constraints: '0 <= N <= 10^18',
    sampleCases: [
      { input: '6', expectedOutput: '8', explanation: 'F(6) = 8.' },
      { input: '10', expectedOutput: '55', explanation: 'F(10) = 55.' },
    ],
    hiddenCases: [
      { input: '0' },
      { input: '1' },
      { input: '2' },
      { input: '50' },
      { input: '100' },
      { input: '1000000000' },
      { input: '1000000000000000000' },
      { input: '123456789012345' },
    ],
    solutionCode: `
import sys

MOD = 1000000007

def mat_mult(a, b):
    return [
        [(a[0][0]*b[0][0] + a[0][1]*b[1][0]) % MOD, (a[0][0]*b[0][1] + a[0][1]*b[1][1]) % MOD],
        [(a[1][0]*b[0][0] + a[1][1]*b[1][0]) % MOD, (a[1][0]*b[0][1] + a[1][1]*b[1][1]) % MOD]
    ]

def mat_pow(mat, power):
    res = [[1, 0], [0, 1]]
    base = mat
    while power > 0:
        if power % 2 == 1:
            res = mat_mult(res, base)
        base = mat_mult(base, base)
        power //= 2
    return res

def solve():
    line = sys.stdin.read().strip()
    if not line:
        return
    n = int(line)
    if n == 0:
        print(0)
        return
    if n == 1:
        print(1)
        return
        
    T = [[1, 1], [1, 0]]
    result_mat = mat_pow(T, n - 1)
    print(result_mat[0][0])

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: 'Matrix exponentiation: [[F(n), F(n-1)], [F(n-1), F(n-2)]] = [[1, 1], [1, 0]]^(n-1). Binary exponentiation runs in O(log N).',
      timeComplexity: 'O(log N)',
      spaceComplexity: 'O(1)',
    },
  },

  // --------------------------------------------------------------------------
  // cv117: Number Theory - Smallest Primitive Root (HARD)
  // --------------------------------------------------------------------------
  {
    id: 'cv117',
    slug: 'primitive-roots-modulo-prime',
    title: 'The Primitive Root Cipher Core',
    difficulty: 'HARD',
    topics: ['Number Theory & Primes'],
    timeLimitMs: 1500,
    memoryLimitKb: 262144,
    statement: `An integer g is called a primitive root modulo prime P if the powers g^1, g^2, ..., g^(P-1) mod P generate all integers from 1 to P - 1 (i.e. g has multiplicative order P - 1).

Given a prime number P, find the smallest primitive root g modulo P.
If no primitive root exists, print -1.`,
    inputFormat: 'A single prime integer P.',
    outputFormat: 'Print the smallest primitive root g.',
    constraints: '2 <= P <= 100000 (P is a prime number)',
    sampleCases: [
      { input: '7', expectedOutput: '3', explanation: 'Powers of 3 mod 7: 3, 2, 6, 4, 5, 1 (all residues 1..6 generated).' },
      { input: '5', expectedOutput: '2', explanation: 'Powers of 2 mod 5: 2, 4, 3, 1 (all residues generated).' },
    ],
    hiddenCases: [
      { input: '2' },
      { input: '3' },
      { input: '11' },
      { input: '13' },
      { input: '17' },
      { input: '97' },
      { input: '997' },
      { input: '99991' },
    ],
    solutionCode: `
import sys

def solve():
    line = sys.stdin.read().strip()
    if not line:
        return
    p = int(line)
    if p == 2:
        print(1)
        return
        
    phi = p - 1
    # Find prime factors of phi
    factors = []
    temp = phi
    d = 2
    while d * d <= temp:
        if temp % d == 0:
            factors.append(d)
            while temp % d == 0:
                temp //= d
        d += 1
    if temp > 1:
        factors.append(temp)
        
    for g in range(2, p):
        is_primitive = True
        for q in factors:
            if pow(g, phi // q, p) == 1:
                is_primitive = False
                break
        if is_primitive:
            print(g)
            return
            
    print(-1)

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: 'Euler criterion: g is a primitive root mod P iff for every prime factor q of P - 1, g^((P-1)/q) != 1 (mod P). Smallest primitive roots are typically very small.',
      timeComplexity: 'O(sqrt(P) + num_tests * log P)',
      spaceComplexity: 'O(factors)',
    },
  },

  // --------------------------------------------------------------------------
  // cv118: Number Theory - Catalan Number Modulo (MEDIUM)
  // --------------------------------------------------------------------------
  {
    id: 'cv118',
    slug: 'catalan-number-modulo',
    title: 'The Catalan Geometric Dissection Count',
    difficulty: 'MEDIUM',
    topics: ['Number Theory & Primes'],
    timeLimitMs: 1000,
    memoryLimitKb: 262144,
    statement: `The Catalan numbers C_n describe the count of valid parenthesis expressions of length 2n, full binary trees with n+1 leaves, and triangulations of convex polygons with n+2 vertices.
Formula: C_n = (1 / (n + 1)) * (2n choose n).

Given N, compute C_N modulo 10^9 + 7.`,
    inputFormat: 'A single non-negative integer N.',
    outputFormat: 'Print C_N % 1000000007.',
    constraints: '0 <= N <= 1000',
    sampleCases: [
      { input: '3', expectedOutput: '5', explanation: 'C_3 = 5.' },
      { input: '4', expectedOutput: '14', explanation: 'C_4 = 14.' },
    ],
    hiddenCases: [
      { input: '0' },
      { input: '1' },
      { input: '2' },
      { input: '5' },
      { input: '10' },
      { input: '50' },
      { input: '100' },
      { input: '1000' },
    ],
    solutionCode: `
import sys

MOD = 1000000007

def solve():
    line = sys.stdin.read().strip()
    if not line:
        return
    n = int(line)
    if n <= 1:
        print(1)
        return
        
    c = 1
    for i in range(1, n + 1):
        c = (c * (4 * i - 2) % MOD * pow(i + 1, MOD - 2, MOD)) % MOD
        
    print(c)

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: 'Recurrence C_i = C_{i-1} * (4i - 2) / (i + 1) mod 10^9+7 using modular inverse.',
      timeComplexity: 'O(N log MOD)',
      spaceComplexity: 'O(1)',
    },
  },

  // --------------------------------------------------------------------------
  // cv119: Number Theory - Linear Diophantine Equation (MEDIUM)
  // --------------------------------------------------------------------------
  {
    id: 'cv119',
    slug: 'diophantine-linear-solver',
    title: 'The Ancient Merchant Diophantine Balance',
    difficulty: 'MEDIUM',
    topics: ['Number Theory & Primes'],
    timeLimitMs: 1000,
    memoryLimitKb: 262144,
    statement: `A trader uses two standard balance weights of integer masses A and B to measure a commodity of target mass C.
An exact measurement is possible if and only if there exist integers x and y (positive, negative, or zero) satisfying:
A * x + B * y = C.

By Bézout's identity, an integer solution exists if and only if C is divisible by gcd(A, B).
Print YES if integral solution exists, otherwise print NO.`,
    inputFormat: 'A single line containing three integers A, B, and C.',
    outputFormat: 'Print YES or NO.',
    constraints: '1 <= A, B <= 10^9\n1 <= C <= 10^9',
    sampleCases: [
      { input: '3 6 9', expectedOutput: 'YES', explanation: 'gcd(3, 6) = 3; 9 is divisible by 3.' },
      { input: '4 6 7', expectedOutput: 'NO', explanation: 'gcd(4, 6) = 2; 7 is not divisible by 2.' },
    ],
    hiddenCases: [
      { input: '1 1 100' },
      { input: '5 7 1' },
      { input: '10 15 25' },
      { input: '10 15 26' },
      { input: '1000000000 500000000 1500000000' },
      { input: '14 21 35' },
      { input: '14 21 36' },
      { input: '17 19 1000000' },
    ],
    solutionCode: `
import sys
import math

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    a = int(data[0])
    b = int(data[1])
    c = int(data[2])
    
    g = math.gcd(a, b)
    if c % g == 0:
        print("YES")
    else:
        print("NO")

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: "Bézout's identity: A*x + B*y = C has integer solutions iff C % gcd(A, B) == 0.",
      timeComplexity: 'O(log(min(A, B)))',
      spaceComplexity: 'O(1)',
    },
  },

  // --------------------------------------------------------------------------
  // cv120: Number Theory - K-th Prime Number Query (MEDIUM)
  // --------------------------------------------------------------------------
  {
    id: 'cv120',
    slug: 'kth-prime-number-query',
    title: 'The Sieve of Eratosthenes Prime Rank',
    difficulty: 'MEDIUM',
    topics: ['Number Theory & Primes'],
    timeLimitMs: 1500,
    memoryLimitKb: 262144,
    statement: `Given an integer K, find and print the K-th prime number (1-based index).
For example, the 1st prime is 2, the 2nd prime is 3, the 3rd prime is 5, etc.`,
    inputFormat: 'A single positive integer K.',
    outputFormat: 'Print the K-th prime number.',
    constraints: '1 <= K <= 50000',
    sampleCases: [
      { input: '1', expectedOutput: '2', explanation: '1st prime is 2.' },
      { input: '5', expectedOutput: '11', explanation: 'Primes: 2, 3, 5, 7, 11.' },
    ],
    hiddenCases: [
      { input: '2' },
      { input: '10' },
      { input: '100' },
      { input: '1000' },
      { input: '5000' },
      { input: '10000' },
      { input: '25000' },
      { input: '50000' },
    ],
    solutionCode: `
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
`,
    editorial: {
      approach: 'Sieve of Eratosthenes up to upper bound ~700,000 to find the 50,000th prime.',
      timeComplexity: 'O(LIMIT log log LIMIT)',
      spaceComplexity: 'O(LIMIT)',
    },
  },

  // --------------------------------------------------------------------------
  // cv121: Number Theory - Coprime Pairs in Array (MEDIUM)
  // --------------------------------------------------------------------------
  {
    id: 'cv121',
    slug: 'coprime-pairs-in-range',
    title: 'The Mutual Coprimality Pair Counter',
    difficulty: 'MEDIUM',
    topics: ['Number Theory & Primes'],
    timeLimitMs: 1500,
    memoryLimitKb: 262144,
    statement: `Given an array of N integers, count the number of unordered pairs of indices (i, j) with 0 <= i < j < N such that gcd(A_i, A_j) == 1 (the elements are coprime).`,
    inputFormat: 'First line: Integer N.\nSecond line: N space-separated integers.',
    outputFormat: 'Print the count of coprime pairs.',
    constraints: '2 <= N <= 2000\n1 <= A_i <= 10000',
    sampleCases: [
      { input: '3\n2 3 4', expectedOutput: '2', explanation: 'Pairs: (2, 3) -> gcd=1, (3, 4) -> gcd=1. (2, 4) has gcd=2. Total 2.' },
      { input: '4\n1 2 3 4', expectedOutput: '5', explanation: '(1,2), (1,3), (1,4), (2,3), (3,4) are coprime (5 pairs).' },
    ],
    hiddenCases: [
      { input: '2\n4 6' },
      { input: '2\n7 11' },
      { input: '5\n2 4 6 8 10' },
      { input: '5\n3 5 7 11 13' },
      { input: '6\n1 1 1 1 1 1' },
      { input: '6\n10 15 21 25 35 49' },
      { input: '7\n12 18 24 30 36 42 48' },
      { input: '5\n100 200 300 400 500' },
    ],
    solutionCode: `
import sys
import math

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    nums = [int(x) for x in data[1:1+n]]
    
    count = 0
    for i in range(n):
        for j in range(i + 1, n):
            if math.gcd(nums[i], nums[j]) == 1:
                count += 1
                
    print(count)

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: 'Pairwise GCD calculation across all O(N^2) pairs.',
      timeComplexity: 'O(N^2 log(max(A)))',
      spaceComplexity: 'O(N)',
    },
  },

  // --------------------------------------------------------------------------
  // cv122: Arrays & Two Pointers - Longest Substring Without Repeating (MEDIUM)
  // --------------------------------------------------------------------------
  {
    id: 'cv122',
    slug: 'longest-substring-without-repeating',
    title: 'The Rune Scroll Distinct Glyph Span',
    difficulty: 'MEDIUM',
    topics: ['Arrays & Two Pointers'],
    timeLimitMs: 1000,
    memoryLimitKb: 262144,
    statement: `Given a string S, find the length of the longest contiguous substring without any repeating characters.`,
    inputFormat: 'A single string S.',
    outputFormat: 'Print the length of the longest substring with unique characters.',
    constraints: '1 <= len(S) <= 100000\nString contains printable ASCII characters.',
    sampleCases: [
      { input: 'abcabcbb', expectedOutput: '3', explanation: 'Longest substrings: "abc", length 3.' },
      { input: 'bbbbb', expectedOutput: '1', explanation: 'All characters same; longest is "b", length 1.' },
    ],
    hiddenCases: [
      { input: 'pwwkew' },
      { input: 'a' },
      { input: 'abcdefghijklmnopqrstuvwxyz' },
      { input: 'aab' },
      { input: 'dvdf' },
      { input: 'tmmzuxt' },
      { input: 'codevitapracticehub' },
      { input: 'abba' },
    ],
    solutionCode: `
import sys

def solve():
    s = sys.stdin.read().rstrip('\\r\\n')
    if not s:
        print(0)
        return
        
    last_pos = {}
    max_len = 0
    start = 0
    
    for i, char in enumerate(s):
        if char in last_pos and last_pos[char] >= start:
            start = last_pos[char] + 1
        last_pos[char] = i
        max_len = max(max_len, i - start + 1)
        
    print(max_len)

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: 'Sliding window with hash map tracking last seen index of each character.',
      timeComplexity: 'O(N)',
      spaceComplexity: 'O(min(N, Sigma))',
    },
  },

  // --------------------------------------------------------------------------
  // cv123: Arrays & Two Pointers - Minimum Window Substring (HARD)
  // --------------------------------------------------------------------------
  {
    id: 'cv123',
    slug: 'minimum-window-substring-target',
    title: 'The Minimal Alchemical Inscription Window',
    difficulty: 'HARD',
    topics: ['Arrays & Two Pointers'],
    timeLimitMs: 1500,
    memoryLimitKb: 262144,
    statement: `Given two strings S and T, find the minimum window substring of S which contains all characters of T (including duplicate character frequencies).
If there is no such window, print -1.
If multiple valid windows exist with minimum length, print the one appearing earliest in S.`,
    inputFormat: 'First line: String S.\nSecond line: String T.',
    outputFormat: 'Print the shortest matching substring, or -1.',
    constraints: '1 <= len(S), len(T) <= 100000\nStrings contain English letters.',
    sampleCases: [
      { input: 'ADOBECODEBANC\nABC', expectedOutput: 'BANC', explanation: '"BANC" contains A, B, and C with length 4.' },
      { input: 'a\na', expectedOutput: 'a', explanation: 'Exact match.' },
    ],
    hiddenCases: [
      { input: 'a\naa' },
      { input: 'aa\na' },
      { input: 'ab\nb' },
      { input: 'bba\nab' },
      { input: 'CODEVITA2026\nVIT' },
      { input: 'XYZ\nXYZ' },
      { input: 'ABCDEF\nGHI' },
      { input: 'DONKEYS\nKEY' },
    ],
    solutionCode: `
import sys
from collections import Counter

def solve():
    lines = sys.stdin.read().split()
    if len(lines) < 2:
        return
    s, t = lines[0], lines[1]
    
    t_count = Counter(t)
    required = len(t_count)
    
    window_count = {}
    formed = 0
    
    l = 0
    ans = (float('inf'), 0, 0) # (len, l, r)
    
    for r, char in enumerate(s):
        window_count[char] = window_count.get(char, 0) + 1
        if char in t_count and window_count[char] == t_count[char]:
            formed += 1
            
        while l <= r and formed == required:
            curr_len = r - l + 1
            if curr_len < ans[0]:
                ans = (curr_len, l, r)
                
            left_char = s[l]
            window_count[left_char] -= 1
            if left_char in t_count and window_count[left_char] < t_count[left_char]:
                formed -= 1
            l += 1
            
    if ans[0] == float('inf'):
        print("-1")
    else:
        print(s[ans[1]:ans[2]+1])

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: 'Sliding window technique using character frequencies and a formed count counter.',
      timeComplexity: 'O(|S| + |T|)',
      spaceComplexity: 'O(|S| + |T|)',
    },
  },

  // --------------------------------------------------------------------------
  // cv124: Arrays & Two Pointers - Inversion Count Merge Sort (HARD)
  // --------------------------------------------------------------------------
  {
    id: 'cv124',
    slug: 'inversion-count-merge-sort',
    title: 'The Cosmic Entropy Inversion Counter',
    difficulty: 'HARD',
    topics: ['Arrays & Two Pointers'],
    timeLimitMs: 1500,
    memoryLimitKb: 262144,
    statement: `An inversion in an array A is a pair of indices (i, j) such that i < j and A[i] > A[j].
The inversion count indicates how far the array is from being completely sorted.

Given an array of N integers, calculate the total number of inversions.
Your algorithm must run in O(N log N) time.`,
    inputFormat: 'First line: Integer N.\nSecond line: N space-separated integers.',
    outputFormat: 'Print the total number of inversions.',
    constraints: '1 <= N <= 100000\n-10^9 <= A_i <= 10^9',
    sampleCases: [
      { input: '5\n2 4 1 3 5', expectedOutput: '3', explanation: 'Inversions: (2, 1), (4, 1), (4, 3).' },
      { input: '5\n5 4 3 2 1', expectedOutput: '10', explanation: 'Completely reversed array has N*(N-1)/2 = 10 inversions.' },
    ],
    hiddenCases: [
      { input: '1\n42' },
      { input: '5\n1 2 3 4 5' },
      { input: '4\n1 3 2 4' },
      { input: '6\n8 4 2 1 5 7' },
      { input: '7\n1 20 6 4 5 10 2' },
      { input: '8\n3 1 2 5 4 7 6 8' },
      { input: '6\n10 10 10 10 10 10' },
      { input: '5\n10 5 1 2 3' },
    ],
    solutionCode: `
import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    arr = [int(x) for x in data[1:1+n]]
    
    temp = [0] * n
    
    def merge_sort(left, right):
        if left >= right:
            return 0
        mid = (left + right) // 2
        inv_count = merge_sort(left, mid) + merge_sort(mid + 1, right)
        
        i, j, k = left, mid + 1, left
        while i <= mid and j <= right:
            if arr[i] <= arr[j]:
                temp[k] = arr[i]
                i += 1
            else:
                temp[k] = arr[j]
                inv_count += (mid - i + 1)
                j += 1
            k += 1
            
        while i <= mid:
            temp[k] = arr[i]
            i += 1
            k += 1
        while j <= right:
            temp[k] = arr[j]
            j += 1
            k += 1
            
        for idx in range(left, right + 1):
            arr[idx] = temp[idx]
            
        return inv_count
        
    print(merge_sort(0, n - 1))

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: 'Modified Merge Sort: during merging of two sorted halves, when arr[i] > arr[j], all remaining elements from i to mid form inversions with arr[j].',
      timeComplexity: 'O(N log N)',
      spaceComplexity: 'O(N)',
    },
  },

  // --------------------------------------------------------------------------
  // cv125: Arrays & Two Pointers - Rainwater Trapping (MEDIUM)
  // --------------------------------------------------------------------------
  {
    id: 'cv125',
    slug: 'rainwater-trapping-elevation',
    title: 'The Great Reservoir Rainwater Basin',
    difficulty: 'MEDIUM',
    topics: ['Arrays & Two Pointers'],
    timeLimitMs: 1000,
    memoryLimitKb: 262144,
    statement: `Given an elevation map represented by an array of N non-negative integers where each bar has width 1, compute how much water it can trap after raining.`,
    inputFormat: 'First line: Integer N.\nSecond line: N space-separated integers representing bar heights.',
    outputFormat: 'Print the total units of trapped water.',
    constraints: '1 <= N <= 100000\n0 <= Height <= 10^5',
    sampleCases: [
      { input: '12\n0 1 0 2 1 0 1 3 2 1 2 1', expectedOutput: '6', explanation: 'Traps 6 total units of water.' },
      { input: '6\n4 2 0 3 2 5', expectedOutput: '9', explanation: 'Traps 9 units of water.' },
    ],
    hiddenCases: [
      { input: '1\n5' },
      { input: '2\n5 5' },
      { input: '3\n3 0 3' },
      { input: '5\n5 4 3 2 1' },
      { input: '5\n1 2 3 4 5' },
      { input: '7\n0 2 0 4 0 2 0' },
      { input: '8\n5 2 1 2 1 5 1 2' },
      { input: '6\n3 1 2 4 0 1' },
    ],
    solutionCode: `
import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    height = [int(x) for x in data[1:1+n]]
    
    if n <= 2:
        print(0)
        return
        
    left, right = 0, n - 1
    left_max, right_max = 0, 0
    water = 0
    
    while left < right:
        if height[left] < height[right]:
            if height[left] >= left_max:
                left_max = height[left]
            else:
                water += left_max - height[left]
            left += 1
        else:
            if height[right] >= right_max:
                right_max = height[right]
            else:
                water += right_max - height[right]
            right -= 1
            
    print(water)

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: 'Two-pointer technique tracking left_max and right_max inwards in O(N) time and O(1) space.',
      timeComplexity: 'O(N)',
      spaceComplexity: 'O(1)',
    },
  },

  // --------------------------------------------------------------------------
  // cv126: Arrays & Two Pointers - Boats to Save People (MEDIUM)
  // --------------------------------------------------------------------------
  {
    id: 'cv126',
    slug: 'boats-to-save-people-capacity',
    title: 'The Evacuation Ferry Allocation',
    difficulty: 'MEDIUM',
    topics: ['Arrays & Two Pointers'],
    timeLimitMs: 1000,
    memoryLimitKb: 262144,
    statement: `You are given an array of N people's weights and an integer Limit representing the maximum weight carrying capacity of a rescue boat.
Each boat can carry at most 2 people at the same time, provided the sum of their weights is at most Limit.

Determine the minimum number of boats required to carry every person safely.`,
    inputFormat: 'First line: Two integers N and Limit.\nSecond line: N space-separated integers representing people weights.',
    outputFormat: 'Print the minimum number of boats.',
    constraints: '1 <= N <= 50000\n1 <= Weight_i <= Limit <= 30000',
    sampleCases: [
      { input: '4 5\n3 2 2 1', expectedOutput: '3', explanation: 'Boats: (1, 2), (2), (3) -> 3 boats.' },
      { input: '4 3\n3 5 3 4', expectedOutput: '4', explanation: 'Each in own boat (limit exceeded if paired).' },
    ],
    hiddenCases: [
      { input: '1 10\n5' },
      { input: '5 5\n3 5 3 4 1' },
      { input: '6 6\n1 2 3 4 5 5' },
      { input: '4 4\n2 2 2 2' },
      { input: '6 10\n2 4 6 8 8 10' },
      { input: '5 10\n5 5 5 5 5' },
      { input: '7 7\n1 1 2 2 3 4 5' },
      { input: '4 10\n1 2 3 4' },
    ],
    solutionCode: `
import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    limit = int(data[1])
    people = sorted([int(x) for x in data[2:2+n]])
    
    left = 0
    right = n - 1
    boats = 0
    
    while left <= right:
        if people[left] + people[right] <= limit:
            left += 1
        right -= 1
        boats += 1
        
    print(boats)

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: 'Greedy two pointers: pair the heaviest available person with the lightest available person if their combined weight fits in the boat.',
      timeComplexity: 'O(N log N)',
      spaceComplexity: 'O(N)',
    },
  },

  // --------------------------------------------------------------------------
  // cv127: Arrays & Two Pointers - Squares of Sorted Array (EASY)
  // --------------------------------------------------------------------------
  {
    id: 'cv127',
    slug: 'squares-of-sorted-array',
    title: 'The Parabolic Sensor Square Sorting',
    difficulty: 'EASY',
    topics: ['Arrays & Two Pointers'],
    timeLimitMs: 1000,
    memoryLimitKb: 262144,
    statement: `Given an array of N integers sorted in non-decreasing order, return an array of the squares of each number, also sorted in non-decreasing order.
Your algorithm must run in O(N) time using two pointers.`,
    inputFormat: 'First line: Integer N.\nSecond line: N space-separated integers in non-decreasing order.',
    outputFormat: 'Print the squared numbers in non-decreasing order.',
    constraints: '1 <= N <= 100000\n-10^4 <= A_i <= 10^4',
    sampleCases: [
      { input: '5\n-4 -1 0 3 10', expectedOutput: '0 1 9 16 100', explanation: 'Squares: [16, 1, 0, 9, 100] sorted is [0, 1, 9, 16, 100].' },
      { input: '5\n-7 -3 2 3 11', expectedOutput: '4 9 9 49 121', explanation: 'Squares sorted.' },
    ],
    hiddenCases: [
      { input: '1\n-5' },
      { input: '3\n-3 -2 -1' },
      { input: '3\n1 2 3' },
      { input: '6\n-10 -5 0 2 4 8' },
      { input: '4\n-2 -2 2 2' },
      { input: '5\n0 0 0 0 0' },
      { input: '7\n-6 -4 -2 0 1 3 5' },
      { input: '4\n-100 0 50 100' },
    ],
    solutionCode: `
import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    nums = [int(x) for x in data[1:1+n]]
    
    result = [0] * n
    left, right = 0, n - 1
    pos = n - 1
    
    while left <= right:
        sq_left = nums[left] * nums[left]
        sq_right = nums[right] * nums[right]
        if sq_left > sq_right:
            result[pos] = sq_left
            left += 1
        else:
            result[pos] = sq_right
            right -= 1
        pos -= 1
        
    print(' '.join(map(str, result)))

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: 'Two pointers from both ends filling the result array backwards from highest to lowest square in O(N) time.',
      timeComplexity: 'O(N)',
      spaceComplexity: 'O(N)',
    },
  },

  // --------------------------------------------------------------------------
  // cv128: Arrays & Two Pointers - Container With Most Water (MEDIUM)
  // --------------------------------------------------------------------------
  {
    id: 'cv128',
    slug: 'container-with-most-liquid',
    title: 'The Great Channel Reservoir Span',
    difficulty: 'MEDIUM',
    topics: ['Arrays & Two Pointers'],
    timeLimitMs: 1000,
    memoryLimitKb: 262144,
    statement: `You are given an integer array Height of length N. There are N vertical lines drawn such that the two endpoints of the i-th line are (i, 0) and (i, Height[i]).

Find two lines that together with the x-axis form a container, such that the container contains the most water.
Print the maximum area of water the container can store.`,
    inputFormat: 'First line: Integer N.\nSecond line: N space-separated integers.',
    outputFormat: 'Print the maximum area.',
    constraints: '2 <= N <= 100000\n0 <= Height[i] <= 10^4',
    sampleCases: [
      { input: '9\n1 8 6 2 5 4 8 3 7', expectedOutput: '49', explanation: 'Lines at index 1 (height 8) and index 8 (height 7) form area 7 * (8 - 1) = 49.' },
      { input: '2\n1 1', expectedOutput: '1', explanation: 'Area: min(1, 1) * 1 = 1.' },
    ],
    hiddenCases: [
      { input: '5\n4 3 2 1 4' },
      { input: '3\n1 2 1' },
      { input: '5\n5 4 3 2 1' },
      { input: '6\n1 100 2 2 100 1' },
      { input: '4\n1 2 4 3' },
      { input: '7\n2 3 4 5 18 17 6' },
      { input: '5\n10 10 10 10 10' },
      { input: '3\n10 1 10' },
    ],
    solutionCode: `
import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    h = [int(x) for x in data[1:1+n]]
    
    left, right = 0, n - 1
    max_area = 0
    
    while left < right:
        area = min(h[left], h[right]) * (right - left)
        if area > max_area:
            max_area = area
        if h[left] < h[right]:
            left += 1
        else:
            right -= 1
            
    print(max_area)

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: 'Two-pointer greedy technique starting at widest boundaries, always shifting the shorter vertical line inward.',
      timeComplexity: 'O(N)',
      spaceComplexity: 'O(1)',
    },
  },

  // --------------------------------------------------------------------------
  // cv129: Arrays & Two Pointers - Subarrays with K Distinct (HARD)
  // --------------------------------------------------------------------------
  {
    id: 'cv129',
    slug: 'subarrays-with-k-different-integers',
    title: 'The Harmonic Segment K-Color Harmony',
    difficulty: 'HARD',
    topics: ['Arrays & Two Pointers'],
    timeLimitMs: 1500,
    memoryLimitKb: 262144,
    statement: `Given an integer array nums and an integer K, return the number of good contiguous subarrays of nums.
A good subarray is a subarray that has exactly K different integers.`,
    inputFormat: 'First line: Two integers N and K.\nSecond line: N space-separated integers.',
    outputFormat: 'Print the count of good subarrays.',
    constraints: '1 <= N <= 50000\n1 <= K <= N\n1 <= nums[i] <= N',
    sampleCases: [
      { input: '5 2\n1 2 1 2 3', expectedOutput: '7', explanation: 'Subarrays: [1,2], [2,1], [1,2], [2,3], [1,2,1], [2,1,2], [1,2,1,2].' },
      { input: '5 3\n1 2 1 3 4', expectedOutput: '3', explanation: '[1,2,1,3], [2,1,3], [1,3,4].' },
    ],
    hiddenCases: [
      { input: '1 1\n1' },
      { input: '4 1\n1 1 1 1' },
      { input: '4 4\n1 2 3 4' },
      { input: '6 2\n1 2 1 3 4 2' },
      { input: '5 1\n1 2 3 4 5' },
      { input: '7 3\n2 1 2 1 2 3 4' },
      { input: '6 3\n1 2 3 1 2 3' },
      { input: '8 2\n1 1 2 2 3 3 4 4' },
    ],
    solutionCode: `
import sys
from collections import defaultdict

def at_most_k(nums, k):
    if k <= 0:
        return 0
    count = defaultdict(int)
    left = 0
    res = 0
    distinct = 0
    for right, val in enumerate(nums):
        if count[val] == 0:
            distinct += 1
        count[val] += 1
        
        while distinct > k:
            count[nums[left]] -= 1
            if count[nums[left]] == 0:
                distinct -= 1
            left += 1
        res += (right - left + 1)
    return res

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    k = int(data[1])
    nums = [int(x) for x in data[2:2+n]]
    
    ans = at_most_k(nums, k) - at_most_k(nums, k - 1)
    print(ans)

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: 'Exact(K) = AtMost(K) - AtMost(K - 1) using sliding window with frequency dictionary.',
      timeComplexity: 'O(N)',
      spaceComplexity: 'O(N)',
    },
  },

  // --------------------------------------------------------------------------
  // cv130: Arrays & Two Pointers - Partition Labels (MEDIUM)
  // --------------------------------------------------------------------------
  {
    id: 'cv130',
    slug: 'partition-labels-disjoint-intervals',
    title: 'The Codex Scribe Chapter Partition',
    difficulty: 'MEDIUM',
    topics: ['Arrays & Two Pointers'],
    timeLimitMs: 1000,
    memoryLimitKb: 262144,
    statement: `You are given a string S of lowercase English letters.
Partition the string into as many parts as possible such that each letter appears in at most one part.

Print the sizes of these parts as space-separated integers.`,
    inputFormat: 'A single string S.',
    outputFormat: 'Print the space-separated partition lengths.',
    constraints: '1 <= len(S) <= 100000',
    sampleCases: [
      { input: 'ababcbacadefegdehijhklij', expectedOutput: '9 7 8', explanation: 'Partitions: "ababcbaca" (9), "defegde" (7), "hijhklij" (8).' },
      { input: 'eccbbbbdec', expectedOutput: '10', explanation: 'All characters must remain in a single partition.' },
    ],
    hiddenCases: [
      { input: 'a' },
      { input: 'abcdef' },
      { input: 'aaaaa' },
      { input: 'abcab' },
      { input: 'qiejxqfnqceydmys' },
      { input: 'caedbdedda' },
      { input: 'vhaflatebhykqrmuvg' },
      { input: 'zzzzzz' },
    ],
    solutionCode: `
import sys

def solve():
    s = sys.stdin.read().strip()
    if not s:
        return
        
    last = {char: i for i, char in enumerate(s)}
    
    start, end = 0, 0
    ans = []
    
    for i, char in enumerate(s):
        end = max(end, last[char])
        if i == end:
            ans.append(end - start + 1)
            start = i + 1
            
    print(' '.join(map(str, ans)))

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: 'Greedy intervals: map each character to its last occurrence index. Expand end bound to max last occurrence of all seen characters.',
      timeComplexity: 'O(N)',
      spaceComplexity: 'O(Sigma) = O(26)',
    },
  },

  // --------------------------------------------------------------------------
  // cv131: Arrays & Two Pointers - Remove Duplicates at Most Twice (EASY)
  // --------------------------------------------------------------------------
  {
    id: 'cv131',
    slug: 'remove-duplicates-sorted-array-two',
    title: 'The Inventory Quota Redundancy Filter',
    difficulty: 'EASY',
    topics: ['Arrays & Two Pointers'],
    timeLimitMs: 1000,
    memoryLimitKb: 262144,
    statement: `Given an integer array nums sorted in non-decreasing order, remove some duplicates in-place such that each unique element appears at most twice. The relative order of the elements should be kept the same.

Print the new length K, followed by the first K elements on the second line.`,
    inputFormat: 'First line: Integer N.\nSecond line: N space-separated integers in non-decreasing order.',
    outputFormat: 'First line: Integer K (new length).\nSecond line: K space-separated integers.',
    constraints: '1 <= N <= 50000\n-10^4 <= nums[i] <= 10^4',
    sampleCases: [
      { input: '6\n1 1 1 2 2 3', expectedOutput: '5\n1 1 2 2 3', explanation: 'New length is 5 with elements [1, 1, 2, 2, 3].' },
      { input: '9\n0 0 1 1 1 1 2 3 3', expectedOutput: '7\n0 0 1 1 2 3 3', explanation: 'New length 7.' },
    ],
    hiddenCases: [
      { input: '1\n1' },
      { input: '2\n1 1' },
      { input: '3\n1 1 1' },
      { input: '4\n2 2 2 2' },
      { input: '5\n1 2 3 4 5' },
      { input: '7\n-3 -3 -3 -2 -1 -1 -1' },
      { input: '6\n5 5 5 10 10 10' },
      { input: '8\n0 0 0 0 1 1 1 1' },
    ],
    solutionCode: `
import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    nums = [int(x) for x in data[1:1+n]]
    
    if n <= 2:
        print(n)
        print(' '.join(map(str, nums)))
        return
        
    k = 2
    for i in range(2, n):
        if nums[i] != nums[k - 2]:
            nums[k] = nums[i]
            k += 1
            
    print(k)
    print(' '.join(map(str, nums[:k])))

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: 'Two pointers: write index k advances when nums[i] != nums[k - 2], guaranteeing no element appears more than twice.',
      timeComplexity: 'O(N)',
      spaceComplexity: 'O(1)',
    },
  },

  // --------------------------------------------------------------------------
  // cv132: Arrays & Two Pointers - Longest Repeating Character Replacement (MEDIUM)
  // --------------------------------------------------------------------------
  {
    id: 'cv132',
    slug: 'longest-repeating-character-replacement',
    title: 'The Alchemical Transmutation Run Length',
    difficulty: 'MEDIUM',
    topics: ['Arrays & Two Pointers'],
    timeLimitMs: 1000,
    memoryLimitKb: 262144,
    statement: `You are given a string S consisting of uppercase English letters and an integer K.
You can choose any character of the string and change it to any other uppercase English character. You can perform this operation at most K times.

Return the length of the longest substring containing the same letter you can get after performing the above operations.`,
    inputFormat: 'First line: String S.\nSecond line: Integer K.',
    outputFormat: 'Print the maximum length.',
    constraints: '1 <= len(S) <= 100000\n0 <= K <= len(S)',
    sampleCases: [
      { input: 'ABAB\n2', expectedOutput: '4', explanation: 'Replace two \'A\'s with \'B\'s or vice versa to get "BBBB" or "AAAA" of length 4.' },
      { input: 'AABABBA\n1', expectedOutput: '4', explanation: 'Replace the middle \'A\' with \'B\' to get "AABBBBA" containing "BBBB" of length 4.' },
    ],
    hiddenCases: [
      { input: 'A\n0' },
      { input: 'AAAA\n2' },
      { input: 'ABBB\n2' },
      { input: 'ABCDE\n1' },
      { input: 'KRSCDCSONAJNHLBMDQGIFCPEK\n4' },
      { input: 'ABAA\n0' },
      { input: 'BAAAB\n2' },
      { input: 'BAAA\n0' },
    ],
    solutionCode: `
import sys
from collections import defaultdict

def solve():
    lines = sys.stdin.read().split()
    if not lines:
        return
    s = lines[0]
    k = int(lines[1])
    
    count = defaultdict(int)
    max_freq = 0
    left = 0
    ans = 0
    
    for right, char in enumerate(s):
        count[char] += 1
        max_freq = max(max_freq, count[char])
        
        # If number of replacements needed > k, shrink window
        if (right - left + 1) - max_freq > k:
            count[s[left]] -= 1
            left += 1
            
        ans = max(ans, right - left + 1)
        
    print(ans)

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: 'Sliding window: keep window valid such that window_size - max_frequency <= K.',
      timeComplexity: 'O(N)',
      spaceComplexity: 'O(26)',
    },
  },
];

console.log(`Writing Batch 6 (${problems.length} problems)...`);
problems.forEach((p) => {
  console.log(`Generating: ${p.id}`);
  createProblem(p);
});
console.log('✅ Batch 6 written successfully!');
