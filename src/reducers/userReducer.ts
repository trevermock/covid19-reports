import { User } from '../actions/userActions';

export enum HomeView {
  Basic = 'basic',
  Leadership = 'leadership',
  Medical = 'medical'
}

interface Org {
  id: number
  name: string
  description: string
  indexPrefix: string
}

interface UserRole {
  id: number
  name: string
  description: string
  org: Org
  indexPrefix: string
  canManageUsers: boolean
  canManageRoster: boolean
  canManageRoles: boolean
  canViewRoster: boolean
}

export interface UserState {
  isLoggedIn: boolean
  roles: UserRole[]
  homeView: HomeView
}

export const userInitialState: UserState = {
  isLoggedIn: false,
  roles: [],
  homeView: HomeView.Basic,
};

// TODO: Get action typing working properly.

export function userReducer(state = userInitialState, action: any): UserState {
  switch (action.type) {
    case User.Actions.Login.type: {
      const payload = (action as User.Actions.Login).payload;
      const userData = payload.userData;
      const roles = userData.roles.map(role => ({
        id: role.id,
        name: role.name,
        description: role.description,
        indexPrefix: role.index_prefix,
        canManageUsers: role.can_manage_users,
        canManageRoster: role.can_manager_roster,
        canManageRoles: role.can_manage_roles,
        canViewRoster: role.can_view_roster,
        org: {
          id: role.org.id,
          name: role.org.name,
          description: role.org.description,
          indexPrefix: role.org.index_prefix,
        },
      }));

      // HACK: Assign view based on role permissions for now.
      let homeView: HomeView;
      if (userData.root_admin) {
        homeView = HomeView.Leadership;
      } else if (userData.roles.length > 0 && userData.roles[0].can_manager_roster) {
        homeView = HomeView.Medical;
      } else {
        homeView = HomeView.Basic;
      }

      return {
        ...state,
        isLoggedIn: true,
        roles,
        homeView,
      };
    }
    case User.Actions.Logout.type:
      return {
        ...state,
        isLoggedIn: false,
        roles: [],
        homeView: HomeView.Basic,
      };
    default:
      return state;
  }
}
