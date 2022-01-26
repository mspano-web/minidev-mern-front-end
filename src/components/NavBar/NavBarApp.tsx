/**
 * NavBarApp.tsx -  Navigation menu.
 */

import { Navbar, Container, Nav, Offcanvas, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import MediaQuery from "react-responsive";
import { ScreenSize } from "../../helpers/mediaquery";
import { useSelector } from "react-redux";
import { IUserData } from "../../store/types/user-data.type";
import "./NavBar.css";
 
// Comment : The Link component uses the internal router, working on the same page,
//              not like the <a> tag that will redirect.

/**
 * NavBarApp - Functional Component.
 *             It adapts to different types of screen. 
 * 
 *             It operates with the redux store to determine, in the case of a logged-in user, 
 *                it is an administrator or standard user, and based on this information modify the menu options.
 * 
 *             Apply the same design for mobile and tablet. Apply a different desktop layout.
 * 
 * @returns - JSX element.
 */

const NavBarApp = () => {
  const stateUser: IUserData = useSelector((state: any) => state.user);  // Redux Store

  return (
    <>
      <MediaQuery
        minWidth={ScreenSize.isMobile}
        maxWidth={ScreenSize.isDesktop - 1}
      >
        <Navbar expand={false} className="bar-menu-mb">
            <Navbar.Brand href="#" className="menu-brand">MINIDEV</Navbar.Brand>
            <Navbar.Toggle aria-controls="offcanvasNavbar" />
            <Navbar.Offcanvas
              id="offcanvasNavbar"
              aria-labelledby="offcanvasNavbarLabel"
              placement="end"
              keyboard="true" // Escape enable
              className="menu-items-mb"
            >
              <Offcanvas.Header closeButton></Offcanvas.Header>
              <Offcanvas.Body>
                <Nav >
                  <Link to="/categories">
                    <Button className="custom-button-menu">Home</Button>
                  </Link>
                  <Link to="/about-us">
                    <Button className="custom-button-menu">About Us</Button>
                  </Link>
                  <Link to="/contacts">
                    <Button className="custom-button-menu">Contact</Button>
                  </Link>
                </Nav>
              </Offcanvas.Body>
            </Navbar.Offcanvas>
        </Navbar>
      </MediaQuery>
      <MediaQuery minWidth={ScreenSize.isDesktop}>
        <Navbar className="bar-menu-dk">
          <Container>
            <Navbar.Brand className="text-dark">MINIDEV</Navbar.Brand>

            <Nav className="ml-auto" defaultActiveKey="/categories">
              <Link to="/categories" className="item-menu-dk">
                Home
              </Link>
              <Link to="/about-us" className="item-menu-dk">
                About Us
              </Link>
              <Link to="/contacts" className="item-menu-dk">
                Contact
              </Link>
              {stateUser.usr_rol_name === "ADMIN" ? (
                <Link to="/publications/admin" className="item-menu-dk">
                  Publications
                </Link>
              ) : ("")
              }
            </Nav>
          </Container>
        </Navbar>
      </MediaQuery>
    </>
  );
};

export default NavBarApp;
