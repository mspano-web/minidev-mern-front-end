/**
 * useHttpHeader - HTTP Header Configuration.
 */
import { useSelector } from "react-redux";
import { IUserData } from "../../store/types/user-data.type";
import { useEffect, useState } from "react";
import { AxiosRequestConfig } from "axios";
import { USER_LOGIN } from "../../common/types/UserType"

const iniialHeader: AxiosRequestConfig = {
  headers: {
  "x-access-token": "",
  "x-security-role": "",
  Accept: "application/json",
  "Content-Type": "application/json",
  }
}

/**
 * useHttpHeader - Custom Hook - HTTP Header Configuration.
 *                 In this apllication only used for requirements that require security.
 * 
 * @returns - header data.
 */

export const useHttpHeader = () => {
  const [header, setHeader] = useState<AxiosRequestConfig>(iniialHeader);
  const stateUser: IUserData = useSelector((state: any) => state.user);

  useEffect(() => {
    const config: AxiosRequestConfig = {
      headers: {
        "x-access-token": stateUser.usr_token,
        "x-security-role": stateUser.usr_rol_name,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    if ((sessionStorage.login_user) && 
        (sessionStorage.getItem("login_user") === USER_LOGIN) && 
        (stateUser.usr_token && stateUser.usr_rol_name)) {
            setHeader(config);
    } 

  }, [stateUser]);


  return header;
};
