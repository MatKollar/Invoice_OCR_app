import React from "react";
import { useContext } from "react";
import { Paper, TextField, Grid } from "@mui/material";
import OCRContext from "../../context/ocr-context";

const DataTableWide = () => {
  const ocrCtx = useContext(OCRContext);
  const invoiceData = ocrCtx.extractedData;

  return (
    <Paper elevation={3} sx={{ p: 2, borderRadius: 5 }}>
      <Grid container spacing={1}>
        <Grid item xs={6}>
          <TextField
            label="Invoice number"
            defaultValue={invoiceData?.invoice_number || ""}
            variant="standard"
            fullWidth
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Bank"
            defaultValue={invoiceData?.bank || ""}
            variant="standard"
            fullWidth
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Variable symbol"
            defaultValue={invoiceData?.var_symbol || ""}
            variant="standard"
            fullWidth
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="IBAN"
            defaultValue={invoiceData?.iban || ""}
            variant="standard"
            fullWidth
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Date of issue"
            defaultValue={invoiceData?.date_of_issue || ""}
            variant="standard"
            fullWidth
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="SWIFT"
            defaultValue={invoiceData?.swift || ""}
            variant="standard"
            fullWidth
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Due date"
            defaultValue={invoiceData?.due_date || ""}
            variant="standard"
            fullWidth
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Payment method"
            defaultValue={invoiceData?.payment_method || ""}
            variant="standard"
            fullWidth
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Delivery date"
            defaultValue={invoiceData?.delivery_date || ""}
            variant="standard"
            fullWidth
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Total amount"
            defaultValue={invoiceData?.total_price + " €" || ""}
            variant="standard"
            fullWidth
          />
        </Grid>
      </Grid>
    </Paper>
  );
};

export default DataTableWide;
