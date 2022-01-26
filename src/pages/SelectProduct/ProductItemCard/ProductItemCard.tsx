/**
 * ProductItemCard - Show a product card.
 */

import React from "react";
import { IProduct } from "../../../common/types/ProductsType"
import { Card, Col } from "react-bootstrap";
import MediaQuery from "react-responsive";
import { ScreenSize } from "../../../helpers/mediaquery";
import { imagesPath } from "../../../helpers/environment"
import "./ProductItemCard.css"

interface Props {
  product: IProduct;
  onClickCard: (id: string) => any;
}

/**
 * ProductItemCard
 *  
 *                   Functional component.
 * 
 * @param product - Product data.
 * @param onClickCard - Product selection manager.

* @returns - JSX Element
 */

const ProductItemCard = ({ product, onClickCard }: Props) => {

  /**
   * imageName - Determines the name of the image associated with the product. In the case of not being provided, 
   *             the default applies. In this implementation, there must be a common prior agreement with the backend 
   *             on the default name.
   * 
   * @returns - Image name
   */
  const imageName = (): string => {
    if (product.images === undefined || !product.images.length)
      return "default-image-product";
    else return product.images[0].img_filename;
  };

  /**
   * imageExtension - Determines the image file extension associated with the product. By default it is jpg.
   * 
   * @returns - Extension of the product image.
   */
  const imageExtension = (): string => {
    if (product.images === undefined || !product.images.length) return "jpg";
    else return product.images[0].img_extension;
  };

  return (
    <React.Fragment>
      <MediaQuery minWidth={ScreenSize.isDesktop}>
        <Col lg={5}>
          <Card
            border="dark"
            key={product._id}
            className="product-item-card-content text-center"
            onClick={() => onClickCard(product._id)}
          >
            <Col lg={4}>
              <Card.Img
                width="100%"
                height="100%"
                className="img-fluid"
                src={`${imagesPath()}products/${imageName()}.${imageExtension()}`}
              />
            </Col>
            <Col lg={8}>
              <Card.Body>
                <Card.Title>{product.prod_title} </Card.Title>
                <Card.Subtitle className="product-styles-price">
                  {" "}
                  <b> $ {product.prod_price} </b>{" "}
                </Card.Subtitle>
              </Card.Body>
            </Col>
          </Card>
        </Col>
      </MediaQuery>
    </React.Fragment>
  );
};

export default ProductItemCard;
