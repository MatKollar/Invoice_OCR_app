import { useContext } from "react";
import OCRContext from "../../context/ocr-context";
import { Button, Grid, Typography } from "@mui/material";
import { useStyles } from "./styles";
const cv = window.cv;

const PreprocessingCard = () => {
  const classes = useStyles();
  const ocrCtx = useContext(OCRContext);

  const handleGrayScale = () => {
    const src = cv.imread("output");
    cv.cvtColor(src, src, cv.COLOR_RGBA2GRAY, 0);
    cv.imshow("output", src);
    src.delete();
  };

  const handleBinarization = () => {
    console.log("asdasd");
    let src = cv.imread("output");
    let dst = new cv.Mat();
    let thresholdValue = 0;
    let maxValue = 255;
    let thresholdType = cv.THRESH_OTSU;
    cv.cvtColor(src, src, cv.COLOR_RGBA2GRAY, 0);
    cv.threshold(src, dst, thresholdValue, maxValue, thresholdType);
    cv.imshow("output", dst);
    src.delete();
  };

  return (
    <>
      <div className={classes.rootContainer}>
        <Typography variant="h5" sx={{ pt: 2 }}>
          Select preprocessing
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={3}>
            <Button
              variant="contained"
              onClick={handleGrayScale}
              sx={{ margin: "20px", px: "10%" }}
            >
              Grayscale
            </Button>
          </Grid>
          <Grid item xs={3}>
            <Button
              variant="contained"
              onClick={handleBinarization}
              sx={{ margin: "20px", px: "10%" }}
            >
              Binarization
            </Button>
          </Grid>
        </Grid>

        <Button
          variant="contained"
          onClick={() => ocrCtx.setActivePage(2)}
          sx={{ margin: "5px", px: "10%" }}
        >
          NEXT
        </Button>
      </div>
    </>
  );
};

export default PreprocessingCard;
