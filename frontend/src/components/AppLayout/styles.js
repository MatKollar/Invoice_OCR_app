import { makeStyles } from "@mui/styles";
import { COLORS } from "../../styles/constants";

export const useStyles = makeStyles({
  pageWrapper: {
    display: "flex",
    minHeight: "100vh",
    backgroundColor: COLORS.GRAY_DARK,
  },
  contentWrapper: {
    width: "100%",
    flexGrow: 1,
    backgroundColor: COLORS.GRAY_LIGHT,
  },
  contentWrapperExpanded: {
    marginLeft: "0",
  },
});
