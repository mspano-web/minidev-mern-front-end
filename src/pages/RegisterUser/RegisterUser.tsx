/**
 * RegisterUser.tsx -  User registration in the application..
 */

import { ChangeEvent, FormEvent, useState, useEffect } from "react";

import { IRegister } from "./RegisterUserType";
import { ICity } from "../../common/types/CitiesType";
import { IStates } from "../../common/types/StatesType";

import MediaQuery from "react-responsive";
import { ScreenSize } from "../../helpers/mediaquery";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Form,
  Button,
  Container,
  Card,
  Row,
  Col,
  Image,
} from "react-bootstrap";
import * as userService from "./RegisterUserSservice";
import { imagesPath, documentPath } from "../../helpers/environment"
import { useWaitToRedirect } from "../../common/hooks/useWaitToRedirect";
import "./RegisterUser.css";

/**
 * RegisterUser -
 *
 *                Functional component.
 *
 *
 * @returns  - JSX element.
 */

const RegisterUser = () => {
  type InputChange = ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;

  const initialRegister: IRegister = {
    usr_name: "", 
    usr_email: "",
    usr_street_address: "",
    state_id: "",
    city_id: "",
    usr_zip: "",
    usr_phone_number: "",
    usr_username: "",
    usr_password: "", 
    rol_id: "",
  };

  const [register, setRegister] = useState<IRegister>(initialRegister);
  const [reentryPassword, setReentryPassword] = useState("");
  const [states, setStates] = useState<IStates[]>([]);
  const [cities, setCities] = useState<ICity[]>([]);

  const [waitExit, setWaitExit] = useState(false);
  const timeWait = 6000; //ms
  const redirectPage = "/"; //home


  /**
   * loadStates -Retrieves the information of the current states/cities by consulting the corresponding service.
   *             Updates the status of the component with the retrieved values.
   *
   */

  const loadStates = async () => {
    const res = await userService.getStateCity();
    setStates(res);
  };

  useEffect(() => {
    // Comment - useEffect don't support async/await
    if (!waitExit) loadStates();
  }, [waitExit]);

  /**
   * loadRol -Retrieves the information of the current rol by consulting the corresponding service.
   *             Updates the status of the component with the retrieved values.
   *
   */
  useEffect(() => {
    const loadRol = async () => {
      const res = await userService.getRolStandard();
      setRegister(prevState => {
        return { ...prevState, rol_id: res._id  }
      });

     };
     if (!waitExit) loadRol();
  }, [waitExit]);

    /**
   * handleInputChangeReentryPassword
   *
   *            Updates the state of the reentry Password variable.
   *            This variable receives an independent treatment since it is not part of the information to be recorded on the form.
   *
   * @param e  - Event information.
   */
     const handleInputChangeReentryPassword = (e: InputChange) => {
      setReentryPassword(e.target.value);
    };
  
    /**
     * handleInputChange
     *
     *    It captures typing events generated when entering values ​​in the html fields,
     *      and sets the corresponding internal state variable with the value entered in the "input".
     *   This function is associated by placing "onChange = {handleInputChange}" in the "input" of the form.
     *    A correspondence is defined between the names of the inputs in the HTML and the fields of the state variable register
     *
     * @param e - Event information.
     */
    const handleInputChange = (e: InputChange) => {
      setRegister({ ...register, [e.target.id]: e.target.value });
    };
  
    /**
     * handleSubmit - Process the information uploaded in the register user form.
     *
     * @param e - Form event
     */
  
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
  
      if (!validate()) {
        return;
      }
      toast.promise(userService.registerUser(register), {
        pending: {
          render({ data }) {
            return `In progress.....`;
          },
          className: "custom-toast",
          position: toast.POSITION.TOP_RIGHT,
        },
        success: {
          render({ data }) {
            return `Welcome to MagicExample! Your user has been successfully registered.`;
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
            return `We're sorry. An error has occurred. Your request could not be processed.`;
          },
          className: "custom-toast",
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 4000,
          icon: "🔴",
        },
      }).then(() => setWaitExit(true))
      .catch(() => setWaitExit(true));
  
    };
  

  /**
   * validate - Check if the entered class corresponds to his reentry.
   *
   * @returns - true OK, or false Not OK
   */

  const validate = (): boolean => {
    if (
      typeof register.usr_password !== "undefined" &&
      typeof reentryPassword !== "undefined"
    ) {
      if (register.usr_password !== reentryPassword) {
        toast.warning("The passwords do not match, please re-enter them.");
        return false;
      }
    }

    return true;
  };

  
/**
 * showFormFirstGroup - First field section of the form.
 * 
 * @returns - JSX element.
 */

  const showFormFirstGroup = () => {
    return (
      <>
        <Form.Group className="mb-1" controlId="usr_name">
          <Form.Control
            type="text"
            placeholder="Enter your name"
            autoFocus
            value={register.usr_name}
            onChange={handleInputChange}
            required
            autoComplete="off"
          />
        </Form.Group>

        <Form.Group className="mb-1" controlId="usr_email">
          <Form.Control
            type="email"
            placeholder="Enter your email"
            value={register.usr_email}
            onChange={handleInputChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-1" controlId="usr_street_address">
          <Form.Control
            type="text"
            placeholder="Enter your street address"
            value={register.usr_street_address}
            onChange={handleInputChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="state_id">
          <Form.Control
            type="text"
            as="select"
            value={register.state_id}
            onChange={(e) => {
              handleInputChange(e);
              setCities(states[parseInt(e.target.value) - 1].cities);
            }}
          >
            <option className="d-none" value="">
              Select your state
            </option>
            {states.map((item, i) => (
              <option key={item._id} value={item._id}>
                {item.state_description}
              </option>
            ))}
          </Form.Control>
        </Form.Group>

        <Form.Group controlId="city_id" className="mb-1">
          <Form.Control
            type="text"
            as="select"
            value={register.city_id}
            onChange={(e) => {
              handleInputChange(e);
            }}
          >
            <option className="d-none" value="">
              Select your city
            </option>
            {cities.map((item, i) => (
              <option key={item._id} value={item._id}>
                {item.city_description}
              </option>
            ))}
          </Form.Control>
        </Form.Group>

        <Form.Group className="mb-1" controlId="usr_zip">
          <Form.Control
            type="text"
            placeholder="Enter your ZIP"
            value={register.usr_zip}
            onChange={handleInputChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-1" controlId="usr_phone_number">
          <Form.Control
            type="text"
            placeholder="Enter your phone number"
            value={register.usr_phone_number}
            onChange={handleInputChange}
            required
          />
        </Form.Group>
      </>
    );
  };

/**
 * showFormSecondtGroup - Second field section of the form.
 * 
 * @returns - JSX element.
 */

  const showFormSecondtGroup = () => {
    return (
      <>
        <Form.Group className="mb-1" controlId="usr_username">
          <Form.Control
            type="text"
            placeholder="Enter your username"
            value={register.usr_username}
            onChange={handleInputChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-1" controlId="usr_password">
          <Form.Control
            type="password"
            placeholder="Enter your password"
            value={register.usr_password}
            onChange={handleInputChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-1" controlId="reentryPassword">
          <Form.Control
            type="password"
            placeholder="Reetry  your password"
            value={reentryPassword}
            onChange={handleInputChangeReentryPassword}
            required
          />
        </Form.Group>

        <Form.Group className="mt-5">
          <Form.Check
            required
            label={
              <a
                href={`${documentPath()}term-conditions.pdf`}
                target="_blank"
                rel="noreferrer"
              >
                Agree to terms and conditions
              </a>
            }
            feedback="You must agree before submitting."
            feedbackType="invalid"
          />
        </Form.Group>
      </>
    );
  };

  useWaitToRedirect(redirectPage, timeWait, waitExit);

  return (
    <>
      <MediaQuery
        minWidth={ScreenSize.isMobile}
        maxWidth={ScreenSize.isTablet - 1}
      >
        <Container fluid>
          <Row className="register-styles">
            <Col>
              <Card className="mx-2 mt-2 mb-5">
                <Card.Title className="text-center">
                  Welcome! complete to register
                </Card.Title>
                <Card.Body>
                  <Form onSubmit={handleSubmit}>
                    <Row className="register-card-body">
                      <Col sm={8}>
                        {showFormFirstGroup()}
                        {showFormSecondtGroup()}
                      </Col>
                      <div className="register-div-button mt-2 mb-2">
                        <Button
                          size="lg"
                          type="submit"
                          className="register-button-styles"
                        >
                          Register to MagicExample
                        </Button>
                      </div>
                    </Row>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </MediaQuery>

      <MediaQuery
        minWidth={ScreenSize.isTablet}
        maxWidth={ScreenSize.isDesktop - 1}
      >
        <Container fluid>
          <Row className="register-styles">
            <Col>
              <Image
                className="register-image-tb  ms-3"
                src={`${imagesPath()}register/register-tb.jpg`}
              />
            </Col>

            <Card className="ms-3">
              <Card.Title className="text-center">
                Welcome! complete to register
              </Card.Title>
              <Card.Body>
                <Form onSubmit={handleSubmit}>
                  <Row className="register-card-body">
                    <Col md={5}>{showFormFirstGroup()}</Col>
                    <Col md={5}>{showFormSecondtGroup()}</Col>

                    <div className="register-div-button mt-2 mb-5">
                      <Button
                        size="lg"
                        type="submit"
                        className="register-button-styles"
                      >
                        Register to MagicExample
                      </Button>
                    </div>
                  </Row>
                </Form>
              </Card.Body>
            </Card>
          </Row>
        </Container>
      </MediaQuery>

      <MediaQuery minWidth={ScreenSize.isDesktop}>
        <Container fluid>
          <Row className="register-styles">
            <Col lg={7}>
              <Card className="ms-3 ">
                <Card.Title className="text-center">
                  Welcome! complete to register
                </Card.Title>
                <Card.Body>
                  <Form onSubmit={handleSubmit}>
                    <Row className="register-card-body">
                      <Col lg={5}>{showFormFirstGroup()}</Col>
                      <Col lg={5}>{showFormSecondtGroup()}</Col>

                      <div className="register-div-button mt-2 mb-2">
                        <Button
                          size="lg"
                          type="submit"
                          className="register-button-styles"
                        >
                          Register to MagicExample
                        </Button>
                      </div>
                    </Row>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={4} xs={4} md={4}>
              <Image
                className="register-image-dt  ms-3"
                src={`${imagesPath()}register/register.jpg`}
              />
            </Col>
          </Row>
        </Container>
      </MediaQuery>
      <ToastContainer />
    </>
  );
};

export default RegisterUser;
