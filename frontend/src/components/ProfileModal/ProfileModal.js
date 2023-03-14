import { useContext, useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import UserContext from "../../context/user-context";
import { useStyles } from "./styles";
import httpRequest from "../../httpRequest";

const ProfileModal = ({ open, onClose }) => {
  const classes = useStyles();
  const userCtx = useContext(UserContext);
  const [name, setName] = useState(userCtx.userName);
  const [email, setEmail] = useState(userCtx.email);
  const [isChangingName, setIsChangingName] = useState(false);
  const [isChangingEmail, setIsChangingEmail] = useState(false);
  const [activeOrganization, setActiveOrganization] = useState("");

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
      alert("Email is not valid!");
    } else {
      userCtx.setUserName(name);
      userCtx.setEmail(email);
      updateUser(name, email);
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email) && email.length > 0) {
      return false;
    } else {
      return true;
    }
  };

  const updateUser = async (name, email) => {
    try {
      const resp = await httpRequest.post("http://localhost:5000/update-user", {
        name,
        email,
      });
    } catch (error) {
      if (error.response.status === 401) {
        alert("Invalid credentials");
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
      <DialogTitle>Your Profile</DialogTitle>
      <DialogContent>
        {!isChangingName && (
          <div className={classes.profile}>
            <div>Username: {name}</div>
            <Button onClick={handleChangeNameClick}>Change Name</Button>
          </div>
        )}
        {isChangingName && (
          <TextField
            label="Name"
            value={name}
            onChange={handleNameChange}
            fullWidth
            margin="normal"
          />
        )}
        {!isChangingEmail && (
          <div className={classes.profile}>
            <div>Email: {email}</div>
            <Button onClick={handleChangeEmailClick}>Change Email</Button>
          </div>
        )}
        {isChangingEmail && (
          <TextField
            label="Email"
            value={email}
            onChange={handleEmailChange}
            fullWidth
            margin="normal"
          />
        )}
        <div className={classes.profile}>
          <div>Active organization: {activeOrganization.name}</div>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSave}>Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProfileModal;
