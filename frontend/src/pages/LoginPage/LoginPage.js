import * as React from "react";
import { useRef, useContext, useState, useEffect } from "react";

import CryptoJS from "crypto-js";
import axios from "axios";

import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { useStyles } from "./styles";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../context/auth-context";

const LoginPage = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const emailInputRef = useRef();
  const passwordInputRef = useRef();
  const authCtx = useContext(AuthContext);
  const [rememberMe, setRememberMe] = useState(false);

  const submitHandler = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const email = data.get("email");
    const password = data.get("password");

    try {
      const resp = await axios.post("http://localhost:5000/login", {
        email,
        password,
      });

      window.location.href = "/";
      console.log(resp)
    } catch (error) {
      if (error.response.status === 401) {
        alert("Invalid credentials");
      }
    }
  };

  const handleCheckbox = (event) => {
    setRememberMe(event.target.checked);
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
          Login
        </Typography>
        <Box
          component="form"
          onSubmit={submitHandler}
          noValidate
          sx={{ mt: 1 }}
        >
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="off"
            ref={emailInputRef}
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            ref={passwordInputRef}
            autoComplete="off"
          />
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
            onChange={handleCheckbox}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link
                href="#"
                variant="body2"
                onClick={() => navigate("/register")}
              >
                {"Don't have an account? Register"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default LoginPage;
