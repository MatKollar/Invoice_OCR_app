import { Paper, TextField } from "@mui/material";

function DataTable(props) {
  const { data } = props;

  return (
    <Paper elevation={3} sx={{ p: 2, borderRadius: 5 }}>
      <TextField
        label="Name"
        defaultValue={data ? data.Name : ""}
        sx={{ mb: 1 }}
        variant="standard"
        fullWidth
      />
      <TextField
        label="Address"
        defaultValue={data ? data.Street : ""}
        sx={{ mb: 1 }}
        variant="standard"
        fullWidth
      />
      <TextField
        label="City"
        defaultValue={data ? data.PSC + " " + data.City : ""}
        sx={{ mb: 1 }}
        variant="standard"
        fullWidth
      />
      <TextField
        label="IČO"
        defaultValue={data ? data.ICO : ""}
        sx={{ mb: 1 }}
        variant="standard"
        fullWidth
      />
      <TextField
        label="DIČ"
        defaultValue={data ? data.DIC : ""}
        sx={{ mb: 1 }}
        variant="standard"
        fullWidth
      />
      <TextField
        label="IČ DPH"
        defaultValue={data ? "SK" + data.DIC : ""}
        sx={{ mb: 1 }}
        variant="standard"
        fullWidth
      />
    </Paper>
  );
}

export default DataTable;
