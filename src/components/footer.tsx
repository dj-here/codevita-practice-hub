import React from 'react';
import Link from 'next/link';
import { ExternalLink, ShieldCheck, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 text-xs py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-col items-center md:items-start space-y-1">
          <div className="flex items-center space-x-2 font-semibold text-slate-200">
            <span>CodeVita Practice Hub</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-900/60 text-blue-300 border border-blue-700/50">
              Community Edition
            </span>
          </div>
          <p className="text-slate-400 max-w-lg text-center md:text-left">
            Independent practice platform designed for engineering and science students preparing
            for algorithmic programming contests and technical interview assessments.
          </p>
        </div>

        <div className="flex flex-col items-center md:items-end space-y-1 text-center md:text-right">
          <a
            href="https://codevita.tcsapps.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1 text-blue-400 hover:text-blue-300 transition"
          >
            <span>Official TCS CodeVita Portal</span>
            <ExternalLink className="w-3 h-3" />
          </a>
          <p className="text-[11px] text-slate-500">
            TCS CodeVita is a registered trademark of Tata Consultancy Services Ltd.
            This site is an educational preparation resource.
          </p>
        </div>
      </div>
    </footer>
  );
}
