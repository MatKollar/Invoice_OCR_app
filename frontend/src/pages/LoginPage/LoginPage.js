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
import { FadeLoader } from "react-spinners";
import { useSnackbar } from "notistack";

import { useStyles } from "./styles";
import httpRequest from "../../httpRequest";

const LoginPage = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);

  const submitHandler = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const email = data.get("email");
    const password = data.get("password");
    setLoading(true);

    try {
      await httpRequest.post("http://localhost:5000/login", {
        email,
        password,
      });

      window.location.href = "/";
    } catch (error) {
      setLoading(false);

      if (error.response.status === 401) {
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
          color="#854de0"
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
            <Typography
              component="h1"
              variant="h4"
              sx={{ fontFamily: "Oxanium, cursive", fontWeight: 600 }}
            >
              LOGIN
            </Typography>
            <Box component="form" onSubmit={submitHandler} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="off"
                autoFocus
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
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="off"
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
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  mt: 3,
                  mb: 2,
                  fontFamily: "Oxanium, cursive",
                  fontWeight: 1000,
                  backgroundColor: "#854de0",
                  "&:hover": {
                    backgroundColor: "#6336ab",
                  },
                }}
              >
                Login
              </Button>
              <Grid container>
                <Grid item>
                  <Link
                    href="#"
                    variant="body2"
                    sx={{
                      fontFamily: "Oxanium, cursive",
                      fontWeight: 600,
                      color: "#854de0",
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
