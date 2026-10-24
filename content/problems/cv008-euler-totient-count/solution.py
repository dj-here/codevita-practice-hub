import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    ans = n
    p = 2
    temp = n
    while p * p <= temp:
        if temp % p == 0:
            while temp % p == 0:
                temp //= p
            ans -= ans // p
        p += 1
    if temp > 1:
        ans -= ans // temp
    print(ans)

if __name__ == '__main__':
    solve()
