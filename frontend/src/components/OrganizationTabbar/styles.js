import { makeStyles } from "@mui/styles";
import { COLORS } from "../../styles/constants";

export const useStyles = makeStyles({
  rootContainer: {
    color: "black",
    width: "100%",
    height: "55px",
    backgroundColor: COLORS.CREAM,
    boxShadow: "1px 3px 3px #999999",
  },
  tabsContainer: {
    color: "black",
    textDecoration: "none",
  },
  text: {
    display: "block",
  },
  tabSelected: {
    color: `${COLORS.PRIMARY} !important`,
  },

  "@media (max-width:570px)": {
    text: {
      display: "none",
    },
  },
});
