/**
 * pageListActionsTypes.ts
 */

import { pageActions } from "./pagesListActions"

export interface iPageList {    // An interface for our state
    pageView: number[]
    bFlagFirst: boolean;
    bFlagPrev: boolean;
    bFlagEllipseLeft: boolean;
    bFlagLast: boolean;
    bFlagNext: boolean;
    bFlagEllipseRight: boolean;
  }

  
export interface iPageTypeActions {  // An interface for our actions
    type: pageActions;
    payload?: any ;
  }
  
  /* ------------------------------- */