
/**
 * user.actions.ts - Actions: They are JavaScript objects that describe an intention to change the state of the store.
 */

import { LOGIN, LOGOUT } from "../types/actionTypes";
import { IUserData } from "../types/user-data.type";

/**
 * loginUser - Submit a user login request.
 * 
 * @param user - user data
 * @returns Return the function responsible for dispatch
 */

export const  loginUser = (user: IUserData) => {
  return (dispatch: any) => {
    dispatch(
      { type: LOGIN, 
        user: user 
      }
    )
  } 
}

/**
 * logoutUser - Submit a user logout request.
 * 
 * @returns Return the function responsible for dispatch 
 */

export const  logoutUser = () => {
  return (dispatch: any) => {
    dispatch(
      { 
        type: LOGOUT,
        user: {}
      }
    )
  } 
}
