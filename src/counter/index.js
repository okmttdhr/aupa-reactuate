import ft from 'tcomb-form-types';
import { t, Domain, createAction, createReducer } from 'reactuate';

const domain = new Domain('counter');
export default domain;

const state = t.struct({
  counter: ft.Number.Integer
}, 'State');

const incrementParameter = t.struct({ increment: ft.Number.Integer }, 'incrementParameter');
const incrementCounter = createAction(domain, 'incrementCounter', t.maybe(incrementParameter));

const initialState = state({ counter: 0 }, 'CounterState');

const reducer = createReducer(domain, initialState, incrementCounter, (_state, action) => {
  let increment = 1;
  if (incrementParameter.is(action.payload)) {
    increment = action.payload.increment;
  }
  return state.update(_state, { counter: { $set: _state.counter + increment } });
});
