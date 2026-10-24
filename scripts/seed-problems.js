const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

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

  console.log(`================================================================`);
  console.log(`🌱 SEEDING ${dirs.length} PROBLEMS FROM /content/problems INTO DATABASE`);
  console.log(`================================================================`);

  // Ensure standard tags exist in the DB
  const tagsMap = new Map();
  const allTags = await prisma.tag.findMany();
  for (const t of allTags) {
    tagsMap.set(t.name, t.id);
  }

  let seededCount = 0;
  for (let i = 0; i < dirs.length; i++) {
    const dirName = dirs[i];
    const jsonPath = path.join(problemsRoot, dirName, 'problem.json');
    const editorialPath = path.join(problemsRoot, dirName, 'editorial.md');

    if (!fs.existsSync(jsonPath)) continue;

    const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    let editorial = data.editorial || '';
    if (fs.existsSync(editorialPath)) {
      editorial = fs.readFileSync(editorialPath, 'utf8');
    }

    // 1. Upsert Problem
    const problem = await prisma.problem.upsert({
      where: { slug: data.slug },
      update: {
        title: data.title,
        statement: data.statement,
        inputFormat: data.inputFormat,
        outputFormat: data.outputFormat,
        constraints: data.constraints,
        difficulty: data.difficulty,
        timeLimitMs: data.timeLimitMs || 1000,
        memoryLimitKb: data.memoryLimitKb || 262144,
        editorial,
        isPublished: true,
      },
      create: {
        slug: data.slug,
        title: data.title,
        statement: data.statement,
        inputFormat: data.inputFormat,
        outputFormat: data.outputFormat,
        constraints: data.constraints,
        difficulty: data.difficulty,
        timeLimitMs: data.timeLimitMs || 1000,
        memoryLimitKb: data.memoryLimitKb || 262144,
        editorial,
        isPublished: true,
      },
    });

    // 2. Clear old test cases and insert updated test cases
    await prisma.testCase.deleteMany({
      where: { problemId: problem.id },
    });

    const testCasesToCreate = [];
    let orderIndex = 1;

    // Sample cases
    for (const sc of data.sampleCases || []) {
      testCasesToCreate.push({
        problemId: problem.id,
        input: String(sc.input),
        expectedOutput: String(sc.expectedOutput),
        isSample: true,
        explanation: sc.explanation || null,
        orderIndex: orderIndex++,
      });
    }

    // Hidden cases
    for (const hc of data.hiddenCases || []) {
      testCasesToCreate.push({
        problemId: problem.id,
        input: String(hc.input),
        expectedOutput: String(hc.expectedOutput),
        isSample: false,
        explanation: null,
        orderIndex: orderIndex++,
      });
    }

    if (testCasesToCreate.length > 0) {
      await prisma.testCase.createMany({
        data: testCasesToCreate,
      });
    }

    // 3. Connect tags
    for (const tagName of data.topics || []) {
      let tagId = tagsMap.get(tagName);
      if (!tagId) {
        const slug = tagName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        const newTag = await prisma.tag.upsert({
          where: { slug },
          update: { name: tagName },
          create: { name: tagName, slug },
        });
        tagId = newTag.id;
        tagsMap.set(tagName, tagId);
      }

      await prisma.problemTag.upsert({
        where: {
          problemId_tagId: {
            problemId: problem.id,
            tagId,
          },
        },
        update: {},
        create: {
          problemId: problem.id,
          tagId,
        },
      });
    }

    seededCount++;
    if ((i + 1) % 25 === 0 || i === dirs.length - 1) {
      console.log(`✅ Seeded [${i + 1}/${dirs.length}] problems into database`);
    }
  }

  console.log(`================================================================`);
  console.log(`🎉 COMPLETED SEEDING ${seededCount} PROBLEMS INTO DATABASE!`);
  console.log(`================================================================`);
}

main()
  .catch((err) => {
    console.error('Seeding problems error:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
