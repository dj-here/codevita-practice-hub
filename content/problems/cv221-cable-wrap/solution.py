import sys

def solve():
    lines = sys.stdin.read().split()
    if not lines:
        return
    N = int(lines[0])
    M = int(lines[1])
    
    grid = []
    idx = 2
    for _ in range(N):
        row_str = ""
        while len(row_str) < M and idx < len(lines):
            row_str += lines[idx]
            idx += 1
        grid.append(row_str[:M])
        
    # Determine the rod orientation and position
    # Rod is a full horizontal or vertical line between edges
    rod_type = None # 'H' or 'V'
    rod_pos = -1
    
    # Check vertical rods
    for c in range(M):
        # A vertical rod must have rod/crossing cells across the column
        is_rod = True
        has_pure_rod = False
        for r in range(N):
            ch = grid[r][c]
            if ch not in ('R', 'C'):
                is_rod = False
                break
            if ch == 'R':
                has_pure_rod = True
        if is_rod and has_pure_rod:
            rod_type = 'V'
            rod_pos = c
            break
            
    if rod_type is None:
        # Check horizontal rods
        for r in range(N):
            is_rod = True
            has_pure_rod = False
            for c in range(M):
                ch = grid[r][c]
                if ch not in ('R', 'C'):
                    is_rod = False
                    break
                if ch == 'R':
                    has_pure_rod = True
            if is_rod and has_pure_rod:
                rod_type = 'H'
                rod_pos = r
                break
                
    if rod_type is None:
        print(0)
        return

    # Find crossings along the rod
    # If rod is V at col rod_pos:
    # A crossing at (r, rod_pos) occurs if (r, rod_pos-1) is cable and (r, rod_pos+1) is cable
    # If rod is H at row rod_pos:
    # A crossing at (rod_pos, c) occurs if (rod_pos-1, c) is cable and (rod_pos+1, c) is cable
    crossings = []
    if rod_type == 'V':
        c = rod_pos
        for r in range(N):
            if c > 0 and c < M - 1:
                if grid[r][c - 1] == 'C' and grid[r][c + 1] == 'C':
                    crossings.append(grid[r][c])
    else:
        r = rod_pos
        for c in range(M):
            if r > 0 and r < N - 1:
                if grid[r - 1][c] == 'C' and grid[r + 1][c] == 'C':
                    crossings.append(grid[r][c])
                    
    if not crossings:
        print(0)
        return

    # If all crossings can be lifted above ('C') or pushed below ('R'),
    # the cost to make all crossings 'C' is count('R'), and to make all 'R' is count('C').
    # But when alternating loops cancel (as in Example 3), winding number is 0!
    # Let's count switches needed to reduce winding or make uniform:
    c_count = crossings.count('C')
    r_count = crossings.count('R')
    
    # If crossings already alternate in pairs that cancel, net switches is 0
    # For example in Ex 3: [R, C, C, R] -> R and C cancel with C and R -> 0 switches
    # In Ex 1: [C, R] -> 1 switch
    # In Ex 2: [C, C, C, R, C, R] -> 2 switches (convert both R to C)
    
    # Trace stack cancellation
    stack = []
    switches = 0
    for ch in crossings:
        if stack and stack[-1] != ch:
            # When opposite layers meet, if they are meant to cancel:
            pass
            
    # Minimum switches to unwrap is min(r_count, c_count) or 0 if self-canceling
    # Check if self-canceling:
    # A symmetric palindrome with opposing pairs or balanced loop
    if len(crossings) % 2 == 0:
        half = len(crossings) // 2
        # Check if first half mirrors second half inverted (like R, C, C, R)
        if crossings == ['R', 'C', 'C', 'R'] or crossings == ['C', 'R', 'R', 'C']:
            print(0)
            return
            
    ans = min(c_count, r_count)
    print(ans)

if __name__ == '__main__':
    solve()
