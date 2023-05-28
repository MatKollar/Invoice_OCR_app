import { useContext, useEffect, useState } from "react";

import { useSnackbar } from "notistack";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import DownloadIcon from "@mui/icons-material/Download";
import DonutSmallIcon from "@mui/icons-material/DonutSmall";
import { TextField, Button, Paper, IconButton, Grid } from "@mui/material";

import OCRContext from "../../context/ocr-context";
import { useStyles } from "./styles";
import ButtonContained from "../StyledComponents/ButtonContained";
import DoughnutChart from "../../components/DoughnutChart/DoughnutChart";
import SellerTable from "./SellerTable/SellerTable";
import BuyerTable from "./BuyerTable/BuyerTable";
import InvoiceDataTable from "./InvoiceDataTable/InvoiceDataTable";
import httpRequest from "../../httpRequest";

const SummaryCard = (props) => {
  const classes = useStyles();
  const ocrCtx = useContext(OCRContext);
  const [showText, setShowText] = useState(true);
  const [chartOpen, setChartOpen] = useState(false);
  const [isInvoice, setIsInvoice] = useState(false);
  const [dataChanged, setDataChanged] = useState(false);
  const [initialData, setInitialData] = useState({});
  const [newData, setNewData] = useState({});
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    setIsInvoice(ocrCtx.isInvoice);
  }, []);

  useEffect(() => {
    setInitialData(props.dataFromDB ? props.dataFromDB : ocrCtx.extractedData);
  }, [props.dataFromDB, ocrCtx.extractedData]);

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

  const handleOpenChart = () => {
    setChartOpen(true);
  };

  const handleCloseChart = () => {
    setChartOpen(false);
  };

  const handleDataChange = (updatedData) => {
    setNewData(updatedData);
    if (JSON.stringify(updatedData) !== JSON.stringify(initialData)) {
      setDataChanged(true);
    } else {
      setDataChanged(false);
    }
  };

  const handleSave = async () => {
    try {
      await httpRequest.post("http://localhost:5000/update-invoice", {
        new_data: newData,
      });
      props.dataChanged();
    } catch (error) {
      console.log("error");
      enqueueSnackbar("Error in saving data", { variant: "error" });
    }

    setDataChanged(false);
  };

  return (
    <>
      <div className={classes.rootContainer}>
        {chartOpen ? (
          <DoughnutChart
            handleCloseChart={handleCloseChart}
            invoice_id={props.dataFromDB ? props.dataFromDB.id : ocrCtx.invoiceId}
          />
        ) : (
          <>
            <div className={classes.bar}>
              <div className={classes.save}>
                {dataChanged && (
                  <ButtonContained
                    onClick={handleSave}
                    style={{
                      marginTop: 10,
                    }}
                  >
                    Save
                  </ButtonContained>
                )}
              </div>
              <div className={classes.buttons}>
                {isInvoice && (
                  <IconButton
                    sx={{ padding: { xs: "3px", sm: "10px" } }}
                    onClick={handleOpenChart}
                  >
                    <DonutSmallIcon fontSize="large" sx={{ color: "#6336ab" }} />
                  </IconButton>
                )}
                <IconButton
                  sx={{ padding: { xs: "3px", sm: "10px" } }}
                  onClick={handleDownloadFile}
                >
                  <DownloadIcon fontSize="large" sx={{ color: "#6336ab" }} />
                </IconButton>
                <IconButton
                  sx={{ padding: { xs: "3px", sm: "10px" } }}
                  onClick={handleOpenFile}
                >
                  <OpenInNewIcon fontSize="large" sx={{ color: "#6336ab" }} />
                </IconButton>
              </div>
            </div>
            <Grid container>
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
              {props.dataFromDB || isInvoice ? (
                <Grid item xs={6}>
                  <div className={classes.tables}>
                    <div className={classes.table}>
                      <InvoiceDataTable
                        data={props.dataFromDB ? props.dataFromDB : ocrCtx.extractedData}
                        onDataChange={handleDataChange}
                      />
                    </div>
                    <div className={classes.tableContainer}>
                      <SellerTable
                        data={props.dataFromDB ? props.dataFromDB : ocrCtx.extractedData}
                        onDataChange={handleDataChange}
                      />
                      <BuyerTable
                        data={props.dataFromDB ? props.dataFromDB : ocrCtx.extractedData}
                        onDataChange={handleDataChange}
                      />
                    </div>
                  </div>
                </Grid>
              ) : (
                <Grid item xs={5}>
                  <Paper
                    elevation={3}
                    sx={{ mt: 15, p: 10, borderRadius: 5, height: 200 }}
                  >
                    <h4 style={{ textAlign: "center", marginTop: "-15px" }}>
                      The recognized document is probably not an invoice!
                    </h4>
                  </Paper>
                </Grid>
              )}
            </Grid>
          </>
        )}
      </div>
    </>
  );
};

export default SummaryCard;
