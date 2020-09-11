import { Dispatch } from 'redux';


interface UserData {
  edipi: string,
  first_name: string,
  last_name: string,
  enabled: boolean,
  root_admin: boolean,
  roles: [{
    id: number,
    name: string,
    description: string,
    index_prefix: string,
    can_manage_users: boolean,
    can_manage_roster: boolean,
    can_manage_roles: boolean,
    can_view_roster: boolean,
    org: {
      id: number,
      name: string,
      description: string,
      index_prefix: string
    }
  }]
}


export namespace User {
  export namespace Actions {
    export class Login {
      static type = 'USER_LOGIN';
      type = Login.type;
      constructor(public payload: {
        userData: UserData
      }) {}
    }

    export class Logout {
      static type = 'USER_LOGOUT';
      type = Logout.type;
    }
  }

  export const login = () => async (dispatch: Dispatch<Actions.Login>) => {
    const response = await fetch('api/user/current');
    const userData = await response.json() as UserData;

    console.log('userData', userData);

    dispatch({
      ...new Actions.Login({ userData })
    });
  }

  export const logout = () => (dispatch: Dispatch<Actions.Logout>) => {
    dispatch({ ...new Actions.Logout() });
  }
}

