/**
 * useWaitToRedirect.ts - Apply a timeout and then navigate to the route indicated by parameter.
 */
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

/**
 * useWaitToRedirect - Custom Hook
 * 
 * @param route - destination route
 * @param time  - wait time
 * @param waitExit - Active redirect indicator. 
 *                   If it is true, the procedure is carried out. If it is false, it is not done.
 */

export const useWaitToRedirect = (route: string, time: number, waitExit: boolean) => {
  const navigate = useNavigate();

  const waitToRedirect = useCallback((route: string, time:number) => {
    setTimeout(() => {
      navigate(route);
    }, time);
  }, [navigate]);

  if (waitExit) waitToRedirect(route, time);
};

/* --------------------------- */
