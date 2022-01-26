/* 
    PublicationDetailsService.ts - - Backend endpoint access services associated with publications details.
 */ 

/* ------------------------------- */

import axios from "axios";
import { IPublication } from "../../common/types/PublicationsType"
import { servicePath } from "../../helpers/environment"


/**
 * getPublishsById - Send a query request to the corresponding backend endpoint of the publication that matches the id.
 * 
 * @param id - id to search
 * @returns - publications that match the id.
 */
export const getPublishsById = async (id: string) => {
    return  (await axios.get<IPublication>(`${servicePath()}publications/${id}`)).data  
}

/* ------------------------------- */


