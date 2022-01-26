/**
 * Errors.tsx -  Error message.
 */

import "./Errors.css"

const Errors = (props: any) => {
    return (
         <p className="errors"> {props.message} </p> 
    )
}

export default Errors;
