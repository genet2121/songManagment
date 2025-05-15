
import { all, fork } from 'redux-saga/effects';
import { watchSongSagas } from './songsSaga';
import { watchLookupSagas } from './lookupSaga';

export function* rootSaga() {
  yield all([
    fork(watchSongSagas),
    fork(watchLookupSagas),
  ]);
}
