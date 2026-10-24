import sys

def solve():
    text = sys.stdin.read().strip()
    if not text:
        return
        
    n = len(text)
    left, right = 0, n - 1
    l_chunk, r_chunk = "", ""
    k = 0
    
    while left < right:
        l_chunk += text[left]
        r_chunk = text[right] + r_chunk
        if l_chunk == r_chunk:
            k += 2
            l_chunk = ""
            r_chunk = ""
        left += 1
        right -= 1
        
    if left == right or l_chunk != "":
        k += 1
        
    print(k)

if __name__ == '__main__':
    solve()
