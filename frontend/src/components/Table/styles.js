import { makeStyles } from "@mui/styles";
import { COLORS } from "../../styles/constants";

export const useStyles = makeStyles({
  focused: {
    "& .MuiInput-underline:after": {
      borderBottomColor: COLORS.PRIMARY,
    },
    "& .MuiFormLabel-root.Mui-focused": {
      color: COLORS.PRIMARY,
    },
  },
});
