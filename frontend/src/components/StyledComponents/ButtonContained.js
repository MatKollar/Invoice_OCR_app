import Button from "@mui/material/Button";

const ButtonContained = (props) => {
  return (
    <Button
      {...props}
      variant="contained"
      sx={{
        backgroundColor: "#854de0",
        "&:hover": {
          backgroundColor: "#6336ab",
        },
      }}
    />
  );
};

export default ButtonContained;
