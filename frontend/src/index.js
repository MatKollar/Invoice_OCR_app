import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import "./index.css";
import "mdb-react-ui-kit/dist/css/mdb.min.css";
import App from "./pages/App/App";
import { AuthContextProvider } from "./context/auth-context";
import { OCRContextProvider } from "./context/ocr-context";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AuthContextProvider>
      <OCRContextProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </OCRContextProvider>
    </AuthContextProvider>
  </React.StrictMode>
);
