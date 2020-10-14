import { Dispatch } from 'redux';

export namespace AppFrame {

  export namespace Actions {

    export class ToggleSidenavExpand {
      static type = 'APP_FRAME_TOGGLE_SIDENAV_EXPANDED';
      type = ToggleSidenavExpand.type;
    }

    export class SetPageLoading {
      static type = 'APP_FRAME_SET_PAGE_LOADING';
      type = SetPageLoading.type;
      constructor(public payload: {
        isPageLoading: boolean
      }) {}
    }

  }

  export const toggleSidenavExpanded = () => (dispatch: Dispatch<Actions.ToggleSidenavExpand>) => {
    dispatch({
      ...new Actions.ToggleSidenavExpand(),
    });
  };

  export const setPageLoading = (isPageLoading: boolean) => (dispatch: Dispatch<Actions.SetPageLoading>) => {
    dispatch({
      ...new Actions.SetPageLoading({ isPageLoading }),
    });
  };

}
