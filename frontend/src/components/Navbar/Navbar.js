import { useContext, useState } from "react";
import { useLocation } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import {
  IconButton,
  Typography,
  Select,
  MenuItem,
  FormControl,
  Tooltip,
} from "@mui/material";
import ButtonContained from "../StyledComponents/ButtonContained";
import AuthContext from "../../context/auth-context";
import { useStyles } from "./styles";
import httpRequest from "../../httpRequest";
import ProfileIcon from "../ProfileIcon/ProfileIcon";

const Navbar = (props) => {
  const classes = useStyles();
  const location = useLocation();
  const authContext = useContext(AuthContext);
  const [language, setLanguage] = useState("en");

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

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
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
                  color: "#854de0",
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
            fontFamily: "Oxanium, cursive",
          }}
        >
          {getPageTitle()}
        </Typography>
      </div>
      <div className={classes.rightButtons}>
        <FormControl variant="outlined" size="small" sx={{ mr: 2 }}>
          <Tooltip title="Invoice language" placement="left">
            <Select
              value={language}
              onChange={handleLanguageChange}
              sx={{
                color: "white",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "white",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#854de0",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#854de0",
                },
                "& .MuiSvgIcon-root": {
                  color: "white",
                },
              }}
            >
              <MenuItem value="en">English</MenuItem>
              <MenuItem value="sk">Slovak</MenuItem>
            </Select>
          </Tooltip>
        </FormControl>
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
