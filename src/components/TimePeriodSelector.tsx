import React from 'react';
import { TimePeriod } from '../types';
import { Calendar } from 'lucide-react';

interface TimePeriodSelectorProps {
  selectedPeriod: TimePeriod;
  onChange: (period: TimePeriod) => void;
  disabled?: boolean;
}

export const TimePeriodSelector: React.FC<TimePeriodSelectorProps> = ({
  selectedPeriod,
  onChange,
  disabled = false,
}) => {
  const options: { id: TimePeriod; label: string; subtext: string }[] = [
    { id: '1week', label: '1 Week', subtext: 'Past 7 days' },
    { id: '2weeks', label: '2 Weeks', subtext: 'Past 14 days' },
    { id: '1month', label: '1 Month', subtext: 'Past 30 days' },
  ];

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-1.5 sm:p-2 bg-slate-100/80 border border-slate-200/80 rounded-xl">
      <div className="flex items-center gap-2 px-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
        <Calendar className="w-3.5 h-3.5 text-slate-400" />
        <span>Created within</span>
      </div>

      <div
        role="group"
        aria-label="Filter repositories by creation date"
        className="grid grid-cols-3 sm:flex items-center gap-1 bg-white sm:bg-slate-200/60 p-1 rounded-lg border sm:border-0 border-slate-200"
      >
        {options.map((opt) => {
          const isActive = selectedPeriod === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => onChange(opt.id)}
              disabled={disabled}
              type="button"
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:outline-none ${
                isActive
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              aria-pressed={isActive}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
