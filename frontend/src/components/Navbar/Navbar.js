import Button from "@mui/material/Button";
import { useState } from "react";
import { useStyles } from "./styles";
import { Grid, IconButton, Menu, MenuItem, Typography } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import httpRequest from "../../httpRequest";

const Navbar = (props) => {
  const classes = useStyles();

  const [open, setOpen] = useState(null);

  const handleMenuOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleMenuClose = () => {
    setOpen(null);
  };

  const logoutUser = async () => {
    await httpRequest.post("//localhost:5000/logout");
    window.location.href = "/login";
  };

  const openProfile = () => {};

  const changePassword = () => {};

  return (
    <>
      <div className={classes.rootContainer}>
        <Grid container spacing={2}>
          <Grid item xs={9} sx={{ mt: 1, textAlign: "left" }}>
            <Typography variant="h5" sx={{ ml: 4 }}>
              Welcome Back {props.userName}!
            </Typography>
          </Grid>
          <Grid item xs={3} sx={{ mt: 1, textAlign: "right" }}>
            <IconButton
              sx={{ p: 0.1, color: "white" }}
              onClick={handleMenuOpen}
            >
              <AccountCircleIcon fontSize="large" />
            </IconButton>
            <Menu
              anchorEl={open}
              open={Boolean(open)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={openProfile}>Profile</MenuItem>
              <MenuItem onClick={changePassword}>Change password</MenuItem>
              <MenuItem onClick={logoutUser}>Log out</MenuItem>
            </Menu>
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
