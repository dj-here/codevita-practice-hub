import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    k = int(data[1])
    nums = sorted([int(x) for x in data[2:2+n]], reverse=True)
    
    total = sum(nums)
    if total % k != 0 or nums[0] > total // k:
        print("NO")
        return
        
    target = total // k
    subset_sums = [0] * k
    
    def backtrack(idx):
        if idx == n:
            return True
        val = nums[idx]
        for i in range(k):
            if subset_sums[i] + val <= target:
                subset_sums[i] += val
                if backtrack(idx + 1):
                    return True
                subset_sums[i] -= val
            if subset_sums[i] == 0:
                break # Symmetry breaking optimization
        return False
        
    print("YES" if backtrack(0) else "NO")

if __name__ == '__main__':
    solve()
