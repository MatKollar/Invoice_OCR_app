import { useEffect, useState } from "react";

import httpRequest from "../../httpRequest";
import AppLayout from "../../components/AppLayout/AppLayout";
import Card from "../../components/Card/Card";
import { Grid } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import IconButton from "@mui/material/IconButton";
import { useStyles } from "./styles";
import SummaryCard from "../../components/SummaryCard/SummaryCard";
import InvoiceTable from "../../components/InvoiceTable/InvoiceTable";

const HistoryPage = () => {
  const classes = useStyles();
  const [selectedInvoice, setSelectedInvoice] = useState({});
  const [invoicesData, setInvoicesData] = useState([]);
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const resp = await httpRequest.get(
          "http://localhost:5000/get-invoices"
        );
        setInvoicesData(resp.data.invoices);
      } catch (error) {
        console.log("Error");
      }
    })();
  }, []);

  const openSummary = (invoiceData) => {
    setIsSummaryOpen(true);
    setSelectedInvoice(invoiceData);
  };

  return (
    <AppLayout>
      <Grid container>
        {!isSummaryOpen && (
          <div className={classes.table}>
            <InvoiceTable
              invoiceData={invoicesData}
              openSummary={openSummary}
            />
          </div>
        )}
      </Grid>
      {isSummaryOpen && (
        <div>
          <IconButton onClick={() => setIsSummaryOpen(false)}>
            <ArrowBackIcon />
          </IconButton>
          <SummaryCard dataFromDB={selectedInvoice} />
        </div>
      )}
    </AppLayout>
  );
};

export default HistoryPage;
