import { useContext, useState } from "react";
import AppLayout from "../../components/AppLayout/AppLayout";
import { useStyles } from "./styles";
import OrganizationCard from "../../components/OrganizationCard/OrganizationCard";
import CreateOrganizationCard from "../../components/CreateOrganizationCard/CreateOrganizationCard";
import userContext from "../../context/user-context";
import OrganizationTabbar from "./OrganizationTabbar/OrganizationTabbar";

const OrganizationPage = () => {
  const classes = useStyles();
  const userCtx = useContext(userContext);
  const role = userCtx.role;

  const [activePage, setActivePage] = useState(0);

  const handlePageChange = (page) => {
    setActivePage(page);
  };

  return (
    <>
      <AppLayout>
        <OrganizationTabbar onPageChange={handlePageChange} activePage={activePage}/>
        <div className={classes.cards}>
          {activePage == 1 && <OrganizationCard />}
          {role == "admin" && activePage == 2 && <CreateOrganizationCard onPageChange={handlePageChange} />}
        </div>
      </AppLayout>
    </>
  );
};

export default OrganizationPage;
