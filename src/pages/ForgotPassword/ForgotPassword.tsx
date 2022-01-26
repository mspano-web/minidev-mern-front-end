/**
 * ForgotPassword.tsx - Reset password
 *
 */

import React, { ChangeEvent, FormEvent, useState } from "react";
import * as axios from "axios";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Form, Button, Container, Card, Row, Col } from "react-bootstrap";
import * as forgotService from "./ForgotPasswordService";

import { useWaitToRedirect } from "../../common/hooks/useWaitToRedirect";

import "./ForgotPassword.css";

/**
 *
 * ForgotPassword - 
 * 
 * @returns - JSX element
 */
const ForgotPassword = () => {
  const [email, setEmail] = useState<string>("");

  type InputChange = ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;
  type ServerError = { errorMessage: string };

  
  const [waitExit, setWaitExit] = useState(false);
  const timeWait = 8000; //ms
  const redirectPage = "/"; //home

  /**
   * handleInputChange
   *
   *    It captures typing events generated when entering values ​​in the html fields,
   *      and sets the corresponding internal state variable with the value entered in the "input".
   *   This function is associated by placing "onChange = {handleInputChange}" in the "input" of the form.
   *    A correspondence is defined between the names of the inputs in the HTML and the fields of the state variable email
   *
   * @param e - Event information.
   */
  const handleInputChange = (e: InputChange) => {
    setEmail(e.target.value);
  };

  /**
   * handleSubmit - Process the information uploaded in the form.
   *
   * @param e - Form event
   */

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    toast.promise(forgotService.forgotPassword(email), {
      pending: {
        render({ data }) {
          return `In progress.....`;
        },
        className: "custom-toast",
        position: toast.POSITION.TOP_RIGHT,
      },
      success: {
        render({ data }) {
          // data is a message. in this case we replace the received message with the following message:
          return `Please, to reset your password, open the email that we have sent you and follow the instructions.`;
        },
        className: "custom-toast",
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 6000,
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
        autoClose: 6000,
        icon: "🔴",
      },
    })      
    .then(() => setWaitExit(true))
    .catch(() => setEmail(""));;
  };

  useWaitToRedirect(redirectPage, timeWait, waitExit);

  return (
    <React.Fragment>
      <Container fluid className="forgot-password-styles">
        <Row>
          <Col>
            <Card className="mx-2 mt-2 mb-5">
              <Card.Title className="text-center">Password reset</Card.Title>
              <Card.Body>
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-2 mt-2" controlId="usr_email">
                    <Form.Control
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>

                  <div className="forgot-password-div-button mt-5 mb-2">
                    <Button
                      size="lg"
                      type="submit"
                      className="forgot-password-button-styles"
                    >
                      Reset Password
                    </Button>
                  </div>
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

export default ForgotPassword;
