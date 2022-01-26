/** 
 *   PublicationsServices.css - Backend endpoint access services associated with publications.
 */

/* ------------------------------- */

import axios from "axios";
import { IPublication } from "../../common/types/PublicationsType"
import { servicePath } from "../../helpers/environment"

/**
 * getPublishsByTitle - Sends query request to the corresponding endpoint of the backend the publications that match the entered title.
 * 
 * @param search - title to search (partial o total)
 * @param page - active page
 * @param limit - number of items per page
 * @returns - publications that match the searched title, according to the indicated pagination.
 */
export const getPublishsByTitle = async (search: string, page: number, limit: number) => {
    return  (await axios.get<IPublication[]>(`${servicePath()}publications/title?title=${search}&page=${page}&limit=${limit}`)).data  
}

/**
 * getPublishsByTitleTotal - It sends a query request to the corresponding endpoint of the backend, 
 *                           in order to obtain the total number of publications that match the entered title.
 * 
 * @param search - title to search (partial o total)
 * @returns - total number of publications that match the entered title.
 */

export const getPublishsByTitleTotal = async (search: string) => {
    return  (await axios.get<number>(`${servicePath()}publications/title/total?title=${search}`)).data  
}

/**
 * getPublishsAll - Send a query request to the corresponding endpoint of the backend, in order to get from existing publications (no filter)
 * 
 * @param page - active page
 * @param limit - number of items per page
 * @returns - Publications found (without filter) according to the indicated pagination.
 */
export const getPublishsAll = async (page: number, limit: number) => {
    return  (await axios.get<IPublication[]>(`${servicePath()}publications?page=${page}&limit=${limit}`)).data  
}

/**
 *  getPublishsAllTotal - It sends a query request to the corresponding endpoint of the backend, 
 *                         in order to obtain the total number of publications existents.
 *  
 * @returns - total number of publications founds.
 */
export const getPublishsAllTotal = async () => {
    return  (await axios.get<number>(`${servicePath()}publications/total`)).data  
}

/**
 * getPublishsByCategory -It sends a query request to the corresponding endpoint of the backend, in search of the publications that match the entered category.
 * 
 * @param search - category to search 
 * @param page - active page
 * @param limit - number of items per page
 * @returns - publications that match the searched category, according to the indicated pagination.
 */
export const getPublishsByCategory = async (search: string, page: number, limit: number) => {
    return  (await axios.get<IPublication[]>(`${servicePath()}publications/category/${search}?page=${page}&limit=${limit}`)).data  
}

/**
 * getPublishsByCategoryTotal - It sends a query request to the corresponding endpoint of the backend, 
 *                              in order to obtain the total number of publications that match the entered category.
 * 
 * @param search - category to search 
 * @returns - Total number of posts found that match the entered category.
 */
export const getPublishsByCategoryTotal = async (search: string) => {
    return  (await axios.get<number>(`${servicePath()}publications/category/total/${search}`)).data  
}


/* ------------------------------- */

