import { User } from '../actions/userActions';

export enum HomeView {
  Basic = 'basic',
  Leadership = 'leadership',
  Medical = 'medical'
}

export interface UserState {
  isLoggedIn: boolean
  role?: string
  homeView: HomeView
}

export const userInitialState: UserState = {
  isLoggedIn: false,
  role: undefined,
  homeView: HomeView.Basic,
};

// TODO: Get action working properly.

export function userReducer(state = userInitialState, action: any) {
  switch (action.type) {
    case User.Actions.Login.type: {
      const payload = (action as User.Actions.Login).payload;
      return {
        ...state,
        isLoggedIn: true,
        role: payload.role,
        homeView: payload.homeView,
      };
    }
    case User.Actions.Logout.type:
      return {
        ...state,
        isLoggedIn: false,
        role: undefined,
        homeView: HomeView.Basic,
      };
    default:
      return state;
  }
}
