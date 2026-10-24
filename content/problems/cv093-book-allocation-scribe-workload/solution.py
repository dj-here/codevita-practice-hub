import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    m = int(data[1])
    pages = [int(x) for x in data[2:2+n]]
    
    if m > n:
        print(-1)
        return
        
    def is_feasible(max_load):
        scribes_used = 1
        curr_pages = 0
        for p in pages:
            if curr_pages + p > max_load:
                scribes_used += 1
                curr_pages = p
                if scribes_used > m:
                    return False
            else:
                curr_pages += p
        return True
        
    low = max(pages)
    high = sum(pages)
    ans = high
    
    while low <= high:
        mid = (low + high) // 2
        if is_feasible(mid):
            ans = mid
            high = mid - 1
        else:
            low = mid + 1
            
    print(ans)

if __name__ == '__main__':
    solve()
