import { makeStyles } from "@mui/styles";
import { COLORS } from "../../styles/constants";

export const useStyles = makeStyles({
  appContainer: {
    height: "100vh",
    width: "100%",
    overflow: "auto",
    overflowX: "hidden",
  },
  pageWrapper: {
    display: "flex",
  },
  contentWrapper: {
    width: "100%",
    height: "100%",
    backgroundColor: COLORS.GRAY_LIGHT,
  },
});
