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
