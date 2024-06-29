import { Link } from "react-router-dom";
import { Tooltip, Typography } from "@mui/material";
import { useStyles } from "./styles";

const LinkItem = ({ to, Icon, text }) => {
  const classes = useStyles();
  return (
    <div className={classes.linkItem}>
      <Link to={to} className={classes.link}>
        <Tooltip title={text} placement="right">
          <Typography variant="body1" className={classes.link}>
            <Icon className={classes.linkIcon} />
            <span className={classes.mobileHide}>{text}</span>
          </Typography>
        </Tooltip>
      </Link>
    </div>
  );
};

export default LinkItem;
