import sys
import heapq
from collections import defaultdict

def solve():
    lines = sys.stdin.read().split()
    if not lines:
        return
    n = int(lines[0])
    words = lines[1:1+n]
    
    unique_chars = set(''.join(words))
    adj = defaultdict(set)
    in_degree = {c: 0 for c in unique_chars}
    
    for i in range(n - 1):
        w1, w2 = words[i], words[i + 1]
        min_len = min(len(w1), len(w2))
        if len(w1) > len(w2) and w1.startswith(w2):
            print("INVALID") # Prefix violation
            return
        for j in range(min_len):
            if w1[j] != w2[j]:
                if w2[j] not in adj[w1[j]]:
                    adj[w1[j]].add(w2[j])
                    in_degree[w2[j]] += 1
                break
                
    pq = [c for c in unique_chars if in_degree[c] == 0]
    heapq.heapify(pq)
    
    res = []
    while pq:
        curr = heapq.heappop(pq)
        res.append(curr)
        for nxt in adj[curr]:
            in_degree[nxt] -= 1
            if in_degree[nxt] == 0:
                heapq.heappush(pq, nxt)
                
    if len(res) == len(unique_chars):
        print(''.join(res))
    else:
        print("INVALID")

if __name__ == '__main__':
    solve()
