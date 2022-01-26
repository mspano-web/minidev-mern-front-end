/**
 * CategoriesItemCard.tsx -  Show current categories for your selection.
 */

import React  from "react";
import { ICategory } from "../../../common/types/CategoriesType";
import { Card,  Col } from "react-bootstrap";
import "../Categories.css";
import MediaQuery from "react-responsive";
import { ScreenSize } from "../../../helpers/mediaquery";
import { imagesPath } from "../../../helpers/environment"
import "./CategoriesItemCard.css";

interface Props {
  category: ICategory;
  onClickCard: (id: string) => any;
}

/**
 * CategoryItemCard - Show each category in a card, containing the associated image and a text.
 * 
 *                  Apply only to ScreenSize.isDesktop
 * 
 * @param category - Category to display
 * @param onClickCard - handler provided by the parent.
 *      
 * @returns 
 */

const CategoryItemCard = ({ category, onClickCard }: Props) => {

  
  return (
    <React.Fragment>
      <MediaQuery minWidth={ScreenSize.isDesktop}>
        <Col lg={4}>
          <Card border="dark"  className="mt-3 text-center" onClick={() => onClickCard(category._id)}>
            <Card.Img
              width="100%"
              height="100%"
              variant="top"
              src={`${imagesPath()}categories/${category._id}.jpg`}
              className="card-img-top"
            />
            <Card.ImgOverlay>
              <Card.Body>
                <Card.Title className="card-text">
                  {category.cat_description}
                </Card.Title>
              </Card.Body>
            </Card.ImgOverlay>
          </Card>
        </Col>
      </MediaQuery>
    </React.Fragment>
  );
};

export default CategoryItemCard;