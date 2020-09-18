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
  canManageDashboards: boolean
}

export interface UserState {
  isLoggedIn: boolean
  isRegistered: boolean
  roles: UserRole[]
  homeView: HomeView
  activeRole: UserRole | undefined
}

export const userInitialState: UserState = {
  isLoggedIn: false,
  isRegistered: false,
  roles: [],
  homeView: HomeView.Basic,
  activeRole: undefined,
};

// TODO: Get action typing working properly.

export function userReducer(state = userInitialState, action: any): UserState {
  switch (action.type) {
    case User.Actions.Login.type: {
      const userData = (action as User.Actions.Login).payload.userData;
      const roles = userData.roles.map(role => ({
        id: role.id,
        name: role.name,
        description: role.description,
        indexPrefix: role.index_prefix,
        canManageUsers: role.can_manage_users,
        canManageRoster: role.can_manage_roster,
        canManageRoles: role.can_manage_roles,
        canViewRoster: role.can_view_roster,
        canManageDashboards: role.can_manage_dashboards,
        org: {
          id: role.org.id,
          name: role.org.name,
          description: role.org.description,
          indexPrefix: role.org.index_prefix,
        },
      }));

      const activeRole = roles.length > 0 ? roles[0] : undefined;

      // HACK: Assign view based on role permissions for now.
      let homeView: HomeView;
      if (userData.root_admin) {
        homeView = HomeView.Leadership;
      } else if (activeRole && activeRole.canManageRoster) {
        homeView = HomeView.Medical;
      } else {
        homeView = HomeView.Basic;
      }

      return {
        ...state,
        isLoggedIn: true,
        isRegistered: userData.is_registered,
        roles,
        homeView,
        activeRole,
      };
    }
    case User.Actions.Logout.type:
      return {
        ...state,
        isLoggedIn: false,
        roles: [],
        homeView: HomeView.Basic,
        activeRole: undefined,
      };
    case User.Actions.ChangeOrg.type: {
      const orgId = (action as User.Actions.ChangeOrg).payload.orgId;
      const activeRole = state.roles.find(role => role.org.id === orgId);
      return {
        ...state,
        activeRole,
      };
    }
    default:
      return state;
  }
}
