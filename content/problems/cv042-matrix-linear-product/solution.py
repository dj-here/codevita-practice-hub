import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    N, M, K = int(data[0]), int(data[1]), int(data[2])
    idx = 3
    A = []
    for _ in range(N):
        A.append([int(x) for x in data[idx:idx+M]])
        idx += M
    B = []
    for _ in range(M):
        B.append([int(x) for x in data[idx:idx+K]])
        idx += K
        
    MOD = 1000000007
    C = [[0] * K for _ in range(N)]
    
    for i in range(N):
        for p in range(M):
            a_ip = A[i][p] % MOD
            for j in range(K):
                C[i][j] = (C[i][j] + a_ip * (B[p][j] % MOD)) % MOD
                
    for row in C:
        print(' '.join(map(str, row)))

if __name__ == '__main__':
    solve()
