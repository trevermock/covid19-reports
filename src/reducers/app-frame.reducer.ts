import { AppFrame } from '../actions/app-frame.actions';

export interface AppFrameState {
  sidenavExpanded: boolean
}

export const appFrameInitialState: AppFrameState = {
  sidenavExpanded: true,
};

export function appFrameReducer(state = appFrameInitialState, action: any): AppFrameState {
  switch (action.type) {
    case AppFrame.Actions.ToggleSidenavExpand.type: {
      return {
        ...state,
        sidenavExpanded: !state.sidenavExpanded,
      };
    }
    default:
      return state;
  }
}
