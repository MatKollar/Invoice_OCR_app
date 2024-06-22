import TextField from "@mui/material/TextField";
import { COLORS } from "../../styles/constants";

const StyledTextField = (props) => {
  return (
    <TextField
      {...props}
      sx={{
        margin: "normal",
        required: true,
        fullWidth: true,
        autoComplete: "off",
        "& .MuiOutlinedInput-root": {
          "&.Mui-focused fieldset": {
            borderColor: COLORS.PRIMARY,
          },
        },
        "& .MuiInputLabel-outlined.Mui-focused": {
          color: COLORS.PRIMARY,
        },
      }}
    />
  );
};

export default StyledTextField;
