import { makeStyles } from "@mui/styles";
import { COLORS } from "../../styles/constants";

export const useStyles = makeStyles(() => ({
  rootContainer: {
    width: "100%",
    height: "55px",
    backgroundColor: COLORS.CREAM,
    boxShadow: "1px 3px 3px #999999",
    display: "flex",
    justifyContent: "space-around",
    overflow: "hidden",
  },
  tabsContainer: {
    marginTop: 4,
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
}));
