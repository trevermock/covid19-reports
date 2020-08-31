import { Action, ActionType } from './action';

export namespace UserActions {

  // REDUX TEST
  @ActionType('USER_INCREMENT_COUNT')
  export class IncrementCount extends Action {}

}

export namespace User {

  // REDUX TEST
  export function incrementCount() {
    return {...new UserActions.IncrementCount()};
  }

}

