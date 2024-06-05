import { createTheme } from "@mui/material";
import { FONT_FAMILIES } from "./constants";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
  },
  typography: {
    fontFamily: FONT_FAMILIES,
  },
});

export default theme;
