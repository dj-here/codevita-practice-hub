'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  BrainCircuit,
  Code2,
  Users,
  Award,
  Sparkles,
  ArrowRight,
  Clock,
  CheckCircle2,
  FileText,
  AlertCircle,
  Play,
  Layers,
} from 'lucide-react';

export default function InterviewLobbyPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);
  const [pastSessions, setPastSessions] = useState<any[]>([]);

  // Setup modal for Technical Round
  const [showTechModal, setShowTechModal] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<'python' | 'cpp' | 'java' | 'c'>('python');

  useEffect(() => {
    async function loadSessions() {
      try {
        const res = await fetch('/api/interview');
        if (res.ok) {
          const data = await res.json();
          setPastSessions(data.sessions || []);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadSessions();
  }, []);

  const handleStartTechnical = async () => {
    if (!session) {
      router.push('/login?callbackUrl=/interview');
      return;
    }
    setStarting(true);
    setShowTechModal(false);
    try {
      const res = await fetch('/api/interview/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'TECHNICAL',
          language: selectedLanguage,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        router.push(`/interview/${data.sessionId}`);
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to start technical interview');
        setStarting(false);
      }
    } catch (e) {
      alert('Network error while starting interview');
      setStarting(false);
    }
  };

  const handleStartHR = async () => {
    if (!session) {
      router.push('/login?callbackUrl=/interview');
      return;
    }
    setStarting(true);
    try {
      const res = await fetch('/api/interview/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'MANAGERIAL_HR',
        }),
      });

      if (res.ok) {
        const data = await res.json();
        router.push(`/interview/${data.sessionId}`);
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to start HR interview');
        setStarting(false);
      }
    } catch (e) {
      alert('Network error while starting interview');
      setStarting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 w-full">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-950/40 via-slate-900 to-slate-900 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center space-x-2.5">
              <BrainCircuit className="w-7 h-7 text-purple-400" />
              <span>TCS Mock Interview Simulator</span>
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-purple-900/50 text-purple-300 border border-purple-700/40 text-xs font-semibold">
              Round 1 & Round 2
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            Interactive Technical & Managerial interviews replicating TCS panel scrutiny, follow-up probes, and 4-dimensional scorecards.
          </p>
        </div>
      </div>

      {/* Two Interview Round Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Round 1: Technical Interview */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-purple-500/50 transition-all flex flex-col justify-between space-y-6 shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4 w-28 h-28 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition" />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-950/60 border border-purple-700/40 text-purple-300 text-xs font-semibold">
                <Code2 className="w-3.5 h-3.5 text-purple-400" />
                <span>Round 1 • Technical</span>
              </div>
              <span className="text-xs font-bold text-slate-400">25–35 Mins</span>
            </div>

            <div>
              <h3 className="text-lg font-bold text-white group-hover:text-purple-400 transition">
                Technical Interview & Live Coding
              </h3>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                1 live coding algorithmic challenge followed by 5–8 in-depth questions covering OOP pillars, ACID properties, DBMS indexing, OS deadlocks/paging, networking handshakes, and language memory models.
              </p>
            </div>

            <div className="space-y-1.5 pt-2">
              <div className="flex items-center space-x-2 text-xs text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Core CS: OOP, DBMS, OS, Networks</span>
              </div>
              <div className="flex items-center space-x-2 text-xs text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Language-specific internals (C, C++, Java, Python)</span>
              </div>
              <div className="flex items-center space-x-2 text-xs text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Dynamic follow-ups on shallow or textbook answers</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowTechModal(true)}
            disabled={starting}
            className="w-full py-3 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-semibold text-xs flex items-center justify-center space-x-2 transition shadow-lg shadow-purple-600/20"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Start Technical Interview</span>
          </button>
        </div>

        {/* Round 2: Managerial & HR Interview */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-blue-500/50 transition-all flex flex-col justify-between space-y-6 shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4 w-28 h-28 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition" />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-950/60 border border-blue-700/40 text-blue-300 text-xs font-semibold">
                <Users className="w-3.5 h-3.5 text-blue-400" />
                <span>Round 2 • Managerial & HR</span>
              </div>
              <span className="text-xs font-bold text-slate-400">15–20 Mins</span>
            </div>

            <div>
              <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition">
                Managerial & HR Cultural Evaluation
              </h3>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                8–10 structured situational questions evaluating personal self-introduction, work flexibility, willingness to work in night shifts, nationwide relocation readiness, Tata Code of Conduct, and conflict resolution.
              </p>
            </div>

            <div className="space-y-1.5 pt-2">
              <div className="flex items-center space-x-2 text-xs text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>STAR model behavioral verification</span>
              </div>
              <div className="flex items-center space-x-2 text-xs text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>TCS shift readiness & relocation compliance checks</span>
              </div>
              <div className="flex items-center space-x-2 text-xs text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Tata Code of Conduct (TCoC) and business integrity</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleStartHR}
            disabled={starting}
            className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold text-xs flex items-center justify-center space-x-2 transition shadow-lg shadow-blue-600/20"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>{starting ? 'Initiating Session...' : 'Start Managerial & HR Round'}</span>
          </button>
        </div>
      </div>

      {/* Past Interview Transcripts & Scorecards */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-2">
            <Award className="w-5 h-5 text-purple-400" />
            <h2 className="text-base font-bold text-white">Your Interview Transcripts & Scorecards</h2>
          </div>
          <span className="text-xs text-slate-400">{pastSessions.length} Sessions Conducted</span>
        </div>

        {loading ? (
          <div className="p-8 text-center text-slate-500 text-xs">Loading interview records...</div>
        ) : pastSessions.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <BrainCircuit className="w-10 h-10 text-slate-600 mx-auto" />
            <h3 className="text-sm font-semibold text-slate-300">No Mock Interviews Taken Yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Simulate actual TCS panel questioning before your campus drive. Launch Round 1 Technical or Round 2 HR above!
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[11px] uppercase bg-slate-950 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Round Type</th>
                  <th className="py-3 px-4">Language / Focus</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Overall Score</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Scorecard & Transcript</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {pastSessions.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3 px-4 font-semibold text-white">
                      {s.type === 'TECHNICAL' ? 'Round 1: Technical' : 'Round 2: Managerial & HR'}
                    </td>
                    <td className="py-3 px-4 text-slate-400">
                      {s.language || 'Behavioral'}
                    </td>
                    <td className="py-3 px-4 text-slate-400">
                      {new Date(s.startedAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 font-bold text-purple-400">
                      {s.scorecard ? `${s.scorecard.overallScore}/100` : '—'}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          s.status === 'COMPLETED'
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/50'
                            : 'bg-amber-950 text-amber-400 border border-amber-800/50'
                        }`}
                      >
                        {s.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {s.status === 'COMPLETED' ? (
                        <Link
                          href={`/interview/${s.id}/scorecard`}
                          className="px-3 py-1 rounded bg-purple-900/50 hover:bg-purple-800/70 text-purple-200 border border-purple-700/50 font-semibold text-[11px] transition"
                        >
                          View Scorecard →
                        </Link>
                      ) : (
                        <Link
                          href={`/interview/${s.id}`}
                          className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white font-semibold text-[11px] transition"
                        >
                          Resume Session →
                        </Link>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Language Selection Modal for Technical Round */}
      {showTechModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <Code2 className="w-4 h-4 text-purple-400" />
                <span>Technical Interview Setup</span>
              </h3>
              <button
                onClick={() => setShowTechModal(false)}
                className="text-slate-400 hover:text-white text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-semibold text-slate-300 block">
                Select Your Primary Programming Language:
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { id: 'python', label: 'Python 3' },
                  { id: 'cpp', label: 'C++ 14' },
                  { id: 'java', label: 'Java 17' },
                  { id: 'c', label: 'C (GCC)' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setSelectedLanguage(item.id as any)}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold transition ${
                      selectedLanguage === item.id
                        ? 'bg-purple-950 border-purple-500 text-purple-200 shadow-sm'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-slate-500">
                The interviewer will test your depth in memory management and syntax idioms for this language.
              </p>
            </div>

            <div className="flex items-center space-x-3 pt-2">
              <button
                onClick={() => setShowTechModal(false)}
                className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
              >
                Cancel
              </button>
              <button
                onClick={handleStartTechnical}
                disabled={starting}
                className="flex-1 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white text-xs font-semibold transition"
              >
                {starting ? 'Launching...' : 'Begin Interview'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
