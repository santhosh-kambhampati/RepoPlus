import React from 'react';

export const RepoCardSkeleton: React.FC = () => {
  return (
    <div
      aria-hidden="true"
      className="bg-white border border-slate-200/80 rounded-xl p-4 sm:p-5 animate-pulse"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Left + Center */}
        <div className="flex items-start gap-3.5 sm:gap-4 flex-1">
          {/* Avatar Skeleton */}
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-slate-200 shrink-0" />

          {/* Texts Skeleton */}
          <div className="flex-1 space-y-2.5">
            {/* Title Bar */}
            <div className="flex items-center gap-2">
              <div className="h-4 sm:h-5 bg-slate-200 rounded w-48 max-w-full" />
              <div className="h-3.5 bg-slate-100 rounded w-16" />
            </div>

            {/* Description Lines */}
            <div className="space-y-1.5">
              <div className="h-3.5 bg-slate-100 rounded w-full" />
              <div className="h-3.5 bg-slate-100 rounded w-3/4" />
            </div>

            {/* Metadata Bar */}
            <div className="flex items-center gap-3 pt-1">
              <div className="h-3 bg-slate-200 rounded w-16" />
              <div className="h-3 bg-slate-100 rounded w-16" />
              <div className="h-3 bg-slate-100 rounded w-24" />
            </div>
          </div>
        </div>

        {/* Right Arrow Skeleton */}
        <div className="hidden sm:block shrink-0">
          <div className="w-8 h-8 rounded-lg bg-slate-100" />
        </div>
      </div>
    </div>
  );
};

export const RepoListSkeleton: React.FC<{ count?: number }> = ({ count = 5 }) => {
  return (
    <div className="space-y-3" role="status" aria-label="Loading repositories">
      {Array.from({ length: count }).map((_, index) => (
        <RepoCardSkeleton key={index} />
      ))}
    </div>
  );
};
