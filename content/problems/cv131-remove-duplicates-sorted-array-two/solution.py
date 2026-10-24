import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    nums = [int(x) for x in data[1:1+n]]
    
    if n <= 2:
        print(n)
        print(' '.join(map(str, nums)))
        return
        
    k = 2
    for i in range(2, n):
        if nums[i] != nums[k - 2]:
            nums[k] = nums[i]
            k += 1
            
    print(k)
    print(' '.join(map(str, nums[:k])))

if __name__ == '__main__':
    solve()
