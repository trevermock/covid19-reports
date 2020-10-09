import { User } from '../actions/user.actions';
import { ApiRole, ApiUser } from '../models/api-response';

export const userInitialState: UserState = {
  edipi: '',
  firstName: '',
  lastName: '',
  phone: '',
  service: '',
  email: '',
  rootAdmin: false,
  isRegistered: false,
  roles: [],
  activeRole: undefined,
  isLoggedIn: false,
};


export function userReducer(state = userInitialState, action: any): UserState {
  switch (action.type) {
    case User.Actions.Register.type: {
      const userData = (action as User.Actions.Register).payload.userData;

      return {
        ...state,
        ...loggedInState(userData),
      };
    }
    case User.Actions.Login.type: {
      const userData = (action as User.Actions.Login).payload.userData;

      return {
        ...state,
        ...loggedInState(userData),
      };
    }
    case User.Actions.Logout.type:
      return userInitialState;
    case User.Actions.ChangeOrg.type: {
      const orgId = (action as User.Actions.ChangeOrg).payload.orgId;
      const activeRole = state.roles?.find(role => role.org?.id === orgId);
      return {
        ...state,
        activeRole,
      };
    }
    default:
      return state;
  }
}

function loggedInState(user: ApiUser): Partial<UserState> {
  if (!user.roles) {
    user.roles = [];
  }
  return {
    ...user,
    activeRole: getDefaultActiveRole(user.roles),
    isLoggedIn: true,
  };
}

function getDefaultActiveRole(roles: ApiRole[]) {
  return roles.length > 0 ? roles[0] : undefined;
}

export interface UserState extends ApiUser {
  activeRole: ApiRole | undefined
  isLoggedIn: boolean
}
