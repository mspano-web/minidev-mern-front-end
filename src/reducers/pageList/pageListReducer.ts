/**
 * pageListReducer.ts
 */

import { iPageTypeActions, iPageList } from "./pageListActionsTypes"
import { pageActions } from "./pagesListActions"


export const pageListInitialState: iPageList = {  // Initial state of the reducer
    // Property List
    pageView: [],
    bFlagFirst: false,
    bFlagPrev: false,
    bFlagEllipseLeft: false,
    bFlagLast: false,
    bFlagNext: false,
    bFlagEllipseRight: false,
  };
  
   
  /**
   * pageListInit - Transformation to the initial state. Reducer.
   *                It allows modifying any value of the initialState prior to its use in reducer.
   * 
   * @param initialState 
   * @returns  - Modified state
   */

  export const  pageListInit = (initialState: any ) => {
      return {
            bFlagFirst: true
      };
  }
  

  
/**
 * pageListsReducer - Reducing function
 *                    The reducing function is responsible for updating the state.
 * 
 * @param state  - current status
 * @param action - action to apply
 * @returns  - new state
 */
export function pageListsReducer(
    state:  iPageList,
    action: iPageTypeActions
  ) {
    const { type, payload } = action; // payload : value to assign
    switch (
      type // Evaluate the type of action.
    ) {
      case pageActions.UPDATE_PAGE_VIEWER:
        return {
          ...state,
          pageView: payload
        };
      case pageActions.ACTIVATE_FIRST:
        return {
          ...state,
          bFlagFirst: true,
        };
      case pageActions.DEACTIVATE_FIRST:
        return {
          ...state,
          bFlagFirst: false,
        };
      case pageActions.ACTIVATE_PREV:
        return {
          ...state,
          bFlagPrev: true,
        };
      case pageActions.DEACTIVATE_PREV:
        return {
          ...state,
          bFlagPrev: false,
        };
      case pageActions.ACTIVATE_ELLIPSE_LEFT:
        return {
          ...state,
          bFlagEllipseLeft: true,
        };
      case pageActions.DEACTIVATE_ELLIPSE_LEFT:
        return {
          ...state,
          bFlagEllipseLeft: false,
        };
      case pageActions.ACTIVATE_LAST:
        return {
          ...state,
          bFlagLast: true,
        };
      case pageActions.DEACTIVATE_LAST:
        return {
          ...state,
          bFlagLast: false,
        };
      case pageActions.ACTIVATE_NEXT:
        return {
          ...state,
          bFlagNext: true,
        };
      case pageActions.DEACTIVATE_NEXT:
        return {
          ...state,
          bFlagNext: false,
        };
      case pageActions.ACTIVATE_ELLIPSE_RIGTH:
        return {
          ...state,
          bFlagEllipseRight: true,
        };
      case pageActions.DEACTIVATE_ELLIPSE_RIGTH:
        return {
          ...state,
          bFlagEllipseRight: false,
        };
      default:
        break;
    }
    // An unknown action is received. The state is not altered.
    return state;  
  }
  