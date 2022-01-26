/**
 * PublicationsDetails.tsx
 */

import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { IPublication } from "../../common/types/PublicationsType";
import Sales from "./Sales/Sales";
import {
  Row,
  Container,
  Col,
  Image,
  Card,
  Button,
  ListGroup,
  Carousel,
} from "react-bootstrap";
import * as publicationDetailsService from "./PublicationsDetailsService";
import * as axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import Errors from "../../components/Errors/Errors";
import MediaQuery from "react-responsive";
import { ScreenSize } from "../../helpers/mediaquery";
import { imagesPath } from "../../helpers/environment";
import { USER_LOGIN } from "../../common/types/UserType"
import "./PublicationsDetails.css";

interface ImageFile {
  img_filename: string;
  img_extension: string;
}

/**
 * PublicationDetails
 *                     Functional component
 *
 * @returns - JSX Element
 */

const PublicationDetails = () => {
  const initialPublicationValue: IPublication = {
    _id: "",
    pub_title: "",
    pub_description: "",
    category: {
      _id: "",
      cat_flag_single: false,
      cat_description: "",
    },
    pub_price: 0,
    pub_create_date: "",
    pub_due_date: "",
    products: [],
  };

  const [publication, setPublication] = useState<IPublication>(
    initialPublicationValue
  );
  const [listImages, setListImages] = useState<ImageFile[]>([]);
  const [buy, setBuy] = useState(false);
  const stateShipping = useSelector((state: any) => state.shipping);
  const [error, setError] = useState({ message: "", status: false });

  const [isLogin, setIsLogin] = useState(false);

  type ServerError = { errorMessage: string };

  let { id } = useParams();

  useEffect(() => {
    let ignore = false;

    if (sessionStorage.login_user) {
      const loginUser = sessionStorage.getItem("login_user");
      if (loginUser === USER_LOGIN) {
        if (!ignore) setIsLogin(true);
      }
    }
    return () => {
      // Comment - Cleanup function executed when unmounting the component (this is optional).
      ignore = true; // Control to avoid the change of state of the component after it is unmounted.
    };
  }, []);

  useEffect(() => {
    /**
     * loadSearch - Function in charge of requesting the data of the publication that meets the indicated id,
     *               by invoking the corresponding service.
     *
     * @returns - Publication Data
     */

     let ignore = false;

     const loadSearch = async () => {
      let res: IPublication;

      if (id === undefined) {
        if (!ignore) setError({
          message: "We are sorry. Your request could not be processed.",
          status: true,
        });
        return;
      }
      res = await publicationDetailsService.getPublishsById(id);

      let serverError: any;
      if (axios.default.isAxiosError(res)) {
        serverError = res as axios.AxiosError<ServerError>;
        if (serverError && serverError.response) {
          toast.error(`${serverError.response.data}.`, { autoClose: 3000 });
          if (!ignore)  setError({
            message: "We are sorry. Your request could not be processed.",
            status: true,
          });
          return;
        }
      }

      if (res !== undefined && !res) {
        toast.warning("No results found.", { autoClose: 2000 });
        if (!ignore) setError({
          message: "We are sorry. No publication details found.",
          status: true,
        });
        return;
      } else {
        if (!ignore) setPublication(res);
        toast.info("Successful search!", { autoClose: 1000 });

        const imageList: ImageFile[] = res.products[0].images.map((image) => {
          const imageItem = {
            img_filename: image.img_filename,
            img_extension: image.img_extension,
          };
          return imageItem;
        });
        if (!ignore) setListImages(imageList);
      }
    };

    loadSearch();
    return () => {
      ignore = true; 
    };
  }, [id]);

  /**
   * buyNow - Handler onClick buy button. Sets the status of the component indicating that the user selected the buy option.
   */

  const buyNow = () => {
    setBuy(true);
  };

  /* --------------------------------- */

  return (
    <React.Fragment>
      {error.status && <Errors message={error.message} />}
      {!error.status && (
        <MediaQuery
          minWidth={ScreenSize.isMobile}
          maxWidth={ScreenSize.isTablet - 1}
        >
          <Container fluid>
            <Row className="pub-details-styles">
              <Col sm={12} md={12}>
                <p className="pub-det-title-mb">{publication.pub_title}</p>
                <Carousel>
                  {listImages.map((image, ind) => {
                    return (
                      <Carousel.Item interval={3000} key={ind}>
                        <Image
                          src={`${imagesPath()}products/${image.img_filename}.${
                            image.img_extension
                          }`}
                          rounded
                          className="pub-det-main-image"
                          key={ind}
                        />
                      </Carousel.Item>
                    );
                  })}
                </Carousel>
              </Col>
            </Row>
            <Row className="pub-details-styles">
              <Col>
                <Card border="dark" className="pub-det-card">
                  <Card.Body className="text-center pub-det-card-body">
                    <Col sm={5} md={5}>
                      <Card.Title className=" pub-card-price">
                        $ {publication.pub_price}
                      </Card.Title>
                      <Card.Subtitle className="pub-card-shipping">
                        Shipping cost: $ {stateShipping.city_shipping_cost}
                      </Card.Subtitle>
                    </Col>
                    <Col sm={7} md={7} className="pub-button-buy-mb">
                      <Button size="lg" disabled={!isLogin} onClick={buyNow}>
                        BUY NOW
                      </Button>
                    </Col>
                  </Card.Body>
                </Card>
                <p className="pub-det-description">
                  {publication.pub_description}
                </p>
              </Col>
            </Row>
          </Container>
        </MediaQuery>
      )}

      {!error.status && (
        <MediaQuery
          minWidth={ScreenSize.isTablet}
          maxWidth={ScreenSize.isDesktop - 1}
        >
          <Container fluid className="pub-details-styles">
            .
            <Row>
              <p className="pub-det-title-tb">{publication.pub_title}</p>
              <Col md={6} lg={6} className="pub-carrousel-tb">
                <Carousel>
                  {listImages.map((image, ind) => {
                    return (
                      <Carousel.Item interval={3000} key={ind}>
                        <Image
                          src={`${imagesPath()}products/${image.img_filename}.${
                            image.img_extension
                          }`}
                          rounded
                          className="pub-det-main-image"
                          key={ind}
                        />
                      </Carousel.Item>
                    );
                  })}
                </Carousel>
              </Col>
              <Col md={5} lg={5}>
                <Card border="dark" className="pub-det-card-tb">
                  <Card.Body className="text-center pub-det-card-body-tb">
                    <Card.Title className=" pub-card-price">
                      $ {publication.pub_price}
                    </Card.Title>
                    <Card.Subtitle className="pub-card-shipping">
                      Shipping cost: $ {stateShipping.city_shipping_cost}
                    </Card.Subtitle>
                    <Button
                      onClick={buyNow}
                      disabled={!isLogin}
                      className="pub-button-buy-tb"
                    >
                      BUY NOW
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            <Row>
              <Col>
                <ListGroup as="ul" className="pub-list-tb">
                  {listImages.map((image, ind) => {
                    return (
                      <Image
                        className="mt-2 pub-image-tb"
                        src={`${imagesPath()}products/${image.img_filename}.${
                          image.img_extension
                        }`}
                        key={ind}
                      />
                    );
                  })}
                </ListGroup>
              </Col>
            </Row>
            <p className="pub-det-description">{publication.pub_description}</p>
          </Container>
        </MediaQuery>
      )}

      {!error.status && (
        <MediaQuery minWidth={ScreenSize.isDesktop}>
          <Container fluid className="pub-details-styles">
            <Row>
              <Col lg={2}>
                <ListGroup as="ul">
                  {listImages.map((image, ind) => {
                    return (
                      <Image
                        className="mt-2"
                        key={ind}
                        src={`${imagesPath()}products/${image.img_filename}.${
                          image.img_extension
                        }`}
                      />
                    );
                  })}
                </ListGroup>
              </Col>
              <Col lg={6}>
                <p className="pub-det-title-dk">{publication.pub_title}</p>
                <Carousel>
                  {listImages.map((image, ind) => {
                    return (
                      <Carousel.Item
                        interval={3000}
                        className="pub-det-main-image"
                        key={ind}
                      >
                        <Image
                          src={`${imagesPath()}products/${image.img_filename}.${
                            image.img_extension
                          }`}
                          rounded
                          className="pub-det-main-image"
                          key={ind}
                        />
                      </Carousel.Item>
                    );
                  })}
                </Carousel>
              </Col>
              <Col lg={4}>
                <Card border="dark" className="pub-det-card-dk">
                  <Card.Body className="text-center pub-det-card-body-dk">
                    <Card.Title className=" pub-card-price">
                      $ {publication.pub_price}
                    </Card.Title>
                    <Card.Subtitle className="pub-card-shipping">
                      Shipping cost: $ {stateShipping.city_shipping_cost}
                    </Card.Subtitle>
                    <Button
                      onClick={buyNow}
                      disabled={!isLogin}
                      className="pub-button-buy-tb"
                    >
                      BUY NOW
                    </Button>
                  </Card.Body>
                </Card>
                <p className="pub-det-description-dk">
                  {publication.pub_description}
                </p>
              </Col>
            </Row>
          </Container>
        </MediaQuery>
      )}

      {!error.status && buy ? <Sales publication={publication} /> : null}
      {!error.status && <ToastContainer />}
    </React.Fragment>
  );
};

export default PublicationDetails;
