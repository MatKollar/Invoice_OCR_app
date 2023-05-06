import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { SnackbarProvider } from "notistack";

import "./index.css";
import "mdb-react-ui-kit/dist/css/mdb.min.css";
import App from "./pages/App/App";
import { OCRContextProvider } from "./context/ocr-context";
import { UserContextProvider } from "./context/user-context";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <UserContextProvider>
      <OCRContextProvider>
        <BrowserRouter>
          <SnackbarProvider maxSnack={3}>
            <App />
          </SnackbarProvider>
        </BrowserRouter>
      </OCRContextProvider>
    </UserContextProvider>
  </React.StrictMode>,
);
