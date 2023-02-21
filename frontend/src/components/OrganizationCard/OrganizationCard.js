import { Button, Paper } from "@mui/material";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import { useStyles } from "./styles";

const OrganizationCard = () => {
  const classes = useStyles();
  const [code, setCode] = useState("");

  const joinOrganization = () => {
    console.log("Joining Organization with code", code);
  };

  const handleCodeChange = (event) => {
    setCode(event.target.value);
  };

  return (
    <>
      <Paper
        elevation={3}
        className={classes.card}
        sx={{ p: 2, borderRadius: 5 }}
      >
        <Typography variant="h5">
          Join Organization
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
