import Button from "@mui/material/Button";
import React, { useContext } from "react";
import AuthContext from "../../context/auth-context";

const HomePage = () => {
  const ctx = useContext(AuthContext);

  return (
    <>
      <div>Welcome back!</div>

      <Button variant="contained" sx={{ mt: 3, mb: 2 }} onClick={ctx.logout}>
        Log out
      </Button>
    </>
  );
};

export default HomePage;
