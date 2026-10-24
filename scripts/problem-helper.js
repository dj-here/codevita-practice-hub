const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const problemsDir = path.join(__dirname, '..', 'content', 'problems');
if (!fs.existsSync(problemsDir)) {
  fs.mkdirSync(problemsDir, { recursive: true });
}

function runPython(code, input) {
  const res = spawnSync('python', ['-u', '-c', code], {
    input: String(input),
    encoding: 'utf8',
    windowsHide: true,
    maxBuffer: 1024 * 1024,
  });

  if (res.error) {
    throw new Error(`Python error: ${res.error.message}`);
  }
  if (res.status !== 0) {
    throw new Error(`Python execution failed (exit ${res.status}):\n${res.stderr}`);
  }

  return res.stdout
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .split('\n')
    .map((l) => l.trimEnd())
    .join('\n')
    .trimEnd();
}

function createProblem(data) {
  const dirName = `${data.id}-${data.slug}`;
  const dir = path.join(problemsDir, dirName);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // Generate ground truth for sample cases using reference solution
  const verifiedSamples = (data.sampleCases || []).map((sc) => {
    const trueOutput = runPython(data.solutionCode, sc.input);
    return {
      input: String(sc.input),
      expectedOutput: trueOutput,
      explanation: sc.explanation || null,
    };
  });

  // Generate ground truth for hidden cases using reference solution
  const verifiedHidden = (data.hiddenCases || []).map((hc) => {
    const inputStr = typeof hc === 'string' ? hc : hc.input;
    const trueOutput = runPython(data.solutionCode, inputStr);
    return {
      input: String(inputStr),
      expectedOutput: trueOutput,
    };
  });

  // 1. problem.json
  const problemJson = {
    id: data.id,
    slug: dirName,
    title: data.title,
    difficulty: data.difficulty,
    topics: data.topics,
    timeLimitMs: data.timeLimitMs || 1000,
    memoryLimitKb: data.memoryLimitKb || 262144,
    statement: data.statement.trim(),
    inputFormat: data.inputFormat.trim(),
    outputFormat: data.outputFormat.trim(),
    constraints: data.constraints.trim(),
    sampleCases: verifiedSamples,
    hiddenCases: verifiedHidden,
  };
  fs.writeFileSync(path.join(dir, 'problem.json'), JSON.stringify(problemJson, null, 2), 'utf8');

  // 2. solution.py
  fs.writeFileSync(path.join(dir, 'solution.py'), data.solutionCode.trim() + '\n', 'utf8');

  // 3. editorial.md
  const editorialMd = `# Editorial: ${data.title}

## Problem Analysis
${data.editorial.approach.trim()}

## Complexity Analysis
- **Time Complexity:** ${data.editorial.timeComplexity}
- **Space Complexity:** ${data.editorial.spaceComplexity}
`;
  fs.writeFileSync(path.join(dir, 'editorial.md'), editorialMd, 'utf8');

  return { id: data.id, slug: dirName, totalCases: verifiedSamples.length + verifiedHidden.length };
}

module.exports = {
  createProblem,
  runPython,
};
