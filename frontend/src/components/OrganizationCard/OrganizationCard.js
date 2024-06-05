import { useState } from "react";

import { Paper } from "@mui/material";
import Typography from "@mui/material/Typography";
import { useSnackbar } from "notistack";

import StyledTextField from "../StyledComponents/StyledTextField";
import ButtonContained from "../StyledComponents/ButtonContained";
import { useStyles } from "./styles";
import httpRequest from "../../httpRequest";

const OrganizationCard = (props) => {
  const classes = useStyles();
  const [code, setCode] = useState("");
  const { enqueueSnackbar } = useSnackbar();

  const joinOrganization = async () => {
    try {
      const resp = await httpRequest.post(`${process.env.REACT_APP_BACKEND_URL}/join_organization`, {
        code,
      });
      const status = resp.status;
      if (status === 201) {
        enqueueSnackbar("Joined organization successfully", { variant: "success" });
        props.onPageChange(0, "ORGANIZATIONS");
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        enqueueSnackbar("User not logged in", { variant: "error" });
      }
      if (error.response && error.response.status === 400) {
        enqueueSnackbar("Invalid invite code!", { variant: "warning" });
      }
      enqueueSnackbar("Something went wrong", { variant: "error" });
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
          <StyledTextField
            id="outlined-basic"
            label="Enter the code"
            variant="outlined"
            style={{
              margin: 20,
            }}
            size="small"
            value={code}
            onChange={handleCodeChange}
          />
          <br />
          <ButtonContained onClick={joinOrganization}>Join</ButtonContained>
        </Typography>
      </Paper>
    </>
  );
};

export default OrganizationCard;
