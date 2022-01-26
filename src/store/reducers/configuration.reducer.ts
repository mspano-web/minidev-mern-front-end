/**
 * configuration.reducer.ts -  Reducers: They are pure JavaScript functions that determine how the store should be updated based on the actions.
 */

import { SET_CONFIGURATION }  from "../types/actionTypes"


/**
 * In Redux, the entire state of the application is stored in a single object.
 */
 
const initialState = {             // Default
    conf_delivery_time_from: 0,
    conf_delivery_time_to: 0,
    conf_path_image_prod: "",
    conf_name_image_prod_default: ""
}  

/**
 *  configurationReducer - responsible for processing the corresponding actions on the system configuration store.
 * 
 * @param state - System state
 * @param action - Action to be taken 
 * @returns - Returns the new state of the store after applying the corresponding action, or failing that (in the case of not applying actions) the same state.
 */

export const configurationReducer = (state = initialState , action: any) => {

    const config = action.config;

    switch (action.type) {
        case SET_CONFIGURATION:
            return config
        // It is important to return the previous state for any unknown action.
        default:
            return state;
    }
}

 