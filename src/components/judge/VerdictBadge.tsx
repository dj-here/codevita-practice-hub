import React from 'react';
import { Verdict } from '@/types';
import {
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  FileCode,
  HardDrive,
  Loader2,
} from 'lucide-react';

interface VerdictBadgeProps {
  verdict: Verdict | string;
  size?: 'sm' | 'md' | 'lg';
}

export default function VerdictBadge({
  verdict,
  size = 'md',
}: VerdictBadgeProps) {
  const getVerdictConfig = () => {
    switch (verdict) {
      case Verdict.ACCEPTED:
      case 'ACCEPTED':
        return {
          label: 'Accepted',
          icon: CheckCircle2,
          bgColor: 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300',
        };
      case Verdict.WRONG_ANSWER:
      case 'WRONG_ANSWER':
        return {
          label: 'Wrong Answer',
          icon: XCircle,
          bgColor: 'bg-rose-950/60 border-rose-500/40 text-rose-300',
        };
      case Verdict.TIME_LIMIT_EXCEEDED:
      case 'TIME_LIMIT_EXCEEDED':
        return {
          label: 'Time Limit Exceeded',
          icon: Clock,
          bgColor: 'bg-amber-950/60 border-amber-500/40 text-amber-300',
        };
      case Verdict.MEMORY_LIMIT_EXCEEDED:
      case 'MEMORY_LIMIT_EXCEEDED':
        return {
          label: 'Memory Limit Exceeded',
          icon: HardDrive,
          bgColor: 'bg-orange-950/60 border-orange-500/40 text-orange-300',
        };
      case Verdict.COMPILATION_ERROR:
      case 'COMPILATION_ERROR':
        return {
          label: 'Compilation Error',
          icon: FileCode,
          bgColor: 'bg-violet-950/60 border-violet-500/40 text-violet-300',
        };
      case Verdict.RUNTIME_ERROR:
      case 'RUNTIME_ERROR':
        return {
          label: 'Runtime Error',
          icon: AlertTriangle,
          bgColor: 'bg-red-950/60 border-red-500/40 text-red-300',
        };
      case Verdict.RUNNING:
      case 'RUNNING':
        return {
          label: 'Running...',
          icon: Loader2,
          bgColor: 'bg-blue-950/60 border-blue-500/40 text-blue-300',
          spin: true,
        };
      default:
        return {
          label: 'Pending',
          icon: Clock,
          bgColor: 'bg-slate-900 border-slate-700 text-slate-300',
        };
    }
  };

  const config = getVerdictConfig();
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[11px] space-x-1',
    md: 'px-2.5 py-1 text-xs space-x-1.5',
    lg: 'px-3.5 py-1.5 text-sm space-x-2 font-semibold',
  }[size];

  return (
    <span
      className={`inline-flex items-center rounded-md border font-medium ${config.bgColor} ${sizeClasses}`}
    >
      <Icon className={`w-3.5 h-3.5 flex-shrink-0 ${config.spin ? 'animate-spin' : ''}`} />
      <span>{config.label}</span>
    </span>
  );
}

export { VerdictBadge };
