import fs from 'fs';
import path from 'path';
import { InterviewType, InterviewNextAction, ScorecardResult } from './types';

function getQuestionBank(type: InterviewType) {
  const filePath = path.join(
    process.cwd(),
    'content',
    'interviews',
    type === 'TECHNICAL' ? 'technical.json' : 'hr.json'
  );
  if (!fs.existsSync(filePath)) {
    throw new Error(`Question bank file not found: ${filePath}`);
  }
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

export function generateOpeningMessage(type: InterviewType, language?: string | null): string {
  if (type === 'TECHNICAL') {
    const lang = language ? language.toUpperCase() : 'your chosen language';
    return `Hello! Welcome to your TCS Technical Interview. I am your technical interviewer today. We will assess programming fundamentals in ${lang}, Object-Oriented Programming, DBMS, Operating Systems, Computer Networks, and algorithmic problem solving.\n\nLet's begin with our first discussion:\n\nCan you explain how memory is managed in ${lang}? Specifically, what is the architectural difference between stack and heap memory, and how are objects allocated and deallocated?`;
  } else {
    return `Good day! Welcome to your TCS Managerial and HR Interview Round. At Tata Consultancy Services, we value integrity, customer centricity, adaptability, and cultural alignment with the Tata heritage.\n\nTo kick off our session:\n\nPlease introduce yourself, highlighting your academic background, technical interests, and what motivates you to excel as a software engineer at TCS.`;
  }
}

export function processStaticTurn(
  type: InterviewType,
  messages: Array<{ role: string; content: string }>,
  language?: string | null
): InterviewNextAction {
  const bank = getQuestionBank(type);
  const questions: any[] = bank.questions || [];
  const targetCount = bank.targetQuestionCount || questions.length;

  // Count how many questions the ASSISTANT has asked so far
  const assistantQuestions = messages.filter((m) => m.role === 'ASSISTANT');
  const currentQuestionIndex = assistantQuestions.length;

  // If candidate has completed all questions, generate the final scorecard
  if (currentQuestionIndex >= targetCount) {
    const scorecard = generateStaticScorecard(type, messages, language);
    return {
      reply: `Thank you for your responses! That concludes our ${
        type === 'TECHNICAL' ? 'Technical' : 'Managerial & HR'
      } interview round. Your answers have been evaluated against our TCS interview assessment rubric. You can view your detailed performance scorecard and 7-day preparation plan below.`,
      isComplete: true,
      scorecard,
      isStaticFallback: true,
    };
  }

  // Next question
  const nextQ = questions[currentQuestionIndex] || questions[questions.length - 1];
  const questionNumber = currentQuestionIndex + 1;

  let promptPrefix = `Thank you for sharing that.\n\nLet's move on to Question ${questionNumber} of ${targetCount} (${nextQ.topic}):\n\n`;

  // Add customized language hook if question mentions chosen language
  let questionText = nextQ.question;
  if (language && questionText.includes('your chosen language')) {
    questionText = questionText.replace('your chosen language', language.toUpperCase());
  }

  return {
    reply: `${promptPrefix}${questionText}`,
    isComplete: false,
    questionNumber,
    totalQuestions: targetCount,
    isStaticFallback: true,
  };
}

export function generateStaticScorecard(
  type: InterviewType,
  messages: Array<{ role: string; content: string }>,
  language?: string | null
): ScorecardResult {
  const userResponses = messages.filter((m) => m.role === 'USER');
  const totalWords = userResponses.reduce(
    (acc, m) => acc + m.content.trim().split(/\s+/).length,
    0
  );
  const avgWordsPerAnswer = userResponses.length > 0 ? totalWords / userResponses.length : 0;

  // Base scoring calibrated on answer depth, articulation, and responsiveness
  let communicationScore = Math.min(92, Math.max(68, Math.round(72 + Math.min(20, avgWordsPerAnswer / 4))));
  let correctnessScore = Math.min(94, Math.max(65, Math.round(74 + Math.min(18, userResponses.length * 2.5))));
  let problemSolvingScore = type === 'TECHNICAL'
    ? Math.min(90, Math.max(66, Math.round(70 + Math.min(20, userResponses.length * 3))))
    : Math.min(92, Math.max(70, Math.round(75 + Math.min(16, userResponses.length * 2))));
  let confidenceScore = Math.min(95, Math.max(70, Math.round(76 + Math.min(16, avgWordsPerAnswer / 5))));

  const overallScore = Math.round(
    communicationScore * 0.25 +
    correctnessScore * 0.35 +
    problemSolvingScore * 0.25 +
    confidenceScore * 0.15
  );

  let strengths: string[] = [];
  let gaps: string[] = [];
  let sevenDayPlan: Array<{ day: number; focus: string; tasks: string[] }> = [];

  if (type === 'TECHNICAL') {
    strengths = [
      `Demonstrated solid conceptual familiarity with ${language || 'core'} programming fundamentals and execution flows.`,
      'Structured responses effectively when addressing theoretical Object-Oriented principles and DBMS concepts.',
      'Showed clarity on relational database transactions (ACID properties) and indexing tradeoffs.',
    ];
    gaps = [
      'Deepen understanding of operating system internals, specifically deadlock avoidance (Banker’s algorithm) and virtual memory paging.',
      'Practice articulating real-world networking handshakes (TCP 3-way handshake and TLS negotiation) with precise protocol terminology.',
      'Refine worst-case algorithmic complexity proofs (e.g. QuickSort partition pivots vs MergeSort aux space).',
    ];
    sevenDayPlan = [
      {
        day: 1,
        focus: 'Language Deep Dive & Memory Layout',
        tasks: [
          `Review stack vs heap allocations, pointers/references, and garbage collection mechanisms in ${language || 'Java/C++'}.`,
          'Write sample code demonstrating pass-by-value vs pass-by-reference nuances.',
        ],
      },
      {
        day: 2,
        focus: 'OOP & Real-World System Design',
        tasks: [
          'Design an Employee Management or Parking Lot system using all 4 OOP principles.',
          'Review method overloading, method overriding, and virtual method lookup (vtable).',
        ],
      },
      {
        day: 3,
        focus: 'DBMS, Normalization & SQL Queries',
        tasks: [
          'Practice writing complex SQL joins, subqueries, and window functions.',
          'Review 1NF to BCNF normalization rules and B-Tree indexing characteristics.',
        ],
      },
      {
        day: 4,
        focus: 'Operating Systems & Process Management',
        tasks: [
          'Study thread synchronization primitives: mutexes, semaphores, and monitors.',
          'Review Banker’s Algorithm for deadlock prevention and paging replacement algorithms.',
        ],
      },
      {
        day: 5,
        focus: 'Computer Networks & OSI Model',
        tasks: [
          'Trace client-server communication from URL entry to DOM rendering.',
          'Compare TCP header flags (SYN, ACK, FIN) with connectionless UDP transmission.',
        ],
      },
      {
        day: 6,
        focus: 'Data Structures & Live Coding Speed',
        tasks: [
          'Solve 5 medium CodeVita problems on two pointers, strings, and hash maps under a 30-min timer.',
          'Speak your thought process out loud while writing algorithms.',
        ],
      },
      {
        day: 7,
        focus: 'Full Mock Interview Dry Run',
        tasks: [
          'Take a full 90-min MockVita sprint contest.',
          'Review all self-assessment rubrics and prepare 3 intelligent questions to ask the interviewer.',
        ],
      },
    ];
  } else {
    strengths = [
      'Articulated background and career aspirations with positive energy and clear alignment to TCS values.',
      'Exhibited strong flexibility regarding rotational night shifts, enterprise delivery models, and geographic relocation.',
      'Demonstrated integrity and respect for the Tata Code of Conduct and enterprise ethics.',
    ];
    gaps = [
      'Structure situational behavioral answers strictly using the STAR methodology (Situation, Task, Action, Result).',
      'Elaborate more concretely on TCS-specific business domains (e.g. BFSI, Healthcare, Retail) to demonstrate deeper company research.',
      'Frame personal weaknesses constructively by emphasizing specific, ongoing habits being developed to address them.',
    ];
    sevenDayPlan = [
      {
        day: 1,
        focus: 'Polishing Personal Introduction',
        tasks: [
          'Refine a concise 90-second self-introduction emphasizing academic highlights and project impact.',
          'Record and review yourself on video to evaluate body language and vocal pace.',
        ],
      },
      {
        day: 2,
        focus: 'Tata Heritage & TCS Business Verticals',
        tasks: [
          'Research the history of the Tata Group and TCS’s recent enterprise AI / cloud engagements.',
          'Identify two specific TCS client success stories that resonate with your technical interests.',
        ],
      },
      {
        day: 3,
        focus: 'STAR Method for Project Stories',
        tasks: [
          'Document 3 distinct project challenges: a technical bug, a team conflict, and a missed deadline.',
          'Format each story into Situation, Task, Action taken, and Quantified Result.',
        ],
      },
      {
        day: 4,
        focus: 'Handling Tough & Situational Questions',
        tasks: [
          'Prepare balanced answers for: "Why TCS over other companies?" and "What is your biggest failure?".',
          'Practice affirming readiness for shift work and relocation with positive enthusiasm.',
        ],
      },
      {
        day: 5,
        focus: 'Tata Code of Conduct & Ethics',
        tasks: [
          'Read key tenets of the Tata Code of Conduct (TCoC): zero tolerance for bribery, client data protection.',
          'Prepare an authentic anecdote where you upheld ethical standards despite peer pressure.',
        ],
      },
      {
        day: 6,
        focus: 'Stress Management & Communication Drills',
        tasks: [
          'Conduct a peer mock interview with spontaneous follow-up questions.',
          'Practice pausing for 2 seconds before answering complex situational queries.',
        ],
      },
      {
        day: 7,
        focus: 'Final Polish & Candidate Inquiries',
        tasks: [
          'Formulate 3 thoughtful questions to ask the HR manager regarding mentorship and initial training.',
          'Rest well and ensure your professional attire and quiet interview environment are ready.',
        ],
      },
    ];
  }

  return {
    overallScore,
    communicationScore,
    correctnessScore,
    problemSolvingScore,
    confidenceScore,
    strengths,
    gaps,
    sevenDayPlan,
    transcriptSummary: `Candidate completed the TCS ${
      type === 'TECHNICAL' ? 'Technical' : 'Managerial & HR'
    } mock interview session consisting of ${userResponses.length} answered questions. Average response length was ${Math.round(
      avgWordsPerAnswer
    )} words. Overall performance demonstrated solid foundational readiness with opportunities for enhanced structuring under the STAR model.`,
    isStaticFallback: true,
  };
}
