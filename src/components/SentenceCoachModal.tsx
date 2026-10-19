import React, { useState, useEffect } from 'react';
import { X, Sparkles, Loader2, Check, ArrowRight } from 'lucide-react';
import { SentenceAdvice } from '../types.ts';

interface SentenceCoachModalProps {
  sentence: string;
  contextText: string;
  isOpen: boolean;
  onClose: () => void;
  onApplySentence: (replacement: string) => void;
}

export const SentenceCoachModal: React.FC<SentenceCoachModalProps> = ({
  sentence,
  contextText,
  isOpen,
  onClose,
  onApplySentence,
}) => {
  const [loading, setLoading] = useState(false);
  const [advice, setAdvice] = useState<SentenceAdvice | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && sentence) {
      fetchAdvice();
    }
  }, [isOpen, sentence]);

  const fetchAdvice = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/coach/sentence-advice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sentence, context: contextText.slice(0, 500) }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Maslahat olishda xatolik yuz berdi");
      }
      setAdvice(data.data);
    } catch (err: any) {
      setError(err?.message || "Kutilmagan xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Jumla Bo'yicha Murabbiy Maslahati
            </h3>
          </div>
          <button
            onClick={onClose}
            className="min-h-[36px] min-w-[36px] flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4">
          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/60">
            <span className="text-[10px] font-semibold tracking-wider uppercase text-slate-500">
              Tanlangan jumla:
            </span>
            <p className="font-serif text-sm text-slate-800 dark:text-slate-200 mt-1 italic">
              "{sentence}"
            </p>
          </div>

          {loading ? (
            <div className="py-10 flex flex-col items-center justify-center text-center space-y-3">
              <Loader2 className="w-6 h-6 text-indigo-600 animate-spin" />
              <p className="text-xs text-slate-500">
                Murabbiy ushbu jumlani tahlil qilib, nafis muqobil variantlar yaratmoqda...
              </p>
            </div>
          ) : error ? (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs rounded-xl">
              {error}
            </div>
          ) : advice ? (
            <div className="space-y-4">
              <div className="text-xs text-slate-600 dark:text-slate-300 bg-amber-50/60 dark:bg-amber-950/30 p-3 rounded-xl border border-amber-200/50 dark:border-amber-900/40">
                <strong className="text-amber-800 dark:text-amber-400 block mb-0.5">Ustoz xulosasi:</strong>
                {advice.coachFeedback}
              </div>

              <div className="space-y-2.5">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Tavsiya etilgan 3 xil muqobil variant:
                </span>

                {advice.alternatives.map((alt, i) => (
                  <div
                    key={i}
                    className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 bg-white dark:bg-slate-800/40 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                        {alt.style}
                      </span>
                      <button
                        onClick={() => {
                          onApplySentence(alt.sentence);
                          onClose();
                        }}
                        className="text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 px-2.5 py-1 rounded-md flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <span>Qo'llash</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>

                    <p className="font-serif text-sm text-slate-900 dark:text-white my-1.5 leading-relaxed">
                      "{alt.sentence}"
                    </p>

                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      💡 {alt.whyBetter}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
