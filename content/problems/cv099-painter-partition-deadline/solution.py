import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    k = int(data[1])
    t = int(data[2])
    boards = [int(x) for x in data[3:3+n]]
    
    def feasible(max_len):
        painters = 1
        curr = 0
        for b in boards:
            if curr + b > max_len:
                painters += 1
                curr = b
                if painters > k:
                    return False
            else:
                curr += b
        return True
        
    low = max(boards)
    high = sum(boards)
    ans = high
    
    while low <= high:
        mid = (low + high) // 2
        if feasible(mid):
            ans = mid
            high = mid - 1
        else:
            low = mid + 1
            
    print(ans * t)

if __name__ == '__main__':
    solve()
