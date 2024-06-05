import { useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";
import { AuthContext } from "../context/auth-context";
import httpRequest from "../httpRequest";

const useAuth = () => {
  const location = useLocation();
  const authContext = useContext(AuthContext);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const resp = await httpRequest.get(`${process.env.REACT_APP_BACKEND_URL}/@me`);
        const { name, email, role } = resp.data;
        authContext.login({ name, email, role });
      } catch (error) {
        if (location.pathname !== "/login" && location.pathname !== "/register") {
          authContext.logout();
          window.location.href = "/login";
        }
      }
    };

    if (
      !authContext.isAuthenticated() &&
      location.pathname !== "/login" &&
      location.pathname !== "/register"
    ) {
      fetchCurrentUser();
    }
  }, [location, authContext]);
};

export default useAuth;
