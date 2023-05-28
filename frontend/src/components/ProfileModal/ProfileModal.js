import { useContext, useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import Typography from "@mui/material/Typography";
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
      enqueueSnackbar('Email is not valid!', { variant: 'error' });
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
      await httpRequest.post("http://localhost:5000/update-user", {
        name,
        email,
      });
      enqueueSnackbar('User details updated successfully', { variant: 'success' });
    } catch (error) {
      if (error.response.status === 401) {
        enqueueSnackbar('Invalid credentials', { variant: 'error' });
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
    <Dialog open={open} onClose={handleClose} PaperProps={{ style: { width: 500 } }}>
      <DialogTitle>
        <Typography
          component="h1"
          variant="h5"
          sx={{ fontFamily: "Oxanium, cursive", fontWeight: 600 }}
        >
          Your Profile
        </Typography>
      </DialogTitle>
      <DialogContent>
        {!isChangingName && (
          <div className={classes.profile}>
            <div className={classes.text}>
              <Typography
                component="p"
                variant="body1"
                sx={{ fontFamily: "Oxanium, cursive" }}
              >
                Username:
              </Typography>
              <Typography
                component="p"
                variant="body1"
                sx={{ fontFamily: "Oxanium, cursive" }}
              >
                {name}
              </Typography>
            </div>
            <Button
              variant="outlined"
              onClick={handleChangeNameClick}
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
            >
              Change Name
            </Button>
          </div>
        )}
        {isChangingName && (
          <TextField
            label="Name"
            value={name}
            onChange={handleNameChange}
            fullWidth
            margin="normal"
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
        )}
        {!isChangingEmail && (
          <div className={classes.profile}>
            <div className={classes.text}>
              <Typography
                component="p"
                variant="body1"
                sx={{ fontFamily: "Oxanium, cursive" }}
              >
                Email:
              </Typography>
              <Typography
                component="p"
                variant="body1"
                sx={{ fontFamily: "Oxanium, cursive" }}
              >
                {email}
              </Typography>
            </div>
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
              onClick={handleChangeEmailClick}
            >
              Change Email
            </Button>
          </div>
        )}
        {isChangingEmail && (
          <TextField
            label="Email"
            value={email}
            onChange={handleEmailChange}
            fullWidth
            margin="normal"
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
        )}
        <div className={classes.profile}>
          <div className={classes.text}>
            <Typography
              component="p"
              variant="body1"
              sx={{ fontFamily: "Oxanium, cursive" }}
            >
              Active organization:
            </Typography>
            <Typography
              component="p"
              variant="body1"
              sx={{ fontFamily: "Oxanium, cursive" }}
            >
              {activeOrganization.name}
            </Typography>
          </div>
        </div>
      </DialogContent>
      <DialogActions sx={{ mr: 1 }}>
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
          onClick={handleSave}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProfileModal;
