import React, { useState } from 'react';
import { Repository } from '../types';
import { formatCompactNumber, formatRelativeTime } from '../utils/formatters';
import { Star, AlertCircle, ArrowRight, Clock, User } from 'lucide-react';

interface RepoCardProps {
  repository: Repository;
  onSelect: (repository: Repository) => void;
  index: number;
}

export const RepoCard: React.FC<RepoCardProps> = ({ repository, onSelect, index }) => {
  const [avatarError, setAvatarError] = useState(false);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect(repository);
    }
  };

  // Get owner initials for fallback
  const ownerInitials = repository.owner.login.slice(0, 2).toUpperCase();

  return (
    <article
      tabIndex={0}
      role="button"
      aria-label={`View analytics for ${repository.full_name}, ${formatCompactNumber(repository.stargazers_count)} stars`}
      onClick={() => onSelect(repository)}
      onKeyDown={handleKeyDown}
      className="group relative bg-white border border-slate-200/90 rounded-xl p-4 sm:p-5 transition-all duration-150 hover:border-slate-300 hover:shadow-sm hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:border-blue-600 cursor-pointer"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Main Left + Center Section */}
        <div className="flex items-start gap-3.5 sm:gap-4 flex-1 min-w-0">
          {/* LEFT: Owner Avatar with fallback container */}
          <div className="relative shrink-0 mt-0.5">
            {!avatarError ? (
              <img
                src={repository.owner.avatar_url}
                alt={`${repository.owner.login} avatar`}
                referrerPolicy="no-referrer"
                onError={() => setAvatarError(true)}
                className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl object-cover border border-slate-200/80 bg-slate-50"
              />
            ) : (
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl border border-slate-200/80 bg-slate-100 flex items-center justify-center font-mono text-xs font-semibold text-slate-700">
                {ownerInitials}
              </div>
            )}
            {/* Rank index subtle badge */}
            <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-slate-900 text-white text-[10px] font-mono font-medium rounded-full flex items-center justify-center ring-2 ring-white">
              {index + 1}
            </span>
          </div>

          {/* CENTER: Name, Description, Metadata */}
          <div className="flex-1 min-w-0">
            {/* Repository Name - Strongest Text */}
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight group-hover:text-blue-600 transition-colors truncate">
                {repository.full_name}
              </h2>
              {repository.language && (
                <span className="text-xs font-mono text-slate-500 font-medium bg-slate-100 px-1.5 py-0.5 rounded">
                  {repository.language}
                </span>
              )}
            </div>

            {/* Repository Description - Secondary */}
            <p className="mt-1 text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed">
              {repository.description || 'No description provided by repository maintainers.'}
            </p>

            {/* Metadata Line - Unboxed text with subtle typographic separators */}
            <div className="mt-2.5 flex items-center flex-wrap gap-x-3 gap-y-1 text-xs text-slate-500 font-medium">
              {/* Stars */}
              <div className="flex items-center gap-1 text-slate-800 font-semibold">
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span className="tabular-nums font-mono">
                  {formatCompactNumber(repository.stargazers_count)}
                </span>
                <span className="font-normal text-slate-500 ml-0.5">stars</span>
              </div>

              <span aria-hidden="true" className="text-slate-300">·</span>

              {/* Issues */}
              <div className="flex items-center gap-1 text-slate-600">
                <AlertCircle className="w-3.5 h-3.5 text-slate-400" />
                <span className="tabular-nums font-mono">
                  {formatCompactNumber(repository.open_issues_count)}
                </span>
                <span className="font-normal text-slate-500 ml-0.5">issues</span>
              </div>

              <span aria-hidden="true" className="text-slate-300">·</span>

              {/* Last Pushed */}
              <div className="flex items-center gap-1 text-slate-600">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>Updated {formatRelativeTime(repository.pushed_at)}</span>
              </div>

              <span aria-hidden="true" className="text-slate-300 hidden sm:inline">·</span>

              {/* Owner */}
              <div className="hidden sm:flex items-center gap-1 text-slate-500">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span className="truncate max-w-[120px]">{repository.owner.login}</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: Chevron / Arrow Affordance */}
        <div className="flex items-center justify-between sm:justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 sm:shrink-0">
          <div className="sm:hidden flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <span>By {repository.owner.login}</span>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 group-hover:text-blue-600 transition-colors">
            <span className="hidden lg:inline text-slate-400 group-hover:text-blue-500">
              View Analytics
            </span>
            <div className="w-8 h-8 rounded-lg bg-slate-50 group-hover:bg-blue-50 flex items-center justify-center border border-slate-200/60 group-hover:border-blue-200 transition-colors">
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};
