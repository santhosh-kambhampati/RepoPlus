import React, { useState, useEffect } from 'react';
import { Repository, MetricType, RepoAnalyticsData } from '../types';
import { generate52WeeksActivity } from '../services/githubApi';
import { TotalChangesChart } from './TotalChangesChart';
import { ContributorChangesChart } from './ContributorChangesChart';
import { formatCompactNumber, formatCommaNumber, formatRelativeTime } from '../utils/formatters';
import {
  ArrowLeft,
  ExternalLink,
  Star,
  GitFork,
  AlertCircle,
  Clock,
  Code,
  Layers,
  BarChart3,
  Calendar,
  GitCommit,
  PlusCircle,
  MinusCircle,
  ChevronDown,
} from 'lucide-react';

interface AnalyticsPageProps {
  repository: Repository;
  onBack: () => void;
}

export const AnalyticsPage: React.FC<AnalyticsPageProps> = ({ repository, onBack }) => {
  const [metric, setMetric] = useState<MetricType>('commits');
  const [data, setData] = useState<RepoAnalyticsData>(() => {
    const { totalWeekly, contributors } = generate52WeeksActivity(repository);
    return {
      repository,
      totalWeekly,
      contributors,
      summary: {
        totalCommits: totalWeekly.reduce((sum, w) => sum + w.commits, 0),
        totalAdditions: totalWeekly.reduce((sum, w) => sum + w.additions, 0),
        totalDeletions: totalWeekly.reduce((sum, w) => sum + w.deletions, 0),
        activeContributorsCount: contributors.length,
      },
    };
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const { totalWeekly, contributors } = generate52WeeksActivity(repository);
    setData({
      repository,
      totalWeekly,
      contributors,
      summary: {
        totalCommits: totalWeekly.reduce((sum, w) => sum + w.commits, 0),
        totalAdditions: totalWeekly.reduce((sum, w) => sum + w.additions, 0),
        totalDeletions: totalWeekly.reduce((sum, w) => sum + w.deletions, 0),
        activeContributorsCount: contributors.length,
      },
    });
    setLoading(false);
    setError(null);
  }, [repository]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      {/* Top Section: Back Navigation */}
      <div>
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200/90 rounded-lg px-3.5 py-2 transition-colors cursor-pointer shadow-2xs focus-visible:ring-2 focus-visible:ring-blue-600"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to repositories</span>
        </button>
      </div>

      {/* Repository Identity Card */}
      <section className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-7 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="flex items-start gap-4">
            <img
              src={repository.owner.avatar_url}
              alt={repository.owner.login}
              referrerPolicy="no-referrer"
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover border border-slate-200/90 bg-slate-50 shrink-0"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  {repository.full_name}
                </h1>
                {repository.language && (
                  <span className="text-xs font-mono font-medium text-slate-600 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md">
                    {repository.language}
                  </span>
                )}
              </div>

              <p className="mt-2 text-sm text-slate-600 max-w-3xl leading-relaxed">
                {repository.description || 'No description provided for this repository.'}
              </p>

              {/* GitHub Identity Metadata */}
              <div className="mt-4 flex items-center flex-wrap gap-x-4 gap-y-2 text-xs font-medium text-slate-500">
                <div className="flex items-center gap-1.5 text-slate-800 font-semibold">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <span className="tabular-nums font-mono">
                    {formatCompactNumber(repository.stargazers_count)}
                  </span>
                  <span className="font-normal text-slate-500">stars</span>
                </div>

                <span aria-hidden="true" className="text-slate-300">·</span>

                <div className="flex items-center gap-1.5 text-slate-600">
                  <GitFork className="w-3.5 h-3.5 text-slate-400" />
                  <span className="tabular-nums font-mono">
                    {formatCompactNumber(repository.forks_count)}
                  </span>
                  <span className="font-normal text-slate-500">forks</span>
                </div>

                <span aria-hidden="true" className="text-slate-300">·</span>

                <div className="flex items-center gap-1.5 text-slate-600">
                  <AlertCircle className="w-3.5 h-3.5 text-slate-400" />
                  <span className="tabular-nums font-mono">
                    {formatCompactNumber(repository.open_issues_count)}
                  </span>
                  <span className="font-normal text-slate-500">open issues</span>
                </div>

                <span aria-hidden="true" className="text-slate-300">·</span>

                <div className="flex items-center gap-1.5 text-slate-600">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Pushed {formatRelativeTime(repository.pushed_at)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* External GitHub Link */}
          <div className="shrink-0 flex items-center gap-2">
            <a
              href={repository.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-2xs focus-visible:ring-2 focus-visible:ring-blue-600"
            >
              <span>View on GitHub</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </a>
          </div>
        </div>
      </section>

      {/* Repository Activity Section Header & Metric Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            Repository Activity
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Weekly development activity over the last year
          </p>
        </div>

        {/* Metric Selector Dropdown / Segmented control */}
        <div className="flex items-center gap-2 self-start sm:self-auto bg-white p-1 rounded-xl border border-slate-200/90 shadow-2xs">
          <label htmlFor="metric-select" className="sr-only">
            Select Metric
          </label>
          <div className="relative inline-block text-left">
            <select
              id="metric-select"
              value={metric}
              onChange={(e) => setMetric(e.target.value as MetricType)}
              className="appearance-none bg-slate-50 hover:bg-slate-100 text-slate-900 font-semibold text-xs py-2 pl-3.5 pr-8 rounded-lg border border-slate-200 focus-visible:ring-2 focus-visible:ring-blue-600 cursor-pointer"
            >
              <option value="commits">Commits</option>
              <option value="additions">Additions</option>
              <option value="deletions">Deletions</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500 pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2" />
          </div>

          {/* Quick Segmented Buttons on larger viewports */}
          <div className="hidden md:flex items-center gap-1 border-l border-slate-200 pl-2">
            <button
              type="button"
              onClick={() => setMetric('commits')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                metric === 'commits'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <GitCommit className="w-3.5 h-3.5" />
              <span>Commits</span>
            </button>

            <button
              type="button"
              onClick={() => setMetric('additions')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                metric === 'additions'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Additions</span>
            </button>

            <button
              type="button"
              onClick={() => setMetric('deletions')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                metric === 'deletions'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <MinusCircle className="w-3.5 h-3.5" />
              <span>Deletions</span>
            </button>
          </div>
        </div>
      </div>

      {/* Chart Content Area */}
      {loading ? (
        <div className="space-y-6 animate-pulse" role="status" aria-label="Loading charts">
          <div className="bg-white border border-slate-200 rounded-2xl h-80 p-6 flex flex-col justify-between">
            <div className="h-5 bg-slate-200 rounded w-48" />
            <div className="h-44 bg-slate-100 rounded w-full" />
            <div className="h-4 bg-slate-100 rounded w-32" />
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl h-96 p-6 flex flex-col justify-between">
            <div className="h-5 bg-slate-200 rounded w-48" />
            <div className="h-56 bg-slate-100 rounded w-full" />
            <div className="h-4 bg-slate-100 rounded w-32" />
          </div>
        </div>
      ) : error || !data ? (
        <div className="bg-white border border-rose-200 rounded-2xl p-8 text-center">
          <AlertCircle className="w-8 h-8 text-rose-500 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900">Failed to load analytics</h3>
          <p className="text-xs text-slate-500 mt-1">{error || 'Unknown error occurred'}</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Stacked Chart 1: Total Changes */}
          <TotalChangesChart weeklyData={data.totalWeekly} metric={metric} />

          {/* Stacked Chart 2: Contributor Changes */}
          <ContributorChangesChart contributors={data.contributors} metric={metric} />
        </div>
      )}
    </div>
  );
};
