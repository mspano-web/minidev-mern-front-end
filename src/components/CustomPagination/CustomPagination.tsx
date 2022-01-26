/**
 * CustomPagination.tsx - Custom pagination component
 */

import { Pagination } from "react-bootstrap";
import React, { useState, useEffect, useReducer } from "react";
import {
  pageListsReducer,
  pageListInitialState,
} from "../../reducers/pageList/pageListReducer";
import {
  pageMapReducer,
  pageMapInitialState,
} from "../../reducers/pageMap/pageMapReducer";
import { pageActions } from "../../reducers/pageList/pagesListActions";
import { pageMapActions } from "../../reducers/pageMap/pageMapActions";
import { iPageItem } from "../../reducers/pageMap/pageMapActionsTypes";
import "./CustomPaginantio.css";

/**
 * CustomPagination - Custom pagination component
 *                    Use the parameters received to manage the information in pages.
 *                    Optimizes a cache to store the information already obtained.
 *  *
 * @param props - fShowTotalResults - function responsible for displaying the total items.
 * @param props - fGet - function responsible for requesting data
 * @param props - totalItems - Total publications that correspond to the search criteria.
 * @param props - itemsPerPage - Number of items to displau per page
 * @param props - fView - function responsible for exposing the elements of a page in the view
 *
 * @returns - JSX Element
 */

const CustomPagination = (props: any) => {
  const fGet = props.fGet;
  const fView = props.fView;
  const fShowTotalResults = props.fShowTotalResults;
  const itemsPerPage = props.itemsPerPage;
  const totalItems = props.totalItems;

  const MAX_PAGES_IN_MEMORY = 10;
  const MAX_PAGES_IN_PAGE_VIEWER = 5;

  const [maxPagesView, setMaxPagesView] = useState(MAX_PAGES_IN_PAGE_VIEWER); // Maximum number of pages in viewer.
  const [totalPages] = useState(
    props.itemsPerPage > props.totalItems
      ? 1
      : Math.ceil(props.totalItems / props.itemsPerPage)
  ); // Maximum number of pages in viewer.

  /* ---------------------------------------------- */

  const [statePageList, dispatchPageList] = useReducer(
    pageListsReducer,
    pageListInitialState
  ); // pages available in the page viewer
  const [statePageMap, dispatchPageMap] = useReducer(
    pageMapReducer,
    pageMapInitialState
  ); // Cached data.

  /* ---------------------------------------------- */

  const [bcheckParameters, setBcheckParameters] = useState(false); // Control indicator of received parameters( false indicates that they are not valid)
  const [bLoading, setBLoading] = useState(false); //Information loading indicator (false indicates upload nor done)
  const [indCurrentPageView, setIndCurrentPageView] = useState(-1); // Active page number - Iniital page = -1 (Not initialized)

  /* ---------------------------------------------- */

  useEffect(() => {
    /**
     * checkParameters - control of received parameters
     */
    const checkParameters = () => {
      if (totalItems && itemsPerPage) {
        setBcheckParameters(true);
      } else {
        setBcheckParameters(false);
      }
    };
    checkParameters();
  }, [totalItems, itemsPerPage]);

  useEffect(() => {
    /**
     * updateParameters - totalPages state setting.
     */
     const updateParameters = () => {
      if (totalPages < maxPagesView) setMaxPagesView(totalPages);
    };
    if (bcheckParameters) updateParameters();

    /**
     * setInitialPages -  initial state of page viewer
     */
    const setInitialPages = () => {
      let _pagesView = [];
      for (let i = 1; i <= maxPagesView; i++) _pagesView.push(i);
      dispatchPageList({
        type: pageActions.UPDATE_PAGE_VIEWER,
        payload: _pagesView,
      });
      // Initial state of scroll handles in the page viewer.
      // If there is only one page, all indicators will be false by default.
      if (totalPages > 1) {
        dispatchPageList({ type: pageActions.ACTIVATE_LAST });
        dispatchPageList({ type: pageActions.ACTIVATE_NEXT });
        //If there are fewer or equal pages than the maximum number of pages that can be displayed in the viewer, the right ellipsis are enabled.
        if (totalPages > maxPagesView)
          dispatchPageList({ type: pageActions.ACTIVATE_ELLIPSE_RIGTH });
      }
    };
/*
    const setInitialMap = () => {
      dispatchPageMap({
        type: pageMapActions.RESET_ITEM_PAGE_MAP,
        payload: [],
      });
    }
    */
    if (bcheckParameters) setInitialPages();
    // if (bcheckParameters) setInitialMap();
    if (bcheckParameters) setIndCurrentPageView(0);
  }, [bcheckParameters, totalPages, maxPagesView]);

  useEffect(() => {
    /**
     * fInitiaLoad - Get the initial information of the active 1.
     *               It looks for it using the function provideed when invoking the present component.
     */
     
    const fInitiaLoad = async () => {
      const res = await fGet(1, itemsPerPage);
      const pageToAdd: iPageItem = {
        pageNumber: 1,
        data: res,
        accessCount: 1,
        accessTime: Date.now(),
      };
      // The new page is added to the array.
      dispatchPageMap({
        type: pageMapActions.INSERT_ITEM_PAGE_MAP,
        payload: pageToAdd,
      });
    };

    if (!bLoading) {
      fInitiaLoad();
      setBLoading(true);
    }
  }, [fGet, itemsPerPage, bLoading]);

  /**
   * pageRemove -  Determines which page should be removed from the cache when the cache is full and needs to process a new page.
   *
   * @returns - The page that was least consulted, and oldest (time) is selected.
   */

  const pageRemove = async () => {
      return( statePageMap.pageItems.reduce(
        (previous: iPageItem, current: iPageItem) => {
          let result: iPageItem;
          if (current.accessCount < previous.accessCount) {
            result = current;
          } else {
            if (current.accessCount === previous.accessCount) {
              if (current.accessTime < previous.accessTime) {
                result = current;
              } else {
                result = previous;
              }
            } else {
              result = previous;
            }
          }
          return result;
        }
      )
    )
   }
  
  /* ---------------------------------------------- */

  /**
   * fData - Get the information of the active page.
   *         If its in cache it retrieves it.
   *         If not, it looks for it using the function provideed when invoking the present component.
   */

  const fData = async (page: number) => {
    const bPositionPage = statePageMap.pageItems.findIndex(
      (element: iPageItem) => element.pageNumber === page
    );
    if (bPositionPage === -1) {
      // Not found. The requested page is not stored in memory.
      if (statePageMap.pageItems.length >= MAX_PAGES_IN_MEMORY) {
        // It is analyzed if the map is full
        // The page that was least consulted, and oldest (time) is eliminated from the array
        const pageToRemove = (await pageRemove()).pageNumber;
        dispatchPageMap({
          type: pageMapActions.DELETE_ITEM_PAGE_MAP,
          payload: pageToRemove,
        });
      }
      const res = await fGet(page, itemsPerPage);
      const pageToAdd: iPageItem = {
        pageNumber: page,
        data: res,
        accessCount: 1,
        accessTime: Date.now(),
      };
      // The new page is added to the array.
      dispatchPageMap({
        type: pageMapActions.INSERT_ITEM_PAGE_MAP,
        payload: pageToAdd,
      });
    } else {
      dispatchPageMap({
        type: pageMapActions.UPDATE_ACCESS_ITEM_PAGE_MAP,
        payload: bPositionPage,
      });
    }
  };

  /**
   * fSelectItem - (handler) Activa the selected page in the viewer and adjusts controls.
   *
   * @param id - Page selected.
   * @param ind - Position in the  page viewer
   */
  const fSelectItem = (id: number, ind: number): void => {
    if (ind === indCurrentPageView) return;
    fData(statePageList.pageView[ind]);
    if (id === 1) {
      dispatchPageList({ type: pageActions.DEACTIVATE_FIRST });
      dispatchPageList({ type: pageActions.DEACTIVATE_PREV });
      dispatchPageList({ type: pageActions.DEACTIVATE_ELLIPSE_LEFT });
    } else {
      if (id === totalPages) {
        dispatchPageList({ type: pageActions.DEACTIVATE_LAST });
        dispatchPageList({ type: pageActions.DEACTIVATE_NEXT });
        dispatchPageList({ type: pageActions.DEACTIVATE_ELLIPSE_RIGTH });
      }
    }
    if (statePageList.pageView[indCurrentPageView] === 1) {
      dispatchPageList({ type: pageActions.ACTIVATE_FIRST });
      dispatchPageList({ type: pageActions.ACTIVATE_PREV });
      if (totalPages > maxPagesView)
        dispatchPageList({ type: pageActions.ACTIVATE_ELLIPSE_LEFT });
    } else {
      if (statePageList.pageView[indCurrentPageView] === totalPages) {
        dispatchPageList({ type: pageActions.ACTIVATE_LAST });
        dispatchPageList({ type: pageActions.ACTIVATE_NEXT });
        if (totalPages > maxPagesView)
          dispatchPageList({ type: pageActions.ACTIVATE_ELLIPSE_RIGTH });
      }
    }
    setIndCurrentPageView(ind);
  };

  /**
   * fFirst - (handler) - Activated the first page and adjust controls.
   */
  const fFirst = () => {
    dispatchPageList({ type: pageActions.DEACTIVATE_FIRST });
    dispatchPageList({ type: pageActions.DEACTIVATE_PREV });
    dispatchPageList({ type: pageActions.DEACTIVATE_ELLIPSE_LEFT });
    setIndCurrentPageView(0);
    if (totalPages > 1) {
      dispatchPageList({ type: pageActions.ACTIVATE_LAST });
      dispatchPageList({ type: pageActions.ACTIVATE_NEXT });
    }
    if (totalPages > maxPagesView)
      dispatchPageList({ type: pageActions.ACTIVATE_ELLIPSE_RIGTH });

    if (totalPages > maxPagesView) {
      let _pagesView = [];
      for (let i = 0, value = 1; i < maxPagesView; i--, value++) {
        _pagesView.push(value);
      }
      dispatchPageList({
        type: pageActions.UPDATE_PAGE_VIEWER,
        payload: _pagesView,
      });
    }
    fData(1);
  };

  /**
   * fPrev -  (handler) - Activated the previous page and adjust controls.
   */
  const fPrev = () => {
    if (indCurrentPageView === 0) {
      // We are in the first position of the page viewer.
      if (statePageList.pageView[indCurrentPageView] !== 1) {
        // The first position of the display does not reference page 1.
        let _pagesView = [];
        for (
          let i = 0, value = statePageList.pageView[indCurrentPageView] - 1;
          i < maxPagesView;
          i--, value++
        ) {
          _pagesView.push(value);
        }
        fData(statePageList.pageView[indCurrentPageView] - 1);
        if (statePageList.pageView[indCurrentPageView] - 1 === 1) {
          dispatchPageList({ type: pageActions.DEACTIVATE_ELLIPSE_LEFT });
          dispatchPageList({ type: pageActions.DEACTIVATE_FIRST });
          dispatchPageList({ type: pageActions.DEACTIVATE_PREV });
        }
        dispatchPageList({
          type: pageActions.UPDATE_PAGE_VIEWER,
          payload: _pagesView,
        });
      }
      // else if not possible.
      // The first position of the display refers to page 1. Left scroll would not be available under these conditions.
    } else {
      // We are not in the first position of the page viewer
      if (indCurrentPageView - 1 === 0) {
        // When we move we reach the first position of the page viewer.
        if (statePageList.pageView[indCurrentPageView] - 1 === 1) {
          // If we reach page 1
          dispatchPageList({ type: pageActions.DEACTIVATE_ELLIPSE_LEFT });
          dispatchPageList({ type: pageActions.DEACTIVATE_FIRST });
          dispatchPageList({ type: pageActions.DEACTIVATE_PREV });
        }
      }
      fData(statePageList.pageView[indCurrentPageView] - 1);
    }

    if (indCurrentPageView - 1 >= 0) {
      // If we are not in the first entry of the page viewer, we move one place to the left.
      setIndCurrentPageView(indCurrentPageView - 1);
      if (totalPages > 1) {
        dispatchPageList({ type: pageActions.ACTIVATE_LAST });
        dispatchPageList({ type: pageActions.ACTIVATE_NEXT });
      }
      if (totalPages > maxPagesView)
        dispatchPageList({ type: pageActions.ACTIVATE_ELLIPSE_RIGTH });
    }
  };

  /**
   * fLast  -  (handler) - Activated the last page and adjust controls.
   */
  const fLast = () => {
    fData(totalPages);
    dispatchPageList({ type: pageActions.DEACTIVATE_ELLIPSE_RIGTH });
    if (totalPages > maxPagesView) {
      let _pagesView = [];
      for (
        let i = maxPagesView, value = totalPages - maxPagesView + 1;
        i > 0;
        i--, value++
      ) {
        _pagesView.push(value);
      }
      dispatchPageList({
        type: pageActions.UPDATE_PAGE_VIEWER,
        payload: _pagesView,
      });
    }
    dispatchPageList({ type: pageActions.DEACTIVATE_LAST });
    dispatchPageList({ type: pageActions.DEACTIVATE_NEXT });
    if (totalPages > 1) {
      dispatchPageList({ type: pageActions.ACTIVATE_FIRST });
      dispatchPageList({ type: pageActions.ACTIVATE_PREV });
    }
    if (totalPages > maxPagesView)
      dispatchPageList({ type: pageActions.ACTIVATE_ELLIPSE_LEFT });
    setIndCurrentPageView(maxPagesView - 1);
  };

  /**
   * fNext (handler) - Activated the next page and adjust controls.
   */
  const fNext = () => {
    if (indCurrentPageView === maxPagesView - 1) {
      // We are in the last position of the page viewer
      if (statePageList.pageView[indCurrentPageView] !== totalPages) {
        // The last position of the viewer does not refer to the last page
        fData(statePageList.pageView[indCurrentPageView] + 1);
        let _pagesView = [];
        for (
          let i = 0, value = statePageList.pageView[indCurrentPageView] + 1;
          i < maxPagesView;
          i--, value++
        ) {
          _pagesView.push(value);
        }
        dispatchPageList({
          type: pageActions.UPDATE_PAGE_VIEWER,
          payload: _pagesView,
        });
        if (statePageList.pageView[indCurrentPageView] + 1 === totalPages) {
          dispatchPageList({ type: pageActions.DEACTIVATE_ELLIPSE_RIGTH });
          dispatchPageList({ type: pageActions.DEACTIVATE_LAST });
          dispatchPageList({ type: pageActions.DEACTIVATE_NEXT });
        }
      }
    } else {
      // We are not in the last position of the page viewer
      if (indCurrentPageView + 1 === maxPagesView - 1) {
        if (statePageList.pageView[indCurrentPageView] + 1 === totalPages) {
          // If we reach the last page
          dispatchPageList({ type: pageActions.DEACTIVATE_ELLIPSE_RIGTH });
          dispatchPageList({ type: pageActions.DEACTIVATE_LAST });
          dispatchPageList({ type: pageActions.DEACTIVATE_NEXT });
        }
      }
      fData(statePageList.pageView[indCurrentPageView] + 1);
    }

    if (indCurrentPageView + 1 <= maxPagesView) {
      setIndCurrentPageView(indCurrentPageView + 1);
      if (totalPages > 1) {
        dispatchPageList({ type: pageActions.ACTIVATE_FIRST });
        dispatchPageList({ type: pageActions.ACTIVATE_PREV });
      }
      if (totalPages > maxPagesView)
        dispatchPageList({ type: pageActions.ACTIVATE_ELLIPSE_LEFT });
    }
  };

  /**
   * fPageCurrentItem - Identifies the next item of information to display
   *
   * @returns
   */
  const fPageCurrentItem = () => {
    const item =
      statePageMap.pageItems.find(
        (item) => item.pageNumber === statePageList.pageView[indCurrentPageView]
      ) || null;
    if (item !== null && item.data !== null) return item.data;
    return [];
  };

  /* ---------------------------------------------- */

  return (
    <React.Fragment>
      {bcheckParameters && indCurrentPageView > -1 ? (
        <>
          <div className="results">
            {fShowTotalResults()}
            {totalItems && (
              <Pagination>
                {statePageList.bFlagFirst ? (
                  <Pagination.First onClick={fFirst} />
                ) : (
                  ""
                )}
                {statePageList.bFlagPrev ? (
                  <Pagination.Prev onClick={fPrev} />
                ) : (
                  ""
                )}
                {statePageList.bFlagEllipseLeft ? <Pagination.Ellipsis /> : ""}
                {statePageList.pageView.map((page: number, ind: number) => {
                  return (
                    <Pagination.Item
                      key={page}
                      active={ind === indCurrentPageView}
                      onClick={() => fSelectItem(page, ind)}
                    >
                      {page}
                    </Pagination.Item>
                  );
                })}
                {statePageList.bFlagEllipseRight ? <Pagination.Ellipsis /> : ""}
                {statePageList.bFlagNext ? (
                  <Pagination.Next onClick={fNext} />
                ) : (
                  ""
                )}
                {statePageList.bFlagLast ? (
                  <Pagination.Last onClick={fLast} />
                ) : (
                  ""
                )}
              </Pagination>
            )}
          </div>
          {props.totalItems &&
          bLoading &&
          indCurrentPageView > -1 &&
          statePageList.pageView[indCurrentPageView] !== undefined
            ? fPageCurrentItem().map((e: any, ind: number) => {
                return <React.Fragment key={ind}> {fView(e)} </React.Fragment>;
              })
            : ""}
        </>
      ) : (
        "No results found."
      )}
    </React.Fragment>
  );
};

export default CustomPagination;

/* ---------------------------------------------- */
