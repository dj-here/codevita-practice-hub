import sys

def largestRectangleArea(heights):
    stack = []
    max_area = 0
    heights.append(0)
    for i, h in enumerate(heights):
        while stack and heights[stack[-1]] > h:
            height = heights[stack.pop()]
            width = i if not stack else i - stack[-1] - 1
            max_area = max(max_area, height * width)
        stack.append(i)
    heights.pop()
    return max_area

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    R = int(data[0])
    C = int(data[1])
    grid = [data[2 + i] for i in range(R)]
    
    heights = [0] * C
    max_rect = 0
    for r in range(R):
        for c in range(C):
            if grid[r][c] == '1':
                heights[c] += 1
            else:
                heights[c] = 0
        max_rect = max(max_rect, largestRectangleArea(heights))
        
    print(max_rect)

if __name__ == '__main__':
    solve()
