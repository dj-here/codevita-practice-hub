import { Verdict } from '@/types';

/**
 * Normalizes output string for fair competitive programming comparison:
 * 1. Strips carriage returns (\r)
 * 2. Trims trailing whitespace from each individual line
 * 3. Trims trailing newline characters from the end of the text
 */
export function normalizeOutput(text: string | null | undefined): string {
  if (!text) return '';
  return text
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .split('\n')
    .map((line) => line.trimEnd())
    .join('\n')
    .trimEnd();
}

/**
 * Compares program output against expected output with trailing-whitespace tolerance.
 */
export function compareOutputs(
  actual: string | null | undefined,
  expected: string | null | undefined
): boolean {
  const normActual = normalizeOutput(actual);
  const normExpected = normalizeOutput(expected);
  return normActual === normExpected;
}

/**
 * Determines overall verdict given an array of individual test case results.
 */
export function aggregateVerdicts(
  results: Array<{ verdict: Verdict }>
): Verdict {
  if (!results || results.length === 0) {
    return Verdict.ACCEPTED;
  }

  // If compilation error occurred anywhere, the submission is CE
  if (results.some((r) => r.verdict === Verdict.COMPILATION_ERROR)) {
    return Verdict.COMPILATION_ERROR;
  }

  // Find the first failing verdict (e.g. TLE, WA, RTE, MLE)
  const firstFailure = results.find((r) => r.verdict !== Verdict.ACCEPTED);
  if (firstFailure) {
    return firstFailure.verdict;
  }

  return Verdict.ACCEPTED;
}
