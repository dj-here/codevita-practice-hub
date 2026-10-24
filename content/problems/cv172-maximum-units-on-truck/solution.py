import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    truck_size = int(data[1])
    
    boxes = []
    idx = 2
    for _ in range(n):
        num = int(data[idx])
        units = int(data[idx+1])
        boxes.append((units, num))
        idx += 2
        
    boxes.sort(reverse=True)
    
    total_units = 0
    remaining_capacity = truck_size
    
    for units, num in boxes:
        take = min(num, remaining_capacity)
        total_units += take * units
        remaining_capacity -= take
        if remaining_capacity == 0:
            break
            
    print(total_units)

if __name__ == '__main__':
    solve()
