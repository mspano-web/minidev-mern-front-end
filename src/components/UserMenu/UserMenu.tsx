/**
 * UserMenu.tsx -  Manage the user menu: login, logout, register, username
 */

import { Nav, Container, Navbar } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGlobe, faUser } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import "./UserMenu.css";

/**
 * UserMenu - Functional Component 
 *            It adapts to different types of screen.
 *            Get user data from redux store.
 *            This menu remains visible throughout the life cycle of the MiniDev application.
 * 
 * @returns - JSX element.
 */

export const UserMenu = () => {

  const stateUser = useSelector((state: any) => state.user);   // Redux Store

  return (
    <Navbar className="user-menu-styles">
      <Container>
        <span>
          <FontAwesomeIcon icon={faGlobe} /> english{" "}
        </span>
        <div className="user-menu-group">
          <span>
            <FontAwesomeIcon icon={faUser} />
          </span>
          <Nav className="mr-auto" as="ul">
            <Nav.Item as="li" className="ms-2 me-2">
              {!stateUser.usr_id? <Link to="/sing-in"> sing-in </Link>:<Link to="/update-user"> {stateUser.usr_username} </Link>}
            </Nav.Item>
            <span>/</span>
            <Nav.Item as="li" className="ms-2">
              {!stateUser.usr_id?<Link to="/register"> register </Link>:<Link to="/logout"> logout </Link>}
            </Nav.Item>
          </Nav>
        </div>
      </Container>
    </Navbar>
  );
};
