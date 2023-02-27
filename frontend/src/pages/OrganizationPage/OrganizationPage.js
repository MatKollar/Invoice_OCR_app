import { useContext, useState, useEffect } from "react";
import { Grid } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import IconButton from "@mui/material/IconButton";
import AppLayout from "../../components/AppLayout/AppLayout";
import { useStyles } from "./styles";
import OrganizationCard from "../../components/OrganizationCard/OrganizationCard";
import CreateOrganizationCard from "../../components/CreateOrganizationCard/CreateOrganizationCard";
import userContext from "../../context/user-context";
import OrganizationTabbar from "./OrganizationTabbar/OrganizationTabbar";
import httpRequest from "../../httpRequest";
import InvoiceCard from "../../components/InvoiceCard/InvoiceCard";
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

  useEffect(() => {
    (async () => {
      try {
        const resp = await httpRequest.get("http://localhost:5000/@me");
        userCtx.setUserName(resp.data.name);
        userCtx.setEmail(resp.data.email);
        userCtx.setRole(resp.data.role);
      } catch (error) {
        console.log("Not authenticated");
        window.location.href = "/login";
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const resp = await httpRequest.get(
          "http://localhost:5000/get-organizations"
        );
        setOrganizationsData(resp.data.organizations);
      } catch (error) {
        console.log("Error");
      }
    })();
  }, []);

  const handlePageChange = (page, name) => {
    setActivePage(page);
    setActivePageName(name);
  };

  const openOrganization = (organizationData) => {
    setIsOrganizationOpen(true);
    setSelectedOrganization(organizationData);
  };

  return (
    <>
      <AppLayout>
        <OrganizationTabbar
          onPageChange={handlePageChange}
          activePage={activePage}
        />
        {!isOrganizationOpen && (
          <div>
            <Grid container spacing={2}>
              {activePageName == "ORGANIZATIONS" &&
                organizationsData &&
                organizationsData.map((organizationData) => (
                  <Grid key={organizationData.id} item md={2}>
                    <div onClick={() => openOrganization(organizationData)}>
                      <InvoiceCard data={organizationData.name} />
                    </div>
                  </Grid>
                ))}
            </Grid>
            <div className={classes.cards}>
              {activePageName == "JOIN" && (
                <OrganizationCard onPageChange={handlePageChange} />
              )}
              {role == "admin" && activePageName == "CREATE" && (
                <CreateOrganizationCard onPageChange={handlePageChange} />
              )}
            </div>{" "}
          </div>
        )}
        {isOrganizationOpen && (
          <div>
            <IconButton onClick={() => setIsOrganizationOpen(false)}>
              <ArrowBackIcon />
            </IconButton>
            <Organization dataFromDB={selectedOrganization}/>
          </div>
        )}
      </AppLayout>
    </>
  );
};

export default OrganizationPage;
