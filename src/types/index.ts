export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export enum Difficulty {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD',
}

export enum ProgrammingLanguage {
  C = 'C',
  CPP = 'CPP',
  JAVA = 'JAVA',
  PYTHON = 'PYTHON',
}

export enum Verdict {
  ACCEPTED = 'ACCEPTED',
  WRONG_ANSWER = 'WRONG_ANSWER',
  TIME_LIMIT_EXCEEDED = 'TIME_LIMIT_EXCEEDED',
  MEMORY_LIMIT_EXCEEDED = 'MEMORY_LIMIT_EXCEEDED',
  RUNTIME_ERROR = 'RUNTIME_ERROR',
  COMPILATION_ERROR = 'COMPILATION_ERROR',
  PENDING = 'PENDING',
  RUNNING = 'RUNNING',
}

export enum ContestPresetType {
  STANDARD_90 = 'STANDARD_90',
  STANDARD_180 = 'STANDARD_180',
  CUSTOM = 'CUSTOM',
}

export enum ContestStatus {
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  TIMED_OUT = 'TIMED_OUT',
}

export enum InterviewType {
  TECHNICAL = 'TECHNICAL',
  MANAGERIAL_HR = 'MANAGERIAL_HR',
}

export enum InterviewStatus {
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  ABANDONED = 'ABANDONED',
}

export enum MessageRole {
  SYSTEM = 'SYSTEM',
  ASSISTANT = 'ASSISTANT',
  USER = 'USER',
}

export interface UserSession {
  id: string;
  name: string | null;
  email: string;
  role: Role;
  image?: string | null;
}

export interface StarterTemplate {
  language: ProgrammingLanguage;
  monacoLanguage: string;
  defaultCode: string;
}

export interface ProblemListItem {
  id: string;
  slug: string;
  title: string;
  difficulty: Difficulty;
  timeLimitMs: number;
  memoryLimitKb: number;
  tags: string[];
  solved?: boolean;
  attempted?: boolean;
}

export interface ProblemDetail extends ProblemListItem {
  statement: string;
  inputFormat: string;
  outputFormat: string;
  constraints: string;
  editorial?: string | null;
  sampleCases: Array<{
    input: string;
    expectedOutput: string;
    explanation?: string | null;
  }>;
}
