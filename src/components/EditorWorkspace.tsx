import React, { useRef, useState, useEffect } from 'react';
import { Sparkles, Trash2, Clipboard, BookOpen, HelpCircle } from 'lucide-react';

interface EditorWorkspaceProps {
  text: string;
  onChangeText: (val: string) => void;
  onClear: () => void;
  onOpenSamples: () => void;
  onAskSentenceAdvice: (sentence: string) => void;
  disabled?: boolean;
}

export const EditorWorkspace: React.FC<EditorWorkspaceProps> = ({
  text,
  onChangeText,
  onClear,
  onOpenSamples,
  onAskSentenceAdvice,
  disabled = false,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [selectedText, setSelectedText] = useState<string>('');
  const [selectionPos, setSelectionPos] = useState<{ x: number; y: number } | null>(null);

  // Calculate live statistics
  const trimmed = text.trim();
  const wordCount = trimmed ? trimmed.split(/\s+/).length : 0;
  const charCount = text.length;
  const paragraphCount = trimmed ? trimmed.split(/\n+/).filter(Boolean).length : 0;
  const readTimeMin = Math.ceil(wordCount / 180);

  // Monitor text selection inside textarea for sentence-specific advice
  const handleSelect = () => {
    if (!textareaRef.current) return;
    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;
    const sel = text.slice(start, end).trim();

    if (sel.length > 5 && sel.length < 300) {
      setSelectedText(sel);
      setSelectionPos({ x: 20, y: 10 });
    } else {
      setSelectedText('');
      setSelectionPos(null);
    }
  };

  const handlePaste = async () => {
    try {
      const clip = await navigator.clipboard.readText();
      if (clip) {
        onChangeText(text ? `${text}\n\n${clip}` : clip);
      }
    } catch {
      // Clipboard permissions handled gracefully
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden transition-colors">
      {/* Editor Top Bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
            Dastlabki Matn
          </span>
          <span className="text-slate-300 dark:text-slate-700" aria-hidden="true">·</span>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">
            Qoralamangizni kiriting
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={onOpenSamples}
            disabled={disabled}
            className="min-h-[36px] px-2.5 py-1 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
            title="Namunaviy matn yuklash"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Namuna</span>
          </button>

          <button
            onClick={handlePaste}
            disabled={disabled}
            className="min-h-[36px] px-2.5 py-1 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
            title="Buferdan joylash"
          >
            <Clipboard className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Qo'yish</span>
          </button>

          {text && (
            <button
              onClick={onClear}
              disabled={disabled}
              className="min-h-[36px] px-2.5 py-1 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
              title="Tozalash"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Tozalash</span>
            </button>
          )}
        </div>
      </div>

      {/* Floating Sentence Advice Trigger */}
      {selectedText && (
        <div className="bg-amber-50 dark:bg-amber-950/80 border-b border-amber-200 dark:border-amber-900/60 px-4 py-2 flex items-center justify-between text-xs text-amber-900 dark:text-amber-200 animate-in fade-in">
          <div className="flex items-center gap-2 truncate pr-2">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
            <span className="truncate">Tanlangan jumla: <em>"{selectedText}"</em></span>
          </div>
          <button
            onClick={() => onAskSentenceAdvice(selectedText)}
            className="shrink-0 font-medium bg-amber-600 hover:bg-amber-700 text-white px-2.5 py-1 rounded-md transition-colors cursor-pointer"
          >
            Maslahat olish
          </button>
        </div>
      )}

      {/* Textarea Area */}
      <div className="relative flex-1 p-4 sm:p-5 flex flex-col min-h-[260px] sm:min-h-[340px]">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => onChangeText(e.target.value)}
          onSelect={handleSelect}
          disabled={disabled}
          placeholder="Insho, hikoya lavhasi yoki blog post matnini bu yerga yozing yoki namunaviy matnni tanlang...&#10;&#10;Yozuv murabbiyi sizning matningizni do'stona tahlil qilib, boyitilgan yangi variantini yaratadi va har bir o'zgarish sababini tushuntiradi."
          className="w-full h-full flex-1 resize-none bg-transparent text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 text-base leading-relaxed sm:leading-loose font-serif focus:outline-none focus:ring-0 border-none p-0"
        />
      </div>

      {/* Metadata Metrics Bar */}
      <div className="px-4 py-2.5 bg-slate-50/80 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-y-1 text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-3">
          <span><strong className="font-mono tabular-nums text-slate-700 dark:text-slate-200">{wordCount}</strong> ta so'z</span>
          <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
          <span><strong className="font-mono tabular-nums text-slate-700 dark:text-slate-200">{charCount}</strong> ta belgi</span>
          <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
          <span><strong className="font-mono tabular-nums text-slate-700 dark:text-slate-200">{paragraphCount}</strong> ta abzas</span>
        </div>

        <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
          <span>O'qish vaqti: ~{readTimeMin} daqiqa</span>
        </div>
      </div>
    </div>
  );
};
