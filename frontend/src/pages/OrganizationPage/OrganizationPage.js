import { useContext, useState, useEffect } from "react";

import { useSnackbar } from "notistack";
import { Grid } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import IconButton from "@mui/material/IconButton";

import AppLayout from "../../components/AppLayout/AppLayout";
import { useStyles } from "./styles";
import OrganizationCard from "../../components/OrganizationCard/OrganizationCard";
import CreateOrganizationCard from "../../components/CreateOrganizationCard/CreateOrganizationCard";
import userContext from "../../context/user-context";
import OrganizationTabbar from "../../components/OrganizationTabbar/OrganizationTabbar";
import httpRequest from "../../httpRequest";
import Card from "../../components/Card/Card";
import Organization from "../../components/Organization/Organization";

const OrganizationPage = () => {
  const classes = useStyles();
  const userCtx = useContext(userContext);
  const role = userCtx.role;
  const [activePage, setActivePage] = useState(0);
  const [activePageName, setActivePageName] = useState("ORGANIZATIONS");
  const [organizationsData, setOrganizationsData] = useState([]);
  const [isOrganizationOpen, setIsOrganizationOpen] = useState(false);
  const [selectedOrganization, setSelectedOrganization] = useState({});
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    (async () => {
      try {
        const resp = await httpRequest.get(`${process.env.REACT_APP_BACKEND_URL}/@me`);
        userCtx.setUserName(resp.data.name);
        userCtx.setEmail(resp.data.email);
        userCtx.setRole(resp.data.role);
      } catch (error) {
        console.log("Not authenticated");
        enqueueSnackbar("Not authenticated", { variant: "error" });
        window.location.href = "/login";
      }
    })();
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const resp = await httpRequest.get(`${process.env.REACT_APP_BACKEND_URL}/get-organizations`);
        setOrganizationsData(resp.data.organizations);
        userCtx.setActiveOrganization(resp.data.active_organization);
      } catch (error) {
        console.log("Error");
        enqueueSnackbar("Error", { variant: "error" });
      }
    })();
  }, [activePage, enqueueSnackbar, userCtx]);

  const handlePageChange = (page, name) => {
    setActivePage(page);
    setActivePageName(name);
    setIsOrganizationOpen(false);
  };

  const openOrganization = (organizationData) => {
    setIsOrganizationOpen(true);
    setSelectedOrganization(organizationData);
  };

  return (
    <>
      <AppLayout>
        <OrganizationTabbar onPageChange={handlePageChange} activePage={activePage} />
        {!isOrganizationOpen && (
          <div>
            <Grid container spacing={2}>
              {activePageName === "ORGANIZATIONS" &&
                organizationsData &&
                organizationsData.map((organizationData) => (
                  <Grid key={organizationData.id} item md={2}>
                    <div onClick={() => openOrganization(organizationData)}>
                      <Card data={organizationData.name} />
                    </div>
                  </Grid>
                ))}
            </Grid>
            <div className={classes.cards}>
              {activePageName === "JOIN" && (
                <OrganizationCard onPageChange={handlePageChange} />
              )}
              {role !== "user" && activePageName === "CREATE" && (
                <CreateOrganizationCard onPageChange={handlePageChange} />
              )}
            </div>
          </div>
        )}
        {isOrganizationOpen && (
          <div>
            <IconButton onClick={() => setIsOrganizationOpen(false)}>
              <ArrowBackIcon fontSize="large" sx={{ color: "black", mb: '-20px' }}  />
            </IconButton>
            <Organization dataFromDB={selectedOrganization} />
          </div>
        )}
      </AppLayout>
    </>
  );
};

export default OrganizationPage;
