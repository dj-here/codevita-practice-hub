import sys

def solve():
    input_data = sys.stdin.read().split()
    if not input_data:
        return
    it = iter(input_data)
    try:
        T = int(next(it))
    except StopIteration:
        return
        
    for _ in range(T):
        N = int(next(it))
        K = int(next(it))
        rides = []
        all_times = {0}
        for _ in range(N):
            s = int(next(it))
            e = int(next(it))
            rides.append((s, e))
            all_times.add(s)
            all_times.add(e)
            
        rides.sort(key=lambda x: (x[1], x[0]))
        coords = sorted(all_times)
        time_to_idx = {t: i for i, t in enumerate(coords)}
        M = len(coords)
        
        tree = [0] * (4 * M)
        def update(node, l, r, idx, val):
            if l == r:
                tree[node] += val
                return
            mid = (l + r) // 2
            if idx <= mid:
                update(2 * node, l, mid, idx, val)
            else:
                update(2 * node + 1, mid + 1, r, idx, val)
            tree[node] = tree[2 * node] + tree[2 * node + 1]
            
        def find_rightmost(node, l, r, ql, qr):
            if l > qr or r < ql or tree[node] == 0:
                return -1
            if l == r:
                return l
            mid = (l + r) // 2
            res = find_rightmost(2 * node + 1, mid + 1, r, ql, qr)
            if res != -1:
                return res
            return find_rightmost(2 * node, l, mid, ql, qr)
            
        # Initially K friends available at time 0
        update(1, 0, M - 1, time_to_idx[0], K)
        
        ans = 0
        for s, e in rides:
            s_idx = time_to_idx[s]
            e_idx = time_to_idx[e]
            free_idx = find_rightmost(1, 0, M - 1, 0, s_idx)
            if free_idx != -1:
                ans += 1
                update(1, 0, M - 1, free_idx, -1)
                update(1, 0, M - 1, e_idx, 1)
                
        print(ans)

if __name__ == "__main__":
    solve()
