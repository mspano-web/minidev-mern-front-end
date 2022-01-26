/**
 * Logout.tsx -  User logout the application.
 */

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { bindActionCreators } from "redux";
import { actionUserCreators } from "../../store/action-creators/user.actions.creators";
import { shippingCreators } from "../../store/action-creators/shipping.actions.creators";
import { useWaitToRedirect } from "../../common/hooks/useWaitToRedirect";
import { USER_LOGOUT } from "../../common/types/UserType"

/**
 * Logout - Log the user out of the app. Internally updates the state of the session.
 *
 * @returns - JSX element.
 */

const Logout = () => {
  const dispatch = useDispatch();
  const { logoutUser } = bindActionCreators(actionUserCreators, dispatch); // Redux update
  const { resetShipping } = bindActionCreators(shippingCreators, dispatch); // Redux update
  const [waitExit, setWaitExit] = useState(false); 
  const timeWait = 4000 //ms
  const redirectPage = "/"  //home

  useEffect(() => {
    if (!waitExit) {
      logoutUser();
    }
  }, [logoutUser, waitExit]);

  useEffect(() => {
    if (!waitExit) {
      resetShipping();
      sessionStorage.setItem("login_user", USER_LOGOUT);
      toast.info("Thanks for your visit!");
      setWaitExit(true);
    }
  }, [resetShipping, waitExit]);

  useWaitToRedirect(redirectPage, timeWait, waitExit);

  return (
    <div>
      <ToastContainer />
    </div>
  );
};

export default Logout;
