/**
 *  Sales.tsx
 */

import { Button, Modal } from "react-bootstrap";
import { useState, useEffect, useCallback } from "react";
import { IPublication } from "../../../common/types/PublicationsType";
import { ISale } from "./SalesType";
import * as serviceSale from "./SalesService";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import "./Sales.css";
import { useHttpHeader } from "../../../common/hooks/useHttpHeader";
import Errors from "../../../components/Errors/Errors";
import { AxiosRequestConfig } from "axios";
import { USER_LOGIN } from "../../../common/types/UserType"

interface Props {
  publication: IPublication;
}

const VISUAL_DATE = true;

/**
 * Sales - Record the sale.
 *         Functional component
 *
 * @param param0 -  publication - Publication data
 * @returns - JSX Element
 */

const Sales = ({ publication }: Props) => {
  const [show, setShow] = useState(true);
  const [error, setError] = useState({ message: "", status: false });

  const navigate = useNavigate();

  const header = useHttpHeader();

  /**
   * waitToRedirect - Generates a delay so that the emitted message is observed before navigating to "/"
   *
   */

  const waitToRedirect = useCallback(async () => {
    setTimeout(() => {
      navigate("/");
    }, 5000);
  }, [navigate]);

  /**
   * checkStatus - Preliminary checks. User logged in. Header with information.
   */
  const checkStatus = useCallback(async () => {
    if (header === null)
      setError({ message: "The request cannot be processed.", status: true });
    if (sessionStorage.login_user)
      if (sessionStorage.getItem("login_user") !== USER_LOGIN) {
        setError({
          message:
            "You must log into the application to perform this operation.",
          status: true,
        });
        await waitToRedirect();
      }
  }, [header, waitToRedirect]);

  useEffect(() => {
    let ignore = false;
    if (!ignore) checkStatus();
    return () => {   
      ignore = true;
    };
  }, [checkStatus]);

  /**
   * handleCancel - Handler for sale cancellation.
   */

  const handleCancel = async () => {
    toast.error("Purchase canceled.", { autoClose: 3000 });
    setShow(false);
    await waitToRedirect();
  };

  useEffect(() => {
    let ignore = false;
    if (!ignore) setShow(true);
    return () => {   
      ignore = true;
    };
  }, [show]);

  /* Comments - 
    useSelector allows us to synchronize the component with the redux store.
                register our components to receive updates.
                Receives a function as a parameter, said function will receive as a parameter the
                general state of the store, and the function must return the section of the store
                that interests us, in this way, every time the store changes, the hook will
                update the component with the new ones values, which will trigger a new rendering
                of the component to reflect the new values.
  */

  const stateUser = useSelector((state: any) => state.user);
  const stateConfiguration = useSelector((state: any) => state.config);
  const stateShipping = useSelector((state: any) => state.shipping);

  /**
   * addDaysToDate - Calculates from a return date and a number of days, the new date.
   *
   * @param date - reference date
   * @param days - number of days
   * @returns - New date
   */
  const addDaysToDate = (date: Date, days: number): Date => {
    var res = new Date(date);
    res.setDate(res.getDate() + days);
    return res;
  };

  /**
   * dateFormatLong - date formatting
   *
   * @param date - date to format
   * @returns - formatted date - (long format)
   */
  const dateFormatLong = (date: Date) => {
    const curr_date = date.getDate();
    const curr_month = date.getMonth() + 1;
    const curr_year = date.getFullYear();
    const curr_hours = date.getHours();
    const curr_minutes = date.getMinutes();
    const curr_seconds = date.getSeconds();
    return (
      curr_year +
      "-" +
      curr_month +
      "-" +
      curr_date +
      " " +
      curr_hours +
      ":" +
      curr_minutes +
      ":" +
      curr_seconds
    );
  };

  /**
   * dateShortFormat - date formatting
   *
   * @param date - date to format
   * @returns - formatted date - (short format)
   */
  const dateShortFormat = (date: Date) => {
    const curr_date = date.getDate();
    const curr_month = date.getMonth() + 1;
    const curr_year = date.getFullYear();
    return curr_date + "/" + curr_month + "/" + curr_year;
  };

  /**
   * deliveryDateCalc - calculate shipping date
   *
   * @param send - Visual flag
   * @returns - shipping date
   */
  const deliveryDateCalc = (send: boolean) => {
    const deliveryDate: Date = addDaysToDate(
      new Date(),
      stateShipping.city_delivery_days
    );
    return send === VISUAL_DATE
      ? dateShortFormat(deliveryDate)
      : dateFormatLong(deliveryDate);
  };

  /**
   * handleConfirmBuy - Sales confirmation handler.
   */
  const handleConfirmBuy = async () => {
    const sale: ISale = {
      // _id: "", // Generated in back-end
      pub_id: publication._id,
      usr_id: stateUser.usr_id,
      sale_delivery_date: deliveryDateCalc(!VISUAL_DATE),
      // sale_purchase_date: "",
      sale_invoice_amount:
        publication.pub_price + stateShipping.city_shipping_cost,
    };

    try {
     toast.promise(
      serviceSale.createSale(sale, header as AxiosRequestConfig),
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
            return `Thanks for your purchase!.`;
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
            setError({
              message:
                "We're sorry. An error has occurred. Your request could not be processed.",
              status: true,
            });
            return `We're sorry. An error has occurred. Your request could not be processed.`;
          },
          className: "custom-toast",
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 4000,
          icon: "🔴",
        },
      }
    );
    } catch (e) {
      setError({
        message:
          "We're sorry. An error has occurred. Your request could not be processed.",
        status: true,
      });
    }
    await waitToRedirect();
  };

  /* --------------------------------------------- */

  return (
    <>
      {error.status && <Errors message={error.message} />}
      {!error.status && (
        <Modal show={show} onHide={handleCancel}>
          <Modal.Header closeButton className="sales-confirm-header">
            <Modal.Title>{publication.pub_title}</Modal.Title>
          </Modal.Header>
          <Modal.Body className="sales-confirm-body">
            <h2 className="sales-confirm-total">
              Total: ${" "}
              {publication.pub_price + stateShipping.city_shipping_cost}
            </h2>
            <h2 className="sales-confirm-arrive">
              {" "}
              <span className="sales-confirm-arrive-text">
                {" "}
                Arrives at your home on {deliveryDateCalc(VISUAL_DATE)}
              </span>{" "}
              <span className="sales-confirm-arrive-text">
                between {stateConfiguration.conf_delivery_time_from} and{" "}
                {stateConfiguration.conf_delivery_time_to} hours{" "}
              </span>{" "}
            </h2>
          </Modal.Body>
          <Modal.Footer className="sales-select-opctions">
            <div className="d-grid gap-2">
              <Button
                size="lg"
                className="sales-confirm-button"
                onClick={handleConfirmBuy}
              >
                Confirm purchase ?
              </Button>
              <Button
                size="lg"
                className="sales-cancel-button"
                onClick={handleCancel}
              >
                Cancel
              </Button>
            </div>
          </Modal.Footer>
        </Modal>
      )}{" "}
      <ToastContainer />
    </>
  );
};

export default Sales;
