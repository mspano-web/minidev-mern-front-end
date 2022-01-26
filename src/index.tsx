/**
 * index.tsx - Application entry point and request routing.
 */ 

import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Routes } from "react-router-dom";


import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";

import { Provider } from "react-redux";
import store from "./store/store";

import NavBarApp from "./components/NavBar/NavBarApp";
import SearchUserMenuDistribution from "./components/SearchUserMenuDistribution/SearchUserMenuDistribution";

import Categories from "./pages/Categories/Categories";
import Contacts from "./pages/Contacts/Contacts";
import AboutUs from "./pages/AboutUs/AboutUs";
import SingIn from "./pages/SingIn/SingIn";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import Publications from "./pages/Publications/Publications";
import PublicationDetails from "./pages/PublicationDetails/PublicationsDetails";
import Logout from "./pages/Logout/Logout";
import UpdateUser from "./pages/UpdateUser/UpdateUser";
import NewPublication from "./pages/NewPublication/NewPublication";
import RegisterUser from "./pages/RegisterUser/RegisterUser";
import NotFound from "./pages/NotFound/NotFound";
import SelectProduct from "./pages/SelectProduct/SelectProduct";


/* --------------------------------------------------------------- */

/* Comments - 
   Redux: The Provider component encompasses the entire application.
          It is a wrapper of the redux library to facilitate its use with React.
          It is the component to which the components are registered to receive updates when
          the store changes, it is for this reason that any component that wants to register
          to the store will have to be a descendant of Provider.
*/

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <NavBarApp />
        <SearchUserMenuDistribution />
        <Routes>
          <Route path="/" element={<Categories />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/contacts" element={<Contacts />} />
          <Route path="/sing-in" element={<SingIn />} />
          <Route path="/logout" element={<Logout />} /> 
          <Route path="/register" element={<RegisterUser />} />
          <Route path="/update-user" element={<UpdateUser />} />
          <Route path="forgotpassword" element={<ForgotPassword />} />
          <Route path="/publications/:search" element={<Publications />} />
          <Route path="/publications/admin" element={<SelectProduct/>} />
          <Route path="/publications/new-publication/:id" element={<NewPublication />} />
          <Route path="/publications/details/:id" element={<PublicationDetails />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

/* --------------------------------------------------------------- */


