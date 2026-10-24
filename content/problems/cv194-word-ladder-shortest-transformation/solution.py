import sys
from collections import deque

def solve():
    data = sys.stdin.read().split()
    if len(data) < 4:
        return
    begin_word = data[0]
    end_word = data[1]
    k = int(data[2])
    word_set = set(data[3:3+k])
    
    if end_word not in word_set:
        print(0)
        return
        
    q = deque([(begin_word, 1)])
    visited = {begin_word}
    
    alpha = 'abcdefghijklmnopqrstuvwxyz'
    L = len(begin_word)
    
    while q:
        curr, steps = q.popleft()
        if curr == end_word:
            print(steps)
            return
            
        for i in range(L):
            orig_char = curr[i]
            for c in alpha:
                if c == orig_char:
                    continue
                nxt = curr[:i] + c + curr[i+1:]
                if nxt in word_set and nxt not in visited:
                    visited.add(nxt)
                    q.append((nxt, steps + 1))
                    
    print(0)

if __name__ == '__main__':
    solve()
