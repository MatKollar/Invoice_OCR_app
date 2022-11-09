import { Route, Routes } from 'react-router-dom';


import SignIn from '../SignInPage/SignIn';
import SignUp from '../SignUpPage/SignUp';

const App = () => {
  return (
    <div className="App">
      <Routes>
        <Route path="/sign-in" element={<SignIn />}/>
        <Route path="/sign-up" element={<SignUp />}/>
      </Routes>
    </div>
  );
}

export default App;
