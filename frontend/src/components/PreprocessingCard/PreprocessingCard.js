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

  const handleBinarization = async () => {
    let formData = new FormData();
    formData.append("file", ocrCtx.originalImage);

    try {
      const resp = await httpRequest.post(
        "http://localhost:5000/binarization",
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

  const handleNoiseReduction = async () => {
    let formData = new FormData();
    formData.append("file", ocrCtx.originalImage);

    try {
      const resp = await httpRequest.post(
        "http://localhost:5000/noise_reduction",
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

  const handleSkewCorrection = async () => {
    let formData = new FormData();
    formData.append("file", ocrCtx.originalImage);

    try {
      const resp = await httpRequest.post(
        "http://localhost:5000/skew_correction",
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
