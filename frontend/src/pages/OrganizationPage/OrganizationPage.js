import { useContext } from "react";
import httpRequest from "../../httpRequest";
import AppLayout from "../../components/AppLayout/AppLayout";
import { useStyles } from "./styles";
import OrganizationCard from "../../components/OrganizationCard/OrganizationCard";
import CreateOrganizationCard from "../../components/CreateOrganizationCard/CreateOrganizationCard";
import userContext from "../../context/user-context";

const OrganizationPage = () => {
  const classes = useStyles();
  const userCtx = useContext(userContext);
  const role = userCtx.role;

  return (
    <>
      <AppLayout>
        <div className={classes.root}>
          <OrganizationCard />
          {role == "admin" && <CreateOrganizationCard />}
        </div>
      </AppLayout>
    </>
  );
};

export default OrganizationPage;
