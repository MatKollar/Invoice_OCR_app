import Button from "@mui/material/Button";
import AuthContext from "../../context/auth-context";

import React, { useContext } from "react";
import { useStyles } from "./styles";
import { Grid, Typography } from "@mui/material";

const Navbar = () => {
  const ctx = useContext(AuthContext);
  const classes = useStyles();

  return (
    <>
      <div className={classes.rootContainer}>
        <Grid container spacing={2} sx={{ my: "auto" }}>
          <Grid item xs={2}></Grid>
          <Grid item xs={8} sx={{ mt: 1, textAlign: "center" }}>
            <Typography variant="h4">Welcome Back!</Typography>
          </Grid>
          <Grid item xs={2} sx={{ mt: 1, textAlign: "right" }}>
            <Button
              className={classes.logout}
              variant="contained"
              sx={{ mx: 2 }}
              onClick={ctx.logout}
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
