import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles(() => ({
  rootContainer: {
    width: "100%",
    height: "55px",
    backgroundColor: "#EDE4E0",
    boxShadow: "1px 3px 3px #999999",
    display: "flex",
    justifyContent: "space-around",
    overflow: "hidden",
  },
  tabsContainer: {
    textDecoration: "none",
  },
  text: {
    display: "block",
  },

  "@media (max-width:570px)": {
    text: {
      display: "none",
    },
  },
}));
