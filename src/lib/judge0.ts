import { spawn, exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { ProgrammingLanguage, Verdict } from '@/types';
import { LANGUAGE_CONFIGS } from './starter-templates';
import { compareOutputs } from './verdicts';

export interface ExecutionRequest {
  language: ProgrammingLanguage;
  code: string;
  stdin: string;
  expectedOutput?: string;
  timeLimitMs?: number;
  memoryLimitKb?: number;
}

export interface ExecutionResult {
  verdict: Verdict;
  executionTimeMs: number;
  memoryKb: number;
  stdout: string;
  stderr: string;
  compileOutput: string;
}

const MAX_OUTPUT_SIZE_BYTES = 64 * 1024; // 64 KB output size cap

/**
 * Executes code against input. Tries Judge0 CE API first if configured and reachable;
 * falls back to isolated local sandbox runner with strict time and output caps.
 */
export async function executeCode(
  req: ExecutionRequest
): Promise<ExecutionResult> {
  const timeLimitMs = req.timeLimitMs || 1000;
  const memoryLimitKb = req.memoryLimitKb || 262144;
  const judge0Url = process.env.JUDGE0_API_URL;

  // 1. Attempt Judge0 CE API if URL is provided
  if (judge0Url) {
    try {
      const judge0Result = await tryJudge0Execution(judge0Url, req, timeLimitMs, memoryLimitKb);
      if (judge0Result) {
        return judge0Result;
      }
    } catch {
      // Judge0 unavailable or errored; fallback to local runner
    }
  }

  // 2. Local isolated sandbox execution
  return executeLocally(req, timeLimitMs, memoryLimitKb);
}

/**
 * Execute via Judge0 CE REST API
 */
async function tryJudge0Execution(
  baseUrl: string,
  req: ExecutionRequest,
  timeLimitMs: number,
  memoryLimitKb: number
): Promise<ExecutionResult | null> {
  const langConfig = LANGUAGE_CONFIGS[req.language];
  if (!langConfig) return null;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeLimitMs + 5000);

  try {
    const payload = {
      source_code: Buffer.from(req.code).toString('base64'),
      language_id: langConfig.judge0Id,
      stdin: Buffer.from(req.stdin || '').toString('base64'),
      expected_output: req.expectedOutput
        ? Buffer.from(req.expectedOutput).toString('base64')
        : undefined,
      cpu_time_limit: Math.max(0.5, timeLimitMs / 1000),
      memory_limit: memoryLimitKb,
      enable_network: false,
      max_file_size: 1024,
    };

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (process.env.JUDGE0_API_KEY) {
      headers['X-Auth-Token'] = process.env.JUDGE0_API_KEY;
    }

    const res = await fetch(
      `${baseUrl.replace(/\/$/, '')}/submissions?base64_encoded=true&wait=true`,
      {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
        signal: controller.signal,
      }
    );

    clearTimeout(timeoutId);

    if (!res.ok) return null;

    const data = await res.json();
    const stdout = data.stdout ? Buffer.from(data.stdout, 'base64').toString('utf8') : '';
    const stderr = data.stderr ? Buffer.from(data.stderr, 'base64').toString('utf8') : '';
    const compileOutput = data.compile_output
      ? Buffer.from(data.compile_output, 'base64').toString('utf8')
      : '';
    const executionTimeMs = Math.round((parseFloat(data.time) || 0) * 1000);
    const memoryKb = data.memory || 0;

    let verdict = Verdict.WRONG_ANSWER;
    const statusId = data.status?.id;

    if (statusId === 3) {
      verdict = Verdict.ACCEPTED;
    } else if (statusId === 4) {
      verdict = Verdict.WRONG_ANSWER;
    } else if (statusId === 5) {
      verdict = Verdict.TIME_LIMIT_EXCEEDED;
    } else if (statusId === 6) {
      verdict = Verdict.COMPILATION_ERROR;
    } else if (statusId >= 7 && statusId <= 12) {
      verdict = Verdict.RUNTIME_ERROR;
    } else if (req.expectedOutput) {
      verdict = compareOutputs(stdout, req.expectedOutput)
        ? Verdict.ACCEPTED
        : Verdict.WRONG_ANSWER;
    }

    return {
      verdict,
      executionTimeMs,
      memoryKb,
      stdout: stdout.slice(0, MAX_OUTPUT_SIZE_BYTES),
      stderr: stderr.slice(0, MAX_OUTPUT_SIZE_BYTES),
      compileOutput: compileOutput.slice(0, MAX_OUTPUT_SIZE_BYTES),
    };
  } catch {
    clearTimeout(timeoutId);
    return null;
  }
}

/**
 * Execute locally in an isolated temporary directory with timeouts & limits
 */
export async function executeLocally(
  req: ExecutionRequest,
  timeLimitMs: number,
  memoryLimitKb: number
): Promise<ExecutionResult> {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'cv-judge-'));

  try {
    switch (req.language) {
      case ProgrammingLanguage.PYTHON:
        return await executePython(tempDir, req.code, req.stdin, req.expectedOutput, timeLimitMs);
      case ProgrammingLanguage.CPP:
        return await executeCpp(tempDir, req.code, req.stdin, req.expectedOutput, timeLimitMs);
      case ProgrammingLanguage.C:
        return await executeC(tempDir, req.code, req.stdin, req.expectedOutput, timeLimitMs);
      case ProgrammingLanguage.JAVA:
        return await executeJava(tempDir, req.code, req.stdin, req.expectedOutput, timeLimitMs);
      default:
        throw new Error(`Unsupported programming language: ${req.language}`);
    }
  } finally {
    // Cleanup temp directory
    try {
      fs.rmSync(tempDir, { recursive: true, force: true });
    } catch {}
  }
}

// ---------------------------------------------------------------------------
// Python Executor
// ---------------------------------------------------------------------------
async function executePython(
  dir: string,
  code: string,
  stdin: string,
  expectedOutput: string | undefined,
  timeLimitMs: number
): Promise<ExecutionResult> {
  const filePath = path.join(dir, 'solution.py');
  fs.writeFileSync(filePath, code, 'utf8');

  // Syntax check first using python -m py_compile
  const syntaxCheck = await runProcess('python', ['-m', 'py_compile', filePath], '', 5000);
  if (syntaxCheck.exitCode !== 0) {
    return {
      verdict: Verdict.COMPILATION_ERROR,
      executionTimeMs: 0,
      memoryKb: 0,
      stdout: '',
      stderr: syntaxCheck.stderr,
      compileOutput: syntaxCheck.stderr || 'Python SyntaxError / Compilation Error',
    };
  }

  const startTime = Date.now();
  const run = await runProcess('python', ['-u', filePath], stdin, timeLimitMs);
  const executionTimeMs = Date.now() - startTime;

  if (run.timedOut) {
    return {
      verdict: Verdict.TIME_LIMIT_EXCEEDED,
      executionTimeMs: timeLimitMs,
      memoryKb: 0,
      stdout: run.stdout,
      stderr: 'Time Limit Exceeded',
      compileOutput: '',
    };
  }

  if (run.exitCode !== 0) {
    return {
      verdict: Verdict.RUNTIME_ERROR,
      executionTimeMs,
      memoryKb: 0,
      stdout: run.stdout,
      stderr: run.stderr,
      compileOutput: '',
    };
  }

  const verdict = expectedOutput !== undefined
    ? (compareOutputs(run.stdout, expectedOutput) ? Verdict.ACCEPTED : Verdict.WRONG_ANSWER)
    : Verdict.ACCEPTED;

  return {
    verdict,
    executionTimeMs,
    memoryKb: 0,
    stdout: run.stdout,
    stderr: run.stderr,
    compileOutput: '',
  };
}

// ---------------------------------------------------------------------------
// C++ Executor (g++)
// ---------------------------------------------------------------------------
async function executeCpp(
  dir: string,
  code: string,
  stdin: string,
  expectedOutput: string | undefined,
  timeLimitMs: number
): Promise<ExecutionResult> {
  const srcPath = path.join(dir, 'solution.cpp');
  const binPath = path.join(dir, process.platform === 'win32' ? 'solution.exe' : 'solution');
  fs.writeFileSync(srcPath, code, 'utf8');

  // Compile with -std=c++14 for broad GCC/MinGW compatibility
  const compile = await runProcess('g++', ['-O2', '-std=c++14', srcPath, '-o', binPath], '', 10000);
  if (compile.exitCode !== 0) {
    return {
      verdict: Verdict.COMPILATION_ERROR,
      executionTimeMs: 0,
      memoryKb: 0,
      stdout: '',
      stderr: compile.stderr,
      compileOutput: compile.stderr || 'Compilation Failed',
    };
  }

  // Run
  const startTime = Date.now();
  const run = await runProcess(binPath, [], stdin, timeLimitMs);
  const executionTimeMs = Date.now() - startTime;

  if (run.timedOut) {
    return {
      verdict: Verdict.TIME_LIMIT_EXCEEDED,
      executionTimeMs: timeLimitMs,
      memoryKb: 0,
      stdout: run.stdout,
      stderr: 'Time Limit Exceeded',
      compileOutput: '',
    };
  }

  if (run.exitCode !== 0) {
    return {
      verdict: Verdict.RUNTIME_ERROR,
      executionTimeMs,
      memoryKb: 0,
      stdout: run.stdout,
      stderr: run.stderr,
      compileOutput: '',
    };
  }

  const verdict = expectedOutput !== undefined
    ? (compareOutputs(run.stdout, expectedOutput) ? Verdict.ACCEPTED : Verdict.WRONG_ANSWER)
    : Verdict.ACCEPTED;

  return {
    verdict,
    executionTimeMs,
    memoryKb: 0,
    stdout: run.stdout,
    stderr: run.stderr,
    compileOutput: '',
  };
}

// ---------------------------------------------------------------------------
// C Executor (gcc)
// ---------------------------------------------------------------------------
async function executeC(
  dir: string,
  code: string,
  stdin: string,
  expectedOutput: string | undefined,
  timeLimitMs: number
): Promise<ExecutionResult> {
  const srcPath = path.join(dir, 'solution.c');
  const binPath = path.join(dir, process.platform === 'win32' ? 'solution.exe' : 'solution');
  fs.writeFileSync(srcPath, code, 'utf8');

  // Compile
  const compile = await runProcess('gcc', ['-O2', srcPath, '-o', binPath, '-lm'], '', 10000);
  if (compile.exitCode !== 0) {
    return {
      verdict: Verdict.COMPILATION_ERROR,
      executionTimeMs: 0,
      memoryKb: 0,
      stdout: '',
      stderr: compile.stderr,
      compileOutput: compile.stderr || 'Compilation Failed',
    };
  }

  // Run
  const startTime = Date.now();
  const run = await runProcess(binPath, [], stdin, timeLimitMs);
  const executionTimeMs = Date.now() - startTime;

  if (run.timedOut) {
    return {
      verdict: Verdict.TIME_LIMIT_EXCEEDED,
      executionTimeMs: timeLimitMs,
      memoryKb: 0,
      stdout: run.stdout,
      stderr: 'Time Limit Exceeded',
      compileOutput: '',
    };
  }

  if (run.exitCode !== 0) {
    return {
      verdict: Verdict.RUNTIME_ERROR,
      executionTimeMs,
      memoryKb: 0,
      stdout: run.stdout,
      stderr: run.stderr,
      compileOutput: '',
    };
  }

  const verdict = expectedOutput !== undefined
    ? (compareOutputs(run.stdout, expectedOutput) ? Verdict.ACCEPTED : Verdict.WRONG_ANSWER)
    : Verdict.ACCEPTED;

  return {
    verdict,
    executionTimeMs,
    memoryKb: 0,
    stdout: run.stdout,
    stderr: run.stderr,
    compileOutput: '',
  };
}

// ---------------------------------------------------------------------------
// Java Executor (javac & java)
// ---------------------------------------------------------------------------
async function executeJava(
  dir: string,
  code: string,
  stdin: string,
  expectedOutput: string | undefined,
  timeLimitMs: number
): Promise<ExecutionResult> {
  // If user class is not Main, we rename or ensure Main exists
  let sanitizedCode = code;
  if (!sanitizedCode.includes('public class Main') && sanitizedCode.includes('public class Solution')) {
    sanitizedCode = sanitizedCode.replace('public class Solution', 'public class Main');
  }

  const srcPath = path.join(dir, 'Main.java');
  fs.writeFileSync(srcPath, sanitizedCode, 'utf8');

  // Compile
  const compile = await runProcess('javac', [srcPath], '', 10000);
  if (compile.exitCode !== 0) {
    return {
      verdict: Verdict.COMPILATION_ERROR,
      executionTimeMs: 0,
      memoryKb: 0,
      stdout: '',
      stderr: compile.stderr,
      compileOutput: compile.stderr || 'Compilation Failed',
    };
  }

  // Run
  const startTime = Date.now();
  const run = await runProcess('java', ['-cp', dir, '-Xmx256m', 'Main'], stdin, timeLimitMs + 1000);
  const executionTimeMs = Date.now() - startTime;

  if (run.timedOut) {
    return {
      verdict: Verdict.TIME_LIMIT_EXCEEDED,
      executionTimeMs: timeLimitMs,
      memoryKb: 0,
      stdout: run.stdout,
      stderr: 'Time Limit Exceeded',
      compileOutput: '',
    };
  }

  if (run.exitCode !== 0) {
    return {
      verdict: Verdict.RUNTIME_ERROR,
      executionTimeMs,
      memoryKb: 0,
      stdout: run.stdout,
      stderr: run.stderr,
      compileOutput: '',
    };
  }

  const verdict = expectedOutput !== undefined
    ? (compareOutputs(run.stdout, expectedOutput) ? Verdict.ACCEPTED : Verdict.WRONG_ANSWER)
    : Verdict.ACCEPTED;

  return {
    verdict,
    executionTimeMs,
    memoryKb: 0,
    stdout: run.stdout,
    stderr: run.stderr,
    compileOutput: '',
  };
}

// ---------------------------------------------------------------------------
// Helper: Run subprocess with stdin, timeout, and output truncation
// ---------------------------------------------------------------------------
interface ProcessOutput {
  stdout: string;
  stderr: string;
  exitCode: number | null;
  timedOut: boolean;
}

function runProcess(
  cmd: string,
  args: string[],
  stdin: string,
  timeoutMs: number
): Promise<ProcessOutput> {
  return new Promise((resolve) => {
    let stdout = '';
    let stderr = '';
    let timedOut = false;
    let finished = false;

    const child = spawn(cmd, args, {
      windowsHide: true,
      stdio: ['pipe', 'pipe', 'pipe'],
    });

    const timer = setTimeout(() => {
      timedOut = true;
      if (process.platform === 'win32' && child.pid) {
        exec(`taskkill /pid ${child.pid} /t /f`, () => {});
      } else {
        try {
          child.kill('SIGKILL');
        } catch {}
      }
    }, timeoutMs);

    if (stdin) {
      try {
        child.stdin.write(stdin);
        child.stdin.end();
      } catch {}
    } else {
      try {
        child.stdin.end();
      } catch {}
    }

    child.stdout.on('data', (data) => {
      if (stdout.length < MAX_OUTPUT_SIZE_BYTES) {
        stdout += data.toString();
      }
    });

    child.stderr.on('data', (data) => {
      if (stderr.length < MAX_OUTPUT_SIZE_BYTES) {
        stderr += data.toString();
      }
    });

    child.on('error', (err) => {
      if (!finished) {
        finished = true;
        clearTimeout(timer);
        resolve({
          stdout,
          stderr: err.message,
          exitCode: 1,
          timedOut: false,
        });
      }
    });

    child.on('close', (code) => {
      if (!finished) {
        finished = true;
        clearTimeout(timer);
        resolve({
          stdout: stdout.slice(0, MAX_OUTPUT_SIZE_BYTES),
          stderr: stderr.slice(0, MAX_OUTPUT_SIZE_BYTES),
          exitCode: timedOut ? 124 : code,
          timedOut,
        });
      }
    });
  });
}
