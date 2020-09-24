import { User, UserData } from '../actions/userActions';

export const userInitialState: UserState = {
  edipi: '',
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
  enabled: true,
  rootAdmin: false,
  isLoggedIn: false,
  isRegistered: false,
  roles: [],
  activeRole: undefined,
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

function loggedInState(userData: UserData): Partial<UserState> {
  const roles = getRoles(userData);

  return {
    edipi: userData.edipi,
    firstName: userData.first_name,
    lastName: userData.last_name,
    phone: userData.phone,
    email: userData.email,
    enabled: userData.enabled,
    rootAdmin: userData.root_admin,
    isRegistered: userData.is_registered,
    roles,
    activeRole: getDefaultActiveRole(roles),
    isLoggedIn: true,
  };
}

function getRoles(userData: UserData): UserRole[] {
  if (!userData.roles) {
    return [];
  }

  return userData.roles.map(role => ({
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
}

function getDefaultActiveRole(roles: UserRole[]) {
  return roles.length > 0 ? roles[0] : undefined;
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
  edipi: string,
  firstName: string,
  lastName: string,
  phone: string,
  email: string,
  enabled: boolean,
  rootAdmin: boolean,
  isRegistered: boolean
  roles: UserRole[]
  activeRole: UserRole | undefined
  isLoggedIn: boolean
}
