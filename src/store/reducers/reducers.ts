/**
 * reducers.ts -  Combine all reducers defined in the application.
 */

import { shippingReducer } from "./shipping.reducer";
import { userReducer } from "./user.reducer";
import { configurationReducer } from "./configuration.reducer";
import { combineReducers } from "redux";

/* ------------------------------------------- */

const reducers = combineReducers({
  config: configurationReducer,
  user: userReducer,
  shipping: shippingReducer,
});

export default reducers;
