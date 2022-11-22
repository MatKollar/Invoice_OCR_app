import { useContext } from "react";
import { Route, Routes, Navigate } from 'react-router-dom';

import HomePage from '../HomePage/HomePage';
import SignIn from '../SignInPage/SignIn';
import SignUp from '../SignUpPage/SignUp';
import AuthContext from "../../context/auth-context";

const App = () => {
  const ctx = useContext(AuthContext);

  return (
    <div className="App">
      <Routes>
        <Route path="/sign-in" element={!ctx.isLoggedIn && <SignIn />}/>
        <Route path="/sign-up" element={!ctx.isLoggedIn && <SignUp />}/>
        <Route path="/" element={ctx.isLoggedIn ? <HomePage /> : <Navigate replace to='/sign-in' />} />
      </Routes>
    </div>
  );
}

export default App;
