/**
 * configuration.actions.ts - Actions: They are JavaScript objects that describe an intention to change the state of the store.
 */

import { SET_CONFIGURATION } from "../types/actionTypes";
import { IConfiguration } from "../types/configuration.type";

/**
 * setConfiguration - Submit a config update request.
 * 
 * @param config - System configuration
 * @returns - Return the function responsible for dispatch
 */
export const  setConfiguration = (config: IConfiguration) => {
  return (dispatch: any) => {
    dispatch(
      { type: SET_CONFIGURATION, 
        config: config 
      }
    )
  } 
}