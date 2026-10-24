'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import {
  ShieldAlert,
  ShieldCheck,
  Plus,
  Search,
  CheckCircle2,
  XCircle,
  FileCode,
  Sliders,
  Terminal,
  Database,
  Eye,
  Trash2,
  Edit,
  ArrowRight,
  BookOpen,
  Filter,
} from 'lucide-react';
import { VerdictBadge } from '@/components/judge/VerdictBadge';

export default function AdminDashboardPage() {
  const { data: session, status } = useSession();

  const [activeTab, setActiveTab] = useState<'problems' | 'testcases' | 'submissions'>('problems');
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Problems tab state
  const [problems, setProblems] = useState<any[]>([]);
  const [probSearch, setProbSearch] = useState('');
  const [probDifficulty, setProbDifficulty] = useState('');
  const [probPage, setProbPage] = useState(1);
  const [probTotalPages, setProbTotalPages] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingProblem, setEditingProblem] = useState<any>(null);

  // Test cases tab state
  const [selectedProblemId, setSelectedProblemId] = useState<string>('');
  const [selectedProblemDetail, setSelectedProblemDetail] = useState<any>(null);
  const [newTcInput, setNewTcInput] = useState('');
  const [newTcOutput, setNewTcOutput] = useState('');
  const [newTcIsSample, setNewTcIsSample] = useState(false);
  const [newTcExplanation, setNewTcExplanation] = useState('');

  // Submissions tab state
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [subVerdict, setSubVerdict] = useState('');
  const [subLanguage, setSubLanguage] = useState('');
  const [subPage, setSubPage] = useState(1);
  const [subTotalPages, setSubTotalPages] = useState(1);

  // New problem form state
  const [newSlug, setNewSlug] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newDifficulty, setNewDifficulty] = useState<'EASY' | 'MEDIUM' | 'HARD'>('EASY');
  const [newStatement, setNewStatement] = useState('');
  const [newInputFormat, setNewInputFormat] = useState('');
  const [newOutputFormat, setNewOutputFormat] = useState('');
  const [newConstraints, setNewConstraints] = useState('');
  const [newTimeLimit, setNewTimeLimit] = useState(1000);
  const [newMemoryLimit, setNewMemoryLimit] = useState(262144);
  const [newEditorial, setNewEditorial] = useState('');

  // 1. Fetch Stats
  async function loadStats() {
    try {
      const res = await fetch('/api/admin/stats');
      if (res.ok) {
        const data = await res.json();
        setStats(data.stats);
      }
    } catch (e) {
      console.error(e);
    }
  }

  // 2. Fetch Problems
  async function loadProblems() {
    try {
      const query = new URLSearchParams();
      if (probSearch) query.set('search', probSearch);
      if (probDifficulty) query.set('difficulty', probDifficulty);
      query.set('page', probPage.toString());
      query.set('limit', '15');

      const res = await fetch(`/api/admin/problems?${query.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setProblems(data.problems || []);
        setProbTotalPages(data.pagination?.totalPages || 1);
        if (!selectedProblemId && data.problems?.length > 0) {
          setSelectedProblemId(data.problems[0].id);
        }
      }
    } catch (e) {
      console.error(e);
    }
  }

  // 3. Fetch Problem Detail for Test Cases
  async function loadProblemDetail(id: string) {
    if (!id) return;
    try {
      const res = await fetch(`/api/admin/problems/${id}`);
      if (res.ok) {
        const data = await res.json();
        setSelectedProblemDetail(data.problem);
      }
    } catch (e) {
      console.error(e);
    }
  }

  // 4. Fetch Global Submissions
  async function loadSubmissions() {
    try {
      const query = new URLSearchParams();
      if (subVerdict) query.set('verdict', subVerdict);
      if (subLanguage) query.set('language', subLanguage);
      query.set('page', subPage.toString());
      query.set('limit', '20');

      const res = await fetch(`/api/admin/submissions?${query.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setSubmissions(data.submissions || []);
        setSubTotalPages(data.pagination?.totalPages || 1);
      }
    } catch (e) {
      console.error(e);
    }
  }

  useEffect(() => {
    if (session?.user?.role === 'ADMIN') {
      loadStats();
      loadProblems();
      loadSubmissions();
      setLoading(false);
    } else if (status !== 'loading') {
      setLoading(false);
    }
  }, [session, status]);

  useEffect(() => {
    if (session?.user?.role === 'ADMIN') {
      loadProblems();
    }
  }, [probSearch, probDifficulty, probPage]);

  useEffect(() => {
    if (session?.user?.role === 'ADMIN' && selectedProblemId) {
      loadProblemDetail(selectedProblemId);
    }
  }, [selectedProblemId]);

  useEffect(() => {
    if (session?.user?.role === 'ADMIN') {
      loadSubmissions();
    }
  }, [subVerdict, subLanguage, subPage]);

  // Toggle Publish
  const handleTogglePublish = async (problemId: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/admin/problems/${problemId}/publish`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublished: !currentStatus }),
      });
      if (res.ok) {
        loadProblems();
        loadStats();
      }
    } catch (e) {
      alert('Failed to toggle publish status');
    }
  };

  // Create Problem
  const handleCreateProblem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/problems', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug: newSlug,
          title: newTitle,
          difficulty: newDifficulty,
          statement: newStatement,
          inputFormat: newInputFormat,
          outputFormat: newOutputFormat,
          constraints: newConstraints,
          timeLimitMs: Number(newTimeLimit),
          memoryLimitKb: Number(newMemoryLimit),
          editorial: newEditorial,
          isPublished: true,
        }),
      });

      if (res.ok) {
        setShowCreateModal(false);
        // Reset form
        setNewSlug('');
        setNewTitle('');
        setNewStatement('');
        setNewInputFormat('');
        setNewOutputFormat('');
        setNewConstraints('');
        setNewEditorial('');
        loadProblems();
        loadStats();
        alert('Problem created successfully!');
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to create problem');
      }
    } catch (e) {
      alert('Error creating problem');
    }
  };

  // Add Test Case
  const handleAddTestCase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProblemId) return;

    try {
      const res = await fetch(`/api/admin/problems/${selectedProblemId}/testcases`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          input: newTcInput,
          expectedOutput: newTcOutput,
          isSample: newTcIsSample,
          explanation: newTcExplanation,
        }),
      });

      if (res.ok) {
        setNewTcInput('');
        setNewTcOutput('');
        setNewTcExplanation('');
        loadProblemDetail(selectedProblemId);
        loadStats();
        alert('Test case added successfully!');
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to add test case');
      }
    } catch (e) {
      alert('Error adding test case');
    }
  };

  // Delete Test Case
  const handleDeleteTestCase = async (tcId: string) => {
    if (!confirm('Are you sure you want to delete this test case?')) return;
    try {
      const res = await fetch(`/api/admin/testcases/${tcId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        loadProblemDetail(selectedProblemId);
        loadStats();
      }
    } catch (e) {
      alert('Failed to delete testcase');
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-12 space-y-3">
        <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs text-slate-400">Verifying administrative credentials...</span>
      </div>
    );
  }

  // Strict Role Check: Must be ADMIN
  if (!session || session.user?.role !== 'ADMIN') {
    return (
      <div className="max-w-md mx-auto my-16 p-8 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-4 shadow-2xl">
        <div className="w-12 h-12 rounded-xl bg-rose-950/80 border border-rose-700/50 flex items-center justify-center text-rose-400 mx-auto">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <h1 className="text-xl font-bold text-white">403 Access Denied</h1>
        <p className="text-xs text-slate-400">
          This portal requires Administrator credentials. You are currently authenticated as{' '}
          <span className="font-semibold text-slate-300">{session?.user?.email || 'Guest'}</span>.
        </p>
        <Link
          href="/"
          className="inline-block px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold"
        >
          Return to Hub
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 w-full">
      {/* Admin Top Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/30 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold text-white flex items-center space-x-2.5">
              <ShieldCheck className="w-6 h-6 text-amber-400" />
              <span>CodeVita Practice Hub • Master Admin</span>
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-900/50 text-amber-300 border border-amber-700/40 text-xs font-semibold">
              Admin Role Active
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Problem lifecycle control, hidden test case management, and global submission auditing.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold transition shadow-md shadow-amber-600/20"
        >
          <Plus className="w-4 h-4" />
          <span>New Problem</span>
        </button>
      </div>

      {/* System Metrics Strip */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-[11px] text-slate-400 uppercase font-medium">Total Problems</span>
            <div className="text-2xl font-bold text-white mt-1">{stats.totalProblems}</div>
            <span className="text-[10px] text-emerald-400">{stats.publishedProblems} published</span>
          </div>
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-[11px] text-slate-400 uppercase font-medium">Test Cases</span>
            <div className="text-2xl font-bold text-white mt-1">{stats.totalTestCases}</div>
            <span className="text-[10px] text-slate-500">Sample & Hidden</span>
          </div>
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-[11px] text-slate-400 uppercase font-medium">Submissions</span>
            <div className="text-2xl font-bold text-white mt-1">{stats.totalSubmissions}</div>
            <span className="text-[10px] text-blue-400">Platform-wide</span>
          </div>
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-[11px] text-slate-400 uppercase font-medium">Mock Contests</span>
            <div className="text-2xl font-bold text-white mt-1">{stats.totalContests}</div>
            <span className="text-[10px] text-amber-400">Timed presets</span>
          </div>
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-[11px] text-slate-400 uppercase font-medium">Candidates</span>
            <div className="text-2xl font-bold text-white mt-1">{stats.totalUsers}</div>
            <span className="text-[10px] text-purple-400">{stats.totalInterviews} interviews</span>
          </div>
        </div>
      )}

      {/* Admin Tab Navigation */}
      <div className="flex border-b border-slate-800 space-x-4">
        <button
          onClick={() => setActiveTab('problems')}
          className={`pb-3 text-xs font-semibold transition border-b-2 ${
            activeTab === 'problems'
              ? 'border-amber-500 text-white'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Problems Manager ({stats?.totalProblems || 0})
        </button>
        <button
          onClick={() => setActiveTab('testcases')}
          className={`pb-3 text-xs font-semibold transition border-b-2 ${
            activeTab === 'testcases'
              ? 'border-amber-500 text-white'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Test Cases Uploader
        </button>
        <button
          onClick={() => setActiveTab('submissions')}
          className={`pb-3 text-xs font-semibold transition border-b-2 ${
            activeTab === 'submissions'
              ? 'border-amber-500 text-white'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Global Submissions Audit
        </button>
      </div>

      {/* TAB 1: PROBLEMS MANAGER */}
      {activeTab === 'problems' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 bg-slate-900 p-4 rounded-xl border border-slate-800">
            <div className="md:col-span-8 relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                value={probSearch}
                onChange={(e) => {
                  setProbSearch(e.target.value);
                  setProbPage(1);
                }}
                placeholder="Search by problem title or slug..."
                className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white"
              />
            </div>
            <div className="md:col-span-4">
              <select
                value={probDifficulty}
                onChange={(e) => {
                  setProbDifficulty(e.target.value);
                  setProbPage(1);
                }}
                className="w-full py-1.5 px-3 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white"
              >
                <option value="">All Difficulties</option>
                <option value="EASY">Easy</option>
                <option value="MEDIUM">Medium</option>
                <option value="HARD">Hard</option>
              </select>
            </div>
          </div>

          {/* Problems Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="text-[11px] uppercase bg-slate-950 text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Problem</th>
                    <th className="py-3 px-4">Difficulty</th>
                    <th className="py-3 px-4">Test Cases</th>
                    <th className="py-3 px-4">Submissions</th>
                    <th className="py-3 px-4">Published</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {problems.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-800/40 transition">
                      <td className="py-3 px-4">
                        <Link
                          href={`/problems/${p.slug}`}
                          className="font-semibold text-white hover:text-blue-400 transition"
                        >
                          {p.title}
                        </Link>
                        <span className="block text-[10px] text-slate-500 font-mono mt-0.5">
                          {p.slug}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                            p.difficulty === 'EASY'
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/50'
                              : p.difficulty === 'MEDIUM'
                              ? 'bg-amber-950 text-amber-400 border border-amber-800/50'
                              : 'bg-rose-950 text-rose-400 border border-rose-800/50'
                          }`}
                        >
                          {p.difficulty}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-300 font-mono">
                        {p.testCaseCount} cases
                      </td>
                      <td className="py-3 px-4 text-slate-300">
                        {p.submissionCount}
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleTogglePublish(p.id, p.isPublished)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-semibold transition ${
                            p.isPublished
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-700/50'
                              : 'bg-slate-800 text-slate-400 border border-slate-700'
                          }`}
                        >
                          {p.isPublished ? 'Live' : 'Draft'}
                        </button>
                      </td>
                      <td className="py-3 px-4 text-right space-x-2">
                        <button
                          onClick={() => {
                            setSelectedProblemId(p.id);
                            setActiveTab('testcases');
                          }}
                          className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-semibold"
                        >
                          Manage Cases
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>Page {probPage} of {probTotalPages}</span>
              <div className="space-x-2">
                <button
                  disabled={probPage <= 1}
                  onClick={() => setProbPage((p) => p - 1)}
                  className="px-2.5 py-1 rounded bg-slate-800 disabled:opacity-40"
                >
                  Previous
                </button>
                <button
                  disabled={probPage >= probTotalPages}
                  onClick={() => setProbPage((p) => p + 1)}
                  className="px-2.5 py-1 rounded bg-slate-800 disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: TEST CASES UPLOADER */}
      {activeTab === 'testcases' && (
        <div className="space-y-6">
          {/* Problem Selector */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-semibold text-slate-400">Selected Problem:</span>
              <h2 className="text-base font-bold text-white mt-0.5">
                {selectedProblemDetail?.title || 'Loading problem...'}
              </h2>
              <span className="text-[11px] text-slate-500 font-mono">
                {selectedProblemDetail?.slug}
              </span>
            </div>

            <select
              value={selectedProblemId}
              onChange={(e) => setSelectedProblemId(e.target.value)}
              className="py-1.5 px-3 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white max-w-xs"
            >
              {problems.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.slug} - {p.title}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Existing Test Cases List (7 cols) */}
            <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
              <h3 className="font-bold text-sm text-white">
                Existing Test Cases ({selectedProblemDetail?.testCases?.length || 0})
              </h3>

              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                {selectedProblemDetail?.testCases?.map((tc: any, idx: number) => (
                  <div
                    key={tc.id}
                    className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-300">
                        Case #{idx + 1}{' '}
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded font-semibold ml-2 ${
                            tc.isSample
                              ? 'bg-blue-950 text-blue-300 border border-blue-800/40'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {tc.isSample ? 'Sample Case' : 'Hidden Case'}
                        </span>
                      </span>
                      <button
                        onClick={() => handleDeleteTestCase(tc.id)}
                        className="text-slate-500 hover:text-rose-400 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div>
                        <span className="text-slate-500 block">Input</span>
                        <pre className="p-1.5 rounded bg-slate-900 font-mono text-slate-300 overflow-x-auto">
                          {tc.input}
                        </pre>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Expected Output</span>
                        <pre className="p-1.5 rounded bg-slate-900 font-mono text-emerald-400 overflow-x-auto">
                          {tc.expectedOutput}
                        </pre>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Add New Test Case Form (5 cols) */}
            <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
              <h3 className="font-bold text-sm text-white">Add Test Case</h3>

              <form onSubmit={handleAddTestCase} className="space-y-3 text-xs">
                <div>
                  <label className="text-slate-400 block mb-1">Standard Input (stdin)</label>
                  <textarea
                    rows={4}
                    value={newTcInput}
                    onChange={(e) => setNewTcInput(e.target.value)}
                    required
                    placeholder="e.g. 5\n1 2 3 4 5"
                    className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg font-mono text-xs text-white"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Expected Output (stdout)</label>
                  <textarea
                    rows={3}
                    value={newTcOutput}
                    onChange={(e) => setNewTcOutput(e.target.value)}
                    required
                    placeholder="e.g. 15"
                    className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg font-mono text-xs text-emerald-400"
                  />
                </div>

                <div className="flex items-center space-x-2 pt-1">
                  <input
                    type="checkbox"
                    id="isSampleCheck"
                    checked={newTcIsSample}
                    onChange={(e) => setNewTcIsSample(e.target.checked)}
                    className="accent-amber-500"
                  />
                  <label htmlFor="isSampleCheck" className="text-slate-300">
                    Is Sample Case (visible to candidate in problem description)
                  </label>
                </div>

                {newTcIsSample && (
                  <div>
                    <label className="text-slate-400 block mb-1">Explanation (Optional)</label>
                    <input
                      type="text"
                      value={newTcExplanation}
                      onChange={(e) => setNewTcExplanation(e.target.value)}
                      placeholder="e.g. 1 + 2 + 3 + 4 + 5 = 15."
                      className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white"
                    />
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold transition"
                >
                  Upload Test Case
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: GLOBAL SUBMISSIONS AUDIT */}
      {activeTab === 'submissions' && (
        <div className="space-y-4">
          {/* Submissions Filters */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 bg-slate-900 p-4 rounded-xl border border-slate-800">
            <div className="md:col-span-6">
              <select
                value={subVerdict}
                onChange={(e) => {
                  setSubVerdict(e.target.value);
                  setSubPage(1);
                }}
                className="w-full py-1.5 px-3 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white"
              >
                <option value="">All Verdicts</option>
                <option value="ACCEPTED">Accepted</option>
                <option value="WRONG_ANSWER">Wrong Answer</option>
                <option value="TIME_LIMIT_EXCEEDED">Time Limit Exceeded</option>
                <option value="MEMORY_LIMIT_EXCEEDED">Memory Limit Exceeded</option>
                <option value="COMPILATION_ERROR">Compilation Error</option>
                <option value="RUNTIME_ERROR">Runtime Error</option>
              </select>
            </div>

            <div className="md:col-span-6">
              <select
                value={subLanguage}
                onChange={(e) => {
                  setSubLanguage(e.target.value);
                  setSubPage(1);
                }}
                className="w-full py-1.5 px-3 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white"
              >
                <option value="">All Languages</option>
                <option value="PYTHON">Python</option>
                <option value="CPP">C++</option>
                <option value="C">C</option>
                <option value="JAVA">Java</option>
              </select>
            </div>
          </div>

          {/* Submissions Audit Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="text-[11px] uppercase bg-slate-950 text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Candidate</th>
                    <th className="py-3 px-4">Problem</th>
                    <th className="py-3 px-4">Language</th>
                    <th className="py-3 px-4">Verdict</th>
                    <th className="py-3 px-4">Time (ms)</th>
                    <th className="py-3 px-4">Cases Passed</th>
                    <th className="py-3 px-4 text-right">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {submissions.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-800/40 transition">
                      <td className="py-3 px-4">
                        <span className="font-semibold text-white block">{s.userName || 'Candidate'}</span>
                        <span className="text-[10px] text-slate-500">{s.userEmail}</span>
                      </td>
                      <td className="py-3 px-4">
                        <Link
                          href={`/problems/${s.problemSlug}`}
                          className="font-medium text-slate-300 hover:text-blue-400 transition"
                        >
                          {s.problemTitle}
                        </Link>
                      </td>
                      <td className="py-3 px-4 text-slate-400 font-mono">
                        {s.language}
                      </td>
                      <td className="py-3 px-4">
                        <VerdictBadge verdict={s.verdict} size="sm" />
                      </td>
                      <td className="py-3 px-4 text-slate-300 font-mono">
                        {s.executionTimeMs || 0}ms
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-300">
                        {s.passedCases} / {s.totalCases}
                      </td>
                      <td className="py-3 px-4 text-right text-slate-500 text-[11px]">
                        {new Date(s.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>Page {subPage} of {subTotalPages}</span>
              <div className="space-x-2">
                <button
                  disabled={subPage <= 1}
                  onClick={() => setSubPage((p) => p - 1)}
                  className="px-2.5 py-1 rounded bg-slate-800 disabled:opacity-40"
                >
                  Previous
                </button>
                <button
                  disabled={subPage >= subTotalPages}
                  onClick={() => setSubPage((p) => p + 1)}
                  className="px-2.5 py-1 rounded bg-slate-800 disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CREATE PROBLEM MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-base text-white">Create New CodeVita Problem</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateProblem} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Unique Slug</label>
                  <input
                    type="text"
                    required
                    value={newSlug}
                    onChange={(e) => setNewSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
                    placeholder="cv221-custom-problem"
                    className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Problem Title</label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="The Merchant Gold Reserve"
                    className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Difficulty</label>
                  <select
                    value={newDifficulty}
                    onChange={(e) => setNewDifficulty(e.target.value as any)}
                    className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                  >
                    <option value="EASY">Easy</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HARD">Hard</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Time Limit (ms)</label>
                  <input
                    type="number"
                    value={newTimeLimit}
                    onChange={(e) => setNewTimeLimit(parseInt(e.target.value) || 1000)}
                    className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Memory Limit (KB)</label>
                  <input
                    type="number"
                    value={newMemoryLimit}
                    onChange={(e) => setNewMemoryLimit(parseInt(e.target.value) || 262144)}
                    className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Story Statement</label>
                <textarea
                  rows={4}
                  required
                  value={newStatement}
                  onChange={(e) => setNewStatement(e.target.value)}
                  placeholder="In an ancient realm, the grand alchemist..."
                  className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Input Format</label>
                  <input
                    type="text"
                    required
                    value={newInputFormat}
                    onChange={(e) => setNewInputFormat(e.target.value)}
                    placeholder="First line contains N..."
                    className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Output Format</label>
                  <input
                    type="text"
                    required
                    value={newOutputFormat}
                    onChange={(e) => setNewOutputFormat(e.target.value)}
                    placeholder="Print the single integer..."
                    className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Constraints</label>
                <input
                  type="text"
                  required
                  value={newConstraints}
                  onChange={(e) => setNewConstraints(e.target.value)}
                  placeholder="1 <= N <= 10^5"
                  className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Editorial / Reference Approach (Optional)</label>
                <textarea
                  rows={3}
                  value={newEditorial}
                  onChange={(e) => setNewEditorial(e.target.value)}
                  placeholder="Use Kadane's algorithm with O(N) time and O(1) space..."
                  className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                />
              </div>

              <div className="flex items-center space-x-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold shadow-md shadow-amber-600/20"
                >
                  Create & Publish Problem
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
