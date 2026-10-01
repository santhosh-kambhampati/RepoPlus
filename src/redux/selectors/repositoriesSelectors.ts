import { RootState } from '../store';

export const selectRepositoriesState = (state: RootState) => state.repositories;
export const selectRepositories = (state: RootState) => state.repositories.repositories;
export const selectSelectedPeriod = (state: RootState) => state.repositories.selectedPeriod;
export const selectSelectedRepository = (state: RootState) => state.repositories.selectedRepository;
export const selectRepositoriesLoading = (state: RootState) => state.repositories.loading;
export const selectRepositoriesLoadingMore = (state: RootState) => state.repositories.loadingMore;
export const selectRepositoriesError = (state: RootState) => state.repositories.error;
export const selectRepositoriesHasMore = (state: RootState) => state.repositories.hasMore;
export const selectCurrentPage = (state: RootState) => state.repositories.currentPage;
