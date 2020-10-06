import { AppFrame } from '../actions/app-frame.actions';

export interface AppFrameState {
  sidenavExpanded: boolean
  isPageLoading: boolean
}

export const appFrameInitialState: AppFrameState = {
  sidenavExpanded: true,
  isPageLoading: false,
};

export function appFrameReducer(state = appFrameInitialState, action: any): AppFrameState {
  switch (action.type) {
    case AppFrame.Actions.ToggleSidenavExpand.type: {
      return {
        ...state,
        sidenavExpanded: !state.sidenavExpanded,
      };
    }
    case AppFrame.Actions.SetPageLoading.type: {
      return {
        ...state,
        isPageLoading: (action as AppFrame.Actions.SetPageLoading).payload.isPageLoading,
      };
    }
    default:
      return state;
  }
}
