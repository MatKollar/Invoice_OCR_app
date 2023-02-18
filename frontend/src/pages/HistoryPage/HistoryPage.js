import { useEffect, useState } from "react";

import httpRequest from "../../httpRequest";
import AppLayout from "../../components/AppLayout/AppLayout";
import InvoiceCard from "../../components/InvoiceCard/InvoiceCard";
import { Grid } from "@mui/material";
import { useStyles } from "./styles";

const HistoryPage = () => {
  const classes = useStyles();
  const [invoices, setInvoices] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const resp = await httpRequest.get(
          "http://localhost:5000/get-invoices"
        );
        console.log(resp.data.text);
        setInvoices(resp.data.text);
      } catch (error) {
        console.log("Error");
      }
    })();
  }, []);

  return (
    <>
      <AppLayout>
        <Grid container sx={{ m: 0 }}>
          <Grid item md={2}>
            {invoices && <InvoiceCard data={invoices} />}
          </Grid>
        </Grid>
      </AppLayout>
    </>
  );
};

export default HistoryPage;
