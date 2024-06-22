import { useState } from "react";
import { useNavigate } from "react-router-dom";

import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import CssBaseline from "@mui/material/CssBaseline";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { FadeLoader } from "react-spinners";
import { useSnackbar } from "notistack";

import StyledTextField from "../../components/StyledComponents/StyledTextField";
import ButtonContained from "../../components/StyledComponents/ButtonContained";
import { useStyles } from "./styles";
import httpRequest from "../../httpRequest";
import { COLORS } from "../../styles/constants";

const RegisterPage = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const [nameValid, setNameValid] = useState(true);
  const [emailValid, setEmailValid] = useState(true);
  const [passwordValid, setPasswordValid] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const validateName = (event) => {
    const name = event.target.value;
    if (name.length < 3 && name.length > 0) {
      setNameValid(false);
    } else {
      setNameValid(true);
    }
  };

  const validateEmail = (event) => {
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    const email = event.target.value;
    if (!emailRegex.test(email) && email.length > 0) {
      setEmailValid(false);
    } else {
      setEmailValid(true);
    }
  };

  const validatePassword = (event) => {
    const password = event.target.value;
    if (password.length < 6 && password.length > 0) {
      setPasswordValid(false);
    } else {
      setPasswordValid(true);
    }
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const name = data.get("name");
    const email = data.get("email");
    const password = data.get("password");

    if (nameValid && emailValid && passwordValid) {
      setLoading(true);
      try {
        await httpRequest.post(
          `${process.env.REACT_APP_BACKEND_URL}/register`,
          {
            name,
            email,
            password,
          }
        );
        window.location.href = "/";
      } catch (error) {
        setLoading(false);
        if (error.response && error.response.status === 401) {
          enqueueSnackbar("Invalid credentials", {
            variant: "error",
          });
        } else {
          enqueueSnackbar("Server error", {
            variant: "error",
          });
        }
      }
    }
  };

  return (
    <Container component="main" maxWidth="xs" className={classes.rootContainer}>
      {loading ? (
        <FadeLoader
          color={COLORS.PRIMARY}
          size={50}
          style={{ position: "absolute", top: "40%", left: "50%" }}
        />
      ) : (
        <>
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography component="h1" variant="h4" sx={{ fontWeight: 600 }}>
              REGISTER
            </Typography>
            <Box component="form" onSubmit={submitHandler} sx={{ mt: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <StyledTextField
                    error={!nameValid}
                    helperText={
                      !nameValid ? "Name must be at least 3 characters." : ""
                    }
                    autoComplete="off"
                    name="name"
                    required
                    fullWidth
                    id="name"
                    label="Name"
                    onBlur={validateName}
                    autoFocus
                  />
                </Grid>
                <Grid item xs={12}>
                  <StyledTextField
                    error={!emailValid}
                    helperText={!emailValid ? "Incorrect email format." : ""}
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    onBlur={validateEmail}
                    autoComplete="off"
                  />
                </Grid>
                <Grid item xs={12}>
                  <StyledTextField
                    error={!passwordValid}
                    helperText={
                      !passwordValid
                        ? "Password must be at least 6 characters."
                        : ""
                    }
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    id="password"
                    onBlur={validatePassword}
                    autoComplete="off"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>
              <ButtonContained
                type="submit"
                fullWidth
                style={{
                  marginTop: 25,
                  marginBottom: 20,
                  fontWeight: 600,
                }}
              >
                Register
              </ButtonContained>
              <Grid container justifyContent="flex-start">
                <Grid item>
                  <Link
                    href="#"
                    variant="body2"
                    onClick={() => navigate("/login")}
                  >
                    Already have an account? Login
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </>
      )}
    </Container>
  );
};

export default RegisterPage;
