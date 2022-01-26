/**
 * pageMapActionsTypes.ts
 */
import { pageMapActions } from "./pageMapActions"

export interface iPageItem {
    pageNumber: number;
    data: any[];
    accessCount: number;
    accessTime: number;
  }

  /**
   * An interface for our state
   */
export interface iPageMap { 
    pageItems: iPageItem[]
  }


  /**
   * An interface for our actions
   */
export interface iPageMapTypeActions {
    type: pageMapActions;
    payload?: any ;
  }
  
  