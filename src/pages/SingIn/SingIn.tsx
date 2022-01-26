/**
 * SignIn.tsx -  User login in the application.
 */

import React, { ChangeEvent, FormEvent, useState } from "react";
import * as axios from "axios";

import { ISignIn } from "./SignInType";
import { USER_LOGIN } from "../../common/types/UserType"
import { Link } from "react-router-dom";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Form, Button, Container, Card, Row, Col } from "react-bootstrap";
import * as signInService from "./SignInService";
import * as configurationService from "../../common/services/ConfigurationService";
import * as shippingService from "../../common/services/ShippingService";

import { useDispatch } from "react-redux";
import { bindActionCreators } from "redux";

import { actionUserCreators } from "../../store/action-creators/user.actions.creators";
import { actionConfigCreators } from "../../store/action-creators/configuration.actions.creators";
import { shippingCreators } from "../../store/action-creators/shipping.actions.creators";

import { IUserData } from "../../store/types/user-data.type";
import { IConfiguration } from "../../store/types/configuration.type";
import { IShipping } from "../../common/types/ShippingType";

import { useWaitToRedirect } from "../../common/hooks/useWaitToRedirect";

import "./SignIn.css";

/**
 * SingIn - Request information from the user to log into the application.
 *          Get session information.
 *          Obtains information on shipping costs and application configuration.
 *
 *          Functional component
 *
 * @returns - JSX element.
 */

const SingIn = () => {
  type InputChange = ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;
  type ServerError = { errorMessage: string };

  const initialSignIn = {
    usr_id: "",
    usr_email: "",
    usr_password: "",
    usr_username: "",
  };

  const [waitExit, setWaitExit] = useState(false);
  const timeWait = 6000; //ms
  const redirectPage = "/"; //home

   // Comments: To dispatch an action, two things are necessary, a reference to the dispatcher and the action
  //           object that describes the changes to be made in the store.
  //           To retrieve the dispatcher we have the useDispatch hook
  const dispatch = useDispatch();
  const { loginUser } = bindActionCreators(actionUserCreators, dispatch);
  const { setConfiguration } = bindActionCreators(
    actionConfigCreators,
    dispatch
  );
  const { setShipping } = bindActionCreators(shippingCreators, dispatch);

  const [signIn, setSingIn] = useState<ISignIn>(initialSignIn);

  /**
   * handleInputChange
   *
   *        It captures typing events generated when entering values ​​in the html fields,
   *          and sets the corresponding internal state variable with the value entered in the "input".
   *        This function is associated by placing "onChange = {handleInputChange}" in the "input" of the form.
   *        A correspondence is defined between the names of the inputs in the HTML and the fields of the state variable signin
   *
   * @param e - event
   */

  const handleInputChange = (e: InputChange) => {
    setSingIn({ ...signIn, [e.target.id]: e.target.value });
  };

  /**
   * handleSubmit - Process the information uploaded in the sign in form.
   *
   * @param e - event
   */

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    toast.promise(signInService.loginUser(signIn), {
      pending: {
        render({ data }) {
          return `In progress.....`;
        },
        className: "custom-toast",
        position: toast.POSITION.TOP_RIGHT,
      },
      success: {
        render({ data }) {
          const dataUser: IUserData = data as IUserData;
          loginUser(dataUser);
          sessionStorage.setItem("login_user", USER_LOGIN); // Comment - Storage within the current browser tab
          getConfiguration();
          getShipping(dataUser.usr_id);

          return `Welcome to MagicExample! You have been successfully logged in..`;
        },
        className: "custom-toast",
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        icon: "🟢",
      },
      error: {
        render({ data }) {
          let serverError: any;
          if (axios.default.isAxiosError(data)) {
            serverError = data as axios.AxiosError<ServerError>;
            if (serverError && serverError.response) {
              return `${serverError.response.data}.`;
            }
          }
          return `We're sorry. An error has occurred. Your request could not be processed.`;
        },
        className: "custom-toast",
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 4000,
        icon: "🔴",
      },
    }).then(()=> setWaitExit(true)).catch(() => setSingIn(initialSignIn));

  };

  /**
   * getConfiguration - Obtains application configuration information, by invoking the corresponding service.
   *                    Updates the configuration in REDUX store.
   *
   */

  const getConfiguration = async () => {
    const config: IConfiguration =
      await configurationService.getConfiguration();
    setConfiguration(config); // It is saved in the REDUX store
  };

  /**
   * getShipping - Obtains the shipping costs associated with a user, by invoking the corresponding service.
   *               Updates the shipping cost in REDUX store.
   *
   * @param user_id - User Data
   */

  const getShipping = async (user_id: string) => {
    const shipping: IShipping = await shippingService.getShipping(user_id);
    setShipping(shipping); // It is saved in the REDUX store
  };

  useWaitToRedirect(redirectPage, timeWait, waitExit);

  return (
    <React.Fragment>
      <Container fluid className="signin-styles">
        <Row>
          <Col>
            <Card className="mx-2 mt-2 mb-5">
              <Card.Title className="text-center">
                Hello!, to continue enter your email and password
              </Card.Title>
              <Card.Body>
                <Form onSubmit={handleSubmit}>
                  <Row className="signin-card-body">
                    <Col sm={8}>
                      <Form.Group className="mb-2 mt-2" controlId="usr_email">
                        <Form.Control
                          type="email"
                          placeholder="Enter your email"
                          value={signIn.usr_email}
                          onChange={handleInputChange}
                          required
                        />
                      </Form.Group>

                      <Form.Group
                        className="mb-4 mt-2"
                        controlId="usr_password"
                      >
                        <Form.Control
                          type="password"
                          placeholder="Enter your password"
                          value={signIn.usr_password}
                          onChange={handleInputChange}
                          required
                        />
                      </Form.Group>

                      <Link to="/forgotpassword/"> Forgot your password? </Link>
                    </Col>

                    <div className="sigin-div-button mt-5 mb-2">
                      <Button
                        size="lg"
                        type="submit"
                        className="signin-button-styles"
                      >
                        Login to MagicExample
                      </Button>
                    </div>
                  </Row>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
      <ToastContainer />
    </React.Fragment>
  );
};

export default SingIn;
