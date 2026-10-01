import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Repository, TimePeriod } from './types';
import {
  MOCK_REPOSITORIES,
  fetchMostStarredRepositories,
  FetchRepositoriesResponse,
} from './services/githubApi';
import { Header } from './components/Header';
import { TimePeriodSelector } from './components/TimePeriodSelector';
import { RepoCard } from './components/RepoCard';
import { RepoListSkeleton, RepoCardSkeleton } from './components/RepoCardSkeleton';
import { EmptyState } from './components/EmptyState';
import { ErrorState } from './components/ErrorState';
import { AnalyticsPage } from './components/AnalyticsPage';
import { DesignSpecModal } from './components/DesignSpecModal';
import { ArrowDown, ShieldCheck, GitBranch } from 'lucide-react';
import { useAppDispatch, useAppSelector } from './redux/hooks';
import {
  setSelectedPeriod,
  setSelectedRepository,
} from './redux/slices/repositoriesSlice';
import {
  selectSelectedPeriod,
  selectSelectedRepository,
} from './redux/selectors/repositoriesSelectors';

export default function App() {
  const dispatch = useAppDispatch();
  const period = useAppSelector(selectSelectedPeriod);
  const selectedRepo = useAppSelector(selectSelectedRepository);

  // Initialize synchronously with mock data so initial screen renders instantly without external network calls
  const [repositories, setRepositories] = useState<Repository[]>(() => MOCK_REPOSITORIES['1week']);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMockMode, setIsMockMode] = useState(true);
  const [isUsingFallback, setIsUsingFallback] = useState(false);

  // Design spec modal state
  const [isSpecModalOpen, setIsSpecModalOpen] = useState(false);

  // Infinite scroll trigger observer
  const observerTarget = useRef<HTMLDivElement>(null);

  // Period change handler: immediately updates synchronously from mock or triggers live fetch
  const handlePeriodChange = (newPeriod: TimePeriod) => {
    if (newPeriod === period) return;
    dispatch(setSelectedPeriod(newPeriod));
    setPage(1);

    if (isMockMode) {
      setRepositories(MOCK_REPOSITORIES[newPeriod] || []);
      setHasMore(true);
      setError(null);
    } else {
      setLoading(true);
      setError(null);
      fetchMostStarredRepositories(newPeriod, 1, 15, false)
        .then((res) => {
          setRepositories(res.items);
          setHasMore(res.hasMore);
          setIsUsingFallback(res.isMockFallback);
        })
        .catch((err) => {
          setError(err.message || 'Failed to load repositories');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  // Toggle between live GitHub API & offline verified dataset
  const handleToggleMock = () => {
    const nextMock = !isMockMode;
    setIsMockMode(nextMock);

    if (nextMock) {
      setRepositories(MOCK_REPOSITORIES[period] || []);
      setError(null);
      setLoading(false);
    } else {
      setLoading(true);
      setError(null);
      fetchMostStarredRepositories(period, 1, 15, false)
        .then((res) => {
          setRepositories(res.items);
          setHasMore(res.hasMore);
          setIsUsingFallback(res.isMockFallback);
        })
        .catch((err) => {
          setError(err.message || 'Failed to load repositories');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

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

  return (
    <div className="min-h-screen bg-slate-50/60 text-slate-900 flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* GitHub-style Header */}
      <Header
        onOpenDesignSpec={() => setIsSpecModalOpen(true)}
        onNavigateHome={() => dispatch(setSelectedRepository(null))}
        isMockMode={isMockMode || isUsingFallback}
        onToggleMockMode={handleToggleMock}
        currentView={selectedRepo ? 'analytics' : 'list'}
        selectedRepoName={selectedRepo?.full_name}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {selectedRepo ? (
          /* ================= ANALYTICS SCREEN ================= */
          <AnalyticsPage
            repository={selectedRepo}
            onBack={() => dispatch(setSelectedRepository(null))}
          />
        ) : (
          /* ================= MAIN REPOSITORY LISTING ================= */
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
                    GitHub unauthenticated public rate limit reached. Serving verified high-star repository dataset.
                  </span>
                </div>
                <button
                  onClick={() => handleToggleMock()}
                  className="font-semibold underline hover:text-amber-900 shrink-0 cursor-pointer"
                >
                  Switch to Verified
                </button>
              </div>
            )}

            {/* Content States */}
            {loading ? (
              /* LOADING STATE */
              <RepoListSkeleton count={6} />
            ) : error ? (
              /* ERROR STATE */
              <ErrorState
                errorMessage={error}
                onRetry={() => handleToggleMock()}
                onUseFallback={() => {
                  setIsMockMode(true);
                  setRepositories(MOCK_REPOSITORIES[period] || []);
                  setError(null);
                }}
              />
            ) : repositories.length === 0 ? (
              /* EMPTY STATE */
              <EmptyState
                currentPeriod={period}
                onResetPeriod={handlePeriodChange}
                onRetry={() => handlePeriodChange(period)}
              />
            ) : (
              /* POPULATED REPOSITORY LIST */
              <div className="space-y-3" role="feed" aria-label="Most starred repositories">
                {repositories.map((repo, index) => (
                  <RepoCard
                    key={`${repo.id}-${index}`}
                    repository={repo}
                    index={index}
                    onSelect={(selected) => dispatch(setSelectedRepository(selected))}
                  />
                ))}

                {/* INFINITE SCROLL LOADING INDICATOR AT BOTTOM */}
                {loadingMore && (
                  <div className="pt-2 space-y-3" aria-live="polite">
                    <RepoCardSkeleton />
                    <RepoCardSkeleton />
                  </div>
                )}

                {/* Observer Target for Infinite Scroll */}
                <div ref={observerTarget} className="h-4 w-full" aria-hidden="true" />

                {/* Manual Load More Button fallback for accessibility */}
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

      {/* Footer */}
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

      {/* Comprehensive Design Spec & Architecture Documentation Modal */}
      <DesignSpecModal
        isOpen={isSpecModalOpen}
        onClose={() => setIsSpecModalOpen(false)}
      />
    </div>
  );
}
