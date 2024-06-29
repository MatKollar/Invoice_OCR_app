import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { SnackbarProvider } from "notistack";
import { ThemeProvider } from "@mui/material/styles";

import "./index.css";
import App from "./pages/App/App";
import { OCRContextProvider } from "./context/ocr-context";
import { UserContextProvider } from "./context/user-context";
import { AuthProvider } from "./context/auth-context";
import theme from "./styles/theme";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <UserContextProvider>
          <OCRContextProvider>
            <BrowserRouter>
              <SnackbarProvider maxSnack={3}>
                <App />
              </SnackbarProvider>
            </BrowserRouter>
          </OCRContextProvider>
        </UserContextProvider>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);
