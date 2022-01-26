/**
 * shipping.reducer.ts -  Reducers: They are pure JavaScript functions that determine how the store should be updated based on the actions.
 */

import { SET_SHIPPING, RESET_SHIPPING }  from "../types/actionTypes"


/**
 * In Redux, the entire state of the application is stored in a single object.
 */

const initialState = {     // Default
    state_id: "",
    city_id: "",
    city_delivery_days: 0,
    city_shipping_cost: 0

}  

/**
 * configurationReducer - responsible for processing the corresponding actions on the shipping store.
 * 
 * @param state - Shipping state
 * @param action - Action to be taken 
 * @returns - Returns the new state of the store after applying the corresponding action, or failing that (in the case of not applying actions) the same state.
 */

export const shippingReducer = (state = initialState , action: any) => {

    const shipping = action.shipping;

    switch (action.type) {
        case SET_SHIPPING:
            return shipping 
        // It is important to return the previous state for any unknown action.
        case RESET_SHIPPING: 
            return initialState
        default:
            return state;
    }
}

 