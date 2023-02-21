import { useContext, useEffect, useState } from "react";

import httpRequest from "../../httpRequest";
import AppLayout from "../../components/AppLayout/AppLayout";
import { useStyles } from "./styles";
import OrganizationCard from "../../components/OrganizationCard/OrganizationCard";

const OrganizationPage = () => {
  const classes = useStyles();

  return (
    <>
      <AppLayout>
        <div className={classes.root}>
          <OrganizationCard />
        </div>
      </AppLayout>
    </>
  );
};

export default OrganizationPage;
