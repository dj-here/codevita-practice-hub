const { createProblem } = require('./problem-helper');

const problems = [
  // --------------------------------------------------------------------------
  // cv133: Strings - Rabin-Karp Rolling Hash (MEDIUM)
  // --------------------------------------------------------------------------
  {
    id: 'cv133',
    slug: 'rabin-karp-rolling-hash',
    title: 'The Alchemical Signature Pattern Search',
    difficulty: 'MEDIUM',
    topics: ['Strings & Parsing'],
    timeLimitMs: 1500,
    memoryLimitKb: 262144,
    statement: `Given a text string T and a pattern string P, find all 0-based starting indices where pattern P occurs in text T.
Use the Rabin-Karp rolling hash algorithm to perform linear-time pattern matching.

Print the starting indices space-separated in ascending order. If the pattern does not occur in text T, print -1.`,
    inputFormat: 'First line: Text string T.\nSecond line: Pattern string P.',
    outputFormat: 'Print space-separated starting indices, or -1.',
    constraints: '1 <= len(P) <= len(T) <= 100000\nStrings contain English letters.',
    sampleCases: [
      { input: 'AABAACAADAABAABA\nAABA', expectedOutput: '0 9 12', explanation: 'Pattern "AABA" occurs at indices 0, 9, and 12.' },
      { input: 'HELLO\nWORLD', expectedOutput: '-1', explanation: '"WORLD" does not occur in "HELLO".' },
    ],
    hiddenCases: [
      { input: 'A\nA' },
      { input: 'AAAAA\nAA' },
      { input: 'ABCDEF\nCDE' },
      { input: 'CODEVITA2026CODEVITA\nCODEVITA' },
      { input: 'BANANA\nANA' },
      { input: 'ABABABAB\nABA' },
      { input: 'XYZ\nA' },
      { input: 'TCSCODEVITAPRACTICEHUB\nPRACTICE' },
    ],
    solutionCode: `
import sys

def solve():
    lines = sys.stdin.read().split()
    if len(lines) < 2:
        return
    text = lines[0]
    pattern = lines[1]
    
    n = len(text)
    m = len(pattern)
    if m > n:
        print("-1")
        return
        
    BASE = 257
    MOD = 1000000007
    
    pat_hash = 0
    curr_hash = 0
    power = 1
    
    for i in range(m):
        pat_hash = (pat_hash * BASE + ord(pattern[i])) % MOD
        curr_hash = (curr_hash * BASE + ord(text[i])) % MOD
        if i < m - 1:
            power = (power * BASE) % MOD
            
    matches = []
    for i in range(n - m + 1):
        if curr_hash == pat_hash:
            if text[i:i+m] == pattern:
                matches.append(i)
        if i < n - m:
            curr_hash = (curr_hash - ord(text[i]) * power) % MOD
            curr_hash = (curr_hash * BASE + ord(text[i + m])) % MOD
            curr_hash = (curr_hash + MOD) % MOD
            
    if matches:
        print(' '.join(map(str, matches)))
    else:
        print("-1")

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: 'Rabin-Karp rolling hash: update O(1) hash using sliding window polynomial modulus to find all pattern occurrences.',
      timeComplexity: 'O(N + M)',
      spaceComplexity: 'O(1)',
    },
  },

  // --------------------------------------------------------------------------
  // cv134: Strings - Lexicographical Rank String (HARD)
  // --------------------------------------------------------------------------
  {
    id: 'cv134',
    slug: 'lexicographical-rank-string',
    title: 'The Lexicographical Permutation Rank',
    difficulty: 'HARD',
    topics: ['Strings & Parsing'],
    timeLimitMs: 1500,
    memoryLimitKb: 262144,
    statement: `Given a string S containing distinct lowercase English letters, compute its 1-based lexicographical rank among all possible permutations of its letters.
Because the total number of permutations can be large, print the rank modulo 10^9 + 7.`,
    inputFormat: 'A single string S of unique lowercase letters.',
    outputFormat: 'Print the rank modulo 1000000007.',
    constraints: '1 <= len(S) <= 1000\nAll characters in S are distinct.',
    sampleCases: [
      { input: 'cba', expectedOutput: '6', explanation: 'Permutations of "abc": abc (1), acb (2), bac (3), bca (4), cab (5), cba (6).' },
      { input: 'string', expectedOutput: '598', explanation: 'Lexicographical rank of "string" is 598.' },
    ],
    hiddenCases: [
      { input: 'a' },
      { input: 'ba' },
      { input: 'abc' },
      { input: 'bca' },
      { input: 'dcba' },
      { input: 'zyxwvutsrq' },
      { input: 'codevita' },
      { input: 'algorithm' },
    ],
    solutionCode: `
import sys

MOD = 1000000007

def solve():
    s = sys.stdin.read().strip()
    if not s:
        return
    n = len(s)
    
    fact = [1] * (n + 1)
    for i in range(1, n + 1):
        fact[i] = (fact[i - 1] * i) % MOD
        
    rank = 1
    chars = sorted(list(s))
    
    for i, c in enumerate(s):
        smaller = 0
        for x in chars:
            if x < c:
                smaller += 1
            else:
                break
        rank = (rank + smaller * fact[n - 1 - i]) % MOD
        chars.remove(c)
        
    print(rank)

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: 'Factorial counting: at each index, count remaining available characters smaller than current, scaled by (remaining - 1)! modulo 10^9+7.',
      timeComplexity: 'O(N^2)',
      spaceComplexity: 'O(N)',
    },
  },

  // --------------------------------------------------------------------------
  // cv135: Strings - Bracket Depth Score Evaluator (MEDIUM)
  // --------------------------------------------------------------------------
  {
    id: 'cv135',
    slug: 'bracket-depth-score-evaluator',
    title: 'The Hierarchical Bracket Resonance Score',
    difficulty: 'MEDIUM',
    topics: ['Strings & Parsing'],
    timeLimitMs: 1000,
    memoryLimitKb: 262144,
    statement: `Given a balanced parentheses string S, compute the score of the string based on the following rules:
- "()" has score 1.
- AB has score A + B, where A and B are balanced parentheses strings.
- (A) has score 2 * A, where A is a balanced parentheses string.`,
    inputFormat: 'A single string S containing a balanced parenthesis sequence.',
    outputFormat: 'Print the total score.',
    constraints: '2 <= len(S) <= 50',
    sampleCases: [
      { input: '()', expectedOutput: '1', explanation: 'Single pair has score 1.' },
      { input: '(())', expectedOutput: '2', explanation: '2 * score("()") = 2 * 1 = 2.' },
    ],
    hiddenCases: [
      { input: '()()' },
      { input: '(()(()))' },
      { input: '((()))' },
      { input: '(()())' },
      { input: '((()()))' },
      { input: '()()()()' },
      { input: '((()())(()))' },
      { input: '((((()))))' },
    ],
    solutionCode: `
import sys

def solve():
    s = sys.stdin.read().strip()
    if not s:
        return
        
    stack = [0]
    for c in s:
        if c == '(':
            stack.append(0)
        else:
            val = stack.pop()
            score = max(2 * val, 1)
            stack[-1] += score
            
    print(stack[0])

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: 'Stack-based evaluator: pushing 0 on \'(\', and on \')\', replacing the popped value with max(2 * v, 1) and accumulating into parent.',
      timeComplexity: 'O(N)',
      spaceComplexity: 'O(N)',
    },
  },

  // --------------------------------------------------------------------------
  // cv136: Strings - Longest Chunked Palindrome (HARD)
  // --------------------------------------------------------------------------
  {
    id: 'cv136',
    slug: 'longest-chunked-palindrome-decomposition',
    title: 'The Chunked Palindromic Scroll Decomposition',
    difficulty: 'HARD',
    topics: ['Strings & Parsing'],
    timeLimitMs: 1000,
    memoryLimitKb: 262144,
    statement: `You are given a string text. You should split it into K substrings (subtext_1, subtext_2, ..., subtext_K) such that:
- subtext_1 + subtext_2 + ... + subtext_K = text.
- subtext_i == subtext_{K + 1 - i} for all valid i in 1..K.

Find the largest possible value of K.`,
    inputFormat: 'A single string text.',
    outputFormat: 'Print the maximum number of chunks K.',
    constraints: '1 <= len(text) <= 1000\nContains only lowercase English letters.',
    sampleCases: [
      { input: 'ghiabcdefhelloadamhelloabcdefghi', expectedOutput: '7', explanation: 'Chunks: (ghi)(abcdef)(hello)(adam)(hello)(abcdef)(ghi) -> 7 chunks.' },
      { input: 'merchant', expectedOutput: '1', explanation: 'Cannot be split; K = 1.' },
    ],
    hiddenCases: [
      { input: 'a' },
      { input: 'aa' },
      { input: 'aaa' },
      { input: 'antaprezatepzapreanta' },
      { input: 'elvntoelvnto' },
      { input: 'codevitacodevita' },
      { input: 'abccba' },
      { input: 'volvo' },
    ],
    solutionCode: `
import sys

def solve():
    text = sys.stdin.read().strip()
    if not text:
        return
        
    n = len(text)
    left, right = 0, n - 1
    l_chunk, r_chunk = "", ""
    k = 0
    
    while left < right:
        l_chunk += text[left]
        r_chunk = text[right] + r_chunk
        if l_chunk == r_chunk:
            k += 2
            l_chunk = ""
            r_chunk = ""
        left += 1
        right -= 1
        
    if left == right or l_chunk != "":
        k += 1
        
    print(k)

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: 'Greedy two pointers: match the shortest symmetric prefix and suffix substrings from both ends.',
      timeComplexity: 'O(N^2)',
      spaceComplexity: 'O(N)',
    },
  },

  // --------------------------------------------------------------------------
  // cv137: Strings - Decode Run-Length Nested Strings (MEDIUM)
  // --------------------------------------------------------------------------
  {
    id: 'cv137',
    slug: 'decode-run-length-nested-strings',
    title: 'The Recursive Compression Decompressor',
    difficulty: 'MEDIUM',
    topics: ['Strings & Parsing'],
    timeLimitMs: 1000,
    memoryLimitKb: 262144,
    statement: `Given an encoded string, return its decoded string.
The encoding rule is: k[encoded_string], where the encoded_string inside the square brackets is being repeated exactly k times. k is guaranteed to be a positive integer.
Brackets can be nested.`,
    inputFormat: 'A single string S.',
    outputFormat: 'Print the decoded string.',
    constraints: '1 <= len(S) <= 50\nContains digits, lowercase letters, and square brackets.',
    sampleCases: [
      { input: '3[a]2[bc]', expectedOutput: 'aaabcbc', explanation: '3*a + 2*bc = aaabcbc.' },
      { input: '3[a2[c]]', expectedOutput: 'accaccacc', explanation: 'Nested: a2[c] -> acc, 3*acc -> accaccacc.' },
    ],
    hiddenCases: [
      { input: '2[abc]3[cd]ef' },
      { input: 'abc3[cd]xyz' },
      { input: '1[a]' },
      { input: '2[2[y]pq]' },
      { input: '10[a]' },
      { input: '2[b3[a]]' },
      { input: '3[z]2[2[y]]' },
      { input: 'leetcode' },
    ],
    solutionCode: `
import sys

def solve():
    s = sys.stdin.read().strip()
    if not s:
        return
        
    stack = []
    curr_str = ""
    curr_num = 0
    
    for c in s:
        if c.isdigit():
            curr_num = curr_num * 10 + int(c)
        elif c == '[':
            stack.append((curr_str, curr_num))
            curr_str = ""
            curr_num = 0
        elif c == ']':
            prev_str, num = stack.pop()
            curr_str = prev_str + curr_str * num
        else:
            curr_str += c
            
    print(curr_str)

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: 'Stack-based parser maintaining (previous_string, repeat_count) tuples for nested bracket scopes.',
      timeComplexity: 'O(len(decoded_string))',
      spaceComplexity: 'O(len(decoded_string))',
    },
  },

  // --------------------------------------------------------------------------
  // cv138: Strings - Repeated DNA Sequence Detector (MEDIUM)
  // --------------------------------------------------------------------------
  {
    id: 'cv138',
    slug: 'repeated-dna-sequence-detector',
    title: 'The DNA Genetic Sequence Anomaly Detector',
    difficulty: 'MEDIUM',
    topics: ['Strings & Parsing'],
    timeLimitMs: 1500,
    memoryLimitKb: 262144,
    statement: `The DNA sequence is composed of a series of nucleotides abbreviated as 'A', 'C', 'G', and 'T'.
Given a string S representing a DNA molecule, find all the 10-letter-long sequences (substrings) that occur more than once in the DNA molecule.

Print the repeated sequences in lexicographical order, each on a new line. If no 10-letter sequence is repeated, print NONE.`,
    inputFormat: 'A single string S consisting of characters A, C, G, T.',
    outputFormat: 'Print each repeated 10-letter sequence on a new line, or NONE.',
    constraints: '1 <= len(S) <= 100000',
    sampleCases: [
      { input: 'AAAAACCCCCAAAAACCCCCCAAAAAGGGTTT', expectedOutput: 'AAAAACCCCC\nCCCCCAAAAA', explanation: 'Both 10-mers occur more than once.' },
      { input: 'AAAAAAAAAAAAA', expectedOutput: 'AAAAAAAAAA', explanation: 'Only "AAAAAAAAAA" repeats.' },
    ],
    hiddenCases: [
      { input: 'AAAAAAAAAA' },
      { input: 'ACGTACGTAC' },
      { input: 'AAAAAAAAAAA' },
      { input: 'GAGAGAGAGAGAGAGAGAGAGA' },
      { input: 'ACGTACGTACGTACGTACGT' },
      { input: 'CCCCCCCCCCCCCCCCCCCC' },
      { input: 'ATCGATCGATCGATCGATCG' },
      { input: 'AAGCTAGCTAGCTAAGCTAGCTAGCT' },
    ],
    solutionCode: `
import sys
from collections import Counter

def solve():
    s = sys.stdin.read().strip()
    if len(s) < 10:
        print("NONE")
        return
        
    counts = Counter()
    for i in range(len(s) - 9):
        sub = s[i:i+10]
        counts[sub] += 1
        
    repeated = sorted([k for k, v in counts.items() if v > 1])
    if repeated:
        for seq in repeated:
            print(seq)
    else:
        print("NONE")

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: 'Rolling hash or hash map of 10-character substrings, filtering those with count > 1 and sorting lexicographically.',
      timeComplexity: 'O(N)',
      spaceComplexity: 'O(N)',
    },
  },

  // --------------------------------------------------------------------------
  // cv139: Strings - Simplify Unix Filepath (MEDIUM)
  // --------------------------------------------------------------------------
  {
    id: 'cv139',
    slug: 'simplify-unix-filepath-canonical',
    title: 'The Terminal Directory Path Normalizer',
    difficulty: 'MEDIUM',
    topics: ['Strings & Parsing'],
    timeLimitMs: 1000,
    memoryLimitKb: 262144,
    statement: `Given an absolute Unix-style file path S, transform it to the simplified canonical path.
The rules of a Unix-style file system are:
- A single period '.' refers to the current directory.
- A double period '..' refers to the directory up a level.
- Multiple consecutive slashes '//' are treated as a single slash '/'.
- The path must always start with a single slash '/', and cannot end with a trailing slash unless it is the root directory.`,
    inputFormat: 'A single string S.',
    outputFormat: 'Print the canonical simplified path.',
    constraints: '1 <= len(S) <= 3000',
    sampleCases: [
      { input: '/home/', expectedOutput: '/home', explanation: 'Trailing slash removed.' },
      { input: '/../', expectedOutput: '/', explanation: 'Going one level up from root remains at root.' },
    ],
    hiddenCases: [
      { input: '/home//foo/' },
      { input: '/a/./b/../../c/' },
      { input: '/a/../../b/../c//.//' },
      { input: '/a//b////c/d//././/..' },
      { input: '/...' },
      { input: '/..hidden' },
      { input: '/root/dir/subdir/../../' },
      { input: '/' },
    ],
    solutionCode: `
import sys

def solve():
    path = sys.stdin.read().strip()
    if not path:
        return
        
    parts = path.split('/')
    stack = []
    
    for p in parts:
        if p == '' or p == '.':
            continue
        elif p == '..':
            if stack:
                stack.pop()
        else:
            stack.append(p)
            
    print('/' + '/'.join(stack))

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: 'Split string by slash, use a stack to push directories and pop on "..", and rejoin with single slashes.',
      timeComplexity: 'O(N)',
      spaceComplexity: 'O(N)',
    },
  },

  // --------------------------------------------------------------------------
  // cv140: Strings - Multiply Large Numbers (MEDIUM)
  // --------------------------------------------------------------------------
  {
    id: 'cv140',
    slug: 'multiply-very-large-numbers',
    title: 'The Monumental Arbitrary Precision Multiplier',
    difficulty: 'MEDIUM',
    topics: ['Strings & Parsing'],
    timeLimitMs: 1500,
    memoryLimitKb: 262144,
    statement: `Given two non-negative integers Num1 and Num2 represented as strings, return the product of Num1 and Num2, also represented as a string.
You must implement manual digit multiplication simulation.`,
    inputFormat: 'First line: String Num1.\nSecond line: String Num2.',
    outputFormat: 'Print the product string.',
    constraints: '1 <= len(Num1), len(Num2) <= 500\nDigits only, no leading zeros except "0".',
    sampleCases: [
      { input: '2\n3', expectedOutput: '6', explanation: '2 * 3 = 6.' },
      { input: '123\n456', expectedOutput: '56088', explanation: '123 * 456 = 56088.' },
    ],
    hiddenCases: [
      { input: '0\n0' },
      { input: '0\n12345' },
      { input: '999\n999' },
      { input: '123456789\n987654321' },
      { input: '1000000\n1000000' },
      { input: '999999999999999\n999999999999999' },
      { input: '1\n12345678901234567890' },
      { input: '55555\n22222' },
    ],
    solutionCode: `
import sys

def solve():
    lines = sys.stdin.read().split()
    if len(lines) < 2:
        return
    num1, num2 = lines[0], lines[1]
    
    if num1 == "0" or num2 == "0":
        print("0")
        return
        
    n, m = len(num1), len(num2)
    res = [0] * (n + m)
    
    for i in range(n - 1, -1, -1):
        d1 = ord(num1[i]) - ord('0')
        for j in range(m - 1, -1, -1):
            d2 = ord(num2[j]) - ord('0')
            mul = d1 * d2 + res[i + j + 1]
            res[i + j + 1] = mul % 10
            res[i + j] += mul // 10
            
    start = 0
    while start < len(res) and res[start] == 0:
        start += 1
        
    print(''.join(map(str, res[start:])))

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: 'Grade-school multiplication simulation: product of digit at index i and index j accumulates at positions i+j and i+j+1.',
      timeComplexity: 'O(N * M)',
      spaceComplexity: 'O(N + M)',
    },
  },

  // --------------------------------------------------------------------------
  // cv141: Strings - Basic Calculator Expression (MEDIUM)
  // --------------------------------------------------------------------------
  {
    id: 'cv141',
    slug: 'basic-calculator-expressions',
    title: 'The Mechanical Arithmetic Engine',
    difficulty: 'MEDIUM',
    topics: ['Strings & Parsing'],
    timeLimitMs: 1000,
    memoryLimitKb: 262144,
    statement: `Given a string S representing an arithmetic expression containing non-negative integers, '+', '-', '*', and '/' operators, and empty spaces, evaluate the expression and print its integer value.
Integer division should truncate toward zero (e.g. 14 / 3 = 4, and -14 / 3 = -4). Operator precedence (* and / before + and -) must be respected.`,
    inputFormat: 'A single line containing the expression string S.',
    outputFormat: 'Print the evaluated integer.',
    constraints: '1 <= len(S) <= 100000',
    sampleCases: [
      { input: '3+2*2', expectedOutput: '7', explanation: '2*2 = 4; 3+4 = 7.' },
      { input: ' 3/2 ', expectedOutput: '1', explanation: '3/2 truncates to 1.' },
    ],
    hiddenCases: [
      { input: ' 3+5 / 2 ' },
      { input: '14-3/2' },
      { input: '100' },
      { input: '1*2-3/4+5*6-7*8+9/10' },
      { input: '0-2147483647' },
      { input: '1-1+1' },
      { input: '2*3*4' },
      { input: '100000/1000/10' },
    ],
    solutionCode: `
import sys

def solve():
    s = sys.stdin.read().strip()
    if not s:
        return
        
    stack = []
    curr_num = 0
    op = '+'
    
    for i, c in enumerate(s):
        if c.isdigit():
            curr_num = curr_num * 10 + int(c)
        if c in '+-*/' or i == len(s) - 1:
            if op == '+':
                stack.append(curr_num)
            elif op == '-':
                stack.append(-curr_num)
            elif op == '*':
                stack.append(stack.pop() * curr_num)
            elif op == '/':
                top = stack.pop()
                # Truncate toward zero
                stack.append(int(top / curr_num))
            op = c
            curr_num = 0
            
    print(sum(stack))

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: 'Stack-based precedence evaluation: delay additions/subtractions while eagerly evaluating multiplications and divisions.',
      timeComplexity: 'O(N)',
      spaceComplexity: 'O(N)',
    },
  },

  // --------------------------------------------------------------------------
  // cv142: Strings - Valid Number Scientific Notation (HARD)
  // --------------------------------------------------------------------------
  {
    id: 'cv142',
    slug: 'valid-number-scientific-notation',
    title: 'The Rigorous Numerical Lexer Validator',
    difficulty: 'HARD',
    topics: ['Strings & Parsing'],
    timeLimitMs: 1000,
    memoryLimitKb: 262144,
    statement: `Validate if a given string S is a valid decimal number.
A valid number can be an integer, a decimal, or scientific notation containing 'e' or 'E'.
Rules:
- An optional sign ('+' or '-').
- At least one digit (can appear before or after decimal point).
- At most one decimal point '.', which cannot appear after an 'e' or 'E'.
- An optional exponent ('e' or 'E') followed by an optional sign and at least one integer digit.
Print YES if valid, otherwise print NO.`,
    inputFormat: 'A single string S.',
    outputFormat: 'Print YES or NO.',
    constraints: '1 <= len(S) <= 50',
    sampleCases: [
      { input: '0', expectedOutput: 'YES', explanation: 'Valid integer.' },
      { input: 'e', expectedOutput: 'NO', explanation: 'Missing number before and after exponent.' },
    ],
    hiddenCases: [
      { input: '.' },
      { input: '.1' },
      { input: '2e10' },
      { input: '-90E+3' },
      { input: '3.' },
      { input: '+.8' },
      { input: '53.5e93' },
      { input: '--6' },
    ],
    solutionCode: `
import sys

def solve():
    s = sys.stdin.read().strip()
    if not s:
        print("NO")
        return
        
    seen_digit = False
    seen_dot = False
    seen_e = False
    
    for i, c in enumerate(s):
        if c.isdigit():
            seen_digit = True
        elif c in '+-':
            if i > 0 and s[i - 1] not in 'eE':
                print("NO")
                return
        elif c == '.':
            if seen_dot or seen_e:
                print("NO")
                return
            seen_dot = True
        elif c in 'eE':
            if seen_e or not seen_digit:
                print("NO")
                return
            seen_e = True
            seen_digit = False # Must see digit after e
        else:
            print("NO")
            return
            
    print("YES" if seen_digit else "NO")

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: 'Deterministic Finite Automaton (DFA) state tracker checking flags for seen_digit, seen_dot, and seen_e.',
      timeComplexity: 'O(N)',
      spaceComplexity: 'O(1)',
    },
  },

  // --------------------------------------------------------------------------
  // cv143: Strings - Reorganize String No Adjacent (MEDIUM)
  // --------------------------------------------------------------------------
  {
    id: 'cv143',
    slug: 'reorganize-string-no-adjacent',
    title: 'The Alternating Heraldic Rune Order',
    difficulty: 'MEDIUM',
    topics: ['Strings & Parsing'],
    timeLimitMs: 1000,
    memoryLimitKb: 262144,
    statement: `Given a string S, rearrange the characters of S so that any two adjacent characters are not the same.
If such a rearrangement is possible, print the rearranged string.
If no valid rearrangement is possible, print IMPOSSIBLE.`,
    inputFormat: 'A single string S of lowercase English letters.',
    outputFormat: 'Print the rearranged string, or IMPOSSIBLE.',
    constraints: '1 <= len(S) <= 100000',
    sampleCases: [
      { input: 'aab', expectedOutput: 'aba', explanation: 'No adjacent identical letters.' },
      { input: 'aaab', expectedOutput: 'IMPOSSIBLE', explanation: '\'a\' appears 3 times in length 4 string, impossible to separate.' },
    ],
    hiddenCases: [
      { input: 'a' },
      { input: 'aa' },
      { input: 'aba' },
      { input: 'vvvlo' },
      { input: 'baaba' },
      { input: 'bba' },
      { input: 'eqhxqljhgq' },
      { input: 'abcdef' },
    ],
    solutionCode: `
import sys
import heapq
from collections import Counter

def solve():
    s = sys.stdin.read().strip()
    if not s:
        return
        
    counts = Counter(s)
    max_count = max(counts.values())
    if max_count > (len(s) + 1) // 2:
        print("IMPOSSIBLE")
        return
        
    pq = [(-count, char) for char, count in counts.items()]
    heapq.heapify(pq)
    
    prev_count, prev_char = 0, ''
    res = []
    
    while pq:
        count, char = heapq.heappop(pq)
        res.append(char)
        if prev_count < 0:
            heapq.heappush(pq, (prev_count, prev_char))
        prev_count = count + 1
        prev_char = char
        
    print(''.join(res))

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: 'Max-heap greedy placement: always select the most frequent remaining character different from the previously placed character.',
      timeComplexity: 'O(N log(Sigma)) = O(N)',
      spaceComplexity: 'O(N)',
    },
  },

  // --------------------------------------------------------------------------
  // cv144: Matrices - Surrounded Regions Capture (MEDIUM)
  // --------------------------------------------------------------------------
  {
    id: 'cv144',
    slug: 'surrounded-regions-capture',
    title: 'The Fortress Territory Encirclement',
    difficulty: 'MEDIUM',
    topics: ['Matrices & Grids'],
    timeLimitMs: 1500,
    memoryLimitKb: 262144,
    statement: `You are given an N x M matrix board containing 'X' and 'O'.
Capture all regions that are 4-directionally surrounded by 'X'.
A region is captured by flipping all 'O's into 'X's in that surrounded region.
An 'O' is not surrounded if it is on the border of the board or connected to an 'O' on the border.`,
    inputFormat: 'First line: Two integers N and M.\nNext N lines: M space-separated characters (\'X\' or \'O\').',
    outputFormat: 'Print the modified N x M matrix, each row on a new line with space-separated characters.',
    constraints: '1 <= N, M <= 200',
    sampleCases: [
      { input: '4 4\nX X X X\nX O O X\nX X O X\nX O X X', expectedOutput: 'X X X X\nX X X X\nX X X X\nX O X X', explanation: 'Internal O-cells are captured; border O at (3,1) is preserved.' },
      { input: '1 1\nX', expectedOutput: 'X', explanation: 'Single cell.' },
    ],
    hiddenCases: [
      { input: '1 1\nO' },
      { input: '2 2\nO X\nX O' },
      { input: '3 3\nX X X\nX O X\nX X X' },
      { input: '3 3\nO O O\nO O O\nO O O' },
      { input: '4 4\nX X X X\nX O X X\nX X O X\nX X X X' },
      { input: '4 4\nO X X O\nX O O X\nX O O X\nO X X O' },
      { input: '3 4\nX X X X\nX O O X\nX X X X' },
      { input: '5 5\nX X X X X\nX O O O X\nX O X O X\nX O O O X\nX X X X X' },
    ],
    solutionCode: `
import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    m = int(data[1])
    
    board = []
    idx = 2
    for _ in range(n):
        row = data[idx:idx+m]
        board.append(row)
        idx += m
        
    # Mark border connected O cells
    stack = []
    for r in range(n):
        for c in (0, m - 1):
            if board[r][c] == 'O':
                board[r][c] = 'S'
                stack.append((r, c))
    for c in range(m):
        for r in (0, n - 1):
            if board[r][c] == 'O':
                board[r][c] = 'S'
                stack.append((r, c))
                
    while stack:
        r, c = stack.pop()
        for dr, dc in ((-1, 0), (1, 0), (0, -1), (0, 1)):
            nr, nc = r + dr, c + dc
            if 0 <= nr < n and 0 <= nc < m and board[nr][nc] == 'O':
                board[nr][nc] = 'S'
                stack.append((nr, nc))
                
    for r in range(n):
        for c in range(m):
            if board[r][c] == 'O':
                board[r][c] = 'X'
            elif board[r][c] == 'S':
                board[r][c] = 'O'
                
    for row in board:
        print(' '.join(row))

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: 'Border flood-fill: mark all \'O\' cells connected to the 4 borders as safe (\'S\'), then convert remaining \'O\'s to \'X\'s.',
      timeComplexity: 'O(N * M)',
      spaceComplexity: 'O(N * M)',
    },
  },

  // --------------------------------------------------------------------------
  // cv145: Matrices - Pacific Atlantic Water Flow (MEDIUM)
  // --------------------------------------------------------------------------
  {
    id: 'cv145',
    slug: 'pacific-atlantic-water-flow',
    title: 'The Dual Continental Watershed Divide',
    difficulty: 'MEDIUM',
    topics: ['Matrices & Grids'],
    timeLimitMs: 1500,
    memoryLimitKb: 262144,
    statement: `An island is modeled as an N x M grid of heights. The Pacific ocean borders the top and left edges, while the Atlantic ocean borders the bottom and right edges.
Water can only flow from a cell to an adjacent cell (up, down, left, right) if the neighboring cell's height is less than or equal to the current cell's height.

Count how many grid coordinates can drain water to BOTH oceans.`,
    inputFormat: 'First line: Two integers N and M.\nNext N lines: M space-separated integers representing cell elevations.',
    outputFormat: 'Print the count of coordinates that can reach both oceans.',
    constraints: '1 <= N, M <= 200\n0 <= Height <= 100000',
    sampleCases: [
      { input: '5 5\n1 2 2 3 5\n3 2 3 4 4\n2 4 5 3 1\n6 7 1 4 5\n5 1 1 2 4', expectedOutput: '7', explanation: '7 coordinates can flow to both Pacific and Atlantic.' },
      { input: '1 1\n1', expectedOutput: '1', explanation: 'Single cell borders both oceans.' },
    ],
    hiddenCases: [
      { input: '2 2\n1 2\n2 1' },
      { input: '3 3\n1 2 3\n8 9 4\n7 6 5' },
      { input: '3 1\n1\n2\n3' },
      { input: '1 3\n3 2 1' },
      { input: '4 4\n1 1 1 1\n1 1 1 1\n1 1 1 1\n1 1 1 1' },
      { input: '3 3\n10 10 10\n10 1 10\n10 10 10' },
      { input: '4 3\n1 2 3\n4 5 6\n7 8 9\n10 11 12' },
      { input: '2 3\n2 2 2\n2 2 2' },
    ],
    solutionCode: `
import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    m = int(data[1])
    
    grid = []
    idx = 2
    for _ in range(n):
        grid.append([int(x) for x in data[idx:idx+m]])
        idx += m
        
    pacific = [[False] * m for _ in range(n)]
    atlantic = [[False] * m for _ in range(n)]
    
    def bfs(starts, reachable):
        stack = list(starts)
        for r, c in starts:
            reachable[r][c] = True
        while stack:
            r, c = stack.pop()
            for dr, dc in ((-1, 0), (1, 0), (0, -1), (0, 1)):
                nr, nc = r + dr, c + dc
                if 0 <= nr < n and 0 <= nc < m and not reachable[nr][nc]:
                    if grid[nr][nc] >= grid[r][c]:
                        reachable[nr][nc] = True
                        stack.append((nr, nc))
                        
    pac_starts = [(r, 0) for r in range(n)] + [(0, c) for c in range(m)]
    atl_starts = [(r, m - 1) for r in range(n)] + [(n - 1, c) for c in range(m)]
    
    bfs(set(pac_starts), pacific)
    bfs(set(atl_starts), atlantic)
    
    count = 0
    for r in range(n):
        for c in range(m):
            if pacific[r][c] and atlantic[r][c]:
                count += 1
                
    print(count)

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: 'Reverse flood fill from ocean coastlines: climb uphill to record all cells reachable from Pacific and Atlantic independently, then take intersection.',
      timeComplexity: 'O(N * M)',
      spaceComplexity: 'O(N * M)',
    },
  },

  // --------------------------------------------------------------------------
  // cv146: Matrices - Rotting Oranges BFS (MEDIUM)
  // --------------------------------------------------------------------------
  {
    id: 'cv146',
    slug: 'rotting-oranges-grid-bfs',
    title: 'The Orchard Spoilage Contagion',
    difficulty: 'MEDIUM',
    topics: ['Matrices & Grids'],
    timeLimitMs: 1000,
    memoryLimitKb: 262144,
    statement: `You are given an N x M grid where each cell has one of three values:
- 0 representing an empty cell,
- 1 representing a fresh fruit, or
- 2 representing a rotten fruit.

Every minute, any fresh fruit that is 4-directionally adjacent to a rotten fruit becomes rotten.
Return the minimum number of minutes that must elapse until no cell has a fresh fruit. If this is impossible, return -1.`,
    inputFormat: 'First line: Two integers N and M.\nNext N lines: M space-separated integers (0, 1, or 2).',
    outputFormat: 'Print the minimum minutes, or -1.',
    constraints: '1 <= N, M <= 50',
    sampleCases: [
      { input: '3 3\n2 1 1\n1 1 0\n0 1 1', expectedOutput: '4', explanation: 'All fresh fruit rots in 4 minutes.' },
      { input: '3 3\n2 1 1\n0 1 1\n1 0 1', expectedOutput: '-1', explanation: 'Bottom-left fruit is isolated and never rots.' },
    ],
    hiddenCases: [
      { input: '1 1\n0' },
      { input: '1 1\n1' },
      { input: '1 1\n2' },
      { input: '2 2\n1 2\n2 1' },
      { input: '3 3\n0 2 0\n2 1 2\n0 2 0' },
      { input: '4 4\n2 1 1 1\n1 1 1 1\n1 1 1 1\n1 1 1 2' },
      { input: '3 4\n2 1 0 2\n1 0 0 1\n1 1 1 1' },
      { input: '1 5\n2 1 1 1 1' },
    ],
    solutionCode: `
import sys
from collections import deque

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    m = int(data[1])
    
    grid = []
    idx = 2
    q = deque()
    fresh = 0
    
    for r in range(n):
        row = [int(x) for x in data[idx:idx+m]]
        grid.append(row)
        for c in range(m):
            if row[c] == 2:
                q.append((r, c, 0))
            elif row[c] == 1:
                fresh += 1
        idx += m
        
    if fresh == 0:
        print(0)
        return
        
    minutes = 0
    while q:
        r, c, d = q.popleft()
        minutes = max(minutes, d)
        for dr, dc in ((-1, 0), (1, 0), (0, -1), (0, 1)):
            nr, nc = r + dr, c + dc
            if 0 <= nr < n and 0 <= nc < m and grid[nr][nc] == 1:
                grid[nr][nc] = 2
                fresh -= 1
                q.append((nr, nc, d + 1))
                
    if fresh == 0:
        print(minutes)
    else:
        print(-1)

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: 'Multi-source Breadth-First Search: enqueue all initial rotten fruits and spread contagion layer by layer.',
      timeComplexity: 'O(N * M)',
      spaceComplexity: 'O(N * M)',
    },
  },

  // --------------------------------------------------------------------------
  // cv147: Matrices - Snakes and Ladders Shortest Game (HARD)
  // --------------------------------------------------------------------------
  {
    id: 'cv147',
    slug: 'snakes-and-ladders-shortest-game',
    title: 'The Ancient Boustrophedon Serpentine Board',
    difficulty: 'HARD',
    topics: ['Matrices & Grids'],
    timeLimitMs: 1500,
    memoryLimitKb: 262144,
    statement: `You are given an N x N integer matrix board where the cells are labeled from 1 to N^2 in alternating boustrophedon order from the bottom-left of the board:
- Row N - 1 (bottom) from left to right: 1 to N
- Row N - 2 from right to left: N + 1 to 2N, etc.

board[r][c] is -1 if no portal exists; otherwise, it is a target square number indicating a snake or ladder destination.
A player rolls a standard 6-sided die (values 1 to 6) starting at square 1.
Find the minimum number of die rolls required to reach square N^2. If it is impossible, print -1.`,
    inputFormat: 'First line: Integer N.\nNext N lines: N space-separated integers.',
    outputFormat: 'Print the minimum die rolls, or -1.',
    constraints: '2 <= N <= 20\nboard values are -1 or between 1 and N^2.',
    sampleCases: [
      { input: '6\n-1 -1 -1 -1 -1 -1\n-1 -1 -1 -1 -1 -1\n-1 -1 -1 -1 -1 -1\n-1 35 -1 -1 13 -1\n-1 -1 -1 -1 -1 -1\n-1 15 -1 -1 -1 -1', expectedOutput: '4', explanation: 'Player moves 1 -> 15 -> 35 -> 36 in 4 rolls.' },
      { input: '2\n-1 -1\n-1 -1', expectedOutput: '1', explanation: 'Roll 3 reaches square 4 in 1 move.' },
    ],
    hiddenCases: [
      { input: '3\n-1 -1 -1\n-1 -1 -1\n-1 -1 -1' },
      { input: '3\n-1 -1 9\n-1 -1 -1\n-1 8 -1' },
      { input: '4\n-1 -1 -1 -1\n-1 -1 -1 -1\n-1 -1 -1 -1\n-1 -1 -1 -1' },
      { input: '4\n-1 -1 -1 -1\n-1 16 -1 -1\n-1 -1 -1 -1\n-1 -1 -1 -1' },
      { input: '2\n-1 1\n-1 -1' },
      { input: '3\n-1 1 -1\n-1 -1 -1\n-1 -1 -1' },
      { input: '5\n-1 -1 -1 -1 -1\n-1 -1 -1 -1 -1\n-1 -1 -1 -1 -1\n-1 -1 -1 -1 -1\n-1 -1 -1 -1 -1' },
      { input: '3\n-1 -1 -1\n-1 9 -1\n-1 -1 -1' },
    ],
    solutionCode: `
import sys
from collections import deque

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    
    board = []
    idx = 1
    for _ in range(n):
        board.append([int(x) for x in data[idx:idx+n]])
        idx += n
        
    def get_coords(square):
        row = n - 1 - (square - 1) // n
        col = (square - 1) % n
        if (n - 1 - row) % 2 == 1:
            col = n - 1 - col
        return row, col
        
    target = n * n
    dist = [-1] * (target + 1)
    dist[1] = 0
    q = deque([1])
    
    while q:
        curr = q.popleft()
        if curr == target:
            print(dist[target])
            return
        for roll in range(1, 7):
            nxt = curr + roll
            if nxt > target:
                break
            r, c = get_coords(nxt)
            dest = board[r][c] if board[r][c] != -1 else nxt
            if dist[dest] == -1:
                dist[dest] = dist[curr] + 1
                q.append(dest)
                
    print(dist[target])

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: 'Breadth-First Search on a directed graph of N^2 states with boustrophedon coordinate mapping.',
      timeComplexity: 'O(N^2)',
      spaceComplexity: 'O(N^2)',
    },
  },

  // --------------------------------------------------------------------------
  // cv148: Matrices - Maximal Square Subgrid Ones (MEDIUM)
  // --------------------------------------------------------------------------
  {
    id: 'cv148',
    slug: 'maximal-square-subgrid-ones',
    title: 'The Fortress Maximal Bastion Square',
    difficulty: 'MEDIUM',
    topics: ['Matrices & Grids'],
    timeLimitMs: 1000,
    memoryLimitKb: 262144,
    statement: `Given an N x M binary matrix filled with 0s and 1s, find the largest square subgrid containing only 1s and return its area (side * side).`,
    inputFormat: 'First line: Two integers N and M.\nNext N lines: M space-separated binary integers (0 or 1).',
    outputFormat: 'Print the maximal area.',
    constraints: '1 <= N, M <= 300',
    sampleCases: [
      { input: '4 5\n1 0 1 0 0\n1 0 1 1 1\n1 1 1 1 1\n1 0 0 1 0', expectedOutput: '4', explanation: 'Maximal square of 1s has side length 2, area = 4.' },
      { input: '2 2\n0 1\n1 0', expectedOutput: '1', explanation: 'Max square side is 1, area 1.' },
    ],
    hiddenCases: [
      { input: '1 1\n0' },
      { input: '1 1\n1' },
      { input: '3 3\n1 1 1\n1 1 1\n1 1 1' },
      { input: '4 4\n0 0 0 0\n0 0 0 0\n0 0 0 0\n0 0 0 0' },
      { input: '3 4\n1 1 1 1\n1 1 1 1\n1 1 1 1' },
      { input: '4 4\n1 1 0 1\n1 1 0 1\n0 0 1 1\n0 0 1 1' },
      { input: '5 5\n1 1 1 1 1\n1 1 1 1 1\n1 1 1 1 1\n1 1 1 1 1\n1 1 1 1 1' },
      { input: '2 4\n1 1 1 1\n1 1 1 1' },
    ],
    solutionCode: `
import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    m = int(data[1])
    
    dp = [0] * (m + 1)
    max_side = 0
    idx = 2
    
    for r in range(n):
        next_dp = [0] * (m + 1)
        for c in range(1, m + 1):
            val = int(data[idx])
            idx += 1
            if val == 1:
                next_dp[c] = min(dp[c], dp[c - 1], next_dp[c - 1]) + 1
                if next_dp[c] > max_side:
                    max_side = next_dp[c]
        dp = next_dp
        
    print(max_side * max_side)

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: 'Dynamic programming: dp[r][c] = min(dp[r-1][c], dp[r][c-1], dp[r-1][c-1]) + 1 with 1D space optimization.',
      timeComplexity: 'O(N * M)',
      spaceComplexity: 'O(M)',
    },
  },

  // --------------------------------------------------------------------------
  // cv149: Matrices - As Far from Land as Possible (MEDIUM)
  // --------------------------------------------------------------------------
  {
    id: 'cv149',
    slug: 'as-far-from-land-as-possible',
    title: 'The Isolated Marine Sanctuary Point',
    difficulty: 'MEDIUM',
    topics: ['Matrices & Grids'],
    timeLimitMs: 1500,
    memoryLimitKb: 262144,
    statement: `Given an N x N grid containing only 0 (water) and 1 (land), find a water cell such that its distance to the nearest land cell is maximized, and return this maximum Manhattan distance.
Distance between (x0, y0) and (x1, y1) is |x0 - x1| + |y0 - y1|.
If no land or water exists in the grid, return -1.`,
    inputFormat: 'First line: Integer N.\nNext N lines: N space-separated integers (0 or 1).',
    outputFormat: 'Print the maximum distance or -1.',
    constraints: '1 <= N <= 100',
    sampleCases: [
      { input: '3\n1 0 1\n0 0 0\n1 0 1', expectedOutput: '2', explanation: 'Center cell (1, 1) is at distance 2 from all corner land cells.' },
      { input: '3\n1 0 0\n0 0 0\n0 0 0', expectedOutput: '4', explanation: 'Bottom-right cell (2, 2) is at distance 4 from (0, 0).' },
    ],
    hiddenCases: [
      { input: '1\n0' },
      { input: '1\n1' },
      { input: '2\n1 1\n1 1' },
      { input: '2\n0 0\n0 0' },
      { input: '4\n1 0 0 0\n0 0 0 0\n0 0 0 0\n0 0 0 0' },
      { input: '3\n0 0 0\n0 1 0\n0 0 0' },
      { input: '4\n1 1 1 1\n1 0 0 1\n1 0 0 1\n1 1 1 1' },
      { input: '3\n1 1 1\n1 0 1\n1 1 1' },
    ],
    solutionCode: `
import sys
from collections import deque

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    
    q = deque()
    dist = [[-1] * n for _ in range(n)]
    idx = 1
    
    for r in range(n):
        for c in range(n):
            val = int(data[idx])
            idx += 1
            if val == 1:
                dist[r][c] = 0
                q.append((r, c))
                
    if len(q) == 0 or len(q) == n * n:
        print(-1)
        return
        
    max_dist = -1
    while q:
        r, c = q.popleft()
        d = dist[r][c]
        for dr, dc in ((-1, 0), (1, 0), (0, -1), (0, 1)):
            nr, nc = r + dr, c + dc
            if 0 <= nr < n and 0 <= nc < n and dist[nr][nc] == -1:
                dist[nr][nc] = d + 1
                max_dist = max(max_dist, d + 1)
                q.append((nr, nc))
                
    print(max_dist)

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: 'Multi-source BFS from all land cells expanding outward into water cells.',
      timeComplexity: 'O(N^2)',
      spaceComplexity: 'O(N^2)',
    },
  },

  // --------------------------------------------------------------------------
  // cv150: Matrices - Shortest Path in Binary Matrix (MEDIUM)
  // --------------------------------------------------------------------------
  {
    id: 'cv150',
    slug: 'shortest-path-in-binary-matrix',
    title: 'The 8-Directional Labyrinth Escape',
    difficulty: 'MEDIUM',
    topics: ['Matrices & Grids'],
    timeLimitMs: 1000,
    memoryLimitKb: 262144,
    statement: `Given an N x N binary matrix grid, return the length of the shortest clear path in the matrix. If there is no clear path, return -1.
A clear path in a binary matrix is a path from the top-left cell (0, 0) to the bottom-right cell (N - 1, N - 1) such that:
- All the visited cells of the path are 0.
- All adjacent cells of the path are 8-directionally connected (horizontal, vertical, diagonal).
The length of a clear path is the number of visited cells of this path.`,
    inputFormat: 'First line: Integer N.\nNext N lines: N space-separated integers (0 or 1).',
    outputFormat: 'Print the path length or -1.',
    constraints: '1 <= N <= 100',
    sampleCases: [
      { input: '2\n0 1\n1 0', expectedOutput: '2', explanation: 'Path (0,0) -> (1,1) has length 2.' },
      { input: '3\n0 0 0\n1 1 0\n1 1 0', expectedOutput: '4', explanation: '(0,0) -> (0,1) -> (1,2) -> (2,2) length 4.' },
    ],
    hiddenCases: [
      { input: '1\n0' },
      { input: '1\n1' },
      { input: '2\n1 0\n0 0' },
      { input: '3\n0 1 1\n1 0 1\n1 1 0' },
      { input: '3\n0 0 0\n0 0 0\n0 0 0' },
      { input: '4\n0 1 1 0\n1 0 0 1\n0 1 0 1\n0 0 0 0' },
      { input: '3\n0 1 0\n1 1 0\n1 1 0' },
      { input: '4\n0 0 0 0\n1 1 1 0\n0 0 0 0\n0 1 1 0' },
    ],
    solutionCode: `
import sys
from collections import deque

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    
    grid = []
    idx = 1
    for _ in range(n):
        grid.append([int(x) for x in data[idx:idx+n]])
        idx += n
        
    if grid[0][0] != 0 or grid[n - 1][n - 1] != 0:
        print(-1)
        return
        
    if n == 1:
        print(1)
        return
        
    q = deque([(0, 0, 1)])
    grid[0][0] = 1 # Mark visited
    
    dirs = [(-1,-1), (-1,0), (-1,1), (0,-1), (0,1), (1,-1), (1,0), (1,1)]
    
    while q:
        r, c, d = q.popleft()
        if r == n - 1 and c == n - 1:
            print(d)
            return
        for dr, dc in dirs:
            nr, nc = r + dr, c + dc
            if 0 <= nr < n and 0 <= nc < n and grid[nr][nc] == 0:
                grid[nr][nc] = 1
                q.append((nr, nc, d + 1))
                
    print(-1)

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: '8-directional Breadth-First Search (BFS) finding unweighted shortest path from top-left to bottom-right.',
      timeComplexity: 'O(N^2)',
      spaceComplexity: 'O(N^2)',
    },
  },

  // --------------------------------------------------------------------------
  // cv151: Matrices - Matrix Transposition In-Place (EASY)
  // --------------------------------------------------------------------------
  {
    id: 'cv151',
    slug: 'matrix-transposition-in-place',
    title: 'The Cartographer Coordinate Transposition',
    difficulty: 'EASY',
    topics: ['Matrices & Grids'],
    timeLimitMs: 1000,
    memoryLimitKb: 262144,
    statement: `Given an N x M matrix, output its transpose (an M x N matrix where rows and columns are swapped).`,
    inputFormat: 'First line: Two integers N and M.\nNext N lines: M space-separated integers.',
    outputFormat: 'Print the M x N transposed matrix.',
    constraints: '1 <= N, M <= 200\n-10^9 <= A_{ij} <= 10^9',
    sampleCases: [
      { input: '2 3\n1 2 3\n4 5 6', expectedOutput: '1 4\n2 5\n3 6', explanation: '2x3 matrix transposed to 3x2.' },
      { input: '1 2\n10 20', expectedOutput: '10\n20', explanation: '1x2 to 2x1.' },
    ],
    hiddenCases: [
      { input: '1 1\n42' },
      { input: '3 1\n1\n2\n3' },
      { input: '2 2\n1 2\n3 4' },
      { input: '3 3\n1 2 3\n4 5 6\n7 8 9' },
      { input: '2 4\n5 10 15 20\n25 30 35 40' },
      { input: '4 2\n1 2\n3 4\n5 6\n7 8' },
      { input: '3 2\n0 0\n1 1\n2 2' },
      { input: '2 2\n-1 -2\n-3 -4' },
    ],
    solutionCode: `
import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    m = int(data[1])
    
    grid = []
    idx = 2
    for _ in range(n):
        grid.append(data[idx:idx+m])
        idx += m
        
    for c in range(m):
        col = [grid[r][c] for r in range(n)]
        print(' '.join(col))

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: 'Direct transposition indexing: transpose[c][r] = matrix[r][c].',
      timeComplexity: 'O(N * M)',
      spaceComplexity: 'O(N * M)',
    },
  },

  // --------------------------------------------------------------------------
  // cv152: Matrices - Count Submatrices With All Ones (HARD)
  // --------------------------------------------------------------------------
  {
    id: 'cv152',
    slug: 'count-submatrices-with-all-ones',
    title: 'The Total Cohesive Subgrid Counter',
    difficulty: 'HARD',
    topics: ['Matrices & Grids'],
    timeLimitMs: 1500,
    memoryLimitKb: 262144,
    statement: `Given an N x M binary matrix mat, return the total number of submatrices that have all 1s.`,
    inputFormat: 'First line: Two integers N and M.\nNext N lines: M space-separated binary integers (0 or 1).',
    outputFormat: 'Print the total count of all-one submatrices.',
    constraints: '1 <= N, M <= 150',
    sampleCases: [
      { input: '3 3\n1 0 1\n1 1 0\n1 1 0', expectedOutput: '13', explanation: 'There are 13 total submatrices composed entirely of 1s.' },
      { input: '2 3\n0 1 1\n1 1 1', expectedOutput: '13', explanation: '13 all-one submatrices.' },
    ],
    hiddenCases: [
      { input: '1 1\n0' },
      { input: '1 1\n1' },
      { input: '1 3\n1 1 1' },
      { input: '3 1\n1\n1\n1' },
      { input: '2 2\n1 1\n1 1' },
      { input: '3 3\n1 1 1\n1 1 1\n1 1 1' },
      { input: '4 4\n0 1 0 1\n1 1 1 1\n0 1 1 0\n1 0 0 1' },
      { input: '3 2\n0 0\n0 0\n0 0' },
    ],
    solutionCode: `
import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    m = int(data[1])
    
    mat = []
    idx = 2
    for _ in range(n):
        mat.append([int(x) for x in data[idx:idx+m]])
        idx += m
        
    # Consecutive ones to the left
    left_ones = [[0] * m for _ in range(n)]
    for r in range(n):
        count = 0
        for c in range(m):
            if mat[r][c] == 1:
                count += 1
            else:
                count = 0
            left_ones[r][c] = count
            
    total = 0
    for r in range(n):
        for c in range(m):
            if mat[r][c] == 1:
                min_width = left_ones[r][c]
                for k in range(r, -1, -1):
                    min_width = min(min_width, left_ones[k][c])
                    if min_width == 0:
                        break
                    total += min_width
                    
    print(total)

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: 'Dynamic programming row-width compression: compute prefix 1s in each row and expand rectangles vertically upward.',
      timeComplexity: 'O(N^2 * M)',
      spaceComplexity: 'O(N * M)',
    },
  },

  // --------------------------------------------------------------------------
  // cv153: Matrices - Diagonal Traverse Zigzag (MEDIUM)
  // --------------------------------------------------------------------------
  {
    id: 'cv153',
    slug: 'diagonal-traverse-zigzag',
    title: 'The Zigzag Diagonal Scan Pipeline',
    difficulty: 'MEDIUM',
    topics: ['Matrices & Grids'],
    timeLimitMs: 1000,
    memoryLimitKb: 262144,
    statement: `Given an N x M matrix, return all elements of the matrix in a diagonal zigzag order:
- Diagonals run from bottom-left to top-right on odd steps, and top-right to bottom-left on even steps.`,
    inputFormat: 'First line: Two integers N and M.\nNext N lines: M space-separated integers.',
    outputFormat: 'Print all matrix elements space-separated in diagonal zigzag order.',
    constraints: '1 <= N, M <= 200\n-10^5 <= A_{ij} <= 10^5',
    sampleCases: [
      { input: '3 3\n1 2 3\n4 5 6\n7 8 9', expectedOutput: '1 2 4 7 5 3 6 8 9', explanation: 'Diagonals: [1], [2, 4], [7, 5, 3], [6, 8], [9].' },
      { input: '2 2\n1 2\n3 4', expectedOutput: '1 2 3 4', explanation: 'Order: 1, 2, 3, 4.' },
    ],
    hiddenCases: [
      { input: '1 1\n42' },
      { input: '1 3\n1 2 3' },
      { input: '3 1\n1\n2\n3' },
      { input: '2 3\n1 2 3\n4 5 6' },
      { input: '3 2\n1 2\n3 4\n5 6' },
      { input: '4 4\n1 2 3 4\n5 6 7 8\n9 10 11 12\n13 14 15 16' },
      { input: '2 4\n10 20 30 40\n50 60 70 80' },
      { input: '3 3\n0 0 0\n0 0 0\n0 0 0' },
    ],
    solutionCode: `
import sys
from collections import defaultdict

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    m = int(data[1])
    
    diagonals = defaultdict(list)
    idx = 2
    for r in range(n):
        for c in range(m):
            diagonals[r + c].append(data[idx])
            idx += 1
            
    res = []
    for d in range(n + m - 1):
        items = diagonals[d]
        if d % 2 == 0:
            res.extend(reversed(items))
        else:
            res.extend(items)
            
    print(' '.join(res))

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: 'Group elements by diagonal sum (r + c), then alternate between reversing and preserving the order for each sum.',
      timeComplexity: 'O(N * M)',
      spaceComplexity: 'O(N * M)',
    },
  },

  // --------------------------------------------------------------------------
  // cv154: Matrices - Spiral Matrix Generation (MEDIUM)
  // --------------------------------------------------------------------------
  {
    id: 'cv154',
    slug: 'spiral-matrix-generation',
    title: 'The Archimedean Spiral Clockwise Fill',
    difficulty: 'MEDIUM',
    topics: ['Matrices & Grids'],
    timeLimitMs: 1000,
    memoryLimitKb: 262144,
    statement: `Given a positive integer N, generate an N x N matrix filled with elements from 1 to N^2 in clockwise spiral order.`,
    inputFormat: 'A single positive integer N.',
    outputFormat: 'Print the N x N matrix, each row on a new line with space-separated values.',
    constraints: '1 <= N <= 100',
    sampleCases: [
      { input: '3', expectedOutput: '1 2 3\n8 9 4\n7 6 5', explanation: '3x3 spiral filled from 1 to 9.' },
      { input: '1', expectedOutput: '1', explanation: '1x1 matrix.' },
    ],
    hiddenCases: [
      { input: '2' },
      { input: '4' },
      { input: '5' },
      { input: '6' },
      { input: '7' },
      { input: '8' },
      { input: '9' },
      { input: '10' },
    ],
    solutionCode: `
import sys

def solve():
    line = sys.stdin.read().strip()
    if not line:
        return
    n = int(line)
    
    mat = [[0] * n for _ in range(n)]
    top, bottom = 0, n - 1
    left, right = 0, n - 1
    num = 1
    
    while top <= bottom and left <= right:
        for c in range(left, right + 1):
            mat[top][c] = num
            num += 1
        top += 1
        for r in range(top, bottom + 1):
            mat[r][right] = num
            num += 1
        right -= 1
        if top <= bottom:
            for c in range(right, left - 1, -1):
                mat[bottom][c] = num
                num += 1
            bottom -= 1
        if left <= right:
            for r in range(bottom, top - 1, -1):
                mat[r][left] = num
                num += 1
            left += 1
            
    for row in mat:
        print(' '.join(map(str, row)))

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: 'Boundary-shrinking simulation (top, bottom, left, right) populating numbers from 1 to N^2.',
      timeComplexity: 'O(N^2)',
      spaceComplexity: 'O(N^2)',
    },
  },
];

console.log(`Writing Batch 7 (${problems.length} problems)...`);
problems.forEach((p) => {
  console.log(`Generating: ${p.id}`);
  createProblem(p);
});
console.log('✅ Batch 7 written successfully!');
