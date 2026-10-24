import sys

def solve():
    lines = sys.stdin.read().split()
    if not lines:
        return
        
    rows = [set() for _ in range(9)]
    cols = [set() for _ in range(9)]
    boxes = [set() for _ in range(9)]
    
    for r in range(9):
        for c in range(9):
            val = lines[r * 9 + c]
            if val != '.':
                b = (r // 3) * 3 + (c // 3)
                if val in rows[r] or val in cols[c] or val in boxes[b]:
                    print("INVALID")
                    return
                rows[r].add(val)
                cols[c].add(val)
                boxes[b].add(val)
                
    print("VALID")

if __name__ == '__main__':
    solve()
