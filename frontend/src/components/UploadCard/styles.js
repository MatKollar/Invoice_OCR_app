import { makeStyles } from "@mui/styles";
import { COLORS } from "../../styles/constants";

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
  },
  loader: {
    position: "absolute",
    top: "64%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  },
  fileInput: {
    display: "block",
    width: "80%",
    margin: "0 auto",
    padding: "12px",
    border: `2px dashed ${COLORS.PRIMARY}`,
    borderRadius: "5px",
    cursor: "pointer",
    "&:hover": {
      borderColor: "#6439b7",
    },
  },
});
