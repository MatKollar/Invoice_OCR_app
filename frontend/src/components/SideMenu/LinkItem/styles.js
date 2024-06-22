import { makeStyles } from "@mui/styles";
import { COLORS } from "../../../styles/constants";

export const useStyles = makeStyles({
  linkItem: {
    textAlign: "left",
    marginTop: 25,
    marginLeft: "20%",
    marginBottom: 20,
  },
  link: {
    textDecoration: "none",
    display: "flex",
    alignItems: "center",
    color: "white",
    "&:hover": {
      color: COLORS.PRIMARY,
    },
  },
  linkIcon: {
    marginRight: 10,
  },
  mobileHide: {
    "@media (max-width:960px)": {
      display: "none",
    },
  },
  "@media (max-width:960px)": {
    linkItem: {
      textAlign: "center",
    },
    linkIcon: {
      marginRight: 25,
      fontSize: "40px !important",
    },
  },

  "@media (max-width:600px)": {
    linkIcon: {
      fontSize: "30px !important",
    },
  },
});
