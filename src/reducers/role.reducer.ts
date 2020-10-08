import { Role } from '../actions/role.actions';

export interface RoleState {
  isSavingRoleLoading: boolean;
  isDeletingRoleLoading: boolean;
}

export const roleInitialState: RoleState = {
  isSavingRoleLoading: false,
  isDeletingRoleLoading: false,
};

export function roleReducer(state = roleInitialState, action: any): RoleState {
  switch (action.type) {
    case Role.Actions.SetSavingRoleLoading.type: {
      return {
        ...state,
        isSavingRoleLoading: (action as Role.Actions.SetSavingRoleLoading).payload.isLoading,
      };
    }
    case Role.Actions.SetDeletingRoleLoading.type: {
      return {
        ...state,
        isDeletingRoleLoading: (action as Role.Actions.SetDeletingRoleLoading).payload.isLoading,
      };
    }
    default:
      return state;
  }
}
