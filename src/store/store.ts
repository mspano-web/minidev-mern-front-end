import { createStore, applyMiddleware } from 'redux'  
import  reducers  from './reducers/reducers'  
import thunk from "redux-thunk"
import { composeWithDevTools } from "redux-devtools-extension"



// Store: Represents the status of the React application.
// Your API is {subscribe, dispatch, getState}.
// To create a store we need reducers to pass as an argument.

const store = createStore(
        reducers, 
        {},   // default state
         // thunk is a library that helps redux to support asynchronous actions.
         // Logger middleware for devtools - only for developmen
        composeWithDevTools(applyMiddleware(thunk)) 
    )  


/* This store will result in a state with the following structure:
{  
    config: {  
        ...  
    },    
    user: {  
        ...  
    },    
}  

The internal structure of each section will be determined by the value returned by each reducer, 
   therefore, userReducer will only be able to modify the user section and configReducer will only 
   be able to modify the config section. So we can say that each reducer can only modify a
   subpart of the general state.
*/    

export default store ;