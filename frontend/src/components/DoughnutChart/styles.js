import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles({
  center: {
    position: "relative",
    margin: "30px auto",
    width: "60%",
    "@media (max-width:900px)": {
      width: "80%",
    },
    "@media (max-width:560px)": {
      width: "90%",
    },
  },
  containers: {
    width: "100%",
    padding: 30,
    paddingTop: 0,
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
    "@media (max-width:900px)": {
      fontSize: "1.5rem",
      top: "55%",
    },
    "@media (max-width:560px)": {
      fontSize: "1.2rem",
      top: "55%",
    },
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
    width: "380px",
    margin: "0 auto",
    "@media (max-width:900px)": {
      width: "300px",
    },
    "@media (max-width:750px)": {
      width: "250px",
    },
    "@media (max-width:560px)": {
      width: "200px",
    },
  },
  paragraph: {
    textAlign: "center",
    margin: "0 auto",
    marginTop: 15,
    padding: "0",
    fontSize: "1.2rem",
    width: "400px",
    "@media (max-width:560px)": {
      width: "200px",
      fontSize: "1rem",
    },
  },
});
