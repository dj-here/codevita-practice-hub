import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    target = int(data[1])
    arr = [int(x) for x in data[2:2+n]]
    
    if target == 0:
        print("YES")
        return
        
    found = False
    def backtrack(idx, current_sum):
        nonlocal found
        if found:
            return
        if current_sum == target:
            found = True
            return
        if idx == n or current_sum > target:
            return
            
        # Include arr[idx]
        backtrack(idx + 1, current_sum + arr[idx])
        # Exclude arr[idx]
        backtrack(idx + 1, current_sum)

    backtrack(0, 0)
    print("YES" if found else "NO")

if __name__ == '__main__':
    solve()
