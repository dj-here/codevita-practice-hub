export type InterviewType = 'TECHNICAL' | 'MANAGERIAL_HR';

export interface ScorecardResult {
  overallScore: number;
  communicationScore: number;
  correctnessScore: number;
  problemSolvingScore: number;
  confidenceScore: number;
  strengths: string[];
  gaps: string[];
  sevenDayPlan: Array<{ day: number; focus: string; tasks: string[] }>;
  transcriptSummary: string;
  isStaticFallback: boolean;
}

export interface InterviewNextAction {
  reply: string;
  isComplete: boolean;
  scorecard?: ScorecardResult;
  questionNumber?: number;
  totalQuestions?: number;
  isStaticFallback: boolean;
}
