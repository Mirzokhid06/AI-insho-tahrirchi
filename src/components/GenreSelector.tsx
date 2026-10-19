import React, { useState } from 'react';
import { GENRES } from '../data/samples.ts';
import { GenreId } from '../types.ts';
import { Sliders, Thermometer, Info, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';

interface GenreSelectorProps {
  selectedGenre: GenreId;
  onSelectGenre: (genre: GenreId) => void;
  temperature: number;
  onChangeTemperature: (temp: number) => void;
  customTone: string;
  onChangeCustomTone: (tone: string) => void;
  disabled?: boolean;
}

export const GenreSelector: React.FC<GenreSelectorProps> = ({
  selectedGenre,
  onSelectGenre,
  temperature,
  onChangeTemperature,
  customTone,
  onChangeCustomTone,
  disabled = false,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const activeGenreObj = GENRES.find((g) => g.id === selectedGenre) || GENRES[0];

  return (
    <div className="w-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 shadow-xs transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
        <div>
          <span className="text-xs font-semibold tracking-wider uppercase text-indigo-600 dark:text-indigo-400">
            Janr & Intellektual Rejim
          </span>
          <h2 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
            Qanday matn ustida ishlayapmiz?
          </h2>
        </div>

        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="self-start sm:self-auto min-h-[38px] px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <Sliders className="w-3.5 h-3.5 text-indigo-500" />
          <span>Harorat & Ohang: <strong className="font-mono tabular-nums">{temperature.toFixed(2)}</strong></span>
          {showAdvanced ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Genre Segmented Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {GENRES.map((genre) => {
          const isActive = genre.id === selectedGenre;
          return (
            <button
              key={genre.id}
              disabled={disabled}
              onClick={() => {
                onSelectGenre(genre.id);
                onChangeTemperature(genre.defaultTemp);
              }}
              className={`min-h-[48px] p-3 text-left rounded-xl transition-all cursor-pointer border ${
                isActive
                  ? 'bg-indigo-50/80 dark:bg-indigo-950/40 border-indigo-500 text-indigo-950 dark:text-indigo-200 shadow-xs ring-1 ring-indigo-500/30'
                  : 'bg-slate-50/50 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-xs sm:text-sm tracking-tight">
                  {genre.label}
                </span>
                <span className="text-[10px] font-mono font-medium text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-900 px-1.5 py-0.5 rounded border border-indigo-200/60 dark:border-indigo-800/60">
                  {genre.badge}
                </span>
              </div>
              <p className="text-[11px] leading-snug text-slate-500 dark:text-slate-400 line-clamp-1">
                {genre.tagline}
              </p>
            </button>
          );
        })}
      </div>

      {/* Active hint text */}
      <div className="mt-3 flex items-start gap-2 text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-950/60 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800/80">
        <Info className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
        <span>
          <strong>Murabbiy yondashuvi:</strong> {activeGenreObj.hint}
        </span>
      </div>

      {/* Advanced Drawer: Temperature slider & Custom tone */}
      {showAdvanced && (
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4 animate-in fade-in duration-150">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Thermometer className="w-4 h-4 text-amber-500" />
                  Gemini Harorati (Temperature)
                </span>
                <span className="font-mono font-bold text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                  {temperature.toFixed(2)}
                </span>
              </div>
              <input
                type="range"
                min="0.2"
                max="1.0"
                step="0.05"
                value={temperature}
                disabled={disabled}
                onChange={(e) => onChangeTemperature(parseFloat(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>0.20 (Qat'iy mantiq)</span>
                <span>0.60 (Muvozanat)</span>
                <span>1.00 (Yuqori ijodkorlik)</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Qo'shimcha ohang yoki kayfiyat (ixtiyoriy)
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={customTone}
                  disabled={disabled}
                  onChange={(e) => onChangeCustomTone(e.target.value)}
                  placeholder="Masalan: lirik, kinoyali, ilhomlantiruvchi, sokin..."
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                {customTone && (
                  <button
                    onClick={() => onChangeCustomTone('')}
                    className="absolute right-2 top-2 text-slate-400 hover:text-slate-600 text-xs px-1"
                  >
                    ×
                  </button>
                )}
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                Matnga qanday ruhiy kayfiyat singdirishni xohlasangiz yozing.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
