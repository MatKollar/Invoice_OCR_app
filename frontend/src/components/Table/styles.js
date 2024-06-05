import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles({
  focused: {
    "& .MuiInput-underline:after": {
      borderBottomColor: "#854de0",
    },
    "& .MuiFormLabel-root.Mui-focused": {
      color: "#854de0",
    },
  },
});
