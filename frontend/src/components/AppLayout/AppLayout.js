import SideMenu from "../SideMenu/SideMenu";
import Navbar from "../Navbar/Navbar";
import { useStyles } from "./styles";

const AppLayout = (props) => {
  const classes = useStyles();

  return (
    <div className={classes.pageWrapper}>
      <SideMenu />
      <div className={classes.contentWrapper}>
        <Navbar userName={props.userName}/>
        {props.children}
      </div>
    </div>
  );
};

export default AppLayout;
