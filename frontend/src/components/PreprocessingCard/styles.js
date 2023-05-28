import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles({
  rootContainer: {
    margin: "0 auto",
    marginTop: 20,
    minWidth: "220px",
    width: "30%",
    maxWidth: "450px",
    borderRadius: 30,
    color: "black",
    backgroundColor: "white",
    boxShadow: "10px 10px 5px #999999",
    position: "relative",
  },
  buttons: {
    display: "flex",
    justifyContent: "space-around",
    marginTop: "7px",
    marginBottom: "30px",
    flexWrap: "wrap",
  },
  resetButton: {
    position: "absolute !important",
    top: "2px",
    right: "10px",
  },
  loader: {
    position: "absolute",
    top: "65%",
    left: "50%",  
    transform: "translate(-50%, -50%)",
  }
});
