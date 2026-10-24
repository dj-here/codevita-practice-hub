'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import {
  Code2,
  Terminal,
  Trophy,
  BrainCircuit,
  Flame,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  BarChart3,
  BookOpen,
  Calendar,
  Sparkles,
  Target,
} from 'lucide-react';
import { VerdictBadge } from '@/components/judge/VerdictBadge';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      if (status !== 'authenticated') return;
      try {
        const res = await fetch('/api/user/dashboard');
        if (res.ok) {
          const data = await res.json();
          setDashboardData(data);
        }
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }

    if (status === 'authenticated') {
      loadDashboard();
    } else if (status === 'unauthenticated') {
      setLoading(false);
    }
  }, [status]);

  if (status === 'loading' || loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-12 space-y-3">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs text-slate-400">Loading student analytics...</span>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
        <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-blue-400 mx-auto">
          <Terminal className="w-6 h-6" />
        </div>
        <h1 className="text-xl font-bold text-white">Please sign in to access your dashboard</h1>
        <p className="text-xs text-slate-400 max-w-sm">
          Track problem-solving streaks, timed MockVita contests, and interview scorecards.
        </p>
        <Link
          href="/login"
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-lg text-white text-xs font-semibold transition shadow-lg shadow-blue-500/20"
        >
          Sign In to Your Account
        </Link>
      </div>
    );
  }

  const overview = dashboardData?.overview || {
    totalSolved: 0,
    totalAttempted: 0,
    totalProblems: 220,
    accuracy: 0,
    streak: 0,
  };

  const diffCounts = dashboardData?.difficultyCounts || {
    EASY: { solved: 0, total: 77, attempted: 0 },
    MEDIUM: { solved: 0, total: 99, attempted: 0 },
    HARD: { solved: 0, total: 44, attempted: 0 },
  };

  const topicMastery: any[] = dashboardData?.topicMastery || [];
  const weakTopics: any[] = dashboardData?.weakTopics || [];
  const recentSubmissions: any[] = dashboardData?.recentSubmissions || [];
  const contestAttempts: any[] = dashboardData?.contestAttempts || [];
  const interviewSessions: any[] = dashboardData?.interviewSessions || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 w-full">
      {/* Welcome Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-950/60 via-slate-900 to-slate-900 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold text-white">
              Welcome back, {session.user?.name || 'Candidate'}!
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-900/60 text-blue-300 border border-blue-700/40 uppercase font-semibold">
              {session.user?.role}
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Track your TCS CodeVita practice streak, mock contest rankings, and interview scorecards.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-amber-950/40 border border-amber-700/50 text-amber-300 text-xs font-semibold">
            <Flame className="w-4 h-4 text-amber-400 fill-amber-400/20" />
            <span>{overview.streak} Day Streak</span>
          </div>
          <Link
            href="/problems"
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition"
          >
            <span>Practice Arena</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Top 4 Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Problems Solved</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-white">{overview.totalSolved}</span>
            <span className="text-xs text-slate-500">/ {overview.totalProblems} total</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all"
              style={{
                width: `${overview.totalProblems > 0 ? (overview.totalSolved / overview.totalProblems) * 100 : 0}%`,
              }}
            />
          </div>
        </div>

        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Submission Accuracy</span>
            <Target className="w-4 h-4 text-blue-400" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-white">{overview.accuracy}%</span>
            <span className="text-xs text-slate-500">({overview.totalAttempted} attempted)</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-blue-500 h-full rounded-full transition-all"
              style={{ width: `${Math.min(100, overview.accuracy)}%` }}
            />
          </div>
        </div>

        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">MockVita Contests</span>
            <Trophy className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-white">{contestAttempts.length}</span>
            <span className="text-xs text-slate-500">completed</span>
          </div>
          <p className="text-[11px] text-slate-500">
            Server-authoritative timed rounds
          </p>
        </div>

        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Mock Interviews</span>
            <BrainCircuit className="w-4 h-4 text-purple-400" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-white">{interviewSessions.length}</span>
            <span className="text-xs text-slate-500">sessions</span>
          </div>
          <p className="text-[11px] text-slate-500">
            Tech & HR rounds with rubrics
          </p>
        </div>
      </div>

      {/* Main Grid: Difficulty & Topic Mastery & Weak Topics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Difficulty Breakdown (4 cols) */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-semibold text-white flex items-center space-x-2">
              <BarChart3 className="w-4 h-4 text-blue-400" />
              <span>Difficulty Distribution</span>
            </h3>
            <span className="text-xs text-slate-500">CodeVita Mix</span>
          </div>

          <div className="space-y-4">
            {/* Easy */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-emerald-400 font-medium">Easy</span>
                <span className="text-slate-400">
                  {diffCounts.EASY.solved} / {diffCounts.EASY.total}
                </span>
              </div>
              <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all"
                  style={{
                    width: `${diffCounts.EASY.total > 0 ? (diffCounts.EASY.solved / diffCounts.EASY.total) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>

            {/* Medium */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-amber-400 font-medium">Medium</span>
                <span className="text-slate-400">
                  {diffCounts.MEDIUM.solved} / {diffCounts.MEDIUM.total}
                </span>
              </div>
              <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="bg-amber-500 h-full rounded-full transition-all"
                  style={{
                    width: `${diffCounts.MEDIUM.total > 0 ? (diffCounts.MEDIUM.solved / diffCounts.MEDIUM.total) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>

            {/* Hard */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-rose-400 font-medium">Hard</span>
                <span className="text-slate-400">
                  {diffCounts.HARD.solved} / {diffCounts.HARD.total}
                </span>
              </div>
              <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="bg-rose-500 h-full rounded-full transition-all"
                  style={{
                    width: `${diffCounts.HARD.total > 0 ? (diffCounts.HARD.solved / diffCounts.HARD.total) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Weak Topics Box */}
          <div className="pt-4 border-t border-slate-800 space-y-3">
            <h4 className="text-xs font-semibold text-slate-300 flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Recommended Practice Areas</span>
            </h4>
            {weakTopics.length === 0 ? (
              <p className="text-xs text-slate-500">
                Start solving problems to unlock personalized topic recommendations.
              </p>
            ) : (
              <div className="space-y-2">
                {weakTopics.map((wt) => (
                  <div
                    key={wt.topic}
                    className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 flex items-center justify-between"
                  >
                    <div>
                      <p className="text-xs font-medium text-slate-200">{wt.topic}</p>
                      <p className="text-[10px] text-slate-500">
                        {wt.solved} solved of {wt.total}
                      </p>
                    </div>
                    <Link
                      href={`/problems?topic=${encodeURIComponent(wt.topic)}`}
                      className="px-2 py-1 rounded bg-blue-900/40 hover:bg-blue-800/60 text-blue-300 border border-blue-700/40 text-[10px] font-semibold transition"
                    >
                      Practice
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Topic Mastery Progress Bars (8 cols) */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-semibold text-white flex items-center space-x-2">
              <BookOpen className="w-4 h-4 text-emerald-400" />
              <span>Topic Mastery Matrix</span>
            </h3>
            <span className="text-xs text-slate-500">10 Major Algorithmic Topics</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {topicMastery.map((tm) => (
              <div
                key={tm.topic}
                className="p-3 rounded-lg bg-slate-950/50 border border-slate-800 space-y-1.5"
              >
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-300 font-medium truncate pr-2">
                    {tm.topic}
                  </span>
                  <span className="text-slate-400 text-[11px] shrink-0">
                    {tm.solved}/{tm.total} ({tm.percentage}%)
                  </span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-blue-500 h-full rounded-full transition-all"
                    style={{ width: `${tm.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Grid: Contest History & Recent Submissions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Contest History (6 cols) */}
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-semibold text-white flex items-center space-x-2">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Mock Contest History</span>
            </h3>
            <Link
              href="/contest"
              className="text-xs text-blue-400 hover:text-blue-300 transition"
            >
              Take Mock Contest →
            </Link>
          </div>

          {contestAttempts.length === 0 ? (
            <div className="p-8 text-center text-slate-500 space-y-2">
              <Trophy className="w-8 h-8 mx-auto text-slate-600" />
              <p className="text-xs">No mock contest attempts yet.</p>
              <Link
                href="/contest"
                className="inline-block px-3 py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold"
              >
                Start 90-Min Sprint
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-slate-800">
              {contestAttempts.map((ca) => (
                <div key={ca.id} className="py-2.5 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-slate-200">{ca.contestTitle}</p>
                    <p className="text-[10px] text-slate-500">
                      {new Date(ca.startedAt).toLocaleDateString()} • {ca.durationMinutes} mins
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-amber-400">{ca.score} pts</span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                        ca.status === 'COMPLETED'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/60'
                          : 'bg-amber-950 text-amber-400 border border-amber-800/60'
                      }`}
                    >
                      {ca.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Submissions (6 cols) */}
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-semibold text-white flex items-center space-x-2">
              <Terminal className="w-4 h-4 text-blue-400" />
              <span>Recent Submissions</span>
            </h3>
            <Link
              href="/problems"
              className="text-xs text-blue-400 hover:text-blue-300 transition"
            >
              Solve More →
            </Link>
          </div>

          {recentSubmissions.length === 0 ? (
            <div className="p-8 text-center text-slate-500 space-y-2">
              <Terminal className="w-8 h-8 mx-auto text-slate-600" />
              <p className="text-xs">No code submissions recorded yet.</p>
              <Link
                href="/problems"
                className="inline-block px-3 py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold"
              >
                Solve Your First Problem
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-slate-800">
              {recentSubmissions.map((s) => (
                <div key={s.id} className="py-2.5 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Link
                      href={`/problems/${s.problemSlug}`}
                      className="text-xs font-medium text-slate-200 hover:text-blue-400 transition"
                    >
                      {s.problemTitle}
                    </Link>
                    <p className="text-[10px] text-slate-500">
                      {s.language.toUpperCase()} • {new Date(s.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <VerdictBadge verdict={s.verdict} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
