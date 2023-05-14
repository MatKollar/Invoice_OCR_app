import Button from "@mui/material/Button";
import MenuIcon from "@mui/icons-material/Menu";
import { IconButton, Typography } from "@mui/material";
import { useStyles } from "./styles";
import httpRequest from "../../httpRequest";
import ProfileIcon from "../ProfileIcon/ProfileIcon";

const Navbar = (props) => {
  const classes = useStyles();

  const logoutUser = async () => {
    await httpRequest.post("//localhost:5000/logout");
    window.location.href = "/login";
  };

  return (
    <div className={classes.rootContainer}>
      <div className={classes.headingContainer}>
        {!props.sideMenuVisible && (
          <IconButton onClick={props.toggleSideMenu}>
            <MenuIcon sx={{ color: "white" }} />
          </IconButton>
        )}
        <Typography
          variant="h5"
          sx={{ ml: 4, fontSize: { xs: "20px", sm: "24px", md: "26px" } }}
        >
          Welcome Back {props.userName}!
        </Typography>
      </div>
      <div className={classes.rightButtons}>
        <ProfileIcon />
        <Button
          className={classes.logout}
          variant="contained"
          sx={{ mx: 2 }}
          onClick={logoutUser}
        >
          Log out
        </Button>
      </div>
    </div>
  );
};

export default Navbar;
