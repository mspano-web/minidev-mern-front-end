/** 
  *  CategoriesServices.css - Backend endpoint access services associated with categories.
  */ 

/* ------------------------------- */


import axios from "axios";
import { ICategory } from "../../common/types/CategoriesType";
import { servicePath } from "../../helpers/environment"

/* ------------------------------- */


/**
 * getCategories - Check the endpoint for the information associated with the current categories.
 * 
 * @returns - Existing categories.
 */

export const getCategories = async () => {
    return  (await axios.get<ICategory[]>(`${servicePath()}categories`)).data  
}

/**
 * getCategory - Check the endpoint for the information associated with the current category.
 * 
 * @returns - Match category.
 */

 export const getCategory = async (cat_id: string) => {
  return  (await axios.get<ICategory>(`${servicePath()}categories/${cat_id}`)).data  
}


/* ------------------------------- */
