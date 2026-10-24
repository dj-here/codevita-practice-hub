import sys

def solve():
    data = sys.stdin.read().split()
    if len(data) < 2:
        return
    text = data[0]
    pattern = data[1]
    
    n = len(text)
    m = len(pattern)
    if m > n:
        print("-1")
        return
        
    # KMP preprocessing: compute LPS array
    lps = [0] * m
    length = 0
    i = 1
    while i < m:
        if pattern[i] == pattern[length]:
            length += 1
            lps[i] = length
            i += 1
        else:
            if length != 0:
                length = lps[length - 1]
            else:
                lps[i] = 0
                i += 1
                
    # Search
    matches = []
    i = 0
    j = 0
    while i < n:
        if pattern[j] == text[i]:
            i += 1
            j += 1
        if j == m:
            matches.append(str(i - m + 1))
            j = lps[j - 1]
        elif i < n and pattern[j] != text[i]:
            if j != 0:
                j = lps[j - 1]
            else:
                i += 1
                
    if matches:
        print(' '.join(matches))
    else:
        print("-1")

if __name__ == '__main__':
    solve()
