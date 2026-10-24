import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    limit = int(data[1])
    people = sorted([int(x) for x in data[2:2+n]])
    
    left = 0
    right = n - 1
    boats = 0
    
    while left <= right:
        if people[left] + people[right] <= limit:
            left += 1
        right -= 1
        boats += 1
        
    print(boats)

if __name__ == '__main__':
    solve()
