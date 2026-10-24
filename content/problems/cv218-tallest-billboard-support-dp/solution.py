import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    rods = [int(x) for x in data[1:1+n]]
    
    # dp[diff] = max height of the shorter rod
    dp = {0: 0}
    
    for r in rods:
        curr = dict(dp)
        for diff, shorter in curr.items():
            # Option 1: add to taller rod
            d1 = diff + r
            dp[d1] = max(dp.get(d1, 0), shorter)
            
            # Option 2: add to shorter rod
            d2 = abs(diff - r)
            s2 = shorter + min(diff, r)
            dp[d2] = max(dp.get(d2, 0), s2)
            
    print(dp.get(0, 0))

if __name__ == '__main__':
    solve()
