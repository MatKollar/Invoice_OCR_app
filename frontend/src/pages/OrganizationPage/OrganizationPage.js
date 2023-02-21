import { useContext, useEffect, useState } from "react";

import httpRequest from "../../httpRequest";
import AppLayout from "../../components/AppLayout/AppLayout";
import { useStyles } from "./styles";

const OrganizationPage = () => {
  const classes = useStyles();

  return (
    <>
      <AppLayout></AppLayout>
    </>
  );
};

export default OrganizationPage;
