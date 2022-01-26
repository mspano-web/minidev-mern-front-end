/**
 * Publications.tsx - Exhibition of current publications.
 */

import React, { useState, useEffect, useCallback } from "react";
import * as axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useParams } from "react-router";
import * as publicationService from "./PublicationsService";
import { Row, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import PublishItemCard from "./PublishItemCard/PublishItemCard";
import CustomPagination from "../../components/CustomPagination/CustomPagination";
import "./Publicationss.css";
import Errors from "../../components/Errors/Errors";
import { ICategory } from "../../common/types/CategoriesType";
import * as categoriesService from "../Categories/CategoriesService";

/**
 * Publications - The component defines the base functionality that the paging component should use.
 *  *               Functional component
 *
 * @returns - JSX Element
 */

const Publications = () => {
  const ITMES_PER_PAGE: number = 6;

  // Comments - Array destructuring. It returns an array of two positions, with the value that we are going to maintain the
  //               state and the function that is going to update it.
  const [countPublications, setCountPublications] = useState(0);
  const [loadingCount, setLoadingCount] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(ITMES_PER_PAGE);
  const [error, setError] = useState({ message: "", status: false });
  const [category, setCategory] = useState<ICategory>({
    _id: "",
    cat_flag_single: false,
    cat_description: "",
  });

  type ServerError = { errorMessage: string };
  const navigate = useNavigate();
  let { search } = useParams();

  // Initial state when change the search parameter
  useEffect(() => {
    let ignore = false;
    if (!ignore) setItemsPerPage(ITMES_PER_PAGE);
    if (!ignore) setLoadingCount(false);
    if (!ignore) setCountPublications(0);
    return () => {
      // Comment - Cleanup function executed when unmounting the component (this is optional).
      ignore = true; // Control to avoid the change of state of the component after it is unmounted.
    };
  }, [search]);

  // Life cycle of the functional component.
  //     It allows to manage the phases: mount, update and dismount..
  useEffect(() => {
    /**
     * loadTotals - Determines the total number of publications that meet the search criteria, calling the corresponding service.
     *
     * @returns - Total number of publications.
     */
    let ignore = false;

    const loadTotals = async () => {
      let count: number = 0;
      if (search === "@all" || search === undefined) {
        count = await publicationService.getPublishsAllTotal();
      } else {
        if (search.startsWith("@cat-")) {
          count = await publicationService.getPublishsByCategoryTotal(
            search.substr("@cat-".length)
          );
        } else {
          count = await publicationService.getPublishsByTitleTotal(search);
        }
      }

      let serverError: any;
      if (axios.default.isAxiosError(count)) {
        serverError = count as axios.AxiosError<ServerError>;
        if (serverError && serverError.response) {
          toast.error(`${serverError.response.data}.`, { autoClose: 3000 });
          if (!ignore)
            setError({
              message: "We are sorry. Your request could not be processed.",
              status: true,
            });
          return;
        }
      }
      if (!ignore) setCountPublications(count);
      if (count && !ignore) setLoadingCount(true);
      if (count < itemsPerPage && !ignore) {
        setItemsPerPage(count);
      }
    };
    loadTotals();
    return () => {
      ignore = true;
    };
  }, [search, itemsPerPage]);

  /* Comments - 
                   Without any parameters, the content of useEffect is executed every time the component is rendered.
                       It is the equivalent of the upgrade phase of the component life cycle.
                   In this case, the dependency is established with the state variable "search".
                       In other words, the useEffect will only be executed when this variable modifies its value.
                      This behavior is associated with the update phase of the component lifecycle, but only associated with
                        the state variables in the list.
                   If you want the useEffect to be executed only once, then an empty array is set as a parameter.
                   This behavior is associated with the mount phase of the component life cycle.
   */

  useEffect(() => {
    /**
     * loadCategory - Obtains the data of the selected category by invoking the corresponding service.
     *
     * @returns - Category found.
     */
    let ignore = false;

    const loadCategory = async () => {
      if (search === undefined) return "Category without description";
      const res: ICategory = await categoriesService.getCategory(
        search.substr("@cat-".length)
      );

      let serverError: any;
      if (axios.default.isAxiosError(res)) {
        serverError = res as axios.AxiosError<ServerError>;
        if (serverError && serverError.response) {
          toast.error(`${serverError.response.data}.`, { autoClose: 3000 });
          if (!ignore) 
           setError({
             message: "We are sorry. Your request could not be processed.",
             status: true,
          });
          return;
        }
      }
      if (!ignore) setCategory(res);
    };

    if (search !== undefined && search.startsWith("@cat-")) loadCategory();
    return () => {
      ignore = true;
    };
  }, [search]);

  /**
   * loadSearch - Function responsible for requesting the publications that match certain criteria, based on the input parameters.
   *              This function is passed to the pagination component so that it can be used when it is necessary to retrieve
   *                 publications from a certain page.
   *
   * @param currentPage - active page
   * @param itemsPerPage - Number of publications per page.
   * @returns - Publication data.
   */

  const loadSearch = useCallback(
    async (currentPage: number, itemsPerPage: number) => {
      let res;
      if (search === "@all" || search === undefined) {
        res = await publicationService.getPublishsAll(
          currentPage,
          itemsPerPage
        );
      } else {
        if (search.startsWith("@cat-")) {
          res = await publicationService.getPublishsByCategory(
            search.substr("@cat-".length),
            currentPage,
            itemsPerPage
          );
        } else {
          res = await publicationService.getPublishsByTitle(
            search,
            currentPage,
            itemsPerPage
          );
        }
      }

      let serverError: any;
      if (axios.default.isAxiosError(res)) {
        serverError = res as axios.AxiosError<ServerError>;
        if (serverError && serverError.response) {
          toast.error(`${serverError.response.data}.`, { autoClose: 2000 });
          setError({
            message: "We are sorry. Your request could not be processed.",
            status: true,
          });
          return;
        }
      }

      if (!res.length) {
        toast.warning("No results found.", { autoClose: 2000 });
        setError({
          message: "No results found.",
          status: true,
        });
        return;
      }

      toast.info("Successful search!", { autoClose: 1000 });
      return res;
    },
    [search]
  );

  /**
   * handleClickPublish - Click event handler. It is executed when the user clicks on a publication. This function forwards
   *                        the flow to the detail page of the selected publication.
   *
   * @param id - publication id
   */

  const handleClickPublish = (id: string): void => {
    navigate(`/publications/details/${id}`);
  };

  /**
   * fView -Sets the view to display a publication.
   *        This function will be passed to the pagination generic component to handle the publications view.
   *
   * @param data - Publication Data
   * @returns - JSX Element
   */
  const fView = (data: any) => {
    return (
      <PublishItemCard
        key={data._id}
        publish={data}
        onClickPublish={handleClickPublish}
      /> 
    );
  };

  /**
   * fShowTotalResults - Set the view to display the total number of publications.
   *                     This function will be passed to the pagination generic component to handle the total number of publications view.
   *
   * @returns - JSX Element
   */

  const fShowTotalResults = useCallback(() => {
    return (
      <h2>
        {" "}
        {countPublications} results for{" "}
        {search === "@all"
          ? "ALL"
          : search?.includes("@cat")
          ? "Category " + category.cat_description
          : "'" + search + "'"}{" "}
      </h2>
    );
  }, [countPublications, search, category.cat_description]);

  /* -------------------------------------- */

  return (
    <React.Fragment>
      {error.status && <Errors message={error.message} />}

      {!error.status && (
        <Container fluid className="publications-styles">
          <Row>
            {loadingCount ? (
              <CustomPagination
                fShowTotalResults={fShowTotalResults}
                fGet={loadSearch}
                totalItems={countPublications}
                itemsPerPage={itemsPerPage}
                fView={fView}
              />
            ) : (
              <p className="pub-no-results">No results found.</p>
            )}
          </Row>
        </Container>
      )}
      {!error.status && <ToastContainer />}
    </React.Fragment>
  );
};

export default Publications;
