import { useContext } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { useStyles } from "./styles";

import HomePage from "../HomePage/HomePage";
import SignIn from "../SignInPage/SignIn";
import SignUp from "../SignUpPage/SignUp";
import AuthContext from "../../context/auth-context";
import SideMenu from "../../components/SideMenu/SideMenu";
import Navbar from "../../components/Navbar/Navbar";
import Tabbar from "../../components/Tabbar/Tabbar";

const App = () => {
  const ctx = useContext(AuthContext);
  const classes = useStyles();

  return (
    <div className="App">
      <Routes>
        <Route path="/sign-in" element={!ctx.isLoggedIn && <SignIn />} />
        <Route path="/sign-up" element={!ctx.isLoggedIn && <SignUp />} />
        <Route
          path="/"
          element={!ctx.isLoggedIn && <Navigate replace to="/sign-in" />}
        />
        <Route
          path="/upload"
          element={!ctx.isLoggedIn && <Navigate replace to="/sign-in" />}
        />
      </Routes>

      {ctx.isLoggedIn && (
        <div className={classes.pageWrapper}>
          <SideMenu />
          <div className={classes.contentWrapper}>
            <Navbar />
            <Tabbar />
            <Routes>
              <Route
                path="/upload"
                element={
                  ctx.isLoggedIn ? (
                    <HomePage />
                  ) : (
                    <Navigate replace to="/sign-in" />
                  )
                }
              />
            </Routes>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
