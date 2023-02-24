import { useContext, useState, useEffect } from "react";
import { Grid } from "@mui/material";
import AppLayout from "../../components/AppLayout/AppLayout";
import { useStyles } from "./styles";
import OrganizationCard from "../../components/OrganizationCard/OrganizationCard";
import CreateOrganizationCard from "../../components/CreateOrganizationCard/CreateOrganizationCard";
import userContext from "../../context/user-context";
import OrganizationTabbar from "./OrganizationTabbar/OrganizationTabbar";
import httpRequest from "../../httpRequest";
import InvoiceCard from "../../components/InvoiceCard/InvoiceCard";

const OrganizationPage = () => {
  const classes = useStyles();
  const userCtx = useContext(userContext);
  const role = userCtx.role;
  const [activePage, setActivePage] = useState("");
  const [organizationsData, setOrganizationsData] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const resp = await httpRequest.get(
          "http://localhost:5000/get-organizations"
        );
        console.log(resp.data.organizations);
        setOrganizationsData(resp.data.organizations);
      } catch (error) {
        console.log("Error");
      }
    })();
  }, []);

  const handlePageChange = (page) => {
    setActivePage(page);
  };

  return (
    <>
      <AppLayout>
        <OrganizationTabbar
          onPageChange={handlePageChange}
          activePage={activePage}
        />
        <Grid container spacing={2}>
          {activePage == "ORGANIZATIONS" &&
            organizationsData &&
            organizationsData.map((organizationsData) => (
              <Grid key={organizationsData.id} item md={2}>
                <div>
                  <InvoiceCard data={organizationsData.name} />
                </div>
              </Grid>
            ))}
        </Grid>
        <div className={classes.cards}>
          {activePage == "JOIN" && <OrganizationCard />}
          {role == "admin" && activePage == "CREATE" && (
            <CreateOrganizationCard onPageChange={handlePageChange} />
          )}
        </div>
      </AppLayout>
    </>
  );
};

export default OrganizationPage;
