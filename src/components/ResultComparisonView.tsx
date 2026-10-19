import React, { useState } from 'react';
import { RewriteResult } from '../types.ts';
import { Copy, Check, ArrowRightLeft, Sparkles, Volume2, ArrowUpRight, Award } from 'lucide-react';

interface ResultComparisonViewProps {
  originalText: string;
  result: RewriteResult;
  onApplyToOriginal: (text: string) => void;
}

export const ResultComparisonView: React.FC<ResultComparisonViewProps> = ({
  originalText,
  result,
  onApplyToOriginal,
}) => {
  const [viewMode, setViewMode] = useState<'improved' | 'diff'>('improved');
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(result.improvedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Handled
    }
  };

  const handleSpeak = () => {
    if (!('speechSynthesis' in window)) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(result.improvedText);
    utterance.lang = 'uz-UZ';
    utterance.rate = 0.95;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden transition-colors">
      {/* Top Header of Result */}
      <div className="flex flex-wrap items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800 bg-indigo-50/40 dark:bg-indigo-950/20 gap-2">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-indigo-600 flex items-center justify-center text-white">
            <Sparkles className="w-3 h-3" />
          </div>
          <span className="text-xs font-semibold text-indigo-950 dark:text-indigo-200">
            Sayqallangan Natija
          </span>
          <span className="text-slate-300 dark:text-slate-700" aria-hidden="true">·</span>
          <div className="flex items-center gap-1 text-[11px] font-medium text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded border border-amber-200/50 dark:border-amber-900/40">
            <Award className="w-3 h-3" />
            <span>Mahorat: {result.readabilityScore}/100</span>
          </div>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg text-xs">
          <button
            onClick={() => setViewMode('improved')}
            className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
              viewMode === 'improved'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Mukammal
          </button>
          <button
            onClick={() => setViewMode('diff')}
            className={`px-2.5 py-1 rounded-md font-medium transition-colors flex items-center gap-1 cursor-pointer ${
              viewMode === 'diff'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <ArrowRightLeft className="w-3 h-3" />
            <span>Solishtirish</span>
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 p-4 sm:p-5 overflow-y-auto min-h-[260px] sm:min-h-[340px]">
        {viewMode === 'improved' ? (
          <div className="space-y-4">
            <div className="prose dark:prose-invert max-w-none text-slate-800 dark:text-slate-100 font-serif text-base leading-relaxed sm:leading-loose whitespace-pre-wrap">
              {result.improvedText}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
            <div className="p-3.5 bg-rose-50/40 dark:bg-rose-950/20 rounded-xl border border-rose-100 dark:border-rose-900/40">
              <div className="text-[11px] font-semibold tracking-wider uppercase text-rose-700 dark:text-rose-400 mb-2">
                Dastlabki qoralama
              </div>
              <p className="font-serif text-sm leading-relaxed text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                {originalText}
              </p>
            </div>

            <div className="p-3.5 bg-emerald-50/40 dark:bg-emerald-950/20 rounded-xl border border-emerald-100 dark:border-emerald-900/40">
              <div className="text-[11px] font-semibold tracking-wider uppercase text-emerald-700 dark:text-emerald-400 mb-2">
                Yaxshilangan muqobil
              </div>
              <p className="font-serif text-sm leading-relaxed text-slate-800 dark:text-slate-100 whitespace-pre-wrap">
                {result.improvedText}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Action Toolbar */}
      <div className="px-4 py-2.5 bg-slate-50/80 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <span>Uslub: <strong>{result.styleTone}</strong></span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handleSpeak}
            className="min-h-[36px] px-2.5 py-1 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Ovozda tinglash"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isSpeaking ? "To'xtatish" : "Tinglash"}</span>
          </button>

          <button
            onClick={() => onApplyToOriginal(result.improvedText)}
            className="min-h-[36px] px-2.5 py-1 text-xs font-medium rounded-lg border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Muharrirga o'tkazish"
          >
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>Qo'llash</span>
          </button>

          <button
            onClick={handleCopy}
            className="min-h-[36px] px-3 py-1 text-xs font-medium rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
            title="Nusxalash"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "Nusxalandi!" : "Nusxalash"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
