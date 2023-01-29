import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";

import { useStyles } from "./styles";
import httpRequest from "../../httpRequest";

const RegisterPage = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const [nameValid, setNameValid] = useState(true);
  const [emailValid, setEmailValid] = useState(true);
  const [passwordValid, setPasswordValid] = useState(true);

  const validateName = (event) => {
    const name = event.target.value;
    if (name.length < 3 && name.length > 0) {
      setNameValid(false);
    } else {
      setNameValid(true);
    }
  };

  const validateEmail = (event) => {
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
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
      try {
        const resp = await httpRequest.post("http://localhost:5000/register", {
          name,
          email,
          password,
        });

        window.location.href = "/";
      } catch (error) {
        if (error.response.status === 401) {
          alert("Invalid credentials");
        }
      }
    }
  };

  return (
    <Container component="main" maxWidth="xs" className={classes.rootContainer}>
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5">
          Register
        </Typography>
        <Box component="form" validate onSubmit={submitHandler} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
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
              <TextField
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
              <TextField
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
                type="password"
                id="password"
                onBlur={validatePassword}
                autoComplete="off"
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Register
          </Button>
          <Grid container justifyContent="flex-start">
            <Grid item>
              <Link href="#" variant="body2" onClick={() => navigate("/login")}>
                Already have an account? Login
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default RegisterPage;
