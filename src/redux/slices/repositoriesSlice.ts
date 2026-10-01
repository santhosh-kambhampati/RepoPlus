import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Repository, TimePeriod } from '../../types';

export interface RepositoriesState {
  repositories: Repository[];
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
  selectedPeriod: TimePeriod;
  currentPage: number;
  hasMore: boolean;
  selectedRepository: Repository | null;
}

const initialState: RepositoriesState = {
  repositories: [],
  loading: false,
  loadingMore: false,
  error: null,
  selectedPeriod: '1week',
  currentPage: 1,
  hasMore: true,
  selectedRepository: null,
};

export const repositoriesSlice = createSlice({
  name: 'repositories',
  initialState,
  reducers: {
    setSelectedPeriod: (state, action: PayloadAction<TimePeriod>) => {
      state.selectedPeriod = action.payload;
      state.currentPage = 1;
      state.hasMore = true;
      state.error = null;
    },
    setSelectedRepository: (state, action: PayloadAction<Repository | null>) => {
      state.selectedRepository = action.payload;
    },
    fetchRepositoriesStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchRepositoriesSuccess: (
      state,
      action: PayloadAction<{ repositories: Repository[]; hasMore: boolean }>
    ) => {
      state.loading = false;
      state.repositories = action.payload.repositories;
      state.hasMore = action.payload.hasMore;
      state.error = null;
    },
    fetchRepositoriesFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    loadMoreRepositoriesStart: (state) => {
      state.loadingMore = true;
    },
    loadMoreRepositoriesSuccess: (
      state,
      action: PayloadAction<{ repositories: Repository[]; hasMore: boolean; page: number }>
    ) => {
      state.loadingMore = false;
      state.repositories.push(...action.payload.repositories);
      state.currentPage = action.payload.page;
      state.hasMore = action.payload.hasMore;
    },
    loadMoreRepositoriesFailure: (state, action: PayloadAction<string>) => {
      state.loadingMore = false;
      state.error = action.payload;
    },
    setRepositories: (state, action: PayloadAction<Repository[]>) => {
      state.repositories = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setSelectedPeriod,
  setSelectedRepository,
  fetchRepositoriesStart,
  fetchRepositoriesSuccess,
  fetchRepositoriesFailure,
  loadMoreRepositoriesStart,
  loadMoreRepositoriesSuccess,
  loadMoreRepositoriesFailure,
  setRepositories,
  clearError,
} = repositoriesSlice.actions;

export default repositoriesSlice.reducer;
