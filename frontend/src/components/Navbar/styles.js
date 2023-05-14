import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles({
  rootContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    color: "white",
    width: "100%",
    height: "60px",
    backgroundColor: "#3C4048",
  },
  headingContainer: {
    display: "flex",
  },
  rightButtons: {
    marginRight: "20px",
    "@media (max-width: 780px)": {
      marginRight: "70px", 
    },
    "@media (max-width: 520px)": {
      display: 'none'
    },
  },
});
