import React from 'react';
import { AlertTriangle, RotateCcw, ShieldCheck } from 'lucide-react';

interface ErrorStateProps {
  onRetry: () => void;
  onUseFallback: () => void;
  errorMessage?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  onRetry,
  onUseFallback,
  errorMessage,
}) => {
  return (
    <div className="bg-white border border-rose-200 rounded-2xl p-8 sm:p-12 text-center max-w-lg mx-auto my-8 shadow-xs">
      <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4 border border-rose-100">
        <AlertTriangle className="w-6 h-6" />
      </div>

      <h3 className="text-lg font-bold text-slate-900 tracking-tight">
        Unable to load repositories
      </h3>

      <p className="mt-2 text-sm text-slate-600 leading-relaxed">
        GitHub didn&apos;t return the requested data. This typically occurs when GitHub unauthenticated API rate limits are exhausted or connection was interrupted.
      </p>

      {errorMessage && (
        <div className="mt-3 inline-block px-3 py-1 bg-slate-50 border border-slate-200 rounded text-xs font-mono text-slate-500 max-w-full truncate">
          {errorMessage}
        </div>
      )}

      <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          onClick={onRetry}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer shadow-xs"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Try again</span>
        </button>

        <button
          onClick={onUseFallback}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Load Verified Dataset</span>
        </button>
      </div>
    </div>
  );
};
