import { Paper, Grid } from "@mui/material";
import { useStyles } from "./styles";

const InvoiceCard = (props) => {
  const classes = useStyles();

  return (
    <>
      <Paper
        elevation={3}
        className={classes.card}
        sx={{ p: 2, borderRadius: 5 }}
      >
        {props.data}
      </Paper>
    </>
  );
};

export default InvoiceCard;
