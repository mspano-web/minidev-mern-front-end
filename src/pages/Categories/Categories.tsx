/**
 * Categories.tsx -  Show current categories for your selection.
 */

import React, { useEffect, useState } from "react";
import { ICategory } from "../../common/types/CategoriesType";
import * as categoriesService from "./CategoriesService";
import CategoryItemCard from "./CategoriesItemCard/CategoriesItemCard";
import { Row, Container, Carousel, Image } from "react-bootstrap";
import MediaQuery from "react-responsive";
import { ScreenSize } from "../../helpers/mediaquery";
import { useNavigate } from "react-router-dom";
import { imagesPath } from "../../helpers/environment";
import "./Categories.css";

/**
 *  Categories - Show categories.
 *               On a desktop device, expose in 3 columns using cards.
 *               On a tablet or mobile device, exhibit in a Carousel.
 *               Allows you to select a category by clicking, and consequently, invoke the publications with that category.
 *
 * @returns - JSX element.
 */

const Categories = () => {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [index, setIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {  // Comment - The "effect" function is executed after flushing the changes to the DOM.
    // Comment - useEffect don't support async/await
    let ignore = false;
    /**
     * loadCategories - Retrieves the information of the current categories by consulting the corresponding service.
     */
    const loadCategories = async () => {
      const res = await categoriesService.getCategories(); // It could be improved by controlling the return of Axios.
      if (!ignore) setCategories(res);
    };

    loadCategories();
    return () => {   // Comment - Cleanup function executed when unmounting the component (this is optional).
      ignore = true; // Control to avoid the change of state of the component after it is unmounted.
    };
  }, []);

  /**
   * handleSelect - Updates the status of the component, on the selected category field.
   *
   * @param selectedIndex  - selected index.
   * @param e - Event
   */

  const handleSelect = (selectedIndex: any, e: any) => {
    setIndex(selectedIndex);
  };

  /**
   * handleClick - Handles the event click on a category. Navigate to the publications page with the id of the selected category.
   *
   * @param e - evet
   */

  const handleClick = (e: any) => {
    navigate(`/publications/@cat-${categories[index]._id}`);
  };

  /**
   * handleClickCard - Handles the event click on a category in desktop size.
   *
   * @param id - id of the selected category.
   */

  const handleClickCard = (id: string): void => {
    navigate(`/publications/@cat-${id}`);
  };

  return (
    <React.Fragment>
      <MediaQuery
        minWidth={ScreenSize.isMobile}
        maxWidth={ScreenSize.isDesktop - 1}
      >
        <Container fluid className="category-styles">
          <Row className="custom-carousel-location">
            <Carousel activeIndex={index} onSelect={handleSelect} pause="hover">
              {categories.map((category) => {
                return (
                  <Carousel.Item interval={3000} key={category._id}>
                    <Image
                      src={`${imagesPath()}categories/${category._id}.jpg`}
                      rounded
                      className="d-block w-100"
                      key={category._id}
                      onClick={handleClick}
                    />
                    <Carousel.Caption>
                      <h3>{category.cat_description}</h3>
                    </Carousel.Caption>
                  </Carousel.Item>
                );
              })}
            </Carousel>
          </Row>
        </Container>
      </MediaQuery>

      <MediaQuery minWidth={ScreenSize.isDesktop}>
        <Container fluid className="category-styles">
          <Row>
            {categories.map((category) => {
              return (
                <CategoryItemCard
                  category={category}
                  onClickCard={handleClickCard}
                  key={category._id}
                />
              );
            })}
          </Row>
        </Container>
      </MediaQuery>
    </React.Fragment>
  );
};

export default Categories;
