import { Paper, TextField } from "@mui/material";

function DataTable() {
  return (
    <Paper elevation={3} sx={{ p: 2, borderRadius: 5 }}>
      <TextField label="Name" sx={{ mb: 1 }} variant="standard" fullWidth />
      <TextField label="Address" sx={{ mb: 1 }} variant="standard" fullWidth />
      <TextField label="City" sx={{ mb: 1 }} variant="standard" fullWidth />
      <TextField label="IČO" sx={{ mb: 1 }} variant="standard" fullWidth />
      <TextField label="DIČ" sx={{ mb: 1 }} variant="standard" fullWidth />
      <TextField label="IČ DPH" sx={{ mb: 1 }} variant="standard" fullWidth />
    </Paper>
  );
}

export default DataTable;
