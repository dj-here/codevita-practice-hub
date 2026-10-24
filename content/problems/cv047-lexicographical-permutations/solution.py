import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    nums = sorted([int(x) for x in data[1:n+1]])
    
    used = [False] * n
    curr = []
    
    def backtrack():
        if len(curr) == n:
            print(' '.join(map(str, curr)))
            return
        for i in range(n):
            if not used[i]:
                used[i] = True
                curr.append(nums[i])
                backtrack()
                curr.pop()
                used[i] = False

    backtrack()

if __name__ == '__main__':
    solve()
