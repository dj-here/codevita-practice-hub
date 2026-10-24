import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    arr = [int(x) for x in data[1:n+1]]
    total_sum = sum(arr)
    target_count = n // 2
    
    min_diff = float('inf')
    def backtrack(idx, count, curr_sum):
        nonlocal min_diff
        if count == target_count:
            diff = abs(total_sum - 2 * curr_sum)
            min_diff = min(min_diff, diff)
            return
        if idx == n or (n - idx) < (target_count - count):
            return
            
        # Include arr[idx]
        backtrack(idx + 1, count + 1, curr_sum + arr[idx])
        # Exclude arr[idx]
        backtrack(idx + 1, count, curr_sum)

    backtrack(0, 0, 0)
    print(min_diff)

if __name__ == '__main__':
    solve()
