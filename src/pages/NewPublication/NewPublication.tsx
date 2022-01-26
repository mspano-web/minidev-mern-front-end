/**
 * NewPublication.tsx - Register a new publication
 */

import React, { useEffect, useState, ChangeEvent, FormEvent, useCallback } from "react";
import { useParams } from "react-router";
import MediaQuery from "react-responsive";
import { ScreenSize } from "../../helpers/mediaquery";
import { IProduct } from "../../common/types/ProductsType";
import * as publishDetailsService from "./NewPublicationService";
import * as axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ICategory } from "../../common/types/CategoriesType";
import * as categoryService from "../Categories/CategoriesService";
//import { IPublication } from "../../common/types/PublicationsType";
import { IPublicationNew } from "./NewPublicationType"
import {
  Form,
  Button,
  Container,
  Card,
  Row,
  Col,
  Image,
  Carousel,
} from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Errors from "../../components/Errors/Errors"
import { useHttpHeader} from "../../common/hooks/useHttpHeader"
import { AxiosRequestConfig } from "axios";
import { imagesPath } from "../../helpers/environment"
import { useWaitToRedirect } from "../../common/hooks/useWaitToRedirect";
import { USER_LOGIN } from "../../common/types/UserType"
import "./NewPublication.css";

const moment = require("moment");

/**
 * NewPublication - Funcional component
 *
 * @returns - JSC Element
 */

const NewPublication = () => {
  let { id } = useParams(); // Product ID
  type ServerError = { errorMessage: string };
  const header  =  useHttpHeader()

  /* ------------------------------------- */

  const initialProductValue: IProduct = {
    // Default initial value
    _id: "",
    prod_title: "",
    prod_description: "",
    prod_price: 0,
    category: {
      _id: "",
      cat_flag_single: false,
      cat_description: "",
    },
    images: [],
  };

  const initialPublicationValue: IPublicationNew = {
    // Default initial value
    pub_title: "",
    pub_description: "",
    category: {
      _id: "",
      cat_flag_single: false,
      cat_description: "",
    },
    pub_price: 0,
    pub_create_date: new Date(),
    pub_due_date: moment(new Date()).format("YYYY-MM-DD"),
    products: [],
  };

  /* ------------------------------------- */

  const [product, setProduct] = useState<IProduct>(initialProductValue);
  const [publication, setPublication] = useState<IPublicationNew>(initialPublicationValue);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [category, setCategory] = useState("");
  const [dueDate, setDueDate] = useState(new Date());
  const [error, setError] = useState({ message: "", status: false})

  const [waitExit, setWaitExit] = useState(false);
  const timeWait = 5000; //ms
  const redirectPage = "/"; //home

  type InputChange = ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;

  /* ------------------------------------- */


/**
* checkStatus - Preliminary checks. User logged in. Header with information.
*/
   const checkStatus = useCallback( async() => {
    let ignore = false;

     if (header === null || header === undefined) setError({message: "The request cannot be processed.", status: true}) 
     if (sessionStorage.login_user) 
       if (sessionStorage.getItem('login_user') !== USER_LOGIN) {
          if (!ignore) setError({message: "You must log into the application to perform this operation.", status: true}) 
          if (!ignore) setWaitExit(true);
       }
      return () => {   
        ignore = true; 
      };
  
   }, [header])
 
   useEffect(() => {
     checkStatus();
   }, [checkStatus]);

  useEffect(() => {
    /**
     * loadProducts - Retrieves the information of one product by consulting the corresponding service.
     *
     * @returns - Product data
     */

    let ignore = false;

    const loadProduct = async () => {
      let res: IProduct;

      if (id === undefined) {
        if (!ignore) setError({message: "We are sorry. Your request could not be processed.", status: true}) 
        return
      }

      res = await publishDetailsService.getProduct(id);
      let serverError: any;
      if (axios.default.isAxiosError(res)) {
        serverError = res as axios.AxiosError<ServerError>;
        if (serverError && serverError.response) {
          toast.error(`${serverError.response.data}.`, { autoClose: 3000 });
          if (!ignore) setError({message: "We are sorry. Your request could not be processed.", status: true}) 
          return;
        }
      }

      if (res !== undefined && !res) {
        toast.warning("No articles found.", { autoClose: 2000 });
        if (!ignore) setError({message: "We are sorry. No articles found.", status: true}) 
        return ;
      } else {
        if (!ignore) setProduct(res);
        toast.info("Successful search!", { autoClose: 1000 });

        // Initializes the publication based on the data of the retrieved product data.

        const publicationInitial: IPublicationNew = {
          pub_title: res.prod_title,
          pub_description: res.prod_description,
          category: {
            _id: res.category._id,
            cat_flag_single: res.category.cat_flag_single,
            cat_description: res.category.cat_description,
          },
          pub_price: res.prod_price,
          pub_create_date: new Date(),
          pub_due_date: moment(new Date()).format("YYYY-MM-DD"),
          products: [],
        };
        publicationInitial.products.push(res);
        if (!ignore) setPublication(publicationInitial);
        if (!ignore) setCategory(res.category._id);
        return;
      }
    };
    if (!waitExit) loadProduct() 
    return () => {   // Comment - Cleanup function executed when unmounting the component (this is optional).
      ignore = true; // Control to avoid the change of state of the component after it is unmounted.
    };
  }, [id, waitExit]);

  useEffect(() => {
    let ignore = false;

    const loadCategories = async () => {
      const res = await categoryService.getCategories(); // It could be improved by controlling the return of Axios.
      if (!ignore) setCategories(res);
    };
    if(!waitExit) loadCategories();
    return () => {   // Comment - Cleanup function executed when unmounting the component (this is optional).
      ignore = true; // Control to avoid the change of state of the component after it is unmounted.
    };
  }, [waitExit]);

  /**
   * handleInputChange
   *
   *    It captures typing events generated when entering values ​​in the html fields,
   *      and sets the corresponding internal state variable with the value entered in the "input".
   *   This function is associated by placing "onChange = {handleInputChange}" in the "input" of the form.
   *    A correspondence is defined between the names of the inputs in the HTML and the fields of the state variable Publication
   *
   * @param e - Event information.
   */

  const handleInputChange = (e: InputChange) => {
    setPublication({ ...publication, [e.target.id]: e.target.value });
  };

  /**
   * handleSubmit - Process the information uploaded in the publication form.
   *
   * @param e - Form event
   */

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

     toast.promise(publishDetailsService.createPublication(publication, header as AxiosRequestConfig), {
      pending: {
        render({ data }) {
          return `In progress.....`;
        },
        className: "custom-toast",
        position: toast.POSITION.TOP_RIGHT,
      },
      success: {
        render({ data }) {
          return `Publication ok!`;
        },
        className: "custom-toast",
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        icon: "🟢",
      },
      error: {
        render({ data }) {
          return `We're sorry. An error has occurred. Your request could not be processed.`;
        },
        className: "custom-toast",
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
        icon: "🔴",
      },
    })
    .then(() => setWaitExit(true))
    .catch(() => setWaitExit(true));
  };

  /**
   * handleChangeDate - Handles the expiration date change, formatting the value received from the UI
   *
   * @param date - New due date
   */
  const handleChangeDate = (date: Date) => {
    const dueDateFormat = moment(date).format("YYYY-MM-DD");
    setPublication({ ...publication, pub_due_date: dueDateFormat });
    setDueDate(date);
  };

  /**
   * handleCategoryChange - Manages the category change.
   *                        Updates the post status with the value of the selected category.
   *
   * @param e - event
   */
  const handleCategoryChange = (e: InputChange) => {
    const filterCat = categories.find(function (element) {
      return element._id.toString() === e.target.value;
    });
    if (filterCat) {
      setCategory(e.target.value);
      setPublication({ ...publication, category: filterCat });
    }
  };

  /**
   * handleCancel - Cancel the publication in progress.
   *
   * @returns  The false return prevents the form submit from executing.
   */
  const handleCancel = () => {
    setWaitExit(true)
    toast.warning("Article publication canceled!", { autoClose: 3000 });
    return false;
  };

  useWaitToRedirect(redirectPage, timeWait, waitExit);

  /* ------------------------------------- */

  return (
    <React.Fragment>
      <MediaQuery
        minWidth={ScreenSize.isMobile}
        maxWidth={ScreenSize.isDesktop - 1}
      >
        <h1 className="new-publication-title">
          {" "}
          We're sorry! Article publication only available in full desktop.{" "}
        </h1>
      </MediaQuery>

      { error.status && 
      <MediaQuery minWidth={ScreenSize.isDesktop}>
        <Errors message={error.message} />
      </MediaQuery>
      }
      { !error.status && <MediaQuery minWidth={ScreenSize.isDesktop}>
        <h1 className="text-center  new-publication-title">Publish article</h1>
        <Container fluid className="new-publication-container">
          <Row className="new-publication-row">
            <Col lg={7}>
              <Card className="ms-3">
                <Card.Body className="new-publication-card-body">
                  <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="pub_title">
                      <Form.Control
                        type="text"
                        placeholder="Enter title"
                        autoFocus
                        value={publication.pub_title}
                        onChange={handleInputChange}
                        required
                      />
                    </Form.Group>

                    {/*In the future, to allow publications with various products. Category could be selected. */}
                    {/*    It should be checked that the selection is made for a multi-product category. */}
                    <Form.Group className="mb-3" controlId="category">
                      <Form.Control
                        type="text"
                        as="select"
                        value={category}
                        onChange={(e) => {
                          handleCategoryChange(e);
                        }}
                        disabled
                      >
                        <option className="d-none" value="">
                          Select Category
                        </option>
                        {categories.map((item, i) => (
                          <option key={item._id} value={item._id}>
                            {item.cat_description}
                          </option>
                        ))}
                      </Form.Control>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="pub_description">
                      <Form.Control
                        as="textarea"
                        rows={3}
                        type="textarea"
                        placeholder="Enter description"
                        value={publication.pub_description}
                        onChange={handleInputChange}
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="pub_price">
                      <Form.Control
                        type="text"
                        placeholder="Enter price"
                        value={publication.pub_price}
                        onChange={handleInputChange}
                        required
                        className="new-publication-price"
                      />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="pub_due_date">
                      <DatePicker
                        selected={dueDate}
                        onChange={handleChangeDate}
                        dateFormat="dd-MM-yyyy"
                        placeholderText="Enter due date"
                      />
                    </Form.Group>

                    <p className="new-publication-created-date mb-2">
                      {" "}
                      <b>
                        Publication date{" "}
                        {moment(publication.pub_create_date).format(
                          "DD-MM-YYYY"
                        )}
                      </b>
                    </p>

                    <div className="new-publication-bottons">
                      <div className="mt-3">
                        <Button
                          size="lg"
                          type="submit"
                          className="new-publication-confirm-button"
                        >
                          Publish article
                        </Button>
                      </div>

                      <div className="mt-3">
                        <Button
                          size="lg"
                          type="button"
                          className="new-publication-cancel-button"
                          onClick={handleCancel}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={5}>
              <Carousel>
                {product.images.map((image) => {
                  return (
                    <Carousel.Item
                      interval={3000}
                      key={image.img_filename}
                      className="new-publication-carousel"
                    >
                      <Image
                        width="100%"
                        height="auto"
                        src={`${imagesPath()}products/${image.img_filename}.${image.img_extension}`}
                        rounded
                      />
                    </Carousel.Item>
                  );
                })}
              </Carousel>
            </Col>
          </Row>
        </Container>
      </MediaQuery>
      }
      { !error.status && <ToastContainer />}
    </React.Fragment>
  );
};

export default NewPublication;
