/** 
 *   NewPublicationService.ts - Backend endpoint access services associated with products and publications.
 */

/* ------------------------------- */

import axios, { AxiosRequestConfig }  from "axios";
import { IProduct } from "../../common/types/ProductsType"
//import { IPublication } from "../../common/types/PublicationsType"
import { IPublicationNew } from "./NewPublicationType"
import { servicePath } from "../../helpers/environment"

/* ------------------------------- */

/**
 * getProduct - Forwards id product to the backend endpoint for get product information.
 * 
 * @param search - product id
 * @returns - Product data
 */

export const getProduct = async (search: string) => {
    return  (await axios.get<IProduct>(`${servicePath()}products/${search}`)).data  
}

/**
 * createPublication - Forwards publication information to the backend endpoint for create publication.
 * 
 * @param publication - Publication Data
 * @returns  - New publication id
 */

export const createPublication = async (publication: IPublicationNew, header: AxiosRequestConfig) => {
    return  (await axios.post(`${servicePath()}publications`, publication, header)).data  
}

/* ------------------------------- */

