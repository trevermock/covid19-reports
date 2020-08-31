import { createStore, combineReducers } from 'redux';
import { devToolsEnhancer } from 'redux-devtools-extension/index';
import { UserState, userInitialState, userReducer } from './reducers/userReducer';

export interface AppState {
  user: UserState
}

export const initialState: AppState = {
  user: userInitialState,
};

export default createStore(
  combineReducers({
    user: userReducer,
  }),
  initialState,
  devToolsEnhancer({}),
);
