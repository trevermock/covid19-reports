import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { UserState, userInitialState, userReducer } from './reducers/userReducer';

export interface AppState {
  user: UserState
}

export const initialState: AppState = {
  user: userInitialState,
};

// React Devtools Extension
const composeEnhancers =
  typeof window === 'object' &&
  (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
    (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
      // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
    }) : compose;

export default createStore(
  combineReducers({
    user: userReducer,
  }),
  initialState,
  composeEnhancers(
    applyMiddleware(
      thunk,
    ),
  ),
);
