/**
 * pageMapReducer.ts
 */

import {
  iPageMapTypeActions,
  iPageMap,
  iPageItem,
} from "./pageMapActionsTypes";
import { pageMapActions } from "./pageMapActions";

/**
 * Initial state of the reducer
 */
export const pageMapInitialState: iPageMap = {
  // Property List
  pageItems: [],
};


/**
 * pageMapInit - Transformation to the initial state. Reducer.
 * @param initialState 
 * @returns 
 */
export const pageMapInit = (initialState: any) => {
  // It allows modifying any value of the initialState prior to its use in reducer.
  return {};
};

/**
 * pageMapReducer - Reducing function
 *                  The reducing function is responsible for updating the state.
 * @param state  - current status
 * @param action - action to apply
 * @returns - new state
 */
export function pageMapReducer(state: iPageMap, action: iPageMapTypeActions) {
  const { type, payload } = action; // payload : value to assign
  switch (
    type // Evaluate the type of action.
  ) {
    case pageMapActions.INSERT_ITEM_PAGE_MAP: {
      return {
        ...state,
        pageItems: [...state.pageItems, payload],
      };
    }
    case pageMapActions.DELETE_ITEM_PAGE_MAP: {
      const pageItemsTemp: iPageItem[] = state.pageItems.filter((element) => element.pageNumber !== payload);
      return {
        ...state,
        pageItems: pageItemsTemp,
      };
    }
    case pageMapActions.RESET_ITEM_PAGE_MAP: {
      const pageItemsTemp: iPageItem[] = [];
      return {
        ...state,
        pageItems: pageItemsTemp,
      };
    }
    case pageMapActions.UPDATE_ACCESS_ITEM_PAGE_MAP: {
       // The number of accesses and the date / time are updated
       let pageItemsTemp = [...state.pageItems]; // copying the old datas array
        pageItemsTemp[payload].accessCount = pageItemsTemp[payload].accessCount + 1; // Update value
        pageItemsTemp[payload].accessTime = Date.now(); // Update value
        return {
            ...state,
            pageItems: pageItemsTemp,
          };
    }
    default:
      break;
  }
  // An unknown action is received. The state is not altered.
  return state;
}
