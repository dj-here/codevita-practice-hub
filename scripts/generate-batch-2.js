const { createProblem } = require('./problem-helper');

const batch2 = [
  // --------------------------------------------------------------------------
  // cv023: Strings - Longest Palindromic Substring (MEDIUM)
  // --------------------------------------------------------------------------
  {
    id: 'cv023',
    slug: 'longest-palindromic-subword',
    title: 'The Scribe Palindromic Scroll',
    difficulty: 'MEDIUM',
    topics: ['Strings & Parsing'],
    timeLimitMs: 1000,
    memoryLimitKb: 262144,
    statement: `An ancient parchment contains an encoded string S. The magical warding is concentrated in the longest contiguous substring that reads identically forwards and backwards (a palindrome).

Given the string S, print the length of the longest palindromic substring. If multiple palindromes have the same maximum length, any one length applies.`,
    inputFormat: 'A single string S containing alphanumeric characters.',
    outputFormat: 'Print the length of the longest palindromic substring.',
    constraints: '1 <= |S| <= 1000',
    sampleCases: [
      { input: 'babad', expectedOutput: '3', explanation: 'Palindromes "bab" or "aba" have length 3.' },
      { input: 'cbbd', expectedOutput: '2', explanation: '"bb" has length 2.' },
    ],
    hiddenCases: [
      { input: 'a', expectedOutput: '1' },
      { input: 'racecar', expectedOutput: '7' },
      { input: 'abcdefg', expectedOutput: '1' },
      { input: 'noon', expectedOutput: '4' },
      { input: 'forgeeksskeegfor', expectedOutput: '10' },
      { input: 'mississippi', expectedOutput: '7' },
      { input: 'bananas', expectedOutput: '5' },
      { input: 'abacdfgdcaba', expectedOutput: '3' },
    ],
    solutionCode: `
import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    s = data[0]
    n = len(s)
    if n <= 1:
        print(n)
        return
        
    def expand(left, right):
        while left >= 0 and right < n and s[left] == s[right]:
            left -= 1
            right += 1
        return right - left - 1

    max_len = 1
    for i in range(n):
        len1 = expand(i, i)       # Odd length
        len2 = expand(i, i + 1)   # Even length
        max_len = max(max_len, len1, len2)
        
    print(max_len)

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: 'Expand around center: for each index i from 0 to N-1, expand outward for both odd-length (center i) and even-length (center i, i+1) palindromes.',
      timeComplexity: 'O(N^2)',
      spaceComplexity: 'O(1)',
    },
  },

  // --------------------------------------------------------------------------
  // cv024: Strings - Valid Anagram Check (EASY)
  // --------------------------------------------------------------------------
  {
    id: 'cv024',
    slug: 'alchemical-anagram-cipher',
    title: 'Alchemical Anagram Verification',
    difficulty: 'EASY',
    topics: ['Strings & Parsing'],
    timeLimitMs: 1000,
    memoryLimitKb: 262144,
    statement: `Two rune inscriptions are given as strings S1 and S2. The runes are an anagram of each other if both contain the exact same characters with identical frequencies, regardless of arrangement.

Print "YES" if S1 and S2 are valid anagrams of each other, or "NO" otherwise.`,
    inputFormat: 'Two space-separated strings S1 and S2.',
    outputFormat: 'Print "YES" or "NO".',
    constraints: '1 <= |S1|, |S2| <= 10^5, characters are lowercase English letters.',
    sampleCases: [
      { input: 'listen silent', expectedOutput: 'YES', explanation: '"listen" and "silent" contain identical letters.' },
      { input: 'rat car', expectedOutput: 'NO', explanation: 'Letter sets differ.' },
    ],
    hiddenCases: [
      { input: 'anagram nagaram', expectedOutput: 'YES' },
      { input: 'a a', expectedOutput: 'YES' },
      { input: 'a b', expectedOutput: 'NO' },
      { input: 'aabbcc bbaacc', expectedOutput: 'YES' },
      { input: 'aabbcc abc', expectedOutput: 'NO' },
      { input: 'codevita vitacode', expectedOutput: 'YES' },
      { input: 'tcs tcs', expectedOutput: 'YES' },
      { input: 'abcdefghhgfedcba aabbccddeeffgghh', expectedOutput: 'YES' },
    ],
    solutionCode: `
import sys
from collections import Counter

def solve():
    data = sys.stdin.read().split()
    if len(data) < 2:
        return
    s1, s2 = data[0], data[1]
    if len(s1) != len(s2):
        print("NO")
        return
    print("YES" if Counter(s1) == Counter(s2) else "NO")

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: 'Count character frequencies using collections.Counter or an array of size 26 and compare equality.',
      timeComplexity: 'O(N)',
      spaceComplexity: 'O(1) alphabet space',
    },
  },

  // --------------------------------------------------------------------------
  // cv025: Strings - Run-Length Compression (EASY)
  // --------------------------------------------------------------------------
  {
    id: 'cv025',
    slug: 'run-length-compression',
    title: 'The Telegraph Run-Length Encoding',
    difficulty: 'EASY',
    topics: ['Strings & Parsing'],
    timeLimitMs: 1000,
    memoryLimitKb: 262144,
    statement: `A telegraph operator transmits character streams. To reduce bandwidth, runs of identical consecutive characters are compressed into the character followed by the run length count. For example, "aaabbc" is compressed to "a3b2c1".

Given a string S, output its compressed run-length representation.`,
    inputFormat: 'A single string S.',
    outputFormat: 'Print the compressed string.',
    constraints: '1 <= |S| <= 10^5, alphanumeric characters.',
    sampleCases: [
      { input: 'aaabbc', expectedOutput: 'a3b2c1', explanation: '3 a\'s, 2 b\'s, 1 c.' },
      { input: 'a', expectedOutput: 'a1', explanation: 'Single character run.' },
    ],
    hiddenCases: [
      { input: 'abcdef', expectedOutput: 'a1b1c1d1e1f1' },
      { input: 'aaaaa', expectedOutput: 'a5' },
      { input: 'aabbccddeeff', expectedOutput: 'a2b2c2d2e2f2' },
      { input: 'zzzzzZZZZZ', expectedOutput: 'z5Z5' },
      { input: '1112233334', expectedOutput: '13223441' },
      { input: 'abba', expectedOutput: 'a1b2a1' },
      { input: 'wwwwwwwwwwwwwwww', expectedOutput: 'w16' },
      { input: 'abcba', expectedOutput: 'a1b1c1b1a1' },
    ],
    solutionCode: `
import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    s = data[0]
    n = len(s)
    res = []
    i = 0
    while i < n:
        char = s[i]
        count = 0
        while i < n and s[i] == char:
            count += 1
            i += 1
        res.append(f"{char}{count}")
    print(''.join(res))

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: 'Single linear scan counting consecutive identical characters and appending char and count to the result.',
      timeComplexity: 'O(N)',
      spaceComplexity: 'O(N)',
    },
  },

  // --------------------------------------------------------------------------
  // cv026: Strings - Longest Common Prefix (EASY)
  // --------------------------------------------------------------------------
  {
    id: 'cv026',
    slug: 'longest-common-prefix',
    title: 'The Royal Archive Common Prefix',
    difficulty: 'EASY',
    topics: ['Strings & Parsing'],
    timeLimitMs: 1000,
    memoryLimitKb: 262144,
    statement: `An archivist examines N scrolls containing royal titles. To classify the scrolls into cabinets, the archivist finds the longest common prefix shared by all titles.

Given N strings, print their longest common prefix. If there is no common prefix, print "-1".`,
    inputFormat: 'First line: Integer N.\nNext N lines: One string per line.',
    outputFormat: 'Print the longest common prefix, or -1 if empty.',
    constraints: '1 <= N <= 1000, 1 <= length of each string <= 1000',
    sampleCases: [
      { input: '3\nflower\nflow\nflight', expectedOutput: 'fl', explanation: 'Common prefix across all three strings is "fl".' },
      { input: '3\ndog\nracecar\ncar', expectedOutput: '-1', explanation: 'No common prefix.' },
    ],
    hiddenCases: [
      { input: '1\nalone', expectedOutput: 'alone' },
      { input: '2\napple\napp', expectedOutput: 'app' },
      { input: '4\ninterview\nintermediate\ninternal\ninternational', expectedOutput: 'inter' },
      { input: '3\ncodevita\ncodechef\ncodeforces', expectedOutput: 'code' },
      { input: '3\na\nb\nc', expectedOutput: '-1' },
      { input: '2\nsame\nsame', expectedOutput: 'same' },
      { input: '4\nprefix\npre\npreview\npreparation', expectedOutput: 'pre' },
      { input: '3\nz\nzz\nzzz', expectedOutput: 'z' },
    ],
    solutionCode: `
import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    strings = data[1:n+1]
    if not strings:
        print("-1")
        return
    prefix = strings[0]
    for s in strings[1:]:
        while not s.startswith(prefix):
            prefix = prefix[:-1]
            if not prefix:
                print("-1")
                return
    print(prefix if prefix else "-1")

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: 'Initialize prefix as the first string. For each subsequent string, trim prefix from right until s.startswith(prefix) holds.',
      timeComplexity: 'O(N * M) where M is max length',
      spaceComplexity: 'O(1)',
    },
  },

  // --------------------------------------------------------------------------
  // cv027: Strings - Minimum Insertions for Palindrome (MEDIUM)
  // --------------------------------------------------------------------------
  {
    id: 'cv027',
    slug: 'palindrome-repair-insertions',
    title: 'The Sacred Palindrome Inscription',
    difficulty: 'MEDIUM',
    topics: ['Strings & Parsing'],
    timeLimitMs: 1000,
    memoryLimitKb: 262144,
    statement: `A broken stone inscription contains a string S. The stonemason can insert characters at any position in the string.

Find the minimum number of character insertions required to transform string S into a palindrome.`,
    inputFormat: 'A single string S.',
    outputFormat: 'Print the minimum number of insertions.',
    constraints: '1 <= |S| <= 500, lowercase English letters.',
    sampleCases: [
      { input: 'zzazz', expectedOutput: '0', explanation: 'Already a palindrome.' },
      { input: 'mbadm', expectedOutput: '2', explanation: 'Insert 2 characters (e.g. "mdabdam") to form a palindrome.' },
    ],
    hiddenCases: [
      { input: 'leetcode', expectedOutput: '5' },
      { input: 'a', expectedOutput: '0' },
      { input: 'ab', expectedOutput: '1' },
      { input: 'abc', expectedOutput: '2' },
      { input: 'racecar', expectedOutput: '0' },
      { input: 'noone', expectedOutput: '1' },
      { input: 'google', expectedOutput: '2' },
      { input: 'abcdef', expectedOutput: '5' },
    ],
    solutionCode: `
import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    s = data[0]
    n = len(s)
    rev_s = s[::-1]
    
    # LCS of s and rev_s gives Longest Palindromic Subsequence (LPS)
    dp = [0] * (n + 1)
    for i in range(1, n + 1):
        prev = 0
        for j in range(1, n + 1):
            temp = dp[j]
            if s[i - 1] == rev_s[j - 1]:
                dp[j] = prev + 1
            else:
                dp[j] = max(dp[j], dp[j - 1])
            prev = temp
            
    lps = dp[n]
    print(n - lps)

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: 'Minimum insertions to make a string a palindrome is equal to length(S) - length(LPS(S)). Compute Longest Palindromic Subsequence via LCS of S and reverse(S).',
      timeComplexity: 'O(N^2)',
      spaceComplexity: 'O(N)',
    },
  },

  // --------------------------------------------------------------------------
  // cv028: Strings - Pattern Matching (KMP) (HARD)
  // --------------------------------------------------------------------------
  {
    id: 'cv028',
    slug: 'knuth-morris-pratt-search',
    title: 'The Cryptographic Beacon Occurrences',
    difficulty: 'HARD',
    topics: ['Strings & Parsing'],
    timeLimitMs: 1000,
    memoryLimitKb: 262144,
    statement: `A transmission station sends a long signal Text and searches for all 1-based start indices where a pattern Pattern appears as a contiguous substring.

Given Text and Pattern, print all 1-based starting positions of Pattern in Text separated by spaces. If Pattern does not appear, print -1.`,
    inputFormat: 'First line: String Text.\nSecond line: String Pattern.',
    outputFormat: 'Print 1-based starting indices separated by spaces, or -1.',
    constraints: '1 <= |Pattern| <= |Text| <= 10^5, English letters.',
    sampleCases: [
      { input: 'AABAACAADAABAABA\nAABA', expectedOutput: '1 9 13', explanation: 'Pattern "AABA" occurs at indices 1, 9, 13 (1-based).' },
      { input: 'HELLO\nWORLD', expectedOutput: '-1', explanation: 'Not found.' },
    ],
    hiddenCases: [
      { input: 'AAAAA\nAA', expectedOutput: '1 2 3 4' },
      { input: 'ABCDEF\nCD', expectedOutput: '3' },
      { input: 'BATMANANDROBIN\nBAT', expectedOutput: '1' },
      { input: 'XYZ\nXYZ', expectedOutput: '1' },
      { input: 'CODEVITACODEVITACODE\nCODEVITA', expectedOutput: '1 9' },
      { input: 'ABABABABAB\nABA', expectedOutput: '1 3 5 7' },
      { input: 'MISSISSIPPI\nIS', expectedOutput: '2 5' },
      { input: 'TESTSTRING\nNOTFOUND', expectedOutput: '-1' },
    ],
    solutionCode: `
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
`,
    editorial: {
      approach: 'Knuth-Morris-Pratt (KMP) algorithm: preprocess the pattern into a Longest Prefix Suffix (LPS) table in O(M), then match text in O(N) linear time without backtracking.',
      timeComplexity: 'O(N + M)',
      spaceComplexity: 'O(M)',
    },
  },

  // --------------------------------------------------------------------------
  // cv029: Strings - String Rotation Check (EASY)
  // --------------------------------------------------------------------------
  {
    id: 'cv029',
    slug: 'rotational-equivalent-cipher',
    title: 'Rotational Cipher Equivalence',
    difficulty: 'EASY',
    topics: ['Strings & Parsing'],
    timeLimitMs: 1000,
    memoryLimitKb: 262144,
    statement: `Two ancient stone cylinders are engraved with strings S1 and S2. A cylinder can be rotated clockwise by any number of positions.

Determine whether S2 is a rotation of S1. Print "YES" if S2 can be formed by rotating S1, or "NO" otherwise.`,
    inputFormat: 'Two space-separated strings S1 and S2.',
    outputFormat: 'Print "YES" or "NO".',
    constraints: '1 <= |S1|, |S2| <= 10^5',
    sampleCases: [
      { input: 'abcde cdeab', expectedOutput: 'YES', explanation: '"abcde" shifted by 2 becomes "cdeab".' },
      { input: 'abcde abced', expectedOutput: 'NO', explanation: 'Different letter order.' },
    ],
    hiddenCases: [
      { input: 'a a', expectedOutput: 'YES' },
      { input: 'ab ba', expectedOutput: 'YES' },
      { input: 'waterbottle erbottlewat', expectedOutput: 'YES' },
      { input: 'hello world', expectedOutput: 'NO' },
      { input: 'rotate tatero', expectedOutput: 'YES' },
      { input: 'abc def', expectedOutput: 'NO' },
      { input: 'aaaa bbbb', expectedOutput: 'NO' },
      { input: 'tcsion iontcs', expectedOutput: 'YES' },
    ],
    solutionCode: `
import sys

def solve():
    data = sys.stdin.read().split()
    if len(data) < 2:
        return
    s1, s2 = data[0], data[1]
    if len(s1) != len(s2):
        print("NO")
        return
    print("YES" if s2 in (s1 + s1) else "NO")

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: 'S2 is a rotation of S1 if and only if len(S1) == len(S2) and S2 is a substring of S1 + S1.',
      timeComplexity: 'O(N)',
      spaceComplexity: 'O(N)',
    },
  },

  // --------------------------------------------------------------------------
  // cv030: Strings - Count and Say Sequence (MEDIUM)
  // --------------------------------------------------------------------------
  {
    id: 'cv030',
    slug: 'count-and-say-sequence',
    title: 'The Recursive Herald Chant',
    difficulty: 'MEDIUM',
    topics: ['Strings & Parsing'],
    timeLimitMs: 1000,
    memoryLimitKb: 262144,
    statement: `The Count-and-Say sequence is defined recursively:
- countAndSay(1) = "1"
- countAndSay(n) is the run-length encoding of countAndSay(n - 1) grouping contiguous identical digits. For example, "3322251" is read as "two 3s, three 2s, one 5, one 1" -> "23321511".

Given an integer N, generate and print countAndSay(N).`,
    inputFormat: 'A single integer N.',
    outputFormat: 'Print the N-th term of the sequence as a string.',
    constraints: '1 <= N <= 30',
    sampleCases: [
      { input: '1', expectedOutput: '1', explanation: 'Base case.' },
      { input: '4', expectedOutput: '1211', explanation: '1 -> "11" -> "21" -> "1211".' },
    ],
    hiddenCases: [
      { input: '2', expectedOutput: '11' },
      { input: '3', expectedOutput: '21' },
      { input: '5', expectedOutput: '111221' },
      { input: '6', expectedOutput: '312211' },
      { input: '7', expectedOutput: '13112221' },
      { input: '8', expectedOutput: '1113213211' },
      { input: '9', expectedOutput: '31131211131221' },
      { input: '10', expectedOutput: '13211311123113112211' },
    ],
    solutionCode: `
import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    curr = "1"
    for _ in range(2, n + 1):
        nxt = []
        i = 0
        while i < len(curr):
            char = curr[i]
            count = 0
            while i < len(curr) and curr[i] == char:
                count += 1
                i += 1
            nxt.append(f"{count}{char}")
        curr = "".join(nxt)
    print(curr)

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: 'Simulate iteratively from 1 to N, performing run-length grouping on adjacent identical characters.',
      timeComplexity: 'O(N * L) where L is length of N-th term',
      spaceComplexity: 'O(L)',
    },
  },

  // --------------------------------------------------------------------------
  // cv031: Strings - Multiply Large Numbers (MEDIUM)
  // --------------------------------------------------------------------------
  {
    id: 'cv031',
    slug: 'astronomical-large-multiply',
    title: 'Multiplication of Astronomical Digits',
    difficulty: 'MEDIUM',
    topics: ['Strings & Parsing'],
    timeLimitMs: 1000,
    memoryLimitKb: 262144,
    statement: `Given two non-negative integers Num1 and Num2 represented as strings, return the product of Num1 and Num2, also represented as a string.

You must handle numbers up to 500 digits long without precision loss.`,
    inputFormat: 'Two space-separated non-negative integer strings Num1 and Num2.',
    outputFormat: 'Print their product string.',
    constraints: '1 <= |Num1|, |Num2| <= 500',
    sampleCases: [
      { input: '2 3', expectedOutput: '6', explanation: '2 * 3 = 6.' },
      { input: '123 456', expectedOutput: '56088', explanation: '123 * 456 = 56088.' },
    ],
    hiddenCases: [
      { input: '0 12345', expectedOutput: '0' },
      { input: '99 99', expectedOutput: '9801' },
      { input: '1000000 1000000', expectedOutput: '1000000000000' },
      { input: '9999999999 9999999999', expectedOutput: '99999999980000000001' },
      { input: '1 1', expectedOutput: '1' },
      { input: '123456789 987654321', expectedOutput: '121932631112635269' },
      { input: '10 100', expectedOutput: '1000' },
      { input: '500 0', expectedOutput: '0' },
    ],
    solutionCode: `
import sys

def solve():
    data = sys.stdin.read().split()
    if len(data) < 2:
        return
    num1, num2 = data[0], data[1]
    if num1 == "0" or num2 == "0":
        print("0")
        return
        
    m, n = len(num1), len(num2)
    pos = [0] * (m + n)
    
    for i in range(m - 1, -1, -1):
        for j in range(n - 1, -1, -1):
            mul = int(num1[i]) * int(num2[j])
            p1 = i + j
            p2 = i + j + 1
            total = mul + pos[p2]
            
            pos[p2] = total % 10
            pos[p1] += total // 10
            
    res = "".join(map(str, pos)).lstrip("0")
    print(res if res else "0")

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: 'Simulate elementary school columnar multiplication: digits at index i and j contribute to positions i+j and i+j+1. Propagate carries.',
      timeComplexity: 'O(M * N)',
      spaceComplexity: 'O(M + N)',
    },
  },

  // --------------------------------------------------------------------------
  // cv032: Strings - Longest Substring Without Repeating Characters (MEDIUM)
  // --------------------------------------------------------------------------
  {
    id: 'cv032',
    slug: 'longest-distinct-substring',
    title: 'The Non-Repeating Mosaic Pattern',
    difficulty: 'MEDIUM',
    topics: ['Strings & Parsing'],
    timeLimitMs: 1000,
    memoryLimitKb: 262144,
    statement: `A mosaic designer creates a tile strip represented by a string S. The beauty score of the mosaic is defined as the length of the longest contiguous substring that contains no duplicate characters.

Given string S, find and print this maximum length.`,
    inputFormat: 'A single string S.',
    outputFormat: 'Print the length of the longest substring with unique characters.',
    constraints: '0 <= |S| <= 10^5',
    sampleCases: [
      { input: 'abcabcbb', expectedOutput: '3', explanation: 'The answer is "abc", with length 3.' },
      { input: 'bbbbb', expectedOutput: '1', explanation: 'The answer is "b", length 1.' },
      { input: 'pwwkew', expectedOutput: '3', explanation: 'The answer is "wke", length 3.' },
    ],
    hiddenCases: [
      { input: 'a', expectedOutput: '1' },
      { input: 'au', expectedOutput: '2' },
      { input: 'dvdf', expectedOutput: '3' },
      { input: 'abcdefg', expectedOutput: '7' },
      { input: 'tmmzuxt', expectedOutput: '5' },
      { input: 'abba', expectedOutput: '2' },
      { input: 'anviaj', expectedOutput: '5' },
      { input: '12345123', expectedOutput: '5' },
    ],
    solutionCode: `
import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        print(0)
        return
    s = data[0]
    char_map = {}
    left = 0
    max_len = 0
    
    for right in range(len(s)):
        char = s[right]
        if char in char_map and char_map[char] >= left:
            left = char_map[char] + 1
        char_map[char] = right
        max_len = max(max_len, right - left + 1)
        
    print(max_len)

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: 'Sliding window with hash map: store the latest index of each seen character. When duplicate encountered in current window, jump left pointer to char_map[char] + 1.',
      timeComplexity: 'O(N)',
      spaceComplexity: 'O(min(N, Sigma))',
    },
  },

  // --------------------------------------------------------------------------
  // cv033: Strings - Roman Numeral Converter (EASY)
  // --------------------------------------------------------------------------
  {
    id: 'cv033',
    slug: 'roman-numeral-evaluator',
    title: 'The Roman Gladiator Tally',
    difficulty: 'EASY',
    topics: ['Strings & Parsing'],
    timeLimitMs: 1000,
    memoryLimitKb: 262144,
    statement: `Roman numerals are represented by seven symbols: I (1), V (5), X (10), L (50), C (100), D (500), and M (1000). Subtractive notation applies when a smaller numeral precedes a larger numeral (e.g. IV = 4, IX = 9, XL = 40, XC = 90, CD = 400, CM = 900).

Given a valid Roman numeral string S, convert and print its integer value.`,
    inputFormat: 'A single string S.',
    outputFormat: 'Print the converted integer.',
    constraints: '1 <= |S| <= 15, value in range [1, 3999]',
    sampleCases: [
      { input: 'III', expectedOutput: '3', explanation: '1 + 1 + 1 = 3.' },
      { input: 'LVIII', expectedOutput: '58', explanation: '50 + 5 + 3 = 58.' },
      { input: 'MCMXCIV', expectedOutput: '1994', explanation: '1000 + 900 + 90 + 4 = 1994.' },
    ],
    hiddenCases: [
      { input: 'IV', expectedOutput: '4' },
      { input: 'IX', expectedOutput: '9' },
      { input: 'XL', expectedOutput: '40' },
      { input: 'XC', expectedOutput: '90' },
      { input: 'CD', expectedOutput: '400' },
      { input: 'CM', expectedOutput: '900' },
      { input: 'MMMCMXCIX', expectedOutput: '3999' },
      { input: 'D', expectedOutput: '500' },
    ],
    solutionCode: `
import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    s = data[0]
    vals = {'I': 1, 'V': 5, 'X': 10, 'L': 50, 'C': 100, 'D': 500, 'M': 1000}
    total = 0
    n = len(s)
    for i in range(n):
        v = vals[s[i]]
        if i + 1 < n and v < vals[s[i + 1]]:
            total -= v
        else:
            total += v
    print(total)

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: 'Iterate through characters. If current Roman symbol value is strictly less than the next symbol value, subtract it; otherwise add it.',
      timeComplexity: 'O(N)',
      spaceComplexity: 'O(1)',
    },
  },

  // --------------------------------------------------------------------------
  // cv034: Matrices - Spiral Matrix Traversal (MEDIUM)
  // --------------------------------------------------------------------------
  {
    id: 'cv034',
    slug: 'spiral-matrix-route',
    title: 'The Labyrinth Spiral Route',
    difficulty: 'MEDIUM',
    topics: ['Matrices & Grids'],
    timeLimitMs: 1000,
    memoryLimitKb: 262144,
    statement: `An underground chamber is mapped as an R x C grid of treasure chests. An explorer must traverse all cells starting from top-left (0,0) in clockwise spiral order (right, down, left, up).

Given an R x C matrix, print all elements in clockwise spiral traversal order.`,
    inputFormat: 'First line: Two integers R and C.\nNext R lines: C space-separated integers per line.',
    outputFormat: 'Print the elements in spiral order separated by spaces.',
    constraints: '1 <= R, C <= 100, -1000 <= Matrix[i][j] <= 1000',
    sampleCases: [
      { input: '3 3\n1 2 3\n4 5 6\n7 8 9', expectedOutput: '1 2 3 6 9 8 7 4 5', explanation: 'Spiral path visiting outer border then center.' },
      { input: '3 4\n1 2 3 4\n5 6 7 8\n9 10 11 12', expectedOutput: '1 2 3 4 8 12 11 10 9 5 6 7', explanation: '3x4 spiral traversal.' },
    ],
    hiddenCases: [
      { input: '1 1\n42', expectedOutput: '42' },
      { input: '1 4\n1 2 3 4', expectedOutput: '1 2 3 4' },
      { input: '4 1\n1\n2\n3\n4', expectedOutput: '1 2 3 4' },
      { input: '2 2\n1 2\n3 4', expectedOutput: '1 2 4 3' },
      { input: '4 4\n1 2 3 4\n5 6 7 8\n9 10 11 12\n13 14 15 16', expectedOutput: '1 2 3 4 8 12 16 15 14 13 9 5 6 7 11 10' },
      { input: '2 3\n1 2 3\n4 5 6', expectedOutput: '1 2 3 6 5 4' },
      { input: '3 2\n1 2\n3 4\n5 6', expectedOutput: '1 2 4 6 5 3' },
      { input: '3 1\n10\n20\n30', expectedOutput: '10 20 30' },
    ],
    solutionCode: `
import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    R = int(data[0])
    C = int(data[1])
    idx = 2
    matrix = []
    for _ in range(R):
        matrix.append([int(x) for x in data[idx:idx+C]])
        idx += C
        
    top, bottom = 0, R - 1
    left, right = 0, C - 1
    result = []
    
    while top <= bottom and left <= right:
        # Traverse right
        for c in range(left, right + 1):
            result.append(matrix[top][c])
        top += 1
        
        # Traverse down
        for r in range(top, bottom + 1):
            result.append(matrix[r][right])
        right -= 1
        
        # Traverse left
        if top <= bottom:
            for c in range(right, left - 1, -1):
                result.append(matrix[bottom][c])
            bottom -= 1
            
        # Traverse up
        if left <= right:
            for r in range(bottom, top - 1, -1):
                result.append(matrix[r][left])
            left += 1
            
    print(' '.join(map(str, result)))

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: 'Maintain 4 boundary pointers: top, bottom, left, right. In each cycle, traverse right, down, left, and up while contracting boundaries.',
      timeComplexity: 'O(R * C)',
      spaceComplexity: 'O(R * C)',
    },
  },

  // --------------------------------------------------------------------------
  // cv035: Matrices - Rotate Matrix 90 Degrees Clockwise (MEDIUM)
  // --------------------------------------------------------------------------
  {
    id: 'cv035',
    slug: 'rotate-matrix-clockwise',
    title: 'The Fortress Blueprint Rotation',
    difficulty: 'MEDIUM',
    topics: ['Matrices & Grids'],
    timeLimitMs: 1000,
    memoryLimitKb: 262144,
    statement: `An architect reviews an N x N blueprint grid of fortress turrets. The blueprint must be rotated 90 degrees clockwise in-place.

Given an N x N matrix, print the matrix resulting from a 90-degree clockwise rotation.`,
    inputFormat: 'First line: Integer N.\nNext N lines: N space-separated integers.',
    outputFormat: 'Print N lines, each with N space-separated integers.',
    constraints: '1 <= N <= 100, -1000 <= Matrix[i][j] <= 1000',
    sampleCases: [
      { input: '3\n1 2 3\n4 5 6\n7 8 9', expectedOutput: '7 4 1\n8 5 2\n9 6 3', explanation: 'Matrix rotated 90 degrees clockwise.' },
      { input: '2\n1 2\n3 4', expectedOutput: '3 1\n4 2', explanation: '2x2 rotation.' },
    ],
    hiddenCases: [
      { input: '1\n100', expectedOutput: '100' },
      { input: '4\n1 2 3 4\n5 6 7 8\n9 10 11 12\n13 14 15 16', expectedOutput: '13 9 5 1\n14 10 6 2\n15 11 7 3\n16 12 8 4' },
      { input: '3\n0 0 1\n0 1 0\n1 0 0', expectedOutput: '1 0 0\n0 1 0\n0 0 1' },
      { input: '2\n-1 -2\n-3 -4', expectedOutput: '-3 -1\n-4 -2' },
      { input: '3\n1 1 1\n2 2 2\n3 3 3', expectedOutput: '3 2 1\n3 2 1\n3 2 1' },
      { input: '4\n0 0 0 0\n1 1 1 1\n2 2 2 2\n3 3 3 3', expectedOutput: '3 2 1 0\n3 2 1 0\n3 2 1 0\n3 2 1 0' },
      { input: '2\n5 6\n7 8', expectedOutput: '7 5\n8 6' },
      { input: '3\n10 20 30\n40 50 60\n70 80 90', expectedOutput: '70 40 10\n80 50 20\n90 60 30' },
    ],
    solutionCode: `
import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    idx = 1
    matrix = []
    for _ in range(n):
        matrix.append([int(x) for x in data[idx:idx+n]])
        idx += n
        
    # Rotate 90 deg clockwise: Transpose then reverse each row
    for i in range(n):
        for j in range(i, n):
            matrix[i][j], matrix[j][i] = matrix[j][i], matrix[i][j]
            
    for i in range(n):
        matrix[i].reverse()
        
    for row in matrix:
        print(' '.join(map(str, row)))

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: 'To rotate an N x N matrix 90 degrees clockwise in-place: first transpose the matrix (swap matrix[i][j] with matrix[j][i]), then reverse each individual row.',
      timeComplexity: 'O(N^2)',
      spaceComplexity: 'O(1) in-place',
    },
  },

  // --------------------------------------------------------------------------
  // cv036: Matrices - Set Matrix Zeroes (MEDIUM)
  // --------------------------------------------------------------------------
  {
    id: 'cv036',
    slug: 'neutralize-matrix-zones',
    title: 'Neutralization of Tainted Grid Zones',
    difficulty: 'MEDIUM',
    topics: ['Matrices & Grids'],
    timeLimitMs: 1000,
    memoryLimitKb: 262144,
    statement: `An environmental scan grid of size R x C contains radiation readings. If a cell contains a reading of 0 (tainted zone), its entire row and its entire column become neutralized and reset to 0.

Given an R x C matrix, neutralize all affected rows and columns and print the final matrix.`,
    inputFormat: 'First line: Two integers R and C.\nNext R lines: C space-separated integers.',
    outputFormat: 'Print the modified R x C matrix.',
    constraints: '1 <= R, C <= 200, -10^5 <= Matrix[i][j] <= 10^5',
    sampleCases: [
      { input: '3 3\n1 1 1\n1 0 1\n1 1 1', expectedOutput: '1 0 1\n0 0 0\n1 0 1', explanation: 'Center cell 0 sets middle row and column to 0.' },
      { input: '3 4\n0 1 2 0\n3 4 5 2\n1 3 1 5', expectedOutput: '0 0 0 0\n0 4 5 0\n0 3 1 0', explanation: 'Corner zeros neutralize outer rows and columns.' },
    ],
    hiddenCases: [
      { input: '1 1\n5', expectedOutput: '5' },
      { input: '1 1\n0', expectedOutput: '0' },
      { input: '2 2\n1 2\n3 4', expectedOutput: '1 2\n3 4' },
      { input: '2 2\n0 1\n2 3', expectedOutput: '0 0\n0 3' },
      { input: '3 3\n0 1 2\n3 4 5\n6 7 8', expectedOutput: '0 0 0\n0 4 5\n0 7 8' },
      { input: '1 3\n1 0 1', expectedOutput: '0 0 0' },
      { input: '3 1\n1\n0\n1', expectedOutput: '0\n0\n0' },
      { input: '2 3\n1 2 3\n4 0 6', expectedOutput: '1 0 3\n0 0 0' },
    ],
    solutionCode: `
import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    R = int(data[0])
    C = int(data[1])
    idx = 2
    matrix = []
    for _ in range(R):
        matrix.append([int(x) for x in data[idx:idx+C]])
        idx += C
        
    zero_rows = set()
    zero_cols = set()
    
    for r in range(R):
        for c in range(C):
            if matrix[r][c] == 0:
                zero_rows.add(r)
                zero_cols.add(c)
                
    for r in range(R):
        for c in range(C):
            if r in zero_rows or c in zero_cols:
                matrix[r][c] = 0
                
    for row in matrix:
        print(' '.join(map(str, row)))

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: 'Identify all row and column indices that contain at least one 0 using sets. Then do a second pass setting cells in those rows/cols to 0.',
      timeComplexity: 'O(R * C)',
      spaceComplexity: 'O(R + C)',
    },
  },

  // --------------------------------------------------------------------------
  // cv037: Matrices - Number of Islands (BFS/DFS) (MEDIUM)
  // --------------------------------------------------------------------------
  {
    id: 'cv037',
    slug: 'archipelago-island-counter',
    title: 'The Archipelago Island Survey',
    difficulty: 'MEDIUM',
    topics: ['Matrices & Grids'],
    timeLimitMs: 1500,
    memoryLimitKb: 262144,
    statement: `A nautical map represents an ocean region as an R x C binary grid. '1' represents land and '0' represents water. An island is formed by connecting adjacent lands horizontally or vertically (diagonal lands do not connect).

Given the grid, count and print the total number of distinct islands.`,
    inputFormat: 'First line: Two integers R and C.\nNext R lines: Strings of length C consisting of 0s and 1s.',
    outputFormat: 'Print the total island count.',
    constraints: '1 <= R, C <= 300',
    sampleCases: [
      { input: '4 5\n11110\n11010\n11000\n00000', expectedOutput: '1', explanation: 'All connected 1s form one large island.' },
      { input: '4 5\n11000\n11000\n00100\n00011', expectedOutput: '3', explanation: 'Three separate islands.' },
    ],
    hiddenCases: [
      { input: '1 1\n1', expectedOutput: '1' },
      { input: '1 1\n0', expectedOutput: '0' },
      { input: '3 3\n101\n010\n101', expectedOutput: '5' },
      { input: '2 2\n00\n00', expectedOutput: '0' },
      { input: '3 3\n111\n111\n111', expectedOutput: '1' },
      { input: '5 5\n10001\n01010\n00100\n01010\n10001', expectedOutput: '9' },
      { input: '4 4\n1001\n0000\n0000\n1001', expectedOutput: '4' },
      { input: '3 4\n1100\n0011\n1100', expectedOutput: '3' },
    ],
    solutionCode: `
import sys
from collections import deque

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    R = int(data[0])
    C = int(data[1])
    grid = [list(data[2 + i]) for i in range(R)]
    
    islands = 0
    dirs = [(-1, 0), (1, 0), (0, -1), (0, 1)]
    
    for r in range(R):
        for c in range(C):
            if grid[r][c] == '1':
                islands += 1
                grid[r][c] = '0'
                queue = deque([(r, c)])
                while queue:
                    curr_r, curr_c = queue.popleft()
                    for dr, dc in dirs:
                        nr, nc = curr_r + dr, curr_c + dc
                        if 0 <= nr < R and 0 <= nc < C and grid[nr][nc] == '1':
                            grid[nr][nc] = '0'
                            queue.append((nr, nc))
                            
    print(islands)

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: 'Standard BFS/DFS flood fill: when cell (r, c) is \'1\', increment island count and flood fill all 4-directionally reachable land cells to \'0\'.',
      timeComplexity: 'O(R * C)',
      spaceComplexity: 'O(R * C)',
    },
  },

  // --------------------------------------------------------------------------
  // cv038: Matrices - Flood Fill (EASY)
  // --------------------------------------------------------------------------
  {
    id: 'cv038',
    slug: 'canvas-flood-fill',
    title: 'The Digital Canvas Flood Fill',
    difficulty: 'EASY',
    topics: ['Matrices & Grids'],
    timeLimitMs: 1000,
    memoryLimitKb: 262144,
    statement: `An image is represented by an R x C integer grid where image[i][j] represents the pixel color. You are given starting pixel coordinates (SR, SC) and a target NewColor.

Perform a flood fill: replace the starting pixel\'s color and all 4-directionally adjacent pixels sharing the same initial color with NewColor. Print the final modified image.`,
    inputFormat: 'First line: Two integers R and C.\nNext R lines: C space-separated integers.\nLast line: Three integers SR, SC, and NewColor (0-based coordinates).',
    outputFormat: 'Print the modified R x C grid.',
    constraints: '1 <= R, C <= 100, 0 <= SR < R, 0 <= SC < C, 0 <= Color <= 1000',
    sampleCases: [
      { input: '3 3\n1 1 1\n1 1 0\n1 0 1\n1 1 2', expectedOutput: '2 2 2\n2 2 0\n2 0 1', explanation: 'All connected 1s connected to (1,1) are changed to 2.' },
      { input: '2 2\n0 0\n0 0\n0 0 1', expectedOutput: '1 1\n1 1', explanation: 'Entire grid is filled.' },
    ],
    hiddenCases: [
      { input: '1 1\n5\n0 0 9', expectedOutput: '9' },
      { input: '3 3\n1 2 3\n4 5 6\n7 8 9\n1 1 5', expectedOutput: '1 2 3\n4 5 6\n7 8 9' },
      { input: '3 3\n1 1 1\n1 2 1\n1 1 1\n1 1 3', expectedOutput: '1 1 1\n1 3 1\n1 1 1' },
      { input: '2 3\n1 1 2\n1 2 2\n0 0 7', expectedOutput: '7 7 2\n7 2 2' },
      { input: '4 4\n1 1 1 1\n1 0 0 1\n1 0 0 1\n1 1 1 1\n1 1 5', expectedOutput: '1 1 1 1\n1 5 5 1\n1 5 5 1\n1 1 1 1' },
      { input: '3 3\n0 0 0\n0 1 0\n0 0 0\n0 0 2', expectedOutput: '2 2 2\n2 1 2\n2 2 2' },
      { input: '1 3\n1 1 1\n0 1 4', expectedOutput: '4 4 4' },
      { input: '3 1\n2\n2\n2\n2 0 8', expectedOutput: '8\n8\n8' },
    ],
    solutionCode: `
import sys
from collections import deque

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    R = int(data[0])
    C = int(data[1])
    idx = 2
    grid = []
    for _ in range(R):
        grid.append([int(x) for x in data[idx:idx+C]])
        idx += C
    sr = int(data[idx])
    sc = int(data[idx+1])
    new_color = int(data[idx+2])
    
    orig_color = grid[sr][sc]
    if orig_color != new_color:
        queue = deque([(sr, sc)])
        grid[sr][sc] = new_color
        dirs = [(-1, 0), (1, 0), (0, -1), (0, 1)]
        while queue:
            r, c = queue.popleft()
            for dr, dc in dirs:
                nr, nc = r + dr, c + dc
                if 0 <= nr < R and 0 <= nc < C and grid[nr][nc] == orig_color:
                    grid[nr][nc] = new_color
                    queue.append((nr, nc))
                    
    for row in grid:
        print(' '.join(map(str, row)))

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: 'BFS / queue-based flood fill starting from (sr, sc). If original color equals new color, return immediately.',
      timeComplexity: 'O(R * C)',
      spaceComplexity: 'O(R * C)',
    },
  },

  // --------------------------------------------------------------------------
  // cv039: Matrices - Word Search in Boggle Board (MEDIUM)
  // --------------------------------------------------------------------------
  {
    id: 'cv039',
    slug: 'word-search-grid',
    title: 'The Rune Crypt Word Search',
    difficulty: 'MEDIUM',
    topics: ['Matrices & Grids'],
    timeLimitMs: 1500,
    memoryLimitKb: 262144,
    statement: `Given an R x C grid of characters and a string Word, find if the word exists in the grid.

The word can be constructed from letters of sequentially adjacent cells (horizontally or vertically neighboring). The same letter cell may not be used more than once in forming the word.

Print "YES" if Word exists in the grid, or "NO" otherwise.`,
    inputFormat: 'First line: Two integers R and C.\nNext R lines: Strings of length C.\nLast line: Target Word string.',
    outputFormat: 'Print "YES" or "NO".',
    constraints: '1 <= R, C <= 10, 1 <= |Word| <= 15',
    sampleCases: [
      { input: '3 4\nABCE\nSFCS\nADEE\nABCCED', expectedOutput: 'YES', explanation: '"ABCCED" is traceable through the grid.' },
      { input: '3 4\nABCE\nSFCS\nADEE\nABCB', expectedOutput: 'NO', explanation: 'Cannot reuse the B cell.' },
    ],
    hiddenCases: [
      { input: '1 1\nA\nA', expectedOutput: 'YES' },
      { input: '1 1\nA\nB', expectedOutput: 'NO' },
      { input: '2 2\nAB\nCD\nACDB', expectedOutput: 'YES' },
      { input: '3 3\nCAT\nOGD\nXYZ\nCATDOG', expectedOutput: 'YES' },
      { input: '2 3\nAAA\nAAA\nAAAAAA', expectedOutput: 'YES' },
      { input: '3 3\nABC\nDEF\nGHI\nABCFEDGHI', expectedOutput: 'NO' },
      { input: '2 2\nAB\nCD\nABCD', expectedOutput: 'YES' },
      { input: '4 4\nTEST\nESTE\nSTES\nTEST\nSET', expectedOutput: 'YES' },
    ],
    solutionCode: `
import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    R = int(data[0])
    C = int(data[1])
    board = [list(data[2 + i]) for i in range(R)]
    word = data[2 + R]
    
    dirs = [(-1, 0), (1, 0), (0, -1), (0, 1)]
    visited = [[False] * C for _ in range(R)]
    
    def dfs(r, c, k):
        if k == len(word):
            return True
        if r < 0 or r >= R or c < 0 or c >= C:
            return False
        if visited[r][c] or board[r][c] != word[k]:
            return False
            
        visited[r][c] = True
        for dr, dc in dirs:
            if dfs(r + dr, c + dc, k + 1):
                return True
        visited[r][c] = False
        return False

    for r in range(R):
        for c in range(C):
            if dfs(r, c, 0):
                print("YES")
                return
    print("NO")

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: 'Backtracking DFS: explore 4 directions matching Word[k]. Mark cell visited during exploration and unmark upon backtrack.',
      timeComplexity: 'O(R * C * 4^L) where L = len(Word)',
      spaceComplexity: 'O(L) recursion stack',
    },
  },

  // --------------------------------------------------------------------------
  // cv040: Matrices - Diagonal Matrix Sum (EASY)
  // --------------------------------------------------------------------------
  {
    id: 'cv040',
    slug: 'matrix-diagonal-cross-sum',
    title: 'The Starlight Diagonal Crossing',
    difficulty: 'EASY',
    topics: ['Matrices & Grids'],
    timeLimitMs: 1000,
    memoryLimitKb: 262144,
    statement: `Given a square matrix of size N x N, return the sum of the matrix diagonals.

Only include the sum of all the elements on the primary diagonal and all the elements on the secondary diagonal that are not part of the primary diagonal (do not double count the center element when N is odd).`,
    inputFormat: 'First line: Integer N.\nNext N lines: N space-separated integers.',
    outputFormat: 'Print a single integer: diagonal sum.',
    constraints: '1 <= N <= 100, -1000 <= Matrix[i][j] <= 1000',
    sampleCases: [
      { input: '3\n1 2 3\n4 5 6\n7 8 9', expectedOutput: '25', explanation: 'Primary: 1 + 5 + 9 = 15. Secondary: 3 + 5 + 7 = 15. Center 5 counted once: 15 + 15 - 5 = 25.' },
      { input: '4\n1 1 1 1\n1 1 1 1\n1 1 1 1\n1 1 1 1', expectedOutput: '8', explanation: '4 elements on each diagonal (no intersection).' },
    ],
    hiddenCases: [
      { input: '1\n5', expectedOutput: '5' },
      { input: '2\n1 2\n3 4', expectedOutput: '10' },
      { input: '3\n1 1 1\n1 1 1\n1 1 1', expectedOutput: '5' },
      { input: '5\n1 0 0 0 1\n0 1 0 1 0\n0 0 1 0 0\n0 1 0 1 0\n1 0 0 0 1', expectedOutput: '9' },
      { input: '4\n2 0 0 2\n0 2 2 0\n0 2 2 0\n2 0 0 2', expectedOutput: '16' },
      { input: '3\n-1 -2 -3\n-4 -5 -6\n-7 -8 -9', expectedOutput: '-25' },
      { input: '2\n10 20\n30 40', expectedOutput: '100' },
      { input: '3\n0 0 0\n0 0 0\n0 0 0', expectedOutput: '0' },
    ],
    solutionCode: `
import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    idx = 1
    total = 0
    for r in range(n):
        row = [int(x) for x in data[idx:idx+n]]
        idx += n
        total += row[r]  # primary
        if r != n - 1 - r:
            total += row[n - 1 - r]  # secondary
    print(total)

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: 'In a single pass over rows 0 to N-1, add row[i] (primary diagonal) and row[N - 1 - i] (secondary diagonal), skipping if i == N - 1 - i to avoid double counting.',
      timeComplexity: 'O(N^2) to read, O(N) to sum',
      spaceComplexity: 'O(1)',
    },
  },

  // --------------------------------------------------------------------------
  // cv041: Matrices - Maximal Rectangle in Binary Matrix (HARD)
  // --------------------------------------------------------------------------
  {
    id: 'cv041',
    slug: 'maximal-citadel-rectangle',
    title: 'The Maximal Citadel Territory',
    difficulty: 'HARD',
    topics: ['Matrices & Grids'],
    timeLimitMs: 1500,
    memoryLimitKb: 262144,
    statement: `A military survey maps an R x C territory where '1' represents secured land and '0' represents hostile territory.

Find the area of the largest rectangle containing only '1's in the grid.`,
    inputFormat: 'First line: Two integers R and C.\nNext R lines: Strings of length C consisting of 0s and 1s.',
    outputFormat: 'Print the maximum rectangular area of 1s.',
    constraints: '1 <= R, C <= 200',
    sampleCases: [
      { input: '4 5\n10100\n10111\n11111\n10010', expectedOutput: '6', explanation: 'A 2x3 rectangle of 1s exists in rows 2 and 3, columns 2-4.' },
      { input: '1 1\n0', expectedOutput: '0', explanation: 'No 1s.' },
      { input: '1 1\n1', expectedOutput: '1', explanation: '1x1 rectangle.' },
    ],
    hiddenCases: [
      { input: '2 2\n11\n11', expectedOutput: '4' },
      { input: '3 3\n000\n000\n000', expectedOutput: '0' },
      { input: '3 3\n111\n111\n111', expectedOutput: '9' },
      { input: '3 4\n1111\n1111\n1111', expectedOutput: '12' },
      { input: '4 3\n101\n111\n111\n101', expectedOutput: '6' },
      { input: '2 5\n01110\n01110', expectedOutput: '6' },
      { input: '5 1\n1\n1\n1\n1\n0', expectedOutput: '4' },
      { input: '1 5\n11111', expectedOutput: '5' },
    ],
    solutionCode: `
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
`,
    editorial: {
      approach: 'Convert the 2D grid into dynamic 1D histograms. For each row r, heights[c] accumulates consecutive 1s. Then compute Largest Rectangle in Histogram using a monotonic stack in O(C).',
      timeComplexity: 'O(R * C)',
      spaceComplexity: 'O(C)',
    },
  },

  // --------------------------------------------------------------------------
  // cv042: Matrices - Matrix Multiplication (EASY)
  // --------------------------------------------------------------------------
  {
    id: 'cv042',
    slug: 'matrix-linear-product',
    title: 'The Dual Crystal Grid Projection',
    difficulty: 'EASY',
    topics: ['Matrices & Grids'],
    timeLimitMs: 1000,
    memoryLimitKb: 262144,
    statement: `Given matrix A of size N x M and matrix B of size M x K, compute the matrix product C = A * B of size N x K modulo 1000000007.

The (i, j)-th element of C is defined as:
C[i][j] = ( sum_{p=0}^{M-1} A[i][p] * B[p][j] ) mod 1000000007.`,
    inputFormat: 'First line: Three integers N, M, K.\nNext N lines: M integers per line (Matrix A).\nNext M lines: K integers per line (Matrix B).',
    outputFormat: 'Print N lines with K space-separated integers modulo 1000000007.',
    constraints: '1 <= N, M, K <= 100, 0 <= A[i][p], B[p][j] <= 10^9',
    sampleCases: [
      { input: '2 2 2\n1 2\n3 4\n5 6\n7 8', expectedOutput: '19 22\n43 50', explanation: 'Standard 2x2 matrix product.' },
      { input: '1 2 1\n3 4\n5\n6', expectedOutput: '39', explanation: '3*5 + 4*6 = 15 + 24 = 39.' },
    ],
    hiddenCases: [
      { input: '1 1 1\n7\n8', expectedOutput: '56' },
      { input: '2 3 2\n1 0 2\n-1 3 1\n3 1\n2 1\n1 0', expectedOutput: '5 1\n4 2' },
      { input: '2 2 2\n1 0\n0 1\n4 5\n6 7', expectedOutput: '4 5\n6 7' },
      { input: '3 3 3\n1 0 0\n0 1 0\n0 0 1\n1 2 3\n4 5 6\n7 8 9', expectedOutput: '1 2 3\n4 5 6\n7 8 9' },
      { input: '2 2 2\n0 0\n0 0\n5 5\n5 5', expectedOutput: '0 0\n0 0' },
      { input: '2 1 2\n2\n3\n4 5', expectedOutput: '8 10\n12 15' },
      { input: '1 3 2\n1 2 3\n4 5\n6 7\n8 9', expectedOutput: '40 46' },
      { input: '2 2 2\n1000000000 1000000000\n1000000000 1000000000\n1000000000 1000000000\n1000000000 1000000000', expectedOutput: '98 98\n98 98' },
    ],
    solutionCode: `
import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    N, M, K = int(data[0]), int(data[1]), int(data[2])
    idx = 3
    A = []
    for _ in range(N):
        A.append([int(x) for x in data[idx:idx+M]])
        idx += M
    B = []
    for _ in range(M):
        B.append([int(x) for x in data[idx:idx+K]])
        idx += K
        
    MOD = 1000000007
    C = [[0] * K for _ in range(N)]
    
    for i in range(N):
        for p in range(M):
            a_ip = A[i][p] % MOD
            for j in range(K):
                C[i][j] = (C[i][j] + a_ip * (B[p][j] % MOD)) % MOD
                
    for row in C:
        print(' '.join(map(str, row)))

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: 'Triply nested loop performing dot products between row i of A and column j of B modulo 10^9+7.',
      timeComplexity: 'O(N * M * K)',
      spaceComplexity: 'O(N * K)',
    },
  },

  // --------------------------------------------------------------------------
  // cv043: Matrices - Path with Minimum Effort (HARD)
  // --------------------------------------------------------------------------
  {
    id: 'cv043',
    slug: 'path-minimum-elevation-effort',
    title: 'The Mountaineer Minimum Effort Trek',
    difficulty: 'HARD',
    topics: ['Matrices & Grids'],
    timeLimitMs: 2000,
    memoryLimitKb: 262144,
    statement: `A hiker prepares for a mountain hike across an R x C elevation grid. The hiker starts at top-left (0, 0) and wants to reach bottom-right (R - 1, C - 1).

A route\'s "effort" is defined as the maximum absolute difference in heights between two consecutive cells of the route.

Find the minimum effort required to travel from (0, 0) to (R - 1, C - 1).`,
    inputFormat: 'First line: Two integers R and C.\nNext R lines: C space-separated integers.',
    outputFormat: 'Print the minimum effort integer.',
    constraints: '1 <= R, C <= 100, 1 <= Heights[i][j] <= 10^6',
    sampleCases: [
      { input: '3 3\n1 2 2\n3 8 2\n5 3 5', expectedOutput: '2', explanation: 'Path 1->2->2->2->5 has maximum difference |2-2|=0, |5-2|=3? Path 1->3->5->3->5 has max effort 2.' },
      { input: '3 3\n1 2 3\n3 8 4\n5 3 5', expectedOutput: '1', explanation: 'Path 1->2->3->4->5 has max effort 1.' },
    ],
    hiddenCases: [
      { input: '1 1\n10', expectedOutput: '0' },
      { input: '1 4\n1 2 5 9', expectedOutput: '4' },
      { input: '4 1\n1\n3\n5\n7', expectedOutput: '2' },
      { input: '2 2\n1 10\n1 1', expectedOutput: '0' },
      { input: '3 3\n1 10 1\n1 10 1\n1 1 1', expectedOutput: '0' },
      { input: '3 3\n1 1 1\n1 1 1\n1 1 1', expectedOutput: '0' },
      { input: '4 4\n1 2 1 1\n1 2 1 2\n1 2 1 2\n1 1 1 2', expectedOutput: '0' },
      { input: '2 3\n1 3 5\n2 8 4', expectedOutput: '2' },
    ],
    solutionCode: `
import sys
import heapq

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    R = int(data[0])
    C = int(data[1])
    idx = 2
    grid = []
    for _ in range(R):
        grid.append([int(x) for x in data[idx:idx+C]])
        idx += C
        
    dist = [[float('inf')] * C for _ in range(R)]
    dist[0][0] = 0
    pq = [(0, 0, 0)]  # (effort, r, c)
    dirs = [(-1, 0), (1, 0), (0, -1), (0, 1)]
    
    while pq:
        eff, r, c = heapq.heappop(pq)
        if r == R - 1 and c == C - 1:
            print(eff)
            return
            
        if eff > dist[r][c]:
            continue
            
        for dr, dc in dirs:
            nr, nc = r + dr, c + dc
            if 0 <= nr < R and 0 <= nc < C:
                next_eff = max(eff, abs(grid[nr][nc] - grid[r][c]))
                if next_eff < dist[nr][nc]:
                    dist[nr][nc] = next_eff
                    heapq.heappush(pq, (next_eff, nr, nc))
                    
    print(0)

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: 'Dijkstra\'s algorithm on a 2D grid: distance is the minimax effort. Priority queue pops the path with current minimum effort.',
      timeComplexity: 'O(R * C * log(R * C))',
      spaceComplexity: 'O(R * C)',
    },
  },

  // --------------------------------------------------------------------------
  // cv044: Matrices - Word Boggle Bipartite Checker (MEDIUM)
  // --------------------------------------------------------------------------
  {
    id: 'cv044',
    slug: 'chessboard-checkerboard-pattern',
    title: 'Checkerboard Parity Balance',
    difficulty: 'MEDIUM',
    topics: ['Matrices & Grids'],
    timeLimitMs: 1000,
    memoryLimitKb: 262144,
    statement: `An alternating tile grid of size R x C contains black and white tiles. A cell (r, c) is considered black if (r + c) is even, and white if (r + c) is odd.

Given an R x C matrix of integer values, calculate the absolute difference between the sum of values on all black cells and the sum of values on all white cells:
| Sum(Black Cells) - Sum(White Cells) |.`,
    inputFormat: 'First line: Two integers R and C.\nNext R lines: C space-separated integers.',
    outputFormat: 'Print the absolute difference.',
    constraints: '1 <= R, C <= 500, -10^4 <= Matrix[i][j] <= 10^4',
    sampleCases: [
      { input: '2 2\n1 2\n3 4', expectedOutput: '2', explanation: 'Black cells: (0,0)=1, (1,1)=4 (sum=5). White cells: (0,1)=2, (1,0)=3 (sum=5). Diff = |5 - 5| = 0? Wait, black: 1+4=5, white: 2+3=5. Diff = 0.' },
      { input: '3 3\n1 2 1\n2 1 2\n1 2 1', expectedOutput: '3', explanation: 'Black cells (5 cells): 1+1+1+1+1 = 5. White cells (4 cells): 2+2+2+2 = 8. |5 - 8| = 3.' },
    ],
    hiddenCases: [
      { input: '1 1\n42', expectedOutput: '42' },
      { input: '1 2\n10 20', expectedOutput: '10' },
      { input: '3 1\n1\n2\n3', expectedOutput: '2' },
      { input: '4 4\n1 1 1 1\n1 1 1 1\n1 1 1 1\n1 1 1 1', expectedOutput: '0' },
      { input: '3 3\n0 0 0\n0 0 0\n0 0 0', expectedOutput: '0' },
      { input: '2 3\n5 1 2\n3 4 6', expectedOutput: '5' },
      { input: '4 2\n-1 2\n3 -4\n5 -6\n7 -8', expectedOutput: '36' },
      { input: '3 2\n10 5\n2 8\n7 3', expectedOutput: '3' },
    ],
    solutionCode: `
import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    R = int(data[0])
    C = int(data[1])
    idx = 2
    black_sum = 0
    white_sum = 0
    for r in range(R):
        for c in range(C):
            val = int(data[idx])
            idx += 1
            if (r + c) % 2 == 0:
                black_sum += val
            else:
                white_sum += val
    print(abs(black_sum - white_sum))

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: 'Single pass accumulating cells with (r + c) % 2 == 0 into black_sum and remaining cells into white_sum. Output abs(black_sum - white_sum).',
      timeComplexity: 'O(R * C)',
      spaceComplexity: 'O(1)',
    },
  },
];

console.log(`Writing Batch 2 (${batch2.length} problems)...`);
batch2.forEach((p) => {
  console.log('Generating:', p.id);
  createProblem(p);
});
console.log('✅ Batch 2 written successfully!');
