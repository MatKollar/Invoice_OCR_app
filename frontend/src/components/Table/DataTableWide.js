import React from "react";
import { Paper, TextField, Grid } from "@mui/material";

const DataTableWide = () => {
  return (
    <Paper elevation={3} sx={{ p: 2, borderRadius: 5 }}>
      <Grid container spacing={1}>
        <Grid item xs={6}>
          <TextField label="Invoice number" variant="standard" fullWidth />
        </Grid>
        <Grid item xs={6}>
          <TextField label="Variable symbol" variant="standard" fullWidth />
        </Grid>
        <Grid item xs={6}>
          <TextField label="Date of issue" variant="standard" fullWidth />
        </Grid>
        <Grid item xs={6}>
          <TextField label="Due date" variant="standard" fullWidth />
        </Grid>
        <Grid item xs={6}>
          <TextField label="Delivery date" variant="standard" fullWidth />
        </Grid>
        <Grid item xs={6}>
          <TextField label="Bank" variant="standard" fullWidth />
        </Grid>
        <Grid item xs={6}>
          <TextField label="IBAN" variant="standard" fullWidth />
        </Grid>
        <Grid item xs={6}>
          <TextField label="SWIFT" variant="standard" fullWidth />
        </Grid>
        <Grid item xs={6}>
          <TextField label="Payment method" variant="standard" fullWidth />
        </Grid>
        <Grid item xs={6}>
          <TextField label="Total amount" variant="standard" fullWidth />
        </Grid>
      </Grid>
    </Paper>
  );
};

export default DataTableWide;
