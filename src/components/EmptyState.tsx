import React from 'react';
import { SearchX, RotateCcw } from 'lucide-react';
import { TimePeriod } from '../types';

interface EmptyStateProps {
  currentPeriod: TimePeriod;
  onResetPeriod: (period: TimePeriod) => void;
  onRetry: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  currentPeriod,
  onResetPeriod,
  onRetry,
}) => {
  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-8 sm:p-12 text-center max-w-lg mx-auto my-8">
      <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center mx-auto mb-4 border border-slate-200">
        <SearchX className="w-6 h-6" />
      </div>

      <h3 className="text-lg font-bold text-slate-900 tracking-tight">
        No repositories found
      </h3>

      <p className="mt-2 text-sm text-slate-600 leading-relaxed">
        No repositories match the selected time window. Try expanding your search timeframe or refreshing the list.
      </p>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        {currentPeriod !== '1month' && (
          <button
            onClick={() => onResetPeriod('1month')}
            className="px-4 py-2 text-xs font-semibold text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            Switch to Past 1 Month
          </button>
        )}
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer shadow-xs"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Refresh Results</span>
        </button>
      </div>
    </div>
  );
};
