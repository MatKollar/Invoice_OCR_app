import SideMenu from "../SideMenu/SideMenu";
import Navbar from "../Navbar/Navbar";
import Tabbar from "../Tabbar/Tabbar";
import { useStyles } from "./styles";

const AppLayout = (props) => {
  const classes = useStyles();

  return (
    <div className={classes.pageWrapper}>
      <SideMenu />
      <div className={classes.contentWrapper}>
        <Navbar />
        {!props.tabbarDisabled && <Tabbar pageNumber={props.pageNumber} />}
        <div className={classes.content}>{props.children}</div>
      </div>
    </div>
  );
};

export default AppLayout;
