import Button from "@mui/material/Button";

const ButtonOutlined = (props) => {
  return (
    <Button
      {...props}
      variant="outlined"
      sx={{
        fontFamily: "Oxanium, cursive",
        color: "#854de0",
        borderColor: "#854de0",
        "&:hover": {
          backgroundColor: "#854de0",
          color: "#fff",
          borderColor: "#854de0",
        },
      }}
    />
  );
};

export default ButtonOutlined;
