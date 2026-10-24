'use client';

import React, { useState } from 'react';
import VerdictBadge from './VerdictBadge';
import { Verdict } from '@/types';
import {
  Terminal,
  CheckCircle2,
  XCircle,
  Clock,
  HardDrive,
  Copy,
  Check,
  AlertOctagon,
} from 'lucide-react';

interface SampleCase {
  id?: string;
  input: string;
  expectedOutput?: string;
  explanation?: string | null;
}

interface CaseRunResult {
  caseIndex: number;
  input: string;
  expectedOutput: string | null;
  stdout: string;
  stderr: string;
  compileOutput: string;
  executionTimeMs: number;
  verdict: Verdict;
}

interface SubmitResult {
  submissionId: string;
  verdict: Verdict;
  executionTimeMs: number;
  memoryKb: number;
  totalCases: number;
  passedCases: number;
  compileOutput?: string | null;
  sampleResults?: Array<{
    sampleIndex: number;
    verdict: Verdict;
    executionTimeMs: number;
    stdout: string;
    stderr: string;
  }>;
}

interface ConsoleOutputProps {
  sampleCases: SampleCase[];
  customInput: string;
  setCustomInput: (val: string) => void;
  useCustomInput: boolean;
  setUseCustomInput: (val: boolean) => void;
  runResults: CaseRunResult[] | null;
  submitResult: SubmitResult | null;
  activeConsoleTab: 'testcases' | 'output' | 'submit';
  setActiveConsoleTab: (tab: 'testcases' | 'output' | 'submit') => void;
  isRunning: boolean;
  isSubmitting: boolean;
}

export default function ConsoleOutput({
  sampleCases,
  customInput,
  setCustomInput,
  useCustomInput,
  setUseCustomInput,
  runResults,
  submitResult,
  activeConsoleTab,
  setActiveConsoleTab,
  isRunning,
  isSubmitting,
}: ConsoleOutputProps) {
  const [selectedCaseIdx, setSelectedCaseIdx] = useState(0);
  const [copied, setCopied] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 border border-slate-800 rounded-lg overflow-hidden">
      {/* Console Tab Header */}
      <div className="flex items-center justify-between px-3 py-2 bg-slate-900 border-b border-slate-800 text-xs">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveConsoleTab('testcases')}
            className={`px-3 py-1 rounded font-medium transition ${
              activeConsoleTab === 'testcases'
                ? 'bg-slate-800 text-blue-400 border border-slate-700'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Testcases
          </button>
          <button
            onClick={() => setActiveConsoleTab('output')}
            className={`flex items-center space-x-1 px-3 py-1 rounded font-medium transition ${
              activeConsoleTab === 'output'
                ? 'bg-slate-800 text-blue-400 border border-slate-700'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>Run Output</span>
            {runResults && (
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            )}
          </button>
          <button
            onClick={() => setActiveConsoleTab('submit')}
            className={`flex items-center space-x-1 px-3 py-1 rounded font-medium transition ${
              activeConsoleTab === 'submit'
                ? 'bg-slate-800 text-blue-400 border border-slate-700'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>Verdict</span>
            {submitResult && (
              <span
                className={`w-2 h-2 rounded-full ${
                  submitResult.verdict === Verdict.ACCEPTED
                    ? 'bg-emerald-500'
                    : 'bg-rose-500'
                }`}
              />
            )}
          </button>
        </div>

        {/* Live execution indicator */}
        {(isRunning || isSubmitting) && (
          <div className="flex items-center space-x-1.5 text-blue-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
            <span>{isSubmitting ? 'Evaluating Test Cases...' : 'Executing...'}</span>
          </div>
        )}
      </div>

      {/* Tab Body */}
      <div className="flex-1 p-3 overflow-y-auto font-mono text-xs text-slate-300">
        {/* TAB 1: TESTCASES */}
        {activeConsoleTab === 'testcases' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {sampleCases.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSelectedCaseIdx(idx);
                      setUseCustomInput(false);
                    }}
                    className={`px-2.5 py-1 rounded text-xs transition ${
                      !useCustomInput && selectedCaseIdx === idx
                        ? 'bg-blue-600/30 text-blue-300 border border-blue-500/40'
                        : 'bg-slate-900 hover:bg-slate-800 text-slate-400'
                    }`}
                  >
                    Case {idx + 1}
                  </button>
                ))}
                <button
                  onClick={() => setUseCustomInput(true)}
                  className={`px-2.5 py-1 rounded text-xs transition ${
                    useCustomInput
                      ? 'bg-blue-600/30 text-blue-300 border border-blue-500/40'
                      : 'bg-slate-900 hover:bg-slate-800 text-slate-400'
                  }`}
                >
                  Custom Input
                </button>
              </div>
            </div>

            {useCustomInput ? (
              <div className="space-y-1">
                <label className="block text-[11px] text-slate-400 font-sans">
                  Custom Standard Input (stdin):
                </label>
                <textarea
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  placeholder="Enter custom input lines here..."
                  className="w-full h-28 p-2.5 bg-slate-900 border border-slate-800 rounded font-mono text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            ) : (
              sampleCases[selectedCaseIdx] && (
                <div className="space-y-3 font-sans">
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                      <span>Input (stdin):</span>
                      <button
                        onClick={() => handleCopy(sampleCases[selectedCaseIdx].input)}
                        className="hover:text-slate-200 flex items-center space-x-1"
                      >
                        {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>Copy</span>
                      </button>
                    </div>
                    <pre className="p-2.5 rounded bg-slate-900 border border-slate-800 font-mono text-slate-200 overflow-x-auto whitespace-pre-wrap">
                      {sampleCases[selectedCaseIdx].input}
                    </pre>
                  </div>

                  {sampleCases[selectedCaseIdx].expectedOutput && (
                    <div>
                      <div className="text-[11px] text-slate-400 mb-1">
                        Expected Output (stdout):
                      </div>
                      <pre className="p-2.5 rounded bg-slate-900 border border-slate-800 font-mono text-emerald-300 overflow-x-auto whitespace-pre-wrap">
                        {sampleCases[selectedCaseIdx].expectedOutput}
                      </pre>
                    </div>
                  )}

                  {sampleCases[selectedCaseIdx].explanation && (
                    <div className="p-2.5 rounded bg-slate-900/60 border border-slate-800/80 text-[11px] text-slate-400 leading-relaxed">
                      <span className="font-semibold text-slate-300">Explanation: </span>
                      {sampleCases[selectedCaseIdx].explanation}
                    </div>
                  )}
                </div>
              )
            )}
          </div>
        )}

        {/* TAB 2: RUN OUTPUT */}
        {activeConsoleTab === 'output' && (
          <div className="space-y-4 font-sans">
            {!runResults ? (
              <div className="flex flex-col items-center justify-center py-8 text-slate-500 text-center space-y-2">
                <Terminal className="w-8 h-8 opacity-40" />
                <p>Run your code to view sample case results and stdout/stderr</p>
                <p className="text-[11px] text-slate-600">Shortcut: Ctrl + Enter</p>
              </div>
            ) : (
              <div className="space-y-4">
                {runResults.map((res, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-slate-200 text-xs">
                          Sample Case {res.caseIndex}
                        </span>
                        <VerdictBadge verdict={res.verdict} size="sm" />
                      </div>
                      <div className="flex items-center space-x-1 text-slate-400 text-[11px]">
                        <Clock className="w-3 h-3" />
                        <span>{res.executionTimeMs} ms</span>
                      </div>
                    </div>

                    {res.compileOutput && (
                      <div className="space-y-1">
                        <span className="text-[11px] font-semibold text-rose-400 flex items-center space-x-1">
                          <AlertOctagon className="w-3.5 h-3.5" />
                          <span>Compiler Message:</span>
                        </span>
                        <pre className="p-2 rounded bg-rose-950/30 border border-rose-800/40 text-rose-200 font-mono text-[11px] whitespace-pre-wrap overflow-x-auto">
                          {res.compileOutput}
                        </pre>
                      </div>
                    )}

                    {res.stderr && !res.compileOutput && (
                      <div className="space-y-1">
                        <span className="text-[11px] font-semibold text-red-400">
                          Standard Error (stderr):
                        </span>
                        <pre className="p-2 rounded bg-red-950/30 border border-red-800/40 text-red-200 font-mono text-[11px] whitespace-pre-wrap overflow-x-auto">
                          {res.stderr}
                        </pre>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-[11px] text-slate-400">Your Output:</span>
                        <pre className="mt-1 p-2 rounded bg-slate-950 border border-slate-800 font-mono text-slate-200 whitespace-pre-wrap overflow-x-auto min-h-[40px]">
                          {res.stdout || '<No Output>'}
                        </pre>
                      </div>

                      {res.expectedOutput && (
                        <div>
                          <span className="text-[11px] text-slate-400">Expected Output:</span>
                          <pre className="mt-1 p-2 rounded bg-slate-950 border border-slate-800 font-mono text-emerald-400 whitespace-pre-wrap overflow-x-auto min-h-[40px]">
                            {res.expectedOutput}
                          </pre>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: SUBMIT VERDICT */}
        {activeConsoleTab === 'submit' && (
          <div className="space-y-4 font-sans">
            {!submitResult ? (
              <div className="flex flex-col items-center justify-center py-8 text-slate-500 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 opacity-40" />
                <p>Submit your code to evaluate against all hidden test cases</p>
                <p className="text-[11px] text-slate-600">Shortcut: Ctrl + Shift + Enter</p>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="space-y-1">
                    <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">
                      Evaluation Verdict
                    </span>
                    <div>
                      <VerdictBadge verdict={submitResult.verdict} size="lg" />
                    </div>
                  </div>

                  <div className="text-right space-y-1">
                    <span className="text-xs text-slate-400">Passed Cases</span>
                    <div className="text-base font-bold text-white">
                      {submitResult.passedCases} / {submitResult.totalCases}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-amber-400" />
                    <div>
                      <div className="text-[10px] text-slate-500 uppercase">Max Execution Time</div>
                      <div className="font-bold text-slate-200">{submitResult.executionTimeMs} ms</div>
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center space-x-2">
                    <HardDrive className="w-4 h-4 text-cyan-400" />
                    <div>
                      <div className="text-[10px] text-slate-500 uppercase">Memory Limit</div>
                      <div className="font-bold text-slate-200">
                        {submitResult.memoryKb > 0 ? `${Math.round(submitResult.memoryKb / 1024)} MB` : 'Within Limit'}
                      </div>
                    </div>
                  </div>
                </div>

                {submitResult.compileOutput && (
                  <div className="space-y-1.5">
                    <span className="text-xs font-semibold text-rose-400 flex items-center space-x-1">
                      <AlertOctagon className="w-3.5 h-3.5" />
                      <span>Compilation Error Diagnostics:</span>
                    </span>
                    <pre className="p-3 rounded-lg bg-rose-950/30 border border-rose-800/40 text-rose-200 font-mono text-xs whitespace-pre-wrap overflow-x-auto">
                      {submitResult.compileOutput}
                    </pre>
                  </div>
                )}

                {/* Sample Cases Breakdown */}
                {submitResult.sampleResults && submitResult.sampleResults.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-slate-800">
                    <span className="text-xs font-semibold text-slate-300">
                      Sample Test Cases Breakdown:
                    </span>
                    <div className="space-y-1.5">
                      {submitResult.sampleResults.map((sr) => (
                        <div
                          key={sr.sampleIndex}
                          className="flex items-center justify-between p-2 rounded bg-slate-950 border border-slate-800/80 text-xs"
                        >
                          <span className="text-slate-300">Sample {sr.sampleIndex}</span>
                          <div className="flex items-center space-x-3">
                            <span className="text-[11px] text-slate-500">{sr.executionTimeMs} ms</span>
                            <VerdictBadge verdict={sr.verdict} size="sm" />
                          </div>
                        </div>
                      ))}
                    </div>
                    <p className="text-[11px] text-slate-500 italic pt-1">
                      Hidden test cases are verified securely on server sandbox and are never revealed.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
