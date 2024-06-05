import { useContext, useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import Typography from "@mui/material/Typography";
import ButtonOutlined from "../StyledComponents/ButtonOutlined";
import StyledTextField from "../StyledComponents/StyledTextField";
import UserContext from "../../context/user-context";
import { useStyles } from "./styles";
import httpRequest from "../../httpRequest";

const ProfileModal = ({ open, onClose }) => {
  const classes = useStyles();
  const userCtx = useContext(UserContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isChangingName, setIsChangingName] = useState(false);
  const [isChangingEmail, setIsChangingEmail] = useState(false);
  const [activeOrganization, setActiveOrganization] = useState("");
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    setName(userCtx.userName);
    setEmail(userCtx.email);
    if (userCtx.activeOrganization) {
      setActiveOrganization(userCtx.activeOrganization);
    }
  }, [userCtx]);

  const handleClose = () => {
    setName(userCtx.userName);
    setEmail(userCtx.email);
    setIsChangingName(false);
    setIsChangingEmail(false);
    onClose();
  };

  const handleSave = () => {
    if (!validateEmail(email)) {
      enqueueSnackbar("Email is not valid!", { variant: "error" });
    } else {
      updateUser(name, email);
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email) && email.length > 0) {
      return false;
    } else {
      return true;
    }
  };

  const updateUser = async (name, email) => {
    try {
      await httpRequest.post(
        `${process.env.REACT_APP_BACKEND_URL}/update-user`,
        {
          name,
          email,
        }
      );
      enqueueSnackbar("User details updated successfully", {
        variant: "success",
      });
      userCtx.setUserName(name);
      userCtx.setEmail(email);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        enqueueSnackbar("Invalid credentials", { variant: "error" });
      }
    }
    handleClose();
  };

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleChangeNameClick = () => {
    setIsChangingName(true);
  };

  const handleChangeEmailClick = () => {
    setIsChangingEmail(true);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{ style: { width: 500 } }}
    >
      <DialogTitle sx={{ fontWeight: 600 }}>Your Profile</DialogTitle>
      <DialogContent>
        {!isChangingName && (
          <div className={classes.profile}>
            <div className={classes.text}>
              <Typography component="p" variant="body1">
                Username:
              </Typography>
              <Typography component="p" variant="body1">
                {name}
              </Typography>
            </div>
            <ButtonOutlined onClick={handleChangeNameClick}>
              Change Name
            </ButtonOutlined>
          </div>
        )}
        {isChangingName && (
          <StyledTextField
            label="Name"
            value={name}
            onChange={handleNameChange}
            fullWidth
            margin="normal"
          />
        )}
        {!isChangingEmail && (
          <div className={classes.profile}>
            <div className={classes.text}>
              <Typography component="p" variant="body1">
                Email:
              </Typography>
              <Typography component="p" variant="body1">
                {email}
              </Typography>
            </div>
            <ButtonOutlined
              style={{ fontSize: { xs: "5px", sm: "12px" } }}
              onClick={handleChangeEmailClick}
            >
              Change Email
            </ButtonOutlined>
          </div>
        )}
        {isChangingEmail && (
          <StyledTextField
            label="Email"
            value={email}
            onChange={handleEmailChange}
            fullWidth
            margin="normal"
          />
        )}
        <div className={classes.profile}>
          <div className={classes.text}>
            <Typography component="p" variant="body1">
              Active organization:
            </Typography>
            <Typography component="p" variant="body1">
              {activeOrganization.name}
            </Typography>
          </div>
        </div>
      </DialogContent>
      <DialogActions sx={{ mr: 1 }}>
        <ButtonOutlined onClick={handleClose}>Cancel</ButtonOutlined>
        <ButtonOutlined onClick={handleSave}>Save</ButtonOutlined>
      </DialogActions>
    </Dialog>
  );
};

export default ProfileModal;
