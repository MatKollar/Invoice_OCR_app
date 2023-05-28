import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles({
  rootContainer: {
    position: "relative",
    margin: "0 auto",
    marginTop: 20,
    minWidth: "220px",
    width: "30%",
    maxWidth: "450px",
    height: "180px",
    borderRadius: 30,
    color: "black",
    backgroundColor: "white",
    boxShadow: "10px 10px 5px #999999",
  },
  input: {
    margin: "0 auto",
    marginTop: 20,
    width: "70%",
  },
  loader: {
    position: "absolute",
    top: "64%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  },
});
