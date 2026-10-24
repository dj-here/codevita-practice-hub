import React from 'react';
import Link from 'next/link';
import {
  Code2,
  Terminal,
  Trophy,
  BrainCircuit,
  ArrowRight,
  CheckCircle2,
  Cpu,
  Layers,
  Sparkles,
  Timer,
  Zap,
} from 'lucide-react';

export default function HomePage() {
  const topics = [
    { name: 'Number Theory & Primes', count: '20+ problems', color: 'from-blue-500/20 to-blue-600/10' },
    { name: 'Dynamic Programming', count: '25+ problems', color: 'from-purple-500/20 to-purple-600/10' },
    { name: 'Graphs & Shortest Path', count: '25+ problems', color: 'from-cyan-500/20 to-cyan-600/10' },
    { name: 'Matrices & 2D Grids', count: '25+ problems', color: 'from-emerald-500/20 to-emerald-600/10' },
    { name: 'Strings & Parsing', count: '25+ problems', color: 'from-amber-500/20 to-amber-600/10' },
    { name: 'Recursion & Backtracking', count: '20+ problems', color: 'from-rose-500/20 to-rose-600/10' },
    { name: 'Greedy Strategies', count: '20+ problems', color: 'from-indigo-500/20 to-indigo-600/10' },
    { name: 'Simulation & Bitwise', count: '20+ problems', color: 'from-teal-500/20 to-teal-600/10' },
    { name: 'Arrays & Two Pointers', count: '25+ problems', color: 'from-orange-500/20 to-orange-600/10' },
    { name: 'Binary Search & Sorting', count: '20+ problems', color: 'from-sky-500/20 to-sky-600/10' },
  ];

  return (
    <div className="flex flex-col space-y-16 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24 border-b border-slate-800/80">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/30 via-slate-950 to-slate-950" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Target TCS CodeVita & Ninja/Digital/Prime Interview Roles</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight sm:leading-tight">
            Master Algorithmic Contests & <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-400">Technical Interviews</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            The all-in-one preparation arena designed for college engineering students:
            220+ original CodeVita-style algorithmic problems, multi-language sandbox execution,
            server-timed MockVita simulations, and AI technical & HR mock interviews.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <Link
              href="/problems"
              className="flex items-center space-x-2 px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition shadow-lg shadow-blue-500/25"
            >
              <span>Explore Problem Bank</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/contest"
              className="flex items-center space-x-2 px-6 py-3 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold text-sm transition"
            >
              <Timer className="w-4 h-4 text-amber-400" />
              <span>Take Timed Mock Contest</span>
            </Link>
            <Link
              href="/interview"
              className="flex items-center space-x-2 px-6 py-3 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-semibold text-sm transition"
            >
              <BrainCircuit className="w-4 h-4 text-purple-400" />
              <span>Launch Mock Interview</span>
            </Link>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-10">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
              <div className="text-2xl font-bold text-white">220+</div>
              <div className="text-xs text-slate-400 mt-0.5">Original Problems</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
              <div className="text-2xl font-bold text-blue-400">4 Languages</div>
              <div className="text-xs text-slate-400 mt-0.5">C, C++, Java, Python</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
              <div className="text-2xl font-bold text-emerald-400">Server-Authoritative</div>
              <div className="text-xs text-slate-400 mt-0.5">MockVita Timers</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
              <div className="text-2xl font-bold text-purple-400">Claude 3.5 + Rubric</div>
              <div className="text-xs text-slate-400 mt-0.5">Dual-Mode Interviewer</div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Pillar Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Everything You Need to Rank High
          </h2>
          <p className="text-sm text-slate-400 max-w-xl mx-auto">
            Modeled directly after the real TCS CodeVita evaluation environment and hiring stages.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          {/* Pillar 1 */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 hover:border-slate-700 transition">
            <div className="w-12 h-12 rounded-xl bg-blue-950 border border-blue-700/50 flex items-center justify-center text-blue-400">
              <Terminal className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Story-Style Algorithmic Problems</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every challenge is crafted in authentic CodeVita format: realistic narrative premises,
              rigorous input/output specifications, time/memory constraints, and multi-tier hidden test cases.
            </p>
            <ul className="text-xs text-slate-300 space-y-1.5 pt-2">
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>8 to 15 hidden test cases per problem</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Sample run with explanations</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Detailed editorial & reference solutions</span>
              </li>
            </ul>
          </div>

          {/* Pillar 2 */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 hover:border-slate-700 transition">
            <div className="w-12 h-12 rounded-xl bg-amber-950 border border-amber-700/50 flex items-center justify-center text-amber-400">
              <Trophy className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Timed MockVita Contests</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Simulate actual contest rounds with server-authoritative countdown timers.
              Timer state is tamper-proof, survives browser refreshes, and auto-submits on expiration.
            </p>
            <ul className="text-xs text-slate-300 space-y-1.5 pt-2">
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>90-minute & 180-minute contest presets</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Difficulty mix (Easy, Medium, Hard)</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Live scoreboard & personal best comparisons</span>
              </li>
            </ul>
          </div>

          {/* Pillar 3 */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 hover:border-slate-700 transition">
            <div className="w-12 h-12 rounded-xl bg-purple-950 border border-purple-700/50 flex items-center justify-center text-purple-400">
              <BrainCircuit className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">TCS Mock Interview Simulator</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Prepare for Round 1 Technical (coding + CS fundamentals) and Round 2 HR/Managerial.
              Generates a 4-dimension scorecard with an actionable 7-day preparation roadmap.
            </p>
            <ul className="text-xs text-slate-300 space-y-1.5 pt-2">
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Technical (OOP, DBMS, OS, Networks)</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Behavioral & Situational HR questions</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Automatic fallback to curated static rubric</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Syllabus & Topic Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-white">
              Syllabus & Problem Domains
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Curated to match the historical distribution of TCS CodeVita pre-qualifier and qualifier problems.
            </p>
          </div>
          <Link
            href="/problems"
            className="inline-flex items-center space-x-1.5 text-xs font-semibold text-blue-400 hover:text-blue-300"
          >
            <span>View All Problems</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {topics.map((t) => (
            <Link
              key={t.name}
              href={`/problems?topic=${encodeURIComponent(t.name)}`}
              className="group p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between space-y-3"
            >
              <div className="font-semibold text-sm text-slate-200 group-hover:text-blue-400 transition">
                {t.name}
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>{t.count}</span>
                <span className="text-blue-500 opacity-0 group-hover:opacity-100 transition">→</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
