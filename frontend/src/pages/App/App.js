import { useContext } from "react";
import { Route, Routes } from "react-router-dom";

import LoginPage from "../LoginPage/LoginPage";
import RegisterPage from "../RegisterPage/RegisterPage";
import HistoryPage from "../HistoryPage/HistoryPage";
import HomePage from "../HomePage/HomePage";
import OrganizationPage from "../OrganizationPage/OrganizationPage";
import UsersPage from "../UsersPage/UsersPage";
import { useStyles } from "./styles";
import useAuth from "../../hooks/useAuth";
import AuthContext from "../../context/auth-context";

const App = () => {
  const classes = useStyles();
  const authContext = useContext(AuthContext);

  useAuth();

  return (
    <div className={classes.appContainer}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/"
          element={authContext.isAuthenticated() ? <HomePage /> : <LoginPage />}
        />
        <Route
          path="/history"
          element={authContext.isAuthenticated() ? <HistoryPage /> : <LoginPage />}
        />
        <Route
          path="/organization"
          element={authContext.isAuthenticated() ? <OrganizationPage /> : <LoginPage />}
        />
        <Route
          path="/users"
          element={authContext.isAuthenticated() ? <UsersPage /> : <LoginPage />}
        />
      </Routes>
    </div>
  );
};

export default App;
