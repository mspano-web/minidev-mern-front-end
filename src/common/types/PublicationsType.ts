/** 
 *   PublicationsType.ts
 */ 

/* ------------------------------- */

import { ICategory } from  "./CategoriesType"
import {IProduct} from "./ProductsType"

/* ------------------------------- */


export interface IPublication  {
    _id: string,
    pub_title:  string,
    pub_description:  string,
    category: ICategory;
    pub_price: number,
    pub_create_date:  Date | string,
    pub_due_date: Date | string,
    products: IProduct[]
}
  
/* ------------------------------- */

