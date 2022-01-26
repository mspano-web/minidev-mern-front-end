/** 
 *   UpdateUserService.ts
 */

/* ------------------------------- */

import axios, { AxiosRequestConfig } from "axios";
import { IUpdateUser } from "./UpdateUserType"
import { IUser } from "../../common/types/UserType"
import { servicePath } from "../../helpers/environment"


/* ------------------------------- */

/**
 * updateUser - Forwards user information to the backend endpoint for update user.
 * 
 * @param user_id 
 * @param user  - user data
 * @param header - header information (security)
 * @returns - No data
 */

export const updateUser = async (user_id: string, user: IUpdateUser, header: AxiosRequestConfig) => {
    return  (await axios.put(`${servicePath()}users/${user_id}`, user, header)).data  
}

/**
 * getUser - Sends user information to the backend endpoint to retrieve user information.
 * 
 * @param user_id 
 * @param header - header information (security)
 * @returns - User data
 */
export const getUser = async (user_id: string, header: AxiosRequestConfig) => {
    return  (await axios.get<IUser>(`${servicePath()}users/${user_id}`, header)).data  
}


/* ------------------------------- */
