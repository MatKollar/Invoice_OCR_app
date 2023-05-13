import { useContext } from "react";
import { Link } from "react-router-dom";
import { Divider, Tooltip, Typography } from "@mui/material";

import DashboardIcon from "@mui/icons-material/Dashboard";
import HistoryIcon from "@mui/icons-material/History";
import BusinessIcon from "@mui/icons-material/Business";
import GroupIcon from "@mui/icons-material/Group";
import IconButton from "@mui/material/IconButton";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";

import userContext from "../../context/user-context";
import { useStyles } from "./styles";

const LinkItem = ({ to, Icon, text }) => {
  const classes = useStyles();
  return (
    <div className={classes.linkItem}>
      <Link to={to} className={classes.link}>
        <Tooltip title={text} placement="right">
          <Typography variant="h7" sx={{ fontFamily: "Oxanium, cursive" }}>
            <Icon className={classes.linkIcon} />
            <span className={classes.mobileHide}>{text}</span>
          </Typography>
        </Tooltip>
      </Link>
    </div>
  );
};

const SideMenu = (props) => {
  const userCtx = useContext(userContext);
  const { role } = userCtx;
  const classes = useStyles();

  return (
    <div
      className={`${classes.rootContainer} ${
        props.visible ? "" : classes.rootContainerCollapsed
      }`}
    >
      {props.visible && (
        <>
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
        </>
      )}
    </div>
  );
};

export default SideMenu;
