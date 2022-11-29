import { Link } from "react-router-dom";
import { Divider, Typography } from "@mui/material";
import { useStyles } from "./styles";
import DashboardIcon from "@mui/icons-material/Dashboard";
import HistoryIcon from '@mui/icons-material/History';

const SideMenu = () => {
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
              <Typography variant="h7" >
                <HistoryIcon />
                Your scans
              </Typography>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default SideMenu;
