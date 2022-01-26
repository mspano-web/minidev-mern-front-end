/**
 * PublishItemCard.tsx
 */

import React from "react";
import { IPublication } from "../../../common/types/PublicationsType";
import { IProduct } from "../../../common/types/ProductsType";
import MediaQuery from "react-responsive";
import { ScreenSize } from "../../../helpers/mediaquery";
import { Card, Col } from "react-bootstrap";
import { imagesPath } from "../../../helpers/environment"
import "./PublishItemCard.css"

interface Props {
  publish: IPublication;
  onClickPublish: (id: string) => any;
}

/**
 * PublishItemCard - Show each publication in a card format.
 *
 * @param param0 - publish - publication data
 * @param param0 - onClickPublish - param0
 *
 * @returns - JSX Element
 */

const PublishItemCard = ({ publish, onClickPublish }: Props) => {
  /**
   * imageName - Determines the name of the image. The one that comes in the product is taken, or a default.
   *             This default name must be agreed with the backend.
   *
   * @param product - Product Data
   * @returns - Image name
   */

  const imageName = (product: IProduct): string => {
    if (product.images === undefined || !product.images.length)
      return "default-image-product";
    else return product.images[0].img_filename;
  };

  /* ---------------------------- */

  return (
    <React.Fragment>

<MediaQuery
        minWidth={ScreenSize.isMobile}
        maxWidth={ScreenSize.isTablet - 1}
      >
        <Col sm={12}>
          <Card
            border="dark"
            key={publish._id}
            className="mt-3 text-center fluid publication-card-mb"
            onClick={() => onClickPublish(publish._id)}
          >
            <Col lg={6} md={6} sm={6}>
              <Card.Img
                width="100%"
                height="100%"
                className="img-fluid"
                src={`${imagesPath()}products/${imageName(
                  publish.products[0]
                )}.jpg`}
              />
            </Col>
            <Col lg={6} md={6} sm={6}>
              <Card.Body className="publications-styles-card">
                <Card.Title>{publish.pub_title} </Card.Title>
                <Card.Subtitle className="publications-styles-card-subtitle">
                  {" "}
                  <b> $ {publish.pub_price} </b>{" "}
                </Card.Subtitle>
              </Card.Body>
            </Col>
          </Card>
        </Col>
      </MediaQuery>

      <MediaQuery minWidth={ScreenSize.isTablet}>
        <Col lg={4} md={6}>
          <Card
            border="dark"
            key={publish._id}
            className="mt-3 text-center"
            onClick={() => onClickPublish(publish._id)}
          >
            <Card.Img
              width="100%"
              height="100%"
              variant="top"
              src={`${imagesPath()}products/${imageName(
                publish.products[0]
              )}.jpg`}
            />
            <Card.Body className="publications-styles-card">
              <Card.Title>{publish.pub_title} </Card.Title>
              <Card.Subtitle className="publications-styles-card-subtitle">
                {" "}
                <b> $ {publish.pub_price} </b>{" "}
              </Card.Subtitle>
            </Card.Body>
          </Card>
        </Col>
      </MediaQuery>
    </React.Fragment>
  );
};

export default PublishItemCard;
