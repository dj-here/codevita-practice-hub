const { createProblem } = require('./problem-helper');

const problems = [
  // --------------------------------------------------------------------------
  // cv089: Binary Search - Search Rotated Sorted Array (MEDIUM)
  // --------------------------------------------------------------------------
  {
    id: 'cv089',
    slug: 'search-rotated-patrol-route',
    title: 'The Rotated Compass Navigation',
    difficulty: 'MEDIUM',
    topics: ['Binary Search & Sorting'],
    timeLimitMs: 1000,
    memoryLimitKb: 262144,
    statement: `An astral navigation compass contains N distinct sector coordinates sorted in strictly ascending order, but rotated at an unknown pivot index k (0 <= k < N).
For example, [0, 1, 2, 4, 5, 6, 7] might be rotated at pivot index 3 to become [4, 5, 6, 7, 0, 1, 2].

Given the rotated sector list and a target sector value T, determine the 0-based index of T in the array. If T does not exist, print -1.
Your algorithm must run in O(log N) time.`,
    inputFormat: 'First line: Two integers N and T.\nSecond line: N space-separated integers.',
    outputFormat: 'Print the 0-based index of T, or -1.',
    constraints: '1 <= N <= 50000\n-10^9 <= T, A_i <= 10^9\nAll elements are unique.',
    sampleCases: [
      { input: '7 0\n4 5 6 7 0 1 2', expectedOutput: '4', explanation: 'Target 0 is located at index 4.' },
      { input: '7 3\n4 5 6 7 0 1 2', expectedOutput: '-1', explanation: 'Target 3 does not appear in the array.' },
    ],
    hiddenCases: [
      { input: '1 5\n5' },
      { input: '1 0\n5' },
      { input: '2 1\n3 1' },
      { input: '2 3\n3 1' },
      { input: '6 4\n5 6 1 2 3 4' },
      { input: '8 8\n4 5 6 7 8 1 2 3' },
      { input: '5 10\n10 1 2 3 4' },
      { input: '7 100\n20 30 40 50 60 70 10' },
    ],
    solutionCode: `
import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    target = int(data[1])
    nums = [int(x) for x in data[2:2+n]]
    
    low, high = 0, n - 1
    ans = -1
    while low <= high:
        mid = (low + high) // 2
        if nums[mid] == target:
            ans = mid
            break
        # Left half is sorted
        if nums[low] <= nums[mid]:
            if nums[low] <= target < nums[mid]:
                high = mid - 1
            else:
                low = mid + 1
        # Right half is sorted
        else:
            if nums[mid] < target <= nums[high]:
                low = mid + 1
            else:
                high = mid - 1
                
    print(ans)

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: 'Modified binary search: at least one half of the rotated array is always monotonically sorted; check if target falls within that sorted half.',
      timeComplexity: 'O(log N)',
      spaceComplexity: 'O(1)',
    },
  },

  // --------------------------------------------------------------------------
  // cv090: Binary Search - First and Last Occurrence (EASY)
  // --------------------------------------------------------------------------
  {
    id: 'cv090',
    slug: 'find-first-last-occurrence',
    title: 'Astronomical Emission Range Finder',
    difficulty: 'EASY',
    topics: ['Binary Search & Sorting'],
    timeLimitMs: 1000,
    memoryLimitKb: 262144,
    statement: `An observatory logs N photon emission frequencies sorted in non-decreasing order.
Given a query frequency T, determine the starting and ending index (0-based) where frequency T appears in the log.
If T does not exist, print -1 -1.`,
    inputFormat: 'First line: Two integers N and T.\nSecond line: N space-separated integers in non-decreasing order.',
    outputFormat: 'Print two space-separated integers: first_index last_index.',
    constraints: '1 <= N <= 100000\n-10^9 <= T, A_i <= 10^9',
    sampleCases: [
      { input: '6 8\n5 7 7 8 8 10', expectedOutput: '3 4', explanation: 'Frequency 8 starts at index 3 and ends at index 4.' },
      { input: '6 6\n5 7 7 8 8 10', expectedOutput: '-1 -1', explanation: 'Frequency 6 is not in the array.' },
    ],
    hiddenCases: [
      { input: '1 5\n5' },
      { input: '1 4\n5' },
      { input: '5 7\n7 7 7 7 7' },
      { input: '7 2\n1 2 2 2 3 4 5' },
      { input: '8 4\n1 2 3 4 5 6 7 8' },
      { input: '4 10\n10 10 10 20' },
      { input: '6 3\n1 2 3 3 3 3' },
      { input: '5 1\n0 0 1 1 2' },
    ],
    solutionCode: `
import sys
import bisect

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    target = int(data[1])
    nums = [int(x) for x in data[2:2+n]]
    
    first = bisect.bisect_left(nums, target)
    if first == n or nums[first] != target:
        print("-1 -1")
        return
        
    last = bisect.bisect_right(nums, target) - 1
    print(f"{first} {last}")

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: 'Two binary searches: bisect_left locates first occurrence, bisect_right locates last occurrence.',
      timeComplexity: 'O(log N)',
      spaceComplexity: 'O(1)',
    },
  },

  // --------------------------------------------------------------------------
  // cv091: Binary Search - Peak Mountain Sensor Index (MEDIUM)
  // --------------------------------------------------------------------------
  {
    id: 'cv091',
    slug: 'peak-mountain-sensor-index',
    title: 'The Mountain Ridge Peak Elevation',
    difficulty: 'MEDIUM',
    topics: ['Binary Search & Sorting'],
    timeLimitMs: 1000,
    memoryLimitKb: 262144,
    statement: `A geological sensor array samples elevation values along a mountain ridge. An elevation array A of length N is guaranteed to be a "mountain array":
There exists an index i (0 < i < N - 1) such that:
A[0] < A[1] < ... < A[i - 1] < A[i] and A[i] > A[i + 1] > ... > A[N - 1].

Find the 0-based index of the peak elevation element in O(log N) time.`,
    inputFormat: 'First line: Integer N.\nSecond line: N space-separated integers forming a mountain array.',
    outputFormat: 'Print the 0-based index of the peak element.',
    constraints: '3 <= N <= 100000\n-10^9 <= A_i <= 10^9',
    sampleCases: [
      { input: '4\n0 2 1 0', expectedOutput: '1', explanation: 'Peak is at index 1 with value 2.' },
      { input: '5\n0 10 5 2 0', expectedOutput: '1', explanation: 'Peak is at index 1 with value 10.' },
    ],
    hiddenCases: [
      { input: '3\n1 3 2' },
      { input: '6\n1 2 3 4 5 1' },
      { input: '6\n1 5 4 3 2 1' },
      { input: '7\n24 69 100 99 79 78 67' },
      { input: '5\n3 4 5 1 0' },
      { input: '8\n0 1 2 3 4 3 2 1' },
      { input: '9\n10 20 30 40 50 40 30 20 10' },
      { input: '4\n1 2 3 0' },
    ],
    solutionCode: `
import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    nums = [int(x) for x in data[1:1+n]]
    
    low, high = 0, n - 1
    while low < high:
        mid = (low + high) // 2
        if nums[mid] < nums[mid + 1]:
            low = mid + 1
        else:
            high = mid
            
    print(low)

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: 'Binary search on gradient: if nums[mid] < nums[mid + 1], peak must lie strictly to the right, else to the left or at mid.',
      timeComplexity: 'O(log N)',
      spaceComplexity: 'O(1)',
    },
  },

  // --------------------------------------------------------------------------
  // cv092: Binary Search - Square Root Precision Floor (EASY)
  // --------------------------------------------------------------------------
  {
    id: 'cv092',
    slug: 'square-root-precision-floor',
    title: 'The Astronomical Integer Square Root',
    difficulty: 'EASY',
    topics: ['Binary Search & Sorting'],
    timeLimitMs: 1000,
    memoryLimitKb: 262144,
    statement: `Given a large non-negative integer N, compute and print the floor value of the square root of N (the greatest integer x such that x * x <= N).
You must not use any floating-point arithmetic or built-in sqrt functions.`,
    inputFormat: 'A single non-negative integer N.',
    outputFormat: 'Print floor(sqrt(N)).',
    constraints: '0 <= N <= 10^18',
    sampleCases: [
      { input: '4', expectedOutput: '2', explanation: '2 * 2 = 4.' },
      { input: '8', expectedOutput: '2', explanation: '2 * 2 = 4 <= 8, while 3 * 3 = 9 > 8.' },
    ],
    hiddenCases: [
      { input: '0' },
      { input: '1' },
      { input: '10' },
      { input: '1000000' },
      { input: '999999999' },
      { input: '1000000000000000000' },
      { input: '2147483647' },
      { input: '500000000000000000' },
    ],
    solutionCode: `
import sys

def solve():
    line = sys.stdin.read().strip()
    if not line:
        return
    n = int(line)
    if n <= 1:
        print(n)
        return
        
    low, high = 1, min(n, 10**9)
    ans = 1
    while low <= high:
        mid = (low + high) // 2
        if mid * mid <= n:
            ans = mid
            low = mid + 1
        else:
            high = mid - 1
            
    print(ans)

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: 'Binary search over range [1, 10^9] using pure integer multiplication to avoid floating point precision inaccuracies.',
      timeComplexity: 'O(log N)',
      spaceComplexity: 'O(1)',
    },
  },

  // --------------------------------------------------------------------------
  // cv093: Binary Search on Answer - Book Allocation Scribe Workload (HARD)
  // --------------------------------------------------------------------------
  {
    id: 'cv093',
    slug: 'book-allocation-scribe-workload',
    title: 'The Royal Library Book Copying Balance',
    difficulty: 'HARD',
    topics: ['Binary Search & Sorting'],
    timeLimitMs: 1500,
    memoryLimitKb: 262144,
    statement: `The royal library needs to copy N manuscripts with page counts P_1, P_2, ..., P_N.
There are M royal scribes available. Each scribe must be allocated a contiguous sequence of manuscripts to copy. Every manuscript must be allocated to exactly one scribe.

Determine the minimum possible value of the maximum pages assigned to any single scribe. If the number of scribes M is greater than the number of books N, print -1.`,
    inputFormat: 'First line: Two integers N and M.\nSecond line: N space-separated integers representing pages in each manuscript.',
    outputFormat: 'Print the minimized maximum workload, or -1.',
    constraints: '1 <= N <= 100000\n1 <= M <= 100000\n1 <= P_i <= 10^9',
    sampleCases: [
      { input: '4 2\n12 34 67 90', expectedOutput: '113', explanation: 'Allocation: Scribe 1 gets [12, 34, 67] (113 pages), Scribe 2 gets [90] (90 pages).' },
      { input: '3 4\n10 20 30', expectedOutput: '-1', explanation: 'More scribes than books.' },
    ],
    hiddenCases: [
      { input: '1 1\n42' },
      { input: '5 2\n10 20 30 40 50' },
      { input: '5 3\n10 20 30 40 50' },
      { input: '6 2\n15 17 20 25 30 35' },
      { input: '4 4\n5 5 5 5' },
      { input: '7 3\n1 2 3 4 5 6 7' },
      { input: '8 4\n12 25 30 45 50 60 70 80' },
      { input: '5 5\n100 200 300 400 500' },
    ],
    solutionCode: `
import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    m = int(data[1])
    pages = [int(x) for x in data[2:2+n]]
    
    if m > n:
        print(-1)
        return
        
    def is_feasible(max_load):
        scribes_used = 1
        curr_pages = 0
        for p in pages:
            if curr_pages + p > max_load:
                scribes_used += 1
                curr_pages = p
                if scribes_used > m:
                    return False
            else:
                curr_pages += p
        return True
        
    low = max(pages)
    high = sum(pages)
    ans = high
    
    while low <= high:
        mid = (low + high) // 2
        if is_feasible(mid):
            ans = mid
            high = mid - 1
        else:
            low = mid + 1
            
    print(ans)

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: 'Binary Search on Answer: monotonically test feasible maximum page limits using a greedy linear scan.',
      timeComplexity: 'O(N log(sum(P)))',
      spaceComplexity: 'O(1)',
    },
  },

  // --------------------------------------------------------------------------
  // cv094: Binary Search on Answer - Aggressive Horses Corral Distance (HARD)
  // --------------------------------------------------------------------------
  {
    id: 'cv094',
    slug: 'aggressive-horses-corral-distance',
    title: 'The Wild Stallion Stall Allocation',
    difficulty: 'HARD',
    topics: ['Binary Search & Sorting'],
    timeLimitMs: 1500,
    memoryLimitKb: 262144,
    statement: `A horse breeder has N stalls situated along a straight line at coordinates X_1, X_2, ..., X_N.
The breeder must house C aggressive wild stallions in these stalls (at most one stallion per stall).

To prevent injuries from biting and kicking, the breeder wants to assign stallions to stalls such that the minimum distance between any two stallions is as large as possible.

Find the maximum possible value of this minimum distance.`,
    inputFormat: 'First line: Two integers N and C.\nSecond line: N space-separated integers representing stall positions.',
    outputFormat: 'Print the largest possible minimum distance.',
    constraints: '2 <= N <= 100000\n2 <= C <= N\n0 <= X_i <= 10^9',
    sampleCases: [
      { input: '5 3\n1 2 8 4 9', expectedOutput: '3', explanation: 'Sorted stalls: [1, 2, 4, 8, 9]. Place stallions at 1, 4, 8 (or 9) -> min distance is 3.' },
      { input: '3 2\n1 5 10', expectedOutput: '9', explanation: 'Place at 1 and 10 -> distance 9.' },
    ],
    hiddenCases: [
      { input: '2 2\n1 100' },
      { input: '4 3\n1 3 5 7' },
      { input: '6 4\n0 3 4 7 10 9' },
      { input: '5 2\n2 4 6 8 10' },
      { input: '6 3\n2 5 7 11 15 20' },
      { input: '5 5\n1 10 20 30 40' },
      { input: '8 4\n1 2 4 8 9 13 17 25' },
      { input: '7 3\n10 20 30 40 50 60 70' },
    ],
    solutionCode: `
import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    c = int(data[1])
    stalls = sorted([int(x) for x in data[2:2+n]])
    
    def can_place(d):
        placed = 1
        last_pos = stalls[0]
        for pos in stalls[1:]:
            if pos - last_pos >= d:
                placed += 1
                last_pos = pos
                if placed == c:
                    return True
        return False
        
    low = 1
    high = stalls[-1] - stalls[0]
    ans = 1
    
    while low <= high:
        mid = (low + high) // 2
        if can_place(mid):
            ans = mid
            low = mid + 1
        else:
            high = mid - 1
            
    print(ans)

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: 'Sort stalls and binary search on the minimum inter-stall separation distance d with greedy placement verification.',
      timeComplexity: 'O(N log N + N log(max_X))',
      spaceComplexity: 'O(N)',
    },
  },

  // --------------------------------------------------------------------------
  // cv095: Sorting & Searching - Kth Smallest Element Unsorted (MEDIUM)
  // --------------------------------------------------------------------------
  {
    id: 'cv095',
    slug: 'kth-smallest-element-unsorted',
    title: 'The K-th Smallest Mineral Density',
    difficulty: 'MEDIUM',
    topics: ['Binary Search & Sorting'],
    timeLimitMs: 1500,
    memoryLimitKb: 262144,
    statement: `A mining laboratory analyzes N mineral ore samples with measured density values.
Given an integer K, determine the K-th smallest density value in the dataset (1-based index).`,
    inputFormat: 'First line: Two integers N and K.\nSecond line: N space-separated integers.',
    outputFormat: 'Print the K-th smallest value.',
    constraints: '1 <= N <= 100000\n1 <= K <= N\n-10^9 <= Density <= 10^9',
    sampleCases: [
      { input: '6 3\n7 10 4 3 20 15', expectedOutput: '7', explanation: 'Sorted: [3, 4, 7, 10, 15, 20]. 3rd smallest is 7.' },
      { input: '5 1\n12 3 5 7 19', expectedOutput: '3', explanation: 'Smallest is 3.' },
    ],
    hiddenCases: [
      { input: '1 1\n100' },
      { input: '5 5\n5 4 3 2 1' },
      { input: '7 4\n1 2 3 4 5 6 7' },
      { input: '8 6\n10 5 15 2 7 8 20 18' },
      { input: '6 2\n-5 -2 -10 0 5 10' },
      { input: '7 7\n40 10 10 30 20 50 60' },
      { input: '5 3\n10 10 10 10 10' },
      { input: '8 4\n100 -50 0 25 -10 80 40 15' },
    ],
    solutionCode: `
import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    k = int(data[1])
    nums = [int(x) for x in data[2:2+n]]
    
    nums.sort()
    print(nums[k - 1])

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: 'Sort the array and index the (K-1)-th element.',
      timeComplexity: 'O(N log N)',
      spaceComplexity: 'O(N)',
    },
  },

  // --------------------------------------------------------------------------
  // cv096: Sorting - Merge Overlapping Intervals (MEDIUM)
  // --------------------------------------------------------------------------
  {
    id: 'cv096',
    slug: 'merge-overlapping-time-intervals',
    title: 'The Astronomical Window Consolidation',
    difficulty: 'MEDIUM',
    topics: ['Binary Search & Sorting'],
    timeLimitMs: 1500,
    memoryLimitKb: 262144,
    statement: `An observatory schedules N observation intervals, where interval i is defined by [Start_i, End_i].
Because celestial telescope lenses can remain open continuously across adjacent or overlapping time frames, overlapping observation intervals can be merged into a single consolidated interval.

Given N intervals, merge all overlapping intervals and print the consolidated intervals sorted in ascending order of their start times. Two intervals [a, b] and [c, d] overlap if c <= b.`,
    inputFormat: 'First line: Integer N.\nNext N lines: Two space-separated integers Start_i and End_i.',
    outputFormat: 'Print each merged interval on a new line: Start End.',
    constraints: '1 <= N <= 50000\n0 <= Start_i <= End_i <= 10^9',
    sampleCases: [
      { input: '4\n1 3\n2 6\n8 10\n15 18', expectedOutput: '1 6\n8 10\n15 18', explanation: '[1, 3] and [2, 6] overlap into [1, 6].' },
      { input: '2\n1 4\n4 5', expectedOutput: '1 5', explanation: 'Adjacent boundary at 4 is considered overlapping.' },
    ],
    hiddenCases: [
      { input: '1\n5 10' },
      { input: '3\n1 5\n2 4\n3 6' },
      { input: '3\n1 2\n3 4\n5 6' },
      { input: '4\n1 10\n2 3\n4 5\n6 7' },
      { input: '5\n1 4\n0 2\n3 5\n8 10\n9 12' },
      { input: '4\n1 4\n2 5\n3 6\n4 7' },
      { input: '2\n1 10\n2 9' },
      { input: '5\n10 20\n0 5\n30 40\n15 25\n24 35' },
    ],
    solutionCode: `
import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    intervals = []
    idx = 1
    for _ in range(n):
        s = int(data[idx])
        e = int(data[idx+1])
        intervals.append((s, e))
        idx += 2
        
    intervals.sort()
    
    merged = []
    for s, e in intervals:
        if not merged or s > merged[-1][1]:
            merged.append([s, e])
        else:
            merged[-1][1] = max(merged[-1][1], e)
            
    for s, e in merged:
        print(f"{s} {e}")

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: 'Sort intervals by start coordinate, then iterate through updating the running end bound if overlapping.',
      timeComplexity: 'O(N log N)',
      spaceComplexity: 'O(N)',
    },
  },

  // --------------------------------------------------------------------------
  // cv097: Sorting - Sort Frequency then Value (EASY)
  // --------------------------------------------------------------------------
  {
    id: 'cv097',
    slug: 'sort-frequency-then-value',
    title: 'Artifact Frequency Distribution Order',
    difficulty: 'EASY',
    topics: ['Binary Search & Sorting'],
    timeLimitMs: 1000,
    memoryLimitKb: 262144,
    statement: `An archaeologist catalogs N excavated coin tokens with face values A_1, A_2, ..., A_N.
Sort the tokens according to their frequency:
1. Tokens with higher frequencies must appear before tokens with lower frequencies.
2. If two token values have the exact same frequency, the smaller face value must appear first.`,
    inputFormat: 'First line: Integer N.\nSecond line: N space-separated integers.',
    outputFormat: 'Print the N sorted integers separated by spaces.',
    constraints: '1 <= N <= 20000\n-10^9 <= A_i <= 10^9',
    sampleCases: [
      { input: '6\n1 1 2 2 2 3', expectedOutput: '2 2 2 1 1 3', explanation: '2 appears 3 times, 1 appears 2 times, 3 appears 1 time.' },
      { input: '5\n2 3 1 3 2', expectedOutput: '2 2 3 3 1', explanation: '2 and 3 both appear twice, so 2 comes before 3; 1 appears once.' },
    ],
    hiddenCases: [
      { input: '1\n10' },
      { input: '4\n5 5 5 5' },
      { input: '5\n5 4 3 2 1' },
      { input: '8\n4 4 5 5 6 6 7 8' },
      { input: '7\n-1 -1 -2 -2 -3 0 0' },
      { input: '6\n10 20 10 20 30 10' },
      { input: '8\n1 2 2 3 3 3 4 4' },
      { input: '5\n-10 10 -10 10 0' },
    ],
    solutionCode: `
import sys
from collections import Counter

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    nums = [int(x) for x in data[1:1+n]]
    
    freq = Counter(nums)
    # Sort key: (-frequency, value)
    sorted_nums = sorted(nums, key=lambda x: (-freq[x], x))
    print(' '.join(map(str, sorted_nums)))

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: 'Frequency map with custom 2-level sort key: primary key is -frequency (descending), secondary key is value (ascending).',
      timeComplexity: 'O(N log N)',
      spaceComplexity: 'O(N)',
    },
  },

  // --------------------------------------------------------------------------
  // cv098: Binary Search - Median of Two Sorted Arrays (HARD)
  // --------------------------------------------------------------------------
  {
    id: 'cv098',
    slug: 'median-of-two-sorted-streams',
    title: 'The Dual Celestial Stream Median',
    difficulty: 'HARD',
    topics: ['Binary Search & Sorting'],
    timeLimitMs: 1500,
    memoryLimitKb: 262144,
    statement: `Two radio telescopes record frequency signals into two sorted arrays A of size N and B of size M.
Find the median of the two combined sorted arrays.

The overall run time complexity should be O(log(min(N, M))).
Print the median formatted to exactly 1 decimal place.`,
    inputFormat: 'First line: Two integers N and M.\nSecond line: N space-separated integers (array A).\nThird line: M space-separated integers (array B).',
    outputFormat: 'Print the median formatted to 1 decimal place (e.g. 2.0 or 2.5).',
    constraints: '0 <= N, M <= 50000\n1 <= N + M <= 100000\n-10^9 <= A_i, B_j <= 10^9',
    sampleCases: [
      { input: '2 1\n1 3\n2', expectedOutput: '2.0', explanation: 'Merged array: [1, 2, 3], median is 2.0.' },
      { input: '2 2\n1 2\n3 4', expectedOutput: '2.5', explanation: 'Merged array: [1, 2, 3, 4], median is (2 + 3) / 2 = 2.5.' },
    ],
    hiddenCases: [
      { input: '1 0\n42\n' },
      { input: '0 2\n\n1 3' },
      { input: '4 4\n1 3 5 7\n2 4 6 8' },
      { input: '5 3\n1 2 3 4 5\n6 7 8' },
      { input: '3 5\n10 20 30\n5 15 25 35 45' },
      { input: '1 1\n10\n10' },
      { input: '4 2\n2 3 5 8\n10 12' },
      { input: '3 3\n-5 3 6\n-2 0 2' },
    ],
    solutionCode: `
import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    m = int(data[1])
    idx = 2
    a = [int(x) for x in data[idx:idx+n]]
    idx += n
    b = [int(x) for x in data[idx:idx+m]]
    
    if len(a) > len(b):
        a, b = b, a
        n, m = m, n
        
    total = n + m
    half = (total + 1) // 2
    
    low, high = 0, n
    while low <= high:
        i = (low + high) // 2
        j = half - i
        
        a_left = a[i - 1] if i > 0 else float('-inf')
        a_right = a[i] if i < n else float('inf')
        b_left = b[j - 1] if j > 0 else float('-inf')
        b_right = b[j] if j < m else float('inf')
        
        if a_left <= b_right and b_left <= a_right:
            if total % 2 != 0:
                med = max(a_left, b_left)
            else:
                med = (max(a_left, b_left) + min(a_right, b_right)) / 2.0
            print(f"{med:.1f}")
            return
        elif a_left > b_right:
            high = i - 1
        else:
            low = i + 1

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: 'Binary search on the partition cut of the smaller array to achieve O(log(min(N, M))) logarithmic time.',
      timeComplexity: 'O(log(min(N, M)))',
      spaceComplexity: 'O(1)',
    },
  },

  // --------------------------------------------------------------------------
  // cv099: Binary Search on Answer - Painter Partition Deadline (HARD)
  // --------------------------------------------------------------------------
  {
    id: 'cv099',
    slug: 'painter-partition-deadline',
    title: 'The Mural Painter Time Allocation',
    difficulty: 'HARD',
    topics: ['Binary Search & Sorting'],
    timeLimitMs: 1500,
    memoryLimitKb: 262144,
    statement: `A guild of K painters must paint N wooden fence boards with lengths L_1, L_2, ..., L_N.
Each unit length of a board requires T minutes to paint.
Each painter can only be assigned a contiguous segment of boards. Two painters cannot share the same board or swap intermediate boards.

Determine the minimum time (in minutes) required to paint all N boards assuming all K painters work concurrently.`,
    inputFormat: 'First line: Three integers N, K, and T.\nSecond line: N space-separated integers representing board lengths.',
    outputFormat: 'Print the minimum time required in minutes.',
    constraints: '1 <= N <= 100000\n1 <= K <= 100000\n1 <= T <= 1000\n1 <= L_i <= 10^9',
    sampleCases: [
      { input: '4 2 5\n10 20 30 40', expectedOutput: '300', explanation: 'Painter 1 paints boards [10, 20, 30] (total length 60, time 60 * 5 = 300). Painter 2 paints board [40] (time 40 * 5 = 200). Max time is 300.' },
      { input: '2 4 10\n10 20', expectedOutput: '200', explanation: 'Painter 1 gets 10, Painter 2 gets 20. Max time 20 * 10 = 200.' },
    ],
    hiddenCases: [
      { input: '1 1 5\n100' },
      { input: '5 3 2\n1 2 3 4 5' },
      { input: '4 1 10\n10 10 10 10' },
      { input: '6 3 1\n5 10 30 20 15 25' },
      { input: '5 2 3\n10 20 30 40 50' },
      { input: '7 4 2\n10 20 15 30 25 35 40' },
      { input: '3 2 100\n1000000000 1000000000 1000000000' },
      { input: '4 4 1\n5 5 5 5' },
    ],
    solutionCode: `
import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    k = int(data[1])
    t = int(data[2])
    boards = [int(x) for x in data[3:3+n]]
    
    def feasible(max_len):
        painters = 1
        curr = 0
        for b in boards:
            if curr + b > max_len:
                painters += 1
                curr = b
                if painters > k:
                    return False
            else:
                curr += b
        return True
        
    low = max(boards)
    high = sum(boards)
    ans = high
    
    while low <= high:
        mid = (low + high) // 2
        if feasible(mid):
            ans = mid
            high = mid - 1
        else:
            low = mid + 1
            
    print(ans * t)

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: 'Binary Search on Answer: find the minimal feasible max board-length allocated to any painter, then multiply by time factor T.',
      timeComplexity: 'O(N log(sum(L)))',
      spaceComplexity: 'O(1)',
    },
  },

  // --------------------------------------------------------------------------
  // cv100: Bit Manipulation - Single Unique Element (EASY)
  // --------------------------------------------------------------------------
  {
    id: 'cv100',
    slug: 'single-unique-element-detector',
    title: 'The Lone Signal Frequency',
    difficulty: 'EASY',
    topics: ['Simulation & Bit Manipulation'],
    timeLimitMs: 1000,
    memoryLimitKb: 262144,
    statement: `A military transceiver intercepts N frequency values where every frequency appears exactly twice, except for one solitary spy frequency that appears exactly once.

Determine that unique frequency. Your solution must use O(N) time and O(1) extra space.`,
    inputFormat: 'First line: Integer N (always an odd integer).\nSecond line: N space-separated integers.',
    outputFormat: 'Print the unique solitary integer.',
    constraints: '1 <= N <= 100001\n-10^9 <= A_i <= 10^9',
    sampleCases: [
      { input: '5\n4 1 2 1 2', expectedOutput: '4', explanation: '1 and 2 appear twice; 4 appears once.' },
      { input: '3\n2 2 1', expectedOutput: '1', explanation: '2 appears twice; 1 appears once.' },
    ],
    hiddenCases: [
      { input: '1\n99' },
      { input: '7\n10 20 30 10 20 40 30' },
      { input: '5\n-5 3 -5 3 0' },
      { input: '9\n1 2 3 4 5 1 2 3 4' },
      { input: '5\n1000000 2 1000000 3 2' },
      { input: '3\n-10 -10 -20' },
      { input: '7\n7 8 9 7 8 9 10' },
      { input: '5\n0 1 0 2 1' },
    ],
    solutionCode: `
import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    nums = [int(x) for x in data[1:1+n]]
    
    unique = 0
    for x in nums:
        unique ^= x
        
    print(unique)

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: 'XOR all elements together: identical pairs cancel out (x ^ x = 0), leaving only the unique solitary element.',
      timeComplexity: 'O(N)',
      spaceComplexity: 'O(1)',
    },
  },

  // --------------------------------------------------------------------------
  // cv101: Bit Manipulation - Two Unique Elements (MEDIUM)
  // --------------------------------------------------------------------------
  {
    id: 'cv101',
    slug: 'two-unique-elements-in-pairs',
    title: 'The Dual Solitary Signatures',
    difficulty: 'MEDIUM',
    topics: ['Simulation & Bit Manipulation'],
    timeLimitMs: 1000,
    memoryLimitKb: 262144,
    statement: `An encrypted transmission stream of N integers contains pairs of duplicate numbers, except for exactly two distinct unique numbers that appear only once each.

Find these two unique numbers and print them in strictly ascending order separated by a space.
Your algorithm must run in O(N) time and O(1) extra space.`,
    inputFormat: 'First line: Integer N (always an even integer).\nSecond line: N space-separated integers.',
    outputFormat: 'Print the two unique integers in ascending order: num1 num2.',
    constraints: '2 <= N <= 100000\n-10^9 <= A_i <= 10^9',
    sampleCases: [
      { input: '6\n1 2 1 3 2 5', expectedOutput: '3 5', explanation: 'Unique elements are 3 and 5.' },
      { input: '4\n-1 0 -1 -2', expectedOutput: '-2 0', explanation: 'Unique elements are -2 and 0.' },
    ],
    hiddenCases: [
      { input: '2\n10 20' },
      { input: '4\n1 2 1 3' },
      { input: '6\n4 2 4 5 2 3' },
      { input: '8\n10 20 30 40 10 20 30 50' },
      { input: '6\n-5 10 -5 10 7 -3' },
      { input: '4\n0 100 0 200' },
      { input: '8\n1 1 2 2 3 4 5 5' },
      { input: '6\n7 8 9 9 8 10' },
    ],
    solutionCode: `
import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    nums = [int(x) for x in data[1:1+n]]
    
    xor_all = 0
    for x in nums:
        xor_all ^= x
        
    # Get rightmost set bit
    diff_bit = xor_all & (-xor_all)
    
    a, b = 0, 0
    for x in nums:
        if x & diff_bit:
            a ^= x
        else:
            b ^= x
            
    if a > b:
        a, b = b, a
        
    print(f"{a} {b}")

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: 'XOR of all elements yields (a ^ b). Find the lowest set bit where a and b differ, and partition numbers into two sets to isolate both.',
      timeComplexity: 'O(N)',
      spaceComplexity: 'O(1)',
    },
  },

  // --------------------------------------------------------------------------
  // cv102: Bit Manipulation - Bitwise AND of Range (MEDIUM)
  // --------------------------------------------------------------------------
  {
    id: 'cv102',
    slug: 'bitwise-and-range-accumulator',
    title: 'The Bitwise Interval Mask Filter',
    difficulty: 'MEDIUM',
    topics: ['Simulation & Bit Manipulation'],
    timeLimitMs: 1000,
    memoryLimitKb: 262144,
    statement: `Given two non-negative integers L and R, compute the bitwise AND of all numbers in the inclusive range [L, R]:
L & (L + 1) & (L + 2) & ... & R.`,
    inputFormat: 'A single line containing two non-negative integers L and R.',
    outputFormat: 'Print the bitwise AND result.',
    constraints: '0 <= L <= R <= 2^31 - 1',
    sampleCases: [
      { input: '5 7', expectedOutput: '4', explanation: '5 (101) & 6 (110) & 7 (111) = 4 (100).' },
      { input: '0 0', expectedOutput: '0', explanation: 'Range [0, 0] gives 0.' },
    ],
    hiddenCases: [
      { input: '1 2147483647' },
      { input: '10 15' },
      { input: '12 12' },
      { input: '8 15' },
      { input: '16 31' },
      { input: '9 12' },
      { input: '100 200' },
      { input: '1024 1025' },
    ],
    solutionCode: `
import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    l = int(data[0])
    r = int(data[1])
    
    # Common prefix of binary representations of L and R
    shift = 0
    while l < r:
        l >>= 1
        r >>= 1
        shift += 1
        
    print(l << shift)

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: 'The bitwise AND of range [L, R] retains only the common highest prefix bits of L and R, with all trailing bits zeroed.',
      timeComplexity: 'O(1) (at most 32 bit shifts)',
      spaceComplexity: 'O(1)',
    },
  },

  // --------------------------------------------------------------------------
  // cv103: Bit Manipulation - Total Hamming Distance (MEDIUM)
  // --------------------------------------------------------------------------
  {
    id: 'cv103',
    slug: 'haming-distance-total-pairs',
    title: 'The Total Bit Hamming Divergence',
    difficulty: 'MEDIUM',
    topics: ['Simulation & Bit Manipulation'],
    timeLimitMs: 1500,
    memoryLimitKb: 262144,
    statement: `The Hamming distance between two integers is the number of positions at which the corresponding bits are different.

Given an array of N integers, calculate the sum of Hamming distances between all unordered pairs (A_i, A_j) with 0 <= i < j < N.`,
    inputFormat: 'First line: Integer N.\nSecond line: N space-separated non-negative integers.',
    outputFormat: 'Print the sum of Hamming distances over all pairs.',
    constraints: '1 <= N <= 50000\n0 <= A_i <= 10^9',
    sampleCases: [
      { input: '3\n4 14 2', expectedOutput: '6', explanation: 'Pairs: (4, 14) -> 2, (4, 2) -> 2, (14, 2) -> 2. Total = 6.' },
      { input: '4\n4 14 4 14', expectedOutput: '8', explanation: 'Total Hamming distance across 6 pairs is 8.' },
    ],
    hiddenCases: [
      { input: '1\n100' },
      { input: '2\n0 1' },
      { input: '3\n1 2 3' },
      { input: '5\n1 3 5 7 9' },
      { input: '6\n0 0 0 0 0 0' },
      { input: '4\n15 0 15 0' },
      { input: '5\n10 20 30 40 50' },
      { input: '7\n2 4 8 16 32 64 128' },
    ],
    solutionCode: `
import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    nums = [int(x) for x in data[1:1+n]]
    
    total = 0
    # For each bit position from 0 to 30
    for b in range(31):
        ones = 0
        mask = 1 << b
        for x in nums:
            if x & mask:
                ones += 1
        zeros = n - ones
        total += ones * zeros
        
    print(total)

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: 'Examine each of the 31 bit positions independently: for a given bit, if k numbers have bit 1 and (N-k) have bit 0, they contribute k * (N-k) to total Hamming distance.',
      timeComplexity: 'O(31 * N)',
      spaceComplexity: 'O(1)',
    },
  },

  // --------------------------------------------------------------------------
  // cv104: Bit Manipulation - Power of Two Validator (EASY)
  // --------------------------------------------------------------------------
  {
    id: 'cv104',
    slug: 'power-of-two-validator',
    title: 'The Binary Octave Frequency Check',
    difficulty: 'EASY',
    topics: ['Simulation & Bit Manipulation'],
    timeLimitMs: 1000,
    memoryLimitKb: 262144,
    statement: `Given an integer N, determine whether it is a power of two.
An integer N is a power of two if there exists an integer x such that N == 2^x.

Print YES if N is a power of two, otherwise print NO.`,
    inputFormat: 'A single integer N.',
    outputFormat: 'Print YES or NO.',
    constraints: '-2^62 <= N <= 2^62',
    sampleCases: [
      { input: '1', expectedOutput: 'YES', explanation: '2^0 = 1.' },
      { input: '16', expectedOutput: 'YES', explanation: '2^4 = 16.' },
    ],
    hiddenCases: [
      { input: '3' },
      { input: '0' },
      { input: '-16' },
      { input: '1024' },
      { input: '1048576' },
      { input: '1000000000' },
      { input: '1152921504606846976' },
      { input: '-1' },
    ],
    solutionCode: `
import sys

def solve():
    line = sys.stdin.read().strip()
    if not line:
        return
    n = int(line)
    if n > 0 and (n & (n - 1)) == 0:
        print("YES")
    else:
        print("NO")

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: 'Bitwise trick: a positive integer N is a power of 2 if and only if (N & (N - 1)) == 0.',
      timeComplexity: 'O(1)',
      spaceComplexity: 'O(1)',
    },
  },

  // --------------------------------------------------------------------------
  // cv105: Bit Manipulation - Count Set Bits Popcount (EASY)
  // --------------------------------------------------------------------------
  {
    id: 'cv105',
    slug: 'count-set-bits-popcount',
    title: 'Digital Signal Parity Population Count',
    difficulty: 'EASY',
    topics: ['Simulation & Bit Manipulation'],
    timeLimitMs: 1000,
    memoryLimitKb: 262144,
    statement: `Given an unsigned 64-bit integer N, count and print the total number of 1-bits (set bits) in its binary representation (population count / popcount).`,
    inputFormat: 'A single non-negative integer N.',
    outputFormat: 'Print the count of set bits.',
    constraints: '0 <= N <= 10^18',
    sampleCases: [
      { input: '11', expectedOutput: '3', explanation: '11 in binary is 1011 (3 set bits).' },
      { input: '128', expectedOutput: '1', explanation: '128 is 10000000 (1 set bit).' },
    ],
    hiddenCases: [
      { input: '0' },
      { input: '1' },
      { input: '15' },
      { input: '255' },
      { input: '1023' },
      { input: '1000000000' },
      { input: '1000000000000000000' },
      { input: '1152921504606846975' },
    ],
    solutionCode: `
import sys

def solve():
    line = sys.stdin.read().strip()
    if not line:
        return
    n = int(line)
    count = 0
    while n > 0:
        n &= (n - 1)
        count += 1
    print(count)

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: "Brian Kernighan's bit-counting algorithm: n &= (n - 1) clears the lowest set bit in each iteration.",
      timeComplexity: 'O(number of set bits)',
      spaceComplexity: 'O(1)',
    },
  },

  // --------------------------------------------------------------------------
  // cv106: Simulation - Grid Robot Vacuum Simulation (MEDIUM)
  // --------------------------------------------------------------------------
  {
    id: 'cv106',
    slug: 'grid-robot-vacuum-simulation',
    title: 'The Autonomous Planetary Rover Navigation',
    difficulty: 'MEDIUM',
    topics: ['Simulation & Bit Manipulation'],
    timeLimitMs: 1000,
    memoryLimitKb: 262144,
    statement: `A planetary rover begins at coordinate (0, 0) on an infinite 2D plane facing North ('N').
The rover executes a string of commands composed of three instruction letters:
- 'F': Move forward 1 unit in the current facing direction.
- 'L': Turn 90 degrees counter-clockwise (to the left) in place.
- 'R': Turn 90 degrees clockwise (to the right) in place.

Directions are: North (+Y), East (+X), South (-Y), West (-X).

Output the final coordinate (X, Y) and the final facing direction ('N', 'S', 'E', or 'W').`,
    inputFormat: 'A single string of commands containing only F, L, R.',
    outputFormat: 'Print: X Y Direction (e.g. 2 3 N).',
    constraints: '1 <= len(commands) <= 100000',
    sampleCases: [
      { input: 'FFRFF', expectedOutput: '2 2 E', explanation: 'Move North 2 to (0,2), turn East, move 2 to (2,2) facing E.' },
      { input: 'FLFLFLF', expectedOutput: '0 0 N', explanation: 'Traces a 1x1 square counter-clockwise, ending at (0,0) facing N.' },
    ],
    hiddenCases: [
      { input: 'F' },
      { input: 'L' },
      { input: 'RRRR' },
      { input: 'FFFFFFFFFF' },
      { input: 'FRFRFRFR' },
      { input: 'FFLFFLFFLFF' },
      { input: 'FLRFFRFLFF' },
      { input: 'LLLLF' },
    ],
    solutionCode: `
import sys

def solve():
    cmd = sys.stdin.read().strip()
    if not cmd:
        return
        
    # Directions: 0=N, 1=E, 2=S, 3=W
    dirs = ['N', 'E', 'S', 'W']
    dx = [0, 1, 0, -1]
    dy = [1, 0, -1, 0]
    
    x, y = 0, 0
    d = 0 # Facing North
    
    for c in cmd:
        if c == 'F':
            x += dx[d]
            y += dy[d]
        elif c == 'R':
            d = (d + 1) % 4
        elif c == 'L':
            d = (d + 3) % 4
            
    print(f"{x} {y} {dirs[d]}")

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: 'State simulation with directional vectors: track (x, y) coordinates and integer direction (0..3) with modular arithmetic.',
      timeComplexity: 'O(len(commands))',
      spaceComplexity: 'O(1)',
    },
  },

  // --------------------------------------------------------------------------
  // cv107: Simulation - Game of Life Cellular Automaton (MEDIUM)
  // --------------------------------------------------------------------------
  {
    id: 'cv107',
    slug: 'game-of-life-cellular-automaton',
    title: 'The Biome Colony Generation Cycle',
    difficulty: 'MEDIUM',
    topics: ['Simulation & Bit Manipulation'],
    timeLimitMs: 1500,
    memoryLimitKb: 262144,
    statement: `Simulate Conway's Game of Life on an N x M grid over K generations.
Each cell is either live (1) or dead (0). In each generation:
1. Any live cell with fewer than 2 live neighbors dies (underpopulation).
2. Any live cell with 2 or 3 live neighbors lives on to the next generation.
3. Any live cell with more than 3 live neighbors dies (overpopulation).
4. Any dead cell with exactly 3 live neighbors becomes a live cell (reproduction).

Neighbors are the 8 adjacent cells (horizontal, vertical, diagonal). Out-of-bounds cells are considered dead.
Print the final grid after K generations.`,
    inputFormat: 'First line: Three integers N, M, and K.\nNext N lines: M space-separated integers (0 or 1).',
    outputFormat: 'Print the N x M grid after K steps, each row on a new line with space-separated values.',
    constraints: '1 <= N, M <= 50\n1 <= K <= 50',
    sampleCases: [
      { input: '3 3 1\n0 1 0\n0 1 0\n0 1 0', expectedOutput: '0 0 0\n1 1 1\n0 0 0', explanation: 'Blinker oscillator rotates from vertical to horizontal.' },
      { input: '2 2 1\n1 1\n1 1', expectedOutput: '1 1\n1 1', explanation: 'Block still life remains unchanged.' },
    ],
    hiddenCases: [
      { input: '1 1 1\n1' },
      { input: '3 3 2\n0 1 0\n0 1 0\n0 1 0' },
      { input: '4 4 1\n0 1 1 0\n1 0 0 1\n0 1 1 0\n0 0 0 0' },
      { input: '3 3 5\n0 0 0\n0 0 0\n0 0 0' },
      { input: '4 4 3\n1 1 1 1\n1 0 0 1\n1 0 0 1\n1 1 1 1' },
      { input: '5 5 2\n0 1 0 0 0\n0 0 1 0 0\n1 1 1 0 0\n0 0 0 0 0\n0 0 0 0 0' },
      { input: '3 3 1\n1 1 1\n1 1 1\n1 1 1' },
      { input: '4 4 2\n0 1 0 0\n0 0 1 0\n1 1 1 0\n0 0 0 0' },
    ],
    solutionCode: `
import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    m = int(data[1])
    k = int(data[2])
    
    grid = []
    idx = 3
    for _ in range(n):
        row = [int(x) for x in data[idx:idx+m]]
        grid.append(row)
        idx += m
        
    for _ in range(k):
        nxt = [[0] * m for _ in range(n)]
        for r in range(n):
            for c in range(m):
                live_neighbors = 0
                for dr in (-1, 0, 1):
                    for dc in (-1, 0, 1):
                        if dr == 0 and dc == 0:
                            continue
                        nr, nc = r + dr, c + dc
                        if 0 <= nr < n and 0 <= nc < m:
                            live_neighbors += grid[nr][nc]
                if grid[r][c] == 1:
                    if live_neighbors == 2 or live_neighbors == 3:
                        nxt[r][c] = 1
                else:
                    if live_neighbors == 3:
                        nxt[r][c] = 1
        grid = nxt
        
    for row in grid:
        print(' '.join(map(str, row)))

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: 'Direct step-by-step matrix simulation applying neighbor counting rules for each cell.',
      timeComplexity: 'O(K * N * M)',
      spaceComplexity: 'O(N * M)',
    },
  },

  // --------------------------------------------------------------------------
  // cv108: Simulation - Josephus Circle Elimination (MEDIUM)
  // --------------------------------------------------------------------------
  {
    id: 'cv108',
    slug: 'josephus-circle-elimination',
    title: 'The Grand Gladiator Elimination Arena',
    difficulty: 'MEDIUM',
    topics: ['Simulation & Bit Manipulation'],
    timeLimitMs: 1000,
    memoryLimitKb: 262144,
    statement: `N gladiators stand in a circle numbered 1 to N in clockwise order.
Beginning at gladiator 1, counting proceeds clockwise. Every K-th alive gladiator is eliminated and removed from the circle.
Counting resumes immediately from the gladiator next to the eliminated one.

Determine the 1-based number of the ultimate surviving gladiator.`,
    inputFormat: 'Two space-separated integers N and K.',
    outputFormat: 'Print the 1-based index of the survivor.',
    constraints: '1 <= N <= 100000\n1 <= K <= 100000',
    sampleCases: [
      { input: '5 2', expectedOutput: '3', explanation: 'Elimination order: 2, 4, 1, 5. Survivor is 3.' },
      { input: '7 3', expectedOutput: '4', explanation: 'Elimination order: 3, 6, 2, 7, 5, 1. Survivor is 4.' },
    ],
    hiddenCases: [
      { input: '1 1' },
      { input: '1 5' },
      { input: '6 1' },
      { input: '10 2' },
      { input: '14 2' },
      { input: '100 7' },
      { input: '1000 13' },
      { input: '50000 3' },
    ],
    solutionCode: `
import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    k = int(data[1])
    
    # Josephus 0-indexed formula: J(n, k) = (J(n-1, k) + k) % n
    survivor = 0
    for i in range(2, n + 1):
        survivor = (survivor + k) % i
        
    print(survivor + 1)

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: 'Iterative Josephus recurrence: J(n, k) = (J(n-1, k) + k) % n in O(N) time with O(1) space.',
      timeComplexity: 'O(N)',
      spaceComplexity: 'O(1)',
    },
  },

  // --------------------------------------------------------------------------
  // cv109: Simulation - Morse Code Decoder (EASY)
  // --------------------------------------------------------------------------
  {
    id: 'cv109',
    slug: 'morse-code-decoder-simulation',
    title: 'The Telegraph Morse Cipher Decoder',
    difficulty: 'EASY',
    topics: ['Simulation & Bit Manipulation'],
    timeLimitMs: 1000,
    memoryLimitKb: 262144,
    statement: `Decode a Morse code transmission message into plain uppercase English text.
Letters are encoded by dots (.) and dashes (-) separated by a single space.
Words are separated by three consecutive spaces ("   ").

Use standard Morse code:
A: .-     B: -...   C: -.-.   D: -..    E: .      F: ..-.
G: --.    H: ....   I: ..     J: .---   K: -.-    L: .-..
M: --     N: -.     O: ---    P: .--.   Q: --.-   R: .-.
S: ...    T: -      U: ..-    V: ...-   W: .--    X: -..-
Y: -.--   Z: --..`,
    inputFormat: 'A single line containing the Morse code string.',
    outputFormat: 'Print the decoded uppercase string.',
    constraints: 'Input contains valid Morse letters and spaces.',
    sampleCases: [
      { input: '.... . -.--   .--- ..- -.. .', expectedOutput: 'HEY JUDE', explanation: 'HEY JUDE decoded from morse.' },
      { input: '... --- ...', expectedOutput: 'SOS', explanation: 'Standard distress signal.' },
    ],
    hiddenCases: [
      { input: '.-' },
      { input: '-.-. --- -.. . ...- .. - .-' },
      { input: '.... . .-.. .-.. ---   .-- --- .-. .-.. -..' },
      { input: '.- -... -.-.' },
      { input: '- . ... -' },
      { input: '--- .--. . -.   ... . ... .- -- .' },
      { input: '.- .-.. --. --- .-. .. - .... --' },
      { input: '..--- ----- ..--- -....' },
    ],
    solutionCode: `
import sys

MORSE = {
    '.-': 'A', '-...': 'B', '-.-.': 'C', '-..': 'D', '.': 'E',
    '..-.': 'F', '--.': 'G', '....': 'H', '..': 'I', '.---': 'J',
    '-.-': 'K', '.-..': 'L', '--': 'M', '-.': 'N', '---': 'O',
    '.--.': 'P', '--.-': 'Q', '.-.': 'R', '...': 'S', '-': 'T',
    '..-': 'U', '...-': 'V', '.--': 'W', '-..-': 'X', '-.--': 'Y',
    '--..': 'Z',
    '-----': '0', '.----': '1', '..---': '2', '...--': '3', '....-': '4',
    '.....': '5', '-....': '6', '--...': '7', '---..': '8', '----.': '9'
}

def solve():
    raw = sys.stdin.read().rstrip('\\r\\n')
    if not raw:
        return
    words = raw.split('   ')
    decoded_words = []
    for w in words:
        chars = w.split(' ')
        decoded_chars = [MORSE.get(c, '') for c in chars if c]
        decoded_words.append(''.join(decoded_chars))
    print(' '.join(decoded_words))

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: 'Tokenize string by triple-spaces for words and single-space for letters, mapping via lookup table.',
      timeComplexity: 'O(len(S))',
      spaceComplexity: 'O(len(S))',
    },
  },

  // --------------------------------------------------------------------------
  // cv110: Simulation - Traffic Light Junction Simulator (HARD)
  // --------------------------------------------------------------------------
  {
    id: 'cv110',
    slug: 'traffic-light-junction-simulator',
    title: 'Four-Way Traffic Light Junction Controller',
    difficulty: 'HARD',
    topics: ['Simulation & Bit Manipulation'],
    timeLimitMs: 1500,
    memoryLimitKb: 262144,
    statement: `Simulate traffic flow through an intersection with two intersecting lanes: North-South (NS) and East-West (EW).
The light operates in alternating cycles:
- NS is GREEN for G_ns seconds, then RED for the remainder of the cycle.
- EW is GREEN for G_ew seconds (when NS is RED), then RED.
Total cycle duration is C = G_ns + G_ew seconds. During a GREEN phase of a lane, exactly 1 car can pass per second if cars are waiting.

You are given N arrival events: each event has arrival second T_i and lane L_i ('NS' or 'EW'). Events are sorted by time T_i.
Determine the departure second for each of the N cars in the order they arrived.`,
    inputFormat: 'First line: Three integers G_ns, G_ew, and N.\nNext N lines: An integer T_i and a string L_i ("NS" or "EW").',
    outputFormat: 'Print N lines: the departure second for each car.',
    constraints: '1 <= G_ns, G_ew <= 60\n1 <= N <= 1000\n0 <= T_i <= 10000',
    sampleCases: [
      { input: '5 5 3\n0 NS\n1 NS\n2 EW', expectedOutput: '0\n1\n5', explanation: 'At t=0, NS is green, car 1 passes at t=0. Car 2 passes at t=1. EW gets green at t=5, so car 3 passes at t=5.' },
      { input: '3 3 2\n0 EW\n1 EW', expectedOutput: '3\n4', explanation: 'EW must wait until t=3 when EW light turns green.' },
    ],
    hiddenCases: [
      { input: '10 10 1\n5 NS' },
      { input: '5 5 2\n0 NS\n0 EW' },
      { input: '4 4 4\n0 NS\n1 NS\n2 NS\n3 NS' },
      { input: '2 2 3\n0 NS\n1 NS\n2 NS' },
      { input: '5 5 3\n10 NS\n11 EW\n12 NS' },
      { input: '3 3 5\n0 EW\n0 EW\n0 EW\n1 NS\n2 NS' },
      { input: '6 4 2\n7 EW\n8 NS' },
      { input: '5 5 4\n0 NS\n4 NS\n5 NS\n6 NS' },
    ],
    solutionCode: `
import sys
from collections import deque

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    g_ns = int(data[0])
    g_ew = int(data[1])
    n = int(data[2])
    cycle = g_ns + g_ew
    
    events = []
    idx = 3
    for car_id in range(n):
        t = int(data[idx])
        lane = data[idx+1]
        events.append((t, lane, car_id))
        idx += 2
        
    q_ns = deque()
    q_ew = deque()
    dep = [0] * n
    
    current_time = 0
    event_idx = 0
    served = 0
    
    while served < n:
        # Enqueue arrivals up to current_time
        while event_idx < n and events[event_idx][0] <= current_time:
            t, lane, cid = events[event_idx]
            if lane == 'NS':
                q_ns.append(cid)
            else:
                q_ew.append(cid)
            event_idx += 1
            
        phase = current_time % cycle
        ns_green = phase < g_ns
        
        # Try serving a car
        car_served = False
        if ns_green and q_ns:
            cid = q_ns.popleft()
            dep[cid] = current_time
            served += 1
            car_served = True
        elif not ns_green and q_ew:
            cid = q_ew.popleft()
            dep[cid] = current_time
            served += 1
            car_served = True
            
        # Fast forward if idle
        if not car_served and not q_ns and not q_ew:
            if event_idx < n:
                current_time = events[event_idx][0]
                continue
                
        current_time += 1
        
    for ans in dep:
        print(ans)

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: 'Queue-based discrete second simulation tracking light phase and per-lane vehicle FIFO queues.',
      timeComplexity: 'O(T_max + N)',
      spaceComplexity: 'O(N)',
    },
  },
];

console.log(`Writing Batch 5 (${problems.length} problems)...`);
problems.forEach((p) => {
  console.log(`Generating: ${p.id}`);
  createProblem(p);
});
console.log('✅ Batch 5 written successfully!');
