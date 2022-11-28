import { useContext } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { useStyles } from "./styles";

import SignIn from "../SignInPage/SignIn";
import SignUp from "../SignUpPage/SignUp";
import AuthContext from "../../context/auth-context";
import UploadPage from "../UploadPage/UploadPage";
import PreprocessingPage from "../PreprocessingPage/PreprocessingPage";
import OCRPage from "../OCRPage/OCRPage";
import SummaryPage from "../SummaryPage/SummaryPage";

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
          element={
            ctx.isLoggedIn ? <UploadPage /> : <Navigate replace to="/sign-in" />
          }
        />
        <Route
          path="/preprocessing"
          element={
            ctx.isLoggedIn ? (
              <PreprocessingPage />
            ) : (
              <Navigate replace to="/sign-in" />
            )
          }
        />
        <Route
          path="/ocr"
          element={
            ctx.isLoggedIn ? <OCRPage /> : <Navigate replace to="/sign-in" />
          }
        />
        <Route
          path="/summary"
          element={
            ctx.isLoggedIn ? (
              <SummaryPage />
            ) : (
              <Navigate replace to="/sign-in" />
            )
          }
        />
      </Routes>
    </div>
  );
};

export default App;
