import { Route, Routes } from 'react-router-dom';


import AuthPage from "../AuthPage/AuthPage";

const App = () => {
  return (
    <div className="App">
      <Routes>
        <Route path="/login" element={<AuthPage />}/>
      </Routes>
    </div>
  );
}

export default App;
