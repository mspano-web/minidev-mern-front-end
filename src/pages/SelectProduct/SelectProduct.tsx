/**
 * SelectProduct - Selection of a product for later publication.
 */

import React, { useEffect, useState } from "react";
import MediaQuery from "react-responsive";
import { ScreenSize } from "../../helpers/mediaquery";
import { useNavigate } from "react-router-dom";
import { IProduct } from "../../common/types/ProductsType"
import * as productService from "./ProductsService";
import ProductItemCard from "./ProductItemCard/ProductItemCard";
import {  Row } from "react-bootstrap";
import "./SelectProduct.css"

/**
 * SelectProduct - It shows the list of existing products, allowing the selection of one of them in order to generate, 
 *                 in a next step, an associated publication.
 * 
 *                 Functional component
 * 
 * @returns - JSX Element
 */
const SelectProduct = () => {
  const [products, setProducts] = useState<IProduct[]>([]);

  const navigate = useNavigate();

/**
 * loadProducts - Retrieves the information of products by consulting the corresponding service.
 */

  const loadProducts = async () => {
    const res = await productService.getProducts();
    setProducts(res);
  };
  
  useEffect(() => {  // Comment - useEffect don't support async/await
    loadProducts();
  }, []);

/**
 * handleClickCard - Handles the event click on a product. Navigate to the new publications page with the id of the selected product.
 * 
 * @param id - product id
 */

  const handleClickCard = (id: string): void => {
    navigate(`/publications/new-publication/${id}`);
  };

  return (
    <React.Fragment>
      <MediaQuery
        minWidth={ScreenSize.isMobile}
        maxWidth={ScreenSize.isDesktop - 1}
      >
        <h1 className="product-search-title"> We're sorry! Article publication only available in full desktop. </h1>
      </MediaQuery>
      <MediaQuery minWidth={ScreenSize.isDesktop}>
        <h1 className="product-search-title"> Select the article to publish</h1>
        <Row className="product-item-card">
          {products.map((product) => {
            return (
              <ProductItemCard
                product={product}
                onClickCard={handleClickCard}
                key={product._id}
              />
            );
          })}
        </Row>
      </MediaQuery>
    </React.Fragment>
  );
};

export default SelectProduct;

