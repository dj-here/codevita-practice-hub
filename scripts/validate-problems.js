const fs = require('fs');
const path = require('path');
const { execFile } = require('child_process');

// Trailing whitespace tolerance comparator
function normalizeOutput(text) {
  if (!text) return '';
  return text
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .split('\n')
    .map((line) => line.trimEnd())
    .join('\n')
    .trimEnd();
}

function compareOutputs(actual, expected) {
  return normalizeOutput(actual) === normalizeOutput(expected);
}

function runTestCase(solutionPath, input, timeoutMs) {
  return new Promise((resolve) => {
    const start = Date.now();
    const child = execFile(
      'python',
      ['-u', solutionPath],
      {
        timeout: Math.max(timeoutMs + 3000, 6000),
        encoding: 'utf8',
        windowsHide: true,
        maxBuffer: 1024 * 1024,
      },
      (error, stdout, stderr) => {
        const elapsed = Date.now() - start;
        resolve({ error, stdout, stderr, elapsed });
      }
    );

    if (input) {
      child.stdin.write(input);
    }
    child.stdin.end();
  });
}

async function validateProblem(problemDir) {
  const jsonPath = path.join(problemDir, 'problem.json');
  const solutionPath = path.join(problemDir, 'solution.py');

  if (!fs.existsSync(jsonPath)) {
    return { success: false, error: 'problem.json missing' };
  }
  if (!fs.existsSync(solutionPath)) {
    return { success: false, error: 'solution.py missing' };
  }

  let problemData;
  try {
    problemData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  } catch (err) {
    return { success: false, error: `Invalid JSON in problem.json: ${err.message}` };
  }

  const { id, title, sampleCases = [], hiddenCases = [], timeLimitMs = 1500 } = problemData;

  if (sampleCases.length < 2) {
    return { success: false, error: `Requires at least 2 sample cases, found ${sampleCases.length}` };
  }
  if (hiddenCases.length < 8) {
    return { success: false, error: `Requires at least 8 hidden test cases, found ${hiddenCases.length}` };
  }

  const allCases = [
    ...sampleCases.map((c, i) => ({ ...c, type: 'sample', idx: i + 1 })),
    ...hiddenCases.map((c, i) => ({ ...c, type: 'hidden', idx: i + 1 })),
  ];

  for (const tc of allCases) {
    const input = tc.input !== undefined ? String(tc.input) : '';
    const expected = tc.expectedOutput !== undefined ? String(tc.expectedOutput) : '';

    const run = await runTestCase(solutionPath, input, timeLimitMs);

    if (run.error) {
      if (run.error.code === 'ETIMEDOUT' || run.error.killed) {
        return {
          success: false,
          error: `Time Limit Exceeded on ${tc.type} case #${tc.idx} (${run.elapsed}ms > ${timeLimitMs}ms)`,
        };
      }
      return {
        success: false,
        error: `Execution error on ${tc.type} case #${tc.idx}: ${run.error.message}`,
      };
    }

    if (run.stderr && run.stderr.trim().length > 0 && !run.stdout) {
      return {
        success: false,
        error: `Runtime Error on ${tc.type} case #${tc.idx}:\n${run.stderr}`,
      };
    }

    const actual = run.stdout || '';
    if (!compareOutputs(actual, expected)) {
      return {
        success: false,
        error: `Output Mismatch on ${tc.type} case #${tc.idx}:\nExpected: [${normalizeOutput(expected)}]\nActual:   [${normalizeOutput(actual)}]`,
      };
    }
  }

  return {
    success: true,
    id,
    title,
    casesTested: allCases.length,
  };
}

async function main() {
  const problemsRoot = path.join(__dirname, '..', 'content', 'problems');
  if (!fs.existsSync(problemsRoot)) {
    console.error(`Problems directory not found: ${problemsRoot}`);
    process.exit(1);
  }

  const dirs = fs
    .readdirSync(problemsRoot)
    .filter((name) => fs.statSync(path.join(problemsRoot, name)).isDirectory())
    .sort();

  // CLI argument parsing for filtering
  const targetArg = process.argv.slice(2).find((a) => !a.startsWith('--'));
  const batchArg = process.argv.slice(2).find((a) => a.startsWith('--batch='));
  
  let targetDirs = dirs;
  if (targetArg) {
    targetDirs = dirs.filter((d) => d.includes(targetArg));
  } else if (batchArg) {
    const batchNum = parseInt(batchArg.split('=')[1], 10);
    const startIdx = (batchNum - 1) * 22;
    targetDirs = dirs.slice(startIdx, startIdx + 22);
  }

  console.log(`================================================================`);
  console.log(`🔍 CODEVITA PRACTICE HUB - PROBLEM BANK VALIDATION HARNESS`);
  console.log(`================================================================`);
  console.log(`Found ${dirs.length} total problems in /content/problems`);
  console.log(`Validating ${targetDirs.length} selected problems against reference solutions...`);
  console.log(`----------------------------------------------------------------`);

  let passedProblems = 0;
  let totalCasesTested = 0;
  const startTime = Date.now();
  const CONCURRENCY = 6;
  let cursor = 0;
  let hasFailed = false;

  async function worker() {
    while (cursor < targetDirs.length && !hasFailed) {
      const idx = cursor++;
      const dirName = targetDirs[idx];
      const problemPath = path.join(problemsRoot, dirName);
      const result = await validateProblem(problemPath);

      if (result.success) {
        passedProblems++;
        totalCasesTested += result.casesTested;
        process.stdout.write(`✅ [${passedProblems}/${targetDirs.length}] ${dirName} (${result.casesTested} cases passed)\n`);
      } else {
        hasFailed = true;
        console.error(`\n❌ FAILED: ${dirName}`);
        console.error(`   Reason: ${result.error}\n`);
        process.exit(1);
      }
    }
  }

  await Promise.all(Array.from({ length: CONCURRENCY }, () => worker()));

  const durationSec = ((Date.now() - startTime) / 1000).toFixed(2);
  console.log(`================================================================`);
  console.log(`🎉 ALL ${passedProblems} PROBLEMS VALIDATED SUCCESSFULLY!`);
  console.log(`   - Total Test Cases Verified: ${totalCasesTested}`);
  console.log(`   - Failure / Mismatch Count: 0`);
  console.log(`   - Total Validation Time: ${durationSec}s`);
  console.log(`================================================================`);
}

main().catch((err) => {
  console.error('Validation harness crash:', err);
  process.exit(1);
});
