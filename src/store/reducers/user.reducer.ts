/**
 * shipping.reducer.ts -  Reducers: They are pure JavaScript functions that determine how the store should be updated based on the actions.
 */

import { LOGIN, LOGOUT } from "../types/actionTypes";

/**
 * In Redux, the entire state of the application is stored in a single object.
 */


const initialState = {      // Default
  usr_id: "",
  usr_token: "",
  usr_rol_name: "",
  usr_username: ""
}

// The state object should not be modified, but that a new object should be returned if the state changed.
//    To join the state and the actions together, we write a function called reducer (reducer)
//    It is just a function that takes the state and action as arguments and returns the next state of the application.

// About REDUCERS
//
// The work of the reducers is specify how the state of the application changes in response to an action.
// The Store can have several reducers that modify the state.
// A reducer is basically a pure JavaScript function, which receives as input the current state of the
//    application and the Action that describes the attempt to update the state, in this way,
//    it is the reducer who determines how the state should be updated based on the action.

// The state is structured based on the reducers, in such a way that, each reducer modifies a section of
//    the state, that is why the same action is received by all the reducers and each one of them will be able
//    to determine if it is necessary to make any changes to its part of the state, therefore,
//    it is possible that a single action has effects in several parts of the state

// A store has a tree shape, where each reducer creates a branch

// The state is set equal to the constant initial Value, which means that we declare the initial state
//    of the store.

/**
 *  userReducer - responsible for processing the corresponding actions on the user store.
 * 
 * @param state - User state
 * @param action - Action to be taken 
 * @returns - eturns the new state of the store after applying the corresponding action, or failing that (in the case of not applying actions) the same state.
 */

export const userReducer = (state = initialState, action: any) => {

  const user = action.user;
  switch (action.type) {
    // If the type of the action corresponds to any of the cases, then the change in the state
    //   of the store is applied. The value that will be saved in the new state of the store is returned
    case LOGIN:
      return user
    // { ...state, user }   // It is necessary in the case that only some of the data is updated and the rest is not overwritten.
    case LOGOUT:
      return  initialState
    // If the type does not correspond to any action, then the same received status is returned
    //   to indicate to the store that no change has been applied.
    default:
      return state;
  }
};

