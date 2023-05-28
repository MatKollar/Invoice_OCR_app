import TextField from "@mui/material/TextField";

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
            borderColor: "#854de0",
          },
        },
        "& .MuiInputLabel-outlined.Mui-focused": {
          color: "#854de0",
        },
      }}
    />
  );
};

export default StyledTextField;
