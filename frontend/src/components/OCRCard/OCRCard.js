import { Button, Typography } from "@mui/material";
import { useStyles } from "./styles";
const cv = window.cv;

const OCRCard = () => {
  const classes = useStyles();

  return (
    <>
      <div className={classes.rootContainer}>
        <Typography variant="h5" sx={{ pt: 2 }}>
          Select OCR method
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

export default OCRCard;
