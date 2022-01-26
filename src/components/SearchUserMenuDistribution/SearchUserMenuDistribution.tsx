/**
 * SearchUserMenuDistribution.tsx -  It modifies the exposure mode of the Search and UserMenu components according to the device in use.
 */

import Search from "../Search/Search";
import { UserMenu } from "../UserMenu/UserMenu";
import {
  Row,
  Container,
  Col,
} from "react-bootstrap";
import MediaQuery from "react-responsive";
import { ScreenSize } from "../../helpers/mediaquery";
import "./SearchUserMenuDistribution.css"

/**
 * SearchUserMenuDistribution - Functional Component 
 * 
 * @returns - JSX element.
 */

const SearchUserMenuDistribution = () => {
  return (
    <div>
      <MediaQuery
        minWidth={ScreenSize.isMobile}
        maxWidth={ScreenSize.isDesktop - 1}
      >
        <Container fluid className="user-menu-search-styles">
          <Row>
            <UserMenu />
          </Row>
          <Row>
            <Search />
          </Row>
        </Container>
      </MediaQuery>
      <MediaQuery minWidth={ScreenSize.isDesktop}>
        <Container fluid className="user-menu-search-styles">
          <Row className="justify-content-between align-items-center">
            <Col lg={8}>
              <Search />
            </Col>
            <Col lg={4}>
              <UserMenu />
            </Col>
          </Row>
        </Container>
      </MediaQuery>
    </div>
  );
};

export default SearchUserMenuDistribution;
