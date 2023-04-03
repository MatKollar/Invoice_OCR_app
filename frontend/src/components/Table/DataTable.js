import { Paper, TextField } from "@mui/material";
import { useState, useEffect } from "react";

function DataTable(props) {
  const { data } = props;
  const [localData, setLocalData] = useState(data);

  useEffect(() => {
    setLocalData(data);
  }, [data]);

  const handleChange = (event, field) => {
    const newData = { ...localData, [field]: event.target.value };
    setLocalData(newData);
    props.onDataChange(newData);
  };

  const renderTextField = (field, label) => (
    <TextField
      label={label}
      value={localData[field] || ""}
      onChange={(event) => handleChange(event, field)}
      sx={{ mb: 1 }}
      variant="standard"
      fullWidth
    />
  );

  return (
    <Paper elevation={3} sx={{ p: 2, borderRadius: 5 }}>
      {renderTextField("Name", "Name")}
      {renderTextField("Street", "Address")}
      {renderTextField("City", "City")}
      {renderTextField("PSC", "PSC")}
      {renderTextField("ICO", "IČO")}
      {renderTextField("DIC", "DIČ")}
      {renderTextField("IC_DPH", "IČ DPH")}
    </Paper>
  );
}

export default DataTable;
