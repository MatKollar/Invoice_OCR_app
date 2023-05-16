import { useContext } from "react";

import { Button, Grid, IconButton, Typography } from "@mui/material";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { useStyles } from "./styles";
import httpRequest from "../../httpRequest";
import OCRContext from "../../context/ocr-context";
const cv = window.cv;

const PreprocessingCard = () => {
  const classes = useStyles();
  const ocrCtx = useContext(OCRContext);

  const handlePreprocessingMethod = async (methodEndpoint) => {
    let formData = new FormData();
    formData.append("file", ocrCtx.actualImage);

    try {
      const resp = await httpRequest.post(
        `http://localhost:5000/${methodEndpoint}`,
        formData,
      );
      let bytestring = resp["data"]["image"];
      let image = bytestring.split("'")[1];
      let img = new Image();
      img.onload = () => {
        const mat = cv.imread(img);
        cv.imshow("output", mat);
        mat.delete();
      };
      img.src = "data:image/jpeg;base64," + image;
      const base64Response = await fetch(`data:image/jpeg;base64,${image}`);
      const blob = await base64Response.blob();
      let file = new File([blob], resp["data"]["filename"], {
        type: "image/jpeg",
        lastModified: new Date().getTime(),
      });

      ocrCtx.setActualImage(file);
    } catch (error) {
      console.log("Error");
    }
  };

  const handleReset = () => {
    ocrCtx.setActualImage(ocrCtx.originalImage);
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
              onClick={() => handlePreprocessingMethod("grayscale")}
              sx={{ px: "10%" }}
            >
              Grayscale
            </Button>
          </Grid>
          <Grid item xs={3}>
            <Button
              variant="contained"
              onClick={() => handlePreprocessingMethod("binarization")}
              sx={{ px: "10%" }}
            >
              Binarization
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button
              variant="contained"
              onClick={() => handlePreprocessingMethod("noise_reduction")}
              sx={{ px: "10%" }}
            >
              Noise Reduction
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button
              variant="contained"
              onClick={() => handlePreprocessingMethod("skew_correction")}
              sx={{ px: "10%" }}
            >
              Skew Correction
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button
              variant="contained"
              onClick={() => handlePreprocessingMethod("remove_barcodes")}
              sx={{ px: "10%" }}
            >
              Remove Barcodes
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
