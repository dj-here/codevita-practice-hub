import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    k = int(data[0])
    n = int(data[1])
    
    results = []
    
    def backtrack(start, curr_k, curr_sum, path):
        if curr_k == k:
            if curr_sum == n:
                results.append(path[:])
            return
        if curr_sum >= n:
            return
            
        for num in range(start, 10):
            if curr_sum + num > n:
                break
            path.append(num)
            backtrack(num + 1, curr_k + 1, curr_sum + num, path)
            path.pop()
            
    backtrack(1, 0, 0, [])
    
    if results:
        for r in results:
            print(' '.join(map(str, r)))
    else:
        print("NONE")

if __name__ == '__main__':
    solve()
