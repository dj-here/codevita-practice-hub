import sys

def solve():
    input_data = sys.stdin.read().split()
    if not input_data:
        return
    it = iter(input_data)
    try:
        T = int(next(it))
    except StopIteration:
        return
        
    for _ in range(T):
        N = int(next(it))
        M = int(next(it))
        countA = int(next(it))
        countB = int(next(it))
        
        # Grid satisfaction is invariant under transposition; orient M <= N
        if N < M:
            N, M = M, N
            
        memo = {}
        def dfs(pos, a, b, prev_row):
            if pos == N * M or (a == 0 and b == 0):
                return 0
            state = (pos, a, b, prev_row)
            if state in memo:
                return memo[state]
                
            c = pos % M
            
            # Option 0: Leave cell empty
            best = dfs(pos + 1, a, b, prev_row[1:] + (0,))
            
            up = prev_row[0]
            left = prev_row[-1] if c > 0 else 0
            
            # Option 1: Place Type A (base 80, -20 per neighbor)
            if a > 0:
                gain = 80
                if up == 1: gain += -40
                elif up == 2: gain += -10
                if left == 1: gain += -40
                elif left == 2: gain += -10
                best = max(best, gain + dfs(pos + 1, a - 1, b, prev_row[1:] + (1,)))
                
            # Option 2: Place Type B (base 50, +10 per neighbor)
            if b > 0:
                gain = 50
                if up == 1: gain += -10
                elif up == 2: gain += 20
                if left == 1: gain += -10
                elif left == 2: gain += 20
                best = max(best, gain + dfs(pos + 1, a, b - 1, prev_row[1:] + (2,)))
                
            memo[state] = best
            return best
            
        init_row = tuple([0] * M)
        print(dfs(0, countA, countB, init_row))

if __name__ == "__main__":
    solve()
