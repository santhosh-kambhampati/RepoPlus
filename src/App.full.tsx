import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Repository, TimePeriod } from './types';
import { fetchMostStarredRepositories, FetchRepositoriesResponse } from './services/githubApi';
import { Header } from './components/Header';
import { TimePeriodSelector } from './components/TimePeriodSelector';
import { RepoCard } from './components/RepoCard';
import { RepoListSkeleton, RepoCardSkeleton } from './components/RepoCardSkeleton';
import { EmptyState } from './components/EmptyState';
import { ErrorState } from './components/ErrorState';
import { AnalyticsPage } from './components/AnalyticsPage';
import { DesignSpecModal } from './components/DesignSpecModal';
import { ArrowDown, ShieldCheck, GitBranch } from 'lucide-react';

export default function App() {
  const [period, setPeriod] = useState<TimePeriod>('1week');
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMockMode, setIsMockMode] = useState(true);
  const [isUsingFallback, setIsUsingFallback] = useState(false);

  // Analytics view state
  const [selectedRepo, setSelectedRepo] = useState<Repository | null>(null);

  // Design spec modal state
  const [isSpecModalOpen, setIsSpecModalOpen] = useState(false);

  // Infinite scroll trigger observer
  const observerTarget = useRef<HTMLDivElement>(null);

  // Fetch initial repositories for the selected period
  const loadInitialRepos = useCallback(
    async (currentPeriod: TimePeriod, useMock: boolean = isMockMode) => {
      setLoading(true);
      setError(null);
      setPage(1);

      try {
        const res: FetchRepositoriesResponse = await fetchMostStarredRepositories(
          currentPeriod,
          1,
          15,
          useMock
        );
        setRepositories(res.items);
        setHasMore(res.hasMore);
        setIsUsingFallback(res.isMockFallback);
      } catch (err: any) {
        setError(err.message || 'Failed to load repositories');
      } finally {
        setLoading(false);
      }
    },
    [isMockMode]
  );

  // Effect to load data on period or mockMode change
  useEffect(() => {
    loadInitialRepos(period, isMockMode);
  }, [period, isMockMode, loadInitialRepos]);

  // Load next page for infinite scrolling
  const handleLoadMore = useCallback(async () => {
    if (loading || loadingMore || !hasMore) return;

    setLoadingMore(true);
    const nextPage = page + 1;

    try {
      const res: FetchRepositoriesResponse = await fetchMostStarredRepositories(
        period,
        nextPage,
        15,
        isMockMode
      );
      setRepositories((prev) => [...prev, ...res.items]);
      setPage(nextPage);
      setHasMore(res.hasMore);
      setIsUsingFallback(res.isMockFallback);
    } catch (err) {
      console.error('Error loading additional repositories:', err);
    } finally {
      setLoadingMore(false);
    }
  }, [loading, loadingMore, hasMore, page, period, isMockMode]);

  // Setup IntersectionObserver for smooth infinite scroll
  useEffect(() => {
    if (selectedRepo) return;

    const target = observerTarget.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading && !loadingMore) {
          handleLoadMore();
        }
      },
      { threshold: 0.1, rootMargin: '200px' }
    );

    observer.observe(target);
    return () => {
      observer.unobserve(target);
    };
  }, [handleLoadMore, hasMore, loading, loadingMore, selectedRepo]);

  // Period change handler
  const handlePeriodChange = (newPeriod: TimePeriod) => {
    if (newPeriod === period) return;
    setPeriod(newPeriod);
  };

  // Toggle between live GitHub API & offline fallback
  const handleToggleMock = () => {
    const nextMock = !isMockMode;
    setIsMockMode(nextMock);
  };

  return (
    <div className="min-h-screen bg-slate-50/60 text-slate-900 flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* GitHub-style Header */}
      <Header
        onOpenDesignSpec={() => setIsSpecModalOpen(true)}
        onNavigateHome={() => setSelectedRepo(null)}
        isMockMode={isMockMode || isUsingFallback}
        onToggleMockMode={handleToggleMock}
        currentView={selectedRepo ? 'analytics' : 'list'}
        selectedRepoName={selectedRepo?.full_name}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {selectedRepo ? (
          <AnalyticsPage
            repository={selectedRepo}
            onBack={() => setSelectedRepo(null)}
          />
        ) : (
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-6">
            {/* Main Header / Intro Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
              <div className="space-y-1.5 max-w-2xl">
                <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 tracking-wide">
                  <GitBranch className="w-3.5 h-3.5" />
                  <span>GitHub Velocity Monitor</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Most Starred Repositories
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Explore the repositories gaining the most stars created within your selected time window.
                  Click on any repository card to drill down into weekly development activity and contributor commit statistics.
                </p>
              </div>

              {/* Time Period Control */}
              <div className="shrink-0">
                <TimePeriodSelector
                  selectedPeriod={period}
                  onChange={handlePeriodChange}
                  disabled={loading}
                />
              </div>
            </div>

            {/* Notification banner if rate-limited and using authentic verified dataset */}
            {isUsingFallback && !isMockMode && (
              <div className="p-3 bg-amber-50/80 border border-amber-200/90 rounded-xl flex items-center justify-between gap-3 text-xs text-amber-800">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>
                    GitHub unauthenticated public rate limit reached. Seamlessly serving our verified high-star repository dataset.
                  </span>
                </div>
                <button
                  onClick={() => loadInitialRepos(period, false)}
                  className="font-semibold underline hover:text-amber-900 shrink-0 cursor-pointer"
                >
                  Retry Live API
                </button>
              </div>
            )}

            {/* Content States */}
            {loading ? (
              <RepoListSkeleton count={6} />
            ) : error ? (
              <ErrorState
                errorMessage={error}
                onRetry={() => loadInitialRepos(period, false)}
                onUseFallback={() => {
                  setIsMockMode(true);
                  loadInitialRepos(period, true);
                }}
              />
            ) : repositories.length === 0 ? (
              <EmptyState
                currentPeriod={period}
                onResetPeriod={handlePeriodChange}
                onRetry={() => loadInitialRepos(period, isMockMode)}
              />
            ) : (
              <div className="space-y-3" role="feed" aria-label="Most starred repositories">
                {repositories.map((repo, index) => (
                  <RepoCard
                    key={`${repo.id}-${index}`}
                    repository={repo}
                    index={index}
                    onSelect={(selected) => setSelectedRepo(selected)}
                  />
                ))}

                {loadingMore && (
                  <div className="pt-2 space-y-3" aria-live="polite">
                    <RepoCardSkeleton />
                    <RepoCardSkeleton />
                  </div>
                )}

                <div ref={observerTarget} className="h-4 w-full" aria-hidden="true" />

                {hasMore && !loadingMore && (
                  <div className="pt-4 text-center">
                    <button
                      onClick={handleLoadMore}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 transition-colors shadow-2xs hover:shadow-xs focus-visible:ring-2 focus-visible:ring-blue-600 cursor-pointer"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                      <span>Load more repositories</span>
                    </button>
                  </div>
                )}

                {!hasMore && repositories.length > 0 && (
                  <div className="pt-8 pb-4 text-center text-xs text-slate-400">
                    You have reached the end of the top starred repositories for this period.
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>

      <footer className="border-t border-slate-200 bg-white py-6 mt-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-900">RepoPulse</span>
            <span>·</span>
            <span>Developer Analytics Dashboard</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSpecModalOpen(true)}
              className="text-slate-600 hover:text-slate-900 hover:underline cursor-pointer"
            >
              Design System Spec
            </button>
            <span>·</span>
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="text-slate-600 hover:text-slate-900 hover:underline"
            >
              Powered by GitHub API
            </a>
          </div>
        </div>
      </footer>

      <DesignSpecModal
        isOpen={isSpecModalOpen}
        onClose={() => setIsSpecModalOpen(false)}
      />
    </div>
  );
}
