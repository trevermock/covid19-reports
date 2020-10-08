import { Dispatch } from 'redux';
import axios, { AxiosResponse } from 'axios';
import { ApiUser } from '../models/api-response';

export namespace User {

  export namespace Actions {

    export class Login {
      static type = 'USER_LOGIN';
      type = Login.type;
      constructor(public payload: {
        userData: ApiUser
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
        userData: ApiUser
      }) {}
    }

    export class SetRegisterLoading {
      static type = 'USER_SET_REGISTER_LOADING';
      type = SetRegisterLoading.type;
      constructor(public payload: {
        isRegisterLoading: boolean
      }) {}
    }

  }

  export const login = () => async (dispatch: Dispatch<Actions.Login>) => {
    const response = await axios.get('api/user/current') as AxiosResponse<ApiUser>;

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

  export const setRegisterLoading = (isLoading: boolean) => (dispatch: Dispatch<Actions.SetRegisterLoading>) => {
    dispatch({
      ...new Actions.SetRegisterLoading({ isRegisterLoading: isLoading }),
    });
  };

  export const register = (data: UserRegisterData) => async (dispatch: Dispatch<Actions.Register>) => {
    console.log('register', data);

    const response = await axios.post('api/user', {
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      email: data.email,
      service: data.service,
    }) as AxiosResponse<ApiUser>;

    dispatch({
      ...new Actions.Register({ userData: response.data }),
    });
  };
}

export interface UserRegisterData {
  firstName: string
  lastName: string
  phone: string
  service: string
  email: string
}
