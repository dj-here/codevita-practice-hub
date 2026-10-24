'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  Award,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  Clock,
  ChevronLeft,
  ArrowRight,
  BrainCircuit,
  MessageSquare,
  Sparkles,
  Target,
  ShieldCheck,
  BookOpen,
} from 'lucide-react';

export default function InterviewScorecardPage({
  params,
}: {
  params: { sessionId: string };
}) {
  const router = useRouter();
  const { data: session } = useSession();
  const { sessionId } = params;

  const [sessionData, setSessionData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showTranscript, setShowTranscript] = useState(false);

  useEffect(() => {
    async function loadScorecard() {
      try {
        const res = await fetch(`/api/interview/${sessionId}`);
        if (res.ok) {
          const data = await res.json();
          setSessionData(data);
        } else {
          router.push('/interview');
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadScorecard();
  }, [sessionId]);

  if (loading || !sessionData) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-12 space-y-3">
        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs text-slate-400">Loading interview scorecard...</span>
      </div>
    );
  }

  const { scorecard, messages } = sessionData;

  if (!scorecard) {
    return (
      <div className="max-w-xl mx-auto p-12 text-center space-y-4">
        <AlertTriangle className="w-12 h-12 text-amber-400 mx-auto" />
        <h2 className="text-lg font-bold text-white">Scorecard In Progress</h2>
        <p className="text-xs text-slate-400">
          This interview session has not generated a final scorecard yet. Please complete all questions or click "Conclude & Score" in the arena.
        </p>
        <Link
          href={`/interview/${sessionId}`}
          className="inline-block px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold"
        >
          Return to Arena
        </Link>
      </div>
    );
  }

  const getVerdictGrade = (score: number) => {
    if (score >= 85) return { grade: 'Ready for TCS Prime / Digital', color: 'text-emerald-400', bg: 'bg-emerald-950/60 border-emerald-500/40' };
    if (score >= 70) return { grade: 'Ready for TCS Ninja Role', color: 'text-blue-400', bg: 'bg-blue-950/60 border-blue-500/40' };
    return { grade: 'Foundational Practice Required', color: 'text-amber-400', bg: 'bg-amber-950/60 border-amber-500/40' };
  };

  const gradeInfo = getVerdictGrade(scorecard.overallScore);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 w-full">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/interview"
          className="flex items-center space-x-1.5 text-xs font-semibold text-slate-400 hover:text-white transition"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Interview Lobby</span>
        </Link>
        <Link
          href="/dashboard"
          className="flex items-center space-x-1.5 text-xs font-semibold text-purple-400 hover:text-purple-300 transition"
        >
          <span>View Progress Dashboard</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Hero Scorecard Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-950/50 via-slate-900 to-slate-900 border border-slate-800 space-y-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-800 pb-6">
          <div className="space-y-2">
            <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">
              TCS Official Rubric Assessment
            </span>
            <h1 className="text-2xl font-bold text-white flex items-center space-x-2.5">
              <Award className="w-7 h-7 text-purple-400" />
              <span>
                {sessionData.session.type === 'TECHNICAL'
                  ? 'Technical Interview Scorecard'
                  : 'Managerial & HR Scorecard'}
              </span>
            </h1>
            <p className="text-xs text-slate-400">
              Conducted on {new Date(sessionData.session.startedAt).toLocaleDateString()} •{' '}
              <span className="text-slate-300 font-medium">Private Candidate Evaluation</span>
            </p>
            <div className={`inline-flex items-center px-3 py-1 rounded-full border text-xs font-semibold ${gradeInfo.bg} ${gradeInfo.color}`}>
              {gradeInfo.grade}
            </div>
          </div>

          <div className="flex flex-col items-center justify-center p-5 rounded-2xl bg-slate-950 border border-slate-800 min-w-[140px] text-center shadow-inner">
            <span className="text-[11px] text-slate-400 uppercase font-semibold">Overall Rating</span>
            <div className="text-4xl font-extrabold text-white mt-1">
              <span className="text-purple-400">{Math.round(scorecard.overallScore)}</span>
              <span className="text-xs text-slate-500 font-normal"> / 100</span>
            </div>
          </div>
        </div>

        {/* 4 Assessment Dimensions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400 font-medium">Communication</span>
              <span className="font-bold text-white">{Math.round(scorecard.communicationScore)}%</span>
            </div>
            <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
              <div
                className="bg-purple-500 h-full rounded-full"
                style={{ width: `${scorecard.communicationScore}%` }}
              />
            </div>
            <span className="text-[10px] text-slate-500 block">Articulation & Structure</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400 font-medium">Technical Correctness</span>
              <span className="font-bold text-white">{Math.round(scorecard.correctnessScore)}%</span>
            </div>
            <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full"
                style={{ width: `${scorecard.correctnessScore}%` }}
              />
            </div>
            <span className="text-[10px] text-slate-500 block">Core CS Concepts</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400 font-medium">Problem Solving</span>
              <span className="font-bold text-white">{Math.round(scorecard.problemSolvingScore)}%</span>
            </div>
            <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
              <div
                className="bg-blue-500 h-full rounded-full"
                style={{ width: `${scorecard.problemSolvingScore}%` }}
              />
            </div>
            <span className="text-[10px] text-slate-500 block">Edge Cases & Tradeoffs</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400 font-medium">Confidence & Poise</span>
              <span className="font-bold text-white">{Math.round(scorecard.confidenceScore)}%</span>
            </div>
            <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
              <div
                className="bg-amber-500 h-full rounded-full"
                style={{ width: `${scorecard.confidenceScore}%` }}
              />
            </div>
            <span className="text-[10px] text-slate-500 block">Composure under Follow-ups</span>
          </div>
        </div>
      </div>

      {/* Strengths & Targeted Knowledge Gaps */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strengths */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-sm text-white">Demonstrated Strengths</h3>
          </div>
          <ul className="space-y-2.5">
            {scorecard.strengths?.map((str: string, idx: number) => (
              <li key={idx} className="flex items-start space-x-2 text-xs text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 mt-1.5" />
                <span className="leading-relaxed">{str}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Knowledge Gaps */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
            <Target className="w-5 h-5 text-rose-400" />
            <h3 className="font-bold text-sm text-white">Targeted Areas for Improvement</h3>
          </div>
          <ul className="space-y-2.5">
            {scorecard.gaps?.map((gap: string, idx: number) => (
              <li key={idx} className="flex items-start space-x-2 text-xs text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0 mt-1.5" />
                <span className="leading-relaxed">{gap}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 7-Day Actionable Preparation Plan */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-purple-400" />
            <h3 className="font-bold text-sm text-white">Personalized 7-Day TCS Preparation Plan</h3>
          </div>
          <span className="text-xs text-slate-400">Step-by-step roadmap</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-3">
          {scorecard.sevenDayPlan?.map((plan: any) => (
            <div
              key={plan.day}
              className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2 flex flex-col justify-between"
            >
              <div>
                <span className="px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800/40 text-[10px] font-bold">
                  Day {plan.day}
                </span>
                <h4 className="text-xs font-semibold text-slate-200 mt-2 line-clamp-2">
                  {plan.focus}
                </h4>
                <ul className="space-y-1.5 mt-2">
                  {plan.tasks?.map((t: string, tIdx: number) => (
                    <li key={tIdx} className="text-[11px] text-slate-400 leading-tight">
                      • {t}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Transcript Summary & Confidential Transcript Drawer */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <MessageSquare className="w-4 h-4 text-slate-400" />
            <h3 className="font-bold text-sm text-white">Session Transcript Record</h3>
          </div>
          <button
            onClick={() => setShowTranscript(!showTranscript)}
            className="text-xs text-purple-400 hover:text-purple-300 font-semibold transition"
          >
            {showTranscript ? 'Hide Complete Transcript' : 'View Full Transcript →'}
          </button>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          {scorecard.transcriptSummary}
        </p>

        {showTranscript && (
          <div className="mt-4 pt-4 border-t border-slate-800 space-y-3 max-h-96 overflow-y-auto">
            {messages.map((m: any, idx: number) => (
              <div
                key={m.id || idx}
                className={`p-3 rounded-xl text-xs space-y-1 ${
                  m.role === 'ASSISTANT'
                    ? 'bg-slate-950 border border-slate-800'
                    : 'bg-purple-950/40 border border-purple-800/30'
                }`}
              >
                <div className="flex justify-between items-center text-[10px] text-slate-400">
                  <span className="font-bold text-slate-300">
                    {m.role === 'ASSISTANT' ? 'TCS Interview Panel' : 'Candidate'}
                  </span>
                  <span>{new Date(m.createdAt).toLocaleTimeString()}</span>
                </div>
                <p className="text-slate-200 whitespace-pre-line">{m.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
