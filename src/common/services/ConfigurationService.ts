/** 
 *  ConfigurationService.ts - Backend endpoint access services associated application configuration.
 */ 

/* ------------------------------- */

import axios from "axios";
import {IConfiguration} from "../../store/types/configuration.type"
import { servicePath } from "../../helpers/environment"

/* ------------------------------- */

/**
 *  getConfiguration - It sends a query request to the corresponding endpoint of the backend, 
 *                     in order to obtain the apllication configuration.
 * @returns - Configuration Data.
 */

export const getConfiguration = async (): Promise<IConfiguration> => {
    return  (await axios.get<IConfiguration>(`${servicePath()}configuration`)).data  
}

/* ------------------------------- */

