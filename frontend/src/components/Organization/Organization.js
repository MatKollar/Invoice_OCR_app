import { useState, useContext, useEffect } from "react";

import { Button, Grid } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import IconButton from "@mui/material/IconButton";

import { useStyles } from "./styles";
import httpRequest from "../../httpRequest";
import userContext from "../../context/user-context";
import InvoiceTable from "../InvoiceTable/InvoiceTable";
import SummaryCard from "../SummaryCard/SummaryCard";

const Organization = (props) => {
  const classes = useStyles();
  const orgData = props.dataFromDB;
  const [activeOrganization, setActiveOrganization] = useState(false);
  const [invoices, setInvoices] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState({});
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);
  const userCtx = useContext(userContext);

  useEffect(() => {
    (async () => {
      await fetchInvoiceData();
    })();
  }, []);

  const fetchInvoiceData = async () => {
    try {
      const resp = await httpRequest.post(
        "http://localhost:5000/get-organization-invoices",
        {
          organization_id: orgData.id,
        },
      );
      setInvoices(resp.data.invoices);
    } catch (error) {
      console.log("Error");
    }
  };

  useEffect(() => {
    if (userCtx.activeOrganization) {
      if (userCtx.activeOrganization.id === orgData.id) {
        setActiveOrganization(true);
      } else {
        setActiveOrganization(false);
      }
    }
  }, [userCtx.activeOrganization]);

  const setOrganizationAsActive = async () => {
    setActiveOrganization(true);
    userCtx.setActiveOrganization(orgData);
    try {
      await httpRequest.post("http://localhost:5000/activate-organization", {
        organization_id: orgData.id,
      });
    } catch (error) {
      if (error.response.status === 401) {
        alert("Invalid credentials");
      }
    }
  };

  const deactiveOrganization = async () => {
    setActiveOrganization(false);
    userCtx.setActiveOrganization(null);
    try {
      await httpRequest.post("http://localhost:5000/deactivate-organization", {
        organization_id: orgData.id,
      });
    } catch (error) {
      if (error.response.status === 401) {
        alert("Invalid credentials");
      }
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
    <div className={classes.rootContainer}>
      {activeOrganization && (
        <Button sx={{ position: "absolute", right: 20 }} onClick={deactiveOrganization}>
          Organization Active
        </Button>
      )}

      {!activeOrganization && (
        <Button
          variant="contained"
          sx={{ position: "absolute", right: 20 }}
          onClick={setOrganizationAsActive}
        >
          Set as active
        </Button>
      )}

      <h1>{orgData.name}</h1>
      <h3>INVITE CODE: {orgData.invite_code}</h3>
      <Grid container sx={{ m: 0, mt: 5 }}>
        {!isSummaryOpen && (
          <div className={classes.table}>
            <InvoiceTable
              invoiceData={invoices}
              openSummary={openSummary}
              refreshInvoiceData={fetchInvoiceData}
            />
          </div>
        )}
      </Grid>
      {isSummaryOpen && (
        <div>
          <IconButton onClick={() => setIsSummaryOpen(false)}>
            <ArrowBackIcon />
          </IconButton>
          <SummaryCard dataFromDB={selectedInvoice} dataChanged={handleDataChange} />
        </div>
      )}
    </div>
  );
};

export default Organization;
