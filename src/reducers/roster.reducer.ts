import { Roster } from '../actions/roster.actions';

export interface RosterState {
}

export const rosterInitialState: RosterState = {
};

export function rosterReducer(state = rosterInitialState, action: any) {
  switch (action.type) {
    case Roster.Actions.Upload.type: {
      // const payload = (action as Roster.Actions.Upload).payload;
      return {
        ...state,
      };
    }
    default:
      return state;
  }
}
