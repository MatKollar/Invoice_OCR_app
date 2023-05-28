import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles({
  table: {
    width: "100%",
    marginBottom: 10,
  },
  focused: {
    "& .MuiInput-underline:after": {
      borderBottomColor: "#854de0",
    },
    "& .MuiFormLabel-root.Mui-focused": {
      color: "#854de0",
    },
  },
});
