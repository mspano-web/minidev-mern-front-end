/** 
 *   SalesService.ts - Backend endpoint access services associated with sales.
 */ 

/* ------------------------------- */

import axios, { AxiosRequestConfig } from "axios";
import {ISale} from "./SalesType"
import { servicePath } from "../../../helpers/environment"

/**
 * createSale - Forwards sale information to the backend endpoint for registration.
 * 
 * @param sale  - Sale Data
 * @param header  - Header Http
 * @returns - New ID 
 */

export const createSale = async (sale: ISale, header: AxiosRequestConfig) => {
    return  (await axios.post(`${servicePath()}sales`, sale, header)).data  
}

/* ------------------------------- */
