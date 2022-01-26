/* 
 *  ForgotPasswordService,ts - Backend endpoint access services associated with users.
 */ 

/* ------------------------------- */

import axios from "axios";
import { servicePath } from "../../helpers/environment"

/* ------------------------------- */

/**
 * forgotPassword - Forwards contact information to the backend endpoint for reset password.
 * 
 * @param email - User email
 * @returns - message
 */

export const forgotPassword = async (email: string) => {
    return  (await axios.post(`${servicePath()}users/forgotpassword/`, { email } )).data  
}

/* ------------------------------- */

