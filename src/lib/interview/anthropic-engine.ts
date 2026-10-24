import { InterviewType, InterviewNextAction, ScorecardResult } from './types';
import { processStaticTurn, generateStaticScorecard } from './static-engine';

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';
const ANTHROPIC_MODEL = process.env.ANTHROPIC_MODEL || 'claude-3-5-sonnet-20241022';

function buildSystemPrompt(type: InterviewType, language?: string | null): string {
  if (type === 'TECHNICAL') {
    const lang = language ? language.toUpperCase() : 'the candidate’s chosen language';
    return `You are a Senior Technical Architect and Interviewer conducting an official TCS Technical Interview for a software engineering graduate candidate.
Your evaluation scope covers:
1. Programming fundamentals in ${lang} (memory management, stack vs heap, pointers/references, OOP principles).
2. Database Management Systems (ACID transactions, indexing B-Trees, normalization, complex SQL).
3. Operating Systems (processes vs threads, deadlocks, paging, virtual memory).
4. Computer Networks (TCP 3-way handshake vs UDP, DNS resolution, OSI layers).
5. Algorithmic problem-solving and complexity analysis.

RULES OF CONDUCT:
- Ask exactly ONE question at a time. Never dump multiple questions.
- If the candidate gives a shallow, one-sentence, or vague answer, ask a sharp technical follow-up to test depth before moving to the next topic.
- Maintain a polite, professional, yet rigorous TCS interviewer tone.
- Total target questions in this interview: 7 questions.
- Keep track of question progression. If this is question 7 and the candidate gives a complete answer, declare the interview concluded and append a JSON scorecard block at the end formatted strictly as:
\`\`\`json
{
  "isScorecard": true,
  "overallScore": 85,
  "communicationScore": 84,
  "correctnessScore": 88,
  "problemSolvingScore": 86,
  "confidenceScore": 82,
  "strengths": ["...", "..."],
  "gaps": ["...", "..."],
  "sevenDayPlan": [{"day": 1, "focus": "...", "tasks": ["..."]}],
  "transcriptSummary": "..."
}
\`\`\`
Do not include this JSON until the final 7th question has been answered.`;
  } else {
    return `You are an HR Delivery Manager conducting an official TCS Managerial and HR Interview Round for a software engineering candidate.
Your evaluation scope covers:
1. Personal background, self-introduction, and technical aspirations.
2. Willingness to work in rotational night shifts and relocate anywhere in India/abroad (essential TCS requirement).
3. Specific motivation for joining Tata Consultancy Services and familiarity with Tata Code of Conduct (TCoC).
4. Situational conflict resolution, teamwork, and high-pressure deadline management using the STAR method.
5. Continuous learning agility and candidate questions.

RULES OF CONDUCT:
- Ask exactly ONE question at a time.
- If the candidate dodges the shift/relocation question, probe for a definitive, clear commitment.
- If a situational answer lacks detail, prompt them: "Can you describe the specific action you took and the measurable outcome?".
- Total target questions: 8 questions.
- Keep track of question progression. If this is question 8 and the candidate gives their final answer, conclude the interview and append a JSON scorecard block at the end formatted strictly as:
\`\`\`json
{
  "isScorecard": true,
  "overallScore": 88,
  "communicationScore": 89,
  "correctnessScore": 85,
  "problemSolvingScore": 86,
  "confidenceScore": 90,
  "strengths": ["...", "..."],
  "gaps": ["...", "..."],
  "sevenDayPlan": [{"day": 1, "focus": "...", "tasks": ["..."]}],
  "transcriptSummary": "..."
}
\`\`\`
Do not include this JSON until the final 8th question has been answered.`;
  }
}

export async function processInterviewTurn(
  type: InterviewType,
  messages: Array<{ role: string; content: string }>,
  language?: string | null
): Promise<InterviewNextAction> {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  // 1. If no API key configured, use deterministic static fallback engine
  if (!apiKey || apiKey.trim() === '' || apiKey.startsWith('sk-ant-xxx')) {
    return processStaticTurn(type, messages, language);
  }

  // 2. Format message history for Anthropic API
  const systemPrompt = buildSystemPrompt(type, language);
  const formattedMessages = messages
    .filter((m) => m.role === 'USER' || m.role === 'ASSISTANT')
    .map((m) => ({
      role: m.role === 'USER' ? 'user' : 'assistant',
      content: m.content,
    }));

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000); // 20s timeout

    const response = await fetch(ANTHROPIC_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: ANTHROPIC_MODEL,
        max_tokens: 1500,
        system: systemPrompt,
        messages: formattedMessages,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      console.warn(`Anthropic API returned status ${response.status}. Falling back to static question bank.`);
      return processStaticTurn(type, messages, language);
    }

    const data = await response.json();
    const assistantReply: string = data.content?.[0]?.text || '';

    // Check if reply contains the scorecard JSON block
    const jsonMatch = assistantReply.match(/```json\s*(\{[\s\S]*?"isScorecard":\s*true[\s\S]*?\})\s*```/);

    if (jsonMatch) {
      try {
        const parsedScorecard = JSON.parse(jsonMatch[1]);
        const cleanedReply = assistantReply.replace(/```json[\s\S]*?```/, '').trim();

        const scorecard: ScorecardResult = {
          overallScore: Number(parsedScorecard.overallScore) || 80,
          communicationScore: Number(parsedScorecard.communicationScore) || 80,
          correctnessScore: Number(parsedScorecard.correctnessScore) || 80,
          problemSolvingScore: Number(parsedScorecard.problemSolvingScore) || 80,
          confidenceScore: Number(parsedScorecard.confidenceScore) || 80,
          strengths: Array.isArray(parsedScorecard.strengths) ? parsedScorecard.strengths : [],
          gaps: Array.isArray(parsedScorecard.gaps) ? parsedScorecard.gaps : [],
          sevenDayPlan: Array.isArray(parsedScorecard.sevenDayPlan) ? parsedScorecard.sevenDayPlan : [],
          transcriptSummary: parsedScorecard.transcriptSummary || 'Interview concluded successfully.',
          isStaticFallback: false,
        };

        return {
          reply: cleanedReply,
          isComplete: true,
          scorecard,
          isStaticFallback: false,
        };
      } catch (err) {
        console.error('Failed to parse Claude scorecard JSON:', err);
      }
    }

    return {
      reply: assistantReply,
      isComplete: false,
      isStaticFallback: false,
    };
  } catch (error: any) {
    console.error('Error invoking Anthropic API:', error.message || error);
    // Graceful fallback to static question bank
    return processStaticTurn(type, messages, language);
  }
}
