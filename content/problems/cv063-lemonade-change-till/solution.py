import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    bills = [int(x) for x in data[1:n+1]]
    
    five = 0
    ten = 0
    for b in bills:
        if b == 5:
            five += 1
        elif b == 10:
            if five == 0:
                print("NO")
                return
            five -= 1
            ten += 1
        else: # 20
            # Prefer giving 10 + 5 over 5 + 5 + 5
            if ten > 0 and five > 0:
                ten -= 1
                five -= 1
            elif five >= 3:
                five -= 3
            else:
                print("NO")
                return
    print("YES")

if __name__ == '__main__':
    solve()
