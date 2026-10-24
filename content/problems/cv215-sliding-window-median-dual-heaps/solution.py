import sys
import bisect

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    k = int(data[1])
    nums = [int(x) for x in data[2:2+n]]
    
    window = sorted(nums[:k])
    medians = []
    
    def get_med():
        if k % 2 == 1:
            return float(window[k // 2])
        else:
            return (window[k // 2 - 1] + window[k // 2]) / 2.0
            
    medians.append(f"{get_med():.1f}")
    
    for i in range(k, n):
        # Remove nums[i - k]
        rem_idx = bisect.bisect_left(window, nums[i - k])
        window.pop(rem_idx)
        # Insert nums[i]
        bisect.insort(window, nums[i])
        medians.append(f"{get_med():.1f}")
        
    print(' '.join(medians))

if __name__ == '__main__':
    solve()
