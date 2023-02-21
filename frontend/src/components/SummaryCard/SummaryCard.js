import { useContext, useState } from "react";
import OCRContext from "../../context/ocr-context";
import { TextField, Button, Paper } from "@mui/material";
import { useStyles } from "./styles";
import SellerTable from "./SellerTable/SellerTable";
import BuyerTable from "./BuyerTable/BuyerTable";
import InvoiceTable from "./InvoiceTable/InvoiceTable";

const SummaryCard = (props) => {
  const classes = useStyles();
  const ocrCtx = useContext(OCRContext);
  const [showText, setShowText] = useState(true);

  return (
    <>
      <div className={classes.rootContainer}>
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
                defaultValue={ocrCtx.textResult}
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

        <div className={classes.tables}>
          <InvoiceTable
            data={props.dataFromDB ? props.dataFromDB : ocrCtx.extractedData}
          />
          <div className={classes.tableContainer}>
            <SellerTable
              data={props.dataFromDB ? props.dataFromDB : ocrCtx.extractedData}
            />
            <BuyerTable
              data={props.dataFromDB ? props.dataFromDB : ocrCtx.extractedData}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default SummaryCard;
