/**
 * AboutUs.tsx -  Information about the company.
 */

import { Container, Image, Row, Col } from "react-bootstrap";
import MediaQuery from "react-responsive";
import { ScreenSize } from "../../helpers/mediaquery";
import { imagesPath } from "../../helpers/environment"
import "./AboutUs.css"


/**
 * aboutUsDescription - Descriptive text to display, common to all device sizes.
 * 
 * @returns - JSX element.
 */

const aboutUsDescription = () => {
   return (
   <p className="mt-5 mb-3 about-us-text">
   {" "}
   MagicExample is a fashion company born in Miami in 2015. Our
   creative designs accompany the modern woman in all areas of her
   life.
   </p>
 )
}

/**
 * AboutUs - Exhibition of descriptive text about the company and associated images.
 * 
 *           Functional component
 * 
 * @returns - JSX element.
 */


const AboutUs = () => {
  return (
    <>
      <MediaQuery
        minWidth={ScreenSize.isTablet}
        maxWidth={ScreenSize.isDesktop - 1}
      >
        <Container fluid className="about-us">
          <Row>
            <Col>
               {aboutUsDescription()}
              <Image
                className="about-us-primary-image-tb mt-2"
                src={`${imagesPath()}about-us/about-us I.png`}
              />
              <Image
                className="mt-2 about-us-secondary-image-tb"
                src={`${imagesPath()}about-us/about-us II.png`}
              />
              <Image
                className="mt-2 ms-4 mb-2 about-us-secondary-image-tb"
                src={`${imagesPath()}about-us/about-us III.png`}
              />
            </Col>
          </Row>
        </Container>
      </MediaQuery>
      <MediaQuery
        minWidth={ScreenSize.isMobile}
        maxWidth={ScreenSize.isTablet - 1}
      >
        <Container fluid className="about-us">
          <Row>
             {aboutUsDescription()}
            <Image
              className="mt-3 mb-5 about-us-primary-image-mb"
              src={`${imagesPath()}about-us/about-us I.png`}
            />
          </Row>
        </Container>
      </MediaQuery>
      <MediaQuery minWidth={ScreenSize.isDesktop}>
        <Container fluid className="about-us">
          <Row>
            <Col lg={7}>
              <Image
                className="mt-3 about-us-primary-image-dk"
                src={`${imagesPath()}about-us/about-us I.png`}
              />
              <Image
                className="mt-3 about-us-secondary-image-dk"
                src={`${imagesPath()}about-us/about-us II.png`}
              />
              <Image
                className="mt-3 ms-4 about-us-secondary-image-dk"
                src={`${imagesPath()}about-us/about-us III.png`}
              />
            </Col>
            <Col lg={5}>
              {aboutUsDescription()}
            </Col>
          </Row>
        </Container>
      </MediaQuery>
    </>
  );
};

export default AboutUs;
