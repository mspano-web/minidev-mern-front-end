/** 
 *   ProductsService.ts - Backend endpoint access services associated with products.
 */

/* ------------------------------- */

import axios from "axios";
import { IProduct } from "../../common/types/ProductsType";
import { servicePath } from "../../helpers/environment"

/* ------------------------------- */

/**
 * getProducts - Request product information at the end point of the backend.
 * 
 * @returns - Product list
 */

export const getProducts = async () => {
  return (await axios.get<IProduct[]>(`${servicePath()}products`)).data;
};

/* ------------------------------- */
