import React from 'react';
import { X, BookOpen, ArrowRight } from 'lucide-react';
import { SAMPLES } from '../data/samples.ts';
import { WritingSample } from '../types.ts';

interface SamplesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSample: (sample: WritingSample) => void;
}

export const SamplesModal: React.FC<SamplesModalProps> = ({
  isOpen,
  onClose,
  onSelectSample,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Namunaviy Matnlar Kutubxonasi
            </h3>
          </div>
          <button
            onClick={onClose}
            className="min-h-[36px] min-w-[36px] flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List of Samples */}
        <div className="p-5 overflow-y-auto space-y-3">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Tahrirchining turli janrlardagi quvvatini sinab ko'rish uchun quyidagi tayyor qoralamalardan birini tanlang:
          </p>

          {SAMPLES.map((sample) => (
            <div
              key={sample.id}
              onClick={() => {
                onSelectSample(sample);
                onClose();
              }}
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-indigo-50/30 dark:hover:bg-indigo-950/20 cursor-pointer transition-all group"
            >
              <div className="flex items-center justify-between mb-1.5">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {sample.title}
                </h4>
                <div className="flex items-center gap-1 text-xs font-medium text-indigo-600 dark:text-indigo-400">
                  <span>Yuklash</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                💡 {sample.note}
              </p>

              <p className="font-serif text-xs text-slate-700 dark:text-slate-300 line-clamp-2 italic bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">
                "{sample.text}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
