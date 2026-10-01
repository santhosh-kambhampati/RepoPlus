import { all, fork } from 'redux-saga/effects';
import { repositoriesSaga } from './sagas/repositoriesSaga';

export function* rootSaga() {
  yield all([
    fork(repositoriesSaga),
  ]);
}
