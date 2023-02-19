import { useEffect, useState } from "react";

import httpRequest from "../../httpRequest";
import AppLayout from "../../components/AppLayout/AppLayout";
import InvoiceCard from "../../components/InvoiceCard/InvoiceCard";
import { Grid } from "@mui/material";
import { useStyles } from "./styles";

const HistoryPage = () => {
  const classes = useStyles();
  const [invoicesNumber, setInvoicesNumber] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const resp = await httpRequest.get(
          "http://localhost:5000/get-invoices"
        );
        setInvoicesNumber(resp.data.invoice_numbers);
      } catch (error) {
        console.log("Error");
      }
    })();
  }, []);

  return (
    <AppLayout>
      <Grid container sx={{ m: 0, mt: 5 }}>
        {invoicesNumber &&
          invoicesNumber.map((invoiceNumber) => (
            <Grid key={invoiceNumber} item md={2}>
              <InvoiceCard data={invoiceNumber} />
            </Grid>
          ))}
      </Grid>
    </AppLayout>
  );
};

export default HistoryPage;
