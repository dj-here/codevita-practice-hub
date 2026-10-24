import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        print(0)
        return
    s = data[0]
    char_map = {}
    left = 0
    max_len = 0
    
    for right in range(len(s)):
        char = s[right]
        if char in char_map and char_map[char] >= left:
            left = char_map[char] + 1
        char_map[char] = right
        max_len = max(max_len, right - left + 1)
        
    print(max_len)

if __name__ == '__main__':
    solve()
