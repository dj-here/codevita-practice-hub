const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const easyCandidates = [
  'cv002-coprime-harvest',
  'cv003-modular-power-towers',
  'cv005-goldbach-partitions',
  'cv008-euler-totient-count',
  'cv015-aqueduct-maximum-volume',
  'cv016-next-greater-element',
  'cv017-prefix-sum-target-k',
  'cv019-triplet-zero-sum',
  'cv021-longest-mountain-peak',
  'cv022-minimum-subarray-target',
  'cv030-count-and-say-sequence',
  'cv034-spiral-matrix-route',
  'cv035-rotate-matrix-clockwise',
  'cv036-neutralize-matrix-zones',
  'cv037-archipelago-island-counter',
  'cv044-chessboard-checkerboard-pattern',
  'cv053-well-formed-parentheses',
  'cv060-railway-platform-allocation',
  'cv066-largest-concatenated-number',
  'cv096-merge-overlapping-time-intervals',
  'cv101-two-unique-elements-in-pairs',
  'cv103-haming-distance-total-pairs',
  'cv108-josephus-circle-elimination',
  'cv109-morse-code-decoder-simulation',
  'cv110-traffic-light-junction-simulator',
  'cv128-longest-consecutive-sequence',
  'cv133-rabin-karp-rolling-hash',
  'cv135-bracket-depth-score-evaluator',
  'cv139-simplify-unix-filepath-canonical',
  'cv143-reorganize-string-no-adjacent'
];

const medCandidates = [
  'cv080-dijkstra-courier-fastest-route',
  'cv081-academic-prerequisite-topological-sort',
  'cv088-royal-lineage-lowest-common-ancestor',
  'cv099-painter-partition-deadline',
  'cv155-k-sum-combinations-target'
];

async function updateDifficulties() {
  const problemsDir = path.join(__dirname, '..', 'content', 'problems');
  let count = 0;
  for (const slug of easyCandidates) {
    const pPath = path.join(problemsDir, slug, 'problem.json');
    if (fs.existsSync(pPath)) {
      const data = JSON.parse(fs.readFileSync(pPath, 'utf8'));
      data.difficulty = 'EASY';
      fs.writeFileSync(pPath, JSON.stringify(data, null, 2), 'utf8');
    }
    await prisma.problem.updateMany({
      where: { slug },
      data: { difficulty: 'EASY' }
    });
    count++;
  }

  for (const slug of medCandidates) {
    const pPath = path.join(problemsDir, slug, 'problem.json');
    if (fs.existsSync(pPath)) {
      const data = JSON.parse(fs.readFileSync(pPath, 'utf8'));
      data.difficulty = 'MEDIUM';
      fs.writeFileSync(pPath, JSON.stringify(data, null, 2), 'utf8');
    }
    await prisma.problem.updateMany({
      where: { slug },
      data: { difficulty: 'MEDIUM' }
    });
    count++;
  }
  const [e, m, h, tot] = await Promise.all([
    prisma.problem.count({ where: { difficulty: 'EASY' } }),
    prisma.problem.count({ where: { difficulty: 'MEDIUM' } }),
    prisma.problem.count({ where: { difficulty: 'HARD' } }),
    prisma.problem.count()
  ]);
  console.log('Updated', count, 'problems.');
  console.log({ easy: e, medium: m, hard: h, total: tot });
  console.log({
    easyPct: ((e/tot)*100).toFixed(1) + '%',
    medPct: ((m/tot)*100).toFixed(1) + '%',
    hardPct: ((h/tot)*100).toFixed(1) + '%'
  });
}

updateDifficulties().then(() => prisma.$disconnect());
