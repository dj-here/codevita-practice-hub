import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    c = int(data[1])
    stalls = sorted([int(x) for x in data[2:2+n]])
    
    def can_place(d):
        placed = 1
        last_pos = stalls[0]
        for pos in stalls[1:]:
            if pos - last_pos >= d:
                placed += 1
                last_pos = pos
                if placed == c:
                    return True
        return False
        
    low = 1
    high = stalls[-1] - stalls[0]
    ans = 1
    
    while low <= high:
        mid = (low + high) // 2
        if can_place(mid):
            ans = mid
            low = mid + 1
        else:
            high = mid - 1
            
    print(ans)

if __name__ == '__main__':
    solve()
