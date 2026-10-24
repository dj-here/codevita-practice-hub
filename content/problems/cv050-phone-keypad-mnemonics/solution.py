import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        print("-1")
        return
    digits = data[0]
    if not digits:
        print("-1")
        return
        
    mapping = {
        '2': 'abc', '3': 'def', '4': 'ghi', '5': 'jkl',
        '6': 'mno', '7': 'pqrs', '8': 'tuv', '9': 'wxyz'
    }
    
    results = []
    def backtrack(idx, current):
        if idx == len(digits):
            results.append(current)
            return
        for char in mapping[digits[idx]]:
            backtrack(idx + 1, current + char)

    backtrack(0, "")
    print(' '.join(results))

if __name__ == '__main__':
    solve()
