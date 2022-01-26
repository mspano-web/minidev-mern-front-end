/** 
 *  ShippingService.ts - Backend endpoint access services associated Shipping Cost.
 */ 

/* ------------------------------- */

import axios from "axios";
import { IShipping } from "../types/ShippingType"
import { servicePath } from "../../helpers/environment"

/* ------------------------------- */

/**
 * getShipping - It sends a query request to the corresponding endpoint of the backend, 
 *                in order to obtain the shipping costs associated with the active user.
 * 
 * @param search - user data
 * @returns - shipping cost
 */

export const getShipping = async (user_id: string): Promise<IShipping> => {
    return  (await axios.get<IShipping>(`${servicePath()}users/shipping/${user_id}`)).data  
}

/* ------------------------------- */
