import { useContext } from "react";
import { Link } from "react-router-dom";
import { Divider, Typography } from "@mui/material";

import DashboardIcon from "@mui/icons-material/Dashboard";
import HistoryIcon from "@mui/icons-material/History";
import BusinessIcon from "@mui/icons-material/Business";
import GroupIcon from "@mui/icons-material/Group";

import userContext from "../../context/user-context";
import { useStyles } from "./styles";

const SideMenu = () => {
  const userCtx = useContext(userContext);
  const role = userCtx.role;
  const classes = useStyles();

  return (
    <>
      <div className={classes.rootContainer}>
        <Typography variant="h4" sx={{ my: 4 }}>
          OCR app
        </Typography>
        <Divider />
        <div className={classes.linkContainer}>
          <div>
            <Link to="/" className={classes.link}>
              <Typography variant="h7">
                <DashboardIcon />
                Dashboard
              </Typography>
            </Link>
          </div>
          <br />
          <div>
            <Link to="/history" className={classes.link}>
              <Typography variant="h7">
                <HistoryIcon />
                Your scans
              </Typography>
            </Link>
          </div>
          <br />
          <div>
            <Link to="/organization" className={classes.link}>
              <Typography variant="h7">
                <BusinessIcon />
                Organization
              </Typography>
            </Link>
          </div>
          <br />
          {role == "admin" && (
            <div>
              <Link to="/users" className={classes.link}>
                <Typography variant="h7">
                  <GroupIcon />
                  Manage users
                </Typography>
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SideMenu;
