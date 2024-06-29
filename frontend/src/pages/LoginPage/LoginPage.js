import { useState } from "react";
import { useNavigate } from "react-router-dom";

import CssBaseline from "@mui/material/CssBaseline";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { FadeLoader } from "react-spinners";
import { useSnackbar } from "notistack";

import { useStyles } from "./styles";
import StyledTextField from "../../components/StyledComponents/StyledTextField";
import ButtonContained from "../../components/StyledComponents/ButtonContained";
import httpRequest from "../../httpRequest";
import { COLORS } from "../../styles/constants";

const LoginPage = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const email = data.get("email");
    const password = data.get("password");
    setLoading(true);

    try {
      await httpRequest.post(`${process.env.REACT_APP_BACKEND_URL}/login`, {
        email,
        password,
      });

      window.location.href = "/";
    } catch (error) {
      setLoading(false);

      if (error.response && error.response.status === 401) {
        enqueueSnackbar("Wrong email or password", {
          variant: "error",
        });
      } else {
        enqueueSnackbar("Server error", {
          variant: "error",
        });
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
              LOGIN
            </Typography>
            <Box component="form" onSubmit={submitHandler} sx={{ mt: 1 }}>
              <StyledTextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="off"
                autoFocus
              />
              <StyledTextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? "text" : "password"}
                id="password"
                autoComplete="off"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                        style={{ marginRight: "-12px" }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <ButtonContained
                type="submit"
                fullWidth
                style={{
                  marginTop: 25,
                  marginBottom: 20,
                  fontWeight: 1000,
                }}
              >
                Login
              </ButtonContained>
              <Grid container>
                <Grid item>
                  <Link
                    href="#"
                    variant="body2"
                    sx={{
                      fontWeight: 600,
                      color: COLORS.PRIMARY,
                    }}
                    onClick={() => navigate("/register")}
                  >
                    {"Don't have an account? Register"}
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

export default LoginPage;
