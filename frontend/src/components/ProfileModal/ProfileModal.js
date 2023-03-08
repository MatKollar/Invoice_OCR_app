import { useContext, useState } from "react";
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

const ProfileModal = ({ open, onClose }) => {
  const classes = useStyles();
  const userCtx = useContext(UserContext);
  const [name, setName] = useState(userCtx.userName);
  const [email, setEmail] = useState(userCtx.email);
  const [isChangingName, setIsChangingName] = useState(false);
  const [isChangingEmail, setIsChangingEmail] = useState(false);

  const handleClose = () => {
    setName(userCtx.userName);
    setEmail(userCtx.email);
    setIsChangingName(false);
    setIsChangingEmail(false);
    onClose();
  };

  const handleSave = () => {
    userCtx.setName(name);
    userCtx.setEmail(email);
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
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSave}>Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProfileModal;
