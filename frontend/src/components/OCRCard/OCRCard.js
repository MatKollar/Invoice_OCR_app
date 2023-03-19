import { useContext } from "react";
import OCRContext from "../../context/ocr-context";
import { Button, Typography, Grid } from "@mui/material";
import { useStyles } from "./styles";
import httpRequest from "../../httpRequest";

const OCRCard = () => {
  const classes = useStyles();
  const ocrCtx = useContext(OCRContext);

  const handleOCRmethod = async (OCRmethod) => {
    let formData = new FormData();
    formData.append("file", ocrCtx.actualImage);
    formData.append("pdf", ocrCtx.file);

    try {
      const resp = await httpRequest.post(
        `http://localhost:5000/${OCRmethod}`,
        formData
      );
      ocrCtx.setTextResult(resp["data"]["text"]);
      ocrCtx.setExtractedData(resp["data"]["parsed_data"]);
    } catch (error) {
      console.log("Error");
    }
    ocrCtx.setActivePage(3);
  };

  return (
    <>
      <div className={classes.rootContainer}>
        <Typography variant="h5" sx={{ pt: 2 }}>
          Select OCR method
        </Typography>

        <Grid container spacing={2} sx={{ mt: "15px" }}>
          <Grid item xs={6}>
            <Button
              variant="contained"
              onClick={() => handleOCRmethod("tesseract")}
              sx={{ px: "10%" }}
            >
              Tesseract
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button
              variant="contained"
              onClick={() => handleOCRmethod("paddleOCR")}
              sx={{ px: "10%" }}
            >
              PaddleOCR
            </Button>
          </Grid>
        </Grid>
      </div>
    </>
  );
};

export default OCRCard;
