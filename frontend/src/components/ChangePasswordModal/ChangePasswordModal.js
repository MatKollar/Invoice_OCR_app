import { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import Typography from "@mui/material/Typography";
import httpRequest from "../../httpRequest";

const ChangePasswordModal = ({ open, onClose }) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleClose = () => {
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
    onClose();
  };

  const validatePassword = () => {
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return false;
    }

    if (newPassword.length < 6) {
      alert("Password must be at least 6 characters long");
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
      await httpRequest.post("http://localhost:5000/change-password", {
        oldPassword,
        newPassword,
      });
    } catch (error) {
      if (error.response.status === 401) {
        alert("Invalid credentials");
      }
    }
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <form onSubmit={handleFormSubmit}>
        <DialogTitle>
          <Typography
            component="h1"
            variant="h5"
            sx={{ fontFamily: "Oxanium, cursive", fontWeight: 600 }}
          >
            Change Password
          </Typography>
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Old Password"
            type="password"
            fullWidth
            required
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                "&.Mui-focused fieldset": {
                  borderColor: "#854de0",
                },
              },
              "& .MuiInputLabel-outlined.Mui-focused": {
                color: "#854de0",
              },
            }}
          />
          <TextField
            margin="dense"
            label="New Password"
            type="password"
            fullWidth
            required
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                "&.Mui-focused fieldset": {
                  borderColor: "#854de0",
                },
              },
              "& .MuiInputLabel-outlined.Mui-focused": {
                color: "#854de0",
              },
            }}
          />
          <TextField
            margin="dense"
            label="Confirm Password"
            type="password"
            fullWidth
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                "&.Mui-focused fieldset": {
                  borderColor: "#854de0",
                },
              },
              "& .MuiInputLabel-outlined.Mui-focused": {
                color: "#854de0",
              },
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            sx={{
              fontFamily: "Oxanium, cursive",
              color: "#854de0",
              borderColor: "#854de0",
              "&:hover": {
                backgroundColor: "#854de0",
                color: "#fff",
                borderColor: "#854de0",
              },
            }}
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button
            variant="outlined"
            sx={{
              fontFamily: "Oxanium, cursive",
              color: "#854de0",
              borderColor: "#854de0",
              "&:hover": {
                backgroundColor: "#854de0",
                color: "#fff",
                borderColor: "#854de0",
              },
            }}
            type="submit"
          >
            Save
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ChangePasswordModal;
