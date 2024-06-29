import { Paper, Box } from "@mui/material";
import Typography from "@mui/material/Typography";

import { useSnackbar } from "notistack";
import { useStyles } from "./styles";
import ButtonContained from "../StyledComponents/ButtonContained";
import StyledTextField from "../StyledComponents/StyledTextField";
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
      const resp = await httpRequest.post(`${process.env.REACT_APP_BACKEND_URL}/create_organization`, {
        name,
        description,
      });
      const status = resp.status;
      if (status === 201) {
        enqueueSnackbar("Organization created successfully", { variant: "success" });
        props.onPageChange(0, "ORGANIZATIONS");
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        enqueueSnackbar("User not logged in", { variant: "error" });
      }
      if (error.response && error.response.status === 400) {
        enqueueSnackbar("Name is required", { variant: "warning" });
      }
      enqueueSnackbar("Something went wrong", { variant: "error" });
    }
  };

  return (
    <>
      <Paper elevation={3} className={classes.card} sx={{ p: 2, borderRadius: 5 }}>
        <Typography variant="h5">
          Create Organization
        </Typography>
        <br />
        <Box
          component="form"
          onSubmit={createOrganization}
          className={classes.textFields}
        >
          <StyledTextField
            id="name"
            name="name"
            label="Organization name"
            variant="outlined"
            style={{
              width: "100%",
            }}
            size="small"
            required
          />
          <br />
          <StyledTextField
            id="description"
            name="description"
            label="Description"
            variant="outlined"
            style={{
              marginTop: 20,
              width: "100%",
            }}
            multiline
            rows={4}
          />
          <br />
          <ButtonContained
            type="submit"
            style={{
              marginTop: 20,
            }}
          >
            Create
          </ButtonContained>
        </Box>
      </Paper>
    </>
  );
};

export default CreateOrganizationCard;
