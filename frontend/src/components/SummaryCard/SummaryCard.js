import { useContext, useState } from "react";
import OCRContext from "../../context/ocr-context";
import { TextField, Button, Paper, IconButton, Grid } from "@mui/material";
import { useStyles } from "./styles";
import SellerTable from "./SellerTable/SellerTable";
import BuyerTable from "./BuyerTable/BuyerTable";
import InvoiceTable from "./InvoiceTable/InvoiceTable";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import DownloadIcon from "@mui/icons-material/Download";

const SummaryCard = (props) => {
  const classes = useStyles();
  const ocrCtx = useContext(OCRContext);
  const [showText, setShowText] = useState(true);

  let pdfBase64;
  let imageBase64;
  if (Object.keys(props).length !== 0) {
    if (props.dataFromDB.pdf_file) {
      pdfBase64 = props.dataFromDB.pdf_file;
    } else if (props.dataFromDB.image_file) {
      imageBase64 = props.dataFromDB.image_file;
    }
  }

  const handleOpenFile = () => {
    if (Object.keys(props).length === 0) {
      const fileURL = URL.createObjectURL(ocrCtx.file);
      window.open(fileURL, "_blank");
    }

    if (pdfBase64) {
      const byteCharacters = atob(pdfBase64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "application/pdf" });
      const dataUrl = URL.createObjectURL(blob);
      window.open(dataUrl, "_blank");
    } else if (imageBase64) {
      const byteCharacters = atob(imageBase64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "image/png" });
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
    }
  };

  const handleDownloadFile = async () => {
    if (Object.keys(props).length == 0) {
      const fileURL = URL.createObjectURL(ocrCtx.file);
      const link = document.createElement("a");
      link.href = fileURL;
      link.download = "file." + ocrCtx.file.type.split("/")[1];
      link.click();
      setTimeout(() => {
        URL.revokeObjectURL(fileURL);
      }, 100);
    }

    if (pdfBase64) {
      const byteCharacters = atob(pdfBase64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "file.pdf";
      link.click();
      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 100);
    } else if (imageBase64) {
      const byteCharacters = atob(imageBase64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "image/png" });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "file.png";
      link.click();
      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 100);
    }
  };

  return (
    <>
      <div className={classes.rootContainer}>
        <Grid container>
          <Grid item xs={12} sx={{ textAlign: "right", marginRight: 10 }}>
            <IconButton sx={{ padding: "10px" }} onClick={handleDownloadFile}>
              <DownloadIcon fontSize="large" />
            </IconButton>
            <IconButton sx={{ padding: "10px" }} onClick={handleOpenFile}>
              <OpenInNewIcon fontSize="large" />
            </IconButton>
          </Grid>
          <Grid item xs={6}>
            <div className={classes.textContainer}>
              {showText && (
                <Paper elevation={3} sx={{ p: 2, borderRadius: 5 }}>
                  <TextField
                    id="outlined-multiline-static"
                    sx={{ backgroundColor: "white", borderRadius: "20px" }}
                    label="Text from OCR"
                    multiline
                    fullWidth
                    rows={20}
                    variant={"standard"}
                    defaultValue={
                      props.dataFromDB ? props.dataFromDB.text : ocrCtx.textResult
                    }
                  />
                </Paper>
              )}

              <Button
                variant="contained"
                onClick={() => setShowText(!showText)}
                sx={{ margin: "5px", px: "10%" }}
              >
                {showText ? "HIDE TEXT" : "SHOW TEXT"}
              </Button>
            </div>
          </Grid>

          <Grid item xs={6}>
            <div className={classes.tables}>
              <InvoiceTable
                data={
                  props.dataFromDB ? props.dataFromDB : ocrCtx.extractedData
                }
              />
              <div className={classes.tableContainer}>
                <SellerTable
                  data={
                    props.dataFromDB ? props.dataFromDB : ocrCtx.extractedData
                  }
                />
                <BuyerTable
                  data={
                    props.dataFromDB ? props.dataFromDB : ocrCtx.extractedData
                  }
                />
              </div>
            </div>
          </Grid>
        </Grid>
      </div>
    </>
  );
};

export default SummaryCard;
