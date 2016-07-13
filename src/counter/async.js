import ft from 'tcomb-form-types';
import {
  t,
  Domain,
  createSaga,
  createAction,
  fork,
  take,
  put
} from 'reactuate';

import domain from './index';

const asyncDomain = new Domain('counterAsync');

const incrementParameter = t.struct({ increment: ft.Number.Integer }, 'incrementParameter');
const incrementCounterDelayed = createAction(
  asyncDomain, 'incrementCounterDelayed', t.maybe(incrementParameter)
);

function delay(millis) {
  return new Promise(resolve => setTimeout(() => resolve(true), millis));
}

createSaga(asyncDomain, 'incrementCounterDelayed', function* () {
  while (true) {
    const nextAction = yield take(incrementCounterDelayed.is);
    yield fork(function* () {
      yield delay(1000);
      yield put(domain.actions.incrementCounter(nextAction.payload));
    });
  }
});

export default asyncDomain;
