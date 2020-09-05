import { Dispatch } from 'redux';
import { HomeView } from '../reducers/userReducer';

export namespace User {
  export namespace Actions {
    export class Login {
      static type = 'USER_LOGIN';
      type = Login.type;
      constructor(public payload: {
        role: string,
        homeView: HomeView
      }) {}
    }

    export class Logout {
      static type = 'USER_LOGOUT';
      type = Logout.type;
    }
  }

  export const login = () => async (dispatch: Dispatch<Actions.Login>) => {
    // Get role.
    const response = await fetch('api/user/current');
    const data = await response.json() as {
      EDIPI: string,
      FirstName: string,
      LastName: string,
      enabled: boolean,
      rootAdmin: boolean,
      roles: [{
        id: number,
        name: string,
        description: string,
        canManageUsers: boolean,
        canManageRoster: boolean,
        canManageRoles: boolean,
        canViewRoster: boolean,
        org: {
          id: number,
          name: string,
          description: string
        }
      }]
    };

    // HACK: Assign view based on role permissions for now.
    let homeView: HomeView;
    if (data.rootAdmin) {
      homeView = HomeView.Leadership;
    } else if (data.roles.length > 0 && data.roles[0].canManageRoster) {
      homeView = HomeView.Medical;
    } else if (data.roles.length > 0) {
      homeView = HomeView.Basic;
    } else {
      alert('Not authorized.');
      return;
    }

    dispatch({
      ...new Actions.Login({
        role: data.EDIPI,
        homeView,
      })
    });
  }

  export const logout = () => (dispatch: Dispatch<Actions.Logout>) => {
    dispatch({ ...new Actions.Logout() });
  }
}

