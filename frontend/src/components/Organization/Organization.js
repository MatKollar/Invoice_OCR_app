import { useState, useContext, useEffect } from "react";
import { Button } from "@mui/material";
import { useStyles } from "./styles";
import httpRequest from "../../httpRequest";
import userContext from "../../context/user-context";

const Organization = (props) => {
  const classes = useStyles();
  const orgData = props.dataFromDB;
  const [activeOrganization, setActiveOrganization] = useState(false);
  const userCtx = useContext(userContext);

  useEffect(() => {
    if (userCtx.activeOrganization === orgData.id) {
      setActiveOrganization(true);
    }
  }, [userCtx.activeOrganization]);

  const setOrganizationAsActive = async () => {
    setActiveOrganization(true);
    userCtx.setActiveOrganization(orgData.id);
    try {
      const resp = await httpRequest.post(
        "http://localhost:5000/activate-organization",
        {
          organization_id: orgData.id,
        }
      );
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
      const resp = await httpRequest.post(
        "http://localhost:5000/deactivate-organization",
        {
          organization_id: orgData.id,
        }
      );
    } catch (error) {
      if (error.response.status === 401) {
        alert("Invalid credentials");
      }
    }
  };

  return (
    <div className={classes.rootContainer}>
      {activeOrganization && (
        <Button
          sx={{ position: "absolute", right: 20 }}
          onClick={deactiveOrganization}
        >
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
    </div>
  );
};

export default Organization;
