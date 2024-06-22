import { useContext } from "react";
import { useLocation } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import { IconButton, Typography } from "@mui/material";
import ButtonContained from "../StyledComponents/ButtonContained";
import AuthContext from "../../context/auth-context";
import { useStyles } from "./styles";
import httpRequest from "../../httpRequest";
import ProfileIcon from "../ProfileIcon/ProfileIcon";
import { COLORS } from "../../styles/constants";

const Navbar = (props) => {
  const classes = useStyles();
  const location = useLocation();
  const authContext = useContext(AuthContext);

  const getPageTitle = () => {
    switch (location.pathname) {
      case "/":
        return `Welcome Back ${props.userName}!`;
      case "/history":
        return "Your scans";
      case "/organization":
        return "Organizations";
      case "/users":
        return "Manage users";
      default:
        return "";
    }
  };

  const logoutUser = async () => {
    await httpRequest.post(`${process.env.REACT_APP_BACKEND_URL}/logout`);
    authContext.logout();
    window.location.href = "/login";
  };

  return (
    <div className={classes.rootContainer}>
      <div className={classes.headingContainer}>
        {!props.sideMenuVisible && (
          <IconButton onClick={props.toggleSideMenu}>
            <MenuIcon
              sx={{
                color: "white",
                "&:hover": {
                  color: COLORS.PRIMARY,
                },
                marginTop: "-4px",
              }}
            />
          </IconButton>
        )}
        <Typography
          variant="h5"
          sx={{
            ml: 4,
            fontSize: { xs: "20px", sm: "24px", md: "26px" },
          }}
        >
          {getPageTitle()}
        </Typography>
      </div>
      <div className={classes.rightButtons}>
        <ProfileIcon />
        <ButtonContained
          className={classes.logout}
          style={{
            margin: "0px 10px",
          }}
          onClick={logoutUser}
        >
          Log out
        </ButtonContained>
      </div>
    </div>
  );
};

export default Navbar;
