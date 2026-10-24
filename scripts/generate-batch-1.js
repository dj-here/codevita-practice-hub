const fs = require('fs');
const path = require('path');

const { createProblem } = require('./problem-helper');

function writeProblem(data) {
  console.log('Generating:', data.id);
  createProblem(data);
}

// ============================================================================
// BATCH 1: PROBLEMS 001 - 022
// Number Theory & Primes (cv001 - cv011)
// Arrays & Two Pointers  (cv012 - cv022)
// ============================================================================

const batch1 = [
  // --------------------------------------------------------------------------
  // cv001: Number Theory - Divisor Strength (EASY)
  // --------------------------------------------------------------------------
  {
    id: 'cv001',
    slug: 'divisor-strength',
    title: 'The Divisor Strength of Vaults',
    difficulty: 'EASY',
    topics: ['Number Theory & Primes'],
    timeLimitMs: 1000,
    memoryLimitKb: 262144,
    statement: `In an ancient treasury, each vault door is labeled with an integer N. The security strength of the vault is defined as the total number of positive integer divisors of N. For instance, vault 12 has 6 divisors: 1, 2, 3, 4, 6, 12.

Given an integer N, calculate the total divisor strength of the vault door.`,
    inputFormat: 'A single integer N.',
    outputFormat: 'Print a single integer representing the count of positive divisors of N.',
    constraints: '1 <= N <= 10^9',
    sampleCases: [
      { input: '12', expectedOutput: '6', explanation: 'Divisors of 12 are 1, 2, 3, 4, 6, 12 (count = 6).' },
      { input: '7', expectedOutput: '2', explanation: '7 is prime, divisors are 1 and 7 (count = 2).' },
      { input: '1', expectedOutput: '1', explanation: '1 has only 1 divisor.' },
    ],
    hiddenCases: [
      { input: '16', expectedOutput: '5' },
      { input: '100', expectedOutput: '9' },
      { input: '997', expectedOutput: '2' },
      { input: '1000000', expectedOutput: '49' },
      { input: '999999999', expectedOutput: '20' },
      { input: '1000000000', expectedOutput: '100' },
      { input: '360', expectedOutput: '24' },
      { input: '840', expectedOutput: '32' },
    ],
    solutionCode: `
import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    count = 0
    d = 1
    while d * d <= n:
        if n % d == 0:
            count += 1
            if d * d != n:
                count += 1
        d += 1
    print(count)

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: 'Iterate from d = 1 up to sqrt(N). For every divisor d, if N % d == 0, add 1. If d != N // d, also add the paired divisor.',
      timeComplexity: 'O(sqrt(N))',
      spaceComplexity: 'O(1)',
    },
  },

  // --------------------------------------------------------------------------
  // cv002: Number Theory - Co-Prime Pairs in Range (MEDIUM)
  // --------------------------------------------------------------------------
  {
    id: 'cv002',
    slug: 'coprime-harvest',
    title: 'Co-Prime Harvest Season',
    difficulty: 'MEDIUM',
    topics: ['Number Theory & Primes'],
    timeLimitMs: 1500,
    memoryLimitKb: 262144,
    statement: `A botanist organizes crop seeds numbered between L and R inclusive. Two seed batches (A, B) with A < B can be cross-pollinated if and only if they are co-prime, meaning their greatest common divisor gcd(A, B) = 1.

Given range limits L and R, count how many valid pairs (A, B) with L <= A < B <= R can cross-pollinate.`,
    inputFormat: 'Two space-separated integers L and R.',
    outputFormat: 'Print the total count of co-prime pairs (A, B) with L <= A < B <= R.',
    constraints: '1 <= L < R <= 1000, (R - L) <= 500',
    sampleCases: [
      { input: '2 5', expectedOutput: '5', explanation: 'Pairs: (2,3), (2,5), (3,4), (3,5), (4,5) are all co-prime. (2,4) has gcd 2.' },
      { input: '1 3', expectedOutput: '3', explanation: 'Pairs: (1,2), (1,3), (2,3) are all co-prime.' },
    ],
    hiddenCases: [
      { input: '10 20', expectedOutput: '39' },
      { input: '1 10', expectedOutput: '31' },
      { input: '50 70', expectedOutput: '131' },
      { input: '100 150', expectedOutput: '787' },
      { input: '900 950', expectedOutput: '778' },
      { input: '2 100', expectedOutput: '3043' },
      { input: '1 50', expectedOutput: '750' },
      { input: '15 25', expectedOutput: '37' },
    ],
    solutionCode: `
import sys
import math

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    L, R = int(data[0]), int(data[1])
    count = 0
    for a in range(L, R):
        for b in range(a + 1, R + 1):
            if math.gcd(a, b) == 1:
                count += 1
    print(count)

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: 'Iterate all pairs (a, b) such that L <= a < b <= R. Use Euclidean algorithm (math.gcd) to test gcd(a, b) == 1 and increment the counter.',
      timeComplexity: 'O((R - L)^2 * log(R))',
      spaceComplexity: 'O(1)',
    },
  },

  // --------------------------------------------------------------------------
  // cv003: Number Theory - Modular Exponentiation Sequence (MEDIUM)
  // --------------------------------------------------------------------------
  {
    id: 'cv003',
    slug: 'modular-power-towers',
    title: 'The Alchemist Power Modulo',
    difficulty: 'MEDIUM',
    topics: ['Number Theory & Primes'],
    timeLimitMs: 1000,
    memoryLimitKb: 262144,
    statement: `An alchemist produces synthetic gold crystals in N stages. At stage i (from 1 to N), the reaction energy is (A^i) mod M.

Given integers A, N, and M, calculate the sum of energies produced across all N stages:
Total Energy = ( sum_{i=1}^N (A^i mod M) ) mod M.`,
    inputFormat: 'Three space-separated integers A, N, and M.',
    outputFormat: 'Print the total energy modulo M.',
    constraints: '1 <= A <= 10^9, 1 <= N <= 10^6, 1 <= M <= 10^9',
    sampleCases: [
      { input: '2 3 5', expectedOutput: '4', explanation: 'i=1: 2^1%5=2; i=2: 2^2%5=4; i=3: 2^3%5=3. Sum = 2+4+3 = 9. 9%5 = 4.' },
      { input: '3 4 7', expectedOutput: '5', explanation: '3^1%7=3, 3^2%7=2, 3^3%7=6, 3^4%7=4. Sum = 15. 15%7 = 1.' },
    ],
    hiddenCases: [
      { input: '5 10 13', expectedOutput: '3' },
      { input: '10 100 10007', expectedOutput: '8401' },
      { input: '7 50000 1000000007', expectedOutput: '344318721' },
      { input: '1 1000 100', expectedOutput: '0' },
      { input: '2 20 1000', expectedOutput: '820' },
      { input: '999999 50 997', expectedOutput: '25' },
      { input: '3 200000 100000007', expectedOutput: '68524419' },
      { input: '11 100000 100003', expectedOutput: '81144' },
    ],
    solutionCode: `
import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    A = int(data[0])
    N = int(data[1])
    M = int(data[2])
    
    total = 0
    curr = A % M
    for i in range(1, N + 1):
        total = (total + curr) % M
        curr = (curr * (A % M)) % M
    print(total)

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: 'Iterate from 1 to N, maintaining current power curr = (curr * A) % M and accumulating into total % M.',
      timeComplexity: 'O(N)',
      spaceComplexity: 'O(1)',
    },
  },

  // --------------------------------------------------------------------------
  // cv004: Number Theory - Prime Factor Product Difference (EASY)
  // --------------------------------------------------------------------------
  {
    id: 'cv004',
    slug: 'prime-factor-delta',
    title: 'Extreme Prime Factor Delta',
    difficulty: 'EASY',
    topics: ['Number Theory & Primes'],
    timeLimitMs: 1000,
    memoryLimitKb: 262144,
    statement: `For a given positive composite integer N, consider all of its distinct prime factors. Let P_max be the largest prime factor of N, and P_min be the smallest prime factor of N.

The prime factor delta of N is defined as (P_max - P_min). If N is prime or 1, print 0 because there are not multiple distinct prime factors.`,
    inputFormat: 'A single integer N.',
    outputFormat: 'Print the integer delta (P_max - P_min).',
    constraints: '1 <= N <= 10^9',
    sampleCases: [
      { input: '12', expectedOutput: '1', explanation: 'Prime factors of 12 are 2 and 3. Delta = 3 - 2 = 1.' },
      { input: '70', expectedOutput: '5', explanation: 'Prime factors of 70 are 2, 5, 7. Delta = 7 - 2 = 5.' },
      { input: '13', expectedOutput: '0', explanation: '13 is prime, only one distinct factor.' },
    ],
    hiddenCases: [
      { input: '1', expectedOutput: '0' },
      { input: '30', expectedOutput: '3' },
      { input: '1024', expectedOutput: '0' },
      { input: '210', expectedOutput: '5' },
      { input: '999999937', expectedOutput: '0' },
      { input: '999999990', expectedOutput: '35' },
      { input: '100000000', expectedOutput: '3' },
      { input: '15485863', expectedOutput: '0' },
    ],
    solutionCode: `
import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    if n <= 1:
        print(0)
        return
    factors = []
    d = 2
    temp = n
    while d * d <= temp:
        if temp % d == 0:
            factors.append(d)
            while temp % d == 0:
                temp //= d
        d += 1
    if temp > 1:
        factors.append(temp)
    if len(factors) <= 1:
        print(0)
    else:
        print(max(factors) - min(factors))

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: 'Find all distinct prime factors in O(sqrt(N)) by dividing out factors starting from 2. If <= 1 distinct factor, output 0, else max - min.',
      timeComplexity: 'O(sqrt(N))',
      spaceComplexity: 'O(log N)',
    },
  },

  // --------------------------------------------------------------------------
  // cv005: Number Theory - Sieve of Goldbach Pairs (MEDIUM)
  // --------------------------------------------------------------------------
  {
    id: 'cv005',
    slug: 'goldbach-partitions',
    title: 'Goldbach Unique Partitions',
    difficulty: 'MEDIUM',
    topics: ['Number Theory & Primes'],
    timeLimitMs: 1500,
    memoryLimitKb: 262144,
    statement: `Goldbach\'s conjecture states that every even integer greater than 2 can be expressed as the sum of two prime numbers.

Given an even integer N, find the count of distinct pairs of prime numbers (P1, P2) such that P1 <= P2 and P1 + P2 = N.`,
    inputFormat: 'A single even integer N.',
    outputFormat: 'Print the count of valid prime pairs (P1, P2).',
    constraints: '4 <= N <= 10^6, N is even',
    sampleCases: [
      { input: '10', expectedOutput: '2', explanation: '10 = 3 + 7 and 10 = 5 + 5 (2 distinct pairs).' },
      { input: '4', expectedOutput: '1', explanation: '4 = 2 + 2 (1 pair).' },
    ],
    hiddenCases: [
      { input: '20', expectedOutput: '2' },
      { input: '100', expectedOutput: '6' },
      { input: '1000', expectedOutput: '28' },
      { input: '50000', expectedOutput: '522' },
      { input: '100000', expectedOutput: '810' },
      { input: '500000', expectedOutput: '3034' },
      { input: '1000000', expectedOutput: '5402' },
      { input: '84', expectedOutput: '6' },
    ],
    solutionCode: `
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
`,
    editorial: {
      approach: 'Run the Sieve of Eratosthenes up to N using a compact bytearray. Then count prime p1 in [2, N//2] where N - p1 is also prime.',
      timeComplexity: 'O(N log log N)',
      spaceComplexity: 'O(N)',
    },
  },

  // --------------------------------------------------------------------------
  // cv006: Number Theory - Least Common Multiple of Array (EASY)
  // --------------------------------------------------------------------------
  {
    id: 'cv006',
    slug: 'gear-synchronization-lcm',
    title: 'Mechanical Gear Synchronization',
    difficulty: 'EASY',
    topics: ['Number Theory & Primes'],
    timeLimitMs: 1000,
    memoryLimitKb: 262144,
    statement: `A clockwork mechanism contains N rotating gears. Gear i has T[i] teeth and completes one full rotation every T[i] seconds. All gears start spinning simultaneously from position 0.

Find the minimum positive time (in seconds) when all N gears complete full rotations together at the exact same moment. Since the answer can be large, compute it modulo 1000000007.`,
    inputFormat: 'First line: Integer N.\nSecond line: N space-separated integers T[1], T[2], ..., T[N].',
    outputFormat: 'Print the LCM of the array modulo 1000000007.',
    constraints: '1 <= N <= 1000, 1 <= T[i] <= 1000',
    sampleCases: [
      { input: '3\n2 4 6', expectedOutput: '12', explanation: 'LCM(2, 4, 6) = 12.' },
      { input: '4\n3 5 7 11', expectedOutput: '1155', explanation: 'LCM(3, 5, 7, 11) = 3 * 5 * 7 * 11 = 1155.' },
    ],
    hiddenCases: [
      { input: '2\n10 15', expectedOutput: '30' },
      { input: '5\n12 18 24 30 36', expectedOutput: '360' },
      { input: '1\n997', expectedOutput: '997' },
      { input: '6\n8 9 10 12 15 18', expectedOutput: '360' },
      { input: '8\n2 3 4 5 6 7 8 9', expectedOutput: '2520' },
      { input: '10\n16 25 27 49 11 13 17 19 23 29', expectedOutput: '377626356' },
      { input: '4\n100 200 400 800', expectedOutput: '800' },
      { input: '5\n17 17 17 17 17', expectedOutput: '17' },
    ],
    solutionCode: `
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
`,
    editorial: {
      approach: 'Factor each number into prime powers and take the maximum exponent for each prime across all numbers. Compute the product modulo 10^9+7.',
      timeComplexity: 'O(N * sqrt(max(T)))',
      spaceComplexity: 'O(P) where P is number of distinct primes <= 1000',
    },
  },

  // --------------------------------------------------------------------------
  // cv007: Number Theory - Modular Inverse Cipher (HARD)
  // --------------------------------------------------------------------------
  {
    id: 'cv007',
    slug: 'modular-inverse-decoder',
    title: 'The Royal Enigma Modular Decryption',
    difficulty: 'HARD',
    topics: ['Number Theory & Primes'],
    timeLimitMs: 1500,
    memoryLimitKb: 262144,
    statement: `During a cryptographic transmission, secret numbers are encrypted with an affine transformation:
C = (A * X + B) mod P, where P is a known large prime.

The decryptor knows key A, shift B, and prime modulus P. To decrypt, one must compute:
X = ((C - B) * A^(-1)) mod P, where A^(-1) is the modular multiplicative inverse of A modulo P.

Given integers A, B, P, and a list of K ciphertext integers C[1..K], output the decrypted plaintexts X[1..K].`,
    inputFormat: 'First line: Three integers A, B, P.\nSecond line: Integer K.\nThird line: K space-separated ciphertext values.',
    outputFormat: 'Print K space-separated decrypted plaintext integers.',
    constraints: '1 <= A < P, 0 <= B < P, P is prime (up to 10^9+7), 1 <= K <= 10^5, 0 <= C[i] < P',
    sampleCases: [
      { input: '3 5 11\n3\n2 8 0', expectedOutput: '10 1 2', explanation: 'A=3, B=5, P=11. 3^(-1) mod 11 = 4. C=2: (2-5)*4 = -12 = 10 mod 11.' },
      { input: '5 0 7\n2\n3 4', expectedOutput: '2 5', explanation: '5^(-1) mod 7 = 3. C=3: 3*3=9=2. C=4: 4*3=12=5.' },
    ],
    hiddenCases: [
      { input: '2 1 13\n4\n3 5 7 9', expectedOutput: '1 2 3 4' },
      { input: '7 12 1000000007\n3\n19 26 33', expectedOutput: '1 2 3' },
      { input: '11 0 997\n3\n11 22 33', expectedOutput: '1 2 3' },
      { input: '123 456 10007\n2\n579 702', expectedOutput: '1 2' },
      { input: '1 0 999999937\n3\n10 20 30', expectedOutput: '10 20 30' },
      { input: '999999936 0 999999937\n2\n1 999999936', expectedOutput: '999999936 1' },
      { input: '17 3 101\n4\n20 37 54 71', expectedOutput: '1 2 3 4' },
      { input: '43 91 1009\n3\n134 177 220', expectedOutput: '1 2 3' },
    ],
    solutionCode: `
import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    A = int(data[0])
    B = int(data[1])
    P = int(data[2])
    K = int(data[3])
    ciphertexts = [int(x) for x in data[4:4+K]]
    
    # Fermat's Little Theorem for prime P: A^(P-2) mod P
    inv_A = pow(A, P - 2, P)
    
    plaintexts = []
    for c in ciphertexts:
        x = ((c - B) % P * inv_A) % P
        plaintexts.append(str(x))
        
    print(' '.join(plaintexts))

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: 'Compute A^(-1) mod P once using pow(A, P - 2, P) by Fermat\'s Little Theorem in O(log P). Then decrypt each ciphertext in O(1) time.',
      timeComplexity: 'O(log P + K)',
      spaceComplexity: 'O(K)',
    },
  },

  // --------------------------------------------------------------------------
  // cv008: Number Theory - Euler Totient Sum (MEDIUM)
  // --------------------------------------------------------------------------
  {
    id: 'cv008',
    slug: 'euler-totient-count',
    title: 'Euler Totient Multi-Test',
    difficulty: 'MEDIUM',
    topics: ['Number Theory & Primes'],
    timeLimitMs: 1000,
    memoryLimitKb: 262144,
    statement: `Euler\'s totient function phi(N) counts the positive integers up to N that are relatively prime to N (gcd(k, N) = 1 for 1 <= k <= N).

Given an integer N, compute phi(N).`,
    inputFormat: 'A single integer N.',
    outputFormat: 'Print the value of phi(N).',
    constraints: '1 <= N <= 10^9',
    sampleCases: [
      { input: '9', expectedOutput: '6', explanation: 'Numbers coprime to 9 are 1, 2, 4, 5, 7, 8 (total 6).' },
      { input: '12', expectedOutput: '4', explanation: 'Numbers coprime to 12 are 1, 5, 7, 11 (total 4).' },
    ],
    hiddenCases: [
      { input: '1', expectedOutput: '1' },
      { input: '2', expectedOutput: '1' },
      { input: '100', expectedOutput: '40' },
      { input: '997', expectedOutput: '996' },
      { input: '1000000', expectedOutput: '400000' },
      { input: '999999937', expectedOutput: '999999936' },
      { input: '360', expectedOutput: '96' },
      { input: '720', expectedOutput: '192' },
    ],
    solutionCode: `
import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    ans = n
    p = 2
    temp = n
    while p * p <= temp:
        if temp % p == 0:
            while temp % p == 0:
                temp //= p
            ans -= ans // p
        p += 1
    if temp > 1:
        ans -= ans // temp
    print(ans)

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: 'Factor N into primes. For each distinct prime factor p of N, multiply ans by (1 - 1/p). Runs in O(sqrt(N)).',
      timeComplexity: 'O(sqrt(N))',
      spaceComplexity: 'O(1)',
    },
  },

  // --------------------------------------------------------------------------
  // cv009: Number Theory - Trailing Zeros in Factorial (EASY)
  // --------------------------------------------------------------------------
  {
    id: 'cv009',
    slug: 'factorial-trailing-zeros',
    title: 'Astronomical Factorial Zeros',
    difficulty: 'EASY',
    topics: ['Number Theory & Primes'],
    timeLimitMs: 1000,
    memoryLimitKb: 262144,
    statement: `Astronomers calculate celestial permutations involving large factorials N! = 1 * 2 * ... * N.

Given an integer N, count the number of trailing zeros in the decimal representation of N!.`,
    inputFormat: 'A single integer N.',
    outputFormat: 'Print the count of trailing zeros in N!.',
    constraints: '1 <= N <= 10^9',
    sampleCases: [
      { input: '5', expectedOutput: '1', explanation: '5! = 120, which has 1 trailing zero.' },
      { input: '20', expectedOutput: '4', explanation: '20! has 4 trailing zeros.' },
    ],
    hiddenCases: [
      { input: '10', expectedOutput: '2' },
      { input: '25', expectedOutput: '6' },
      { input: '100', expectedOutput: '24' },
      { input: '1000', expectedOutput: '249' },
      { input: '1000000', expectedOutput: '249998' },
      { input: '1000000000', expectedOutput: '249999998' },
      { input: '1', expectedOutput: '0' },
      { input: '4', expectedOutput: '0' },
    ],
    solutionCode: `
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
`,
    editorial: {
      approach: 'Trailing zeros are produced by factors of 10 = 2 * 5. Since factors of 2 exceed factors of 5, Legendre\'s formula sums floor(N / 5^k) for k >= 1.',
      timeComplexity: 'O(log_5(N))',
      spaceComplexity: 'O(1)',
    },
  },

  // --------------------------------------------------------------------------
  // cv010: Number Theory - Perfect Number Validator (EASY)
  // --------------------------------------------------------------------------
  {
    id: 'cv010',
    slug: 'sacred-perfect-numbers',
    title: 'The Sacred Perfect Numbers',
    difficulty: 'EASY',
    topics: ['Number Theory & Primes'],
    timeLimitMs: 1000,
    memoryLimitKb: 262144,
    statement: `A number N is called "Perfect" if the sum of all its proper positive divisors (divisors strictly less than N) is equal to N itself. For example, 6 has proper divisors 1, 2, 3, and 1 + 2 + 3 = 6.

Given an integer N, print "PERFECT" if N is a perfect number, or "NOT PERFECT" otherwise.`,
    inputFormat: 'A single integer N.',
    outputFormat: 'Print "PERFECT" or "NOT PERFECT".',
    constraints: '1 <= N <= 10^9',
    sampleCases: [
      { input: '6', expectedOutput: 'PERFECT', explanation: 'Proper divisors: 1, 2, 3. Sum = 6.' },
      { input: '28', expectedOutput: 'PERFECT', explanation: 'Proper divisors: 1, 2, 4, 7, 14. Sum = 28.' },
      { input: '12', expectedOutput: 'NOT PERFECT', explanation: 'Proper divisors: 1, 2, 3, 4, 6. Sum = 16 != 12.' },
    ],
    hiddenCases: [
      { input: '1', expectedOutput: 'NOT PERFECT' },
      { input: '496', expectedOutput: 'PERFECT' },
      { input: '8128', expectedOutput: 'PERFECT' },
      { input: '33550336', expectedOutput: 'PERFECT' },
      { input: '100', expectedOutput: 'NOT PERFECT' },
      { input: '9999999', expectedOutput: 'NOT PERFECT' },
      { input: '2', expectedOutput: 'NOT PERFECT' },
      { input: '8', expectedOutput: 'NOT PERFECT' },
    ],
    solutionCode: `
import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    if n <= 1:
        print("NOT PERFECT")
        return
        
    div_sum = 1
    d = 2
    while d * d <= n:
        if n % d == 0:
            div_sum += d
            if d * d != n:
                div_sum += n // d
        d += 1
        
    if div_sum == n:
        print("PERFECT")
    else:
        print("NOT PERFECT")

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: 'Sum all divisors d from 2 up to sqrt(N) along with paired divisors N // d. Compare total proper divisor sum with N.',
      timeComplexity: 'O(sqrt(N))',
      spaceComplexity: 'O(1)',
    },
  },

  // --------------------------------------------------------------------------
  // cv011: Number Theory - Chinese Remainder Congruence (HARD)
  // --------------------------------------------------------------------------
  {
    id: 'cv011',
    slug: 'chinese-remainder-congruence',
    title: 'The Grand Astrologer Congruence',
    difficulty: 'HARD',
    topics: ['Number Theory & Primes'],
    timeLimitMs: 1500,
    memoryLimitKb: 262144,
    statement: `An astrologer observes planetary alignments repeating in cycles. There are N congruences of the form:
X = R[i] mod M[i]

All moduli M[i] are pairwise coprime. Find the smallest non-negative integer X satisfying all N congruences simultaneously (using the Chinese Remainder Theorem).`,
    inputFormat: 'First line: Integer N.\nNext N lines: Two integers R[i] and M[i].',
    outputFormat: 'Print the smallest non-negative integer X.',
    constraints: '1 <= N <= 10, 0 <= R[i] < M[i], 1 <= M[i] <= 1000, gcd(M[i], M[j]) = 1 for all i != j',
    sampleCases: [
      { input: '3\n2 3\n3 5\n2 7', expectedOutput: '23', explanation: '23 = 2 mod 3, 23 = 3 mod 5, 23 = 2 mod 7.' },
      { input: '2\n1 2\n2 3', expectedOutput: '5', explanation: '5 = 1 mod 2 and 5 = 2 mod 3.' },
    ],
    hiddenCases: [
      { input: '2\n3 5\n4 7', expectedOutput: '18' },
      { input: '3\n1 2\n1 3\n1 5', expectedOutput: '1' },
      { input: '3\n0 2\n0 3\n0 5', expectedOutput: '0' },
      { input: '4\n2 3\n3 5\n1 7\n4 11', expectedOutput: '488' },
      { input: '3\n4 5\n6 7\n10 11', expectedOutput: '384' },
      { input: '4\n1 3\n2 5\n3 7\n4 13', expectedOutput: '52' },
      { input: '2\n7 11\n11 13', expectedOutput: '139' },
      { input: '3\n1 17\n2 19\n3 23', expectedOutput: '1378' },
    ],
    solutionCode: `
import sys

def ext_gcd(a, b):
    if b == 0:
        return a, 1, 0
    g, x1, y1 = ext_gcd(b, a % b)
    x = y1
    y = x1 - (a // b) * y1
    return g, x, y

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    idx = 1
    rem = []
    mod = []
    prod = 1
    for _ in range(n):
        r = int(data[idx])
        m = int(data[idx+1])
        rem.append(r)
        mod.append(m)
        prod *= m
        idx += 2
        
    x = 0
    for i in range(n):
        m_i = prod // mod[i]
        _, inv, _ = ext_gcd(m_i, mod[i])
        x = (x + rem[i] * m_i * inv) % prod
        
    print((x % prod + prod) % prod)

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: 'Apply the Chinese Remainder Theorem: Compute M_total = product(M_i). For each congruence, compute M_i = M_total / mod[i] and its modular inverse using the Extended Euclidean Algorithm.',
      timeComplexity: 'O(N * log(max(M)))',
      spaceComplexity: 'O(N)',
    },
  },

  // --------------------------------------------------------------------------
  // cv012: Arrays - Maximum Subarray Sum (Kadane) (EASY)
  // --------------------------------------------------------------------------
  {
    id: 'cv012',
    slug: 'merchant-profit-kadane',
    title: 'The Traveling Merchant Profit Surge',
    difficulty: 'EASY',
    topics: ['Arrays & Two Pointers'],
    timeLimitMs: 1000,
    memoryLimitKb: 262144,
    statement: `A traveling merchant records the daily net profit or loss over N consecutive trading days. The merchant wants to find the maximum possible profit earned in any contiguous sequence of days (at least one day must be chosen).

Given an array of integers representing daily net changes, find the maximum contiguous subarray sum.`,
    inputFormat: 'First line: Integer N.\nSecond line: N space-separated integers.',
    outputFormat: 'Print a single integer: maximum subarray sum.',
    constraints: '1 <= N <= 10^5, -10^4 <= A[i] <= 10^4',
    sampleCases: [
      { input: '8\n-2 1 -3 4 -1 2 1 -5', expectedOutput: '6', explanation: 'Subarray [4, -1, 2, 1] gives maximum sum = 6.' },
      { input: '4\n-1 -2 -3 -4', expectedOutput: '-1', explanation: 'Single element [-1] gives the maximum sum.' },
    ],
    hiddenCases: [
      { input: '1\n100', expectedOutput: '100' },
      { input: '5\n1 2 3 4 5', expectedOutput: '15' },
      { input: '6\n5 -2 5 -2 5 -2', expectedOutput: '11' },
      { input: '7\n-5 10 -2 3 -1 4 -20', expectedOutput: '14' },
      { input: '10\n3 -1 4 -1 5 -9 2 -6 5 3', expectedOutput: '10' },
      { input: '5\n-10 -20 -30 -40 -50', expectedOutput: '-10' },
      { input: '8\n10 -5 10 -5 10 -5 10 -5', expectedOutput: '25' },
      { input: '6\n100 -200 300 -100 200 -50', expectedOutput: '400' },
    ],
    solutionCode: `
import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    arr = [int(x) for x in data[1:n+1]]
    
    max_so_far = arr[0]
    curr_max = arr[0]
    
    for i in range(1, n):
        curr_max = max(arr[i], curr_max + arr[i])
        max_so_far = max(max_so_far, curr_max)
        
    print(max_so_far)

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: 'Kadane\'s algorithm maintains the maximum subarray sum ending at index i: curr_max = max(A[i], curr_max + A[i]). Updates global max.',
      timeComplexity: 'O(N)',
      spaceComplexity: 'O(1)',
    },
  },

  // --------------------------------------------------------------------------
  // cv013: Arrays - Two Sum Target (EASY)
  // --------------------------------------------------------------------------
  {
    id: 'cv013',
    slug: 'two-sum-target',
    title: 'The Vault Weight Balance',
    difficulty: 'EASY',
    topics: ['Arrays & Two Pointers'],
    timeLimitMs: 1000,
    memoryLimitKb: 262144,
    statement: `A balance scale requires two distinct weight blocks from an inventory of N blocks such that their combined weight is exactly Target.

Given an array of N integers and a target value Target, determine whether there exist two distinct indices i != j such that A[i] + A[j] = Target. Print "YES" if such a pair exists, or "NO" otherwise.`,
    inputFormat: 'First line: Two integers N and Target.\nSecond line: N space-separated integers.',
    outputFormat: 'Print "YES" or "NO".',
    constraints: '2 <= N <= 10^5, -10^9 <= A[i], Target <= 10^9',
    sampleCases: [
      { input: '5 9\n2 7 11 15 3', expectedOutput: 'YES', explanation: '2 + 7 = 9.' },
      { input: '4 10\n1 2 3 4', expectedOutput: 'NO', explanation: 'No two numbers sum to 10.' },
    ],
    hiddenCases: [
      { input: '2 4\n2 2', expectedOutput: 'YES' },
      { input: '3 6\n3 1 2', expectedOutput: 'NO' },
      { input: '5 0\n-5 2 3 5 1', expectedOutput: 'YES' },
      { input: '6 100\n10 20 30 40 50 60', expectedOutput: 'YES' },
      { input: '4 -10\n-7 -3 2 5', expectedOutput: 'YES' },
      { input: '5 20\n10 5 3 2 1', expectedOutput: 'NO' },
      { input: '7 14\n1 3 5 7 9 11 13', expectedOutput: 'YES' },
      { input: '6 15\n1 2 4 8 16 32', expectedOutput: 'NO' },
    ],
    solutionCode: `
import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    target = int(data[1])
    arr = [int(x) for x in data[2:2+n]]
    
    seen = set()
    for x in arr:
        comp = target - x
        if comp in seen:
            print("YES")
            return
        seen.add(x)
    print("NO")

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: 'Use a hash set to track seen elements. For each x, check if Target - x exists in the set.',
      timeComplexity: 'O(N)',
      spaceComplexity: 'O(N)',
    },
  },

  // --------------------------------------------------------------------------
  // cv014: Arrays - Trapping Rain Water (MEDIUM)
  // --------------------------------------------------------------------------
  {
    id: 'cv014',
    slug: 'harvest-basin-water',
    title: 'Terrace Rainwater Harvesting',
    difficulty: 'MEDIUM',
    topics: ['Arrays & Two Pointers'],
    timeLimitMs: 1000,
    memoryLimitKb: 262144,
    statement: `An agricultural field has N contiguous vertical stone pillars of width 1. After a heavy monsoon rainfall, water is trapped between the stone pillars.

Given an elevation map where array elements represent pillar heights, compute the total units of rainwater trapped between the pillars.`,
    inputFormat: 'First line: Integer N.\nSecond line: N space-separated non-negative integers representing pillar heights.',
    outputFormat: 'Print a single integer: total trapped water units.',
    constraints: '1 <= N <= 10^5, 0 <= Height[i] <= 10^4',
    sampleCases: [
      { input: '12\n0 1 0 2 1 0 1 3 2 1 2 1', expectedOutput: '6', explanation: 'Pillars trap a total of 6 units of water.' },
      { input: '6\n4 2 0 3 2 5', expectedOutput: '9', explanation: 'Water is trapped between height 4 and 5.' },
    ],
    hiddenCases: [
      { input: '3\n2 0 2', expectedOutput: '2' },
      { input: '5\n3 0 0 0 3', expectedOutput: '9' },
      { input: '4\n1 2 3 4', expectedOutput: '0' },
      { input: '4\n4 3 2 1', expectedOutput: '0' },
      { input: '7\n5 1 2 3 4 1 5', expectedOutput: '14' },
      { input: '8\n3 1 2 4 0 1 3 2', expectedOutput: '8' },
      { input: '1\n10', expectedOutput: '0' },
      { input: '10\n2 1 5 3 1 0 4 2 3 1', expectedOutput: '11' },
    ],
    solutionCode: `
import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    height = [int(x) for x in data[1:n+1]]
    if n <= 2:
        print(0)
        return
        
    left = 0
    right = n - 1
    left_max = 0
    right_max = 0
    total = 0
    
    while left < right:
        if height[left] < height[right]:
            if height[left] >= left_max:
                left_max = height[left]
            else:
                total += left_max - height[left]
            left += 1
        else:
            if height[right] >= right_max:
                right_max = height[right]
            else:
                total += right_max - height[right]
            right -= 1
            
    print(total)

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: 'Two-pointer technique: maintain left and right pointers moving inward, tracking left_max and right_max. Water trapped at each bar is determined by min(left_max, right_max) - height[i].',
      timeComplexity: 'O(N)',
      spaceComplexity: 'O(1)',
    },
  },

  // --------------------------------------------------------------------------
  // cv015: Arrays - Container With Most Water (MEDIUM)
  // --------------------------------------------------------------------------
  {
    id: 'cv015',
    slug: 'aqueduct-maximum-volume',
    title: 'The Roman Aqueduct Container',
    difficulty: 'MEDIUM',
    topics: ['Arrays & Two Pointers'],
    timeLimitMs: 1000,
    memoryLimitKb: 262144,
    statement: `You are given an integer array Height of length N. There are N vertical lines drawn such that the two endpoints of the i-th line are (i, 0) and (i, Height[i]).

Find two lines that together with the x-axis form a container, such that the container contains the most water. Output the maximum capacity.`,
    inputFormat: 'First line: Integer N.\nSecond line: N space-separated integers.',
    outputFormat: 'Print the maximum water area.',
    constraints: '2 <= N <= 10^5, 0 <= Height[i] <= 10^4',
    sampleCases: [
      { input: '9\n1 8 6 2 5 4 8 3 7', expectedOutput: '49', explanation: 'Lines at index 1 (height 8) and index 8 (height 7) give area min(8,7) * (8 - 1) = 7 * 7 = 49.' },
      { input: '2\n1 1', expectedOutput: '1', explanation: 'Area = min(1, 1) * 1 = 1.' },
    ],
    hiddenCases: [
      { input: '4\n1 2 4 3', expectedOutput: '4' },
      { input: '5\n2 3 4 5 18', expectedOutput: '12' },
      { input: '5\n10 1 1 1 10', expectedOutput: '40' },
      { input: '6\n3 9 3 4 7 2', expectedOutput: '21' },
      { input: '4\n5 5 5 5', expectedOutput: '15' },
      { input: '7\n1 3 2 5 25 24 5', expectedOutput: '24' },
      { input: '8\n10 2 3 4 5 6 7 10', expectedOutput: '70' },
      { input: '3\n100 1 100', expectedOutput: '200' },
    ],
    solutionCode: `
import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    h = [int(x) for x in data[1:n+1]]
    
    left = 0
    right = n - 1
    max_area = 0
    
    while left < right:
        width = right - left
        area = min(h[left], h[right]) * width
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
      approach: 'Two-pointer strategy: start with widest boundary (left = 0, right = N - 1). Always advance the pointer pointing to the shorter vertical bar.',
      timeComplexity: 'O(N)',
      spaceComplexity: 'O(1)',
    },
  },

  // --------------------------------------------------------------------------
  // cv016: Arrays - Next Greater Element (MEDIUM)
  // --------------------------------------------------------------------------
  {
    id: 'cv016',
    slug: 'next-greater-element',
    title: 'The Monotonic Watchtower',
    difficulty: 'MEDIUM',
    topics: ['Arrays & Two Pointers'],
    timeLimitMs: 1000,
    memoryLimitKb: 262144,
    statement: `A sequence of N watchtowers stands along a border. For each watchtower i, the guards look to the right to find the nearest watchtower that is strictly taller than tower i.

If a taller tower exists to the right, output its height. If no such tower exists, output -1.`,
    inputFormat: 'First line: Integer N.\nSecond line: N space-separated integers.',
    outputFormat: 'Print N space-separated integers representing the Next Greater Element for each position.',
    constraints: '1 <= N <= 10^5, 1 <= Height[i] <= 10^9',
    sampleCases: [
      { input: '4\n1 3 2 4', expectedOutput: '3 4 4 -1', explanation: 'After 1: 3. After 3: 4. After 2: 4. After 4: none (-1).' },
      { input: '5\n6 8 0 1 3', expectedOutput: '8 -1 1 3 -1', explanation: 'Next greater elements to the right.' },
    ],
    hiddenCases: [
      { input: '1\n10', expectedOutput: '-1' },
      { input: '5\n5 4 3 2 1', expectedOutput: '-1 -1 -1 -1 -1' },
      { input: '5\n1 2 3 4 5', expectedOutput: '2 3 4 5 -1' },
      { input: '6\n10 3 12 4 2 9', expectedOutput: '12 12 -1 9 9 -1' },
      { input: '4\n7 7 7 7', expectedOutput: '-1 -1 -1 -1' },
      { input: '7\n4 5 2 25 7 8 20', expectedOutput: '5 25 25 -1 8 20 -1' },
      { input: '8\n13 7 6 12 10 9 15 8', expectedOutput: '15 12 12 15 15 15 -1 -1' },
      { input: '3\n100 50 101', expectedOutput: '101 101 -1' },
    ],
    solutionCode: `
import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    arr = [int(x) for x in data[1:n+1]]
    
    result = [-1] * n
    stack = []  # stores indices
    
    for i in range(n):
        while stack and arr[i] > arr[stack[-1]]:
            idx = stack.pop()
            result[idx] = arr[i]
        stack.append(i)
        
    print(' '.join(map(str, result)))

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: 'Monotonic stack: iterate through the array. Maintain a stack of indices with decreasing values. When current element exceeds stack top, pop and assign answer.',
      timeComplexity: 'O(N)',
      spaceComplexity: 'O(N)',
    },
  },

  // --------------------------------------------------------------------------
  // cv017: Arrays - Subarray Sum Equals K (MEDIUM)
  // --------------------------------------------------------------------------
  {
    id: 'cv017',
    slug: 'prefix-sum-target-k',
    title: 'The Mystic Energy Equilibrium',
    difficulty: 'MEDIUM',
    topics: ['Arrays & Two Pointers'],
    timeLimitMs: 1000,
    memoryLimitKb: 262144,
    statement: `An array of N energy crystals with positive or negative charges is arranged linearly. An archaeologist needs to find contiguous subarrays of crystals whose combined energy equals K.

Given an integer array and a target integer K, return the total number of continuous subarrays whose sum equals K.`,
    inputFormat: 'First line: Two integers N and K.\nSecond line: N space-separated integers.',
    outputFormat: 'Print the count of continuous subarrays whose sum equals K.',
    constraints: '1 <= N <= 10^5, -10^4 <= A[i] <= 10^4, -10^9 <= K <= 10^9',
    sampleCases: [
      { input: '3 2\n1 1 1', expectedOutput: '2', explanation: 'Subarrays [1, 1] at indices [0..1] and [1..2] each sum to 2.' },
      { input: '3 3\n1 2 3', expectedOutput: '2', explanation: '[1, 2] and [3] sum to 3.' },
    ],
    hiddenCases: [
      { input: '4 0\n1 -1 1 -1', expectedOutput: '4' },
      { input: '5 7\n3 4 7 2 -3', expectedOutput: '2' },
      { input: '1 5\n5', expectedOutput: '1' },
      { input: '1 5\n3', expectedOutput: '0' },
      { input: '6 6\n2 4 -2 4 2 -4', expectedOutput: '3' },
      { input: '5 -5\n-1 -2 -2 0 5', expectedOutput: '2' },
      { input: '8 5\n1 2 2 1 4 -1 2 3', expectedOutput: '5' },
      { input: '6 10\n1 2 3 4 5 6', expectedOutput: '1' },
    ],
    solutionCode: `
import sys
from collections import defaultdict

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    k = int(data[1])
    arr = [int(x) for x in data[2:2+n]]
    
    prefix_counts = defaultdict(int)
    prefix_counts[0] = 1
    curr_sum = 0
    ans = 0
    
    for x in arr:
        curr_sum += x
        ans += prefix_counts[curr_sum - k]
        prefix_counts[curr_sum] += 1
        
    print(ans)

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: 'Prefix Sums with Hash Map: curr_sum - prefix_sum = K implies prefix_sum = curr_sum - K. Maintain frequency of prefix sums.',
      timeComplexity: 'O(N)',
      spaceComplexity: 'O(N)',
    },
  },

  // --------------------------------------------------------------------------
  // cv018: Arrays - Sliding Window Maximum (HARD)
  // --------------------------------------------------------------------------
  {
    id: 'cv018',
    slug: 'sliding-window-maximum',
    title: 'Surveillance Drone Peak Detection',
    difficulty: 'HARD',
    topics: ['Arrays & Two Pointers'],
    timeLimitMs: 1500,
    memoryLimitKb: 262144,
    statement: `A surveillance drone monitors a thermal sensor array of length N. The drone operates with a sensor window of size K. As the window slides from left to right by one position at a time, calculate the maximum sensor reading in each window of size K.`,
    inputFormat: 'First line: Two integers N and K.\nSecond line: N space-separated integers.',
    outputFormat: 'Print (N - K + 1) space-separated integers representing the max in each window.',
    constraints: '1 <= K <= N <= 10^5, -10^5 <= A[i] <= 10^5',
    sampleCases: [
      { input: '8 3\n1 3 -1 -3 5 3 6 7', expectedOutput: '3 3 5 5 6 7', explanation: 'Windows: [1,3,-1]->3, [3,-1,-3]->3, [-1,-3,5]->5, [-3,5,3]->5, [5,3,6]->6, [3,6,7]->7.' },
      { input: '1 1\n1', expectedOutput: '1', explanation: 'Single element window.' },
    ],
    hiddenCases: [
      { input: '5 2\n5 4 3 2 1', expectedOutput: '5 4 3 2' },
      { input: '5 2\n1 2 3 4 5', expectedOutput: '2 3 4 5' },
      { input: '6 3\n10 10 10 10 10 10', expectedOutput: '10 10 10 10' },
      { input: '7 4\n12 1 78 90 57 89 56', expectedOutput: '90 90 90 90' },
      { input: '4 4\n4 3 2 1', expectedOutput: '4' },
      { input: '8 3\n2 5 -1 7 -3 -1 -2 2', expectedOutput: '5 7 7 7 -1 -1 2' },
      { input: '6 2\n-1 -2 -3 -4 -5 -6', expectedOutput: '-1 -2 -3 -4 -5' },
      { input: '8 3\n9 10 9 -7 -4 -8 2 -6', expectedOutput: '10 10 9 -4 -4 2' },
    ],
    solutionCode: `
import sys
from collections import deque

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    k = int(data[1])
    arr = [int(x) for x in data[2:2+n]]
    
    deq = deque()  # stores indices of useful elements in current window
    result = []
    
    for i in range(n):
        # Remove elements out of current window [i - k + 1, i]
        while deq and deq[0] < i - k + 1:
            deq.popleft()
            
        # Maintain monotonic decreasing order
        while deq and arr[deq[-1]] <= arr[i]:
            deq.pop()
            
        deq.append(i)
        
        # When window is full, append front
        if i >= k - 1:
            result.append(str(arr[deq[0]]))
            
    print(' '.join(result))

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: 'Monotonic Deque: maintain indices in decreasing order of value. The front of the deque is always the maximum element in the current window of size K.',
      timeComplexity: 'O(N)',
      spaceComplexity: 'O(K)',
    },
  },

  // --------------------------------------------------------------------------
  // cv019: Arrays - 3Sum Triplet Count (MEDIUM)
  // --------------------------------------------------------------------------
  {
    id: 'cv019',
    slug: 'triplet-zero-sum',
    title: 'The Alchemical Zero-Sum Triplet',
    difficulty: 'MEDIUM',
    topics: ['Arrays & Two Pointers'],
    timeLimitMs: 1500,
    memoryLimitKb: 262144,
    statement: `Given an integer array A of size N, find the count of unique triplets [A[i], A[j], A[k]] with i < j < k such that A[i] + A[j] + A[k] = 0.

Note: Unique triplets mean triplets with distinct values (e.g. [-1, 0, 1] is only counted once even if it can be formed by different index combinations).`,
    inputFormat: 'First line: Integer N.\nSecond line: N space-separated integers.',
    outputFormat: 'Print the count of unique triplets whose sum is 0.',
    constraints: '3 <= N <= 3000, -10^5 <= A[i] <= 10^5',
    sampleCases: [
      { input: '6\n-1 0 1 2 -1 -4', expectedOutput: '2', explanation: 'Unique triplets: [-1, -1, 2] and [-1, 0, 1].' },
      { input: '3\n0 1 1', expectedOutput: '0', explanation: 'No triplet sums to 0.' },
    ],
    hiddenCases: [
      { input: '3\n0 0 0', expectedOutput: '1' },
      { input: '7\n-2 0 1 1 2 -1 -4', expectedOutput: '3' },
      { input: '5\n1 2 3 4 5', expectedOutput: '0' },
      { input: '5\n-5 -4 -3 -2 -1', expectedOutput: '0' },
      { input: '8\n-4 -2 -2 -2 0 1 2 2', expectedOutput: '2' },
      { input: '6\n-3 1 2 0 -1 3', expectedOutput: '3' },
      { input: '9\n-6 -4 -2 0 2 4 6 8 10', expectedOutput: '5' },
      { input: '4\n0 0 0 0', expectedOutput: '1' },
    ],
    solutionCode: `
import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    nums = sorted([int(x) for x in data[1:n+1]])
    
    count = 0
    for i in range(n - 2):
        if i > 0 and nums[i] == nums[i - 1]:
            continue
        left = i + 1
        right = n - 1
        while left < right:
            s = nums[i] + nums[left] + nums[right]
            if s == 0:
                count += 1
                while left < right and nums[left] == nums[left + 1]:
                    left += 1
                while left < right and nums[right] == nums[right - 1]:
                    right -= 1
                left += 1
                right -= 1
            elif s < 0:
                left += 1
            else:
                right -= 1
                
    print(count)

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: 'Sort the array. Fix the first element A[i] and use two pointers (left and right) to find matching pairs with sum -A[i]. Skip duplicates to ensure uniqueness.',
      timeComplexity: 'O(N^2)',
      spaceComplexity: 'O(1) extra space beyond sorting',
    },
  },

  // --------------------------------------------------------------------------
  // cv020: Arrays - Product of Array Except Self (EASY)
  // --------------------------------------------------------------------------
  {
    id: 'cv020',
    slug: 'product-except-self',
    title: 'The Harmonic Array Multiplication',
    difficulty: 'EASY',
    topics: ['Arrays & Two Pointers'],
    timeLimitMs: 1000,
    memoryLimitKb: 262144,
    statement: `Given an integer array A of size N, return an array Output such that Output[i] is equal to the product of all elements of A except A[i], modulo 1000000007.

You must not use division, as modular division by zero is undefined.`,
    inputFormat: 'First line: Integer N.\nSecond line: N space-separated integers.',
    outputFormat: 'Print N space-separated integers modulo 1000000007.',
    constraints: '2 <= N <= 10^5, 0 <= A[i] <= 10^9',
    sampleCases: [
      { input: '4\n1 2 3 4', expectedOutput: '24 12 8 6', explanation: 'Output[0]=2*3*4=24, Output[1]=1*3*4=12, Output[2]=1*2*4=8, Output[3]=1*2*3=6.' },
      { input: '3\n2 3 5', expectedOutput: '15 10 6', explanation: 'Output = [15, 10, 6].' },
    ],
    hiddenCases: [
      { input: '2\n10 20', expectedOutput: '20 10' },
      { input: '5\n1 1 1 1 1', expectedOutput: '1 1 1 1 1' },
      { input: '4\n0 1 2 3', expectedOutput: '6 0 0 0' },
      { input: '4\n0 0 2 3', expectedOutput: '0 0 0 0' },
      { input: '5\n2 4 6 8 10', expectedOutput: '1920 960 640 480 384' },
      { input: '3\n1000000000 1000000000 1000000000', expectedOutput: '49 49 49' },
      { input: '6\n3 2 1 4 5 2', expectedOutput: '80 120 240 60 48 120' },
      { input: '4\n5 5 5 5', expectedOutput: '125 125 125 125' },
    ],
    solutionCode: `
import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    arr = [int(x) for x in data[1:n+1]]
    MOD = 1000000007
    
    prefix = [1] * n
    for i in range(1, n):
        prefix[i] = (prefix[i - 1] * arr[i - 1]) % MOD
        
    suffix = 1
    for i in range(n - 1, -1, -1):
        prefix[i] = (prefix[i] * suffix) % MOD
        suffix = (suffix * arr[i]) % MOD
        
    print(' '.join(map(str, prefix)))

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: 'Prefix and Suffix products: compute prefix product array where prefix[i] is the product of all elements before i. Then scan right to left multiplying by suffix product.',
      timeComplexity: 'O(N)',
      spaceComplexity: 'O(N)',
    },
  },

  // --------------------------------------------------------------------------
  // cv021: Arrays - Longest Mountain in Array (MEDIUM)
  // --------------------------------------------------------------------------
  {
    id: 'cv021',
    slug: 'longest-mountain-peak',
    title: 'The Great Mountain Range Expedition',
    difficulty: 'MEDIUM',
    topics: ['Arrays & Two Pointers'],
    timeLimitMs: 1000,
    memoryLimitKb: 262144,
    statement: `An array A has a "mountain" if there exists some index i with 0 < i < length - 1 such that:
A[0] < A[1] < ... < A[i] and A[i] > A[i+1] > ... > A[k].

The length of a mountain must be at least 3. Given an array of integers, return the length of the longest subarray that is a valid mountain. If no mountain exists, return 0.`,
    inputFormat: 'First line: Integer N.\nSecond line: N space-separated integers.',
    outputFormat: 'Print the length of the longest mountain subarray.',
    constraints: '1 <= N <= 10^5, 0 <= A[i] <= 10^5',
    sampleCases: [
      { input: '7\n2 1 4 7 3 2 5', expectedOutput: '5', explanation: 'Subarray [1, 4, 7, 3, 2] is a mountain of length 5 (peak at 7).' },
      { input: '3\n2 2 2', expectedOutput: '0', explanation: 'Flat line, no mountain.' },
    ],
    hiddenCases: [
      { input: '4\n1 2 3 4', expectedOutput: '0' },
      { input: '4\n4 3 2 1', expectedOutput: '0' },
      { input: '6\n1 3 5 4 3 2', expectedOutput: '6' },
      { input: '8\n0 1 2 3 4 5 4 3', expectedOutput: '8' },
      { input: '5\n1 2 3 2 1', expectedOutput: '5' },
      { input: '8\n1 2 1 2 3 2 1 0', expectedOutput: '6' },
      { input: '2\n1 2', expectedOutput: '0' },
      { input: '9\n1 2 3 4 5 6 7 8 9', expectedOutput: '0' },
    ],
    solutionCode: `
import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    arr = [int(x) for x in data[1:n+1]]
    if n < 3:
        print(0)
        return
        
    ans = 0
    i = 1
    while i < n - 1:
        # Check if i is a peak
        if arr[i - 1] < arr[i] > arr[i + 1]:
            left = i - 1
            while left > 0 and arr[left - 1] < arr[left]:
                left -= 1
            right = i + 1
            while right < n - 1 and arr[right] > arr[right + 1]:
                right += 1
            ans = max(ans, right - left + 1)
            i = right
        else:
            i += 1
            
    print(ans)

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: 'Find every index i that acts as a peak: A[i-1] < A[i] > A[i+1]. Expand left and right to compute mountain boundaries in linear time.',
      timeComplexity: 'O(N)',
      spaceComplexity: 'O(1)',
    },
  },

  // --------------------------------------------------------------------------
  // cv022: Arrays - Minimum Size Subarray Sum (MEDIUM)
  // --------------------------------------------------------------------------
  {
    id: 'cv022',
    slug: 'minimum-subarray-target',
    title: 'The Efficient Caravan Supplies',
    difficulty: 'MEDIUM',
    topics: ['Arrays & Two Pointers'],
    timeLimitMs: 1000,
    memoryLimitKb: 262144,
    statement: `A caravan carries resource packages represented by positive integers. To satisfy expedition requirements, a contiguous sequence of packages must have a total sum of at least Target.

Find the minimal length of a contiguous subarray whose sum is greater than or equal to Target. If no such subarray exists, return 0.`,
    inputFormat: 'First line: Two integers Target and N.\nSecond line: N space-separated positive integers.',
    outputFormat: 'Print the minimal length, or 0 if none exists.',
    constraints: '1 <= Target <= 10^9, 1 <= N <= 10^5, 1 <= A[i] <= 10^4',
    sampleCases: [
      { input: '7 6\n2 3 1 2 4 3', expectedOutput: '2', explanation: 'Subarray [4, 3] has minimal length 2 with sum 7 >= 7.' },
      { input: '4 3\n1 4 4', expectedOutput: '1', explanation: 'Single package [4] satisfies target 4.' },
      { input: '11 3\n1 1 1', expectedOutput: '0', explanation: 'Sum of all packages is 3 < 11.' },
    ],
    hiddenCases: [
      { input: '15 5\n1 2 3 4 5', expectedOutput: '5' },
      { input: '100 5\n10 20 30 40 50', expectedOutput: '3' },
      { input: '6 4\n10 2 3 4', expectedOutput: '1' },
      { input: '10 8\n2 1 5 2 3 2 1 1', expectedOutput: '4' },
      { input: '50 6\n5 10 15 20 25 30', expectedOutput: '2' },
      { input: '1000 4\n100 200 300 399', expectedOutput: '0' },
      { input: '20 7\n1 2 3 4 5 6 7', expectedOutput: '4' },
      { input: '1 5\n5 4 3 2 1', expectedOutput: '1' },
    ],
    solutionCode: `
import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    target = int(data[0])
    n = int(data[1])
    arr = [int(x) for x in data[2:2+n]]
    
    left = 0
    curr_sum = 0
    min_len = float('inf')
    
    for right in range(n):
        curr_sum += arr[right]
        while curr_sum >= target:
            min_len = min(min_len, right - left + 1)
            curr_sum -= arr[left]
            left += 1
            
    print(min_len if min_len != float('inf') else 0)

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: 'Sliding window / two pointers: expand right pointer adding to curr_sum. Whenever curr_sum >= target, update min_len and shrink from left.',
      timeComplexity: 'O(N)',
      spaceComplexity: 'O(1)',
    },
  },
];

console.log(`Writing Batch 1 (${batch1.length} problems)...`);
batch1.forEach(writeProblem);
console.log('✅ Batch 1 written successfully!');
