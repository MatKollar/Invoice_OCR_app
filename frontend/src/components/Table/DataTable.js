import { useState, useEffect } from "react";
import { Paper, TextField } from "@mui/material";
import { useStyles } from "./styles";

function DataTable(props) {
  const classes = useStyles();
  const { data, ico } = props;
  const [localData, setLocalData] = useState(data);

  useEffect(() => {
    setLocalData({ ...data, ICO: ico !== undefined ? ico : data.ICO });
  }, [data, ico]);

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
      className={classes.focused}
      fullWidth
      inputProps={{ style: { fontWeight: "bold" } }}
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
    </Paper>
  );
}

export default DataTable;
