import { useContext, useEffect, useState, useRef } from "react";
import { useSnackbar } from "notistack";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import DownloadIcon from "@mui/icons-material/Download";
import DonutSmallIcon from "@mui/icons-material/DonutSmall";
import { TextField, Paper, IconButton, Grid } from "@mui/material";
import OCRContext from "../../context/ocr-context";
import { useStyles } from "./styles";
import ButtonContained from "../StyledComponents/ButtonContained";
import DoughnutChart from "../../components/DoughnutChart/DoughnutChart";
import SellerTable from "./SellerTable/SellerTable";
import BuyerTable from "./BuyerTable/BuyerTable";
import InvoiceDataTable from "./InvoiceDataTable/InvoiceDataTable";
import httpRequest from "../../httpRequest";
import { COLORS } from "../../styles/constants";
const cv = window.cv;

const SummaryCard = (props) => {
  const classes = useStyles();
  const ocrCtx = useContext(OCRContext);
  const [showText, setShowText] = useState(true);
  const [chartOpen, setChartOpen] = useState(false);
  const [isInvoice, setIsInvoice] = useState(false);
  const [dataChanged, setDataChanged] = useState(false);
  const [initialData, setInitialData] = useState({});
  const [base64Image, setBase64Image] = useState("");
  const [newData, setNewData] = useState({});
  const { enqueueSnackbar } = useSnackbar();
  const PDFJS = require("pdfjs-dist/webpack");
  const canvasRef = useRef(null);

  useEffect(() => {
    setIsInvoice(ocrCtx.isInvoice);
    //eslint-disable-next-line
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

  useEffect(() => {
    if (ocrCtx.actualImage) {
      const reader = new FileReader();
      reader.onloadend = function () {
        setBase64Image(reader.result.split(",")[1]);
      };
      reader.readAsDataURL(ocrCtx.actualImage);
    }
  }, [props, ocrCtx, showText]);

  const drawInvoiceOnCanvas = async () => {
    const canvas = canvasRef.current;
    if (!canvas) {
      console.error("Canvas element not found");
      return;
    }
    const context = canvas.getContext("2d");

    context.clearRect(0, 0, canvas.width, canvas.height);

    if (pdfBase64) {
      const pdfData = atob(pdfBase64);
      let uint8Array = new Uint8Array(pdfData.length);
      for (let i = 0; i < pdfData.length; i++) {
        uint8Array[i] = pdfData.charCodeAt(i);
      }
      const loadingTask = PDFJS.getDocument({ data: uint8Array });
      const pdf = await loadingTask.promise;
      const page = await pdf.getPage(1);
      const viewport = page.getViewport({ scale: 1.5 });
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      const renderContext = {
        canvasContext: context,
        viewport: viewport,
      };
      await page.render(renderContext).promise;
    } else if (imageBase64 || base64Image) {
      loadImage(imageBase64 ? imageBase64 : base64Image);
    }
  };

  const loadImage = (base64) => {
    const img = new Image();
    img.src = `data:image/jpeg;base64,${base64}`;
    img.onload = () => {
      const mat = cv.imread(img);
      cv.imshow(canvasRef.current, mat);
      mat.delete();
    };
  };

  const handleOpenFile = () => {
    if (Object.keys(props).length === 0) {
      openFile(ocrCtx.file);
    }

    if (pdfBase64) {
      openFile(convertBase64ToBlob(pdfBase64, "application/pdf"));
    } else if (imageBase64) {
      openFile(convertBase64ToBlob(imageBase64, "image/png"));
    }
  };

  const handleDownloadFile = async () => {
    if (Object.keys(props).length === 0) {
      downloadFile(ocrCtx.file, "file." + ocrCtx.file.type.split("/")[1]);
    }

    if (pdfBase64) {
      downloadFile(
        convertBase64ToBlob(pdfBase64, "application/pdf"),
        "file.pdf"
      );
    } else if (imageBase64) {
      downloadFile(convertBase64ToBlob(imageBase64, "image/png"), "file.png");
    }
  };

  const convertBase64ToBlob = (base64, type) => {
    const byteCharacters = atob(base64);
    const byteNumbers = Array.from(byteCharacters, (char) =>
      char.charCodeAt(0)
    );
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type });
  };

  const downloadFile = (file, fileName) => {
    const url = URL.createObjectURL(file);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.click();
    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 100);
  };

  const openFile = (file) => {
    const url = URL.createObjectURL(file);
    window.open(url, "_blank");
    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 100);
  };

  const handleOpenChart = () => {
    setChartOpen(true);
  };

  const handleCloseChart = () => {
    setChartOpen(false);
  };

  const handleDataChange = (updatedData, type) => {
    let mergedData;
    if (type === "invoice_data") {
      mergedData = { ...newData, ...updatedData };
    } else {
      mergedData = { ...newData, [type]: updatedData };
    }

    const combinedData = { ...initialData, ...mergedData };
    setNewData(combinedData);

    if (JSON.stringify(combinedData) !== JSON.stringify(initialData)) {
      setDataChanged(true);
    } else {
      setDataChanged(false);
    }
  };

  useEffect(() => {
    if (!chartOpen && !showText) {
      drawInvoiceOnCanvas();
    }
    //eslint-disable-next-line
  }, [chartOpen, showText]);

  const handleShowText = () => {
    setShowText(!showText);
  };

  const handleSave = async () => {
    try {
      await httpRequest.post(
        `${process.env.REACT_APP_BACKEND_URL}/update-invoice`,
        {
          new_data: newData,
        }
      );
      if (props && Object.keys(props).length > 0) {
        props.dataChanged();
      }
      enqueueSnackbar("Data saved successfully", { variant: "success" });
    } catch (error) {
      console.error("Error in saving data:", error);
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
            invoice_id={
              props.dataFromDB ? props.dataFromDB.id : ocrCtx.invoiceId
            }
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
                    <DonutSmallIcon
                      fontSize="large"
                      sx={{ color: COLORS.PRIMARY_HOVER }}
                    />
                  </IconButton>
                )}
                <IconButton
                  sx={{ padding: { xs: "3px", sm: "10px" } }}
                  onClick={handleDownloadFile}
                >
                  <DownloadIcon fontSize="large" sx={{ color: COLORS.PRIMARY_HOVER }} />
                </IconButton>
                <IconButton
                  sx={{ padding: { xs: "3px", sm: "10px" } }}
                  onClick={handleOpenFile}
                >
                  <OpenInNewIcon fontSize="large" sx={{ color: COLORS.PRIMARY_HOVER }} />
                </IconButton>
              </div>
            </div>
            <Grid container>
              <Grid item xs={6}>
                <div className={classes.textContainer}>
                  {showText ? (
                    <Paper elevation={3} sx={{ p: 2, borderRadius: 5 }}>
                      <TextField
                        id="outlined-multiline-static"
                        sx={{ backgroundColor: "white", borderRadius: "20px" }}
                        label="Text from OCR"
                        multiline
                        fullWidth
                        rows={20}
                        variant={"standard"}
                        className={classes.focused}
                        defaultValue={
                          props.dataFromDB
                            ? props.dataFromDB.text
                            : ocrCtx.textResult
                        }
                      />
                    </Paper>
                  ) : (
                    <div className={classes.invoiceContainer}>
                      <canvas
                        className={classes.invoice}
                        id="invoice"
                        ref={canvasRef}
                      />
                    </div>
                  )}

                  <ButtonContained
                    variant="contained"
                    onClick={handleShowText}
                    style={{ margin: "12px", padding: "7px 22px" }}
                  >
                    {showText ? "SHOW INVOICE" : "SHOW TEXT"}
                  </ButtonContained>
                </div>
              </Grid>
              {props.dataFromDB || isInvoice ? (
                <Grid item xs={6}>
                  <div className={classes.tables}>
                    <div className={classes.table}>
                      <InvoiceDataTable
                        data={
                          props.dataFromDB
                            ? props.dataFromDB
                            : ocrCtx.extractedData
                        }
                        onDataChange={(data) =>
                          handleDataChange(data, "invoice_data")
                        }
                      />
                    </div>
                    <div className={classes.tableContainer}>
                      <SellerTable
                        data={
                          props.dataFromDB
                            ? props.dataFromDB
                            : ocrCtx.extractedData
                        }
                        onDataChange={(data) =>
                          handleDataChange(data, "supplier_data")
                        }
                      />
                      <BuyerTable
                        data={
                          props.dataFromDB
                            ? props.dataFromDB
                            : ocrCtx.extractedData
                        }
                        onDataChange={(data) =>
                          handleDataChange(data, "buyer_data")
                        }
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
