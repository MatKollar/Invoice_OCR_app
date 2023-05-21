import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles({
  rootContainer: {
    color: "black",
    width: "100%",
    height: "55px",
    backgroundColor: "#EDE4E0",
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
    color: "#854de0 !important",
  },

  "@media (max-width:570px)": {
    text: {
      display: "none",
    },
  },
});
