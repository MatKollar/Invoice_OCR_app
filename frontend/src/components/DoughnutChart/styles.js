import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles({
  center: {
    position: "absolute",
    top: "50%",
    left: "55%",
    transform: "translate(-50%, -50%)",
    width: "650px",
  },
  title: {
    textAlign: "center",
    margin: 15,
    fontWeight: "bold",
  },
  titleContainer: {
    display: "flex",
    justifyContent: "space-between",
  },
  icon: {
    color: "red",
    marginTop: 15,
    marginLeft: 10,
  },
  centerScore: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    fontSize: "2rem",
    fontWeight: "bold",
    color: "black",
    cursor: "pointer",
  },
  centerText: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    fontSize: "1.2rem",
    fontWeight: "bold",
    color: "black",
  },
  chartContainer: {
    width: 325,
    margin: "0 auto",
  },
  paragraph: {
    position: "absolute",
    margin: "0",
    padding: "0",
    top: "90%",
    left: "58%",
    transform: "translate(-50%, -50%)",
    fontSize: "1.2rem",
    width: "400px",
  },
});
