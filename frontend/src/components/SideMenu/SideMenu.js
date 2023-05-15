import { useContext } from "react";
import { Divider, Typography } from "@mui/material";

import DashboardIcon from "@mui/icons-material/Dashboard";
import HistoryIcon from "@mui/icons-material/History";
import BusinessIcon from "@mui/icons-material/Business";
import GroupIcon from "@mui/icons-material/Group";
import IconButton from "@mui/material/IconButton";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import LogoutIcon from "@mui/icons-material/Logout";

import userContext from "../../context/user-context";
import httpRequest from "../../httpRequest";
import { useStyles } from "./styles";
import ProfileIcon from "../ProfileIcon/ProfileIcon";
import LinkItem from "./LinkItem/LinkItem";

const SideMenu = (props) => {
  const userCtx = useContext(userContext);
  const { role } = userCtx;
  const classes = useStyles();

  const logoutUser = async () => {
    await httpRequest.post("//localhost:5000/logout");
    window.location.href = "/login";
  };

  return (
    <div
      className={`${classes.rootContainer} ${
        props.visible ? "" : classes.rootContainerCollapsed
      }`}
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      {props.visible && (
        <>
          <div>
            <div className={classes.closeContainer}>
              <IconButton onClick={props.onClose} className={classes.closeButton}>
                <ArrowBackIosIcon sx={{ color: "white" }} />
              </IconButton>
            </div>
            <Typography variant="h4" sx={{ mb: 4 }}>
              OCR app
            </Typography>
            <Divider />
            <div className={classes.linkContainer}>
              <LinkItem to="/" Icon={DashboardIcon} text="Dashboard" />
              <LinkItem to="/history" Icon={HistoryIcon} text="Your scans" />
              <LinkItem to="/organization" Icon={BusinessIcon} text="Organization" />
              {role === "admin" && (
                <LinkItem to="/users" Icon={GroupIcon} text="Manage users" />
              )}
            </div>
          </div>
          <div className={classes.footerContainer}>
            <div>
              <ProfileIcon />
            </div>
            <IconButton onClick={logoutUser}>
              <LogoutIcon sx={{ color: "white", fontSize: 30, mt: 2 }} />
            </IconButton>
          </div>
        </>
      )}
    </div>
  );
};

export default SideMenu;
