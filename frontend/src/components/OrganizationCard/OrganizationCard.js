import { useState } from "react";

import { Button, Paper } from "@mui/material";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import { useSnackbar } from "notistack";

import { useStyles } from "./styles";
import httpRequest from "../../httpRequest";

const OrganizationCard = (props) => {
  const classes = useStyles();
  const [code, setCode] = useState("");
  const { enqueueSnackbar } = useSnackbar();

  const joinOrganization = async () => {
    try {
      const resp = await httpRequest.post("http://localhost:5000/join_organization", {
        code,
      });
      const status = resp.status;
      if (status === 201) {
        enqueueSnackbar("Joined organization successfully", { variant: "success" });
        props.onPageChange(0, "ORGANIZATIONS");
      }
    } catch (error) {
      if (error.response.status === 401) {
        enqueueSnackbar("User not logged in", { variant: "error" });
      }
      if (error.response.status === 400) {
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
        <Typography variant="h5" sx={{ fontFamily: "Oxanium, cursive" }}>
          Join Organization
          <br />
          <TextField
            id="outlined-basic"
            label="Enter the code"
            variant="outlined"
            sx={{
              m: 2,
              "& .MuiOutlinedInput-root": {
                "&.Mui-focused fieldset": {
                  borderColor: "#854de0",
                },
              },
              "& .MuiInputLabel-outlined.Mui-focused": {
                color: "#854de0",
              },
            }}
            size="small"
            value={code}
            onChange={handleCodeChange}
          />
          <br />
          <Button
            variant="contained"
            onClick={joinOrganization}
            sx={{
              fontFamily: "Oxanium, cursive",
              backgroundColor: "#854de0",
              "&:hover": {
                backgroundColor: "#6336ab",
              },
            }}
          >
            Join
          </Button>
        </Typography>
      </Paper>
    </>
  );
};

export default OrganizationCard;
