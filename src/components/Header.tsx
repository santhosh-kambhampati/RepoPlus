import React from 'react';
import { GitBranch, Layers, Sparkles, BookOpen } from 'lucide-react';

interface HeaderProps {
  onOpenDesignSpec: () => void;
  onNavigateHome: () => void;
  isMockMode: boolean;
  onToggleMockMode: () => void;
  currentView: 'list' | 'analytics';
  selectedRepoName?: string;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenDesignSpec,
  onNavigateHome,
  isMockMode,
  onToggleMockMode,
  currentView,
  selectedRepoName,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Single element brand wordmark */}
        <div className="flex items-center gap-3">
          <button
            onClick={onNavigateHome}
            className="flex items-center gap-2.5 text-left group focus-visible:ring-2 focus-visible:ring-blue-600 rounded-lg p-1 -m-1 transition-colors"
            title="Go to home repository listing"
          >
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-sm tracking-tight group-hover:bg-blue-600 transition-colors">
              <GitBranch className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="text-base font-bold tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
                RepoPulse
              </span>
            </div>
          </button>

          {currentView === 'analytics' && selectedRepoName && (
            <div className="hidden sm:flex items-center gap-2 text-sm text-slate-400">
              <span>/</span>
              <span className="font-mono text-xs text-slate-700 font-medium truncate max-w-xs">
                {selectedRepoName}
              </span>
            </div>
          )}
        </div>

        {/* Zone 2: Clean text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <button
            onClick={onNavigateHome}
            className={`transition-colors hover:text-slate-900 cursor-pointer ${
              currentView === 'list' ? 'text-slate-900 font-semibold' : ''
            }`}
          >
            Discover
          </button>
          <button
            onClick={onOpenDesignSpec}
            className="transition-colors hover:text-slate-900 flex items-center gap-1.5 cursor-pointer"
          >
            <Layers className="w-4 h-4 text-slate-500" />
            <span>Design Specs</span>
          </button>
          <a
            href="https://docs.github.com/en/rest"
            target="_blank"
            rel="noreferrer"
            className="transition-colors hover:text-slate-900 text-slate-500 hover:underline"
          >
            GitHub API Docs
          </a>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onToggleMockMode}
            className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 transition-colors"
            title="Switch between live GitHub search API and verified offline dataset"
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isMockMode ? 'bg-amber-500' : 'bg-emerald-500'
              }`}
            />
            <span>{isMockMode ? 'Verified Dataset' : 'Live GitHub API'}</span>
          </button>

          <button
            onClick={onOpenDesignSpec}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors shadow-xs focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-900 cursor-pointer whitespace-nowrap"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Design System & Architecture</span>
          </button>
        </div>
      </div>
    </header>
  );
};
