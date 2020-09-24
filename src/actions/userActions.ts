import { Dispatch } from 'redux';
import axios, { AxiosResponse } from 'axios';

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

    export class ChangeOrg {
      static type = 'USER_CHANGE_ORG';
      type = ChangeOrg.type;
      constructor(public payload: {
        orgId: number
      }) {}
    }

    export class Register {
      static type = 'USER_REGISTER';
      type = Register.type;
      constructor(public payload: {
        userData: UserData
      }) {}
    }
  }

  export const login = () => async (dispatch: Dispatch<Actions.Login>) => {
    const response = await axios.get('api/user/current') as AxiosResponse<UserData>;

    console.log('userData', response.data);

    dispatch({
      ...new Actions.Login({ userData: response.data }),
    });
  };

  export const logout = () => (dispatch: Dispatch<Actions.Logout>) => {
    dispatch({
      ...new Actions.Logout(),
    });
  };

  export const changeOrg = (orgId: number) => (dispatch: Dispatch<Actions.ChangeOrg>) => {
    dispatch({
      ...new Actions.ChangeOrg({ orgId }),
    });
  };

  export const register = (data: UserRegisterData) => async (dispatch: Dispatch<Actions.Register>) => {
    console.log('register', data);

    const response = await axios.post('api/user', {
      first_name: data.firstName,
      last_name: data.lastName,
      phone: data.phone,
      email: data.email,
      service: data.service,
    }) as AxiosResponse<UserData>;

    dispatch({
      ...new Actions.Register({ userData: response.data }),
    });
  };
}

export interface UserData {
  edipi: string,
  first_name: string,
  last_name: string,
  phone: string,
  service: string,
  email: string,
  enabled: boolean,
  root_admin: boolean,
  is_registered: boolean,
  roles: [{
    id: number,
    name: string,
    description: string,
    index_prefix: string,
    can_manage_users: boolean,
    can_manage_roster: boolean,
    can_manage_roles: boolean,
    can_view_roster: boolean,
    can_manage_dashboards: boolean,
    org: {
      id: number,
      name: string,
      description: string,
      index_prefix: string
    }
  }]
}

export interface UserRegisterData {
  firstName: string
  lastName: string
  phone: string
  service: string
  email: string
}
