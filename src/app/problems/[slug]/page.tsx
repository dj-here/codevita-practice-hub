'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import MonacoEditorWrapper from '@/components/editor/MonacoEditorWrapper';
import ConsoleOutput from '@/components/judge/ConsoleOutput';
import VerdictBadge from '@/components/judge/VerdictBadge';
import { ProgrammingLanguage, Verdict, Difficulty } from '@/types';
import { getStarterTemplate, LANGUAGE_CONFIGS } from '@/lib/starter-templates';
import {
  ArrowLeft,
  Play,
  Send,
  RotateCcw,
  Clock,
  HardDrive,
  Tag,
  CheckCircle2,
  AlertCircle,
  Save,
  Moon,
  Sun,
  Code,
} from 'lucide-react';

export default function ProblemArenaPage() {
  const params = useParams();
  const slug = params.slug as string;
  const router = useRouter();
  const { data: session } = useSession();

  const [problem, setProblem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Editor states
  const [language, setLanguage] = useState<ProgrammingLanguage>(ProgrammingLanguage.PYTHON);
  const [code, setCode] = useState<string>(getStarterTemplate(ProgrammingLanguage.PYTHON));
  const [editorTheme, setEditorTheme] = useState<'vs-dark' | 'light'>('vs-dark');
  const [draftStatus, setDraftStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved');

  // Console states
  const [customInput, setCustomInput] = useState('');
  const [useCustomInput, setUseCustomInput] = useState(false);
  const [activeConsoleTab, setActiveConsoleTab] = useState<'testcases' | 'output' | 'submit'>('testcases');
  const [runResults, setRunResults] = useState<any[] | null>(null);
  const [submitResult, setSubmitResult] = useState<any | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bannerNotice, setBannerNotice] = useState<string | null>(null);

  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  // 1. Fetch Problem Details
  useEffect(() => {
    async function loadProblem() {
      try {
        setLoading(true);
        const res = await fetch(`/api/problems/${slug}`);
        if (!res.ok) {
          throw new Error('Problem not found');
        }
        const data = await res.json();
        setProblem(data.problem);
      } catch (err: any) {
        setError(err.message || 'Failed to load problem');
      } finally {
        setLoading(false);
      }
    }
    loadProblem();
  }, [slug]);

  // 2. Fetch or initialize draft code for selected language
  const loadDraft = useCallback(
    async (lang: ProgrammingLanguage) => {
      if (!session?.user?.id) {
        setCode(getStarterTemplate(lang));
        return;
      }

      try {
        const res = await fetch(`/api/problems/${slug}/draft?language=${lang}`);
        if (res.ok) {
          const data = await res.json();
          if (data.draft) {
            setCode(data.draft);
            setDraftStatus('saved');
            return;
          }
        }
      } catch {}

      // Fallback to starter template
      setCode(getStarterTemplate(lang));
      setDraftStatus('saved');
    },
    [slug, session]
  );

  useEffect(() => {
    loadDraft(language);
  }, [language, loadDraft]);

  // 3. Debounced Auto-Save Draft
  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
    setDraftStatus('unsaved');

    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }

    if (session?.user?.id) {
      autoSaveTimerRef.current = setTimeout(async () => {
        setDraftStatus('saving');
        try {
          const res = await fetch(`/api/problems/${slug}/draft`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ language, code: newCode }),
          });
          if (res.ok) {
            setDraftStatus('saved');
          }
        } catch {
          setDraftStatus('unsaved');
        }
      }, 1500);
    }
  };

  // 4. Reset Code to Starter Template
  const handleResetCode = () => {
    if (confirm('Reset editor to default starter code for this language?')) {
      const template = getStarterTemplate(language);
      handleCodeChange(template);
    }
  };

  // 5. Run Code (Samples or Custom Input)
  const handleRunCode = async () => {
    if (isRunning || isSubmitting) return;

    setBannerNotice(null);
    setIsRunning(true);
    setActiveConsoleTab('output');

    try {
      const res = await fetch('/api/judge/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problemSlug: slug,
          language,
          code,
          customInput: useCustomInput ? customInput : undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setBannerNotice(data.error || 'Execution failed');
        return;
      }

      setRunResults(data.results);
    } catch (err: any) {
      setBannerNotice(err.message || 'Network error occurred while running code');
    } finally {
      setIsRunning(false);
    }
  };

  // 6. Submit Code (Hidden Test Cases)
  const handleSubmitCode = async () => {
    if (isRunning || isSubmitting) return;

    if (!session) {
      alert('Please log in to submit solutions and track progress');
      router.push(`/login?callbackUrl=/problems/${slug}`);
      return;
    }

    setBannerNotice(null);
    setIsSubmitting(true);
    setActiveConsoleTab('submit');

    try {
      const res = await fetch('/api/judge/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problemSlug: slug,
          language,
          code,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setBannerNotice(data.error || 'Submission failed');
        return;
      }

      setSubmitResult(data);

      if (data.verdict === Verdict.ACCEPTED) {
        setProblem((prev: any) => ({ ...prev, solved: true }));
      }
    } catch (err: any) {
      setBannerNotice(err.message || 'Submission error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[500px]">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs text-slate-400">Loading problem arena...</span>
        </div>
      </div>
    );
  }

  if (error || !problem) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="p-6 max-w-md bg-slate-900 border border-slate-800 rounded-xl text-center space-y-4">
          <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
          <h2 className="text-lg font-bold text-white">Problem Unavailable</h2>
          <p className="text-xs text-slate-400">{error || 'This problem does not exist or has been unpublished.'}</p>
          <Link
            href="/problems"
            className="inline-flex items-center space-x-1 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Problem List</span>
          </Link>
        </div>
      </div>
    );
  }

  const difficultyColors = {
    [Difficulty.EASY]: 'bg-emerald-950/60 text-emerald-400 border-emerald-600/40',
    [Difficulty.MEDIUM]: 'bg-amber-950/60 text-amber-400 border-amber-600/40',
    [Difficulty.HARD]: 'bg-rose-950/60 text-rose-400 border-rose-600/40',
  }[problem.difficulty as Difficulty] || 'bg-slate-800 text-slate-300';

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-4rem)] overflow-hidden">
      {/* Top Banner Notice (Rate limit or messages) */}
      {bannerNotice && (
        <div className="bg-amber-950/80 border-b border-amber-600/40 px-4 py-2 flex items-center justify-between text-xs text-amber-300">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{bannerNotice}</span>
          </div>
          <button
            onClick={() => setBannerNotice(null)}
            className="text-amber-400 hover:text-white"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Split-Pane Workspace */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        {/* LEFT COLUMN: Problem Statement & Constraints (5 cols on lg) */}
        <div className="lg:col-span-5 border-r border-slate-800 flex flex-col bg-slate-950 overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-slate-800 bg-slate-900/60 space-y-2">
            <div className="flex items-center justify-between">
              <Link
                href="/problems"
                className="inline-flex items-center space-x-1 text-xs text-slate-400 hover:text-white transition"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>All Problems</span>
              </Link>
              <div className="flex items-center space-x-2">
                {problem.solved && (
                  <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-600/40 text-[10px] font-semibold">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Accepted</span>
                  </span>
                )}
                <span
                  className={`px-2.5 py-0.5 rounded text-[11px] font-semibold uppercase tracking-wider border ${difficultyColors}`}
                >
                  {problem.difficulty}
                </span>
              </div>
            </div>

            <h1 className="text-xl font-bold text-white tracking-tight">
              {problem.title}
            </h1>

            {/* Tags and Limits */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-slate-400">
              <div className="flex items-center space-x-1 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700/60">
                <Clock className="w-3 h-3 text-amber-400" />
                <span>{problem.timeLimitMs} ms</span>
              </div>
              <div className="flex items-center space-x-1 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700/60">
                <HardDrive className="w-3 h-3 text-cyan-400" />
                <span>{Math.round(problem.memoryLimitKb / 1024)} MB</span>
              </div>
              {problem.tags?.map((t: string) => (
                <span
                  key={t}
                  className="bg-blue-950/40 text-blue-300 border border-blue-800/40 px-2 py-0.5 rounded text-[10px]"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Scrollable Problem Content */}
          <div className="flex-1 p-5 overflow-y-auto space-y-6 text-sm text-slate-300 leading-relaxed">
            {/* Story Statement */}
            <div className="space-y-2">
              <h3 className="text-xs uppercase font-bold tracking-wider text-slate-400">
                Problem Statement
              </h3>
              <div className="whitespace-pre-line text-slate-200">
                {problem.statement}
              </div>
            </div>

            {/* Input Format */}
            <div className="space-y-1.5 pt-2 border-t border-slate-800">
              <h3 className="text-xs uppercase font-bold tracking-wider text-slate-400">
                Input Format
              </h3>
              <div className="whitespace-pre-line text-slate-300 bg-slate-900/50 p-3 rounded-lg border border-slate-800/80 text-xs font-mono">
                {problem.inputFormat}
              </div>
            </div>

            {/* Output Format */}
            <div className="space-y-1.5 pt-2 border-t border-slate-800">
              <h3 className="text-xs uppercase font-bold tracking-wider text-slate-400">
                Output Format
              </h3>
              <div className="whitespace-pre-line text-slate-300 bg-slate-900/50 p-3 rounded-lg border border-slate-800/80 text-xs font-mono">
                {problem.outputFormat}
              </div>
            </div>

            {/* Constraints */}
            <div className="space-y-1.5 pt-2 border-t border-slate-800">
              <h3 className="text-xs uppercase font-bold tracking-wider text-slate-400">
                Constraints
              </h3>
              <div className="whitespace-pre-line text-slate-300 bg-slate-900/50 p-3 rounded-lg border border-slate-800/80 text-xs font-mono">
                {problem.constraints}
              </div>
            </div>

            {/* Sample Cases */}
            <div className="space-y-3 pt-2 border-t border-slate-800">
              <h3 className="text-xs uppercase font-bold tracking-wider text-slate-400">
                Sample Test Cases
              </h3>
              {problem.sampleCases?.map((sample: any, index: number) => (
                <div
                  key={index}
                  className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2"
                >
                  <div className="font-semibold text-xs text-blue-400">
                    Sample {index + 1}
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase">Input:</span>
                    <pre className="p-2 mt-0.5 rounded bg-slate-950 border border-slate-800 font-mono text-xs text-slate-200 whitespace-pre-wrap">
                      {sample.input}
                    </pre>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase">Output:</span>
                    <pre className="p-2 mt-0.5 rounded bg-slate-950 border border-slate-800 font-mono text-xs text-emerald-400 whitespace-pre-wrap">
                      {sample.expectedOutput}
                    </pre>
                  </div>
                  {sample.explanation && (
                    <div className="text-xs text-slate-400 bg-slate-950/60 p-2 rounded border border-slate-800/60">
                      <span className="font-medium text-slate-300">Explanation: </span>
                      {sample.explanation}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Monaco Editor & Console Output (7 cols on lg) */}
        <div className="lg:col-span-7 flex flex-col bg-slate-900 overflow-hidden">
          {/* Editor Action Bar */}
          <div className="px-4 py-2 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {/* Language Selector */}
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as ProgrammingLanguage)}
                className="bg-slate-950 border border-slate-700 rounded-md px-2.5 py-1 text-xs text-slate-200 font-medium focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                {Object.values(LANGUAGE_CONFIGS).map((cfg) => (
                  <option key={cfg.language} value={cfg.language}>
                    {cfg.name}
                  </option>
                ))}
              </select>

              {/* Draft Save Status Indicator */}
              <div className="flex items-center space-x-1 text-[11px] text-slate-500">
                <Save className="w-3 h-3" />
                <span>
                  {draftStatus === 'saving'
                    ? 'Saving draft...'
                    : draftStatus === 'saved'
                    ? 'Draft saved'
                    : 'Unsaved changes'}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {/* Theme Toggle */}
              <button
                onClick={() =>
                  setEditorTheme(editorTheme === 'vs-dark' ? 'light' : 'vs-dark')
                }
                className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition"
                title="Toggle Editor Theme"
              >
                {editorTheme === 'vs-dark' ? (
                  <Sun className="w-3.5 h-3.5" />
                ) : (
                  <Moon className="w-3.5 h-3.5" />
                )}
              </button>

              {/* Reset Code */}
              <button
                onClick={handleResetCode}
                className="flex items-center space-x-1 px-2 py-1 rounded text-xs text-slate-400 hover:text-white hover:bg-slate-800 transition"
                title="Reset to Starter Template"
              >
                <RotateCcw className="w-3 h-3" />
                <span className="hidden sm:inline">Reset</span>
              </button>
            </div>
          </div>

          {/* Monaco Editor Container (Upper half) */}
          <div className="flex-1 min-h-[300px] relative">
            <MonacoEditorWrapper
              language={language}
              code={code}
              theme={editorTheme}
              onChange={handleCodeChange}
              onRun={handleRunCode}
              onSubmit={handleSubmitCode}
            />
          </div>

          {/* Bottom Console Drawer (Lower half) */}
          <div className="h-64 sm:h-72 border-t border-slate-800 flex flex-col bg-slate-950">
            <ConsoleOutput
              sampleCases={problem.sampleCases || []}
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

            {/* Run / Submit Action Toolbar */}
            <div className="p-2.5 bg-slate-900 border-t border-slate-800 flex items-center justify-between">
              <div className="text-[11px] text-slate-500 hidden sm:block">
                <span>Run: </span>
                <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300">Ctrl</kbd> + <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300">Enter</kbd>
                <span className="ml-2">Submit: </span>
                <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300">Ctrl</kbd> + <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300">Shift</kbd> + <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300">Enter</kbd>
              </div>

              <div className="flex items-center space-x-2 ml-auto">
                <button
                  onClick={handleRunCode}
                  disabled={isRunning || isSubmitting}
                  className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition disabled:opacity-50"
                >
                  <Play className="w-3.5 h-3.5 fill-slate-300" />
                  <span>{isRunning ? 'Running...' : 'Run Code'}</span>
                </button>

                <button
                  onClick={handleSubmitCode}
                  disabled={isRunning || isSubmitting}
                  className="flex items-center space-x-1.5 px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition shadow-md shadow-emerald-600/20 disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Evaluating...' : 'Submit Solution'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
