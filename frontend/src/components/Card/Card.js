import { Paper, Typography } from "@mui/material";
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
        <Typography variant="h6" sx={{ mt: 2 }}>
          {props.data}
        </Typography>
      </Paper>
    </>
  );
};

export default Card;
