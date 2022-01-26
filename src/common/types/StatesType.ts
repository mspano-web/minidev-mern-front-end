/** 
 *   StatesType.ts
 */

/* ------------------------------- */

import { ICity}  from "./CitiesType"


export interface IStates {
    _id: string;
    state_description:  string;
    cities: ICity[];
}

// -----------------------------------------------------------