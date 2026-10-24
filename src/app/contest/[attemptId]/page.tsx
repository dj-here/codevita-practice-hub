'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  Trophy,
  Clock,
  Play,
  Send,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ChevronRight,
  Code2,
  FileText,
  Terminal,
  Award,
  ChevronLeft,
  RotateCcw,
} from 'lucide-react';
import MonacoEditorWrapper from '@/components/editor/MonacoEditorWrapper';
import ConsoleOutput from '@/components/judge/ConsoleOutput';
import { VerdictBadge } from '@/components/judge/VerdictBadge';
import { getStarterTemplate } from '@/lib/starter-templates';
import { ProgrammingLanguage } from '@/types';

export default function ContestArenaPage({
  params,
}: {
  params: { attemptId: string };
}) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { attemptId } = params;

  const [contestData, setContestData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeProblemIdx, setActiveProblemIdx] = useState(0);

  // Editor state
  const [language, setLanguage] = useState<ProgrammingLanguage>(ProgrammingLanguage.PYTHON);
  const [code, setCode] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Console state
  const [customInput, setCustomInput] = useState('');
  const [useCustomInput, setUseCustomInput] = useState(false);
  const [runResults, setRunResults] = useState<any>(null);
  const [submitResult, setSubmitResult] = useState<any>(null);
  const [activeConsoleTab, setActiveConsoleTab] = useState<'testcases' | 'output' | 'submit'>('testcases');

  // Timer state
  const [remainingSec, setRemainingSec] = useState<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Scoreboard modal state
  const [showScoreboard, setShowScoreboard] = useState(false);
  const [showFinishModal, setShowFinishModal] = useState(false);

  // 1. Load Contest Attempt Data
  async function fetchContestAttempt() {
    try {
      const res = await fetch(`/api/contests/${attemptId}`);
      if (res.ok) {
        const data = await res.json();
        setContestData(data);

        // Check if contest is already completed or timed out
        if (data.attempt.status !== 'IN_PROGRESS') {
          router.replace(`/contest/${attemptId}/review`);
          return;
        }

        // Initialize server-authoritative timer:
        // calculate real remaining seconds based on server endsAt
        const endsAtMs = new Date(data.attempt.endsAt).getTime();
        const serverRemaining = Math.max(0, Math.floor((endsAtMs - Date.now()) / 1000));
        setRemainingSec(serverRemaining);

        // Load starter code for active problem
        if (data.problems && data.problems[activeProblemIdx]) {
          const defaultCode = getStarterTemplate(language);
          setCode(defaultCode);
        }
      } else if (res.status === 401) {
        router.push(`/login?callbackUrl=/contest/${attemptId}`);
      } else {
        alert('Contest attempt not found');
        router.push('/contest');
      }
    } catch (e) {
      console.error('Failed to load contest:', e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchContestAttempt();
  }, [attemptId]);

  // 2. Server-Authoritative Countdown Interval (survives page refresh)
  useEffect(() => {
    if (!contestData || contestData.attempt.status !== 'IN_PROGRESS') return;

    timerRef.current = setInterval(() => {
      const endsAtMs = new Date(contestData.attempt.endsAt).getTime();
      const currentRemaining = Math.max(0, Math.floor((endsAtMs - Date.now()) / 1000));
      setRemainingSec(currentRemaining);

      // Auto-submit when timer expires
      if (currentRemaining <= 0) {
        if (timerRef.current) clearInterval(timerRef.current);
        handleAutoFinish();
      }
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [contestData]);

  // Update editor code when problem or language changes
  useEffect(() => {
    if (!contestData?.problems) return;
    const currentProb = contestData.problems[activeProblemIdx];
    if (!currentProb) return;

    // Check localStorage saved draft for this problem and language
    const draftKey = `contest_draft_${attemptId}_${currentProb.problemId}_${language}`;
    const saved = localStorage.getItem(draftKey);
    if (saved) {
      setCode(saved);
    } else {
      setCode(getStarterTemplate(language));
    }
  }, [activeProblemIdx, language, contestData]);

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
    if (contestData?.problems) {
      const currentProb = contestData.problems[activeProblemIdx];
      if (currentProb) {
        const draftKey = `contest_draft_${attemptId}_${currentProb.problemId}_${language}`;
        localStorage.setItem(draftKey, newCode);
      }
    }
  };

  // 3. Auto-finish contest when timer hits 0
  const handleAutoFinish = async () => {
    try {
      await fetch(`/api/contests/${attemptId}/finish`, { method: 'POST' });
      alert('Contest time has expired! Your contest attempt has been automatically submitted.');
      router.push(`/contest/${attemptId}/review`);
    } catch (e) {
      router.push(`/contest/${attemptId}/review`);
    }
  };

  // 4. Manual Finish Contest
  const handleManualFinish = async () => {
    setShowFinishModal(false);
    try {
      const res = await fetch(`/api/contests/${attemptId}/finish`, { method: 'POST' });
      if (res.ok) {
        router.push(`/contest/${attemptId}/review`);
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to finalize contest');
      }
    } catch (e) {
      console.error(e);
      alert('Error finalizing contest');
    }
  };

  // 5. Run Sample Cases
  const handleRunSampleCases = async () => {
    const currentProb = contestData?.problems[activeProblemIdx];
    if (!currentProb) return;

    setIsRunning(true);
    setRunResults(null);
    setActiveConsoleTab('output');

    try {
      const res = await fetch('/api/judge/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problemId: currentProb.problemId,
          language,
          code,
          customInput: useCustomInput ? customInput : undefined,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setRunResults(data.caseResults || []);
      } else {
        const err = await res.json();
        setRunResults([
          {
            caseIndex: 1,
            input: '',
            expectedOutput: '',
            stdout: '',
            stderr: err.error || 'Execution failed',
            compileOutput: err.error || '',
            executionTimeMs: 0,
            verdict: 'COMPILATION_ERROR',
          },
        ]);
      }
    } catch (e) {
      setRunResults([
        {
          caseIndex: 1,
          input: '',
          expectedOutput: '',
          stdout: '',
          stderr: 'Failed to communicate with sandbox engine.',
          compileOutput: '',
          executionTimeMs: 0,
          verdict: 'RUNTIME_ERROR',
        },
      ]);
    } finally {
      setIsRunning(false);
    }
  };

  // 6. Submit to Contest (executes against hidden test cases)
  const handleSubmitContest = async () => {
    const currentProb = contestData?.problems[activeProblemIdx];
    if (!currentProb) return;

    setIsSubmitting(true);
    setSubmitResult(null);
    setActiveConsoleTab('submit');

    try {
      const res = await fetch(`/api/contests/${attemptId}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problemId: currentProb.problemId,
          language,
          code,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setSubmitResult(data.submission);

        // Update local contest state with updated score and problem solved status
        setContestData((prev: any) => {
          if (!prev) return prev;
          const updatedProblems = [...prev.problems];
          if (data.isSolved) {
            updatedProblems[activeProblemIdx] = {
              ...updatedProblems[activeProblemIdx],
              solved: true,
              bestVerdict: 'ACCEPTED',
            };
          } else {
            updatedProblems[activeProblemIdx] = {
              ...updatedProblems[activeProblemIdx],
              bestVerdict: data.submission.verdict,
            };
          }
          return {
            ...prev,
            attempt: {
              ...prev.attempt,
              score: data.updatedScore,
            },
            problems: updatedProblems,
          };
        });
      } else {
        const err = await res.json();
        setSubmitResult({
          submissionId: '',
          verdict: 'COMPILATION_ERROR',
          executionTimeMs: 0,
          memoryKb: 0,
          totalCases: 0,
          passedCases: 0,
          compileOutput: err.error || 'Contest submission rejected',
        });
      }
    } catch (e) {
      setSubmitResult({
        submissionId: '',
        verdict: 'RUNTIME_ERROR',
        executionTimeMs: 0,
        memoryKb: 0,
        totalCases: 0,
        passedCases: 0,
        compileOutput: 'Failed to process contest submission.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading || !contestData) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-12 space-y-3">
        <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs text-slate-400">Loading contest arena & timer...</span>
      </div>
    );
  }

  const currentProblem = contestData.problems[activeProblemIdx];
  const formatTime = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const isLowTime = remainingSec <= 300; // Under 5 minutes remaining

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] w-full overflow-hidden bg-slate-950 text-slate-200">
      {/* Contest Top Bar */}
      <div className="h-14 bg-slate-900 border-b border-slate-800 px-4 flex items-center justify-between shrink-0">
        {/* Left: Title & Live Score */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span className="font-bold text-sm text-white truncate max-w-[200px] sm:max-w-[320px]">
              {contestData.attempt.contestTitle}
            </span>
          </div>

          <div className="hidden sm:flex items-center space-x-1 px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-xs font-semibold text-amber-300">
            <span>Score:</span>
            <span className="font-bold text-white">{contestData.attempt.score} pts</span>
          </div>
        </div>

        {/* Center: Server-Authoritative Countdown Timer */}
        <div className="flex items-center space-x-2">
          <div
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg border font-mono text-sm font-bold tracking-wider transition ${
              isLowTime
                ? 'bg-rose-950/80 border-rose-500/60 text-rose-300 animate-pulse'
                : 'bg-slate-950 border-slate-800 text-amber-400'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>{formatTime(remainingSec)}</span>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowScoreboard(!showScoreboard)}
            className="hidden md:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-semibold transition"
          >
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span>Scoreboard</span>
          </button>

          <button
            onClick={() => setShowFinishModal(true)}
            className="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs transition shadow-sm shadow-rose-600/30"
          >
            Finish Contest
          </button>
        </div>
      </div>

      {/* Problem Tabs Navigation Bar */}
      <div className="h-10 bg-slate-950 border-b border-slate-800 px-4 flex items-center space-x-2 shrink-0 overflow-x-auto">
        {contestData.problems.map((prob: any, idx: number) => {
          const isCurrent = idx === activeProblemIdx;
          const letter = String.fromCharCode(65 + idx); // A, B, C...

          return (
            <button
              key={prob.problemId}
              onClick={() => setActiveProblemIdx(idx)}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-md text-xs font-semibold transition shrink-0 ${
                isCurrent
                  ? 'bg-slate-800 text-white border border-slate-700 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <span>Problem {letter}</span>
              {prob.solved ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              ) : prob.bestVerdict !== 'UNATTEMPTED' ? (
                <span className="w-2 h-2 rounded-full bg-amber-400" />
              ) : null}
            </button>
          );
        })}
      </div>

      {/* Arena Split Workspace */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        {/* Left Pane: Problem Description & Sample Cases */}
        <div className="w-full md:w-1/2 h-full overflow-y-auto p-6 space-y-6 border-r border-slate-800 bg-slate-950">
          <div className="space-y-2 border-b border-slate-800 pb-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-400">
                Problem {String.fromCharCode(65 + activeProblemIdx)} • {currentProblem.points} Points
              </span>
              <span
                className={`text-[10px] px-2 py-0.5 rounded font-semibold uppercase ${
                  currentProblem.difficulty === 'EASY'
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/40'
                    : currentProblem.difficulty === 'MEDIUM'
                    ? 'bg-amber-950 text-amber-300 border border-amber-800/40'
                    : 'bg-rose-950 text-rose-300 border border-rose-800/40'
                }`}
              >
                {currentProblem.difficulty}
              </span>
            </div>
            <h1 className="text-xl font-bold text-white">{currentProblem.title}</h1>
            <div className="flex items-center space-x-4 text-xs text-slate-400 pt-1">
              <span>Time Limit: {currentProblem.timeLimitMs}ms</span>
              <span>Memory Limit: {Math.floor(currentProblem.memoryLimitKb / 1024)}MB</span>
            </div>
          </div>

          {/* Statement */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Problem Description
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">
              {currentProblem.statement}
            </p>
          </div>

          {/* Input & Output Format */}
          <div className="space-y-4">
            <div className="space-y-1">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Input Format
              </h3>
              <p className="text-xs text-slate-300 whitespace-pre-line">
                {currentProblem.inputFormat}
              </p>
            </div>

            <div className="space-y-1">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Output Format
              </h3>
              <p className="text-xs text-slate-300 whitespace-pre-line">
                {currentProblem.outputFormat}
              </p>
            </div>

            <div className="space-y-1">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Constraints
              </h3>
              <p className="text-xs text-slate-300 font-mono bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                {currentProblem.constraints}
              </p>
            </div>
          </div>

          {/* Sample Cases */}
          <div className="space-y-4 pt-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Sample Test Cases
            </h3>
            {currentProblem.sampleCases.map((sc: any, idx: number) => (
              <div
                key={sc.id || idx}
                className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3"
              >
                <span className="text-xs font-bold text-blue-400">Sample Case #{idx + 1}</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase mb-1">Input</span>
                    <pre className="p-2 rounded bg-slate-950 font-mono text-xs text-slate-200 overflow-x-auto border border-slate-800">
                      {sc.input}
                    </pre>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase mb-1">Expected Output</span>
                    <pre className="p-2 rounded bg-slate-950 font-mono text-xs text-slate-200 overflow-x-auto border border-slate-800">
                      {sc.expectedOutput}
                    </pre>
                  </div>
                </div>
                {sc.explanation && (
                  <p className="text-xs text-slate-400 italic pt-1">
                    <span className="text-slate-300 font-medium">Explanation: </span>
                    {sc.explanation}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Pane: Editor & Execution Drawer */}
        <div className="w-full md:w-1/2 h-full flex flex-col bg-slate-900">
          {/* Editor Controls */}
          <div className="h-10 bg-slate-950 border-b border-slate-800 px-4 flex items-center justify-between shrink-0">
            <div className="flex items-center space-x-2">
              <Code2 className="w-4 h-4 text-slate-400" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as ProgrammingLanguage)}
                className="py-1 px-2.5 bg-slate-900 border border-slate-800 rounded text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value={ProgrammingLanguage.PYTHON}>Python 3</option>
                <option value={ProgrammingLanguage.CPP}>C++ 14</option>
                <option value={ProgrammingLanguage.C}>C (GCC)</option>
                <option value={ProgrammingLanguage.JAVA}>Java 17</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleRunSampleCases}
                disabled={isRunning || isSubmitting}
                className="flex items-center space-x-1.5 px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 text-xs font-semibold transition"
              >
                <Play className="w-3 h-3 fill-slate-300" />
                <span>{isRunning ? 'Running...' : 'Run Samples'}</span>
              </button>

              <button
                onClick={handleSubmitContest}
                disabled={isRunning || isSubmitting}
                className="flex items-center space-x-1.5 px-3.5 py-1 rounded bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white text-xs font-semibold transition shadow-sm shadow-amber-600/30"
              >
                <Send className="w-3 h-3" />
                <span>{isSubmitting ? 'Submitting...' : 'Submit to Contest'}</span>
              </button>
            </div>
          </div>

          {/* Monaco Editor Container */}
          <div className="flex-1 overflow-hidden">
            <MonacoEditorWrapper
              language={language}
              code={code}
              onChange={handleCodeChange}
            />
          </div>

          {/* Results Console Drawer */}
          <div className="h-64 border-t border-slate-800 overflow-hidden shrink-0 flex flex-col bg-slate-950">
            <ConsoleOutput
              sampleCases={currentProblem?.sampleCases || []}
              customInput={customInput}
              setCustomInput={setCustomInput}
              useCustomInput={useCustomInput}
              setUseCustomInput={setUseCustomInput}
              runResults={runResults}
              submitResult={submitResult}
              activeConsoleTab={activeConsoleTab}
              setActiveConsoleTab={setActiveConsoleTab}
              isRunning={isRunning}
              isSubmitting={isSubmitting}
            />
          </div>
        </div>
      </div>

      {/* Scoreboard Drawer Modal */}
      {showScoreboard && (
        <div className="fixed inset-y-0 right-0 z-50 w-80 bg-slate-900 border-l border-slate-800 shadow-2xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-bold text-sm text-white flex items-center space-x-2">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Contest Performance</span>
            </h3>
            <button
              onClick={() => setShowScoreboard(false)}
              className="text-slate-400 hover:text-white text-xs font-bold"
            >
              ✕
            </button>
          </div>

          <div className="space-y-2">
            <span className="text-[11px] font-semibold uppercase text-slate-400">Current Attempt</span>
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300">Live Score:</span>
                <span className="font-bold text-amber-400">{contestData.attempt.score} pts</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-300">Solved:</span>
                <span className="font-bold text-emerald-400">
                  {contestData.problems.filter((p: any) => p.solved).length} / {contestData.problems.length}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <span className="text-[11px] font-semibold uppercase text-slate-400">Past Simulations</span>
            {contestData.pastScoreboard?.length === 0 ? (
              <p className="text-xs text-slate-500">No previous contests on record.</p>
            ) : (
              <div className="space-y-2">
                {contestData.pastScoreboard.map((past: any) => (
                  <div
                    key={past.id}
                    className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 flex items-center justify-between text-xs"
                  >
                    <div>
                      <p className="font-medium text-slate-300 truncate max-w-[140px]">
                        {past.contest.title}
                      </p>
                      <span className="text-[10px] text-slate-500">
                        {Math.floor(past.totalTimeSpentSec / 60)} mins
                      </span>
                    </div>
                    <span className="font-bold text-amber-400">{past.score} pts</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Finish Contest Confirmation Modal */}
      {showFinishModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="w-10 h-10 rounded-full bg-rose-950/80 border border-rose-700/50 flex items-center justify-center text-rose-400 mx-auto">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-white">Finish and Submit Contest?</h3>
              <p className="text-xs text-slate-400">
                Are you sure you want to finalize your contest attempt? You will not be able to submit more code after finishing.
              </p>
            </div>
            <div className="flex items-center space-x-3 pt-2">
              <button
                onClick={() => setShowFinishModal(false)}
                className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
              >
                Keep Solving
              </button>
              <button
                onClick={handleManualFinish}
                className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold transition"
              >
                Yes, Finish Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
