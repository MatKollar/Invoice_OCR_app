import { useState } from "react";

import { Button, Paper } from "@mui/material";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";

import { useStyles } from "./styles";
import httpRequest from "../../httpRequest";

const OrganizationCard = (props) => {
  const classes = useStyles();
  const [code, setCode] = useState("");

  const joinOrganization = async () => {
    try {
      const resp = await httpRequest.post("http://localhost:5000/join_organization", {
        code,
      });
      const status = resp.status;
      if (status === 201) {
        props.onPageChange(0, "ORGANIZATIONS");
      }
    } catch (error) {
      if (error.response.status === 401) {
        alert("User not logged in");
      }
      if (error.response.status === 400) {
        alert("Invalid invite code!");
      }
    }
  };

  const handleCodeChange = (event) => {
    setCode(event.target.value);
  };

  return (
    <>
      <Paper elevation={3} className={classes.card} sx={{ p: 2, borderRadius: 5 }}>
        <Typography variant="h5">
          Join Organization
          <br />
          <TextField
            id="outlined-basic"
            label="Enter the code"
            variant="outlined"
            sx={{ m: 2 }}
            size="small"
            value={code}
            onChange={handleCodeChange}
          />{" "}
          <br />
          <Button variant="contained" onClick={joinOrganization}>
            Join
          </Button>
        </Typography>
      </Paper>
    </>
  );
};

export default OrganizationCard;
