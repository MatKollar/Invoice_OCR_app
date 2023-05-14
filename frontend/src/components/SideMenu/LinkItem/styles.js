import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles({
  linkItem: {
    textAlign: "left",
    marginTop: 27,
    marginLeft: "20%",
  },
  link: {
    color: "white",
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
