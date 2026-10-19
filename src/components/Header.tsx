import React from 'react';
import { Feather, Moon, Sun, History, Sparkles, BookOpen } from 'lucide-react';

interface HeaderProps {
  darkMode: boolean;
  onToggleTheme: () => void;
  onOpenHistory: () => void;
  onOpenSamples: () => void;
  historyCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  darkMode,
  onToggleTheme,
  onOpenHistory,
  onOpenSamples,
  historyCount,
}) => {
  return (
    <header className="sticky top-0 z-30 w-full border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-amber-500 flex items-center justify-center text-white shadow-sm shadow-indigo-500/20">
            <Feather className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-white font-sans">
                Insho & Matn Tahrirchisi
              </span>
              <span className="hidden sm:inline-block text-[11px] font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded-md">
                AI Coach
              </span>
            </div>
            <p className="hidden md:block text-xs text-slate-500 dark:text-slate-400">
              Badiiy asarlar, hikoyalar va blog postlar ustozona tahriri
            </p>
          </div>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
          <button
            onClick={onOpenSamples}
            className="flex items-center gap-1.5 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-slate-400" />
            <span>Namunaviy matnlar</span>
          </button>
          <span className="text-slate-300 dark:text-slate-700" aria-hidden="true">·</span>
          <button
            onClick={onOpenHistory}
            className="flex items-center gap-1.5 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
          >
            <History className="w-4 h-4 text-slate-400" />
            <span>Tahrirlar tarixi ({historyCount})</span>
          </button>
          <span className="text-slate-300 dark:text-slate-700" aria-hidden="true">·</span>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Gemini 3.8 Flash Engine</span>
          </div>
        </nav>

        {/* Zone 3: Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onOpenSamples}
            className="lg:hidden min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Namunaviy matnlar"
            aria-label="Namunaviy matnlar"
          >
            <BookOpen className="w-5 h-5" />
          </button>

          <button
            onClick={onOpenHistory}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center relative rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Tahrirlar tarixi"
            aria-label="Tahrirlar tarixi"
          >
            <History className="w-5 h-5" />
            {historyCount > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-indigo-600" />
            )}
          </button>

          <button
            onClick={onToggleTheme}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={darkMode ? "Yorug' rejimga o'tish" : "Qorong'u rejimga o'tish"}
            aria-label="Mavzuni almashtirish"
          >
            {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
          </button>
        </div>
      </div>
    </header>
  );
};
