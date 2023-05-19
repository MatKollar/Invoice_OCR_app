import { useContext } from "react";

import { Button, Tooltip, IconButton, Typography } from "@mui/material";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { useStyles } from "./styles";
import httpRequest from "../../httpRequest";
import OCRContext from "../../context/ocr-context";
import grayscaleImage from "../../images/preprocessing/grayscale.png";
import binarizationImage from "../../images/preprocessing/binarization.svg";
import noiseReductionImage from "../../images/preprocessing/noise_reduction.png";
import deskewImage from "../../images/preprocessing/skew_correction.png";
import removeBarcodeImage from "../../images/preprocessing/remove_barcode.png";
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
        <Typography variant="h5" sx={{ pt: 2, fontFamily: "Oxanium, cursive" }}>
          Select Preprocessing
        </Typography>
        <IconButton className={classes.resetButton} onClick={handleReset}>
          <RestartAltIcon sx={{ color: "#6336ab" }} />
        </IconButton>

        <div className={classes.buttons}>
          <Tooltip title="Grayscale Image">
            <Button variant="text" onClick={() => handlePreprocessingMethod("grayscale")}>
              <img src={grayscaleImage} alt="Grayscale" style={{ width: "32px" }} />
            </Button>
          </Tooltip>

          <Tooltip title="Remove Barcodes">
            <Button
              variant="text"
              onClick={() => handlePreprocessingMethod("remove_barcodes")}
            >
              <img
                src={removeBarcodeImage}
                alt="Remove Barcodes"
                style={{ width: "40px" }}
              />
            </Button>
          </Tooltip>

          <Tooltip title="Noise Reduction">
            <Button
              variant="text"
              onClick={() => handlePreprocessingMethod("noise_reduction")}
            >
              <img
                src={noiseReductionImage}
                alt="Noise Reduction"
                style={{ width: "50px", padding: "-20px" }}
              />
            </Button>
          </Tooltip>

          <Tooltip title="Correct Skew">
            <Button
              variant="text"
              onClick={() => handlePreprocessingMethod("skew_correction")}
            >
              <img src={deskewImage} alt="Skew Correction" style={{ width: "35px" }} />
            </Button>
          </Tooltip>

          <Tooltip title="Binarization">
            <Button
              variant="text"
              onClick={() => handlePreprocessingMethod("binarization")}
            >
              <img src={binarizationImage} alt="Binarization" style={{ width: "40px" }} />
            </Button>
          </Tooltip>
        </div>

        <Button
          variant="contained"
          onClick={() => ocrCtx.setActivePage(2)}
          sx={{
            marginBottom: "15px",
            px: "10%",
            fontFamily: "Oxanium, cursive",
            backgroundColor: "#854de0",
            "&:hover": {
              backgroundColor: "#6336ab",
            },
          }}
        >
          NEXT
        </Button>
      </div>
    </>
  );
};

export default PreprocessingCard;
