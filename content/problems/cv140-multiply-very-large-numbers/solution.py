import sys

def solve():
    lines = sys.stdin.read().split()
    if len(lines) < 2:
        return
    num1, num2 = lines[0], lines[1]
    
    if num1 == "0" or num2 == "0":
        print("0")
        return
        
    n, m = len(num1), len(num2)
    res = [0] * (n + m)
    
    for i in range(n - 1, -1, -1):
        d1 = ord(num1[i]) - ord('0')
        for j in range(m - 1, -1, -1):
            d2 = ord(num2[j]) - ord('0')
            mul = d1 * d2 + res[i + j + 1]
            res[i + j + 1] = mul % 10
            res[i + j] += mul // 10
            
    start = 0
    while start < len(res) and res[start] == 0:
        start += 1
        
    print(''.join(map(str, res[start:])))

if __name__ == '__main__':
    solve()
