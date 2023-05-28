import { Button, Paper, Box } from "@mui/material";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";

import { useSnackbar } from "notistack";
import { useStyles } from "./styles";
import httpRequest from "../../httpRequest";

const CreateOrganizationCard = (props) => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();

  const createOrganization = async (event) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);

    const name = data.get("name");
    const description = data.get("description");
    try {
      const resp = await httpRequest.post("http://localhost:5000/create_organization", {
        name,
        description,
      });
      const status = resp.status;
      if (status === 201) {
        enqueueSnackbar("Organization created successfully", { variant: "success" });
        props.onPageChange(0, "ORGANIZATIONS");
      }
    } catch (error) {
      if (error.response.status === 401) {
        enqueueSnackbar("User not logged in", { variant: "error" });
      }
      if (error.response.status === 400) {
        enqueueSnackbar("Name is required", { variant: "warning" });
      }
      enqueueSnackbar("Something went wrong", { variant: "error" });
    }
  };

  return (
    <>
      <Paper elevation={3} className={classes.card} sx={{ p: 2, borderRadius: 5 }}>
        <Typography variant="h5" sx={{ fontFamily: "Oxanium, cursive" }}>
          Create Organization
        </Typography>
        <br />
        <Box
          component="form"
          onSubmit={createOrganization}
          className={classes.textFields}
        >
          <TextField
            id="name"
            name="name"
            label="Organization name"
            variant="outlined"
            sx={{
              width: "100%",
              "& .MuiOutlinedInput-root": {
                "&.Mui-focused fieldset": {
                  borderColor: "#854de0",
                },
              },
              "& .MuiInputLabel-outlined.Mui-focused": {
                color: "#854de0",
              },
            }}
            size="small"
            required
          />
          <br />
          <TextField
            id="description"
            name="description"
            label="Description"
            variant="outlined"
            sx={{
              mt: 2,
              width: "100%",
              "& .MuiOutlinedInput-root": {
                "&.Mui-focused fieldset": {
                  borderColor: "#854de0",
                },
              },
              "& .MuiInputLabel-outlined.Mui-focused": {
                color: "#854de0",
              },
            }}
            multiline
            rows={4}
          />
          <br />
          <Button
            variant="contained"
            type="submit"
            sx={{
              fontFamily: "Oxanium, cursive",
              mt: 2,
              backgroundColor: "#854de0",
              "&:hover": {
                backgroundColor: "#6336ab",
              },
            }}
          >
            Create
          </Button>
        </Box>
      </Paper>
    </>
  );
};

export default CreateOrganizationCard;
