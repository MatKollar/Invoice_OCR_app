import { useContext } from "react";
import { Route, Routes, Navigate } from "react-router-dom";

import LoginPage from "../LoginPage/LoginPage";
import RegisterPage from "../RegisterPage/RegisterPage";
import AuthContext from "../../context/auth-context";
import HistoryPage from "../HistoryPage/HistoryPage";
import HomePage from "../HomePage/HomePage";

const App = () => {
  const ctx = useContext(AuthContext);

  return (
    <div className="App">
      <Routes>
        <Route path="/login" element={!ctx.isLoggedIn && <LoginPage />} />
        <Route path="/register" element={!ctx.isLoggedIn && <RegisterPage />} />
        <Route path="/" element={<HomePage />} />
        <Route
          path="/history"
          element={
            ctx.isLoggedIn ? <HistoryPage /> : <Navigate replace to="/login" />
          }
        />
      </Routes>
    </div>
  );
};

export default App;
