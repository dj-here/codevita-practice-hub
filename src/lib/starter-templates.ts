import { ProgrammingLanguage } from '@/types';

export interface LanguageConfig {
  language: ProgrammingLanguage;
  name: string;
  monacoLanguage: string;
  judge0Id: number;
  extension: string;
  defaultCode: string;
}

export const LANGUAGE_CONFIGS: Record<ProgrammingLanguage, LanguageConfig> = {
  [ProgrammingLanguage.CPP]: {
    language: ProgrammingLanguage.CPP,
    name: 'C++ (g++)',
    monacoLanguage: 'cpp',
    judge0Id: 54, // C++ (GCC 9.2.0)
    extension: 'cpp',
    defaultCode: `#include <iostream>
#include <vector>
#include <string>
#include <algorithm>

using namespace std;

void solve() {
    // Write your algorithmic solution here
    int n;
    if (!(cin >> n)) return;
    cout << n << "\\n";
}

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    
    solve();
    
    return 0;
}
`,
  },
  [ProgrammingLanguage.C]: {
    language: ProgrammingLanguage.C,
    name: 'C (gcc)',
    monacoLanguage: 'c',
    judge0Id: 50, // C (GCC 9.2.0)
    extension: 'c',
    defaultCode: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int main() {
    // Read input from standard input (stdin)
    int n;
    if (scanf("%d", &n) == 1) {
        printf("%d\\n", n);
    }
    return 0;
}
`,
  },
  [ProgrammingLanguage.JAVA]: {
    language: ProgrammingLanguage.JAVA,
    name: 'Java (OpenJDK)',
    monacoLanguage: 'java',
    judge0Id: 62, // Java (OpenJDK 13/17)
    extension: 'java',
    defaultCode: `import java.util.*;
import java.io.*;

public class Main {
    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        String line = br.readLine();
        if (line != null && !line.trim().isEmpty()) {
            System.out.println(line.trim());
        }
    }
}
`,
  },
  [ProgrammingLanguage.PYTHON]: {
    language: ProgrammingLanguage.PYTHON,
    name: 'Python 3',
    monacoLanguage: 'python',
    judge0Id: 71, // Python (3.8.1)
    extension: 'py',
    defaultCode: `import sys

def solve():
    input_data = sys.stdin.read().split()
    if not input_data:
        return
    # Process standard input and print output to stdout
    print(input_data[0])

if __name__ == '__main__':
    solve()
`,
  },
};

export function getStarterTemplate(language: ProgrammingLanguage): string {
  return LANGUAGE_CONFIGS[language]?.defaultCode || '';
}

export function getMonacoLanguage(language: ProgrammingLanguage): string {
  return LANGUAGE_CONFIGS[language]?.monacoLanguage || 'plaintext';
}

export const STARTER_TEMPLATES: Record<string, string> = {
  python: LANGUAGE_CONFIGS[ProgrammingLanguage.PYTHON].defaultCode,
  cpp: LANGUAGE_CONFIGS[ProgrammingLanguage.CPP].defaultCode,
  c: LANGUAGE_CONFIGS[ProgrammingLanguage.C].defaultCode,
  java: LANGUAGE_CONFIGS[ProgrammingLanguage.JAVA].defaultCode,
};
