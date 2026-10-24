'use client';

import React, { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { ProgrammingLanguage } from '@/types';
import { getMonacoLanguage } from '@/lib/starter-templates';

// Dynamically import Monaco Editor to avoid SSR errors
const Editor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

interface MonacoEditorWrapperProps {
  language: ProgrammingLanguage;
  code: string;
  theme?: 'vs-dark' | 'light';
  onChange: (value: string) => void;
  onRun?: () => void;
  onSubmit?: () => void;
  readOnly?: boolean;
}

export default function MonacoEditorWrapper({
  language,
  code,
  theme = 'vs-dark',
  onChange,
  onRun,
  onSubmit,
  readOnly = false,
}: MonacoEditorWrapperProps) {
  const editorRef = useRef<any>(null);

  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor;

    // Custom Keybinding: Ctrl+Enter (or Cmd+Enter) -> Run Code
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      if (onRun) onRun();
    });

    // Custom Keybinding: Ctrl+Shift+Enter -> Submit Solution
    editor.addCommand(
      monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.Enter,
      () => {
        if (onSubmit) onSubmit();
      }
    );
  };

  return (
    <div className="w-full h-full min-h-[350px] relative rounded-b-lg overflow-hidden border-t border-slate-800">
      <Editor
        height="100%"
        language={getMonacoLanguage(language)}
        value={code}
        theme={theme}
        onChange={(val) => onChange(val || '')}
        onMount={handleEditorDidMount}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          fontFamily: "'Fira Code', 'Cascadia Code', Consolas, monospace",
          fontLigatures: true,
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 4,
          insertSpaces: true,
          readOnly,
          lineNumbers: 'on',
          renderLineHighlight: 'all',
          cursorBlinking: 'smooth',
          bracketPairColorization: { enabled: true },
          padding: { top: 12, bottom: 12 },
        }}
        loading={
          <div className="flex items-center justify-center h-full bg-slate-950 text-slate-400 text-xs">
            <span className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mr-2" />
            Loading Code Editor...
          </div>
        }
      />
    </div>
  );
}
