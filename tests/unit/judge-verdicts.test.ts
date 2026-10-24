import { describe, it, expect } from 'vitest';
import { executeCode } from '../../src/lib/judge0';
import { ProgrammingLanguage, Verdict } from '../../src/types';

describe('Phase 2 Acceptance: 4 Verdicts in All 4 Languages', () => {
  const sampleInput = '1 10';
  const expectedOutput = '17';
  const timeLimitMs = 1000;

  // =========================================================================
  // 1. PYTHON 3
  // =========================================================================
  describe('Python 3 Verdicts', () => {
    it('returns ACCEPTED for correct prime sum solution', async () => {
      const code = `
import sys

def is_prime(n):
    if n < 2:
        return False
    for i in range(2, int(n**0.5) + 1):
        if n % i == 0:
            return False
    return True

data = sys.stdin.read().split()
if data:
    L, R = int(data[0]), int(data[1])
    total = sum(x for x in range(L, R + 1) if is_prime(x))
    print(total)
`;
      const res = await executeCode({
        language: ProgrammingLanguage.PYTHON,
        code,
        stdin: sampleInput,
        expectedOutput,
        timeLimitMs,
      });

      expect(res.verdict).toBe(Verdict.ACCEPTED);
      expect(res.stdout.trim()).toBe('17');
    }, 15000);

    it('returns WRONG_ANSWER for incorrect logic', async () => {
      const code = `print(-1)`;
      const res = await executeCode({
        language: ProgrammingLanguage.PYTHON,
        code,
        stdin: sampleInput,
        expectedOutput,
        timeLimitMs,
      });

      expect(res.verdict).toBe(Verdict.WRONG_ANSWER);
    }, 15000);

    it('returns TIME_LIMIT_EXCEEDED for infinite loop', async () => {
      const code = `
import time
while True:
    time.sleep(0.1)
`;
      const res = await executeCode({
        language: ProgrammingLanguage.PYTHON,
        code,
        stdin: sampleInput,
        expectedOutput,
        timeLimitMs: 600,
      });

      expect(res.verdict).toBe(Verdict.TIME_LIMIT_EXCEEDED);
    }, 15000);

    it('returns COMPILATION_ERROR for syntax error', async () => {
      const code = `def solve(::: invalid syntax error`;
      const res = await executeCode({
        language: ProgrammingLanguage.PYTHON,
        code,
        stdin: sampleInput,
        expectedOutput,
        timeLimitMs,
      });

      expect(res.verdict).toBe(Verdict.COMPILATION_ERROR);
    }, 15000);
  });

  // =========================================================================
  // 2. C++ (g++)
  // =========================================================================
  describe('C++ (g++) Verdicts', () => {
    it('returns ACCEPTED for correct prime sum solution', async () => {
      const code = `
#include <iostream>
using namespace std;

bool isPrime(int n) {
    if (n < 2) return false;
    for (int i = 2; i * i <= n; i++) {
        if (n % i == 0) return false;
    }
    return true;
}

int main() {
    int L, R;
    if (cin >> L >> R) {
        long long sum = 0;
        for (int i = L; i <= R; i++) {
            if (isPrime(i)) sum += i;
        }
        cout << sum << "\\n";
    }
    return 0;
}
`;
      const res = await executeCode({
        language: ProgrammingLanguage.CPP,
        code,
        stdin: sampleInput,
        expectedOutput,
        timeLimitMs,
      });

      expect(res.verdict).toBe(Verdict.ACCEPTED);
      expect(res.stdout.trim()).toBe('17');
    }, 15000);

    it('returns WRONG_ANSWER for incorrect logic', async () => {
      const code = `
#include <iostream>
using namespace std;
int main() {
    cout << -1 << "\\n";
    return 0;
}
`;
      const res = await executeCode({
        language: ProgrammingLanguage.CPP,
        code,
        stdin: sampleInput,
        expectedOutput,
        timeLimitMs,
      });

      expect(res.verdict).toBe(Verdict.WRONG_ANSWER);
    }, 15000);

    it('returns TIME_LIMIT_EXCEEDED for infinite loop', async () => {
      const code = `
#include <iostream>
using namespace std;
int main() {
    volatile int x = 0;
    while (true) {
        x++;
    }
    return 0;
}
`;
      const res = await executeCode({
        language: ProgrammingLanguage.CPP,
        code,
        stdin: sampleInput,
        expectedOutput,
        timeLimitMs: 600,
      });

      expect(res.verdict).toBe(Verdict.TIME_LIMIT_EXCEEDED);
    }, 15000);

    it('returns COMPILATION_ERROR for syntax error', async () => {
      const code = `
#include <iostream>
int main() {
    this is broken syntax;
}
`;
      const res = await executeCode({
        language: ProgrammingLanguage.CPP,
        code,
        stdin: sampleInput,
        expectedOutput,
        timeLimitMs,
      });

      expect(res.verdict).toBe(Verdict.COMPILATION_ERROR);
    }, 15000);
  });

  // =========================================================================
  // 3. C (gcc)
  // =========================================================================
  describe('C (gcc) Verdicts', () => {
    it('returns ACCEPTED for correct prime sum solution', async () => {
      const code = `
#include <stdio.h>
#include <stdbool.h>

bool isPrime(int n) {
    if (n < 2) return false;
    for (int i = 2; i * i <= n; i++) {
        if (n % i == 0) return false;
    }
    return true;
}

int main() {
    int L, R;
    if (scanf("%d %d", &L, &R) == 2) {
        long long sum = 0;
        for (int i = L; i <= R; i++) {
            if (isPrime(i)) sum += i;
        }
        printf("%lld\\n", sum);
    }
    return 0;
}
`;
      const res = await executeCode({
        language: ProgrammingLanguage.C,
        code,
        stdin: sampleInput,
        expectedOutput,
        timeLimitMs,
      });

      expect(res.verdict).toBe(Verdict.ACCEPTED);
      expect(res.stdout.trim()).toBe('17');
    }, 15000);

    it('returns WRONG_ANSWER for incorrect logic', async () => {
      const code = `
#include <stdio.h>
int main() {
    printf("-1\\n");
    return 0;
}
`;
      const res = await executeCode({
        language: ProgrammingLanguage.C,
        code,
        stdin: sampleInput,
        expectedOutput,
        timeLimitMs,
      });

      expect(res.verdict).toBe(Verdict.WRONG_ANSWER);
    }, 15000);

    it('returns TIME_LIMIT_EXCEEDED for infinite loop', async () => {
      const code = `
#include <stdio.h>
int main() {
    volatile int x = 0;
    while(1) {
        x++;
    }
    return 0;
}
`;
      const res = await executeCode({
        language: ProgrammingLanguage.C,
        code,
        stdin: sampleInput,
        expectedOutput,
        timeLimitMs: 600,
      });

      expect(res.verdict).toBe(Verdict.TIME_LIMIT_EXCEEDED);
    }, 15000);

    it('returns COMPILATION_ERROR for syntax error', async () => {
      const code = `
#include <stdio.h>
int main() {
    unknown_type x = broken;
    return 0;
}
`;
      const res = await executeCode({
        language: ProgrammingLanguage.C,
        code,
        stdin: sampleInput,
        expectedOutput,
        timeLimitMs,
      });

      expect(res.verdict).toBe(Verdict.COMPILATION_ERROR);
    }, 15000);
  });

  // =========================================================================
  // 4. JAVA (OpenJDK)
  // =========================================================================
  describe('Java Verdicts', () => {
    it('returns ACCEPTED for correct prime sum solution', async () => {
      const code = `
import java.util.Scanner;

public class Main {
    static boolean isPrime(int n) {
        if (n < 2) return false;
        for (int i = 2; i * i <= n; i++) {
            if (n % i == 0) return false;
        }
        return true;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (sc.hasNextInt()) {
            int L = sc.nextInt();
            int R = sc.nextInt();
            long sum = 0;
            for (int i = L; i <= R; i++) {
                if (isPrime(i)) sum += i;
            }
            System.out.println(sum);
        }
    }
}
`;
      const res = await executeCode({
        language: ProgrammingLanguage.JAVA,
        code,
        stdin: sampleInput,
        expectedOutput,
        timeLimitMs,
      });

      expect(res.verdict).toBe(Verdict.ACCEPTED);
      expect(res.stdout.trim()).toBe('17');
    }, 20000);

    it('returns WRONG_ANSWER for incorrect logic', async () => {
      const code = `
public class Main {
    public static void main(String[] args) {
        System.out.println(-1);
    }
}
`;
      const res = await executeCode({
        language: ProgrammingLanguage.JAVA,
        code,
        stdin: sampleInput,
        expectedOutput,
        timeLimitMs,
      });

      expect(res.verdict).toBe(Verdict.WRONG_ANSWER);
    }, 20000);

    it('returns TIME_LIMIT_EXCEEDED for infinite loop', async () => {
      const code = `
public class Main {
    public static void main(String[] args) {
        long x = 0;
        while (true) {
            x++;
        }
    }
}
`;
      const res = await executeCode({
        language: ProgrammingLanguage.JAVA,
        code,
        stdin: sampleInput,
        expectedOutput,
        timeLimitMs: 600,
      });

      expect(res.verdict).toBe(Verdict.TIME_LIMIT_EXCEEDED);
    }, 20000);

    it('returns COMPILATION_ERROR for syntax error', async () => {
      const code = `
public class Main {
    public static void main(String[] args) {
        broken Java code syntax !!!
    }
}
`;
      const res = await executeCode({
        language: ProgrammingLanguage.JAVA,
        code,
        stdin: sampleInput,
        expectedOutput,
        timeLimitMs,
      });

      expect(res.verdict).toBe(Verdict.COMPILATION_ERROR);
    }, 20000);
  });
});
