/**
 * UpdateUser.tsx -  User update in the application.
 */

import React, {
  ChangeEvent,
  FormEvent,
  useCallback,
  useEffect,
  useState,
} from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Form, Button, Container, Card, Row, Col } from "react-bootstrap";
import { IUpdateUser } from "./UpdateUserType";
import * as userService from "./UpdateUserService";
import * as stateCityService from "../RegisterUser/RegisterUserSservice";
import { useSelector } from "react-redux";
import { IStates } from "../../common/types/StatesType";
import { ICity } from "../../common/types/CitiesType";

import { useHttpHeader } from "../../common/hooks/useHttpHeader";
import { AxiosRequestConfig } from "axios";
import Errors from "../../components/Errors/Errors";
import { useWaitToRedirect } from "../../common/hooks/useWaitToRedirect";
import { USER_LOGIN } from "../../common/types/UserType";
import "./UpdateUser.css";

/**
 * UpdateUser -  User update in the application.
 *
 *                Functional component.
 *
 * @returns   - JSX element.
 */

const UpdateUser = () => {
  type InputChange = ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;

  const initialUser: IUpdateUser = {
    usr_name: "",
    usr_email: "",
    usr_street_address: "",
    state_id: "",
    city_id: "",
    usr_zip: "",
    usr_phone_number: "",
  };

  const [updateUser, setUpdateUser] = useState<IUpdateUser>(initialUser);
  const [states, setStates] = useState<IStates[]>([]);
  const [cities, setCities] = useState<ICity[]>([]);
  const [error, setError] = useState({ message: "", status: false });

  /* ----------------------------------- */

  const stateUser = useSelector((state: any) => state.user);

  const header: AxiosRequestConfig = useHttpHeader();

  const [waitExit, setWaitExit] = useState(false);
  const timeWait = 6000; //ms
  const redirectPage = "/"; //home

  /* ----------------------------------- */

  /**
   * checkStatus - Preliminary checks. User logged in. Header with information.
   */
  const checkStatus = useCallback(async () => {
    if (header === null || header === undefined)
      setError({ message: "The request cannot be processed.", status: true });
    if (sessionStorage.login_user)
      if (sessionStorage.getItem("login_user") !== USER_LOGIN) {
        setError({
          message:
            "You must log into the application to perform this operation.",
          status: true,
        });
        setWaitExit(true);
      }
  }, [header]);

  useEffect(() => {
    let ignore = false;
    if (!ignore) checkStatus();
    return () => {
      ignore = true;
    };
  }, [checkStatus]);

  useEffect(() => {
    let ignore = false;
    /**
     * loadStates -Retrieves the information of the current states/cities by consulting the corresponding service.
     *           Updates the status of the component with the retrieved values.
     */

    const loadStates = async () => {
      const res = await stateCityService.getStateCity();
      setStates(res);
    };

    if (!waitExit && !ignore) loadStates();
    return () => {
      ignore = true;
    };
  }, [waitExit]);

  useEffect(() => {
    /**
     * loadUser -Retrieves the information of the current user by consulting the corresponding service.
     *           Updates the status of the component with the retrieved values.
     */
    let ignore = false;

    const loadUser = async () => {
      const res = await userService.getUser(
        stateUser.usr_id,
        header as AxiosRequestConfig
      );
      if (!ignore) setUpdateUser(res);
    };

    if (
      header.headers !== undefined &&
      header.headers["x-access-token"] !== "" &&
      !waitExit
    )
      loadUser();
    return () => {
      ignore = true;
    };
  }, [stateUser, header, waitExit]);


 useEffect(() => {
  let ignore = false;
  if (!ignore && states !== [] && updateUser.state_id !== "") 
    setCities(states[parseInt(updateUser.state_id) - 1].cities); 
   return () => {
    ignore = true;
  };
 }, [states, updateUser]);
 

  /**
   * handleInputChange
   *
   *    It captures typing events generated when entering values ​​in the html fields,
   *      and sets the corresponding internal state variable with the value entered in the "input".
   *   This function is associated by placing "onChange = {handleInputChange}" in the "input" of the form.
   *    A correspondence is defined between the names of the inputs in the HTML and the fields of the state variable updateUser
   *
   * @param e - Event information.
   */

  const handleInputChange = (e: InputChange) => {
    setUpdateUser({ ...updateUser, [e.target.id]: e.target.value });
  };

  /**
   * handleSubmit - Process the information uploaded in the register user form.
   *
   * @param e - Form event
   */

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    toast
      .promise(
        userService.updateUser(
          stateUser.usr_id,
          updateUser,
          header as AxiosRequestConfig
        ),
        {
          pending: {
            render({ data }) {
              return `In progress.....`;
            },
            className: "custom-toast",
            position: toast.POSITION.TOP_RIGHT,
          },
          success: {
            render({ data }) {
              return `Updated user data!`;
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
        }
      )
      .then(() => setWaitExit(true))
      .catch(() => setWaitExit(true));
  };

  useWaitToRedirect(redirectPage, timeWait, waitExit);

  /* ----------------------------------- */

  return (
    <React.Fragment>
      {error.status && <Errors message={error.message} />}

      {!error.status && (
        <Container fluid>
          <Row className="update-user-styles">
            <Col lg={8} sm={12} md={10}>
              <Card className=" update-user-card-body">
                <Card.Title className="text-center mt-3">
                  Edit your account information
                </Card.Title>
                <Card.Body>
                  <Form onSubmit={handleSubmit}>
                    <Row className="update-user-card-body">
                      <Form.Group className="mb-1" controlId="usr_name">
                        <Form.Control
                          type="text"
                          placeholder="Enter your name"
                          autoFocus
                          value={updateUser.usr_name}
                          onChange={handleInputChange}
                          required
                        />
                      </Form.Group>

                      <Form.Group className="mb-1" controlId="usr_email">
                        <Form.Control
                          type="email"
                          placeholder="Enter your email"
                          value={updateUser.usr_email}
                          onChange={handleInputChange}
                          required
                        />
                      </Form.Group>

                      <Form.Group
                        className="mb-1"
                        controlId="usr_street_address"
                      >
                        <Form.Control
                          type="text"
                          placeholder="Enter your street address"
                          value={updateUser.usr_street_address}
                          onChange={handleInputChange}
                          required
                        />
                      </Form.Group>

                      <Form.Group controlId="state_id">
                        <Form.Control
                          type="text"
                          as="select"
                          value={updateUser.state_id}
                          onChange={(e) => {
                            handleInputChange(e);
                            setCities(
                              states[parseInt(e.target.value) - 1].cities
                            );
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
                          value={updateUser.city_id}
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
                          value={updateUser.usr_zip}
                          onChange={handleInputChange}
                          required
                        />
                      </Form.Group>

                      <Form.Group className="mb-1" controlId="usr_phone_number">
                        <Form.Control
                          type="text"
                          placeholder="Enter your phone number"
                          value={updateUser.usr_phone_number}
                          onChange={handleInputChange}
                          required
                        />
                      </Form.Group>

                      <div className="update-user-div-button mt-2">
                        <Button
                          size="lg"
                          type="submit"
                          className="update-user-button-styles"
                        >
                          Save changes
                        </Button>
                      </div>
                    </Row>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      )}
      {!error.status && <ToastContainer />}
    </React.Fragment>
  );
};

export default UpdateUser;
