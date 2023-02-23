import { Button, Paper } from "@mui/material";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import { useStyles } from "./styles";

const CreateOrganizationCard = () => {
  const classes = useStyles();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const createOrganization = () => {
    console.log("Creating Organization with name", name, description);
  };

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  return (
    <>
      <Paper
        elevation={3}
        className={classes.card}
        sx={{ p: 2, borderRadius: 5 }}
      >
        <Typography variant="h5">Create Organization</Typography>
        <br />
        <div className={classes.textFields}>
          <TextField
            id="outlined-basic"
            label="Organization name"
            variant="outlined"
            sx={{ width: "100%" }}
            size="small"
            value={name}
            onChange={handleNameChange}
          />
          <br />
          <TextField
            id="outlined-basic"
            label="Description"
            variant="outlined"
            sx={{ mt: 2, width: "100%" }}
            multiline
            rows={4}
            value={description}
            onChange={handleDescriptionChange}
          />
        </div>
        <br />
        <Button variant="contained" onClick={createOrganization}>
          Create
        </Button>
      </Paper>
    </>
  );
};

export default CreateOrganizationCard;
