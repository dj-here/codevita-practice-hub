import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    s = data[0]
    n = len(s)
    
    # Precompute palindrome substrings
    is_pal = [[False] * n for _ in range(n)]
    for i in range(n):
        is_pal[i][i] = True
    for length in range(2, n + 1):
        for i in range(n - length + 1):
            j = i + length - 1
            if s[i] == s[j]:
                is_pal[i][j] = (length == 2) or is_pal[i + 1][j - 1]

    count = 0
    def backtrack(start):
        nonlocal count
        if start == n:
            count += 1
            return
        for end in range(start, n):
            if is_pal[start][end]:
                backtrack(end + 1)

    backtrack(0)
    print(count)

if __name__ == '__main__':
    solve()
