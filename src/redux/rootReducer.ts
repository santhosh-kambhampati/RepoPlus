import { combineReducers } from '@reduxjs/toolkit';
import repositoriesReducer from './slices/repositoriesSlice';

export const rootReducer = combineReducers({
  repositories: repositoriesReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
