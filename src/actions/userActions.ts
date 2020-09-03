import { Dispatch } from 'redux';
import { HomeView } from '../reducers/userReducer';

export namespace User {
  export namespace Actions {
    export class Login {
      static type = 'USER_LOGIN';
      type = Login.type;
      constructor(public payload: {
        role: string
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
    const response = await fetch('api/user/role');
    const data = await response.json() as {
      message: string
    };
    const role = data.message;

    // HACK: Assign view based on role for now.
    let homeView: HomeView;
    switch (role) {
      case 'Registered User: Basic User':
        homeView = HomeView.Basic;
        break;
      case 'Registered User: Organizational Admin User':
        homeView = HomeView.Medical;
        break;
      case 'Registered User: Root Admin User':
        homeView = HomeView.Leadership;
        break;
      case 'Not authorized.':
        alert('Not authorized.');
        return;
      default:
        throw new Error(`Unrecognized role "${role}"`);
    }

    dispatch({
      ...new Actions.Login({
        role,
        homeView,
      })
    });
  }

  export const logout = () => (dispatch: Dispatch<Actions.Logout>) => {
    dispatch({ ...new Actions.Logout() });
  }
}

