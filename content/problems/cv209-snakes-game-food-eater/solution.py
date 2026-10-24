import sys
from collections import deque

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    m = int(data[1])
    f = int(data[2])
    
    foods = []
    idx = 3
    for _ in range(f):
        foods.append((int(data[idx]), int(data[idx+1])))
        idx += 2
        
    k = int(data[idx])
    idx += 1
    moves = data[idx:idx+k]
    
    dirs = {'U': (-1, 0), 'D': (1, 0), 'L': (0, -1), 'R': (0, 1)}
    
    snake = deque([(0, 0)])
    snake_set = {(0, 0)}
    score = 0
    food_idx = 0
    
    for move in moves:
        dr, dc = dirs[move]
        hr, hc = snake[0]
        nr, nc = hr + dr, hc + dc
        
        # Out of bounds
        if nr < 0 or nr >= n or nc < 0 or nc >= m:
            print(-1)
            return
            
        # Check if eating food
        if food_idx < f and foods[food_idx] == (nr, nc):
            score += 1
            food_idx += 1
            # Tail is not removed
        else:
            tail = snake.pop()
            snake_set.remove(tail)
            
        # Self collision
        if (nr, nc) in snake_set:
            print(-1)
            return
            
        snake.appendleft((nr, nc))
        snake_set.add((nr, nc))
        
    print(score)

if __name__ == '__main__':
    solve()
