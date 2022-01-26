/* 
 *  RegisterUserServices.css
 */

/* ------------------------------- */

import axios from "axios";
import { IRegister } from "./RegisterUserType";
import { IStates } from "../../common/types/StatesType";
import { IRol } from "../../common/types/RolesType";
import { servicePath } from "../../helpers/environment"

/* ------------------------------- */

/**
 * registerUser - Forwards user information to the backend endpoint for registration.
 * 
 * @param register - data new user
 * @returns - No data
 */

export const registerUser = async (register: IRegister) => {
  return (await axios.post(`${servicePath()}users/register`, register))
    .data;
};

/**
 * getRolStandard - Request information on rol standard.
 * 
 * @returns - Information retrieved.
 */

export const getRolStandard = async () => {
  return (await axios.get<IRol>(`${servicePath()}rol/standard`)).data;
};

/**
 * getStateCity - Request information on states and cities.
 * 
 * @returns - Information retrieved.
 */

 export const getStateCity = async () => {
  return (await axios.get<IStates[]>(`${servicePath()}states`)).data;
};


/* ------------------------------- */
