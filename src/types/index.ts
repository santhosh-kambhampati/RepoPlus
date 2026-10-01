export type TimePeriod = '1week' | '2weeks' | '1month';

export type MetricType = 'commits' | 'additions' | 'deletions';

export interface RepositoryOwner {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
}

export interface Repository {
  id: number;
  name: string;
  full_name: string;
  owner: RepositoryOwner;
  html_url: string;
  description: string | null;
  fork: boolean;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  stargazers_count: number;
  watchers_count: number;
  language: string | null;
  open_issues_count: number;
  forks_count: number;
  topics?: string[];
  default_branch?: string;
}

export interface WeeklyStat {
  week: number; // Unix timestamp in seconds (start of week)
  weekLabel: string; // e.g. "Mar 10, 2026"
  commits: number;
  additions: number;
  deletions: number;
}

export interface ContributorWeeklyStat {
  week: number;
  weekLabel: string;
  commits: number;
  additions: number;
  deletions: number;
}

export interface Contributor {
  author: {
    login: string;
    avatar_url: string;
    html_url: string;
  };
  total: number;
  weeks: ContributorWeeklyStat[];
  color: string;
  visible: boolean;
}

export interface RepoAnalyticsData {
  repository: Repository;
  totalWeekly: WeeklyStat[];
  contributors: Contributor[];
  summary: {
    totalCommits: number;
    totalAdditions: number;
    totalDeletions: number;
    activeContributorsCount: number;
  };
}
