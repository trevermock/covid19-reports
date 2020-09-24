import { Dispatch } from 'redux';

export namespace AppFrame {

  export namespace Actions {

    export class ToggleSidenavExpand {
      static type = 'APP_FRAME_TOGGLE_SIDENAV_EXPANDED';
      type = ToggleSidenavExpand.type;
    }

  }

  export const toggleSidenavExpanded = () => (dispatch: Dispatch<Actions.ToggleSidenavExpand>) => {
    dispatch({
      ...new Actions.ToggleSidenavExpand(),
    });
  };

}
