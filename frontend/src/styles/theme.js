import { createTheme } from "@mui/material";
import { COLORS, FONT_FAMILIES } from "./constants";

const theme = createTheme({
  palette: {
    primary: {
      main: COLORS.PRIMARY,
    },
  },
  typography: {
    fontFamily: FONT_FAMILIES,
  },
});

export default theme;
