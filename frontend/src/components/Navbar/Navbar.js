import Button from "@mui/material/Button";
import AuthContext from "../../context/auth-context";

import React, { useContext } from "react";
import { useStyles } from "./styles";
import { Grid, Typography } from "@mui/material";
import httpClient from "../../httpClient";

const Navbar = () => {
  const ctx = useContext(AuthContext);
  const classes = useStyles();

  const logoutUser = async () => {
    await httpClient.post("//localhost:5000/logout");
    window.location.href = "/";
  };

  return (
    <>
      <div className={classes.rootContainer}>
        <Grid container spacing={2}>
          <Grid item xs={10} sx={{ mt: 1, textAlign: "left" }}>
            <Typography variant="h5" sx={{ ml: 4 }}>
              Welcome Back!
            </Typography>
          </Grid>
          <Grid item xs={2} sx={{ mt: 1, textAlign: "right" }}>
            <Button
              className={classes.logout}
              variant="contained"
              sx={{ mx: 2 }}
              onClick={logoutUser}
            >
              Log out
            </Button>
          </Grid>
        </Grid>
      </div>
    </>
  );
};

export default Navbar;
