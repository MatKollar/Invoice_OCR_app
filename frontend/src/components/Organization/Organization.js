import { useStyles } from "./styles";

const Organization = (props) => {
  const classes = useStyles();
  const orgData = props.dataFromDB;

  return (
    <div className={classes.rootContainer}>
      <h1>{orgData.name}</h1>
      <h3>INVITE CODE: {orgData.invite_code}</h3>;
    </div>
  );
};

export default Organization;
