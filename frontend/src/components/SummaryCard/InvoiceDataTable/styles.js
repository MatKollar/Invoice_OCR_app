import { makeStyles } from "@mui/styles";
import { COLORS } from "../../../styles/constants";

export const useStyles = makeStyles({
  table: {
    width: "100%",
    marginBottom: 10,
  },
  focused: {
    "& .MuiInput-underline:after": {
      borderBottomColor: COLORS.PRIMARY,
    },
    "& .MuiFormLabel-root.Mui-focused": {
      color: COLORS.PRIMARY,
    },
  },
});
