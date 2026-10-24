import sys

def solve():
    data = sys.stdin.read().split()
    if len(data) < 2:
        return
    num1, num2 = data[0], data[1]
    if num1 == "0" or num2 == "0":
        print("0")
        return
        
    m, n = len(num1), len(num2)
    pos = [0] * (m + n)
    
    for i in range(m - 1, -1, -1):
        for j in range(n - 1, -1, -1):
            mul = int(num1[i]) * int(num2[j])
            p1 = i + j
            p2 = i + j + 1
            total = mul + pos[p2]
            
            pos[p2] = total % 10
            pos[p1] += total // 10
            
    res = "".join(map(str, pos)).lstrip("0")
    print(res if res else "0")

if __name__ == '__main__':
    solve()
