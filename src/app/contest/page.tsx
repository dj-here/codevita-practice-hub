'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  Trophy,
  Clock,
  Sparkles,
  Zap,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Play,
  RotateCcw,
  Sliders,
  Flame,
  Award,
} from 'lucide-react';

export default function ContestLobbyPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);
  const [pastAttempts, setPastAttempts] = useState<any[]>([]);
  const [showCustomModal, setShowCustomModal] = useState(false);

  // Custom contest config state
  const [customDuration, setCustomDuration] = useState(90);
  const [customEasy, setCustomEasy] = useState(1);
  const [customMedium, setCustomMedium] = useState(1);
  const [customHard, setCustomHard] = useState(1);

  useEffect(() => {
    async function loadContests() {
      try {
        const res = await fetch('/api/contests');
        if (res.ok) {
          const data = await res.json();
          setPastAttempts(data.pastAttempts || []);
        }
      } catch (err) {
        console.error('Failed to load contest data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadContests();
  }, []);

  const handleStartPreset = async (presetType: 'STANDARD_90' | 'STANDARD_180') => {
    if (!session) {
      router.push('/login?callbackUrl=/contest');
      return;
    }
    setStarting(true);
    try {
      const res = await fetch('/api/contests/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ presetType }),
      });
      if (res.ok) {
        const data = await res.json();
        router.push(`/contest/${data.attemptId}`);
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to start contest');
        setStarting(false);
      }
    } catch (e) {
      console.error(e);
      alert('Network error while starting contest');
      setStarting(false);
    }
  };

  const handleStartCustom = async () => {
    if (!session) {
      router.push('/login?callbackUrl=/contest');
      return;
    }
    if (customEasy + customMedium + customHard === 0) {
      alert('Please select at least 1 problem');
      return;
    }
    setStarting(true);
    try {
      const res = await fetch('/api/contests/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          presetType: 'CUSTOM',
          durationMinutes: customDuration,
          difficultyMix: {
            EASY: customEasy,
            MEDIUM: customMedium,
            HARD: customHard,
          },
        }),
      });
      if (res.ok) {
        const data = await res.json();
        router.push(`/contest/${data.attemptId}`);
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to start custom contest');
        setStarting(false);
      }
    } catch (e) {
      console.error(e);
      alert('Network error while starting custom contest');
      setStarting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 w-full">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center space-x-2.5">
              <Trophy className="w-7 h-7 text-amber-400" />
              <span>MockVita Contest Arena</span>
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-900/50 text-amber-300 border border-amber-700/40 text-xs font-semibold">
              Server-Timed
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            Authentic TCS CodeVita timed simulations with automatic problem allocation, refresh-proof countdowns, and instant scorecards.
          </p>
        </div>

        <button
          onClick={() => setShowCustomModal(true)}
          className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition"
        >
          <Sliders className="w-3.5 h-3.5 text-blue-400" />
          <span>Custom Preset Builder</span>
        </button>
      </div>

      {/* Preset Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Preset 1: 90 Min Sprint */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 transition-all flex flex-col justify-between space-y-6 shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4 w-28 h-28 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition" />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-950/60 border border-amber-700/40 text-amber-300 text-xs font-semibold">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>90 Minutes</span>
              </div>
              <span className="text-xs font-bold text-slate-400">300 Points Max</span>
            </div>

            <div>
              <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition">
                MockVita 90-Min Sprint
              </h3>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                A rapid competition test comprising 3 algorithmic problems (1 Easy, 1 Medium, 1 Hard). Automatically selects un-solved problems from your practice bank.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-2">
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-center">
                <span className="text-[10px] text-slate-500 block uppercase">Problem A</span>
                <span className="text-xs font-semibold text-emerald-400">1 Easy</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-center">
                <span className="text-[10px] text-slate-500 block uppercase">Problem B</span>
                <span className="text-xs font-semibold text-amber-400">1 Medium</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-center">
                <span className="text-[10px] text-slate-500 block uppercase">Problem C</span>
                <span className="text-xs font-semibold text-rose-400">1 Hard</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => handleStartPreset('STANDARD_90')}
            disabled={starting}
            className="w-full py-3 px-4 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white font-semibold text-xs flex items-center justify-center space-x-2 transition shadow-lg shadow-amber-600/20"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>{starting ? 'Starting Contest...' : 'Start 90-Min Sprint'}</span>
          </button>
        </div>

        {/* Preset 2: 180 Min Pre-Qualifier */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-blue-500/50 transition-all flex flex-col justify-between space-y-6 shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4 w-28 h-28 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition" />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-950/60 border border-blue-700/40 text-blue-300 text-xs font-semibold">
                <Clock className="w-3.5 h-3.5 text-blue-400" />
                <span>180 Minutes (3 Hours)</span>
              </div>
              <span className="text-xs font-bold text-slate-400">600 Points Max</span>
            </div>

            <div>
              <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition">
                TCS CodeVita Pre-Qualifier Simulation
              </h3>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                The authentic full-length contest simulation with 6 multi-tier story challenges (2 Easy, 3 Medium, 1 Hard). Evaluates stamina, test-case coverage, and speed.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-2">
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-center">
                <span className="text-[10px] text-slate-500 block uppercase">Tier 1</span>
                <span className="text-xs font-semibold text-emerald-400">2 Easy</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-center">
                <span className="text-[10px] text-slate-500 block uppercase">Tier 2</span>
                <span className="text-xs font-semibold text-amber-400">3 Medium</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-center">
                <span className="text-[10px] text-slate-500 block uppercase">Tier 3</span>
                <span className="text-xs font-semibold text-rose-400">1 Hard</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => handleStartPreset('STANDARD_180')}
            disabled={starting}
            className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold text-xs flex items-center justify-center space-x-2 transition shadow-lg shadow-blue-600/20"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>{starting ? 'Starting Contest...' : 'Start 180-Min Simulation'}</span>
          </button>
        </div>
      </div>

      {/* Past Contest Attempts Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-2">
            <Award className="w-5 h-5 text-amber-400" />
            <h2 className="text-base font-bold text-white">Your Contest History & Post-Contest Reviews</h2>
          </div>
          <span className="text-xs text-slate-400">{pastAttempts.length} Attempts Recorded</span>
        </div>

        {loading ? (
          <div className="p-8 text-center text-slate-500 text-xs">Loading past attempts...</div>
        ) : pastAttempts.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Trophy className="w-10 h-10 text-slate-600 mx-auto" />
            <h3 className="text-sm font-semibold text-slate-300">No Mock Contests Completed Yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Test your skills under genuine timed contest pressure. Pick a preset above to launch your first MockVita simulation!
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[11px] uppercase bg-slate-950 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Contest Title</th>
                  <th className="py-3 px-4">Duration</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Score</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {pastAttempts.map((att) => (
                  <tr key={att.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3 px-4 font-semibold text-white">
                      {att.contestTitle}
                    </td>
                    <td className="py-3 px-4 text-slate-400">
                      {att.durationMinutes} mins
                    </td>
                    <td className="py-3 px-4 text-slate-400">
                      {new Date(att.startedAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 font-bold text-amber-400">
                      {att.score} pts
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          att.status === 'COMPLETED'
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/50'
                            : att.status === 'IN_PROGRESS'
                            ? 'bg-blue-950 text-blue-400 border border-blue-800/50'
                            : 'bg-rose-950 text-rose-400 border border-rose-800/50'
                        }`}
                      >
                        {att.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {att.status === 'IN_PROGRESS' ? (
                        <Link
                          href={`/contest/${att.id}`}
                          className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white font-semibold text-[11px] transition"
                        >
                          Resume Arena →
                        </Link>
                      ) : (
                        <Link
                          href={`/contest/${att.id}/review`}
                          className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-[11px] transition"
                        >
                          Editorial Review →
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

      {/* Custom Contest Builder Modal */}
      {showCustomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <Sliders className="w-4 h-4 text-blue-400" />
                <span>Custom Contest Builder</span>
              </h3>
              <button
                onClick={() => setShowCustomModal(false)}
                className="text-slate-400 hover:text-white text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  Duration (Minutes): <span className="text-blue-400 font-bold">{customDuration}m</span>
                </label>
                <input
                  type="range"
                  min="30"
                  max="240"
                  step="15"
                  value={customDuration}
                  onChange={(e) => setCustomDuration(parseInt(e.target.value))}
                  className="w-full accent-blue-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 block">
                  Problem Mix Allocation:
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] text-emerald-400 block mb-1">Easy</label>
                    <input
                      type="number"
                      min="0"
                      max="5"
                      value={customEasy}
                      onChange={(e) => setCustomEasy(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-amber-400 block mb-1">Medium</label>
                    <input
                      type="number"
                      min="0"
                      max="5"
                      value={customMedium}
                      onChange={(e) => setCustomMedium(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-rose-400 block mb-1">Hard</label>
                    <input
                      type="number"
                      min="0"
                      max="5"
                      value={customHard}
                      onChange={(e) => setCustomHard(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white"
                    />
                  </div>
                </div>
                <p className="text-[11px] text-slate-500">
                  Total Problems: {customEasy + customMedium + customHard} ({((customEasy + customMedium + customHard) * 100)} max points)
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 pt-2">
              <button
                onClick={() => setShowCustomModal(false)}
                className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
              >
                Cancel
              </button>
              <button
                onClick={handleStartCustom}
                disabled={starting || customEasy + customMedium + customHard === 0}
                className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-semibold transition"
              >
                {starting ? 'Launching...' : 'Start Custom Contest'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
