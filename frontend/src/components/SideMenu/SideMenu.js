import { Typography } from "@mui/material";
import { useStyles } from "./styles";

const SideMenu = () => {
  const classes = useStyles();

  return (
    <>
      <div className={classes.rootContainer}>
        <Typography variant="h4" sx={{mt: 3}}>OCR app</Typography>
      </div>
    </>
  );
};

export default SideMenu;
