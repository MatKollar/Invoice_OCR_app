import { Button, Typography } from "@mui/material";
import { useStyles } from "./styles";
const cv = window.cv;

const PreprocessingCard = () => {
  const classes = useStyles();

  return (
    <>
      <div className={classes.rootContainer}>
        <Typography variant="h5" sx={{ pt: 2 }}>
          Select preprocessing
        </Typography>

        <Button
          variant="contained"
          //   onClick={handleClick}
          sx={{ margin: "20px", px: "10%" }}
        >
          NEXT
        </Button>
      </div>
    </>
  );
};

export default PreprocessingCard;
