import { useContext } from "react";
import OCRContext from "../../context/ocr-context";
import { Button, Grid, IconButton, Typography } from "@mui/material";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { useStyles } from "./styles";
import httpRequest from "../../httpRequest";
const cv = window.cv;

const PreprocessingCard = () => {
  const classes = useStyles();
  const ocrCtx = useContext(OCRContext);

  const handleGrayScale = async () => {
    let formData = new FormData();
    formData.append("file", ocrCtx.originalImage);

    try {
      const resp = await httpRequest.post(
        "http://localhost:5000/grayscale",
        formData
      );
      let bytestring = resp["data"]["status"];
      let image = bytestring.split("'")[1];
      let img = new Image();
      img.onload = () => {
        const mat = cv.imread(img);
        cv.imshow("output", mat);
        mat.delete();
      };
      img.src = "data:image/jpeg;base64," + image;

    } catch (error) {
      console.log("Error");
    }
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

  const handleNoiseReduction = () => {
    let src = cv.imread("output");
    let dst = new cv.Mat();
    let ksize = new cv.Size(3, 3);
    let anchor = new cv.Point(-1, -1);
    let borderType = cv.BORDER_DEFAULT;
    cv.medianBlur(src, dst, ksize, anchor, borderType);
    cv.imshow("output", dst);
    src.delete();
    dst.delete();
  };

  const handleSkewCorrection = () => {
    let mat = cv.imread("output");
    let dst = new cv.Mat();
    cv.cvtColor(mat, mat, cv.COLOR_RGB2GRAY, 0);
    cv.Canny(mat, dst, 50, 100, 3, false);

    cv.imshow("output", mat);
    cv.imshow("output", dst);

    dst.delete();
    mat.delete();
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
              sx={{ px: "10%" }}
            >
              Grayscale
            </Button>
          </Grid>
          <Grid item xs={3}>
            <Button
              variant="contained"
              onClick={handleBinarization}
              sx={{ px: "10%" }}
            >
              Binarization
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button
              variant="contained"
              onClick={handleNoiseReduction}
              sx={{ px: "10%" }}
            >
              Noise Reduction
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button
              variant="contained"
              onClick={handleSkewCorrection}
              sx={{ px: "10%" }}
            >
              Skew Correction
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
