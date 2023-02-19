import React from "react";
import { Paper, TextField, Grid } from "@mui/material";

const DataTableWide = (props) => {
  console.log(props.invoiceData)
  return (
    <Paper elevation={3} sx={{ p: 2, borderRadius: 5 }}>
      <Grid container spacing={1}>
        <Grid item xs={6}>
          <TextField
            label="Invoice number"
            defaultValue={props.invoiceData?.invoice_number || ""}
            variant="standard"
            fullWidth
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Bank"
            defaultValue={props.invoiceData?.bank || ""}
            variant="standard"
            fullWidth
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Variable symbol"
            defaultValue={props.invoiceData?.var_symbol || ""}
            variant="standard"
            fullWidth
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="IBAN"
            defaultValue={props.invoiceData?.iban || ""}
            variant="standard"
            fullWidth
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Date of issue"
            defaultValue={props.invoiceData?.date_of_issue || ""}
            variant="standard"
            fullWidth
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="SWIFT"
            defaultValue={props.invoiceData?.swift || ""}
            variant="standard"
            fullWidth
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Due date"
            defaultValue={props.invoiceData?.due_date || ""}
            variant="standard"
            fullWidth
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Payment method"
            defaultValue={props.invoiceData?.payment_method || ""}
            variant="standard"
            fullWidth
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Delivery date"
            defaultValue={props.invoiceData?.delivery_date || ""}
            variant="standard"
            fullWidth
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Total amount"
            defaultValue={props.invoiceData?.total_price + " €" || ""}
            variant="standard"
            fullWidth
          />
        </Grid>
      </Grid>
    </Paper>
  );
};

export default DataTableWide;
