/** 
 *   PublicationsType.ts
 */ 

/* ------------------------------- */

import { ICategory } from  "../../common/types/CategoriesType"
import {IProduct} from "../../common/types/ProductsType"

/* ------------------------------- */


export interface IPublicationNew  {
    pub_title:  string,
    pub_description:  string,
    category: ICategory;
    pub_price: number,
    pub_create_date:  Date | string,
    pub_due_date: Date | string,
    products: IProduct[]
}
  
/* ------------------------------- */

