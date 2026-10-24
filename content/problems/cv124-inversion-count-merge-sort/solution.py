import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    arr = [int(x) for x in data[1:1+n]]
    
    temp = [0] * n
    
    def merge_sort(left, right):
        if left >= right:
            return 0
        mid = (left + right) // 2
        inv_count = merge_sort(left, mid) + merge_sort(mid + 1, right)
        
        i, j, k = left, mid + 1, left
        while i <= mid and j <= right:
            if arr[i] <= arr[j]:
                temp[k] = arr[i]
                i += 1
            else:
                temp[k] = arr[j]
                inv_count += (mid - i + 1)
                j += 1
            k += 1
            
        while i <= mid:
            temp[k] = arr[i]
            i += 1
            k += 1
        while j <= right:
            temp[k] = arr[j]
            j += 1
            k += 1
            
        for idx in range(left, right + 1):
            arr[idx] = temp[idx]
            
        return inv_count
        
    print(merge_sort(0, n - 1))

if __name__ == '__main__':
    solve()
