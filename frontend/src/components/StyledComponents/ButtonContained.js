import Button from "@mui/material/Button";
import { COLORS } from "../../styles/constants";

const ButtonContained = (props) => {
  return (
    <Button
      {...props}
      variant="contained"
      sx={{
        backgroundColor: COLORS.PRIMARY,
        "&:hover": {
          backgroundColor: COLORS.PRIMARY_HOVER,
        },
      }}
    />
  );
};

export default ButtonContained;
