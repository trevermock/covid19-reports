import { Action } from '../actions/action';
import { UserActions } from '../actions/userActions';

export interface UserState {
  count: number // REDUX TEST
}

export const userInitialState: UserState = {
  count: 0, // REDUX TEST
};

export function userReducer(state = userInitialState, action: Action) {
  switch (action.type) {
    case UserActions.IncrementCount.type:
      // REDUX TEST
      return {
        ...state,
        count: state.count + 1,
      };
    default:
      return state;
  }
}
