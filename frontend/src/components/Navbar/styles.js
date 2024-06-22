import { makeStyles } from "@mui/styles";
import { COLORS } from "../../styles/constants";

export const useStyles = makeStyles({
  rootContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    color: "white",
    width: "100%",
    height: "60px",
    backgroundColor: COLORS.DARK,
  },
  headingContainer: {
    display: "flex",
  },
  rightButtons: {
    marginRight: "20px",
    "@media (max-width: 590px)": {
      display: 'none'
    },
  },
});
