import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    nums = sorted([int(x) for x in data[1:1+n]])
    
    subsets = []
    
    def backtrack(start, path):
        subsets.append(path[:])
        for i in range(start, n):
            if i > start and nums[i] == nums[i - 1]:
                continue
            path.append(nums[i])
            backtrack(i + 1, path)
            path.pop()
            
    backtrack(0, [])
    
    subsets.sort()
    for s in subsets:
        if len(s) == 0:
            print("EMPTY")
        else:
            print(' '.join(map(str, s)))

if __name__ == '__main__':
    solve()
