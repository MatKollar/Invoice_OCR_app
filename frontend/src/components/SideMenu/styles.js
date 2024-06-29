import { makeStyles } from "@mui/styles";
import { COLORS } from "../../styles/constants";

export const useStyles = makeStyles({
  rootContainer: {
    position: "relative",
    color: "white",
    backgroundColor: COLORS.DARKER,
    textAlign: "center",
    width: "250px",
    transition: "width 0.3s ease-in-out",
  },
  rootContainerCollapsed: {
    width: "0",
  },
  closeContainer: {
    textAlign: "right",
  },
  linkContainer: {
    marginTop: 10,
  },
  closeButton: {
    textAlign: "right",
    color: "white",
  },
  footerContainer: {
    marginBottom: 20,
    display: "none",
  },

  "@media (max-width:590px)": {
    footerContainer: {
      display: "block",
    },
  },
});
