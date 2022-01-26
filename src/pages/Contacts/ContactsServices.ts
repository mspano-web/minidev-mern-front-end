
/** 
  *  ContactsServices.ts - Backend endpoint access services associated with contacts.
  */ 

/* ------------------------------- */

import axios from "axios";
import {IContact} from "./ContactsType"
import { servicePath } from "../../helpers/environment"

/* ------------------------------- */

/**
 * createContact - Forwards contact information to the backend endpoint for registration.
 * 
 * @param contact - Contact information entered in the form.
 * @returns - No data.
 */

export const createContact = async (contact: IContact) => {
    return  (await axios.post(`${servicePath()}contacts`, contact))  
}

/* ------------------------------- */
