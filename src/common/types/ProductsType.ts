/** 
 *   ProductsType.ts
 */ 

/* ------------------------------- */

import { ICategory } from  "./CategoriesType"
import { IImage } from  "./ImageType"

/* ------------------------------- */

export interface IProduct  {
    _id: string;
    prod_title: string;
    prod_description: string;
    prod_price: number;
    category: ICategory;
    images: IImage[];
  }

  /* ------------------------------- */
