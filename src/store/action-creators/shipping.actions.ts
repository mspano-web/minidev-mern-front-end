/**
 * shipping.actions.ts - Actions: They are JavaScript objects that describe an intention to change the state of the store.
 */

import { SET_SHIPPING, RESET_SHIPPING } from "../types/actionTypes";
import { IShipping } from "../types/shipping.type";

/**
 * setShipping - Submit a shipping cost update request.
 * 
 * @param shipping - shipping cost
 * @returns Return the function responsible for dispatch
 */

export const  setShipping = (shipping: IShipping) => {
  return (dispatch: any) => {
    dispatch(
      { type: SET_SHIPPING, 
        shipping: shipping 
      }
    )
  } 
}

/**
 * resetShipping - Submit a request to reset shipping costs.
 * 
 * @returns Return the function responsible for dispatch
 */

export const  resetShipping = () => {
    return (dispatch: any) => {
      dispatch(
        { 
          type: RESET_SHIPPING,
          shipping: {}
        }
      )
    } 
  }