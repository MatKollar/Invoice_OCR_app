import { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { useSnackbar } from "notistack";
import ButtonOutlined from "../StyledComponents/ButtonOutlined";
import StyledTextField from "../StyledComponents/StyledTextField";
import httpRequest from "../../httpRequest";

const ChangePasswordModal = ({ open, onClose }) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { enqueueSnackbar } = useSnackbar();

  const handleClose = () => {
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
    onClose();
  };

  const validatePassword = () => {
    if (newPassword !== confirmPassword) {
      enqueueSnackbar("Passwords do not match", { variant: "warning" });
      return false;
    }

    if (newPassword.length < 6) {
      enqueueSnackbar("Password must be at least 6 characters long", {
        variant: "info",
      });
      return false;
    }
    return true;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!validatePassword(newPassword, confirmPassword)) {
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      return;
    }

    try {
      await httpRequest.post(
        `${process.env.REACT_APP_BACKEND_URL}/change-password`,
        {
          oldPassword,
          newPassword,
        }
      );
      enqueueSnackbar("Password changed successfully", { variant: "success" });
    } catch (error) {
      if (error.response && error.response.status === 401) {
        enqueueSnackbar("Invalid credentials", { variant: "error" });
      }
    }
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <form onSubmit={handleFormSubmit}>
        <DialogTitle sx={{ fontWeight: 600 }}>Change Password</DialogTitle>
        <DialogContent>
          <StyledTextField
            autoFocus
            margin="dense"
            label="Old Password"
            type="password"
            fullWidth
            required
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
          <StyledTextField
            margin="dense"
            label="New Password"
            type="password"
            fullWidth
            required
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <StyledTextField
            margin="dense"
            label="Confirm Password"
            type="password"
            fullWidth
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <ButtonOutlined variant="outlined" onClick={handleClose}>
            Cancel
          </ButtonOutlined>
          <ButtonOutlined type="submit">Save</ButtonOutlined>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ChangePasswordModal;
