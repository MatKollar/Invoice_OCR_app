import Button from "@mui/material/Button";
import { COLORS } from "../../styles/constants";

const ButtonOutlined = (props) => {
  return (
    <Button
      {...props}
      variant="outlined"
      sx={{
        color: COLORS.PRIMARY,
        borderColor: COLORS.PRIMARY,
        "&:hover": {
          backgroundColor: COLORS.PRIMARY,
          color: "#fff",
          borderColor: COLORS.PRIMARY,
        },
      }}
    />
  );
};

export default ButtonOutlined;
