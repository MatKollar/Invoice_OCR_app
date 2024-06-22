import { useContext, useState } from "react";

import { useSnackbar } from "notistack";
import { Typography, Grid, CircularProgress } from "@mui/material";
import { useStyles } from "./styles";
import ButtonOutlined from "../StyledComponents/ButtonOutlined";
import httpRequest from "../../httpRequest";
import OCRContext from "../../context/ocr-context";
import { COLORS } from "../../styles/constants";

const OCRCard = () => {
  const classes = useStyles();
  const ocrCtx = useContext(OCRContext);
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const handleOCRmethod = async (OCRmethod) => {
    setLoading(true);

    let formData = new FormData();
    formData.append("file", ocrCtx.actualImage);
    if (ocrCtx.file.type === "application/pdf") {
      formData.append("pdf", ocrCtx.file);
    } else if (ocrCtx.file.type === "image/jpeg") {
      formData.append("image", ocrCtx.file);
    } else if (ocrCtx.file.type === "image/png") {
      formData.append("image", ocrCtx.file);
    } else if (ocrCtx.file.type === "image/webp") {
      formData.append("image", ocrCtx.file);
    } else {
      formData.append("image", ocrCtx.file);
    }

    try {
      const startTime = performance.now();
      const resp = await httpRequest.post(`${process.env.REACT_APP_BACKEND_URL}/${OCRmethod}`, formData);
      const endTime = performance.now();
      const duration = (endTime - startTime) / 1000;
      const time_other = duration - resp.data.time.recognition + resp.data.time.parsing;
      const time = resp["data"]["time"];
      time["other"] = time_other;
      ocrCtx.setTextResult(resp["data"]["text"]);
      const isInvoice = checkIfInvoice(resp["data"]);
      const extractedData = {
        ...resp["data"]["parsed_data"],
        id: resp["data"]["invoice_id"],
      };
      ocrCtx.setExtractedData(extractedData);
      ocrCtx.setInvoiceId(resp["data"]["invoice_id"]);
      if (isInvoice) {
        saveTimeOther(resp["data"]["invoice_id"], time_other);
      }
    } catch (error) {
      console.log("Error");
      enqueueSnackbar("Error", { variant: "error" });
    }

    setLoading(false);
    ocrCtx.setActivePage(3);
  };

  const checkIfInvoice = (data) => {
    if (
      data["parsed_data"]["invoice_number"] === "" &&
      data["parsed_data"]["var_symbol"] === "" &&
      data["parsed_data"]["total_price"] === "" &&
      data["parsed_data"]["due_date"] === "" &&
      data["parsed_data"]["iban"] === "" &&
      data["parsed_data"]["buyer_ico"] === "" &&
      data["parsed_data"]["supplier_ico"] === "" &&
      data["parsed_data"]["bank"] === ""
    ) {
      ocrCtx.setIsInvoice(false);
      return false;
    } else {
      ocrCtx.setIsInvoice(true);
      return true;
    }
  };

  const saveTimeOther = async (invoice_id, time_other) => {
    try {
      await httpRequest.post(`${process.env.REACT_APP_BACKEND_URL}/save-time-other`, {
        invoice_id: invoice_id,
        time_other: time_other,
      });
    } catch (error) {
      console.log("Error");
      enqueueSnackbar("Error", { variant: "error" });
    }
  };

  return (
    <>
      <div className={classes.rootContainer}>
        <Typography variant="h5" sx={{ pt: 2 }}>
          Select OCR
        </Typography>

        <Grid container spacing={0} sx={{ mt: "15px" }}>
          <Grid item xs={6}>
            <ButtonOutlined
              onClick={() => handleOCRmethod("tesseract")}
              style={{
                padding: "6px 18px",
              }}
              disabled={loading}
            >
              Tesseract
            </ButtonOutlined>
          </Grid>
          <Grid item xs={6}>
            <ButtonOutlined
              variant="outlined"
              onClick={() => handleOCRmethod("paddleOCR")}
              style={{
                padding: "6px 18px",
              }}
              disabled={loading}
            >
              PaddleOCR
            </ButtonOutlined>
          </Grid>
        </Grid>

        {loading && <CircularProgress sx={{ color: COLORS.PRIMARY, mt: "15px" }} />}
      </div>
    </>
  );
};

export default OCRCard;
