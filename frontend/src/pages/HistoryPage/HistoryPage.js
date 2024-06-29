import { useEffect, useState } from "react";

import { useSnackbar } from "notistack";
import { Grid } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import IconButton from "@mui/material/IconButton";
import { useStyles } from "./styles";
import SummaryCard from "../../components/SummaryCard/SummaryCard";
import InvoiceTable from "../../components/InvoiceTable/InvoiceTable";
import httpRequest from "../../httpRequest";
import AppLayout from "../../components/AppLayout/AppLayout";

const HistoryPage = () => {
  const classes = useStyles();
  const [selectedInvoice, setSelectedInvoice] = useState({});
  const [invoicesData, setInvoicesData] = useState([]);
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    (async () => {
      await fetchInvoiceData();
    })();
    //eslint-disable-next-line
  }, []);

  const fetchInvoiceData = async () => {
    try {
      const resp = await httpRequest.get(`${process.env.REACT_APP_BACKEND_URL}/get-invoices`);
      setInvoicesData(resp.data.invoices);
    } catch (error) {
      console.log("Error");
      enqueueSnackbar("Error fetching invoices", { variant: "error" });
    }
  };

  const openSummary = (invoiceData) => {
    setIsSummaryOpen(true);
    setSelectedInvoice(invoiceData);
  };

  const handleDataChange = () => {
    fetchInvoiceData();
  };

  return (
    <AppLayout>
      <Grid container>
        {!isSummaryOpen && (
          <div className={classes.table}>
            <InvoiceTable
              invoiceData={invoicesData}
              openSummary={openSummary}
              refreshInvoiceData={fetchInvoiceData}
            />
          </div>
        )}
      </Grid>
      {isSummaryOpen && (
        <div>
          <IconButton onClick={() => setIsSummaryOpen(false)}>
            <ArrowBackIcon fontSize="large" sx={{ color: "black", mb: "-30px" }} />
          </IconButton>
          <SummaryCard dataFromDB={selectedInvoice} dataChanged={handleDataChange} />
        </div>
      )}
    </AppLayout>
  );
};

export default HistoryPage;
