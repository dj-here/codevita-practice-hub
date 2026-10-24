'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Terminal,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { Difficulty } from '@/types';

export default function ProblemsListPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [problems, setProblems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [difficulty, setDifficulty] = useState(searchParams.get('difficulty') || '');
  const [selectedTag, setSelectedTag] = useState(searchParams.get('topic') || '');
  const [status, setStatus] = useState(searchParams.get('status') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || 'id-asc');
  const [page, setPage] = useState(parseInt(searchParams.get('page') || '1'));

  const tags = [
    'Number Theory & Primes',
    'Arrays & Two Pointers',
    'Strings & Parsing',
    'Matrices & Grids',
    'Recursion & Backtracking',
    'Greedy Algorithms',
    'Dynamic Programming',
    'Graphs & Trees',
    'Binary Search & Sorting',
    'Simulation & Bit Manipulation',
  ];

  useEffect(() => {
    async function loadProblems() {
      setLoading(true);
      try {
        const query = new URLSearchParams();
        if (search) query.set('search', search);
        if (difficulty) query.set('difficulty', difficulty);
        if (selectedTag) query.set('tag', selectedTag);
        if (status) query.set('status', status);
        if (sort) query.set('sort', sort);
        query.set('page', page.toString());
        query.set('limit', '20');

        const res = await fetch(`/api/problems?${query.toString()}`);
        if (res.ok) {
          const data = await res.json();
          setProblems(data.problems || []);
          setTotalCount(data.pagination?.totalCount || 0);
          setTotalPages(data.pagination?.totalPages || 1);
        }
      } catch (e) {
        console.error('Failed to load problems', e);
      } finally {
        setLoading(false);
      }
    }

    loadProblems();
  }, [search, difficulty, selectedTag, status, sort, page]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              CodeVita Problem Arena
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-blue-900/50 text-blue-300 border border-blue-700/40 text-xs font-semibold">
              {totalCount} Challenges
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Solve authentic story-style algorithmic problems scored by multi-tier hidden test cases.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
        {/* Search Input */}
        <div className="md:col-span-4 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search problems by title, keywords, or narrative..."
            className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Difficulty Selector */}
        <div className="md:col-span-2">
          <select
            value={difficulty}
            onChange={(e) => {
              setDifficulty(e.target.value);
              setPage(1);
            }}
            className="w-full py-2 px-3 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">All Difficulties</option>
            <option value="EASY">Easy (~35%)</option>
            <option value="MEDIUM">Medium (~45%)</option>
            <option value="HARD">Hard (~20%)</option>
          </select>
        </div>

        {/* Status Filter */}
        <div className="md:col-span-3">
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
            className="w-full py-2 px-3 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">All Statuses</option>
            <option value="solved">Solved</option>
            <option value="attempted">Attempted (Unsolved)</option>
            <option value="unsolved">Unattempted</option>
          </select>
        </div>

        {/* Sort Filter */}
        <div className="md:col-span-3">
          <select
            value={sort}
            onChange={(e) => {
              setSort(e.target.value);
              setPage(1);
            }}
            className="w-full py-2 px-3 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="id-asc">Sort: Problem ID (Ascending)</option>
            <option value="id-desc">Sort: Problem ID (Descending)</option>
            <option value="title-asc">Sort: Title (A-Z)</option>
            <option value="title-desc">Sort: Title (Z-A)</option>
            <option value="difficulty-asc">Sort: Difficulty (Easy first)</option>
            <option value="difficulty-desc">Sort: Difficulty (Hard first)</option>
          </select>
        </div>
      </div>

      {/* Topic Tag Pills */}
      <div className="flex flex-wrap gap-1.5 items-center">
        <button
          onClick={() => {
            setSelectedTag('');
            setPage(1);
          }}
          className={`px-3 py-1 rounded-full text-xs font-medium transition ${
            !selectedTag
              ? 'bg-blue-600 text-white'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          All Topics
        </button>
        {tags.map((t) => (
          <button
            key={t}
            onClick={() => {
              setSelectedTag(selectedTag === t ? '' : t);
              setPage(1);
            }}
            className={`px-3 py-1 rounded-full text-xs font-medium transition ${
              selectedTag === t
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Problems List Table / Grid */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center space-y-3 text-slate-400">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs">Loading problem set...</span>
          </div>
        ) : problems.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Terminal className="w-10 h-10 text-slate-600 mx-auto" />
            <h3 className="text-base font-semibold text-slate-200">No Problems Found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              No problems match your current search and filter criteria. Try clearing some filters.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-800">
            {problems.map((p, idx) => {
              const diffColors = {
                EASY: 'text-emerald-400 bg-emerald-950/40 border-emerald-600/30',
                MEDIUM: 'text-amber-400 bg-amber-950/40 border-amber-600/30',
                HARD: 'text-rose-400 bg-rose-950/40 border-rose-600/30',
              }[p.difficulty as 'EASY' | 'MEDIUM' | 'HARD'] || 'text-slate-400';

              return (
                <Link
                  key={p.id}
                  href={`/problems/${p.slug}`}
                  className="p-4 hover:bg-slate-800/50 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-mono text-slate-500">
                        #{idx + 1 + (page - 1) * 20}
                      </span>
                      <span className="font-semibold text-sm text-slate-100 group-hover:text-blue-400 transition">
                        {p.title}
                      </span>
                      {p.solved && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5">
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${diffColors}`}
                      >
                        {p.difficulty}
                      </span>
                      {p.tags.map((t: string) => (
                        <span
                          key={t}
                          className="text-[10px] bg-slate-950 border border-slate-800 text-slate-400 px-2 py-0.5 rounded"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 self-end sm:self-center">
                    <div className="text-[11px] text-slate-400 font-mono flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      <span>{p.timeLimitMs} ms</span>
                    </div>

                    <span className="px-3 py-1.5 rounded-lg bg-blue-600/10 group-hover:bg-blue-600 text-blue-400 group-hover:text-white border border-blue-500/30 text-xs font-medium transition flex items-center space-x-1">
                      <span>Solve</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-xs text-slate-400 pt-2">
          <span>
            Showing page {page} of {totalPages}
          </span>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page <= 1}
              className="p-1.5 rounded bg-slate-900 border border-slate-800 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-800"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page >= totalPages}
              className="p-1.5 rounded bg-slate-900 border border-slate-800 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-800"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
