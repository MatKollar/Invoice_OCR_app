import { useState, useContext, useEffect } from "react";

import { Grid, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import IconButton from "@mui/material/IconButton";
import { useSnackbar } from "notistack";

import { useStyles } from "./styles";
import httpRequest from "../../httpRequest";
import userContext from "../../context/user-context";
import InvoiceTable from "../InvoiceTable/InvoiceTable";
import SummaryCard from "../SummaryCard/SummaryCard";
import ButtonContained from "../StyledComponents/ButtonContained";
import ButtonOutlined from "../StyledComponents/ButtonOutlined";

const Organization = (props) => {
  const classes = useStyles();
  const orgData = props.dataFromDB;
  const [activeOrganization, setActiveOrganization] = useState(false);
  const [invoices, setInvoices] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState({});
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);
  const userCtx = useContext(userContext);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    (async () => {
      await fetchInvoiceData();
    })();
    //eslint-disable-next-line
  }, []);

  const fetchInvoiceData = async () => {
    try {
      const resp = await httpRequest.post(
        `${process.env.REACT_APP_BACKEND_URL}/get-organization-invoices`,
        {
          organization_id: orgData.id,
        }
      );
      setInvoices(resp.data.invoices);
    } catch (error) {
      console.log("Error");
      enqueueSnackbar("Error fetching invoices", { variant: "error" });
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
  }, [userCtx.activeOrganization, orgData.id]);

  const setOrganizationAsActive = async () => {
    setActiveOrganization(true);
    userCtx.setActiveOrganization(orgData);
    try {
      await httpRequest.post(
        `${process.env.REACT_APP_BACKEND_URL}/activate-organization`,
        {
          organization_id: orgData.id,
        }
      );
      enqueueSnackbar("Organization activated successfully", {
        variant: "success",
      });
    } catch (error) {
      if (error.response && error.response.status === 401) {
        enqueueSnackbar("Invalid credentials", { variant: "error" });
      }
    }
  };

  const deactiveOrganization = async () => {
    setActiveOrganization(false);
    userCtx.setActiveOrganization(null);
    try {
      await httpRequest.post(
        `${process.env.REACT_APP_BACKEND_URL}/deactivate-organization`,
        {
          organization_id: orgData.id,
        }
      );
      enqueueSnackbar("Organization deactivated successfully", {
        variant: "success",
      });
    } catch (error) {
      if (error.response && error.response.status === 401) {
        enqueueSnackbar("Invalid credentials", { variant: "error" });
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
      <Typography variant="h2">
        {orgData.name}
      </Typography>
      <Typography variant="h5">
        INVITE CODE: {orgData.invite_code}
      </Typography>

      <div className={classes.activeButton}>
        {activeOrganization && (
          <ButtonOutlined onClick={deactiveOrganization}>
            Organization Active
          </ButtonOutlined>
        )}

        {!activeOrganization && (
          <ButtonContained onClick={setOrganizationAsActive}>
            Set as active
          </ButtonContained>
        )}
      </div>
      <Grid container sx={{ mt: 1 }}>
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
            <ArrowBackIcon fontSize="large" sx={{ color: "black" }} />
          </IconButton>
          <SummaryCard
            dataFromDB={selectedInvoice}
            dataChanged={handleDataChange}
          />
        </div>
      )}
    </div>
  );
};

export default Organization;
