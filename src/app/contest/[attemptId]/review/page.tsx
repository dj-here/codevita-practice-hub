'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  Trophy,
  Clock,
  CheckCircle2,
  XCircle,
  FileText,
  BookOpen,
  ArrowRight,
  Code2,
  Check,
  Copy,
  ChevronLeft,
  Sparkles,
} from 'lucide-react';
import { VerdictBadge } from '@/components/judge/VerdictBadge';

export default function ContestReviewPage({
  params,
}: {
  params: { attemptId: string };
}) {
  const router = useRouter();
  const { data: session } = useSession();
  const { attemptId } = params;

  const [contestData, setContestData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [copiedCode, setCopiedCode] = useState(false);

  useEffect(() => {
    async function loadReviewData() {
      try {
        const res = await fetch(`/api/contests/${attemptId}`);
        if (res.ok) {
          const data = await res.json();
          setContestData(data);
        } else {
          router.push('/contest');
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadReviewData();
  }, [attemptId]);

  if (loading || !contestData) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-12 space-y-3">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs text-slate-400">Loading contest review & editorials...</span>
      </div>
    );
  }

  const { attempt, problems, submissions } = contestData;
  const currentProblem = problems[activeTab];

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const remaining = sec % 60;
    return `${mins}m ${remaining}s`;
  };

  const handleCopySolution = (codeText: string) => {
    navigator.clipboard.writeText(codeText);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const solvedCount = problems.filter((p: any) => p.solved).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 w-full">
      {/* Return to Lobby Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/contest"
          className="flex items-center space-x-1.5 text-xs font-semibold text-slate-400 hover:text-white transition"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Contest Lobby</span>
        </Link>
        <Link
          href="/dashboard"
          className="flex items-center space-x-1.5 text-xs font-semibold text-blue-400 hover:text-blue-300 transition"
        >
          <span>View Progress Dashboard</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Contest Score Summary Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-blue-950/40 border border-slate-800 space-y-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="space-y-1">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              Contest Complete
            </span>
            <h1 className="text-2xl font-bold text-white flex items-center space-x-2">
              <Trophy className="w-6 h-6 text-amber-400" />
              <span>{attempt.contestTitle}</span>
            </h1>
            <p className="text-xs text-slate-400">
              Completed on {new Date(attempt.startedAt).toLocaleDateString()} • Status:{' '}
              <span className="font-semibold text-slate-200">{attempt.status}</span>
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <div className="px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 uppercase block">Final Score</span>
              <span className="text-xl font-bold text-amber-400">{attempt.score} pts</span>
            </div>
            <div className="px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 uppercase block">Problems Solved</span>
              <span className="text-xl font-bold text-emerald-400">
                {solvedCount} / {problems.length}
              </span>
            </div>
            <div className="px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 uppercase block">Time Spent</span>
              <span className="text-xl font-bold text-blue-400">
                {formatSeconds(attempt.totalTimeSpentSec || 0)}
              </span>
            </div>
          </div>
        </div>

        {/* Problem Results Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {problems.map((prob: any, idx: number) => (
            <button
              key={prob.problemId}
              onClick={() => setActiveTab(idx)}
              className={`p-3 rounded-xl border text-left transition ${
                activeTab === idx
                  ? 'bg-slate-800 border-blue-500/80 shadow-md'
                  : 'bg-slate-950 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300">
                  Problem {String.fromCharCode(65 + idx)}
                </span>
                {prob.solved ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <XCircle className="w-4 h-4 text-rose-400" />
                )}
              </div>
              <p className="text-xs text-white font-medium truncate mt-1">{prob.title}</p>
              <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2">
                <span>{prob.difficulty}</span>
                <span className="font-semibold text-amber-400">
                  {prob.solved ? `+${prob.points} pts` : '0 pts'}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Problem Editorial & Review Detail */}
      {currentProblem && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Problem Summary & Submissions (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="font-bold text-sm text-white">Problem Overview</h3>
                <Link
                  href={`/problems/${currentProblem.slug}`}
                  className="text-xs text-blue-400 hover:text-blue-300 transition"
                >
                  Open in Practice Arena →
                </Link>
              </div>

              <div className="space-y-2">
                <h2 className="text-base font-bold text-white">{currentProblem.title}</h2>
                <div className="flex items-center space-x-2 text-xs">
                  <span
                    className={`px-2 py-0.5 rounded font-semibold uppercase ${
                      currentProblem.difficulty === 'EASY'
                        ? 'bg-emerald-950 text-emerald-300'
                        : currentProblem.difficulty === 'MEDIUM'
                        ? 'bg-amber-950 text-amber-300'
                        : 'bg-rose-950 text-rose-300'
                    }`}
                  >
                    {currentProblem.difficulty}
                  </span>
                  <span className="text-slate-400">•</span>
                  <span className="text-slate-400">{currentProblem.timeLimitMs}ms Limit</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800">
                <h4 className="text-xs font-semibold uppercase text-slate-400 mb-1">Statement</h4>
                <p className="text-xs text-slate-300 line-clamp-4 leading-relaxed">
                  {currentProblem.statement}
                </p>
              </div>
            </div>

            {/* Contest Submissions for this problem */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
              <h3 className="font-bold text-sm text-white">Your Contest Submissions</h3>
              {submissions.filter((s: any) => s.problemId === currentProblem.problemId).length === 0 ? (
                <p className="text-xs text-slate-500 py-3">No code submitted for this problem during the contest.</p>
              ) : (
                <div className="divide-y divide-slate-800">
                  {submissions
                    .filter((s: any) => s.problemId === currentProblem.problemId)
                    .map((sub: any) => (
                      <div key={sub.id} className="py-2.5 flex items-center justify-between">
                        <div className="space-y-0.5">
                          <span className="text-xs font-medium text-slate-200">
                            {sub.language}
                          </span>
                          <p className="text-[10px] text-slate-500">
                            {sub.passedCases}/{sub.totalCases} cases • {sub.executionTimeMs || 0}ms
                          </p>
                        </div>
                        <VerdictBadge verdict={sub.verdict} size="sm" />
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Editorial, Complexity & Reference Solution (7 cols) */}
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <BookOpen className="w-4 h-4 text-emerald-400" />
                <h3 className="font-bold text-sm text-white">Official CodeVita Editorial</h3>
              </div>
              <span className="text-xs text-slate-400">Full Approach & Solution</span>
            </div>

            {currentProblem.editorial ? (
              <div className="prose prose-invert max-w-none text-xs space-y-4">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 leading-relaxed whitespace-pre-line font-sans">
                  {currentProblem.editorial}
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400">Editorial will appear once the contest period closes.</p>
            )}

            <div className="pt-2 flex items-center justify-between border-t border-slate-800">
              <span className="text-xs text-slate-400">
                Want to retry this problem with full test feedback?
              </span>
              <Link
                href={`/problems/${currentProblem.slug}`}
                className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition"
              >
                Re-attempt Problem →
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
