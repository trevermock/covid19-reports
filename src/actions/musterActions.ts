import { Dispatch } from "redux";

interface MusterData {
  last_observation: Date;
  unit: string;
  phone: string;
  rate_rank: string;
  name: string;
  edipi: string;
  non_muster_rate: string;
}

export namespace Muster {
  export namespace Actions {
    export class Login {
      static type = "USER_LOGIN";
      type = Login.type;
      constructor(
        public payload: {
          userData: MusterData;
        }
      ) {}
    }

    export class Logout {
      static type = "USER_LOGOUT";
      type = Logout.type;
    }
  }

  export const login = () => async (dispatch: Dispatch<Actions.Login>) => {
    const response = await fetch("api/user/current");
    const userData = (await response.json()) as MusterData;

    console.log("userData", userData);

    dispatch({
      ...new Actions.Login({ userData }),
    });
  };

  export const logout = () => (dispatch: Dispatch<Actions.Logout>) => {
    dispatch({ ...new Actions.Logout() });
  };
}
