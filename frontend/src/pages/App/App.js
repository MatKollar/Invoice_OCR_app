import { Route, Routes } from 'react-router-dom';


import SignIn from '../SignInPage/SignIn';

const App = () => {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<SignIn />}/>
      </Routes>
    </div>
  );
}

export default App;
