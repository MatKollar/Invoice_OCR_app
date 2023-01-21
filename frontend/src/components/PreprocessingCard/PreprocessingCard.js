import { useContext } from "react";
import OCRContext from "../../context/ocr-context";
import { Button, Grid, IconButton, Typography } from "@mui/material";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
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

  const handleReset = () => {
    const originalImage = ocrCtx.originalImage;
    if (originalImage) {
      const img = new Image();
      img.onload = () => {
        const mat = cv.imread(img);
        cv.imshow("output", mat);
        mat.delete();
      };
      img.src = URL.createObjectURL(originalImage);
    }
  };

  return (
    <>
      <div className={classes.rootContainer}>
        <Typography variant="h5" sx={{ pt: 2 }}>
          Select preprocessing
        </Typography>
        <IconButton className={classes.resetButton} onClick={handleReset}>
          <RestartAltIcon />
        </IconButton>

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
