import { Dispatch } from 'redux';

export namespace Role {

  export namespace Actions {

    export class SetSavingRoleLoading {
      static type = 'ROLE_SET_SAVING_ROLE_LOADING';
      type = SetSavingRoleLoading.type;
      constructor(public payload: {
        isLoading: boolean
      }) {}
    }

    export class SetDeletingRoleLoading {
      static type = 'ROLE_SET_DELETING_ROLE_LOADING';
      type = SetDeletingRoleLoading.type;
      constructor(public payload: {
        isLoading: boolean
      }) {}
    }

  }

  export const SetSavingRoleLoading = (isLoading: boolean) => (dispatch: Dispatch<Actions.SetSavingRoleLoading>) => {
    dispatch({
      ...new Actions.SetSavingRoleLoading({ isLoading }),
    });
  };

  export const SetDeletingRoleLoading = (isLoading: boolean) => (dispatch: Dispatch<Actions.SetDeletingRoleLoading>) => {
    dispatch({
      ...new Actions.SetDeletingRoleLoading({ isLoading }),
    });
  };

}
