import React from 'react';
import { RewriteResult } from '../types.ts';
import { HeartHandshake, Lightbulb, Compass, CheckCircle2 } from 'lucide-react';

interface CoachTipsCardProps {
  result: RewriteResult;
}

export const CoachTipsCard: React.FC<CoachTipsCardProps> = ({ result }) => {
  return (
    <div className="w-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs transition-colors space-y-6">
      {/* Coach Greeting & Summary */}
      <div className="flex items-start gap-3.5">
        <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 flex items-center justify-center shrink-0">
          <HeartHandshake className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Yozuv Murabbiyi Xulosasi
            </h3>
            <span className="text-slate-300 dark:text-slate-700" aria-hidden="true">·</span>
            <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">
              Do'stona tahlil
            </span>
          </div>
          <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            {result.coachSummary}
          </p>
        </div>
      </div>

      {/* Key Improvements Breakdown */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Compass className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <h4 className="text-xs font-bold tracking-wider uppercase text-slate-700 dark:text-slate-300">
            Qanday uslubiy o'zgarishlar kiritildi va nima uchun?
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {result.keyChanges.map((change, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-700 dark:text-indigo-300 mb-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500" />
                  <span>{change.aspect}</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-2">
                  {change.explanation}
                </p>
              </div>
              <div className="text-[11px] font-medium text-emerald-700 dark:text-emerald-400 pt-2 border-t border-slate-200/50 dark:border-slate-700/50">
                Olingan natija: {change.benefit}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Future Tip */}
      <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/40 text-amber-950 dark:text-amber-200">
        <Lightbulb className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="text-xs leading-relaxed">
          <strong className="block font-semibold mb-0.5 text-amber-900 dark:text-amber-300">
            Murabbiyning Oltin Qoidasi:
          </strong>
          {result.coachTip}
        </div>
      </div>
    </div>
  );
};
