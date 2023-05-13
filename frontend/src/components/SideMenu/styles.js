import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles({
  rootContainer: {
    position: "relative",
    color: "white",
    backgroundColor: "#222222",
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
  closeButton: {
    textAlign: "right",
    color: "white",
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
