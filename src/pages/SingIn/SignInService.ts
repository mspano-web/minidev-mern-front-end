/* 
 *   SignInService.ts - Backend endpoint access services associated with login.
 */

/* ------------------------------- */

import axios from "axios";
import {ISignIn} from "./SignInType"
import { servicePath } from "../../helpers/environment"

/* ------------------------------- */

/**
 * loginUser - Requests the login of a user in the system.
 * 
 * @param signIn - User data required for login
 * @returns  - User session information.
 */


export const loginUser = async (signIn: ISignIn) => {
    return  (await axios.post(`${servicePath()}users/login`, signIn)).data  
}

/* ------------------------------- */


