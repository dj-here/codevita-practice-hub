'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  BrainCircuit,
  Code2,
  Users,
  Send,
  AlertCircle,
  Award,
  ChevronLeft,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  Terminal,
  Loader2,
  FileCode,
} from 'lucide-react';
import MonacoEditorWrapper from '@/components/editor/MonacoEditorWrapper';
import { ProgrammingLanguage } from '@/types';
import { getStarterTemplate } from '@/lib/starter-templates';

export default function InterviewArenaPage({
  params,
}: {
  params: { sessionId: string };
}) {
  const router = useRouter();
  const { data: session } = useSession();
  const { sessionId } = params;

  const [sessionData, setSessionData] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [inputAnswer, setInputAnswer] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isStaticFallback, setIsStaticFallback] = useState(false);

  // Coding Drawer state for Technical Round
  const [showCodeDrawer, setShowCodeDrawer] = useState(false);
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState<ProgrammingLanguage>(ProgrammingLanguage.PYTHON);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isSending]);

  // Load session data
  useEffect(() => {
    async function loadSession() {
      try {
        const res = await fetch(`/api/interview/${sessionId}`);
        if (res.ok) {
          const data = await res.json();
          setSessionData(data.session);
          setMessages(data.messages || []);
          setIsStaticFallback(data.isStaticFallback);

          // If session is completed, redirect to scorecard
          if (data.session.status === 'COMPLETED') {
            router.replace(`/interview/${sessionId}/scorecard`);
            return;
          }

          // Initialize language
          if (data.session.language) {
            const langStr = data.session.language.toUpperCase() as keyof typeof ProgrammingLanguage;
            const chosenLang = ProgrammingLanguage[langStr] || ProgrammingLanguage.PYTHON;
            setLanguage(chosenLang);
            setCode(getStarterTemplate(chosenLang));
          }
        } else {
          router.push('/interview');
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadSession();
  }, [sessionId]);

  const handleSendMessage = async () => {
    if (!inputAnswer.trim() || isSending) return;

    const userText = inputAnswer.trim();
    setInputAnswer('');
    setIsSending(true);

    // Optimistically append user message to UI
    const optimisticUserMsg = {
      id: `temp-${Date.now()}`,
      role: 'USER',
      content: userText,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimisticUserMsg]);

    try {
      const res = await fetch(`/api/interview/${sessionId}/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: userText }),
      });

      if (res.ok) {
        const data = await res.json();
        setIsStaticFallback(data.isStaticFallback);

        // Append assistant reply
        const assistantMsg = {
          id: `asst-${Date.now()}`,
          role: 'ASSISTANT',
          content: data.reply,
          createdAt: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, assistantMsg]);

        if (data.isComplete) {
          setTimeout(() => {
            router.push(`/interview/${sessionId}/scorecard`);
          }, 2000);
        }
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to submit response');
      }
    } catch (e) {
      alert('Network error while processing interview response');
    } finally {
      setIsSending(false);
    }
  };

  const handleEarlyFinish = async () => {
    if (!confirm('Are you sure you want to conclude the interview early? A scorecard will be generated based on your answers so far.')) {
      return;
    }
    setIsSending(true);
    try {
      const res = await fetch(`/api/interview/${sessionId}/finish`, {
        method: 'POST',
      });
      if (res.ok) {
        router.push(`/interview/${sessionId}/scorecard`);
      } else {
        alert('Failed to finalize interview');
        setIsSending(false);
      }
    } catch (e) {
      alert('Error finalizing interview');
      setIsSending(false);
    }
  };

  // Insert code into the answer box
  const handleAttachCode = () => {
    if (!code.trim()) return;
    const codeSnippet = `\n\`\`\`${language}\n${code}\n\`\`\`\n`;
    setInputAnswer((prev) => prev + codeSnippet);
    setShowCodeDrawer(false);
  };

  if (loading || !sessionData) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-12 space-y-3">
        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs text-slate-400">Loading interview panel...</span>
      </div>
    );
  }

  const isTechnical = sessionData.type === 'TECHNICAL';

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] w-full overflow-hidden bg-slate-950 text-slate-200">
      {/* Top Bar */}
      <div className="h-14 bg-slate-900 border-b border-slate-800 px-4 flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-3">
          <Link
            href="/interview"
            className="text-slate-400 hover:text-white transition flex items-center space-x-1 text-xs"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Lobby</span>
          </Link>

          <div className="flex items-center space-x-2">
            {isTechnical ? (
              <Code2 className="w-4 h-4 text-purple-400" />
            ) : (
              <Users className="w-4 h-4 text-blue-400" />
            )}
            <span className="font-bold text-sm text-white">
              {isTechnical ? 'TCS Technical Round 1' : 'TCS Managerial & HR Round'}
            </span>
          </div>

          {sessionData.language && (
            <span className="hidden sm:inline-block px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800/40 text-[10px] font-semibold">
              {sessionData.language}
            </span>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {isTechnical && (
            <button
              onClick={() => setShowCodeDrawer(!showCodeDrawer)}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition"
            >
              <FileCode className="w-3.5 h-3.5 text-purple-400" />
              <span>{showCodeDrawer ? 'Hide Code Pad' : 'Coding Pad'}</span>
            </button>
          )}

          <button
            onClick={handleEarlyFinish}
            disabled={isSending}
            className="px-3.5 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-semibold text-xs transition shadow-sm shadow-purple-600/30"
          >
            Conclude & Score
          </button>
        </div>
      </div>

      {/* Static Fallback Notice Banner */}
      {isStaticFallback && (
        <div className="bg-amber-950/40 border-b border-amber-800/50 px-4 py-2 flex items-center space-x-2 text-xs text-amber-300">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            Operating in standardized TCS Interview Question Bank mode. Answers will be scored against TCS rubrics upon session conclusion.
          </span>
        </div>
      )}

      {/* Main Split Area (Chat on Left, Coding Pad on Right if open) */}
      <div className="flex-1 flex overflow-hidden">
        {/* Chat Stream Column */}
        <div className={`flex-1 flex flex-col h-full bg-slate-950 ${showCodeDrawer ? 'md:w-1/2 border-r border-slate-800' : 'w-full'}`}>
          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
            {messages.map((msg, idx) => {
              const isAssistant = msg.role === 'ASSISTANT';

              return (
                <div
                  key={msg.id || idx}
                  className={`flex items-start space-x-3 ${isAssistant ? 'justify-start' : 'justify-end'}`}
                >
                  {isAssistant && (
                    <div className="w-8 h-8 rounded-lg bg-purple-950 border border-purple-700/60 flex items-center justify-center text-purple-300 shrink-0 mt-0.5">
                      <BrainCircuit className="w-4 h-4" />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs leading-relaxed ${
                      isAssistant
                        ? 'bg-slate-900 border border-slate-800 text-slate-200'
                        : 'bg-purple-600 text-white shadow-md shadow-purple-600/10'
                    }`}
                  >
                    {isAssistant && (
                      <span className="text-[10px] font-bold text-purple-400 block mb-1">
                        TCS Interview Panel
                      </span>
                    )}
                    <p className="whitespace-pre-line font-sans">{msg.content}</p>
                  </div>

                  {!isAssistant && (
                    <div className="w-8 h-8 rounded-lg bg-blue-900 border border-blue-600 flex items-center justify-center text-blue-200 shrink-0 mt-0.5 font-bold text-xs">
                      {session?.user?.name ? session.user.name.charAt(0).toUpperCase() : 'C'}
                    </div>
                  )}
                </div>
              );
            })}

            {isSending && (
              <div className="flex items-start space-x-3 justify-start">
                <div className="w-8 h-8 rounded-lg bg-purple-950 border border-purple-700/60 flex items-center justify-center text-purple-300 shrink-0">
                  <BrainCircuit className="w-4 h-4" />
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-2xl px-4 py-3 text-xs text-slate-400 flex items-center space-x-2">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-purple-400" />
                  <span>The interviewer is reviewing your response...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Candidate Response Input Bar */}
          <div className="p-3 sm:p-4 bg-slate-900 border-t border-slate-800 shrink-0">
            <div className="flex flex-col space-y-2">
              <textarea
                value={inputAnswer}
                onChange={(e) => setInputAnswer(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                disabled={isSending}
                placeholder="Type your answer thoroughly... (Press Ctrl + Enter to submit)"
                rows={3}
                className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-purple-500 resize-none"
              />

              <div className="flex items-center justify-between">
                <span className="text-[11px] text-slate-500">
                  Tip: Speak clearly, cite concrete technical examples, and structure answers with the STAR method.
                </span>

                <button
                  onClick={handleSendMessage}
                  disabled={isSending || !inputAnswer.trim()}
                  className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-semibold text-xs transition shadow-sm shadow-purple-600/30"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Answer</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Live Coding Drawer (for Technical Round) */}
        {showCodeDrawer && (
          <div className="w-full md:w-1/2 h-full flex flex-col bg-slate-900 border-l border-slate-800">
            <div className="h-10 bg-slate-950 border-b border-slate-800 px-4 flex items-center justify-between shrink-0">
              <span className="text-xs font-bold text-white flex items-center space-x-2">
                <Code2 className="w-3.5 h-3.5 text-purple-400" />
                <span>Interview Scratchpad & Live Coding</span>
              </span>

              <div className="flex items-center space-x-2">
                <button
                  onClick={handleAttachCode}
                  className="px-2.5 py-1 rounded bg-purple-600 hover:bg-purple-500 text-white text-[11px] font-semibold transition"
                >
                  Attach Code to Answer
                </button>
                <button
                  onClick={() => setShowCodeDrawer(false)}
                  className="text-slate-400 hover:text-white text-xs"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-hidden">
              <MonacoEditorWrapper
                language={language}
                code={code}
                onChange={setCode}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
