import { useContext, useState } from "react";
import { useSnackbar } from "notistack";
import { Button, Tooltip, IconButton, Typography } from "@mui/material";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { BarLoader } from "react-spinners";
import { useStyles } from "./styles";
import ButtonContained from "../StyledComponents/ButtonContained";
import httpRequest from "../../httpRequest";
import OCRContext from "../../context/ocr-context";
import grayscaleImage from "../../images/preprocessing/grayscale.png";
import binarizationImage from "../../images/preprocessing/binarization.svg";
import noiseReductionImage from "../../images/preprocessing/noise_reduction.png";
import deskewImage from "../../images/preprocessing/skew_correction.png";
import removeBarcodeImage from "../../images/preprocessing/remove_barcode.png";
import { COLORS } from "../../styles/constants";
const cv = window.cv;

const PreprocessingCard = () => {
  const classes = useStyles();
  const ocrCtx = useContext(OCRContext);
  const { enqueueSnackbar } = useSnackbar();
  const [isLoading, setIsLoading] = useState(false);

  const handlePreprocessingMethod = async (methodEndpoint) => {
    let formData = new FormData();
    formData.append("file", ocrCtx.actualImage);
    setIsLoading(true);
    try {
      const resp = await httpRequest.post(
        `${process.env.REACT_APP_BACKEND_URL}/${methodEndpoint}`,
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
      enqueueSnackbar("Error during preprocessing", { variant: "error" });
    }
    setIsLoading(false);
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
          Select Preprocessing
        </Typography>
        <IconButton className={classes.resetButton} onClick={handleReset}>
          <RestartAltIcon sx={{ color: COLORS.PRIMARY_HOVER }} />
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
        {isLoading && (
          <div className={classes.loader}>
            <BarLoader color={COLORS.PRIMARY} width={150} />
          </div>
        )}
        <ButtonContained
          onClick={() => ocrCtx.setActivePage(2)}
          style={{
            marginBottom: "15px",
            padding: "5px 35px",
          }}
        >
          NEXT
        </ButtonContained>
      </div>
    </>
  );
};

export default PreprocessingCard;
