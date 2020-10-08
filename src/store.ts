import {
  createStore, combineReducers, applyMiddleware, compose,
} from 'redux';
import thunk from 'redux-thunk';
import { appFrameInitialState, appFrameReducer, AppFrameState } from './reducers/app-frame.reducer';
import { UserState, userInitialState, userReducer } from './reducers/user.reducer';
import { RoleState, roleInitialState, roleReducer } from './reducers/role.reducer';

export interface AppState {
  user: UserState
  role: RoleState
  appFrame: AppFrameState
}

export const initialState: AppState = {
  user: userInitialState,
  role: roleInitialState,
  appFrame: appFrameInitialState,
};

// React Devtools Extension
const composeEnhancers = typeof window === 'object' && (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
  ? (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
    // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
  })
  : compose;

export default createStore(
  combineReducers({
    user: userReducer,
    role: roleReducer,
    appFrame: appFrameReducer,
  }),
  initialState,
  composeEnhancers(
    applyMiddleware(
      thunk,
    ),
  ),
);
