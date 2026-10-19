/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header.tsx';
import { GenreSelector } from './components/GenreSelector.tsx';
import { EditorWorkspace } from './components/EditorWorkspace.tsx';
import { ResultComparisonView } from './components/ResultComparisonView.tsx';
import { CoachTipsCard } from './components/CoachTipsCard.tsx';
import { SamplesModal } from './components/SamplesModal.tsx';
import { HistoryModal } from './components/HistoryModal.tsx';
import { SentenceCoachModal } from './components/SentenceCoachModal.tsx';
import { GENRES } from './data/samples.ts';
import { GenreId, RewriteResult, HistoryItem, WritingSample } from './types.ts';
import { Sparkles, Loader2, BookOpen, AlertCircle, RefreshCw, Feather } from 'lucide-react';

export default function App() {
  // Theme state
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('coach_theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // App core state
  const [text, setText] = useState<string>(() => {
    return localStorage.getItem('coach_current_text') || '';
  });
  const [selectedGenre, setSelectedGenre] = useState<GenreId>('badiiy_hikoya');
  const [temperature, setTemperature] = useState<number>(0.85);
  const [customTone, setCustomTone] = useState<string>('');
  const [result, setResult] = useState<RewriteResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // History state
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('coach_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Modals
  const [isSamplesOpen, setIsSamplesOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [sentenceAdviceTarget, setSentenceAdviceTarget] = useState<{
    sentence: string;
    context: string;
  } | null>(null);

  // Mobile active tab ('editor' | 'result')
  const [mobileTab, setMobileTab] = useState<'editor' | 'result'>('editor');

  // Sync dark mode class
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('coach_theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('coach_theme', 'light');
    }
  }, [darkMode]);

  // Persist draft text to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('coach_current_text', text);
    } catch {
      // Ignore storage quota
    }
  }, [text]);

  // Persist history to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('coach_history', JSON.stringify(history));
    } catch {
      // Ignore storage quota
    }
  }, [history]);

  // One-click Smart Rewrite handler
  const handleRewrite = async () => {
    if (!text.trim()) {
      setError("Iltimos, avval tahrir qilish uchun matn kiriting yoki namunani tanlang.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/coach/rewrite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: text.trim(),
          genre: selectedGenre,
          customTemperature: temperature,
          customTone: customTone.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Matnni tahrirlashda xatolik yuz berdi");
      }

      const rewriteData: RewriteResult = data.data;
      setResult(rewriteData);

      // Save to history
      const genreDef = GENRES.find((g) => g.id === selectedGenre);
      const titleWords = text.trim().split(/\s+/).slice(0, 4).join(' ');
      const newHistoryItem: HistoryItem = {
        id: String(Date.now()),
        timestamp: Date.now(),
        title: `${genreDef?.label || 'Insho'}: "${titleWords}..."`,
        originalText: text.trim(),
        result: rewriteData,
        genre: selectedGenre,
        appliedTemperature: temperature,
      };

      setHistory((prev) => [newHistoryItem, ...prev.slice(0, 19)]);
      setMobileTab('result'); // Switch to result view on mobile
    } catch (err: any) {
      setError(err?.message || "Kutilmagan xatolik yuz berdi. Iltimos qaytadan urinib ko'ring.");
    } finally {
      setLoading(false);
    }
  };

  const handleApplyToOriginal = (newText: string) => {
    setText(newText);
    setMobileTab('editor');
  };

  const handleSelectSample = (sample: WritingSample) => {
    setText(sample.text);
    setSelectedGenre(sample.genre);
    const g = GENRES.find((item) => item.id === sample.genre);
    if (g) setTemperature(g.defaultTemp);
    setResult(null);
    setMobileTab('editor');
  };

  const handleSelectHistoryItem = (item: HistoryItem) => {
    setText(item.originalText);
    setSelectedGenre(item.genre);
    setTemperature(item.appliedTemperature || 0.85);
    setResult(item.result);
    setMobileTab('result');
  };

  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem('coach_history');
  };

  const handleClearEditor = () => {
    setText('');
    setResult(null);
    setError(null);
  };

  const handleApplySentenceReplacement = (replacement: string) => {
    if (!sentenceAdviceTarget) return;
    const oldSentence = sentenceAdviceTarget.sentence;
    if (text.includes(oldSentence)) {
      setText((prev) => prev.replace(oldSentence, replacement));
    } else {
      setText((prev) => `${prev} ${replacement}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors pb-24 sm:pb-12">
      {/* Top Bar Contract */}
      <Header
        darkMode={darkMode}
        onToggleTheme={() => setDarkMode(!darkMode)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenSamples={() => setIsSamplesOpen(true)}
        historyCount={history.length}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8 space-y-6">
        {/* Genre & Temperature Intelligent Presets */}
        <GenreSelector
          selectedGenre={selectedGenre}
          onSelectGenre={setSelectedGenre}
          temperature={temperature}
          onChangeTemperature={setTemperature}
          customTone={customTone}
          onChangeCustomTone={setCustomTone}
          disabled={loading}
        />

        {/* Error Alert */}
        {error && (
          <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-200 rounded-2xl flex items-start justify-between gap-3 text-xs sm:text-sm animate-in fade-in">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-rose-600 dark:text-rose-400 font-bold hover:underline"
            >
              Yopish
            </button>
          </div>
        )}

        {/* Mobile Tab Switcher (Visible on mobile only) */}
        <div className="sm:hidden flex items-center p-1 bg-slate-200/80 dark:bg-slate-800/80 rounded-xl">
          <button
            onClick={() => setMobileTab('editor')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              mobileTab === 'editor'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Dastlabki Matn
          </button>
          <button
            onClick={() => setMobileTab('result')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
              mobileTab === 'result'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Sayqal {result ? `(${result.readabilityScore}%)` : ''}</span>
          </button>
        </div>

        {/* Dual Pane Layout (Desktop) or Tab View (Mobile) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6 items-stretch">
          {/* Left: Editor Workspace */}
          <div className={`${mobileTab === 'editor' ? 'block' : 'hidden sm:block'} flex flex-col h-full`}>
            <EditorWorkspace
              text={text}
              onChangeText={setText}
              onClear={handleClearEditor}
              onOpenSamples={() => setIsSamplesOpen(true)}
              onAskSentenceAdvice={(sentence) =>
                setSentenceAdviceTarget({ sentence, context: text })
              }
              disabled={loading}
            />
          </div>

          {/* Right: Result & Diff Comparison */}
          <div className={`${mobileTab === 'result' ? 'block' : 'hidden sm:block'} flex flex-col h-full`}>
            {loading ? (
              <div className="flex-1 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 flex flex-col items-center justify-center text-center space-y-4 min-h-[300px]">
                <div className="relative">
                  <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400 animate-pulse">
                    <Feather className="w-7 h-7" />
                  </div>
                  <Loader2 className="w-6 h-6 text-indigo-600 absolute -bottom-1 -right-1 animate-spin" />
                </div>
                <div className="space-y-1 max-w-sm">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Yozuv murabbiyi matningiz ustida ishlamoqda...
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Jumlalar ritmi sozlanmoqda, boy metaforalar tanlanmoqda va har bir o'zgarish uchun ta'limiy xulosalar tayyorlanmoqda.
                  </p>
                </div>
              </div>
            ) : result ? (
              <ResultComparisonView
                originalText={text}
                result={result}
                onApplyToOriginal={handleApplyToOriginal}
              />
            ) : (
              <div className="flex-1 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 p-8 flex flex-col items-center justify-center text-center space-y-3 min-h-[300px]">
                <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div className="space-y-1 max-w-xs">
                  <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    Mukammal variant shu yerda ko'rinadi
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Chap tomondagi maydonga matn yozing va "Mukammallashtirish" tugmasini bosing.
                  </p>
                </div>
                <button
                  onClick={() => setIsSamplesOpen(true)}
                  className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer pt-1"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Tayyor namunani sinab ko'rish</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Primary Desktop Action Button */}
        <div className="hidden sm:flex items-center justify-center pt-2">
          <button
            onClick={handleRewrite}
            disabled={loading || !text.trim()}
            className={`min-h-[52px] px-8 py-3.5 rounded-2xl font-bold text-sm text-white flex items-center gap-2.5 transition-all shadow-md cursor-pointer ${
              loading || !text.trim()
                ? 'bg-slate-300 dark:bg-slate-800 text-slate-500 dark:text-slate-600 cursor-not-allowed shadow-none'
                : 'bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 active:scale-[0.99] shadow-indigo-500/20'
            }`}
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Sayqallanmoqda...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-amber-300" />
                <span>Matnni Mukammallashtirish (Smart Rewrite)</span>
              </>
            )}
          </button>
        </div>

        {/* Coach Educational Tips & Analysis Card */}
        {result && <CoachTipsCard result={result} />}
      </main>

      {/* Mobile Sticky Bottom CTA Bar (references/10_mobile_touch_apps.md) */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 p-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 z-30">
        <button
          onClick={handleRewrite}
          disabled={loading || !text.trim()}
          className={`w-full min-h-[48px] rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.98] ${
            loading || !text.trim()
              ? 'bg-slate-300 dark:bg-slate-800 text-slate-500 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/20'
          }`}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Sayqallanmoqda...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Matnni Mukammallashtirish</span>
            </>
          )}
        </button>
      </div>

      {/* Modals */}
      <SamplesModal
        isOpen={isSamplesOpen}
        onClose={() => setIsSamplesOpen(false)}
        onSelectSample={handleSelectSample}
      />

      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelectHistoryItem={handleSelectHistoryItem}
        onClearHistory={handleClearHistory}
      />

      {sentenceAdviceTarget && (
        <SentenceCoachModal
          sentence={sentenceAdviceTarget.sentence}
          contextText={sentenceAdviceTarget.context}
          isOpen={Boolean(sentenceAdviceTarget)}
          onClose={() => setSentenceAdviceTarget(null)}
          onApplySentence={handleApplySentenceReplacement}
        />
      )}
    </div>
  );
}
