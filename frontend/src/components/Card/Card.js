import { Paper } from "@mui/material";
import { useStyles } from "./styles";

const Card = (props) => {
  const classes = useStyles();

  return (
    <>
      <Paper
        elevation={3}
        className={classes.card}
        sx={{ p: 2, borderRadius: 5, textAlign: "center" }}
      >
        {props.data}
      </Paper>
    </>
  );
};

export default Card;
