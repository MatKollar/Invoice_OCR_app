import { useState, useEffect, useMemo } from "react";
import { Paper, TextField, Grid } from "@mui/material";
import { useStyles } from "./styles";

const InvoiceTable = (props) => {
  const classes = useStyles();
  const invoiceData = useMemo(() => props.data || {}, [props.data]);
  const [localData, setLocalData] = useState(invoiceData);

  useEffect(() => {
    setLocalData(invoiceData);
  }, [invoiceData]);

  const handleChange = (event, field) => {
    const newData = { ...localData, [field]: event.target.value };
    setLocalData(newData);
    props.onDataChange(newData);
  };

  const renderTextField = (field, label, index) => (
    <Grid item xs={6} key={index}>
      <TextField
        label={label}
        value={localData[field] || ""}
        onChange={(event) => handleChange(event, field)}
        variant="standard"
        className={classes.focused}
        fullWidth
        inputProps={{ style: { fontWeight: "bold" } }}
      />
    </Grid>
  );

  const fields = [
    { field: "invoice_number", label: "Invoice number" },
    { field: "bank", label: "Bank" },
    { field: "var_symbol", label: "Variable symbol" },
    { field: "iban", label: "IBAN" },
    { field: "date_of_issue", label: "Date of issue" },
    { field: "swift", label: "SWIFT" },
    { field: "due_date", label: "Due date" },
    { field: "payment_method", label: "Payment method" },
    { field: "delivery_date", label: "Delivery date" },
    {
      field: "total_price",
      label: "Total amount",
      value: localData && localData["total_price"] ? localData["total_price"] + " €" : "",
    },
  ];

  return (
    <div className={classes.table}>
      <Paper elevation={3} sx={{ p: 2, borderRadius: 5 }}>
        <Grid container spacing={1}>
          {fields.map((field, index) => renderTextField(field.field, field.label, index))}
        </Grid>
      </Paper>
    </div>
  );
};

export default InvoiceTable;
